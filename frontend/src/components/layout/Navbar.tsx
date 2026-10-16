import React from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Moon,
  Sun,
  Award,
  BookOpen,
  Image as ImageIcon,
  Edit3,
  Puzzle,
  ChevronDown,
} from 'lucide-react';
import { CefrLevel } from '../../types';
import { useAppStore } from '../../store/useAppStore';

const CEFR_LEVELS: { id: CefrLevel; label: string; name: string }[] = [
  { id: 'A1', label: 'A1', name: 'Principiante' },
  { id: 'A2', label: 'A2', name: 'Elemental' },
  { id: 'B1', label: 'B1', name: 'Intermedio' },
  { id: 'B2', label: 'B2', name: 'Avanzado' },
  { id: 'C1', label: 'C1', name: 'Dominio Operativo' },
];

export const Navbar: React.FC = () => {
  const {
    currentLevel,
    setLevel,
    activeTab,
    setActiveTab,
    totalXp,
    streakDays,
    theme,
    toggleTheme,
    openDiagnosticModal,
    openResearchModal,
  } = useAppStore();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Brand Logo: Dual-coded Spanish Flag / Brain Icon */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden shadow-lg shadow-rose-500/20 ring-2 ring-rose-500/30 flex items-center justify-center bg-gradient-to-br from-rose-600 via-amber-500 to-rose-700">
              {/* Flag Stripes Micro-pattern */}
              <div className="absolute inset-0 flex flex-col opacity-80">
                <div className="h-[28%] bg-rose-600" />
                <div className="h-[44%] bg-amber-400" />
                <div className="h-[28%] bg-rose-600" />
              </div>
              {/* Dual-Coded Brain Icon Overlay */}
              <div className="relative z-10 w-7 h-7 rounded-full bg-slate-950/70 backdrop-blur-sm flex items-center justify-center text-amber-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"/>
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/>
                </svg>
              </div>
            </div>

            <div className="hidden min-[420px]:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Aprende
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  ES
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                Neuro-Linguistic Spanish
              </p>
            </div>
          </div>

          {/* Mode Tabs (Center Navigation) */}
          <nav className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('visual')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'visual'
                  ? 'text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {activeTab === 'visual' && (
                <motion.div
                  layoutId="activeTabBadge"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 shadow-rose-500/20 shadow-md"
                  transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Codificación Visual</span>
                <span className="md:hidden">Visual</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cloze')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'cloze'
                  ? 'text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {activeTab === 'cloze' && (
                <motion.div
                  layoutId="activeTabBadge"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 shadow-amber-500/20 shadow-md"
                  transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Cloze Espaciado</span>
                <span className="md:hidden">Cloze</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('syntax')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'syntax'
                  ? 'text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {activeTab === 'syntax' && (
                <motion.div
                  layoutId="activeTabBadge"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 shadow-sky-500/20 shadow-md"
                  transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Puzzle className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Constructor Sintáctico</span>
                <span className="md:hidden">Sintaxis</span>
              </span>
            </button>
          </nav>

          {/* Right Action Cluster: CEFR Level Selector & Profile/Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* CEFR Level Pill Switcher */}
            <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold font-mono">
              {CEFR_LEVELS.map((lvl) => {
                const isActive = currentLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => setLevel(lvl.id)}
                    className={`px-2.5 py-1.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title={`${lvl.id} - ${lvl.name}`}
                  >
                    {lvl.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile / Compact CEFR Level Selector */}
            <div className="lg:hidden relative">
              <select
                value={currentLevel}
                onChange={(e) => setLevel(e.target.value as CefrLevel)}
                className="appearance-none pl-3 pr-7 py-1.5 text-xs font-bold font-mono rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {CEFR_LEVELS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.id}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            {/* User Profile Mastery Progress Badge (Clickable for Diagnostics) */}
            <button
              onClick={openDiagnosticModal}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-transparent border border-rose-500/20 hover:border-rose-500/40 transition-all text-left shadow-sm group"
              title="Abrir Diagnóstico de Nivel y Competencias"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-extrabold text-xs shadow-md shadow-rose-500/30">
                {currentLevel}
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {totalXp} XP
                  </span>
                  <div className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500">
                    <Flame className="w-3 h-3 fill-amber-500" />
                    <span>{streakDays}d</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span>Diagnóstico</span>
                  <Award className="w-3 h-3 text-rose-500" />
                </div>
              </div>
            </button>

            {/* Evidence-Based Methodology Explainer Button */}
            <button
              onClick={openResearchModal}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title="Evidencia Científica y Fundamento Neuro-Lingüístico"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
