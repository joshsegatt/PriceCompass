import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { PrismaService } from '../src/prisma.service';
import * as jwt from 'jsonwebtoken';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('User Module (auth protection)', () => {
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
        UsersModule,
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

  it('GET /user/me without token returns 401', async () => {
    await request(app.getHttpServer()).get('/user/me').expect(401);
  });

  it('GET /user/me with valid token returns user data', async () => {
    const created = await prisma.user.create({ data: { email: 'me@test.com', password: 'x' } });
    const token = jwt.sign({ sub: created.id, email: created.email }, 'test-secret', { expiresIn: '1h' });
    const res = await request(app.getHttpServer()).get('/user/me').set('Authorization', `Bearer ${token}`).expect(200);
    expect(res.body.email).toBe('me@test.com');
    expect(res.body.trackedBills).toBeDefined();
    expect(res.body.savingsGoals).toBeDefined();
  });
});
