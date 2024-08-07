import { Injectable } from '@nestjs/common';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import * as AWS from 'aws-sdk';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { ProductImage } from './entities/product-image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { SearchService } from 'src/search/search.service';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    private readonly searchService: SearchService,
  ) {}
  remove(id: number) {
    return `This action removes a #${id} productImage`;
  }

  async resizeAndUpload(
    file: Express.Multer.File,
    sizes: { w: number; h: number; type: string }[],
    productId: number,
  ) {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    const fileKey = `${Date.now()}-${file.originalname}`;
    const awsHost = `https://${process.env.AWS_IMAGE_BUCKET}.s3.amazonaws.com/images/`;

    const uploadPromises = sizes.map(async (size) => {
      const resizedImage = await sharp(file.buffer)
        .resize(size.w, size.h)
        .toBuffer();

      await s3
        .upload({
          Bucket: process.env.AWS_IMAGE_BUCKET,
          Key: `images/${size.type}/${fileKey}`, // Upload to a specific folder based on size
          Body: resizedImage,
          ACL: 'public-read',
          ContentType: 'image/jpeg', // Adjust according to your image type
        })
        .promise();

      return `${awsHost}${size.type}/${fileKey}`;
    });

    await Promise.all(uploadPromises);

    const product = await this.productRepository.findOneBy({ id: productId });

    const imgData = new ProductImage();
    imgData.thumbnail = `${awsHost}thumbnail/${fileKey}`;
    imgData.small = `${awsHost}small/${fileKey}`;
    imgData.medium = `${awsHost}medium/${fileKey}`;
    imgData.product = product;

    const newData = this.productImageRepository.create(imgData);
    await this.productImageRepository.save(newData);
    const productDetail = await this.productRepository.findOne({
      where: {
        id: productId,
      },
      relations: ['images', 'categories', 'genders'],
    });
    const jsonData = JSON.parse(JSON.stringify(productDetail));
    await this.searchService.updateProduct(jsonData, productId);
    return productDetail;
  }
}
