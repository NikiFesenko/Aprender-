import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppTab, CefrLevel, ExerciseType, LevelDiagnosticStats, UserStatsResponse } from '../types';
import { apiClient } from '../services/api';
import confetti from 'canvas-confetti';

interface AppState {
  currentLevel: CefrLevel;
  activeTab: AppTab;
  theme: 'dark' | 'light';
  totalXp: number;
  streakDays: number;
  completedExercises: Record<string, boolean>;
  levels: Record<CefrLevel, LevelDiagnosticStats>;
  levelUpNotification: { previous: CefrLevel; current: CefrLevel } | null;
  isDiagnosticOpen: boolean;
  isResearchModalOpen: boolean;
  isSettingsOpen: boolean;
  activeExerciseIndex: Record<string, number>; // key: `${level}_${tab}`

  // Actions
  setLevel: (level: CefrLevel) => void;
  setActiveTab: (tab: AppTab) => void;
  toggleTheme: () => void;
  recordExerciseResult: (params: {
    exerciseId: string;
    level: CefrLevel;
    type: ExerciseType;
    isCorrect: boolean;
    timeSpentMs: number;
    userResponse: string;
    difficultyRating?: 'again' | 'hard' | 'good' | 'easy';
  }) => Promise<{ earnedXp: number; isLevelUp: boolean }>;
  setExerciseIndex: (key: string, index: number) => void;
  nextExercise: (totalCount: number) => void;
  prevExercise: () => void;
  openDiagnosticModal: () => void;
  closeDiagnosticModal: () => void;
  openResearchModal: () => void;
  closeResearchModal: () => void;
  dismissLevelUp: () => void;
  resetProgress: () => void;
  syncWithBackend: () => Promise<void>;
}

const LEVEL_THRESHOLDS: { level: CefrLevel; xpReq: number }[] = [
  { level: 'A1', xpReq: 0 },
  { level: 'A2', xpReq: 250 },
  { level: 'B1', xpReq: 650 },
  { level: 'B2', xpReq: 1300 },
  { level: 'C1', xpReq: 2200 },
];

const INITIAL_LEVELS: Record<CefrLevel, LevelDiagnosticStats> = {
  A1: {
    level: 'A1',
    levelName: 'Breakthrough (Beginner)',
    visualXp: 80,
    clozeXp: 50,
    syntaxXp: 50,
    totalLevelXp: 180,
    masteryPercentage: 72,
    exercisesCompleted: 4,
    accuracyRate: 95,
  },
  A2: {
    level: 'A2',
    levelName: 'Waystage (Elementary)',
    visualXp: 0,
    clozeXp: 0,
    syntaxXp: 0,
    totalLevelXp: 0,
    masteryPercentage: 0,
    exercisesCompleted: 0,
    accuracyRate: 100,
  },
  B1: {
    level: 'B1',
    levelName: 'Threshold (Intermediate)',
    visualXp: 0,
    clozeXp: 0,
    syntaxXp: 0,
    totalLevelXp: 0,
    masteryPercentage: 0,
    exercisesCompleted: 0,
    accuracyRate: 100,
  },
  B2: {
    level: 'B2',
    levelName: 'Vantage (Upper-Intermediate)',
    visualXp: 0,
    clozeXp: 0,
    syntaxXp: 0,
    totalLevelXp: 0,
    masteryPercentage: 0,
    exercisesCompleted: 0,
    accuracyRate: 100,
  },
  C1: {
    level: 'C1',
    levelName: 'Effective Operational Proficiency',
    visualXp: 0,
    clozeXp: 0,
    syntaxXp: 0,
    totalLevelXp: 0,
    masteryPercentage: 0,
    exercisesCompleted: 0,
    accuracyRate: 100,
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentLevel: 'A1',
      activeTab: 'visual',
      theme: 'dark',
      totalXp: 180,
      streakDays: 4,
      completedExercises: {
        'a1-vis-1': true,
        'a1-clz-1': true,
      },
      levels: INITIAL_LEVELS,
      levelUpNotification: null,
      isDiagnosticOpen: false,
      isResearchModalOpen: false,
      isSettingsOpen: false,
      activeExerciseIndex: {},

      setLevel: (level: CefrLevel) => set({ currentLevel: level }),

      setActiveTab: (tab: AppTab) => set({ activeTab: tab }),

      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        if (typeof document !== 'undefined') {
          if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        set({ theme: nextTheme });
      },

      setExerciseIndex: (key: string, index: number) => {
        set((state) => ({
          activeExerciseIndex: {
            ...state.activeExerciseIndex,
            [key]: index,
          },
        }));
      },

      nextExercise: (totalCount: number) => {
        const { currentLevel, activeTab, activeExerciseIndex } = get();
        const key = `${currentLevel}_${activeTab}`;
        const currentIdx = activeExerciseIndex[key] || 0;
        const nextIdx = (currentIdx + 1) % Math.max(1, totalCount);
        set((state) => ({
          activeExerciseIndex: {
            ...state.activeExerciseIndex,
            [key]: nextIdx,
          },
        }));
      },

      prevExercise: () => {
        const { currentLevel, activeTab, activeExerciseIndex } = get();
        const key = `${currentLevel}_${activeTab}`;
        const currentIdx = activeExerciseIndex[key] || 0;
        const prevIdx = Math.max(0, currentIdx - 1);
        set((state) => ({
          activeExerciseIndex: {
            ...state.activeExerciseIndex,
            [key]: prevIdx,
          },
        }));
      },

      recordExerciseResult: async ({
        exerciseId,
        level,
        type,
        isCorrect,
        timeSpentMs,
        userResponse,
        difficultyRating,
      }) => {
        const prevTotalXp = get().totalXp;
        const prevLevel = get().currentLevel;

        let baseEarned = 35;
        if (type === 'VISUAL_DUAL_CODING') baseEarned = 40;
        if (type === 'SPACED_CLOZE') baseEarned = 50;
        if (type === 'SYNTACTIC_CONSTRUCTOR') baseEarned = 60;

        const earnedXp = isCorrect ? baseEarned : 8;
        const newTotalXp = prevTotalXp + earnedXp;

        // Check CEFR Level Promotion
        let newLevel = prevLevel;
        for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
          if (newTotalXp >= LEVEL_THRESHOLDS[i].xpReq) {
            newLevel = LEVEL_THRESHOLDS[i].level;
            break;
          }
        }

        const isLevelUp = newLevel !== prevLevel;

        // Trigger celebratory confetti if correct or level up
        if (typeof window !== 'undefined' && isCorrect) {
          try {
            confetti({
              particleCount: isLevelUp ? 120 : 45,
              spread: isLevelUp ? 80 : 55,
              origin: { y: 0.7 },
              colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#34d399'],
            });
          } catch {
            // ignore if confetti library in headless environment
          }
        }

        // Send submission to backend asynchronously
        apiClient.submitProgress({
          exerciseId,
          level,
          type,
          isCorrect,
          timeSpentMs,
          userResponse,
          difficultyRating,
        }).catch((err) => console.warn('Background sync error', err));

        // Update local state
        set((state) => {
          const currentLvlData = { ...state.levels[level] };
          if (type === 'VISUAL_DUAL_CODING') currentLvlData.visualXp += earnedXp;
          if (type === 'SPACED_CLOZE') currentLvlData.clozeXp += earnedXp;
          if (type === 'SYNTACTIC_CONSTRUCTOR') currentLvlData.syntaxXp += earnedXp;

          currentLvlData.totalLevelXp += earnedXp;
          currentLvlData.exercisesCompleted += 1;
          currentLvlData.masteryPercentage = Math.min(100, Math.round((currentLvlData.totalLevelXp / 250) * 100));

          const updatedLevels = {
            ...state.levels,
            [level]: currentLvlData,
          };

          return {
            totalXp: newTotalXp,
            currentLevel: newLevel,
            levels: updatedLevels,
            completedExercises: {
              ...state.completedExercises,
              [exerciseId]: isCorrect,
            },
            levelUpNotification: isLevelUp ? { previous: prevLevel, current: newLevel } : state.levelUpNotification,
          };
        });

        return { earnedXp, isLevelUp };
      },

      openDiagnosticModal: () => set({ isDiagnosticOpen: true }),
      closeDiagnosticModal: () => set({ isDiagnosticOpen: false }),

      openResearchModal: () => set({ isResearchModalOpen: true }),
      closeResearchModal: () => set({ isResearchModalOpen: false }),

      dismissLevelUp: () => set({ levelUpNotification: null }),

      resetProgress: () => {
        set({
          totalXp: 0,
          currentLevel: 'A1',
          completedExercises: {},
          levels: INITIAL_LEVELS,
          activeExerciseIndex: {},
        });
      },

      syncWithBackend: async () => {
        const stats: UserStatsResponse | null = await apiClient.getUserStats();
        if (stats) {
          set({
            totalXp: stats.totalXp,
            currentLevel: stats.currentLevel,
            streakDays: stats.streakDays,
            levels: stats.levels,
          });
        }
      },
    }),
    {
      name: 'aprende-learning-state',
      partialize: (state) => ({
        currentLevel: state.currentLevel,
        activeTab: state.activeTab,
        theme: state.theme,
        totalXp: state.totalXp,
        streakDays: state.streakDays,
        completedExercises: state.completedExercises,
        levels: state.levels,
        activeExerciseIndex: state.activeExerciseIndex,
      }),
    }
  )
);
