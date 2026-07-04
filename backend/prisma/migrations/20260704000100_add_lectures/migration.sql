ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "branch" TEXT,
ADD COLUMN IF NOT EXISTS "section" TEXT;

CREATE TABLE IF NOT EXISTS "Lecture" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subject_id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" DATE NOT NULL,
    "start_time" VARCHAR(10) NOT NULL,
    "end_time" VARCHAR(10) NOT NULL,
    "classroom" TEXT,
    "meeting_link" TEXT,
    "semester" VARCHAR(20),
    "section" VARCHAR(50),
    "branch" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Lecture"
ADD CONSTRAINT "Lecture_faculty_id_fkey"
FOREIGN KEY ("faculty_id") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "Lecture"
ADD CONSTRAINT "Lecture_subject_id_fkey"
FOREIGN KEY ("subject_id") REFERENCES "Subject"("id")
ON DELETE CASCADE ON UPDATE NO ACTION;

CREATE INDEX IF NOT EXISTS "Lecture_date_idx" ON "Lecture"("date");
CREATE INDEX IF NOT EXISTS "Lecture_faculty_id_idx" ON "Lecture"("faculty_id");
CREATE INDEX IF NOT EXISTS "Lecture_subject_id_idx" ON "Lecture"("subject_id");
CREATE INDEX IF NOT EXISTS "Lecture_student_target_idx" ON "Lecture"("semester", "branch", "section");
