-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "delivery_method" SET DEFAULT 'local';

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "payment_method" SET DEFAULT 'cash',
ALTER COLUMN "payment_status" SET DEFAULT 'pending';
