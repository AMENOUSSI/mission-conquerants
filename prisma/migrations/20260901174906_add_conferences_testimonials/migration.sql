-- CreateEnum
CREATE TYPE "TestimonialCategory" AS ENUM ('KITS_SCOLAIRES', 'KITS_ALIMENTAIRES', 'PEUPLES_NATIONS', 'PERSONNES');

-- CreateEnum
CREATE TYPE "TestimonialFormat" AS ENUM ('VIDEO', 'AUDIO', 'TEXT');

-- AlterEnum
ALTER TYPE "MediaType" ADD VALUE 'AUDIO';

-- CreateTable
CREATE TABLE "conferences" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "coverImageId" TEXT,
    "eventDate" TIMESTAMP(3),
    "location" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorRole" TEXT,
    "category" "TestimonialCategory" NOT NULL,
    "format" "TestimonialFormat" NOT NULL,
    "quote" TEXT,
    "videoUrl" TEXT,
    "audioMediaId" TEXT,
    "photoMediaId" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conferences_slug_key" ON "conferences"("slug");

-- CreateIndex
CREATE INDEX "conferences_status_publishedAt_idx" ON "conferences"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "testimonials_status_publishedAt_idx" ON "testimonials"("status", "publishedAt");

-- AddForeignKey
ALTER TABLE "conferences" ADD CONSTRAINT "conferences_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conferences" ADD CONSTRAINT "conferences_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_audioMediaId_fkey" FOREIGN KEY ("audioMediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photoMediaId_fkey" FOREIGN KEY ("photoMediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
