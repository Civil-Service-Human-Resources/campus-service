import { Controller, Get, Param } from '@nestjs/common';
import { CslService } from './csl.service';

@Controller('learning_materials/csl')
export class CslController {
  constructor(private readonly service: CslService) {}

  @Get('/:materialId')
  async getLearningMaterialBySupplierAndId(
    @Param('materialId') materialId: string,
  ) {
    return this.service.getCourse(materialId);
  }
}
