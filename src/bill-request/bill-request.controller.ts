import { BadRequestException, Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { BillRequestService } from './bill-request.service';
import { Guards } from '../helpers/guards';
import { RequestUser } from '../user/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { BillRequestValidator } from './bill-request.validator';
import { OK } from '../helpers/text';

@ApiUseTags('bill-request')
@Controller('bill-request')
export class BillRequestController {
  constructor(
    private readonly billRequestService: BillRequestService,
    private readonly billRequestValidator: BillRequestValidator,
  ) {
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Delete(':billRequestId')
  @ApiOperation({ title: 'Удаление запроса на получение чека из ФНС' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  async deleteBillRequest(@RequestUser() user: UserEntity, @Param('billRequestId') billRequestId: string) {
    const validationResult = await this.billRequestValidator.isBillRequestExistToUser({ userId: user.id, billRequestId });
    if (validationResult) {
      throw new BadRequestException({ push: validationResult });
    }
    await this.billRequestService.deleteBillRequestById(billRequestId);
    return OK;
  }
}
