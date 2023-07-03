import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PrismaService } from './prisma/prisma.service';
import { getSignedUrl } from './integrations/yandex.bucket';
import axios from 'axios';
import { SendMessages } from './integrations/firebase';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly prisma: PrismaService) {}

  @WebSocketServer() server: Server;

  async sendMessageHttp(
    payload: { from: string; to: string; message: string },
    image?: Express.Multer.File,
  ) {
    const chatData = await this.prisma.chat.findUnique({
      where: {
        id: payload.to,
      },
      include: {
        participants: true,
      },
    });

    const tokens = chatData.participants
      .map((participant) => {
        return participant.deviceTokens;
      })
      .flat();
    SendMessages({
      deviceTokens: tokens,
      notification: {
        title: 'У вас новое сообщение от технической поддержки',
        body: 'Проверьте чат в приложении AlyansAuto',
      },
    });
    chatData.participants.map((participant) => {
      if (participant.email !== payload.from) {
        this.server
          .to(participant.listenerId)
          .emit('recMessage', payload.message);
      }
    });
    if (image) {
      const signedURL = await getSignedUrl({
        fileName: image.originalname,
        type: image.mimetype,
      });
      await axios.put(signedURL.signedURL, image.buffer, {
        withCredentials: true,
        headers: { 'Content-Type': 'image/jpeg' },
      });

      await this.prisma.message.create({
        data: {
          text: payload.message,
          chat: {
            connect: {
              id: payload.to,
            },
          },
          mediaUrl: signedURL.objectURL,
          sender: {
            connect: {
              email: payload.from,
            },
          },
        },
      });
      return 'Sent';
    }
    await this.prisma.message.create({
      data: {
        text: payload.message,
        chat: {
          connect: {
            id: payload.to,
          },
        },
        sender: {
          connect: {
            email: payload.from,
          },
        },
      },
    });
    return 'Sent';
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: { from: string; to: string; message: string },
  ): Promise<void> {
    const chatData = await this.prisma.chat.findUnique({
      where: {
        id: payload.to,
      },
      include: {
        participants: true,
      },
    });
    chatData.participants.map((participant) => {
      if (participant.email !== payload.from) {
        this.server
          .to(participant.listenerId)
          .emit('recMessage', payload.message);
      }
    });
    const tokens = chatData.participants
      .map((participant) => {
        return participant.deviceTokens;
      })
      .flat();
    SendMessages({
      deviceTokens: tokens,
      notification: {
        title: 'У вас новое сообщение от технической поддержки',
        body: 'Проверьте чат в приложении AlyansAuto',
      },
    });
  }

  afterInit(server: Server) {
    console.log('Websocket initialized');
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const candidate = await this.prisma.senderInfo.findUnique({
      where: {
        email: client.handshake.query.email as string,
      },
    });

    if (!candidate) {
      await this.prisma.senderInfo.create({
        data: {
          email: client.handshake.query.email as string,
          name: client.handshake.query.name as string,
          profilePhotoUrl: client.handshake.query.profileUrl as string,
        },
      });
    }

    await this.prisma.senderInfo.update({
      where: {
        email: client.handshake.query.email as string,
      },
      data: {
        listenerId: client.id,
      },
    });

    console.log(`Connected ${client.id}`);
  }
}
