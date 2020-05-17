import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '~/bill/entities/bill.entity';
import { BillDto } from '~/bill/dto/bill.dto';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private readonly billEntityRepository: Repository<Bill>,
  ) {
  }

  async getUserBills(userId: string) {
    return this.billEntityRepository.find({
      where: { userId },
      order: { billDate: 'DESC' },
    });
  }

  async createBillForUser({ billDto, shopId, userId }: { billDto: BillDto, shopId: string, userId: string }) {
    const bill = new Bill();
    bill.billDate = billDto.billDate;
    bill.comment = billDto.comment;
    bill.shopId = shopId;
    bill.totalSum = billDto.totalSum;
    bill.userId = userId;
    return this.billEntityRepository.save(bill);
  }

  async getBillById(id: string) {
    return this.billEntityRepository.findOne(id);
  }

  async editBill({ billDto, billEntity }: { billDto: BillDto, billEntity: Bill }) {
    billEntity.totalSum = billDto.totalSum;
    billEntity.comment = billDto.comment;
    billEntity.billDate = billDto.billDate;
    billEntity.shopId = billDto.shop.id;
    return this.billEntityRepository.save(billEntity);
  }

  async deleteBill(id: string): Promise<void> {
    await this.billEntityRepository.delete({ id });
  }
}
