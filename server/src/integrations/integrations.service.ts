import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

@Injectable()
export class IntegrationsService {
  private client: PlaidApi;

  constructor(private prisma: PrismaService) {
    const config = new Configuration({
      basePath: (process.env.PLAID_ENV === 'sandbox' ? PlaidEnvironments.sandbox : PlaidEnvironments.production),
      baseOptions: { headers: { 'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '', 'PLAID-SECRET': process.env.PLAID_SECRET || '' } },
    });
    this.client = new PlaidApi(config);
  }

  async createLinkToken(userId: string) {
    // Plaid SDK types can be strict; cast arrays to any to avoid type mismatch
    const res = await this.client.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: 'Price Compass',
      products: ['transactions'] as any,
      country_codes: ['GB'] as any,
      language: 'en',
    } as any);
    return res.data.link_token;
  }

  async exchangePublicToken(userId: string, public_token: string) {
    const res = await this.client.itemPublicTokenExchange({ public_token });
    const { access_token, item_id } = res.data;
    await this.prisma.plaidAccount.create({ data: { userId, accessToken: access_token, } });
    return { success: true };
  }

  async syncTransactions(userId: string) {
    const accounts = await this.prisma.plaidAccount.findMany({ where: { userId } });
    if (!accounts.length) throw new BadRequestException('No Plaid accounts linked');

    const results: any[] = [];
    for (const acct of accounts) {
      const now = new Date();
      const end = now.toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      const start = startDate.toISOString().split('T')[0];

      const resp = await this.client.transactionsGet({
        access_token: acct.accessToken,
        start_date: start,
        end_date: end,
        options: { count: 500, offset: 0 },
      });

      const transactions = resp.data.transactions || [];

      const byMerchant: Record<string, any[]> = {};
      for (const t of transactions) {
        const key = (t.merchant_name || t.name || 'unknown').toLowerCase();
        if (!byMerchant[key]) byMerchant[key] = [];
        byMerchant[key].push(t);
      }

      for (const key of Object.keys(byMerchant)) {
        const group = byMerchant[key];
        if (group.length >= 2) {
          const sum = group.reduce((s, x) => s + (x.amount || 0), 0);
          const avg = sum / group.length;
          const sample = group[0];
          const bill = await this.prisma.trackedBill.create({ data: {
            userId,
            category: 'Unknown',
            provider: sample.merchant_name || (sample.name || 'Provider'),
            name: sample.name || (sample.merchant_name || 'Recurring'),
            monthlyCost: avg.toFixed(2),
            dueDate: new Date().toISOString(),
            status: 'Upcoming',
            source: 'Plaid',
          }});
          results.push(bill);
        }
      }
    }
    return { created: results.length, bills: results };
  }
}
