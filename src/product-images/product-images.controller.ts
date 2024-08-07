import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('product-images')
@ApiTags('product-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Post('upload/:productId')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' }) // Define API response
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('productId') productId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Define your desired sizes
    const sizes = [
      { w: 60, h: 60, type: 'thumbnail' },
      { w: 450, h: 300, type: 'small' },
      { w: 700, h: 600, type: 'medium' },
    ];
    return await this.productImagesService.resizeAndUpload(
      file,
      sizes,
      productId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productImagesService.remove(+id);
  }
}
