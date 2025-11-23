import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  private userToPublic(user: any) {
    return {
      id: user.id,
      email: user.email,
      isPremium: user.isPremium || false,
      stripeCustomerId: user.stripeCustomerId || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({ data: { email: dto.email, password: hash } });
    const token = this.jwtService.sign({ sub: user.id, email: user.email }, { secret: process.env.JWT_SECRET || 'secret', expiresIn: process.env.JWT_EXPIRATION || '3600s' });
    return { user: this.userToPublic(user), token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({ sub: user.id, email: user.email }, { secret: process.env.JWT_SECRET || 'secret', expiresIn: process.env.JWT_EXPIRATION || '3600s' });
    return { user: this.userToPublic(user), token };
  }

  async handleGoogleOAuth(code: string) {
    const { OAuth2Client } = await import('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    const ticket = await client.verifyIdToken({ idToken: tokens.id_token!, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) throw new UnauthorizedException('Unable to retrieve Google profile');
    let user = await this.prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      user = await this.prisma.user.create({ data: { email: payload.email, password: '' } });
    }
    const token = this.jwtService.sign({ sub: user.id, email: user.email }, { secret: process.env.JWT_SECRET || 'secret', expiresIn: process.env.JWT_EXPIRATION || '3600s' });
    return { user: this.userToPublic(user), token };
  }
}
