import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LearningMaterial } from '../models/LearningMaterial';
import { CslService } from './csl.service';

@ApiTags('LearningMaterials')
@Controller('learning_materials/csl')
export class CslController {
  constructor(private readonly service: CslService) {}

  @Get('/:materialId')
  @ApiOkResponse({
    description: 'Learning material successfully fetched.',
    type: LearningMaterial,
  })
  async getLearningMaterialBySupplierAndId(
    @Param('materialId') materialId: string,
  ): Promise<LearningMaterial> {
    const course = this.service.getCourse(materialId);
    if (!course) {
      throw new NotFoundException(
        `CSL course with ID ${materialId} was not found`,
      );
    }
    return course;
  }
}
