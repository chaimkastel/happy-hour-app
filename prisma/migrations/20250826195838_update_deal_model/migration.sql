/*
  Warnings:

  - You are about to drop the column `dineInOnly` on the `deals` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_deals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "venueId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "percentOff" INTEGER NOT NULL,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "maxRedemptions" INTEGER NOT NULL,
    "redeemedCount" INTEGER NOT NULL DEFAULT 0,
    "minSpend" REAL,
    "inPersonOnly" BOOLEAN NOT NULL DEFAULT true,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "deals_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_deals" ("createdAt", "description", "endAt", "id", "maxRedemptions", "minSpend", "percentOff", "redeemedCount", "startAt", "status", "tags", "title", "updatedAt", "venueId") SELECT "createdAt", "description", "endAt", "id", "maxRedemptions", "minSpend", "percentOff", "redeemedCount", "startAt", "status", "tags", "title", "updatedAt", "venueId" FROM "deals";
DROP TABLE "deals";
ALTER TABLE "new_deals" RENAME TO "deals";
CREATE INDEX "deals_venueId_startAt_endAt_idx" ON "deals"("venueId", "startAt", "endAt");
CREATE INDEX "deals_status_idx" ON "deals"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
