export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type ExerciseType = 'VISUAL_DUAL_CODING' | 'SPACED_CLOZE' | 'SYNTACTIC_CONSTRUCTOR';

export interface VisualDualCodingMetadata {
  svgType: 'cafe' | 'train' | 'library' | 'hospital' | 'court' | 'market' | 'park' | 'office' | 'weather';
  svgTitle: string;
  visualCueNote: string;
  sentenceFragment: string; // e.g. "El camarero sirve un café muy _____ por la mañana."
  targetBlankWord: string; // e.g. "caliente"
  options: string[]; // ['caliente', 'calientes', 'fría', 'rápido']
  morphoSyntaxBreakdown: {
    rule: string; // e.g. "Adjective-noun gender & number agreement"
    pattern: string; // e.g. "café (sustantivo masculino singular) + caliente (adjetivo invariable en género)"
    explanation: string;
  };
}

export interface SpacedClozeMetadata {
  sentenceWithBlank: string; // e.g. "Si tuviera más tiempo libre, _____ a aprender otro idioma."
  correctAnswer: string; // e.g. "empezaría"
  acceptableAlternatives?: string[];
  translation: string;
  hints: {
    grammarCue: string; // e.g. "Condicional simple, 1ª persona singular (irreal del presente)"
    englishRoot: string; // e.g. "empezar / to start, begin"
    synonym: string; // e.g. "comenzaría / iniciaría"
  };
  cefrGrammarTopic: string;
}

export interface SyntacticConstructorMetadata {
  englishPrompt: string; // e.g. "Don't tell it to me now, tell it to me tomorrow."
  scrambledTokens: string[]; // ["me", "No", "lo", "digas", "ahora,", "dímelo", "mañana"]
  targetTokens: string[]; // ["No", "me", "lo", "digas", "ahora,", "dímelo", "mañana"]
  acceptableSequences?: string[][];
  syntacticCategoryNotes: {
    [token: string]: string; // e.g. "No" -> "Negación preverbal", "me" -> "Objeto indirecto antepuesto", "lo" -> "Objeto directo"
  };
  syntaxRuleExplanation: string; // In Spanish, clitic object pronouns precede negative imperative verbs ("No me lo digas"), but attach as enclitics to affirmative imperatives ("Dímelo").
}

export interface Exercise {
  id: string;
  level: CefrLevel;
  type: ExerciseType;
  title: string;
  prompt: string;
  targetPhrase: string;
  metadata: VisualDualCodingMetadata | SpacedClozeMetadata | SyntacticConstructorMetadata;
  explanation: string;
  syntaxNotes?: string;
}

export interface SubmitProgressPayload {
  userId?: string;
  exerciseId: string;
  level: CefrLevel;
  type: ExerciseType;
  isCorrect: boolean;
  timeSpentMs: number;
  userResponse: string;
  difficultyRating?: 'again' | 'hard' | 'good' | 'easy'; // For SRS intervals
}

export interface LevelDiagnosticStats {
  level: CefrLevel;
  levelName: string;
  visualXp: number;
  clozeXp: number;
  syntaxXp: number;
  totalLevelXp: number;
  masteryPercentage: number;
  exercisesCompleted: number;
  accuracyRate: number;
}

export interface UserStatsResponse {
  userId: string;
  name: string;
  currentLevel: CefrLevel;
  totalXp: number;
  streakDays: number;
  nextLevelXpTarget: number;
  progressToNextLevel: number; // 0 - 100
  levels: Record<CefrLevel, LevelDiagnosticStats>;
}
