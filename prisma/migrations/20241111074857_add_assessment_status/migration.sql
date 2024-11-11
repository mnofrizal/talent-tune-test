-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_assessment_participants" (
    "userId" INTEGER NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "schedule" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',

    PRIMARY KEY ("userId", "assessmentId"),
    CONSTRAINT "assessment_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "assessment_participants_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_assessment_participants" ("assessmentId", "schedule", "userId") SELECT "assessmentId", "schedule", "userId" FROM "assessment_participants";
DROP TABLE "assessment_participants";
ALTER TABLE "new_assessment_participants" RENAME TO "assessment_participants";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
