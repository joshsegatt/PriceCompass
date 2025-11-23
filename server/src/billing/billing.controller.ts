import { Controller, Post, UseGuards, Req, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create-checkout-session')
  async createCheckout(@Req() req: any) {
    const sessionId = await this.billingService.createCheckoutSession(req.user.id);
    return { sessionId };
  }

  @Post('webhook')
  async webhook(@Req() req: any, @Headers('stripe-signature') signature: string) {
    const raw = (req as any).rawBody as Buffer;
    return this.billingService.handleWebhook(raw, signature);
  }
}
