import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const LEVEL_NAMES: Record<string, string> = {
  A1: 'Principiante (Breakthrough)',
  A2: 'Elemental (Waystage)',
  B1: 'Intermedio (Threshold)',
  B2: 'Intermedio Alto (Vantage)',
  C1: 'Dominio Operativo Eficaz (Effective Proficiency)',
};

export const LevelUpModal: React.FC = () => {
  const { levelUpNotification, dismissLevelUp } = useAppStore();

  if (!levelUpNotification) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-6 overflow-hidden"
        >
          {/* Confetti Glow Background Effect */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Trophy Badge */}
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Trophy className="w-10 h-10" />
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest text-amber-500 uppercase">
              ¡Promoción de Nivel MCER!
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              ¡Has alcanzado el nivel {levelUpNotification.current}!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {LEVEL_NAMES[levelUpNotification.current] || 'Nuevo Nivel Desbloqueado'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 text-left space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              Nuevas competencias gramaticales activadas
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Tus ejercicios de Codificación Dual, Cloze y Sintaxis ahora integran estructuras con mayor riqueza léxica y complejidad discursiva.
            </p>
          </div>

          <button
            onClick={dismissLevelUp}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 transition-all"
          >
            <span>Continuar Aprendizaje</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
