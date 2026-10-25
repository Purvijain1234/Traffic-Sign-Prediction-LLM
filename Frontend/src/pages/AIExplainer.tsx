import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ShieldAlert,
  Compass,
  FileText,
  Send,
  Sparkles,
  HelpCircle,
  Search,
  ExternalLink,
  ChevronRight,
  Info,
  RefreshCw,
  CheckCircle2,
  Scan
} from 'lucide-react';
import { SignMetadata, ExplanationResponse } from '../types';

const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL ||
  'https://traffic-sign-backend-49u0.onrender.com'
).replace(/\/$/, '');

export const AIExplainer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedSignParam = searchParams.get('sign') || 'STOP';
  const [currentSign, setCurrentSign] = useState<string>(selectedSignParam);
  const [allClasses, setAllClasses] = useState<{ class_name: string; title: string; category: string }[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  // Structured Explanation State
  const [explanationData, setExplanationData] = useState<ExplanationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Follow-up Q&A State
  const [userQuestion, setUserQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([]);

  // Fetch all classes for the selector
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/classes`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setAllClasses(data);
      })
      .catch(() => {});
  }, []);

  // Sync with URL query parameter
  useEffect(() => {
    const signParam = searchParams.get('sign');
    if (signParam && signParam !== currentSign) {
      setCurrentSign(signParam);
    }
  }, [searchParams]);

  // Fetch explanation when currentSign changes
  useEffect(() => {
    if (!currentSign) return;

    setIsLoading(true);
    setErrorMsg(null);
    setChatMessages([]);

    fetch(`${BACKEND_URL}/api/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sign_name: currentSign }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to load explanation for ${currentSign}`);
        }
        return res.json();
      })
      .then((data: ExplanationResponse) => {
        setExplanationData(data);
      })
      .catch((err) => {
        console.error('Explanation load error:', err);
        setErrorMsg('Unable to retrieve sign explanation from knowledge service.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentSign]);

  const handleSelectSign = (className: string) => {
    setCurrentSign(className);
    setSearchParams({ sign: className });
  };

  const handleSendQuestion = async (promptToSend?: string) => {
    const q = (promptToSend || userQuestion).trim();
    if (!q || isAsking) return;

    setUserQuestion('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setIsAsking(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sign_name: currentSign,
          question: q,
          conversation_history: chatMessages.map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error('Follow-up request failed.');
      }

      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: data.answer || 'No specific answer returned for this question.',
        },
      ]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Error generating grounded explanation. Please verify your connection to the backend service.',
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const quickPrompts = [
    'What does this sign mean?',
    'What should a driver do here?',
    'Why is this sign important?',
    'Explain the relevant Indian traffic rule.',
  ];

  const filteredClasses = allClasses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.class_name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-linear-border-light dark:border-linear-border-dark pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-linear-accent dark:text-linear-accent-dark uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-linear-accent"></span>
            Statutory Road Safety Assistant
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-linear-text-light dark:text-linear-text-dark">
            AI Explainer
          </h1>
          <p className="mt-1 text-sm text-linear-text-muted dark:text-linear-text-muted-dark max-w-2xl">
            Examine the statutory definition, mandatory driver actions, and legal enforcement context for Indian traffic signs under IRC:67-2022.
          </p>
        </div>

        {/* Quick action to detection studio */}
        <button
          onClick={() => navigate('/detect')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-linear-border-light dark:border-linear-border-dark hover:bg-linear-surface-light dark:hover:bg-linear-surface-dark text-linear-text-light dark:text-linear-text-dark transition-colors self-start md:self-auto"
        >
          <Scan size={14} />
          <span>Switch to Detection Studio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Sign Selector & Preview (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Sign Identity Card */}
          <div className="p-4 rounded-lg border border-linear-border-light dark:border-linear-border-dark bg-linear-bg-light dark:bg-linear-surface-dark shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-semibold text-linear-text-muted dark:text-linear-text-muted-dark tracking-wider">
                Active Sign Profile
              </span>
              {explanationData?.metadata && (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                  explanationData.metadata.category_type === 'mandatory'
                    ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    : explanationData.metadata.category_type === 'cautionary'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {explanationData.metadata.category}
                </span>
              )}
            </div>

            {/* Authentic Image Thumbnail */}
            <div className="w-full aspect-[4/3] rounded-md bg-linear-surface-light dark:bg-[#1a1a1e] border border-linear-border-light dark:border-linear-border-dark p-3 flex items-center justify-center mb-3">
              <img
                src={`${BACKEND_URL}/api/sample-image/${currentSign}`}
                alt={explanationData?.title || currentSign}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <h2 className="text-base font-bold text-linear-text-light dark:text-linear-text-dark tracking-tight">
              {explanationData?.title || currentSign.replace(/_/g, ' ')}
            </h2>
            <p className="text-xs font-mono text-linear-text-muted dark:text-linear-text-muted-dark mt-0.5">
              Class identifier: {currentSign}
            </p>

            {explanationData?.metadata && (
              <div className="mt-3 pt-3 border-t border-linear-border-light dark:border-linear-border-dark text-xs space-y-1 text-linear-text-muted dark:text-linear-text-muted-dark">
                <div><strong className="text-linear-text-light dark:text-linear-text-dark">Geometry:</strong> {explanationData.metadata.shape}</div>
                <div><strong className="text-linear-text-light dark:text-linear-text-dark">Code:</strong> {explanationData.metadata.irc_code}</div>
              </div>
            )}
          </div>

          {/* 85 Class Directory Search & Switcher */}
          <div className="p-4 rounded-lg border border-linear-border-light dark:border-linear-border-dark bg-linear-bg-light dark:bg-linear-surface-dark shadow-subtle">
            <h3 className="text-xs uppercase font-semibold text-linear-text-muted dark:text-linear-text-muted-dark mb-2.5">
              Explore 85 Indian Road Signs
            </h3>
            
            {/* Search Input */}
            <div className="relative mb-3">
              <Search size={14} className="absolute left-2.5 top-2.5 text-linear-text-muted dark:text-linear-text-muted-dark" />
              <input
                type="text"
                placeholder="Search signs by name..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-linear-border-light dark:border-linear-border-dark bg-linear-surface-light dark:bg-[#1c1c20] text-linear-text-light dark:text-linear-text-dark focus:outline-none focus:border-linear-accent"
              />
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((c) => (
                  <button
                    key={c.class_name}
                    onClick={() => handleSelectSign(c.class_name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                      c.class_name === currentSign
                        ? 'bg-linear-accent-soft dark:bg-linear-accent-soft-dark text-linear-accent dark:text-linear-accent-dark font-semibold'
                        : 'text-linear-text-light dark:text-linear-text-dark hover:bg-linear-surface-light dark:hover:bg-[#25252a]'
                    }`}
                  >
                    <span className="truncate max-w-[180px]">{c.title}</span>
                    <ChevronRight size={12} className="opacity-50 flex-shrink-0" />
                  </button>
                ))
              ) : (
                <div className="text-xs text-linear-text-muted dark:text-linear-text-muted-dark text-center py-4">
                  No matching sign found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Structured Statutory Sections & Q&A (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Structured Sections */}
          <div className="rounded-lg border border-linear-border-light dark:border-linear-border-dark bg-linear-bg-light dark:bg-linear-surface-dark p-6 shadow-subtle">
            
            {isLoading ? (
              <div className="py-16 text-center">
                <RefreshCw size={24} className="animate-spin mx-auto text-linear-accent mb-3" />
                <h3 className="text-sm font-semibold text-linear-text-light dark:text-linear-text-dark">
                  Loading Grounded Knowledge...
                </h3>
              </div>
            ) : errorMsg ? (
              <div className="p-4 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
                {errorMsg}
              </div>
            ) : explanationData?.sections ? (
              <div className="space-y-6">
                
                {/* 1. What This Sign Means */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-linear-accent dark:text-linear-accent-dark font-semibold text-xs uppercase tracking-wider">
                    <BookOpen size={15} />
                    <span>What This Sign Means</span>
                  </div>
                  <p className="text-sm leading-relaxed text-linear-text-light/90 dark:text-linear-text-dark/90 pl-6">
                    {explanationData.sections.meaning}
                  </p>
                </div>

                {/* 2. Recommended Driver Action */}
                <div className="space-y-1.5 pt-4 border-t border-linear-border-light dark:border-linear-border-dark">
                  <div className="flex items-center gap-2 text-sign-blue font-semibold text-xs uppercase tracking-wider">
                    <Compass size={15} />
                    <span>Recommended Driver Action</span>
                  </div>
                  <div className="text-sm leading-relaxed text-linear-text-light/90 dark:text-linear-text-dark/90 pl-6 whitespace-pre-line">
                    {explanationData.sections.driver_action}
                  </div>
                </div>

                {/* 3. Road-Safety Context & Legal Fines */}
                <div className="space-y-1.5 pt-4 border-t border-linear-border-light dark:border-linear-border-dark">
                  <div className="flex items-center gap-2 text-sign-amber font-semibold text-xs uppercase tracking-wider">
                    <ShieldAlert size={15} />
                    <span>Road-Safety Context & Legal Enforcement</span>
                  </div>
                  <p className="text-sm leading-relaxed text-linear-text-light/90 dark:text-linear-text-dark/90 pl-6 mb-2">
                    {explanationData.sections.safety_context}
                  </p>
                  <div className="ml-6 p-3 rounded-md bg-linear-surface-light dark:bg-[#1a1a1e] border border-linear-border-light dark:border-linear-border-dark text-xs text-linear-text-muted dark:text-linear-text-muted-dark">
                    <strong className="text-linear-text-light dark:text-linear-text-dark block mb-1">
                      Statutory Reference & Penalties:
                    </strong>
                    {explanationData.sections.legal_reference}
                  </div>
                </div>

                {/* 4. Sources and References */}
                <div className="space-y-1.5 pt-4 border-t border-linear-border-light dark:border-linear-border-dark">
                  <div className="flex items-center gap-2 text-sign-green font-semibold text-xs uppercase tracking-wider">
                    <FileText size={15} />
                    <span>Sources & Verified References</span>
                  </div>
                  <ul className="pl-6 space-y-1 text-xs text-linear-text-muted dark:text-linear-text-muted-dark">
                    {explanationData.sections.sources?.map((src, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-green-500" />
                        <span>{src}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ) : null}
          </div>

          {/* Interactive Follow-Up Questions Section */}
          <div className="rounded-lg border border-linear-border-light dark:border-linear-border-dark bg-linear-bg-light dark:bg-linear-surface-dark p-6 shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-linear-text-muted dark:text-linear-text-muted-dark flex items-center gap-1.5">
                <HelpCircle size={14} />
                Ask Follow-Up Questions About This Sign
              </h3>
              <span className="text-[11px] text-linear-text-muted dark:text-linear-text-muted-dark">
                Grounded in Indian Law & IRC:67
              </span>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendQuestion(prompt)}
                  disabled={isAsking}
                  className="px-2.5 py-1 text-xs rounded-full border border-linear-border-light dark:border-linear-border-dark bg-linear-surface-light dark:bg-[#202025] hover:border-linear-accent dark:hover:border-linear-accent text-linear-text-light dark:text-linear-text-dark transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Conversation Log */}
            {chatMessages.length > 0 && (
              <div className="space-y-3 mb-4 max-h-72 overflow-y-auto p-3 rounded-md bg-linear-surface-light/40 dark:bg-[#1a1a1d] border border-linear-border-light dark:border-linear-border-dark">
                {chatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col text-xs leading-relaxed ${
                      m.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-md p-2.5 whitespace-pre-line ${
                        m.sender === 'user'
                          ? 'bg-linear-accent text-white font-medium'
                          : 'bg-linear-bg-light dark:bg-[#232328] border border-linear-border-light dark:border-linear-border-dark text-linear-text-light dark:text-linear-text-dark'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Question Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuestion();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about fines, road conditions, speed limits, or rules..."
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                disabled={isAsking}
                className="flex-1 px-3.5 py-2 text-xs rounded-md border border-linear-border-light dark:border-linear-border-dark bg-linear-surface-light dark:bg-[#1b1b1e] text-linear-text-light dark:text-linear-text-dark focus:outline-none focus:border-linear-accent"
              />
              <button
                type="submit"
                disabled={!userQuestion.trim() || isAsking}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  !userQuestion.trim() || isAsking
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                    : 'bg-linear-accent hover:bg-linear-accent-hover text-white shadow-subtle'
                }`}
              >
                {isAsking ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : (
                  <Send size={13} />
                )}
                <span>Ask</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
