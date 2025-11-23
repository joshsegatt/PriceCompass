import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import * as request from 'supertest';
import { BillsModule } from '../src/bills/bills.module';
import { PrismaService } from '../src/prisma.service';
import * as jwt from 'jsonwebtoken';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('Bills Module (CRUD & Ownership)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
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

    const moduleRef = await Test.createTestingModule({
      imports: [
        BillsModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '1h' } }),
      ],
      providers: [JwtStrategy, PrismaService],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    app = moduleRef.createNestApplication();
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

  it('performs full CRUD lifecycle and enforces ownership', async () => {
    // create two users
    const userA = await prisma.user.create({ data: { email: 'a@b.com', password: 'x' } });
    const userB = await prisma.user.create({ data: { email: 'b@c.com', password: 'x' } });
    const tokenA = jwt.sign({ sub: userA.id, email: userA.email }, 'test-secret', { expiresIn: '1h' });

    // Create bill
    const createRes = await request(app.getHttpServer())
      .post('/bills')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ category: 'Utilities', provider: 'EE', name: 'Phone', monthlyCost: 30, dueDate: new Date().toISOString() })
      .expect(201);
    const bill = createRes.body;
    expect(bill).toBeDefined();
    expect(bill.userId).toBe(userA.id);

    // Update bill (owner)
    const updateRes = await request(app.getHttpServer())
      .put(`/bills/${bill.id}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'Phone Updated' })
      .expect(200);
    expect(updateRes.body.name).toBe('Phone Updated');

    // Attempt update by other user
    const tokenB = jwt.sign({ sub: userB.id, email: userB.email }, 'test-secret', { expiresIn: '1h' });
    await request(app.getHttpServer())
      .put(`/bills/${bill.id}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ name: 'Hacked' })
      .expect(403);

    // Delete bill
    await request(app.getHttpServer())
      .delete(`/bills/${bill.id}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(204);
  });
});
