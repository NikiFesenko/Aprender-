export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type AppTab = 'visual' | 'cloze' | 'syntax';

export type ExerciseType = 'VISUAL_DUAL_CODING' | 'SPACED_CLOZE' | 'SYNTACTIC_CONSTRUCTOR';

export interface VisualDualCodingMetadata {
  svgType: 'cafe' | 'train' | 'library' | 'hospital' | 'court' | 'market';
  svgTitle: string;
  visualCueNote: string;
  sentenceFragment: string;
  targetBlankWord: string;
  options: string[];
  morphoSyntaxBreakdown: {
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
  type: ExerciseType;
  title: string;
  prompt: string;
  targetPhrase: string;
  metadata: VisualDualCodingMetadata | SpacedClozeMetadata | SyntacticConstructorMetadata;
  explanation: string;
  syntaxNotes?: string;
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
  progressToNextLevel: number;
  levels: Record<CefrLevel, LevelDiagnosticStats>;
}
