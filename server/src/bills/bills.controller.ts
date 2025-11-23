import { Controller, UseGuards, Req, Post, Body, UsePipes, ValidationPipe, Put, Param, Delete, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@Controller('bills')
export class BillsController {
  constructor(private billsService: BillsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Req() req: any, @Body() dto: CreateBillDto) {
    const created = await this.billsService.create(req.user.id, dto);
    return created;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateBillDto) {
    return this.billsService.update(req.user.id, id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(204)
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.billsService.remove(req.user.id, id);
    return null;
  }
}
