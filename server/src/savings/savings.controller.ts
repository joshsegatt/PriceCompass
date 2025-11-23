import { Controller, UseGuards, Req, Post, Body, UsePipes, ValidationPipe, Get, Param, Put, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SavingsService } from './savings.service';
import { CreateSavingsDto } from './dto/create-savings.dto';
import { UpdateSavingsDto } from './dto/update-savings.dto';

@Controller('savings')
export class SavingsController {
  constructor(private savingsService: SavingsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Req() req: any, @Body() dto: CreateSavingsDto) {
    return this.savingsService.create(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async list(@Req() req: any) {
    return this.savingsService.findAll(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async get(@Req() req: any, @Param('id') id: string) {
    return this.savingsService.findOne(req.user.id, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateSavingsDto) {
    return this.savingsService.update(req.user.id, id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.savingsService.remove(req.user.id, id);
    return null;
  }
}
