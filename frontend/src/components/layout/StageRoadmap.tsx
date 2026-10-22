import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Compass,
  Target,
  CheckCircle2,
  Lock,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { STAGES_DATA } from '../../data/stagesData';
import { useAppStore } from '../../store/useAppStore';
import { Stage } from '../../types';

interface StageRoadmapProps {
  currentStageNumber: number;
  onSelectStage: (stageNum: number) => void;
}

export const StageRoadmap: React.FC<StageRoadmapProps> = ({
  currentStageNumber,
  onSelectStage,
}) => {
  const { currentLevel, totalXp } = useAppStore();

  const stagesForLevel: Stage[] = STAGES_DATA.filter((s) => s.level === currentLevel);

  const getStageIcon = (iconName: string, isUnlocked: boolean) => {
    const props = { className: 'w-5 h-5' };
    if (!isUnlocked) return <Lock {...props} />;
    switch (iconName) {
      case 'sparkles':
        return <Sparkles {...props} />;
      case 'compass':
        return <Compass {...props} />;
      case 'target':
      default:
        return <Target {...props} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6 p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Ruta de Aprendizaje Modular • Nivel {currentLevel}
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
          5 Etapas • 50 Preguntas
        </span>
      </div>

      {/* Duolingo-style Pathway Node Grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {stagesForLevel.map((stage) => {
          const isSelected = currentStageNumber === stage.stageNumber;
          // Unlocked if user has reached required XP or is stage 1
          const isUnlocked = stage.stageNumber === 1 || totalXp >= stage.requiredXpToUnlock;
          // Finished if completed
          const isCompleted = totalXp >= stage.requiredXpToUnlock + 100;

          return (
            <motion.div
              key={stage.id}
              whileHover={{ y: isUnlocked ? -3 : 0 }}
              onClick={() => isUnlocked && onSelectStage(stage.stageNumber)}
              className={`relative p-4 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                !isUnlocked
                  ? 'border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 opacity-60 cursor-not-allowed'
                  : isSelected
                  ? 'border-rose-500 bg-rose-500/10 dark:bg-rose-950/20 shadow-md ring-2 ring-rose-500/30 cursor-pointer'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer'
              }`}
            >
              {/* Top Node Indicator & Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-sm transition-all ${
                      !isUnlocked
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        : isCompleted
                        ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                        : isSelected
                        ? 'bg-rose-500 text-white shadow-rose-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      getStageIcon(stage.iconName, isUnlocked)
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-400 block">
                      ETAPA {stage.stageNumber}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isSelected
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {stage.title}
                    </span>
                  </div>
                </div>

                {isUnlocked && (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected
                        ? 'text-rose-500 translate-x-0.5'
                        : 'text-slate-400'
                    }`}
                  />
                )}
              </div>

              {/* Subtitle & Focus */}
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                {stage.subtitle}
              </p>

              {/* Bottom Unlock Status */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">
                  {stage.stageNumber === 1
                    ? '1 Desafío Inicial'
                    : `Meta: ${stage.requiredXpToUnlock} XP`}
                </span>
                <span
                  className={`font-bold ${
                    isCompleted
                      ? 'text-emerald-500'
                      : isSelected
                      ? 'text-rose-500'
                      : isUnlocked
                      ? 'text-slate-600 dark:text-slate-300'
                      : 'text-slate-400'
                  }`}
                >
                  {isCompleted
                    ? 'Completada ✓'
                    : isSelected
                    ? 'Etapa Activa'
                    : isUnlocked
                    ? 'Disponible'
                    : 'Bloqueada'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
