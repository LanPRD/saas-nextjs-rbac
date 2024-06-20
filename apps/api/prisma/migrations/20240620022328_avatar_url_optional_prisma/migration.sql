-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_organizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT,
    "should_attach_user_by_domain" BOOLEAN NOT NULL DEFAULT false,
    "avatar_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "organizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_organizations" ("avatar_url", "created_at", "domain", "id", "name", "should_attach_user_by_domain", "slug", "updated_at", "user_id") SELECT "avatar_url", "created_at", "domain", "id", "name", "should_attach_user_by_domain", "slug", "updated_at", "user_id" FROM "organizations";
DROP TABLE "organizations";
ALTER TABLE "new_organizations" RENAME TO "organizations";
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");
CREATE UNIQUE INDEX "organizations_domain_key" ON "organizations"("domain");
CREATE UNIQUE INDEX "organizations_avatar_url_key" ON "organizations"("avatar_url");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
