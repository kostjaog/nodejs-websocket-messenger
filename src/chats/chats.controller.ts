import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { SenderInfo } from '@prisma/client';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  create(@Body() createChatDto: SenderInfo) {
    return this.chatsService.create(createChatDto);
  }

  @Get()
  findAll() {
    return this.chatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(id);
  }

  @Post('/join')
  joinChat(@Body() bodyData: {participant: SenderInfo, chatId: string}) {
    return this.chatsService.joinChat(bodyData.participant, bodyData.chatId)
  }

  @Post('/read')
  readMessage(@Body() body: { participantEmail: string, messageId: string}) {
    return this.chatsService.readMessage(body.messageId, body.participantEmail)
  }

  @Post('/addToken')
  addToken(@Body() body: { participantEmail: string, deviceToken: string}) {
    return this.addToken(body);
  }
}
