-- AlterTable
ALTER TABLE "merchants" ADD COLUMN "businessAddress" TEXT;
ALTER TABLE "merchants" ADD COLUMN "cuisineType" TEXT;
ALTER TABLE "merchants" ADD COLUMN "firstName" TEXT;
ALTER TABLE "merchants" ADD COLUMN "lastName" TEXT;
ALTER TABLE "merchants" ADD COLUMN "termsAcceptedAt" DATETIME;
ALTER TABLE "merchants" ADD COLUMN "website" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "walletCardId" TEXT,
    "preferredCities" TEXT NOT NULL DEFAULT '[]',
    "location" TEXT,
    "newsletterOptIn" BOOLEAN NOT NULL DEFAULT false,
    "termsAcceptedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("createdAt", "email", "id", "location", "password", "phone", "preferredCities", "role", "updatedAt", "walletCardId") SELECT "createdAt", "email", "id", "location", "password", "phone", "preferredCities", "role", "updatedAt", "walletCardId" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
