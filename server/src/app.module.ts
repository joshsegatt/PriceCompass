import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BillsModule } from './bills/bills.module';
import { SavingsModule } from './savings/savings.module';
import { BillingModule } from './billing/billing.module';
import { IntegrationsModule } from './integrations/integrations.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api/(.*)'],
    }),
    AuthModule,
    UsersModule,
    BillsModule,
    SavingsModule,
    BillingModule,
    IntegrationsModule,
  ],
  providers: [PrismaService],
})
export class AppModule { }
