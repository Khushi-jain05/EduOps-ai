/*
  Warnings:

  - Made the column `category` on table `Timetable` required. This step will fail if there are existing NULL values in that column.
  - Made the column `day` on table `Timetable` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Timetable" ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "day" SET NOT NULL;
