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
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" DATETIME,
    "emailVerifyToken" TEXT,
    "emailVerifyTokenExpiry" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("createdAt", "email", "firstName", "id", "lastName", "location", "newsletterOptIn", "password", "phone", "preferredCities", "role", "termsAcceptedAt", "updatedAt", "walletCardId") SELECT "createdAt", "email", "firstName", "id", "lastName", "location", "newsletterOptIn", "password", "phone", "preferredCities", "role", "termsAcceptedAt", "updatedAt", "walletCardId" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
