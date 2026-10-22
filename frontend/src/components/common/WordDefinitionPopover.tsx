import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dictionaryService, WordDefinition } from '../../services/dictionaryService';
import { X, Languages, Sparkles } from 'lucide-react';

interface PopoverState {
  definition: WordDefinition;
  rawWord: string;
  x: number;
  y: number;
  placement: 'top' | 'bottom';
}

export const WordDefinitionPopover: React.FC = () => {
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDoubleClick = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const selectedText = selection.toString().trim();
      // Allow single Spanish word or hyphenated compound (1 to 35 chars)
      if (!selectedText || selectedText.length > 35 || /\s{2,}/.test(selectedText)) {
        return;
      }

      // Extract the primary word in case multiple words were highlighted
      const cleanTarget = selectedText.split(/\s+/)[0];
      const definition = dictionaryService.lookup(cleanTarget);

      if (!definition) {
        // Fallback info if word is not yet in the core dictionary
        const clean = dictionaryService.cleanWord(cleanTarget);
        if (clean.length > 1) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          positionPopover(rect, {
            word: clean,
            lemma: clean,
            pos: 'Término en español',
            translation: `"${clean}" (término contextual)`,
            grammarNote: 'Haz doble clic en verbos o palabras clave del ejercicio para ver su traducción completa.',
          }, cleanTarget);
        }
        return;
      }

      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        positionPopover(rect, definition, cleanTarget);
      } catch (err) {
        console.warn('[WordPopover] Could not compute range coordinates:', err);
      }
    };

    const positionPopover = (rect: DOMRect, def: WordDefinition, raw: string) => {
      const popoverWidth = 280;
      const popoverHeight = 130;

      // Calculate horizontal center aligned with the word
      let x = rect.left + rect.width / 2 - popoverWidth / 2;
      x = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, x));

      // Prefer above the word; if too close to top bar, position below
      let y = rect.top - popoverHeight - 10;
      let placement: 'top' | 'bottom' = 'top';

      if (y < 70) {
        y = rect.bottom + 10;
        placement = 'bottom';
      }

      setPopover({
        definition: def,
        rawWord: raw,
        x,
        y: y + window.scrollY,
        placement,
      });
    };

    const handleDismiss = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPopover(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPopover(null);
      }
    };

    const handleScroll = () => {
      // Dismiss on scroll to avoid misalignment
      if (popover) {
        setPopover(null);
      }
    };

    document.addEventListener('dblclick', handleDoubleClick);
    document.addEventListener('mousedown', handleDismiss);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('dblclick', handleDoubleClick);
      document.removeEventListener('mousedown', handleDismiss);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [popover]);

  if (!popover) return null;

  return (
    <AnimatePresence>
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: `${popover.y}px`,
          left: `${popover.x}px`,
          zIndex: 9999,
        }}
        className="pointer-events-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: popover.placement === 'top' ? 6 : -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="w-[280px] p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xl shadow-slate-900/20 text-slate-900 dark:text-slate-100 space-y-2 select-none"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="font-extrabold text-base text-rose-600 dark:text-rose-400 truncate">
                {popover.definition.word}
              </span>
              {popover.definition.lemma && popover.definition.lemma !== popover.definition.word && (
                <span className="text-[10px] text-slate-400 font-mono truncate">
                  ({popover.definition.lemma})
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {popover.definition.pos}
              </span>
              <button
                onClick={() => setPopover(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Cerrar traducción"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Translation Result */}
          <div className="flex items-start gap-2">
            <Languages className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                {popover.definition.translation}
              </div>
              {popover.definition.grammarNote && (
                <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {popover.definition.grammarNote}
                </div>
              )}
            </div>
          </div>

          {/* Footer Tip */}
          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
            <span className="flex items-center gap-1 text-amber-500 font-medium">
              <Sparkles className="w-3 h-3" />
              Diccionario Local Instantáneo
            </span>
            <span className="font-mono text-slate-400">Esc para cerrar</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
