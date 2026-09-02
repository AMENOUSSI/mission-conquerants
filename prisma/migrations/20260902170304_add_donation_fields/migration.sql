-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN     "donationBankAccountName" TEXT DEFAULT 'MISSION LES CONQUERANTS',
ADD COLUMN     "donationBankAccountNumber" TEXT DEFAULT '00 17 72 20 00 03',
ADD COLUMN     "donationBankName" TEXT DEFAULT 'Bank of Africa',
ADD COLUMN     "donationMixxTogoNumber" TEXT DEFAULT '+228 91 39 42 43',
ADD COLUMN     "donationMoovFloozNumbers" TEXT DEFAULT '+228 98 85 25 09, +228 98 50 32 53';
