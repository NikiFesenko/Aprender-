import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Puzzle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowDownUp,
  Info,
} from 'lucide-react';
import { Exercise, SyntacticConstructorMetadata } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface SyntacticConstructorProps {
  exercise: Exercise;
  totalExercises: number;
  currentIndex: number;
  onNext: () => void;
}

interface TileItem {
  id: string;
  text: string;
}

export const SyntacticConstructor: React.FC<SyntacticConstructorProps> = ({
  exercise,
  totalExercises,
  currentIndex,
  onNext,
}) => {
  const metadata = exercise.metadata as SyntacticConstructorMetadata;
  const { recordExerciseResult, currentLevel } = useAppStore();

  const [bankTiles, setBankTiles] = useState<TileItem[]>([]);
  const [placedTiles, setPlacedTiles] = useState<TileItem[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());
  const [earnedXpDisplay, setEarnedXpDisplay] = useState<number | null>(null);

  // Initialize and shuffle tiles on exercise change
  useEffect(() => {
    const initialTiles: TileItem[] = metadata.scrambledTokens.map((token, idx) => ({
      id: `${token}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      text: token,
    }));
    setBankTiles(initialTiles);
    setPlacedTiles([]);
    setHasSubmitted(false);
    setIsCorrect(false);
    setEarnedXpDisplay(null);
  }, [exercise.id]);

  const handleTileClickBank = (tile: TileItem) => {
    if (hasSubmitted) return;
    setBankTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setPlacedTiles((prev) => [...prev, tile]);
  };

  const handleTileClickPlaced = (tile: TileItem) => {
    if (hasSubmitted) return;
    setPlacedTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setBankTiles((prev) => [...prev, tile]);
  };

  const handleReset = () => {
    const initialTiles: TileItem[] = metadata.scrambledTokens.map((token, idx) => ({
      id: `${token}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      text: token,
    }));
    setBankTiles(initialTiles);
    setPlacedTiles([]);
    setHasSubmitted(false);
    setIsCorrect(false);
    setEarnedXpDisplay(null);
  };

  const cleanToken = (str: string) => str.trim().replace(/[.,;!?¿¡]/g, '').toLowerCase();

  const handleVerify = async () => {
    if (placedTiles.length === 0 || hasSubmitted) return;

    const currentSentence = placedTiles.map((t) => t.text).join(' ');
    const targetSentence = metadata.targetTokens.join(' ');

    // Also check acceptable alternative permutations if specified
    const currentTokens = placedTiles.map((t) => t.text);
    let matched = currentSentence === targetSentence;

    if (!matched && metadata.acceptableSequences) {
      matched = metadata.acceptableSequences.some(
        (seq) => seq.join(' ') === currentSentence
      );
    }

    // Token-level soft check (for punctuation/casing variants)
    if (!matched) {
      const currentClean = currentTokens.map(cleanToken).join(' ');
      const targetClean = metadata.targetTokens.map(cleanToken).join(' ');
      if (currentClean === targetClean) {
        matched = true;
      }
    }

    const timeSpent = Date.now() - startTime;
    setIsCorrect(matched);
    setHasSubmitted(true);

    const result = await recordExerciseResult({
      exerciseId: exercise.id,
      level: currentLevel,
      type: 'SYNTACTIC_CONSTRUCTOR',
      isCorrect: matched,
      timeSpentMs: timeSpent,
      userResponse: currentSentence,
    });

    setEarnedXpDisplay(result.earnedXp);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Research Methodology Header Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500/10 via-rose-500/10 to-transparent border border-sky-500/20 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Puzzle className="w-4 h-4 text-sky-500" />
          <span className="font-semibold text-sky-600 dark:text-sky-400">
            Técnica 3: Constructor Sintáctico & Desconstrucción (Schmidt, 1990)
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline">Noticing Hypothesis y cebado sintáctico</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold">
            {currentIndex + 1} / {totalExercises}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {currentLevel}
          </span>
        </div>
      </div>

      {/* Main Syntactic Constructor Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Prompt Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-semibold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
              Reconstrucción de Orden Gramatical
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
              CEFR {exercise.level}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{exercise.title}</h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">{exercise.prompt}</p>
        </div>

        {/* English Semantic Cue Box */}
        <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-500/20 text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
            <Info className="w-3.5 h-3.5" />
            Enunciado Semántico a Construir:
          </div>
          <div className="text-lg md:text-xl font-semibold italic">"{metadata.englishPrompt}"</div>
        </div>

        {/* Construction Work Area (Placed Tiles Bench) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-500" />
              Banco de Ensamblaje Sintáctico:
            </span>
            {placedTiles.length > 0 && !hasSubmitted && (
              <span className="text-slate-400 font-normal">Haz clic en una pieza para retirarla</span>
            )}
          </div>

          <div
            className={`min-h-[100px] p-4 rounded-2xl border-2 flex flex-wrap items-center gap-2.5 transition-all ${
              placedTiles.length === 0
                ? 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 justify-center text-slate-400 text-sm'
                : hasSubmitted
                ? isCorrect
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-rose-500 bg-rose-500/10'
                : 'border-sky-500/60 bg-sky-50/20 dark:bg-slate-800/40 shadow-inner'
            }`}
          >
            {placedTiles.length === 0 ? (
              <span className="flex items-center gap-2">
                <ArrowDownUp className="w-4 h-4 text-slate-400" />
                Haz clic en las piezas inferiores para construir la frase en orden gramatical
              </span>
            ) : (
              placedTiles.map((tile, idx) => (
                <motion.button
                  key={tile.id}
                  layout
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  whileHover={{ scale: hasSubmitted ? 1 : 1.05 }}
                  onClick={() => handleTileClickPlaced(tile)}
                  disabled={hasSubmitted}
                  className={`px-3.5 py-2 rounded-xl font-medium text-base shadow-sm border transition-all flex items-center gap-1.5 ${
                    hasSubmitted
                      ? isCorrect
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-800 dark:text-rose-200'
                      : 'bg-white dark:bg-slate-800 border-sky-400 text-slate-800 dark:text-slate-100 hover:border-rose-500'
                  }`}
                >
                  <span className="text-xs font-mono text-slate-400 font-bold">{idx + 1}.</span>
                  <span>{tile.text}</span>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Available Word Tiles Bank */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Piezas Léxicas Disponibles:
          </div>
          <div className="min-h-[70px] p-4 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-wrap gap-2.5 items-center">
            {bankTiles.length === 0 ? (
              <span className="text-xs text-slate-400 italic">Todas las piezas han sido colocadas en el banco superior.</span>
            ) : (
              bankTiles.map((tile) => (
                <motion.button
                  key={tile.id}
                  layout
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTileClickBank(tile)}
                  disabled={hasSubmitted}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium text-base shadow hover:border-sky-500 dark:hover:border-sky-400 hover:shadow-md transition-all"
                >
                  {tile.text}
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar Piezas
            </button>
          </div>

          <div className="flex items-center gap-3">
            {!hasSubmitted ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleVerify}
                disabled={placedTiles.length === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
                  placedTiles.length > 0
                    ? 'bg-gradient-to-r from-sky-600 to-rose-600 hover:from-sky-500 hover:to-rose-500 shadow-sky-500/20'
                    : 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                Validar Sintaxis
              </motion.button>
            ) : (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/30 transition-all"
              >
                <span>Siguiente Estructura</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Syntactic Deep Dive Breakdown */}
        <AnimatePresence>
          {hasSubmitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-6 rounded-2xl border ${
                isCorrect
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-900 dark:text-emerald-100'
                  : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-500/30 text-rose-900 dark:text-rose-100'
              }`}
            >
              <div className="flex items-start gap-4">
                {isCorrect ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-7 h-7 text-rose-500 shrink-0 mt-0.5" />
                )}

                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold text-lg">
                      {isCorrect ? '¡Estructura sintáctica impecable!' : 'Secuencia no válida en este contexto'}
                    </span>
                    {earnedXpDisplay !== null && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        +{earnedXpDisplay} XP Sintácticos
                      </span>
                    )}
                  </div>

                  {!isCorrect && (
                    <div className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-rose-200 dark:border-rose-900 text-sm">
                      <span className="text-xs font-bold text-rose-500 uppercase block mb-1">Orden canónico requerido:</span>
                      <span className="font-semibold text-rose-700 dark:text-rose-300">
                        {metadata.targetTokens.join(' ')}
                      </span>
                    </div>
                  )}

                  {/* Syntactic Analysis & Roles Map */}
                  <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-sky-500" />
                      Análisis Sintáctico Funcional (Schmidt's Noticing):
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {Object.entries(metadata.syntacticCategoryNotes).map(([token, role]) => (
                        <div
                          key={token}
                          className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2"
                        >
                          <span className="font-mono font-bold text-sky-600 dark:text-sky-400 shrink-0">
                            "{token}"
                          </span>
                          <span className="text-slate-600 dark:text-slate-300">{role}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <strong>Fundamento Gramatical:</strong> {metadata.syntaxRuleExplanation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
