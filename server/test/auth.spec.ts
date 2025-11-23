import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { PrismaService } from '../src/prisma.service';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('Auth Module (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const dbFile = path.join(__dirname, '..', 'test.db');

  beforeAll(async () => {
    // Setup ephemeral sqlite DB for tests
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = `file:${dbFile}`;
    process.env.PRISMA_PROVIDER = 'sqlite';
    process.env.JWT_SECRET = 'test-secret';

    // Ensure old test DB removed
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
      try { fs.writeFileSync(genMarker, 'ok'); } catch (e) { /* ignore */ }
    }

    const moduleRef = await Test.createTestingModule({
      imports: [
        AuthModule,
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
    } catch (e) {
      /* ignore */
    }
    try {
      if (prisma) await prisma.$disconnect();
    } catch (e) {
      /* ignore */
    }
    // Remove test DB with retry to avoid Windows EBUSY
    for (let i = 0; i < 5; i++) {
      try {
        if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile);
        break;
      } catch (err) {
        await new Promise((r) => setTimeout(r, 100));
      }
    }
    // Restore original prisma schema if backup exists
    const realSchema = path.join(__dirname, '..', 'prisma', 'schema.prisma');
    const backupSchema = path.join(__dirname, '..', 'prisma', 'schema.prisma.bak');
    if (fs.existsSync(backupSchema)) {
      try {
        fs.copyFileSync(backupSchema, realSchema);
        fs.unlinkSync(backupSchema);
      } catch (e) {
        /* ignore */
      }
    }
  });

  it('registers a new user (POST /auth/register)', async () => {
    const res = await request(app.getHttpServer()).post('/auth/register').send({ email: 'a@b.com', password: 'secret1' }).expect(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('a@b.com');
  });

  it('fails to register duplicate email (409)', async () => {
    // Create user directly in DB
    await prisma.user.create({ data: { email: 'dup@x.com', password: 'x' } });
    await request(app.getHttpServer()).post('/auth/register').send({ email: 'dup@x.com', password: 'secret' }).expect(409);
  });

  it('logs in with correct credentials (POST /auth/login)', async () => {
    const hashed = await (await import('bcrypt')).hash('pw123', 10);
    await prisma.user.create({ data: { email: 'login@test.com', password: hashed } });
    const res = await request(app.getHttpServer()).post('/auth/login').send({ email: 'login@test.com', password: 'pw123' }).expect(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('login@test.com');
  });

  it('fails login with wrong password (401)', async () => {
    const hashed = await (await import('bcrypt')).hash('pw321', 10);
    await prisma.user.create({ data: { email: 'wrong@test.com', password: hashed } });
    await request(app.getHttpServer()).post('/auth/login').send({ email: 'wrong@test.com', password: 'bad' }).expect(401);
  });
});
