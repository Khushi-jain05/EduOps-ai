-- CreateTable
CREATE TABLE IF NOT EXISTS "mcq_sets" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "title" VARCHAR(255) NOT NULL,
    "subject_id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "topic" VARCHAR(255),
    "difficulty" VARCHAR(20),
    "bloom_level" VARCHAR(50),
    "question_count" INTEGER NOT NULL DEFAULT 0,
    "generated_content" JSONB,
    "status" VARCHAR(20) DEFAULT 'draft',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ai_prompt" TEXT,
    "share_token" UUID DEFAULT gen_random_uuid(),
    "is_published" BOOLEAN DEFAULT false,

    CONSTRAINT "mcq_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "mcq_questions" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "mcq_set_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correct_answer" TEXT NOT NULL,
    "explanation" TEXT,
    "difficulty" VARCHAR(20),
    "bloom_level" VARCHAR(50),
    "marks" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mcq_questions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mcq_sets" ADD CONSTRAINT "fk_mcq_faculty" FOREIGN KEY ("faculty_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mcq_sets" ADD CONSTRAINT "fk_mcq_subject" FOREIGN KEY ("subject_id") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mcq_questions" ADD CONSTRAINT "fk_mcq_question_set" FOREIGN KEY ("mcq_set_id") REFERENCES "mcq_sets"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
