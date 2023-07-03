import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { PrismaModule } from './prisma/prisma.module';
import { ChatsModule } from './chats/chats.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, ChatsModule, HttpModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
