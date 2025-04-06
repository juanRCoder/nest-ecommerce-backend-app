/*
  Warnings:

  - You are about to drop the column `voucher` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "voucher",
ADD COLUMN     "voucherUrl" TEXT;
