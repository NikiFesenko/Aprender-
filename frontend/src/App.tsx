import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { ProgressBar } from './components/layout/ProgressBar';
import { StageRoadmap } from './components/layout/StageRoadmap';
import { WordDefinitionPopover } from './components/common/WordDefinitionPopover';
import { DiagnosticModal } from './components/layout/DiagnosticModal';
import { LevelUpModal } from './components/layout/LevelUpModal';
import { ResearchInfoModal } from './components/layout/ResearchInfoModal';
import { VisualDualCoding } from './components/techniques/VisualDualCoding';
import { useAppStore } from './store/useAppStore';
import { Exercise } from './types';
import { apiClient } from './services/api';
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, MousePointerClick } from 'lucide-react';

export const App: React.FC = () => {
  const {
    currentLevel,
    currentStageNumber,
    setStageNumber,
    activeExerciseIndex,
    nextExercise,
    prevExercise,
    syncWithBackend,
    openResearchModal,
  } = useAppStore();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync state with backend on startup
  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  // Fetch exercises matching active level and stage (Technique 1: Visual Dual-Coding)
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    apiClient
      .getExercises(currentLevel, 'VISUAL_DUAL_CODING', currentStageNumber)
      .then((data) => {
        if (!isCancelled) {
          setExercises(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching exercises:', err);
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [currentLevel, currentStageNumber]);

  const indexKey = `${currentLevel}_visual_s${currentStageNumber}`;
  const currentIndex = Math.min(
    activeExerciseIndex[indexKey] || 0,
    Math.max(0, exercises.length - 1)
  );
  const activeExercise = exercises[currentIndex];

  const handleNext = () => {
    nextExercise(exercises.length);
  };

  const handlePrev = () => {
    prevExercise();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-rose-500 selection:text-white">
      {/* Global Interactive Word Translation Popover (Triggered by double-clicking ANY word) */}
      <WordDefinitionPopover />

      {/* Top Navigation */}
      <Navbar />

      {/* Level Progress Banner */}
      <ProgressBar />

      {/* Main Learning Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Double-Click Translation Tip Pill */}
        <div className="max-w-4xl mx-auto mb-4 px-4 py-2 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <MousePointerClick className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              <strong>Función Interactiva:</strong> Haz doble clic en cualquier palabra en español en la pantalla para ver su traducción y análisis gramatical al instante (100% offline).
            </span>
          </div>
          <span className="hidden sm:inline font-mono text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full font-bold">
            2x Click
          </span>
        </div>

        {/* Duolingo-style Modular Stage Roadmap for the Active CEFR Level */}
        <StageRoadmap
          currentStageNumber={currentStageNumber}
          onSelectStage={(num) => setStageNumber(num)}
        />

        {/* Navigation / Exercise Counter Subbar */}
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0 && currentStageNumber <= 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Ejercicio anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-slate-500 font-semibold">
              Etapa {currentStageNumber} • Desafío {exercises.length > 0 ? currentIndex + 1 : 0} de {exercises.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex >= exercises.length - 1 && currentStageNumber >= 5}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Ejercicio siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick info button for current level & stage */}
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono">
              {currentLevel} • Etapa {currentStageNumber}
            </span>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="max-w-4xl mx-auto h-96 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Cargando desafío lingüístico...</p>
          </div>
        ) : !activeExercise ? (
          <div className="max-w-4xl mx-auto p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold">¡Has completado los ejercicios de esta etapa!</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Avanza a la siguiente etapa en la ruta superior para completar los 50 desafíos del nivel {currentLevel}.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeExercise.id}_s${currentStageNumber}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <VisualDualCoding
                exercise={activeExercise}
                totalExercises={exercises.length}
                currentIndex={currentIndex}
                onNext={handleNext}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Aprende</span>
            <span>• Plataforma Modular de Adquisición Neuro-Lingüística del Español (MCER A1–C1)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={openResearchModal}
              className="hover:text-rose-500 transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Base Científica</span>
            </button>
            <span>Arquitectura React + Vite + Node.js + Prisma</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <DiagnosticModal />
      <LevelUpModal />
      <ResearchInfoModal />
    </div>
  );
};

export default App;
