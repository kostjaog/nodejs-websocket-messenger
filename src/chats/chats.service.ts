import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SenderInfo } from '@prisma/client';

@Injectable()
export class ChatsService {
  constructor (private readonly prisma: PrismaService) {}

  async create(createChatDto: SenderInfo) {
    return this.prisma.chat.create({
      data: {
        participants: {
          connectOrCreate: {
            where: {
              email: createChatDto.email
            },
            create: createChatDto
          }
        }
      }
    });
  }

  async addDeviceToken(participantEmail: string, token: string) {
    const candidate = await this.prisma.senderInfo.findUnique({
      where: {
        email: participantEmail
      }
    })

    if (!candidate) {
      throw new Error('Sender with provided email doest not exist.')
    }

    candidate.deviceTokens.push(token)

    return this.prisma.senderInfo.update({
      where: {
        email: participantEmail
      },
      data: {
        deviceTokens: [...new Set(candidate.deviceTokens)]
      }
    })
  }

  async joinChat (participant: SenderInfo, chatId: string) {
    await this.prisma.chat.update({
      where: {
        id: chatId
      },
      data: {
        participants: {
          connectOrCreate: {
            where: {
              email: participant.email
            },
            create: participant
          }
        }
      }
    })
  }

  findAll() {
    return this.prisma.chat.findMany({
      include: {
        messages: true, 
        participants: true
      }
    });
  }

  async readMessage(messageId: string, participantEmail: string) {
    const candidate = await this.prisma.message.findUnique({
      where: {
        id: messageId
      }
    })

    if (!candidate) {
      throw new Error('Message with provided id does not exist.')
    }

    return this.prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        readBy: candidate.readBy.concat(participantEmail)
      }
    })
  }

  findOne(id: string) {
    return this.prisma.chat.findUnique({
      where: {
        id
      },
      include: {
        messages: true,
        participants: true
      }
    });
  }
}
