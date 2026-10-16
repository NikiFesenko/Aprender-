import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Timer,
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { Exercise, SpacedClozeMetadata } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface SpacedClozeProps {
  exercise: Exercise;
  totalExercises: number;
  currentIndex: number;
  onNext: () => void;
}

export const SpacedClozeRecall: React.FC<SpacedClozeProps> = ({
  exercise,
  totalExercises,
  currentIndex,
  onNext,
}) => {
  const metadata = exercise.metadata as SpacedClozeMetadata;
  const { recordExerciseResult, currentLevel } = useAppStore();

  const [inputVal, setInputVal] = useState<string>('');
  const [activeHintTab, setActiveHintTab] = useState<'grammar' | 'root' | 'synonym' | null>(null);
  const [hintsUnlockedCount, setHintsUnlockedCount] = useState<number>(0);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [srsIntervalText, setSrsIntervalText] = useState<string>('3 días');
  const [earnedXpDisplay, setEarnedXpDisplay] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input and reset on exercise change
  useEffect(() => {
    setInputVal('');
    setActiveHintTab(null);
    setHintsUnlockedCount(0);
    setHasSubmitted(false);
    setIsCorrect(false);
    setSecondsElapsed(0);
    setIsTimerRunning(true);
    setEarnedXpDisplay(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [exercise.id]);

  // Response timer for retrieval latency calculation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && !hasSubmitted) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, hasSubmitted]);

  // Insert Spanish accent or symbol
  const handleInsertChar = (char: string) => {
    if (hasSubmitted) return;
    setInputVal((prev) => prev + char);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleToggleHint = (tab: 'grammar' | 'root' | 'synonym') => {
    if (activeHintTab === tab) {
      setActiveHintTab(null);
    } else {
      setActiveHintTab(tab);
      setHintsUnlockedCount((prev) => prev + 1);
    }
  };

  const normalize = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || hasSubmitted) return;

    setIsTimerRunning(false);
    const userClean = inputVal.trim().toLowerCase();
    const targetClean = metadata.correctAnswer.trim().toLowerCase();
    const altCleans = (metadata.acceptableAlternatives || []).map((a) => a.trim().toLowerCase());

    const exactMatch = userClean === targetClean || altCleans.includes(userClean);
    const accentTolerantMatch = normalize(userClean) === normalize(targetClean);

    const correct = exactMatch || accentTolerantMatch;
    setIsCorrect(correct);
    setHasSubmitted(true);

    // Compute automatic SRS interval estimate based on speed and hint usage
    let intervalLabel = '3 días';
    let difficulty: 'again' | 'hard' | 'good' | 'easy' = 'good';

    if (!correct) {
      intervalLabel = '1 hora (Repaso Inmediato)';
      difficulty = 'again';
    } else if (hintsUnlockedCount > 1 || secondsElapsed > 20) {
      intervalLabel = '12 horas (Refuerzo)';
      difficulty = 'hard';
    } else if (secondsElapsed < 6 && hintsUnlockedCount === 0) {
      intervalLabel = '7 días (Recuperación Óptima)';
      difficulty = 'easy';
    } else {
      intervalLabel = '3 días (Intervalo Estándar)';
      difficulty = 'good';
    }

    setSrsIntervalText(intervalLabel);

    const result = await recordExerciseResult({
      exerciseId: exercise.id,
      level: currentLevel,
      type: 'SPACED_CLOZE',
      isCorrect: correct,
      timeSpentMs: secondsElapsed * 1000,
      userResponse: inputVal,
      difficultyRating: difficulty,
    });

    setEarnedXpDisplay(result.earnedXp);
  };

  const handleSrsOverride = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    const map = {
      again: '1 hora (Re-estudiar)',
      hard: '12 horas (Consolidar)',
      good: '3 días (Intervalo Regular)',
      easy: '7 días (Dominado)',
    };
    setSrsIntervalText(map[rating]);
  };

  // Render sentence with inline input
  const renderSentenceWithInput = () => {
    const parts = metadata.sentenceWithBlank.split('_____');
    return (
      <div className="text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed my-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-inner">
        <span>{parts[0]}</span>
        <span className="inline-block mx-1.5 align-middle">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={hasSubmitted}
            placeholder="escribe aquí..."
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            className={`w-40 sm:w-52 px-3 py-1.5 text-center font-bold rounded-xl border-2 outline-none text-xl transition-all shadow-sm ${
              !hasSubmitted
                ? 'border-rose-500 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 focus:ring-4 focus:ring-rose-500/20'
                : isCorrect
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : 'border-rose-500 bg-rose-500/20 text-rose-700 dark:text-rose-300 animate-shake'
            }`}
          />
        </span>
        <span>{parts[1] || ''}</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Research Methodology Header Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-amber-500/20 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            Técnica 2: Test Cloze con Repetición Espaciada (Ebbinghaus & Hermann)
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline">Recuperación activa sin opciones previas</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Timer className="w-3.5 h-3.5 text-amber-500" />
            <span>{secondsElapsed}s</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold font-mono">
            {currentIndex + 1} / {totalExercises}
          </span>
        </div>
      </div>

      {/* Main Cloze Test Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Title & Prompt */}
        <div className="space-y-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
              {metadata.cefrGrammarTopic}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
              CEFR {exercise.level}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{exercise.title}</h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">{exercise.prompt}</p>
        </div>

        {/* Translation Banner */}
        <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 italic flex items-center gap-2">
          <span className="not-italic text-xs font-bold uppercase tracking-wide text-slate-400">Contexto (EN):</span>
          <span>"{metadata.translation}"</span>
        </div>

        {/* Interactive Cloze Sentence Form */}
        <form onSubmit={handleSubmit}>
          {renderSentenceWithInput()}

          {/* Spanish Special Characters Keyboard Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Caracteres:</span>
            {['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'].map((char) => (
              <button
                key={char}
                type="button"
                onClick={() => handleInsertChar(char)}
                disabled={hasSubmitted}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors border border-slate-200 dark:border-slate-700 disabled:opacity-50"
              >
                {char}
              </button>
            ))}
          </div>

          {/* Tiered Hint System */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Pistas Morfosintácticas (Scaffolding):</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleToggleHint('grammar')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  activeHintTab === 'grammar'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Pista Gramatical
              </button>

              <button
                type="button"
                onClick={() => handleToggleHint('root')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  activeHintTab === 'root'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>Raíz / Infinitivo</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleHint('synonym')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  activeHintTab === 'synonym'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>Sinónimo Español</span>
              </button>
            </div>

            {/* Active Hint Dropdown Box */}
            <AnimatePresence>
              {activeHintTab && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200"
                >
                  {activeHintTab === 'grammar' && (
                    <p>
                      <strong>Pauta Gramatical:</strong> {metadata.hints.grammarCue}
                    </p>
                  )}
                  {activeHintTab === 'root' && (
                    <p>
                      <strong>Forma base / Raíz:</strong> {metadata.hints.englishRoot}
                    </p>
                  )}
                  {activeHintTab === 'synonym' && (
                    <p>
                      <strong>Equivalente / Sinónimo en contexto:</strong> {metadata.hints.synonym}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Submission Buttons */}
          <div className="pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              {hasSubmitted && (
                <button
                  type="button"
                  onClick={() => {
                    setInputVal('');
                    setHasSubmitted(false);
                    setIsCorrect(false);
                    setIsTimerRunning(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Intentar Otra Vez
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!hasSubmitted ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={!inputVal.trim()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
                    inputVal.trim()
                      ? 'bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 shadow-rose-500/20'
                      : 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Confirmar Respuesta
                </motion.button>
              ) : (
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={onNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/30 transition-all"
                >
                  <span>Siguiente Desafío</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </form>

        {/* Spaced Repetition Feedback & Scheduling Card */}
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

                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold text-lg">
                      {isCorrect ? '¡Recuperación correcta!' : `Respuesta esperada: "${metadata.correctAnswer}"`}
                    </span>
                    {earnedXpDisplay !== null && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        +{earnedXpDisplay} XP
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed">{exercise.explanation}</p>

                  {/* SRS Interval Rating Bar */}
                  <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        Próxima aparición calculada (Algoritmo Hermann/Ebbinghaus):
                      </span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        {srsIntervalText}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500">¿Cómo evaluarías la dificultad de esta recuperación?</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSrsOverride('again')}
                        className="py-1.5 px-2 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        Repetir (1h)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSrsOverride('hard')}
                        className="py-1.5 px-2 rounded-lg border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-xs font-medium hover:bg-amber-50 dark:hover:bg-amber-950/40"
                      >
                        Difícil (12h)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSrsOverride('good')}
                        className="py-1.5 px-2 rounded-lg border border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      >
                        Bien (3d)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSrsOverride('easy')}
                        className="py-1.5 px-2 rounded-lg border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      >
                        Fácil (7d)
                      </button>
                    </div>
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
