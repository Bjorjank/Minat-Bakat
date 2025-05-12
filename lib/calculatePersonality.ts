// lib/calculatePersonality.ts
type TraitCount = { [key: string]: number };

export function calculateMBTI(questions: any[], answers: number[]) {
  const scores: TraitCount = {};

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const answer = answers[i];
    const trait = q.trait;

    if (!scores[trait]) scores[trait] = 0;
    scores[trait] += answer;
  }

  // Logika pengelompokan 4 dimensi MBTI
  const type = (scores.introvert > scores.extrovert ? "I" : "E") + (scores.sensing > scores.intuition ? "S" : "N") + (scores.thinking > scores.feeling ? "T" : "F") + (scores.judging > scores.perceiving ? "J" : "P");

  return { type, scores };
}
