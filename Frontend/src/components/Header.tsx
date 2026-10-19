import React, { useState, useEffect } from 'react';
import { Sun, Moon, Scan, Menu, X, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SaarthiLogo } from './SaarthiLogo';
import { AboutModal } from './AboutModal';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'detect', 'explanation', 'how-it-works', 'about'];
      const scrollPosition = window.scrollY + 220;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Colorful Accent Line (Indian Tricolor + Tech Royal Gradient) */}
      <div className="w-full h-1 bg-gradient-to-r from-saarthi-saffron via-saarthi-royal-blue to-saarthi-violet"></div>

      <header className="sticky top-0 z-40 w-full bg-linear-surface-light/95 dark:bg-linear-surface-dark/95 backdrop-blur-md border-b border-linear-border-light dark:border-linear-border-dark transition-colors duration-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Custom Brand Logo */}
          <div className="flex items-center space-x-8">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('hero');
              }}
              className="cursor-pointer"
            >
              <SaarthiLogo size={38} />
            </a>

            {/* Smooth Scroll Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              <button
                onClick={() => scrollTo('hero')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeSection === 'hero'
                    ? 'text-saarthi-royal-blue dark:text-blue-400 bg-saarthi-sky dark:bg-saarthi-sky-dark font-bold'
                    : 'text-linear-text-muted hover:text-saarthi-navy dark:text-linear-text-muted-dark dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => scrollTo('features')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeSection === 'features'
                    ? 'text-saarthi-royal-blue dark:text-blue-400 bg-saarthi-sky dark:bg-saarthi-sky-dark font-bold'
                    : 'text-linear-text-muted hover:text-saarthi-navy dark:text-linear-text-muted-dark dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                Features
              </button>

              <button
                onClick={() => scrollTo('detect')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeSection === 'detect'
                    ? 'text-saarthi-royal-blue dark:text-blue-400 bg-saarthi-sky dark:bg-saarthi-sky-dark font-bold'
                    : 'text-linear-text-muted hover:text-saarthi-navy dark:text-linear-text-muted-dark dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                Detection
              </button>

              <button
                onClick={() => scrollTo('explanation')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeSection === 'explanation'
                    ? 'text-saarthi-royal-blue dark:text-blue-400 bg-saarthi-sky dark:bg-saarthi-sky-dark font-bold'
                    : 'text-linear-text-muted hover:text-saarthi-navy dark:text-linear-text-muted-dark dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                AI Explanation
              </button>

              <button
                onClick={() => scrollTo('how-it-works')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeSection === 'how-it-works'
                    ? 'text-saarthi-royal-blue dark:text-blue-400 bg-saarthi-sky dark:bg-saarthi-sky-dark font-bold'
                    : 'text-linear-text-muted hover:text-saarthi-navy dark:text-linear-text-muted-dark dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                How It Works
              </button>

              {/* About Button triggers About Modal Dialog */}
              <button
                onClick={() => setIsAboutModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-saarthi-violet dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors flex items-center gap-1.5"
                title="View Technical Benchmark & Evaluation"
              >
                <Info size={14} />
                <span>About</span>
              </button>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 rounded-xl border border-linear-border-light dark:border-linear-border-dark text-linear-text-muted hover:text-linear-text-light dark:text-linear-text-muted-dark dark:hover:text-linear-text-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
            >
              {theme === 'dark' ? (
                <Sun size={17} className="text-saarthi-saffron" />
              ) : (
                <Moon size={17} className="text-saarthi-navy" />
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => scrollTo('detect')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-saarthi-royal-blue via-saarthi-violet to-saarthi-saffron hover:opacity-95 text-white shadow-elevated hover:shadow-glow transition-all"
            >
              <Scan size={14} />
              <span>Detect Sign</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 rounded-lg text-linear-text-muted hover:text-saarthi-navy dark:text-linear-text-muted-dark dark:hover:text-white"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-b border-linear-border-light dark:border-linear-border-dark bg-linear-surface-light dark:bg-linear-surface-dark px-4 py-3 space-y-1 shadow-elevated">
            <button
              onClick={() => scrollTo('hero')}
              className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg text-saarthi-navy dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg text-saarthi-navy dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo('detect')}
              className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg text-saarthi-navy dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Detection
            </button>
            <button
              onClick={() => scrollTo('explanation')}
              className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg text-saarthi-navy dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              AI Explanation
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg text-saarthi-navy dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAboutModalOpen(true);
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-saarthi-violet dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center gap-1.5"
            >
              <Info size={14} />
              <span>About Project (Evaluation Modal)</span>
            </button>
            <button
              onClick={() => scrollTo('detect')}
              className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet text-white shadow-subtle"
            >
              <Scan size={14} />
              <span>Detect Sign</span>
            </button>
          </div>
        )}
      </header>

      {/* About Modal Dialog */}
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </>
  );
};
