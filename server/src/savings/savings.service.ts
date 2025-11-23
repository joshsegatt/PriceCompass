import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SavingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.savingsGoal.create({ data: { ...data, userId } });
  }

  async findAll(userId: string) {
    return this.prisma.savingsGoal.findMany({ where: { userId } });
  }

  async findOne(userId: string, id: string) {
    const sg = await this.prisma.savingsGoal.findUnique({ where: { id } });
    if (!sg) throw new NotFoundException('SavingsGoal not found');
    if (sg.userId !== userId) throw new ForbiddenException('Not allowed');
    return sg;
  }

  async update(userId: string, id: string, data: any) {
    const sg = await this.prisma.savingsGoal.findUnique({ where: { id } });
    if (!sg) throw new NotFoundException('SavingsGoal not found');
    if (sg.userId !== userId) throw new ForbiddenException('Not allowed');
    return this.prisma.savingsGoal.update({ where: { id }, data });
  }

  async remove(userId: string, id: string) {
    const sg = await this.prisma.savingsGoal.findUnique({ where: { id } });
    if (!sg) throw new NotFoundException('SavingsGoal not found');
    if (sg.userId !== userId) throw new ForbiddenException('Not allowed');
    await this.prisma.savingsGoal.delete({ where: { id } });
    return;
  }
}
