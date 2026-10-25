import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Camera,
  RefreshCw,
  Trash2,
  Play,
  Square,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  Info,
  BookOpen,
  Compass,
  FileText,
  Send,
  Search,
  ExternalLink,
  ChevronDown,
  Layers,
  Award,
  Cpu,
  Database,
  ShieldCheck,
  Eye,
  ChevronRight,
  Zap,
  TrendingUp,
  MapPin
} from 'lucide-react';
import {
  HeroRoadIllustration,
  FeatureDetectIllustration,
  FeatureUnderstandIllustration,
  FeatureDriveSaferIllustration,
  WorkflowUploadIllustration,
  WorkflowRecognitionIllustration,
  WorkflowExplanationIllustration,
  SignToExplanationIllustration,
  EmptyUploadIllustration,
  CameraPermissionIllustration,
  EmptyExplanationIllustration,
  ViewfinderHudOverlay
} from '../components/Illustrations';
import { SaarthiLogo } from '../components/SaarthiLogo';
import { AboutModal } from '../components/AboutModal';
import { PredictionResponse, SampleSign, ExplanationResponse, ModelOption } from '../types';

const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL ||
  'https://traffic-sign-backend-49u0.onrender.com'
).replace(/\/$/, '');

export const AVAILABLE_MODELS_DATA: ModelOption[] = [
  {
    id: 'resnet18',
    name: 'ResNet18 (Best Accuracy)',
    short_name: 'ResNet18',
    tag: 'Best Accuracy (87.58%)',
    accuracy: '87.58%',
    macro_f1: '72.25%',
    weighted_f1: '87.33%',
    architecture: 'ResNet18 (Residual Neural Network)',
    description: 'Deep residual skip connections. Highest accuracy & macro F1 across 85 Indian traffic classes.',
    is_default: true,
  },
  {
    id: 'mobilenetv2',
    name: 'MobileNetV2',
    short_name: 'MobileNetV2',
    tag: 'Fast & Lightweight (87.17%)',
    accuracy: '87.17%',
    macro_f1: '69.34%',
    weighted_f1: '87.17%',
    architecture: 'MobileNetV2 (Inverted Residuals)',
    description: 'Lightweight architecture with depthwise separable convolutions; low latency and high accuracy.',
    is_default: false,
  },
  {
    id: 'efficientnetb0',
    name: 'EfficientNet-B0',
    short_name: 'EfficientNet-B0',
    tag: 'Compound Scaled (82.69%)',
    accuracy: '82.69%',
    macro_f1: '63.48%',
    weighted_f1: '82.31%',
    architecture: 'EfficientNet-B0 (MBConv Blocks)',
    description: 'Compound scaling method balancing network depth, width, and resolution.',
    is_default: false,
  },
  {
    id: 'cnn',
    name: 'Custom CNN',
    short_name: 'Custom CNN',
    tag: 'Baseline Architecture (71.82%)',
    accuracy: '71.82%',
    macro_f1: '52.68%',
    weighted_f1: '77.27%',
    architecture: 'Custom CNN Baseline (4-Block ConvNet)',
    description: '4-block convolutional network baseline trained from scratch without transfer learning.',
    is_default: false,
  },
];

export const HomePage: React.FC = () => {
  // Detection Mode: upload | camera
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const selectedFileRef = useRef<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Keep selectedFileRef synced with selectedFile
  useEffect(() => {
    selectedFileRef.current = selectedFile;
  }, [selectedFile]);

  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Inference State
  const [isProcessing, setIsProcessing] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);

  // Model Selection State (ResNet18 default per requirement)
  const [selectedModel, setSelectedModel] = useState<string>('resnet18');
  const [modelOptions, setModelOptions] = useState<ModelOption[]>(AVAILABLE_MODELS_DATA);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sample signs
  const [samples, setSamples] = useState<SampleSign[]>([]);

  // AI Explanation State (Integrated Inline)
  const [activeSignName, setActiveSignName] = useState<string>('STOP');
  const [explanationData, setExplanationData] = useState<ExplanationResponse | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);

  // Follow-up Q&A State
  const [userQuestion, setUserQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([]);

  // 85 Classes list for manual search/lookup
  const [allClasses, setAllClasses] = useState<{ class_name: string; title: string; category: string }[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  // About Modal state
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Initial Data Fetching
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setBackendHealthy(data.status === 'healthy'))
      .catch(() => setBackendHealthy(false));

    fetch(`${BACKEND_URL}/api/models`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setModelOptions(data);
          // Default to ResNet18
          const defaultMod = data.find((m: ModelOption) => m.is_default) || data.find((m: ModelOption) => m.id === 'resnet18');
          if (defaultMod) {
            setSelectedModel(defaultMod.id);
          }
        }
      })
      .catch(() => {});

    fetch(`${BACKEND_URL}/api/samples`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setSamples(data);
      })
      .catch(() => {});

    fetch(`${BACKEND_URL}/api/classes`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setAllClasses(data);
      })
      .catch(() => {});

    // Initial explanation for STOP sign
    fetchExplanation('STOP');
  }, []);

  // Fetch explanation helper
  const fetchExplanation = (signName: string) => {
    setActiveSignName(signName);
    setIsLoadingExplanation(true);
    setExplanationError(null);
    setChatMessages([]);

    fetch(`${BACKEND_URL}/api/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sign_name: signName }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Could not retrieve explanation');
        return res.json();
      })
      .then((data: ExplanationResponse) => {
        setExplanationData(data);
      })
      .catch((err) => {
        console.error('Explanation error:', err);
        setExplanationError('Statutory knowledge service temporarily unavailable.');
      })
      .finally(() => {
        setIsLoadingExplanation(false);
      });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Active Model Object
  const currentModel =
    modelOptions.find((m) => m.id === selectedModel) ||
    modelOptions[0] ||
    AVAILABLE_MODELS_DATA[0];

  // Run Inference with specified or currently selected model
  const runDetection = async (fileToInfer?: File, modelIdToUse?: string) => {
    const targetFile = fileToInfer || selectedFile;
    const targetModel = modelIdToUse || selectedModel;

    if (!targetFile) {
      setErrorMsg('Please upload an image or capture a camera frame.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', targetFile);
    formData.append('model', targetModel);

    try {
      const response = await fetch(`${BACKEND_URL}/api/predict?model=${encodeURIComponent(targetModel)}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Inference error with model ${targetModel} (Status ${response.status})`);
      }

      const data: PredictionResponse = await response.json();
      setPrediction(data);

      // Automatically sync explanation section inline!
      fetchExplanation(data.predicted_class);
    } catch (err: any) {
      console.error('Detection error:', err);
      setErrorMsg(err.message || 'Model prediction failed. Ensure FastAPI server is running on port 8000.');
      // When error occurs, clear prediction so no fake/stale results are shown
      setPrediction(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Model switch handler: updates selection and re-runs prediction if image exists
  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setIsModelDropdownOpen(false);
    setErrorMsg(null);

    // When the user changes the model, run predictions using the selected model
    const activeTarget = selectedFileRef.current || selectedFile;
    if (activeTarget) {
      runDetection(activeTarget, modelId);
    }
  };

  // Load Authentic Sample Sign
  const loadSampleSign = async (className: string) => {
    setErrorMsg(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/sample-image/${className}`);
      if (!response.ok) throw new Error('Sample image not found on server.');
      const blob = await response.blob();
      const file = new File([blob], `${className}.jpg`, { type: 'image/jpeg' });

      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      const newUrl = URL.createObjectURL(blob);
      selectedFileRef.current = file;
      setSelectedFile(file);
      setPreviewUrl(newUrl);
      setMode('upload');

      // Run prediction with currently selected model
      runDetection(file, selectedModel);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load sample image.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }
    setErrorMsg(null);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    selectedFileRef.current = file;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const clearSelection = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    selectedFileRef.current = null;
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setErrorMsg(null);
  };

  // Camera Controls
  const startCamera = async () => {
    setCameraError(null);
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      setIsCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser address bar.');
      } else {
        setCameraError(`Camera error: ${err.message || 'Could not access video device.'}`);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !isCameraActive) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera-frame-${Date.now()}.jpg`, { type: 'image/jpeg' });
        if (previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(blob));
        selectedFileRef.current = file;
        setSelectedFile(file);
        runDetection(file, selectedModel);
      }
    }, 'image/jpeg', 0.92);
  }, [isCameraActive, previewUrl, selectedModel]);

  // Follow-up Q&A
  const handleSendQuestion = async (promptToSend?: string) => {
    const q = (promptToSend || userQuestion).trim();
    if (!q || isAsking) return;

    setUserQuestion('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setIsAsking(true);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sign_name: activeSignName,
          question: q,
          conversation_history: chatMessages.map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      if (!response.ok) throw new Error('Question answering service failed.');
      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: data.answer || 'No answer available for this question.' },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: 'Error retrieving answer. Please check backend connection.' },
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
    <div className="w-full">
      
      {/* ========================================================= */}
      {/* SECTION 1: HERO SECTION (#hero)                           */}
      {/* ========================================================= */}
      <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-linear-border-light dark:border-linear-border-dark overflow-hidden bg-gradient-to-b from-[#EBF3FE] via-[#F5EEFF] to-[#FFF5EB] dark:from-[#0B132B] dark:via-[#111A3E] dark:to-[#0C1226]">
        
        {/* Colorful Radiant Background Blobs */}
        <div className="absolute top-12 left-10 w-96 h-96 bg-[#3867FF]/15 dark:bg-[#3867FF]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#FF9F43]/15 dark:bg-[#FF9F43]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-[#7655F7]/12 dark:bg-[#7655F7]/18 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Top Brand Pill with Active Indicator */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-2 rounded-full border border-saarthi-royal-blue/30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs text-linear-text-muted dark:text-linear-text-muted-dark mb-7 shadow-elevated hover:border-saarthi-royal-blue transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-saarthi-saffron to-saarthi-royal-blue animate-pulse"></span>
            <span className="font-extrabold text-saarthi-navy dark:text-white">Traffic Sign Saarthi AI</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-saarthi-saffron font-bold">85 Indian Road Signs</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-green-600 dark:text-green-400 font-bold bg-green-100/70 dark:bg-green-950/60 px-2.5 py-0.5 rounded-full">
              ResNet18: 87.58% Acc
            </span>
          </div>

          {/* Headline with Radiant Gradient */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-saarthi-navy dark:text-white max-w-4xl mx-auto leading-[1.12]">
            Understand Every Sign. <br />
            <span className="bg-gradient-to-r from-saarthi-royal-blue via-saarthi-violet to-saarthi-saffron bg-clip-text text-transparent">
              Drive Safer Across India.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="mt-5 text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            Recognize Indian traffic signs with trained deep neural networks and explore statutory driver actions, safety precautions, and Motor Vehicles Act rules with an AI assistant.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('detect')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-saarthi-royal-blue via-saarthi-violet to-saarthi-saffron hover:opacity-95 text-white text-sm font-bold shadow-elevated hover:shadow-glow transition-all"
            >
              <span>Start Sign Detection</span>
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-linear-border-light dark:border-linear-border-dark bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-saarthi-navy dark:text-white text-sm font-bold transition-colors shadow-subtle"
            >
              <span>How It Works</span>
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Colorful Quick Stat Strip */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-[#241A10] dark:to-[#1A1828] border-2 border-amber-300/80 dark:border-amber-700/70 shadow-subtle hover:scale-102 transition-transform">
              <span className="block text-xl font-black text-saarthi-saffron">85 Classes</span>
              <span className="text-[11px] font-bold text-amber-950 dark:text-amber-200">Indian Standard Signs</span>
            </div>
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-[#0E2619] dark:to-[#121E2E] border-2 border-emerald-300/80 dark:border-emerald-700/70 shadow-subtle hover:scale-102 transition-transform">
              <span className="block text-xl font-black text-emerald-600 dark:text-emerald-400">87.58%</span>
              <span className="text-[11px] font-bold text-emerald-950 dark:text-emerald-200">ResNet18 Accuracy</span>
            </div>
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-[#132247] dark:to-[#151D38] border-2 border-blue-300/80 dark:border-blue-700/70 shadow-subtle hover:scale-102 transition-transform">
              <span className="block text-xl font-black text-saarthi-royal-blue dark:text-blue-400">5,726</span>
              <span className="text-[11px] font-bold text-blue-950 dark:text-blue-200">Dataset Images</span>
            </div>
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-50 to-fuchsia-50/50 dark:from-[#22173E] dark:to-[#17152B] border-2 border-purple-300/80 dark:border-purple-700/70 shadow-subtle hover:scale-102 transition-transform">
              <span className="block text-xl font-black text-saarthi-violet dark:text-purple-400">IRC:67-2022</span>
              <span className="text-[11px] font-bold text-purple-950 dark:text-purple-200">Road Code Alignment</span>
            </div>
          </div>

          {/* Hero Road Illustration Container with Glowing Gradient Border */}
          <div className="mt-10 md:mt-12 p-1 rounded-2xl bg-gradient-to-r from-saarthi-royal-blue/40 via-saarthi-violet/40 to-saarthi-saffron/40 shadow-elevated">
            <div className="rounded-xl p-3 sm:p-5 bg-white dark:bg-slate-900 border border-linear-border-light dark:border-linear-border-dark">
              <HeroRoadIllustration />
              <div className="mt-3.5 flex flex-wrap items-center justify-between text-xs text-linear-text-muted dark:text-linear-text-muted-dark px-2 border-t border-linear-border-light dark:border-linear-border-dark pt-3">
                <span className="flex items-center gap-1.5 font-bold text-saarthi-royal-blue dark:text-blue-400">
                  <ShieldCheck size={16} />
                  Statutory Alignment: Indian Roads Congress (IRC:67-2022) Code of Practice
                </span>
                <span className="hidden sm:inline font-mono text-slate-500 dark:text-slate-400 font-semibold">
                  Motor Vehicles (Amendment) Act 2019
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: FEATURES SECTION (#features)                   */}
      {/* ========================================================= */}
      <section id="features" className="py-24 border-b border-linear-border-light dark:border-linear-border-dark bg-gradient-to-b from-white via-slate-50/70 to-white dark:from-slate-900/40 dark:via-slate-900/80 dark:to-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase font-black tracking-wider bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet bg-clip-text text-transparent mb-2 inline-block">
              Comprehensive Road Intelligence
            </span>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-saarthi-navy dark:text-white">
              Core Capabilities for Indian Drivers
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
              Combining state-of-the-art vision models with statutory knowledge to elevate road safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1: Detect (Warm Saffron Glow) */}
            <div className="relative p-7 rounded-2xl bg-gradient-to-b from-amber-50/60 to-white dark:from-slate-900 dark:to-slate-900 border-2 border-amber-300/70 dark:border-amber-800/60 hover:border-saarthi-saffron shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saarthi-saffron to-amber-400"></div>
              <div>
                <div className="mb-5 p-3.5 rounded-2xl bg-amber-100/70 dark:bg-amber-950/60 w-fit border border-saarthi-saffron/40 group-hover:scale-105 transition-transform shadow-xs">
                  <FeatureDetectIllustration className="w-12 h-12" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 mb-2.5">
                  Computer Vision
                </div>
                <h3 className="text-xl font-bold text-saarthi-navy dark:text-white mb-2">
                  Traffic Sign Recognition
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Identify traffic signs with precision from user-uploaded road photos or live browser camera frames. Powered by a ResNet18 model evaluated over 85 Indian classes.
                </p>
              </div>
              <div className="mt-7 pt-4 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-xs font-bold text-saarthi-saffron">
                <span>87.58% Test Accuracy</span>
                <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Feature 2: Understand (Royal Blue Glow) */}
            <div className="relative p-7 rounded-2xl bg-gradient-to-b from-blue-50/60 to-white dark:from-slate-900 dark:to-slate-900 border-2 border-blue-300/70 dark:border-blue-800/60 hover:border-saarthi-royal-blue shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saarthi-royal-blue to-blue-400"></div>
              <div>
                <div className="mb-5 p-3.5 rounded-2xl bg-blue-100/70 dark:bg-blue-950/60 w-fit border border-saarthi-royal-blue/40 group-hover:scale-105 transition-transform shadow-xs">
                  <FeatureUnderstandIllustration className="w-12 h-12" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 mb-2.5">
                  Statutory AI
                </div>
                <h3 className="text-xl font-bold text-saarthi-navy dark:text-white mb-2">
                  Statutory AI Explanations
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Explore the legal and contextual meaning of detected signs through grounded explanations. Aligned strictly with IRC:67-2022 guidelines without hallucinated rules.
                </p>
              </div>
              <div className="mt-7 pt-4 border-t border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between text-xs font-bold text-saarthi-royal-blue">
                <span>IRC:67-2022 Code</span>
                <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Feature 3: Drive Safer (Emerald Green Glow) */}
            <div className="relative p-7 rounded-2xl bg-gradient-to-b from-green-50/60 to-white dark:from-slate-900 dark:to-slate-900 border-2 border-green-300/70 dark:border-green-800/60 hover:border-green-500 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 to-emerald-400"></div>
              <div>
                <div className="mb-5 p-3.5 rounded-2xl bg-green-100/70 dark:bg-green-950/60 w-fit border border-green-500/40 group-hover:scale-105 transition-transform shadow-xs">
                  <FeatureDriveSaferIllustration className="w-12 h-12" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-300 mb-2.5">
                  Legal Compliance
                </div>
                <h3 className="text-xl font-bold text-saarthi-navy dark:text-white mb-2">
                  Safety Action & Fines
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Learn mandatory precautions, speed limits, pedestrian rights, and legal fines under Section 119 and Section 184 of the Indian Motor Vehicles Act.
                </p>
              </div>
              <div className="mt-7 pt-4 border-t border-green-200/60 dark:border-green-900/40 flex items-center justify-between text-xs font-bold text-green-600 dark:text-green-400">
                <span>MVA 1988/2019 Fines</span>
                <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: TRAFFIC SIGN DETECTION SECTION (#detect)       */}
      {/* ========================================================= */}
      <section id="detect" className="py-24 border-b border-linear-border-light dark:border-linear-border-dark bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with Dynamic Model Selector */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-linear-border-light dark:border-linear-border-dark pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black text-saarthi-royal-blue uppercase tracking-wider mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-saarthi-royal-blue animate-ping"></span>
                Inference Studio
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-saarthi-navy dark:text-white">
                Traffic Sign Detection
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
                Upload a traffic sign image or capture a live camera frame for deep learning classification using our best-performing ResNet18 model.
              </p>
            </div>

            {/* Model Badge & Status */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Static Best Model Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-black bg-white dark:bg-slate-900 border-2 border-saarthi-royal-blue/50 text-saarthi-navy dark:text-white shadow-xs">
                <Cpu size={14} className="text-saarthi-royal-blue" />
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="font-bold">ResNet18 (Best Accuracy)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-800 font-mono">
                  87.58% Acc
                </span>
              </div>

              {/* Backend Status Indicator */}
              {backendHealthy === true ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300 border border-green-300 dark:border-green-800 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  API Ready
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-xs">
                  <AlertCircle size={14} />
                  Connecting...
                </span>
              )}
            </div>
          </div>

          {/* Two-Column Detection & Inline Prediction Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Viewport (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* Segmented Mode Switcher with Colorful Glow */}
              <div className="flex items-center justify-between p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <div className="grid grid-cols-2 gap-1.5 w-full max-w-xs">
                  <button
                    onClick={() => {
                      setMode('upload');
                      stopCamera();
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      mode === 'upload'
                        ? 'bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet text-white shadow-subtle'
                        : 'text-slate-600 hover:text-saarthi-navy dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <Upload size={14} />
                    <span>Image Upload</span>
                  </button>

                  <button
                    onClick={() => {
                      setMode('camera');
                      if (!isCameraActive) startCamera();
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      mode === 'camera'
                        ? 'bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet text-white shadow-subtle'
                        : 'text-slate-600 hover:text-saarthi-navy dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <Camera size={14} />
                    <span>Live Camera</span>
                  </button>
                </div>

                {mode === 'upload' && previewUrl && (
                  <button
                    onClick={clearSelection}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
                    title="Remove image"
                  >
                    <Trash2 size={14} />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Viewport Frame with Gradient Border Glow */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl border-2 border-saarthi-royal-blue/30 dark:border-saarthi-royal-blue/40 bg-slate-50 dark:bg-slate-900 overflow-hidden flex flex-col items-center justify-center shadow-elevated">
                
                {/* Upload Mode */}
                {mode === 'upload' && (
                  <>
                    {previewUrl ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-slate-950/5 dark:bg-black/60 p-4">
                        <img
                          src={previewUrl}
                          alt="Traffic sign preview"
                          className="max-h-full max-w-full object-contain rounded-xl shadow-elevated"
                        />
                        {isProcessing && (
                          <div className="absolute inset-0 pointer-events-none flex flex-col justify-start">
                            <div className="w-full h-1.5 bg-gradient-to-r from-saarthi-royal-blue via-saarthi-violet to-saarthi-saffron shadow-[0_0_24px_#3867FF] animate-scan"></div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('home-file-upload')?.click()}
                        className={`w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                          isDragging
                            ? 'bg-saarthi-sky dark:bg-saarthi-sky-dark border-2 border-dashed border-saarthi-royal-blue'
                            : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <input
                          id="home-file-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <EmptyUploadIllustration className="w-18 h-18 text-saarthi-royal-blue mb-4" />
                        <h3 className="text-lg font-bold text-saarthi-navy dark:text-white mb-1">
                          Drop an Indian traffic sign image here
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-5 font-medium">
                          Drag and drop JPEG, PNG, or WebP road sign photos, or click to browse.
                        </p>
                        <span className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet text-white text-xs font-bold shadow-subtle hover:opacity-95 transition-opacity">
                          Browse Local Files
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Camera Mode */}
                {mode === 'camera' && (
                  <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${!isCameraActive ? 'hidden' : ''}`}
                    />

                    {!isCameraActive && (
                      <div className="p-6 text-center max-w-sm">
                        {cameraError ? (
                          <div className="flex flex-col items-center">
                            <CameraPermissionIllustration className="w-18 h-18 mb-3" />
                            <h3 className="text-sm font-bold text-red-500 mb-1">
                              Camera Permission Required
                            </h3>
                            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                              {cameraError}
                            </p>
                            <button
                              onClick={startCamera}
                              className="px-5 py-2 rounded-xl bg-saarthi-royal-blue text-white text-xs font-bold"
                            >
                              Retry Access
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Camera size={44} className="text-saarthi-royal-blue mb-3" />
                            <h3 className="text-base font-bold text-white mb-1">
                              Live Browser Camera Feed
                            </h3>
                            <p className="text-xs text-slate-400 mb-5 font-medium">
                              Grant camera permission to capture real-time frames of Indian road signs.
                            </p>
                            <button
                              onClick={startCamera}
                              className="px-6 py-3 rounded-xl bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet hover:opacity-95 text-white text-xs font-bold shadow-subtle flex items-center gap-2"
                            >
                              <Play size={15} />
                              <span>Start Camera</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {isCameraActive && (
                      <>
                        <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-white/60 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                          <div className="flex justify-between">
                            <span className="w-5 h-5 border-t-3 border-l-3 border-saarthi-royal-blue"></span>
                            <span className="w-5 h-5 border-t-3 border-r-3 border-saarthi-royal-blue"></span>
                          </div>
                          <div className="text-center">
                            <span className="text-[11px] bg-black/80 text-white px-3 py-1 rounded-md backdrop-blur-sm font-bold">
                              Center Indian Traffic Sign Inside Frame
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="w-5 h-5 border-b-3 border-l-3 border-saarthi-royal-blue"></span>
                            <span className="w-5 h-5 border-b-3 border-r-3 border-saarthi-royal-blue"></span>
                          </div>
                        </div>

                        {isProcessing && (
                          <div className="absolute inset-0 pointer-events-none flex flex-col justify-start">
                            <div className="w-full h-1.5 bg-gradient-to-r from-saarthi-royal-blue to-saarthi-saffron shadow-[0_0_24px_#3867FF] animate-scan"></div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border-2 border-linear-border-light dark:border-linear-border-dark bg-white dark:bg-slate-900 shadow-subtle">
                <div className="text-xs text-linear-text-muted dark:text-linear-text-muted-dark">
                  {mode === 'upload' ? (
                    selectedFile ? (
                      <span className="font-mono text-saarthi-navy dark:text-white font-bold">
                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    ) : (
                      <span className="font-medium">Select or drop an image above</span>
                    )
                  ) : isCameraActive ? (
                    <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
                      Camera streaming live
                    </span>
                  ) : (
                    <span className="font-medium">Camera is currently off</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-saarthi-navy dark:text-white shadow-xs">
                    <span className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 hidden sm:inline">Model:</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>ResNet18 (Best Model)</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-green-100 dark:bg-green-950/80 text-green-700 dark:text-green-300">
                      87.58%
                    </span>
                  </div>

                  {mode === 'upload' && (
                    <button
                      onClick={() => runDetection(selectedFile || undefined, selectedModel)}
                      disabled={!selectedFile || isProcessing}
                      className={`inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
                        !selectedFile || isProcessing
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet hover:opacity-95 text-white shadow-subtle'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Classifying...</span>
                        </>
                      ) : (
                        <>
                          <Play size={14} />
                          <span>Run Detection</span>
                        </>
                      )}
                    </button>
                  )}

                  {mode === 'camera' && isCameraActive && (
                    <>
                      <button
                        onClick={captureFrame}
                        disabled={isProcessing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet text-white shadow-subtle"
                      >
                        <Camera size={14} />
                        <span>Capture Frame</span>
                      </button>
                      <button
                        onClick={stopCamera}
                        className="p-2.5 text-xs rounded-xl border border-linear-border-light dark:border-linear-border-dark text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Stop Camera"
                      >
                        <Square size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Indian Dataset Samples Tester with Category Colors */}
              {samples.length > 0 && (
                <div className="p-4 rounded-xl border border-saarthi-royal-blue/30 bg-gradient-to-r from-saarthi-sky/40 via-purple-50/20 to-amber-50/20 dark:from-slate-900 dark:to-slate-900 shadow-subtle">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-saarthi-navy dark:text-white flex items-center gap-1.5">
                      <Sparkles size={15} className="text-saarthi-saffron" />
                      1-Click Test with Authentic Indian Signs:
                    </span>
                    <span className="text-[11px] text-saarthi-royal-blue font-bold">Click to test</span>
                  </div>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                    {samples.slice(0, 8).map((s) => (
                      <button
                        key={s.class_name}
                        onClick={() => loadSampleSign(s.class_name)}
                        className={`flex-shrink-0 flex items-center gap-2.5 p-2 pr-3.5 rounded-xl border bg-white dark:bg-slate-800/90 transition-all text-left shadow-xs hover:scale-102 ${
                          s.category_type === 'mandatory'
                            ? 'border-red-200 dark:border-red-900 hover:border-red-500'
                            : s.category_type === 'cautionary'
                            ? 'border-amber-200 dark:border-amber-900 hover:border-amber-500'
                            : 'border-blue-200 dark:border-blue-900 hover:border-blue-500'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                          <img
                            src={s.image_url}
                            alt={s.title}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-saarthi-navy dark:text-white block leading-tight">
                            {s.title}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-wider ${
                            s.category_type === 'mandatory' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                          }`}>
                            {s.category_type}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Structured Prediction Results Panel (5 Cols) with Colorful Framing */}
            <div className="lg:col-span-5">
              <div className="border-2 border-saarthi-royal-blue/30 dark:border-saarthi-royal-blue/40 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-elevated min-h-[460px] flex flex-col justify-between">
                
                <div>
                  <div className="flex items-center justify-between pb-3.5 border-b border-linear-border-light dark:border-linear-border-dark mb-5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-saarthi-navy dark:text-white flex items-center gap-1.5">
                      <Award size={16} className="text-saarthi-royal-blue" />
                      Prediction Results
                    </h3>
                    <span className="text-[11px] font-mono bg-saarthi-sky dark:bg-saarthi-sky-dark text-saarthi-royal-blue font-bold px-3 py-0.5 rounded-full border border-saarthi-royal-blue/20">
                      {prediction?.model_info?.name || currentModel.name} ({prediction?.model_info?.test_accuracy || currentModel.accuracy})
                    </span>
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 mb-4 flex items-start gap-2">
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block mb-0.5 font-bold">Inference Error</strong>
                        <span>{errorMsg}</span>
                      </div>
                    </div>
                  )}

                  {prediction ? (
                    <div className="space-y-5">
                      
                      {/* Top Prediction Banner with Rich Theme */}
                      <div className="p-4 rounded-xl border-2 border-saarthi-royal-blue/30 bg-gradient-to-br from-saarthi-sky/70 via-purple-50/40 to-amber-50/30 dark:from-slate-800/80 dark:to-slate-800/40 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-black uppercase px-3 py-0.5 rounded-full tracking-wider ${
                            prediction.metadata.category_type === 'mandatory'
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300'
                              : prediction.metadata.category_type === 'cautionary'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300'
                          }`}>
                            {prediction.metadata.category}
                          </span>
                          <span className="text-xs font-black font-mono text-saarthi-royal-blue">
                            {prediction.confidence.toFixed(1)}% Confidence
                          </span>
                        </div>

                        <h4 className="text-xl font-black text-saarthi-navy dark:text-white tracking-tight">
                          {prediction.title}
                        </h4>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Canonical ID: {prediction.predicted_class}
                        </p>

                        {/* Animated Confidence Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full mt-3.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              prediction.confidence >= 80
                                ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                                : prediction.confidence >= 50
                                ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                                : 'bg-gradient-to-r from-red-500 to-rose-400'
                            }`}
                            style={{ width: `${Math.min(prediction.confidence, 100)}%` }}
                          ></div>
                        </div>

                        {/* Selected Model Attribution Card */}
                        <div className="mt-3.5 p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-saarthi-navy dark:text-white flex items-center gap-1.5">
                              <Cpu size={14} className="text-saarthi-royal-blue" />
                              Active Model: {prediction.model_info.name || currentModel.name}
                            </span>
                            <span className="font-mono font-bold text-[10px] text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-950/80 px-2 py-0.5 rounded-full border border-green-300 dark:border-green-800">
                              {prediction.model_info.test_accuracy} Test Acc
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                            <span>Architecture: <strong className="text-slate-700 dark:text-slate-300">{prediction.model_info.architecture}</strong></span>
                            {prediction.model_info.macro_f1 && (
                              <span>Macro F1: <strong className="text-slate-700 dark:text-slate-300">{prediction.model_info.macro_f1}</strong></span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Top Model Hypotheses */}
                      {prediction.top_predictions && prediction.top_predictions.length > 1 && (
                        <div>
                          <h5 className="text-xs font-bold text-saarthi-navy dark:text-slate-300 mb-2">
                            Top Model Hypotheses:
                          </h5>
                          <div className="space-y-1.5">
                            {prediction.top_predictions.slice(0, 4).map((p, idx) => (
                              <div
                                key={p.class_name}
                                className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800"
                              >
                                <span className="font-bold text-saarthi-navy dark:text-white truncate max-w-[200px]">
                                  {idx + 1}. {p.title}
                                </span>
                                <span className="font-mono font-black text-saarthi-royal-blue bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                                  {p.confidence.toFixed(1)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Statutory Metadata Preview */}
                      <div className="p-3.5 rounded-xl border border-linear-border-light dark:border-linear-border-dark bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Standard:</span>
                          <span className="font-bold text-saarthi-navy dark:text-white">{prediction.metadata.irc_code}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Geometry:</span>
                          <span className="font-bold text-saarthi-navy dark:text-white">{prediction.metadata.shape}</span>
                        </div>
                      </div>

                    </div>
                  ) : isProcessing ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full border-3 border-saarthi-royal-blue border-t-transparent animate-spin mb-4"></div>
                      <h4 className="text-sm font-bold text-saarthi-navy dark:text-white">
                        Running {currentModel.name} Inference...
                      </h4>
                      <p className="text-xs text-linear-text-muted dark:text-linear-text-muted-dark mt-1 max-w-xs">
                        Evaluating 224×224 feature maps and softmax distribution with {currentModel.architecture}.
                      </p>
                    </div>
                  ) : (
                    <div className="py-16 flex flex-col items-center justify-center text-center">
                      <EmptyUploadIllustration className="w-16 h-16 text-slate-400 mb-3" />
                      <h4 className="text-sm font-bold text-saarthi-navy dark:text-white">
                        Awaiting Image or Camera Input
                      </h4>
                      <p className="text-xs text-linear-text-muted dark:text-linear-text-muted-dark mt-1 max-w-xs font-medium">
                        Upload a photo or click one of the authentic test samples below to generate live predictions.
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Direct CTA: Scroll to AI Explanation */}
                <div className="pt-4 border-t border-linear-border-light dark:border-linear-border-dark mt-6">
                  <button
                    onClick={() => scrollTo('explanation')}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold rounded-xl bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet hover:opacity-95 text-white shadow-subtle transition-all"
                  >
                    <span>Inspect AI Explanation & Citations Below</span>
                    <ChevronDown size={14} />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: AI EXPLANATION SECTION (#explanation)          */}
      {/* ========================================================= */}
      <section id="explanation" className="py-24 border-b border-linear-border-light dark:border-linear-border-dark bg-gradient-to-b from-slate-50 via-purple-50/20 to-slate-50 dark:from-slate-900/60 dark:via-purple-950/20 dark:to-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10 border-b border-linear-border-light dark:border-linear-border-dark pb-6">
            <div className="inline-flex items-center gap-2 text-xs font-black text-saarthi-violet uppercase tracking-wider mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-saarthi-violet animate-pulse"></span>
              Statutory Knowledge Engine
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-saarthi-navy dark:text-white">
              AI Explanation & Driver Directives
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
              Inspect grounded statutory meaning, mandatory driver actions, Motor Vehicles Act rules, penalties, and official citations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Active Sign Identity & 85 Sign Directory (4 Cols) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Active Sign Profile Card with Colorful Category Accent */}
              <div className="p-5 rounded-2xl border-2 border-linear-border-light dark:border-linear-border-dark bg-white dark:bg-slate-900 shadow-elevated">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Sign Under Examination
                  </span>
                  {explanationData?.metadata && (
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                      explanationData.metadata.category_type === 'mandatory'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200'
                        : explanationData.metadata.category_type === 'cautionary'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200'
                    }`}>
                      {explanationData.metadata.category}
                    </span>
                  )}
                </div>

                {/* Sign Image Preview */}
                <div className="w-full aspect-[4/3] rounded-xl bg-slate-100 dark:bg-slate-950 border border-linear-border-light dark:border-linear-border-dark p-3.5 flex items-center justify-center mb-3.5">
                  <img
                    src={`${BACKEND_URL}/api/sample-image/${activeSignName}`}
                    alt={explanationData?.title || activeSignName}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                <h3 className="text-xl font-black text-saarthi-navy dark:text-white tracking-tight">
                  {explanationData?.title || activeSignName.replace(/_/g, ' ')}
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  Class: {activeSignName}
                </p>

                {explanationData?.metadata && (
                  <div className="mt-3.5 pt-3.5 border-t border-linear-border-light dark:border-linear-border-dark text-xs space-y-1.5 text-linear-text-muted dark:text-linear-text-muted-dark font-medium">
                    <div><strong className="text-saarthi-navy dark:text-slate-200">Geometry:</strong> {explanationData.metadata.shape}</div>
                    <div><strong className="text-saarthi-navy dark:text-slate-200">Standard Code:</strong> {explanationData.metadata.irc_code}</div>
                  </div>
                )}
              </div>

              {/* 85-Class Search Directory */}
              <div className="p-5 rounded-2xl border-2 border-linear-border-light dark:border-linear-border-dark bg-white dark:bg-slate-900 shadow-elevated">
                <h4 className="text-xs uppercase font-extrabold text-saarthi-navy dark:text-slate-200 mb-3 flex items-center justify-between">
                  <span>Explore All 85 Signs</span>
                  <span className="text-[10px] text-saarthi-royal-blue font-bold">Searchable</span>
                </h4>

                <div className="relative mb-3">
                  <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by sign name..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-saarthi-navy dark:text-white focus:outline-none focus:border-saarthi-royal-blue font-medium"
                  />
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((c) => (
                      <button
                        key={c.class_name}
                        onClick={() => fetchExplanation(c.class_name)}
                        className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                          c.class_name === activeSignName
                            ? 'bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet text-white shadow-xs'
                            : 'text-saarthi-navy dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate max-w-[190px]">{c.title}</span>
                        <ChevronRight size={13} className="opacity-60" />
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-linear-text-muted text-center py-4">
                      No matching sign found.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: 4 Distinct Color-Coded Statutory Cards (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {isLoadingExplanation ? (
                <div className="rounded-2xl border-2 border-saarthi-royal-blue/30 bg-white dark:bg-slate-900 p-12 text-center shadow-subtle">
                  <RefreshCw size={28} className="animate-spin mx-auto text-saarthi-royal-blue mb-3" />
                  <h4 className="text-sm font-bold text-saarthi-navy dark:text-white">
                    Synthesizing Statutory Road Rules...
                  </h4>
                </div>
              ) : explanationError ? (
                <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
                  {explanationError}
                </div>
              ) : explanationData?.sections ? (
                <div className="space-y-4">
                  
                  {/* Card 1: Meaning (Soft Blue Surface) */}
                  <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/20 p-5 sm:p-6 shadow-subtle">
                    <div className="flex items-center gap-2.5 text-saarthi-royal-blue font-bold text-xs uppercase tracking-wider mb-2">
                      <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-saarthi-royal-blue shadow-xs">
                        <BookOpen size={17} />
                      </span>
                      <span>1. What This Sign Means</span>
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-100 font-medium pl-10">
                      {explanationData.sections.meaning}
                    </p>
                  </div>

                  {/* Card 2: Driver Action (Soft Purple Surface) */}
                  <div className="rounded-2xl border-2 border-purple-200 dark:border-purple-900/60 bg-purple-50/70 dark:bg-purple-950/20 p-5 sm:p-6 shadow-subtle">
                    <div className="flex items-center gap-2.5 text-saarthi-violet font-bold text-xs uppercase tracking-wider mb-2">
                      <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-saarthi-violet shadow-xs">
                        <Compass size={17} />
                      </span>
                      <span>2. Recommended Driver Action</span>
                    </div>
                    <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-100 font-medium pl-10 whitespace-pre-line">
                      {explanationData.sections.driver_action}
                    </div>
                  </div>

                  {/* Card 3: Road-Safety & Fines (Soft Saffron/Amber Surface) */}
                  <div className="rounded-2xl border-2 border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 p-5 sm:p-6 shadow-subtle">
                    <div className="flex items-center gap-2.5 text-saarthi-saffron font-bold text-xs uppercase tracking-wider mb-2">
                      <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-saarthi-saffron shadow-xs">
                        <ShieldAlert size={17} />
                      </span>
                      <span>3. Road-Safety Context & Legal Enforcement</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-100 font-medium pl-10 mb-3">
                      {explanationData.sections.safety_context}
                    </p>
                    <div className="ml-10 p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-amber-300/80 dark:border-amber-800/80 text-xs text-slate-700 dark:text-slate-200 shadow-xs">
                      <strong className="text-saarthi-navy dark:text-white block mb-1 font-bold text-xs">
                        Statutory Penalty & Compounding Rules:
                      </strong>
                      {explanationData.sections.legal_reference}
                    </div>
                  </div>

                  {/* Card 4: Citations (Soft Mint Surface) */}
                  <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/20 p-5 sm:p-6 shadow-subtle">
                    <div className="flex items-center gap-2.5 text-green-700 dark:text-green-400 font-bold text-xs uppercase tracking-wider mb-2">
                      <span className="p-2 rounded-xl bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-400 shadow-xs">
                        <FileText size={17} />
                      </span>
                      <span>4. Sources & Trustworthy Citations</span>
                    </div>
                    <ul className="pl-10 space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {explanationData.sections.sources?.map((src, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
                          <span>{src}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ) : (
                <div className="py-16 text-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <EmptyExplanationIllustration className="w-16 h-16 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-saarthi-navy dark:text-white">
                    No Sign Selected
                  </h4>
                  <p className="text-xs text-linear-text-muted max-w-xs mx-auto mt-1">
                    Run detection in the studio above or pick any sign from the directory to inspect statutory rules.
                  </p>
                </div>
              )}

              {/* Grounded Follow-up Questions Card */}
              <div className="rounded-2xl border-2 border-linear-border-light dark:border-linear-border-dark bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-elevated">
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-saarthi-navy dark:text-slate-200 flex items-center gap-2">
                    <HelpCircle size={16} className="text-saarthi-royal-blue" />
                    Ask Follow-Up Questions About "{explanationData?.title || activeSignName}"
                  </h3>
                  <span className="text-[11px] text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-950/60 px-2.5 py-0.5 rounded-full">
                    Grounded in IRC:67 & MVA 1988
                  </span>
                </div>

                {/* Quick Prompt Chips with Colorful Hover Borders */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {quickPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendQuestion(prompt)}
                      disabled={isAsking}
                      className="px-3.5 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:border-saarthi-royal-blue hover:text-saarthi-royal-blue text-saarthi-navy dark:text-slate-200 font-bold transition-all hover:scale-102 shadow-xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Chat History */}
                {chatMessages.length > 0 && (
                  <div className="space-y-3 mb-4 max-h-72 overflow-y-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-linear-border-light dark:border-linear-border-dark scrollbar-thin">
                    {chatMessages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col text-xs leading-relaxed ${
                          m.sender === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl p-3 whitespace-pre-line ${
                            m.sender === 'user'
                              ? 'bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet text-white font-semibold shadow-xs'
                              : 'bg-white dark:bg-slate-800 border border-linear-border-light dark:border-linear-border-dark text-slate-800 dark:text-slate-100 shadow-xs'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendQuestion();
                  }}
                  className="flex items-center gap-2.5"
                >
                  <input
                    type="text"
                    placeholder="Ask about fines, speed rules, rain precautions, or legal sections..."
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    disabled={isAsking}
                    className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-saarthi-navy dark:text-white focus:outline-none focus:border-saarthi-royal-blue font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!userQuestion.trim() || isAsking}
                    className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                      !userQuestion.trim() || isAsking
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet hover:opacity-95 text-white shadow-subtle'
                    }`}
                  >
                    {isAsking ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                    <span>Ask</span>
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: HOW IT WORKS (#how-it-works)                   */}
      {/* ========================================================= */}
      <section id="how-it-works" className="py-24 border-b border-linear-border-light dark:border-linear-border-dark bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase font-black tracking-wider bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet bg-clip-text text-transparent mb-1 inline-block">
              Workflow Architecture
            </span>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-saarthi-navy dark:text-white">
              How Traffic Sign Saarthi Works
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
              A 3-step pipeline separating neural network classification from grounded statutory synthesis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1: Coral */}
            <div className="flex flex-col items-center text-center p-7 rounded-2xl border-2 border-red-200 dark:border-red-950/60 bg-white dark:bg-slate-900 shadow-subtle hover:border-red-400 transition-all">
              <div className="mb-5">
                <WorkflowUploadIllustration className="w-18 h-18" />
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-rose-400 text-white text-xs font-black flex items-center justify-center mb-3 shadow-xs">
                1
              </div>
              <h3 className="text-base font-bold text-saarthi-navy dark:text-white mb-1.5">
                Upload or Capture
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Input road imagery from device storage or live browser camera. The image is resized to 224×224 pixels with raw RGB normalization.
              </p>
            </div>

            {/* Step 2: Royal Blue */}
            <div className="flex flex-col items-center text-center p-7 rounded-2xl border-2 border-blue-200 dark:border-blue-950/60 bg-white dark:bg-slate-900 shadow-subtle hover:border-blue-400 transition-all">
              <div className="mb-5">
                <WorkflowRecognitionIllustration className="w-18 h-18" />
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet text-white text-xs font-black flex items-center justify-center mb-3 shadow-xs">
                2
              </div>
              <h3 className="text-base font-bold text-saarthi-navy dark:text-white mb-1.5">
                ResNet18 Recognition
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                The deep neural network classifies the sign across 85 categories, yielding 87.58% test accuracy and ranked probability distribution.
              </p>
            </div>

            {/* Step 3: Saffron */}
            <div className="flex flex-col items-center text-center p-7 rounded-2xl border-2 border-amber-200 dark:border-amber-950/60 bg-white dark:bg-slate-900 shadow-subtle hover:border-amber-400 transition-all">
              <div className="mb-5">
                <WorkflowExplanationIllustration className="w-18 h-18" />
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-saarthi-saffron to-amber-500 text-white text-xs font-black flex items-center justify-center mb-3 shadow-xs">
                3
              </div>
              <h3 className="text-base font-bold text-saarthi-navy dark:text-white mb-1.5">
                Statutory Understanding
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Retrieves verified statutory meaning, driver directives, and legal penalties under the Motor Vehicles Act with interactive Q&A.
              </p>
            </div>

          </div>

          {/* Visual Connection Diagram */}
          <div className="mt-12 p-4 rounded-2xl border border-linear-border-light dark:border-linear-border-dark bg-gradient-to-r from-saarthi-sky/40 via-purple-50/20 to-amber-50/20 dark:from-slate-900/60 dark:to-slate-900/60">
            <SignToExplanationIllustration />
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: FOOTER                                         */}
      {/* ========================================================= */}
      <footer className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet text-white shadow-elevated">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-3">
              <SaarthiLogo size={34} showText={false} />
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-base tracking-tight text-white leading-tight">
                  Traffic Sign Saarthi AI
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-white/80 uppercase">
                  Indian Road Safety Assistant
                </span>
              </div>
            </div>
            <p className="text-[11px] text-white/85 max-w-md mt-2 font-medium">
              Developed for Indian road conditions under IRC:67-2022 standards. ResNet18 trained on 85 traffic-sign categories.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-white/90">
            <button onClick={() => scrollTo('hero')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => scrollTo('features')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => scrollTo('detect')} className="hover:text-white transition-colors">Detection</button>
            <button onClick={() => scrollTo('explanation')} className="hover:text-white transition-colors">AI Explanation</button>
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors">How It Works</button>
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center gap-1.5 font-bold transition-all shadow-xs"
            >
              <span>About Project</span>
              <Info size={13} />
            </button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/80 gap-2 font-medium">
          <span>© 2026 Traffic Sign Saarthi AI. Built for university research, hackathons, and technical evaluation.</span>
          <span className="font-bold text-white bg-white/15 px-3 py-1 rounded-lg">Aligned with IRC:67-2022 & Motor Vehicles Act 1988/2019</span>
        </div>
      </footer>

      {/* About Modal Dialog */}
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />

    </div>
  );
};
