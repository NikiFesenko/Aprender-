export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type AppTab = 'visual' | 'cloze' | 'syntax';

export type ExerciseType = 'VISUAL_DUAL_CODING' | 'SPACED_CLOZE' | 'SYNTACTIC_CONSTRUCTOR';

export interface Stage {
  id: string;
  level: CefrLevel;
  stageNumber: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: 'sparkles' | 'book' | 'compass' | 'target' | 'award' | 'zap';
  requiredXpToUnlock: number;
}

export interface VisualDualCodingMetadata {
  hasIllustration?: boolean;
  svgType?: string;
  svgTitle?: string;
  visualCueNote?: string;
  sentenceFragment: string;
  targetBlankWord: string;
  options: string[];
  grammaticalRule?: string;
  syntaxPattern?: string;
  explanation?: string;
  morphoSyntaxBreakdown?: {
    rule: string;
    pattern: string;
    explanation: string;
  };
}

export interface SpacedClozeMetadata {
  sentenceWithBlank: string;
  correctAnswer: string;
  acceptableAlternatives?: string[];
  translation: string;
  hints: {
    grammarCue: string;
    englishRoot: string;
    synonym: string;
  };
  cefrGrammarTopic: string;
}

export interface SyntacticConstructorMetadata {
  englishPrompt: string;
  scrambledTokens: string[];
  targetTokens: string[];
  acceptableSequences?: string[][];
  syntacticCategoryNotes: {
    [token: string]: string;
  };
  syntaxRuleExplanation: string;
}

export interface Exercise {
  id: string;
  level: CefrLevel;
  stageNumber: number; // 1 to 5 within the level
  type: ExerciseType;
  title: string;
  prompt: string;
  targetPhrase?: string;
  metadata: VisualDualCodingMetadata | SpacedClozeMetadata | SyntacticConstructorMetadata;
  explanation?: string;
  syntaxNotes?: string;
  createdAt?: string;
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
  completedStages: number[];
}

export interface UserStatsResponse {
  userId: string;
  name: string;
  currentLevel: CefrLevel;
  currentStageNumber: number;
  totalXp: number;
  streakDays: number;
  nextLevelXpTarget: number;
  progressToNextLevel: number;
  levels: Record<CefrLevel, LevelDiagnosticStats>;
}
