import { SenderInfo } from "@prisma/client";

export class CreateChatDto {
    readonly partisipant: SenderInfo
}
