import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CefrLevel } from '../../types';

const NEXT_LEVEL_MAP: Record<CefrLevel, { next: CefrLevel | 'Maestría C2'; name: string; targetXp: number }> = {
  A1: { next: 'A2', name: 'Waystage (Elemental)', targetXp: 250 },
  A2: { next: 'B1', name: 'Threshold (Intermedio)', targetXp: 650 },
  B1: { next: 'B2', name: 'Vantage (Avanzado)', targetXp: 1300 },
  B2: { next: 'C1', name: 'Effective Operational', targetXp: 2200 },
  C1: { next: 'Maestría C2', name: 'Dominio Nativo Completo', targetXp: 3500 },
};

export const ProgressBar: React.FC = () => {
  const { currentLevel, totalXp, levels, openDiagnosticModal } = useAppStore();
  const currentLvlStats = levels[currentLevel];
  const nextMeta = NEXT_LEVEL_MAP[currentLevel];

  const masteryPercent = currentLvlStats ? currentLvlStats.masteryPercentage : 50;

  return (
    <div className="w-full bg-slate-50/90 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 py-2.5 px-4 sm:px-6 lg:px-8 text-xs transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Active CEFR Path Banner */}
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5 font-bold font-mono">
            <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white shadow-sm">
              {currentLevel}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {nextMeta.next}
            </span>
          </div>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Meta: {nextMeta.name} ({totalXp} / {nextMeta.targetXp} XP)
          </span>
        </div>

        {/* Global Progress Bar towards Next CEFR Level */}
        <div className="flex items-center gap-3 w-full md:w-auto md:min-w-[340px]">
          <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner relative">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${masteryPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          <button
            onClick={openDiagnosticModal}
            className="flex items-center gap-1 font-mono font-bold text-rose-600 dark:text-rose-400 hover:underline shrink-0"
          >
            <span>{masteryPercent}%</span>
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
