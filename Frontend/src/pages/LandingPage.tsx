import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, CheckCircle2, Shield, Eye, BookOpen, Layers, Award, Sparkles } from 'lucide-react';
import {
  HeroRoadIllustration,
  WorkflowUploadIllustration,
  WorkflowRecognitionIllustration,
  WorkflowExplanationIllustration
} from '../components/Illustrations';
import { SampleSign } from '../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [samples, setSamples] = useState<SampleSign[]>([]);

  useEffect(() => {
    fetch('/api/samples')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setSamples(data.slice(0, 8));
        }
      })
      .catch(() => {
        // Fallback static samples if backend is starting up
        setSamples([
          { class_name: 'STOP', title: 'Stop', category: 'Mandatory / Regulatory', category_type: 'mandatory', image_url: '/api/sample-image/STOP' },
          { class_name: 'GIVE_WAY', title: 'Give Way', category: 'Mandatory / Regulatory', category_type: 'mandatory', image_url: '/api/sample-image/GIVE_WAY' },
          { class_name: 'SPEED_LIMIT_50', title: 'Speed Limit 50 km/h', category: 'Mandatory / Regulatory', category_type: 'mandatory', image_url: '/api/sample-image/SPEED_LIMIT_50' },
          { class_name: 'PEDESTRIAN_CROSSING', title: 'Pedestrian Crossing', category: 'Cautionary / Warning', category_type: 'cautionary', image_url: '/api/sample-image/PEDESTRIAN_CROSSING' },
          { class_name: 'SCHOOL_AHEAD', title: 'School Ahead', category: 'Cautionary / Warning', category_type: 'cautionary', image_url: '/api/sample-image/SCHOOL_AHEAD' },
          { class_name: 'HORN_PROHIBITED', title: 'Horn Prohibited', category: 'Mandatory / Regulatory', category_type: 'mandatory', image_url: '/api/sample-image/HORN_PROHIBITED' },
          { class_name: 'ROUNDABOUT', title: 'Roundabout Ahead', category: 'Cautionary / Warning', category_type: 'cautionary', image_url: '/api/sample-image/ROUNDABOUT' },
          { class_name: 'COMPULSARY_KEEP_LEFT', title: 'Compulsory Keep Left', category: 'Mandatory / Regulatory', category_type: 'mandatory', image_url: '/api/sample-image/COMPULSARY_KEEP_LEFT' }
        ]);
      });
  }, []);

  const scrollToWorkflow = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-linear-border-light dark:border-linear-border-dark overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Subtle Project Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-linear-border-light dark:border-linear-border-dark bg-linear-surface-light dark:bg-linear-surface-dark text-xs text-linear-text-muted dark:text-linear-text-muted-dark mb-6">
            <span className="w-2 h-2 rounded-full bg-linear-accent animate-pulse"></span>
            <span>Indian Traffic Sign Recognition & LLM Assistant</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="font-semibold text-linear-text-light dark:text-linear-text-dark">85 Standard Classes</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-linear-text-light dark:text-linear-text-dark max-w-3xl mx-auto leading-[1.15]">
            Understand Every Sign. <br className="hidden sm:inline" />
            <span className="text-linear-accent dark:text-linear-accent-dark">Drive Safer.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="mt-5 text-base sm:text-lg text-linear-text-muted dark:text-linear-text-muted-dark max-w-2xl mx-auto leading-relaxed">
            Recognize Indian traffic signs with deep learning and explore their meaning through clear, AI-assisted explanations.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/detect')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-linear-accent hover:bg-linear-accent-hover text-white text-sm font-medium shadow-subtle transition-all"
            >
              <span>Open Detection Studio</span>
              <ArrowRight size={15} />
            </button>
            <button
              onClick={scrollToWorkflow}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-linear-border-light dark:border-linear-border-dark bg-linear-bg-light dark:bg-linear-surface-dark hover:bg-linear-surface-light dark:hover:bg-[#28282e] text-linear-text-light dark:text-linear-text-dark text-sm font-medium transition-colors"
            >
              <span>How It Works</span>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Large Hero Illustration */}
          <div className="mt-12 md:mt-16 border border-linear-border-light dark:border-linear-border-dark rounded-lg p-2 sm:p-4 bg-linear-surface-light/40 dark:bg-linear-surface-dark/40 shadow-elevated">
            <HeroRoadIllustration />
            <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-linear-text-muted dark:text-linear-text-muted-dark px-2">
              <span className="flex items-center gap-1.5">
                <Shield size={12} className="text-linear-accent" /> Aligned with Indian Roads Congress (IRC:67-2022) Code of Practice
              </span>
              <span className="hidden sm:inline">
                Motor Vehicles (Amendment) Act 2019 Statutory Rules
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars: Detect, Understand, Drive Safer */}
      <section className="py-16 md:py-20 border-b border-linear-border-light dark:border-linear-border-dark bg-linear-surface-light/30 dark:bg-[#1a1a1d]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-semibold tracking-wider text-linear-accent dark:text-linear-accent-dark mb-1">
              Core Capabilities
            </h2>
            <p className="text-2xl font-bold tracking-tight text-linear-text-light dark:text-linear-text-dark">
              Engineered for Indian Roads
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Detect */}
            <div className="p-6 rounded-lg bg-linear-bg-light dark:bg-linear-surface-dark border border-linear-border-light dark:border-linear-border-dark shadow-subtle hover:border-linear-accent/40 transition-colors">
              <div className="w-10 h-10 rounded-md bg-linear-accent-soft dark:bg-linear-accent-soft-dark text-linear-accent dark:text-linear-accent-dark flex items-center justify-center mb-4">
                <Eye size={20} />
              </div>
              <h3 className="text-base font-semibold text-linear-text-light dark:text-linear-text-dark mb-2">
                Detect
              </h3>
              <p className="text-sm text-linear-text-muted dark:text-linear-text-muted-dark leading-relaxed">
                Identify traffic signs from uploaded images or a live camera feed. Powered by a ResNet18 classifier evaluated across 85 distinct Indian sign categories.
              </p>
            </div>

            {/* Understand */}
            <div className="p-6 rounded-lg bg-linear-bg-light dark:bg-linear-surface-dark border border-linear-border-light dark:border-linear-border-dark shadow-subtle hover:border-linear-accent/40 transition-colors">
              <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/40 text-sign-blue flex items-center justify-center mb-4">
                <BookOpen size={20} />
              </div>
              <h3 className="text-base font-semibold text-linear-text-light dark:text-linear-text-dark mb-2">
                Understand
              </h3>
              <p className="text-sm text-linear-text-muted dark:text-linear-text-muted-dark leading-relaxed">
                Explore the statutory meaning of recognized signs through grounded, natural-language explanations without fabricated citations or unverified claims.
              </p>
            </div>

            {/* Drive Safer */}
            <div className="p-6 rounded-lg bg-linear-bg-light dark:bg-linear-surface-dark border border-linear-border-light dark:border-linear-border-dark shadow-subtle hover:border-linear-accent/40 transition-colors">
              <div className="w-10 h-10 rounded-md bg-green-50 dark:bg-green-950/40 text-sign-green flex items-center justify-center mb-4">
                <Shield size={20} />
              </div>
              <h3 className="text-base font-semibold text-linear-text-light dark:text-linear-text-dark mb-2">
                Drive Safer
              </h3>
              <p className="text-sm text-linear-text-muted dark:text-linear-text-muted-dark leading-relaxed">
                Learn practical driver actions, speed limits, legal penalties under the Motor Vehicles Act, and essential precautions for Indian road environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Illustrated 3-Step Workflow Section */}
      <section id="how-it-works" className="py-16 md:py-24 border-b border-linear-border-light dark:border-linear-border-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-xs uppercase font-semibold tracking-wider text-linear-text-muted dark:text-linear-text-muted-dark mb-1">
              Workflow Architecture
            </h2>
            <p className="text-2xl font-bold tracking-tight text-linear-text-light dark:text-linear-text-dark">
              From Observation to Actionable Guidance
            </p>
            <p className="mt-2 text-sm text-linear-text-muted dark:text-linear-text-muted-dark">
              A clear three-step illustrated pipeline separating computer vision inference from contextual reasoning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-linear-border-light dark:border-linear-border-dark bg-linear-bg-light dark:bg-linear-surface-dark">
              <div className="mb-4">
                <WorkflowUploadIllustration className="w-16 h-16 text-linear-text-light dark:text-linear-text-dark" />
              </div>
              <div className="w-5 h-5 rounded-full bg-linear-surface-light dark:bg-[#2b2b31] border border-linear-border-light dark:border-linear-border-dark text-[11px] font-bold text-linear-text-muted dark:text-linear-text-muted-dark flex items-center justify-center mb-2">
                1
              </div>
              <h3 className="text-sm font-semibold text-linear-text-light dark:text-linear-text-dark mb-1">
                Image Input
              </h3>
              <p className="text-xs text-linear-text-muted dark:text-linear-text-muted-dark leading-relaxed">
                Upload a roadway photograph or capture a live browser camera frame. Input is scaled to 224×224 pixels with raw RGB values.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-linear-border-light dark:border-linear-border-dark bg-linear-bg-light dark:bg-linear-surface-dark">
              <div className="mb-4">
                <WorkflowRecognitionIllustration className="w-16 h-16 text-linear-text-light dark:text-linear-text-dark" />
              </div>
              <div className="w-5 h-5 rounded-full bg-linear-surface-light dark:bg-[#2b2b31] border border-linear-border-light dark:border-linear-border-dark text-[11px] font-bold text-linear-text-muted dark:text-linear-text-muted-dark flex items-center justify-center mb-2">
                2
              </div>
              <h3 className="text-sm font-semibold text-linear-text-light dark:text-linear-text-dark mb-1">
                Sign Recognition
              </h3>
              <p className="text-xs text-linear-text-muted dark:text-linear-text-muted-dark leading-relaxed">
                The trained ResNet18 deep neural network classifies the image across 85 categories and produces calibrated confidence scores.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-linear-border-light dark:border-linear-border-dark bg-linear-bg-light dark:bg-linear-surface-dark">
              <div className="mb-4">
                <WorkflowExplanationIllustration className="w-16 h-16 text-linear-text-light dark:text-linear-text-dark" />
              </div>
              <div className="w-5 h-5 rounded-full bg-linear-surface-light dark:bg-[#2b2b31] border border-linear-border-light dark:border-linear-border-dark text-[11px] font-bold text-linear-text-muted dark:text-linear-text-muted-dark flex items-center justify-center mb-2">
                3
              </div>
              <h3 className="text-sm font-semibold text-linear-text-light dark:text-linear-text-dark mb-1">
                AI Explanation
              </h3>
              <p className="text-xs text-linear-text-muted dark:text-linear-text-muted-dark leading-relaxed">
                Synthesizes verified statutory knowledge: meaning, driver instructions, legal penalties, and IRC:67 guidelines with Q&A assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dataset & Benchmark Overview */}
      <section className="py-16 border-b border-linear-border-light dark:border-linear-border-dark bg-linear-surface-light/40 dark:bg-linear-surface-dark/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-lg">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-linear-accent dark:text-linear-accent-dark uppercase tracking-wider mb-2">
                <Award size={14} /> Empirical Research & Evaluation
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-linear-text-light dark:text-linear-text-dark">
                Trained and Evaluated on 85 Indian Traffic Sign Classes
              </h2>
              <p className="mt-3 text-sm text-linear-text-muted dark:text-linear-text-muted-dark leading-relaxed">
                Four architectures were systematically benchmarked on 4,438 training images and 1,288 held-out test images. ResNet18 achieved the highest performance with 87.58% test accuracy and a 72.25% macro F1-score.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5 text-linear-text-light dark:text-linear-text-dark">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <span>ResNet18: 87.58% Accuracy</span>
                </div>
                <div className="flex items-center gap-1.5 text-linear-text-muted dark:text-linear-text-muted-dark">
                  <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                  <span>MobileNetV2: 87.17%</span>
                </div>
                <div className="flex items-center gap-1.5 text-linear-text-muted dark:text-linear-text-muted-dark">
                  <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                  <span>EfficientNet-B0: 82.69%</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-lg border border-linear-border-light dark:border-linear-border-dark bg-linear-bg-light dark:bg-linear-bg-dark max-w-sm w-full shadow-subtle">
              <h3 className="text-xs uppercase font-semibold text-linear-text-muted dark:text-linear-text-muted-dark mb-3">
                Current Production Configuration
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-linear-border-light dark:border-linear-border-dark">
                  <span className="text-linear-text-muted dark:text-linear-text-muted-dark">Active Architecture</span>
                  <span className="font-semibold text-linear-text-light dark:text-linear-text-dark">ResNet18</span>
                </div>
                <div className="flex justify-between py-1 border-b border-linear-border-light dark:border-linear-border-dark">
                  <span className="text-linear-text-muted dark:text-linear-text-muted-dark">Input Resolution</span>
                  <span className="font-mono text-linear-text-light dark:text-linear-text-dark">224 × 224 × 3</span>
                </div>
                <div className="flex justify-between py-1 border-b border-linear-border-light dark:border-linear-border-dark">
                  <span className="text-linear-text-muted dark:text-linear-text-muted-dark">Total Classes</span>
                  <span className="font-semibold text-linear-text-light dark:text-linear-text-dark">85 Standard Signs</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-linear-text-muted dark:text-linear-text-muted-dark">Statutory Standard</span>
                  <span className="text-linear-accent dark:text-linear-accent-dark font-medium">IRC:67-2022</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Showcase / 1-Click Launch */}
      {samples.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div>
                <h2 className="text-xs uppercase font-semibold tracking-wider text-linear-text-muted dark:text-linear-text-muted-dark mb-1">
                  Authentic Dataset Samples
                </h2>
                <p className="text-xl font-bold tracking-tight text-linear-text-light dark:text-linear-text-dark">
                  Explore Common Indian Traffic Signs
                </p>
              </div>
              <button
                onClick={() => navigate('/detect')}
                className="mt-3 sm:mt-0 text-xs font-medium text-linear-accent dark:text-linear-accent-dark hover:underline flex items-center gap-1"
              >
                <span>Open in Detection Studio</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {samples.map((s) => (
                <div
                  key={s.class_name}
                  onClick={() => navigate(`/detect?sample=${s.class_name}`)}
                  className="group cursor-pointer p-3 rounded-lg border border-linear-border-light dark:border-linear-border-dark bg-linear-bg-light dark:bg-linear-surface-dark hover:border-linear-accent dark:hover:border-linear-accent transition-all shadow-subtle"
                >
                  <div className="w-full aspect-square rounded-md bg-linear-surface-light dark:bg-[#1a1a1e] border border-linear-border-light dark:border-linear-border-dark overflow-hidden flex items-center justify-center p-2 mb-2.5">
                    <img
                      src={s.image_url}
                      alt={s.title}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        // Fallback placeholder if image not rendered
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      s.category_type === 'mandatory'
                        ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                    }`}>
                      {s.category_type === 'mandatory' ? 'Mandatory' : 'Cautionary'}
                    </span>
                    <span className="text-[10px] text-linear-text-muted dark:text-linear-text-muted-dark group-hover:text-linear-accent transition-colors">
                      Test →
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-linear-text-light dark:text-linear-text-dark truncate">
                    {s.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-12 border-t border-linear-border-light dark:border-linear-border-dark bg-linear-surface-light/30 dark:bg-[#18181c]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-linear-text-light dark:text-linear-text-dark">
            Ready to test Indian traffic signs?
          </h2>
          <p className="mt-2 text-sm text-linear-text-muted dark:text-linear-text-muted-dark">
            Upload an image or start a live camera session to experience deep learning recognition and AI road safety reasoning.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => navigate('/detect')}
              className="px-5 py-2.5 rounded-md bg-linear-accent hover:bg-linear-accent-hover text-white text-sm font-medium shadow-subtle transition-all"
            >
              Open Detection Studio
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
