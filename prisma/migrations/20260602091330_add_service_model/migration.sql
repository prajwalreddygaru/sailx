-- AlterTable
ALTER TABLE "Consultation" ADD COLUMN     "service" TEXT;

-- AlterTable
ALTER TABLE "SocialConfig" ADD COLUMN     "youtubeAltVideoUrl" TEXT;

-- CreateTable
CREATE TABLE "EventMemoryDay" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" TEXT,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventMemoryDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short" TEXT,
    "description" TEXT,
    "icon" TEXT NOT NULL DEFAULT 'Package',
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventMemoryDay_eventId_dayNumber_key" ON "EventMemoryDay"("eventId", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- AddForeignKey
ALTER TABLE "EventMemoryDay" ADD CONSTRAINT "EventMemoryDay_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
