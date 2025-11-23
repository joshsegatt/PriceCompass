import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IntegrationsService } from './integrations.service';

@Controller('integrations/plaid')
export class IntegrationsController {
  constructor(private integrationsService: IntegrationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create-link-token')
  async createLinkToken(@Req() req: any) {
    const token = await this.integrationsService.createLinkToken(req.user.id);
    return { link_token: token };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('exchange-public-token')
  async exchange(@Req() req: any, @Body() body: { public_token: string }) {
    await this.integrationsService.exchangePublicToken(req.user.id, body.public_token);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sync-transactions')
  async sync(@Req() req: any) {
    return this.integrationsService.syncTransactions(req.user.id);
  }
}
