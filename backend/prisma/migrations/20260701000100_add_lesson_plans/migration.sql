-- Add exact-date lesson-plan support and link published plans into student timetables.
ALTER TABLE "Timetable"
ADD COLUMN IF NOT EXISTS "eventDate" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "lessonPlanId" TEXT,
ADD COLUMN IF NOT EXISTS "source" TEXT DEFAULT 'manual';

CREATE TABLE IF NOT EXISTS "LessonPlan" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "title" VARCHAR(255) NOT NULL,
    "topic" VARCHAR(255) NOT NULL,
    "subject_id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "lesson_date" TIMESTAMP(6) NOT NULL,
    "day" VARCHAR(20) NOT NULL,
    "start_time" VARCHAR(20) NOT NULL,
    "duration" INTEGER NOT NULL,
    "room" VARCHAR(100),
    "sessions" INTEGER DEFAULT 1,
    "weeks" INTEGER DEFAULT 1,
    "status" VARCHAR(20) DEFAULT 'active',
    "objectives" JSONB,
    "outcomes" JSONB,
    "notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LessonPlan_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "LessonPlan"
ADD CONSTRAINT "LessonPlan_faculty_id_fkey"
FOREIGN KEY ("faculty_id") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "LessonPlan"
ADD CONSTRAINT "LessonPlan_subject_id_fkey"
FOREIGN KEY ("subject_id") REFERENCES "Subject"("id")
ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "Timetable"
ADD CONSTRAINT "Timetable_lessonPlanId_fkey"
FOREIGN KEY ("lessonPlanId") REFERENCES "LessonPlan"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
