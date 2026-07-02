CREATE TABLE IF NOT EXISTS "notifications" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "type" VARCHAR(40) DEFAULT 'lesson_plan',
  "reference_id" TEXT,
  "is_read" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "fk_notification_user" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS "notifications_user_id_created_at_idx"
  ON "notifications"("user_id", "created_at");
