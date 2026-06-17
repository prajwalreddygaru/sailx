-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('BUSINESS_TOUR', 'TRADE_FAIR');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "eventType" "EventType" NOT NULL DEFAULT 'BUSINESS_TOUR';
