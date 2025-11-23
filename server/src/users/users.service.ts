import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private mapUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      isPremium: user.isPremium,
      stripeCustomerId: user.stripeCustomerId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      trackedBills: user.trackedBills || [],
      savingsGoals: user.savingsGoals || [],
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { trackedBills: true, savingsGoals: true },
    });
    if (!user) return null;

    const now = new Date();
    const updates = [];
    for (const bill of user.trackedBills) {
      const due = new Date(bill.dueDate);
      if (bill.status !== 'Paid' && due < now && bill.status !== 'Overdue') {
        updates.push(this.prisma.trackedBill.update({ where: { id: bill.id }, data: { status: 'Overdue' } }));
      }
    }
    if (updates.length) await this.prisma.$transaction(updates);

    const refreshed = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { trackedBills: true, savingsGoals: true },
    });
    return this.mapUser(refreshed);
  }
}
