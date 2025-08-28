/*
  Warnings:

  - You are about to drop the column `cuisine` on the `venues` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_venues" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "merchantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "businessType" TEXT NOT NULL DEFAULT '[]',
    "priceTier" TEXT NOT NULL DEFAULT 'MODERATE',
    "hours" TEXT NOT NULL DEFAULT '{}',
    "rating" REAL DEFAULT 0,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "venues_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_venues" ("address", "createdAt", "hours", "id", "isVerified", "latitude", "longitude", "merchantId", "name", "photos", "priceTier", "rating", "slug", "updatedAt") SELECT "address", "createdAt", "hours", "id", "isVerified", "latitude", "longitude", "merchantId", "name", "photos", "priceTier", "rating", "slug", "updatedAt" FROM "venues";
DROP TABLE "venues";
ALTER TABLE "new_venues" RENAME TO "venues";
CREATE UNIQUE INDEX "venues_slug_key" ON "venues"("slug");
CREATE INDEX "venues_latitude_longitude_idx" ON "venues"("latitude", "longitude");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
