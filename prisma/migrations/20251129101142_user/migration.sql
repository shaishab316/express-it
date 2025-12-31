-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "fb_id" TEXT,
ADD COLUMN     "google_id" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "name" SET DEFAULT 'Unknown User';

-- CreateIndex
CREATE INDEX "idx_user_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_user_fb_id" ON "users"("fb_id");

-- CreateIndex
CREATE INDEX "idx_user_google_id" ON "users"("google_id");

-- CreateIndex
CREATE INDEX "idx_user_role" ON "users"("role");

-- CreateIndex
CREATE INDEX "idx_user_stripe_customer_id" ON "users"("stripe_customer_id");

-- CreateIndex
CREATE INDEX "idx_user_stripe_account_id" ON "users"("stripe_account_id");
