import React from 'react';
import { X, CheckCircle2, ShieldCheck, Cpu, Database, Award, ExternalLink } from 'lucide-react';
import { SaarthiLogo } from './SaarthiLogo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-linear-surface-light dark:bg-linear-surface-dark border border-linear-border-light dark:border-linear-border-dark rounded-2xl shadow-elevated p-6 text-linear-text-light dark:text-linear-text-dark max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
      >
        {/* Header with Colorful Logo */}
        <div className="flex items-center justify-between pb-4 border-b border-linear-border-light dark:border-linear-border-dark">
          <SaarthiLogo size={36} showText={true} />
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-linear-text-muted hover:text-saarthi-navy dark:text-linear-text-muted-dark dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 space-y-6 text-sm">
          {/* Mission */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-saarthi-sky/60 via-purple-50/40 to-amber-50/40 dark:from-saarthi-sky-dark/40 dark:via-purple-950/30 dark:to-amber-950/20 border border-saarthi-royal-blue/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-saarthi-royal-blue dark:text-blue-400 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck size={14} />
              Mission & Statutory Purpose
            </h3>
            <p className="leading-relaxed text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
              <strong className="text-saarthi-navy dark:text-white font-bold">Traffic Sign Saarthi AI</strong> ("Saarthi" representing a trusted charioteer and road guide) addresses road safety across Indian national and state highway networks. It bridges deep learning image classification with official statutory regulations (IRC:67-2022 & Motor Vehicles Act) to explain not just <em>what</em> a sign is, but <em>why</em> it matters and <em>what driver actions</em> are mandated by law.
            </p>
          </div>

          {/* Model Architecture & Benchmark */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-saarthi-navy dark:text-slate-200">
                Empirical Deep Learning Evaluation
              </h3>
              <span className="text-[11px] font-bold text-green-600 dark:text-green-400">
                ResNet18: 87.58% Test Accuracy
              </span>
            </div>
            
            <div className="border border-linear-border-light dark:border-linear-border-dark rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-gradient-to-r from-saarthi-sky to-purple-50 dark:from-slate-800 dark:to-slate-800 text-saarthi-navy dark:text-white font-bold border-b border-linear-border-light dark:border-linear-border-dark">
                  <tr>
                    <th className="py-2.5 px-3">Architecture</th>
                    <th className="py-2.5 px-3">Test Accuracy</th>
                    <th className="py-2.5 px-3">Macro Precision</th>
                    <th className="py-2.5 px-3">Macro Recall</th>
                    <th className="py-2.5 px-3">Macro F1</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-linear-border-light dark:divide-linear-border-dark">
                  <tr className="bg-saarthi-sky/60 dark:bg-saarthi-sky-dark/60 font-bold">
                    <td className="py-2.5 px-3 text-saarthi-royal-blue flex items-center gap-1.5">
                      <Award size={14} className="text-saarthi-saffron" /> ResNet18 (Production)
                    </td>
                    <td className="py-2.5 px-3 font-extrabold text-green-600 dark:text-green-400">87.58%</td>
                    <td className="py-2.5 px-3">74.27%</td>
                    <td className="py-2.5 px-3">72.84%</td>
                    <td className="py-2.5 px-3">72.25%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">MobileNetV2</td>
                    <td className="py-2.5 px-3 font-semibold text-saarthi-navy dark:text-white">87.17%</td>
                    <td className="py-2.5 px-3">71.04%</td>
                    <td className="py-2.5 px-3">70.50%</td>
                    <td className="py-2.5 px-3">69.34%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">EfficientNet-B0</td>
                    <td className="py-2.5 px-3 font-semibold text-saarthi-navy dark:text-white">82.69%</td>
                    <td className="py-2.5 px-3">65.65%</td>
                    <td className="py-2.5 px-3">64.48%</td>
                    <td className="py-2.5 px-3">63.48%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-slate-500 font-medium">Custom CNN (Baseline)</td>
                    <td className="py-2.5 px-3 font-semibold">71.82%</td>
                    <td className="py-2.5 px-3">56.93%</td>
                    <td className="py-2.5 px-3">54.99%</td>
                    <td className="py-2.5 px-3">52.68%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-linear-text-muted dark:text-linear-text-muted-dark">
              Evaluated across 85 distinct Indian traffic sign categories with 4,438 training images and 1,288 held-out test images.
            </p>
          </div>

          {/* Technical Architecture Triple Pill */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-3.5 bg-gradient-to-br from-saarthi-sky/50 to-white dark:from-slate-800 dark:to-slate-800/60 rounded-xl border border-saarthi-royal-blue/30">
              <div className="flex items-center gap-1.5 text-saarthi-royal-blue font-bold text-xs mb-1">
                <Database size={14} /> 85 Categories
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Mandatory, cautionary, and informatory road signs across India.
              </p>
            </div>
            <div className="p-3.5 bg-gradient-to-br from-purple-50/50 to-white dark:from-slate-800 dark:to-slate-800/60 rounded-xl border border-saarthi-violet/30">
              <div className="flex items-center gap-1.5 text-saarthi-violet font-bold text-xs mb-1">
                <Cpu size={14} /> 224×224 Normalization
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Matches the exact preprocessing input pipeline of evaluated ResNet18.
              </p>
            </div>
            <div className="p-3.5 bg-gradient-to-br from-amber-50/50 to-white dark:from-slate-800 dark:to-slate-800/60 rounded-xl border border-saarthi-saffron/30">
              <div className="flex items-center gap-1.5 text-saarthi-saffron font-bold text-xs mb-1">
                <ShieldCheck size={14} /> IRC:67-2022
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Official Indian Roads Congress standards and Motor Vehicles Act 2019.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-linear-border-light dark:border-linear-border-dark flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-saarthi-royal-blue hover:bg-saarthi-royal-hover text-white shadow-subtle transition-colors"
          >
            Close Evaluation
          </button>
        </div>
      </div>
    </div>
  );
};
