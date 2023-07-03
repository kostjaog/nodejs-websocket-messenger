-- CreateTable
CREATE TABLE "SenderInfo" (
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profilePhotoUrl" TEXT NOT NULL,
    "listenerId" TEXT,

    CONSTRAINT "SenderInfo_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "chatId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "readedBy" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatToSenderInfo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SenderInfo_email_key" ON "SenderInfo"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatToSenderInfo_AB_unique" ON "_ChatToSenderInfo"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatToSenderInfo_B_index" ON "_ChatToSenderInfo"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "SenderInfo"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToSenderInfo" ADD CONSTRAINT "_ChatToSenderInfo_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToSenderInfo" ADD CONSTRAINT "_ChatToSenderInfo_B_fkey" FOREIGN KEY ("B") REFERENCES "SenderInfo"("email") ON DELETE CASCADE ON UPDATE CASCADE;
