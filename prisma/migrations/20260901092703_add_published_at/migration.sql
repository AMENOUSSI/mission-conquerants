-- DropIndex
DROP INDEX "projects_status_idx";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "projects_status_publishedAt_idx" ON "projects"("status", "publishedAt");
