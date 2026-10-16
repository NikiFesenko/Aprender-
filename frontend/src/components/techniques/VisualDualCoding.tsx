import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Sparkles, BookOpen, ArrowRight, RotateCcw, Brain, ShieldCheck } from 'lucide-react';
import { Exercise, VisualDualCodingMetadata } from '../../types';
import { SvgIllustrations } from './SvgIllustrations';
import { useAppStore } from '../../store/useAppStore';

interface VisualDualCodingProps {
  exercise: Exercise;
  totalExercises: number;
  currentIndex: number;
  onNext: () => void;
}

export const VisualDualCoding: React.FC<VisualDualCodingProps> = ({
  exercise,
  totalExercises,
  currentIndex,
  onNext,
}) => {
  const metadata = exercise.metadata as VisualDualCodingMetadata;
  const { recordExerciseResult, currentLevel } = useAppStore();

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());
  const [earnedXpDisplay, setEarnedXpDisplay] = useState<number | null>(null);

  // Reset local state when exercise changes
  useEffect(() => {
    setSelectedWord(null);
    setHasSubmitted(false);
    setIsCorrect(false);
    setEarnedXpDisplay(null);
  }, [exercise.id]);

  const handleSelectWord = (word: string) => {
    if (hasSubmitted) return;
    setSelectedWord(word);
  };

  const handleVerify = async () => {
    if (!selectedWord || hasSubmitted) return;

    const correct = selectedWord.trim().toLowerCase() === metadata.targetBlankWord.trim().toLowerCase();
    const timeSpent = Date.now() - startTime;

    setIsCorrect(correct);
    setHasSubmitted(true);

    const result = await recordExerciseResult({
      exerciseId: exercise.id,
      level: currentLevel,
      type: 'VISUAL_DUAL_CODING',
      isCorrect: correct,
      timeSpentMs: timeSpent,
      userResponse: selectedWord,
    });

    setEarnedXpDisplay(result.earnedXp);
  };

  const handleReset = () => {
    setSelectedWord(null);
    setHasSubmitted(false);
    setIsCorrect(false);
    setEarnedXpDisplay(null);
  };

  // Render sentence with dynamic replacement of blank
  const renderSentenceWithBlank = () => {
    const parts = metadata.sentenceFragment.split('_____');
    return (
      <div className="text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed my-4 p-5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-inner">
        <span>{parts[0]}</span>
        <span
          className={`inline-block mx-2 px-4 py-1.5 rounded-xl border-2 font-bold transition-all min-w-[130px] text-center shadow-sm ${
            !selectedWord
              ? 'border-dashed border-rose-400/60 text-slate-400 bg-rose-50/50 dark:bg-rose-950/20 animate-pulse'
              : hasSubmitted
              ? isCorrect
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : 'border-rose-500 bg-rose-500/20 text-rose-700 dark:text-rose-300 animate-shake'
              : 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-md'
          }`}
        >
          {selectedWord || '__________'}
        </span>
        <span>{parts[1] || ''}</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Research Methodology Header Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-transparent border border-rose-500/20 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-rose-500" />
          <span className="font-semibold text-rose-600 dark:text-rose-400">Técnica 1: Codificación Dual (Paivio, 1971)</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline">Anclaje visual + morfología sintáctica</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold">
            {currentIndex + 1} / {totalExercises}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {currentLevel}
          </span>
        </div>
      </div>

      {/* Main Dual-Coding Interactive Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
        {/* Visual Scene Container */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] max-h-[300px] shadow-lg border border-slate-200/60 dark:border-slate-800/80">
            <SvgIllustrations type={metadata.svgType} />
            <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md text-xs text-slate-200 border border-slate-700/50 flex items-center justify-between">
              <span className="font-medium flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {metadata.svgTitle}
              </span>
              <span className="text-amber-300 font-mono hidden md:inline">{metadata.visualCueNote}</span>
            </div>
          </div>
        </div>

        {/* Textual & Grammatical Association Area */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold tracking-wide text-rose-600 dark:text-rose-400 uppercase">
              {exercise.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-base">{exercise.prompt}</p>
          </div>

          {/* Contextual Sentence with Dynamic Blank */}
          {renderSentenceWithBlank()}

          {/* Interactive Word Option Tiles */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>Selecciona la concordancia precisa:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {metadata.options.map((option) => {
                const isSelected = selectedWord === option;
                let tileStyle = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-md';

                if (isSelected && !hasSubmitted) {
                  tileStyle = 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/30';
                } else if (hasSubmitted) {
                  if (option.toLowerCase() === metadata.targetBlankWord.toLowerCase()) {
                    tileStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold';
                  } else if (isSelected && !isCorrect) {
                    tileStyle = 'border-rose-500 bg-rose-500/20 text-rose-600 dark:text-rose-400 line-through';
                  } else {
                    tileStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                  }
                }

                return (
                  <motion.button
                    key={option}
                    whileHover={{ scale: hasSubmitted ? 1 : 1.02 }}
                    whileTap={{ scale: hasSubmitted ? 1 : 0.98 }}
                    onClick={() => handleSelectWord(option)}
                    disabled={hasSubmitted}
                    className={`py-3.5 px-4 rounded-xl border text-center font-medium text-lg transition-all shadow-sm ${tileStyle}`}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              {hasSubmitted && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reintentar
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!hasSubmitted ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleVerify}
                  disabled={!selectedWord}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
                    selectedWord
                      ? 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 shadow-rose-500/30'
                      : 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  Verificar Concordancia
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
                  <span>Siguiente Ejercicio</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Feedback & Morphosyntax Pattern Analysis */}
        <AnimatePresence>
          {hasSubmitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-6 border-t ${
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

                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold text-lg">
                      {isCorrect ? '¡Excelente concordancia sintáctica!' : 'Revisión morfosintáctica requerida'}
                    </span>
                    {earnedXpDisplay !== null && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        +{earnedXpDisplay} XP Conseguidos
                      </span>
                    )}
                  </div>

                  {/* Morphosyntax Rule Card */}
                  <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-sm space-y-2">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs uppercase tracking-wide">
                      <BookOpen className="w-4 h-4" />
                      {metadata.morphoSyntaxBreakdown.rule}
                    </div>
                    <div className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-800 dark:text-slate-200">
                      Patrón: {metadata.morphoSyntaxBreakdown.pattern}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                      {metadata.morphoSyntaxBreakdown.explanation}
                    </p>
                  </div>

                  {/* Dual-Coding Scientific Anchor Note */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <Brain className="w-3.5 h-3.5 text-rose-500" />
                    <span>
                      <strong>Neuro-asociación:</strong> La imagen de la escena ha activado el código visual (sistema de imagotipos), facilitando que la desinencia gramatical se retenga a largo plazo.
                    </span>
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
