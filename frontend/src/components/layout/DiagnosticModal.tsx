import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, TrendingUp, Image as ImageIcon, Edit3, Puzzle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CefrLevel } from '../../types';

export const DiagnosticModal: React.FC = () => {
  const {
    isDiagnosticOpen,
    closeDiagnosticModal,
    currentLevel,
    totalXp,
    streakDays,
    levels,
  } = useAppStore();

  if (!isDiagnosticOpen) return null;

  const currentStats = levels[currentLevel];
  const allLevels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Diagnóstico de Competencias MCER
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Desglose analítico de las 3 técnicas de adquisición del español
                </p>
              </div>
            </div>

            <button
              onClick={closeDiagnosticModal}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Top Level Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Nivel Actual
              </span>
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
                {currentLevel}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">{currentStats.levelName}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Puntos de Dominio
              </span>
              <span className="text-2xl font-black text-amber-500 font-mono">{totalXp}</span>
              <span className="text-[10px] text-slate-400 block">XP Totales Acumulados</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Racha Activa
              </span>
              <span className="text-2xl font-black text-emerald-500 font-mono">{streakDays}</span>
              <span className="text-[10px] text-slate-400 block">Días Consecutivos</span>
            </div>
          </div>

          {/* Diagnostic Breakdown by the 3 Evidence-Based Techniques */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              Rendimiento por Técnica Cognitiva ({currentLevel}):
            </h4>

            {/* Technique 1: Visual Dual-Coding */}
            <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-slate-800/40 border border-rose-200/50 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-rose-500" />
                  Codificación Dual (Morfosintaxis Visual)
                </span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                  {currentStats.visualXp} XP
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (currentStats.visualXp / 100) * 100)}%` }}
                />
              </div>
            </div>

            {/* Technique 2: Spaced Cloze */}
            <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-slate-800/40 border border-amber-200/50 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-500" />
                  Recuperación Cloze Espaciada (Active Recall)
                </span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  {currentStats.clozeXp} XP
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (currentStats.clozeXp / 100) * 100)}%` }}
                />
              </div>
            </div>

            {/* Technique 3: Syntactic Constructor */}
            <div className="p-3.5 rounded-2xl bg-sky-50/50 dark:bg-slate-800/40 border border-sky-200/50 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Puzzle className="w-4 h-4 text-sky-500" />
                  Constructor Sintáctico (Schmidt Noticing)
                </span>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                  {currentStats.syntaxXp} XP
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (currentStats.syntaxXp / 100) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Across-the-board CEFR Mastery Grid */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Progreso General en los 5 Niveles MCER:
            </span>
            <div className="grid grid-cols-5 gap-2">
              {allLevels.map((lvl) => {
                const stat = levels[lvl];
                const isActive = lvl === currentLevel;
                return (
                  <div
                    key={lvl}
                    className={`p-2 rounded-xl text-center border text-xs ${
                      isActive
                        ? 'border-rose-500 bg-rose-500/10 font-bold text-rose-600 dark:text-rose-400'
                        : stat.masteryPercentage > 0
                        ? 'border-emerald-500/40 bg-emerald-500/5 text-slate-700 dark:text-slate-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="font-mono">{lvl}</div>
                    <div className="text-[10px]">{stat.masteryPercentage}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Close button */}
          <div className="pt-2">
            <button
              onClick={closeDiagnosticModal}
              className="w-full py-3 rounded-xl font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-sm shadow-md"
            >
              Cerrar Diagnóstico
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
