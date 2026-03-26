/**
 * Merged certification data — imports from both Part 1 and Part 2
 * Used by the certifications API route and the questions endpoint
 */
import { CERTIFICATIONS, QUESTIONS as QUESTIONS_PART1, type QuestionDef } from "./certifications-data";
import { QUESTIONS_PART2 } from "./certifications-questions-part2";

// Merge all 800 questions (40 domains x 20 questions)
export const ALL_QUESTIONS: Record<string, QuestionDef[]> = {
  ...QUESTIONS_PART1,
  ...QUESTIONS_PART2,
};

// Re-export certifications
export { CERTIFICATIONS };
export type { QuestionDef };
