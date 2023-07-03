import { Controller, Body, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly gateway: AppGateway) {}
  
  @UseInterceptors(FileInterceptor('image'))
  @Post('/sendMessage')
  async sendMessage(@Body() payload: {from: string, to: string, message: string}, @UploadedFile() image?: Express.Multer.File) {
    return this.gateway.sendMessageHttp(payload, image);
  }
}

