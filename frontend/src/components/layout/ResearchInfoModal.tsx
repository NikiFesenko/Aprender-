import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Brain, Zap, Puzzle, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ResearchInfoModal: React.FC = () => {
  const { isResearchModalOpen, closeResearchModal } = useAppStore();

  if (!isResearchModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Fundamentación Científica y Evidencia Pedagógica
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Las 3 técnicas no audiovisuales integradas en la plataforma Aprende
                </p>
              </div>
            </div>

            <button
              onClick={closeResearchModal}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Technique 1 */}
          <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-slate-800/40 border border-rose-200/50 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <Brain className="w-4 h-4" />
              <span>1. Codificación Dual y Asociación Contextual (Paivio, 1971; Nation, 2001)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              La Teoría de la Doble Codificación demuestra que la memoria humana procesa información mediante dos canales independientes: el sistema verbal (logogenes) y el sistema no verbal o visual (imagotipos). Al asociar ilustraciones vectoriales con fragmentos oracionales, el cerebro genera huellas mnémicas duplicadas, incrementando la retención de desinencias de género (-o/-a) y flexiones verbales hasta en un 200% frente a la lectura de texto plano.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-rose-700 dark:text-rose-300 font-semibold pt-1">
              <Check className="w-3.5 h-3.5 text-rose-500" />
              <span>Implementado en la pestaña "Codificación Visual" con gráficos SVG de alto contraste.</span>
            </div>
          </div>

          {/* Technique 2 */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-slate-800/40 border border-amber-200/50 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>2. Test Cloze con Recuperación Espaciada (Ebbinghaus, 1885; Hermann, 2006)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              La práctica de recuperación forzada (Retrieval Practice) mediante oraciones mutiladas (Cloze) obliga al estudiante a reconstruir activamente la estructura morfosintáctica desde la memoria a largo plazo en lugar de un mero reconocimiento pasivo de opciones. El intervalo de repetición se ajusta algorítmicamente según la latencia de respuesta y la precisión, aplanando la curva del olvido.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-700 dark:text-amber-300 font-semibold pt-1">
              <Check className="w-3.5 h-3.5 text-amber-500" />
              <span>Implementado en la pestaña "Cloze Espaciado" con pistas morfosintácticas multinivel.</span>
            </div>
          </div>

          {/* Technique 3 */}
          <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-slate-800/40 border border-sky-200/50 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
              <Puzzle className="w-4 h-4" />
              <span>3. Desconstrucción y Cebado Sintáctico (Schmidt, 1990: Noticing Hypothesis)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Según la Hipótesis de la Noticia (Noticing Hypothesis), los aprendices de segundas lenguas no interiorizan reglas gramaticales complejas hasta que prestan atención consciente a las diferencias entre su lengua materna y la meta. Reorganizar piezas léxicas desordenadas obliga al cerebro a verificar la colocación de clíticos antepuestos ("no me lo digas"), la concordancia restrictiva y el orden relativo del español.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-sky-700 dark:text-sky-300 font-semibold pt-1">
              <Check className="w-3.5 h-3.5 text-sky-500" />
              <span>Implementado en la pestaña "Constructor Sintáctico" con análisis de roles gramaticales.</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={closeResearchModal}
              className="w-full py-3 rounded-xl font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-sm shadow-md"
            >
              Comprendido
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
