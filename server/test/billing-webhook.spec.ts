import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import * as request from 'supertest';
import { BillingModule } from '../src/billing/billing.module';
import { PrismaService } from '../src/prisma.service';
import * as bodyParser from 'body-parser';
import Stripe from 'stripe';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('Billing Webhook (Stripe mocked)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let moduleRef: any;
  const dbFile = path.join(__dirname, '..', 'test.db');

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = `file:${dbFile}`;
    process.env.PRISMA_PROVIDER = 'sqlite';
    process.env.JWT_SECRET = 'test-secret';
    if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile);
    // Swap in test schema, push to sqlite and generate client for tests
    const realSchema = path.join(__dirname, '..', 'prisma', 'schema.prisma');
    const testSchema = path.join(__dirname, '..', 'prisma', 'schema.test.prisma');
    const backupSchema = path.join(__dirname, '..', 'prisma', 'schema.prisma.bak');
    if (fs.existsSync(realSchema)) fs.copyFileSync(realSchema, backupSchema);
    fs.copyFileSync(testSchema, realSchema);
    execSync('npx prisma db push --schema=prisma/schema.prisma', { stdio: 'inherit', env: process.env });
    const genMarker = path.join(__dirname, '..', 'prisma', '.client_generated');
    if (!fs.existsSync(genMarker)) {
      execSync('npx prisma generate --schema=prisma/schema.prisma', { stdio: 'inherit', env: process.env });
      try { fs.writeFileSync(genMarker, 'ok'); } catch (e) {}
    }

    moduleRef = await Test.createTestingModule({
      imports: [
        BillingModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '1h' } }),
      ],
      providers: [JwtStrategy, PrismaService],
    }).compile();
    prisma = moduleRef.get(PrismaService);
    app = moduleRef.createNestApplication();
    app.use(bodyParser.json({ verify: (req: any, res, buf) => { req.rawBody = buf; } }));
    await app.init();
  });

  afterAll(async () => {
    try {
      if (app) await app.close();
    } catch (e) {}
    try {
      if (prisma) await prisma.$disconnect();
    } catch (e) {}
    for (let i = 0; i < 5; i++) {
      try {
        if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile);
        break;
      } catch (err) {
        await new Promise((r) => setTimeout(r, 100));
      }
    }
    const realSchema = path.join(__dirname, '..', 'prisma', 'schema.prisma');
    const backupSchema = path.join(__dirname, '..', 'prisma', 'schema.prisma.bak');
    if (fs.existsSync(backupSchema)) {
      try {
        fs.copyFileSync(backupSchema, realSchema);
        fs.unlinkSync(backupSchema);
      } catch (e) {}
    }
  });

  it('processes checkout.session.completed and updates user to premium', async () => {
    const created = await prisma.user.create({ data: { email: 'stripe@u.com', password: 'x', isPremium: false } });

    // Prepare fake Stripe event
    const fakeEvent = {
      type: 'checkout.session.completed',
      data: { object: { metadata: { userId: created.id } } },
    } as any;

    // Mock stripe.webhooks.constructEvent to return the fakeEvent regardless of input
    const { BillingService } = await import('../src/billing/billing.service');
    const billingService = moduleRef.get(BillingService) as any;
    if (billingService && billingService.stripe && billingService.stripe.webhooks) {
      jest.spyOn(billingService.stripe.webhooks, 'constructEvent' as any).mockImplementation((raw: Buffer, sig: string, secret: string) => {
        return fakeEvent;
      });
    } else {
      // As a fallback, mock Stripe's prototype (covers cases where instance not accessible)
      jest.spyOn(Stripe.prototype as any, 'webhooks', 'get' as any).mockImplementation(() => ({ constructEvent: () => fakeEvent }));
    }

    const rawBody = JSON.stringify({ id: 'evt_test', type: 'checkout.session.completed' });

    await request(app.getHttpServer())
      .post('/billing/webhook')
      .set('stripe-signature', 't=12345,v1=signature')
      .set('Content-Type', 'application/json')
      .send(rawBody)
      .expect(201);

    const userAfter = await prisma.user.findUnique({ where: { id: created.id } });
    expect(userAfter.isPremium).toBe(true);
  });
});
