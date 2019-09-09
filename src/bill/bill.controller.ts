import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('bill')
@Controller('bill')
export class BillController {

}
