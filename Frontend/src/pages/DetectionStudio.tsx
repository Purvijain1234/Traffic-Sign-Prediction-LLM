import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import {
  EmptyUploadIllustration,
  CameraPermissionIllustration,
  NoDetectionIllustration,
  ErrorIllustration,
} from '../components/Illustrations';
import { PredictionResponse, SampleSign, ModelOption } from '../types';
import { Cpu, ChevronDown } from 'lucide-react';

// --------------------------------------------------------------
// 1️⃣ Backend URL (read from Vite env var)
// --------------------------------------------------------------
const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL ||
  'https://traffic-sign-backend-49u0.onrender.com').replace(/\/$/, '');

const AVAILABLE_MODELS_DATA: ModelOption[] = [
  {
    id: 'resnet18',
    name: 'ResNet18 (Best Accuracy)',
    short_name: 'ResNet18',
    tag: 'Best Accuracy (87.58%)',
    accuracy: '87.58%',
    macro_f1: '72.25%',
    weighted_f1: '87.33%',
    architecture: 'ResNet18 (Residual Neural Network)',
    description:
      'Deep residual skip connections. Highest accuracy & macro F1 across 85 Indian traffic classes.',
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
    description:
      'Lightweight architecture with depthwise separable convolutions; low latency with high accuracy.',
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
    description:
      'Compound scaling method balancing network depth, width, and resolution.',
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
    description:
      '4-block convolutional network baseline trained from scratch without transfer learning.',
    is_default: false,
  },
];

export const DetectionStudio: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mode: upload | camera
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  // Model Selection State
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

  // Samples for quick testing
  const [samples, setSamples] = useState<SampleSign[]>([]);

  // --------------------------------------------------------------
  // 2️⃣ Check backend health & fetch initial data
  // --------------------------------------------------------------
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => {
        setBackendHealthy(data.status === 'healthy');
      })
      .catch(() => {
        setBackendHealthy(false);
      });

    fetch(`${BACKEND_URL}/api/models`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setModelOptions(data);
          const defaultMod =
            data.find((m: ModelOption) => m.is_default) ||
            data.find((m: ModelOption) => m.id === 'resnet18');
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
  }, []);

  // Handle sample query param if passed from landing page
  useEffect(() => {
    const sampleParam = searchParams.get('sample');
    if (sampleParam) {
      loadSampleSign(sampleParam);
    }
  }, [searchParams]);

  // Clean up object URLs and camera streams on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      stopCamera();
    };
  }, []);

  const loadSampleSign = async (className: string) => {
    setErrorMsg(null);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/sample-image/${encodeURIComponent(className)}`
      );
      if (!response.ok) throw new Error('Sample image not found on server.');
      const blob = await response.blob();
      const file = new File([blob], `${className}.jpg`, { type: 'image/jpeg' });

      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      const newUrl = URL.createObjectURL(blob);
      setSelectedFile(file);
      setPreviewUrl(newUrl);
      setMode('upload');

      // Auto‑run detection for the sample
      runDetection(file, selectedModel);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load sample image.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processSelectedFile(file);
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
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setErrorMsg(null);
  };

  const currentModel =
    modelOptions.find((m) => m.id === selectedModel) ||
    modelOptions[0] ||
    AVAILABLE_MODELS_DATA[0];

  // --------------------------------------------------------------
  // 3️⃣ Run Inference API
  // --------------------------------------------------------------
  const runDetection = async (fileToInfer?: File, modelIdToUse?: string) => {
    const targetFile = fileToInfer || selectedFile;
    const targetModel = modelIdToUse || selectedModel;

    if (!targetFile) {
      setErrorMsg('Please upload or capture an image first.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', targetFile);
    formData.append('model', targetModel);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/predict?model=${encodeURIComponent(targetModel)}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server responded with status ${response.status}`);
      }

      const data: PredictionResponse = await response.json();
      setPrediction(data);
    } catch (err: any) {
      console.error('Detection failed:', err);
      setErrorMsg(
        err.message ||
          'Inference service unavailable. Ensure backend FastAPI server is running.'
      );
      setPrediction(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setIsModelDropdownOpen(false);
    setErrorMsg(null);
    if (selectedFile) {
      runDetection(selectedFile, modelId);
    }
  };

  // --------------------------------------------------------------
  // 4️⃣ Camera Management
  // --------------------------------------------------------------
  const startCamera = async () => {
    setCameraError(null);
    setErrorMsg(null);
    setPrediction(null);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera error:', err);
      setIsCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(
          'Camera access was denied. Please allow camera permissions in your browser address bar to use live detection.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device detected on this system.');
      } else {
        setCameraError(`Camera initialization failed: ${err.message || 'Unknown error'}`);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
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
        const file = new File([blob], `camera-frame-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });
        if (previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(blob));
        setSelectedFile(file);
        // Run detection on captured frame
        runDetection(file, selectedModel);
      }
    }, 'image/jpeg', 0.92);
  }, [isCameraActive, previewUrl, selectedModel]);

  // --------------------------------------------------------------
  // Render
  // --------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-linear-border-light dark:border-linear-border-dark pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-linear-accent dark:text-linear-accent-dark uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-linear-accent"></span>
            Inference Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-linear-text-light dark:text-linear-text-dark">
            Detection Studio
          </h1>
          <p className="mt-1 text-sm text-linear-text-muted dark:text-linear-text-muted-dark max-w-2xl">
            Input traffic sign imagery to evaluate deep learning recognition and inspect calibrated classification results.
          </p>
        </div>

        {/* Model badge & backend status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-linear-border-light dark:border-linear-border-dark bg-linear-surface-light dark:bg-linear-surface-dark text-linear-text-light dark:text-linear-text-dark text-xs font-semibold">
            <Cpu size={13} className="text-linear-accent" />
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            ResNet18 (Best Accuracy)
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-800">
              87.58%
            </span>
          </div>

          {backendHealthy === true ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-800">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              API Ready
            </span>
          ) : backendHealthy === false ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <AlertCircle size={12} />
              Backend Connecting...
            </span>
          ) : null}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left pane – viewport & controls */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Mode selector */}
          <div className="flex items-center justify-between p-1 bg-linear-surface-light dark:bg-linear-surface-dark border border-linear-border-light dark:border-linear-border-dark rounded-md">
            <div className="grid grid-cols-2 gap-1 w-full max-w-xs">
              <button
                onClick={() => {
                  setMode('upload');
                  stopCamera();
                }}
                className={`flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-all ${
                  mode === 'upload'
                    ? 'bg-linear-bg-light dark:bg-[#2c2c32] text-linear-text-light dark:text-linear-text-dark shadow-subtle font-semibold'
                    : 'text-linear-text-muted dark:text-linear-text-muted-dark hover:text-linear-text-light dark:hover:text-linear-text-dark'
                }`}
              >
                <Upload size={13} />
                <span>Image Upload</span>
              </button>

              <button
                onClick={() => {
                  setMode('camera');
                  if (!isCameraActive) startCamera();
                }}
                className={`flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-all ${
                  mode === 'camera'
                    ? 'bg-linear-bg-light dark:bg-[#2c2c32] text-linear-text-light dark:text-linear-text-dark shadow-subtle font-semibold'
                    : 'text-linear-text-muted dark:text-linear-text-muted-dark hover:text-linear-text-light dark:hover:text-linear-text-dark'
                }`}
              >
                <Camera size={13} />
                <span>Live Camera</span>
              </button>
            </div>

            {/* Quick actions for upload mode */}
            {mode === 'upload' && previewUrl && (
              <div className="flex items-center gap-1 pr-1">
                <button
                  onClick={clearSelection}
                  className="px-2 py-1 text-xs text-linear-text-muted dark:text-linear-text-muted-dark hover:text-red-600 transition-colors flex items-center gap-1"
                  title="Remove image"
                >
                  <Trash2 size={13} />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary viewport */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-lg border border-linear-border-light dark:border-linear-border-dark bg-linear-surface-light/50 dark:bg-linear-surface-dark/50 overflow-hidden flex flex-col items-center justify-center">
            {/* Upload view */}
            {mode === 'upload' && (
              <>
                {previewUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black/5 dark:bg-black/30 p-4">
                    <img
                      src={previewUrl}
                      alt="Uploaded sign preview"
                      className="max-h-full max-w-full object-contain rounded shadow-subtle"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 pointer-events-none flex flex-col justify-start">
                        <div className="w-full h-0.5 bg-linear-accent dark:bg-linear-accent-dark shadow-[0_0_12px_#6E56CF] animate-scan"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? 'bg-linear-accent-soft dark:bg-linear-accent-soft-dark border-2 border-dashed border-linear-accent'
                        : 'hover:bg-linear-surface-light dark:hover:bg-[#222227]'
                    }`}
                    onClick={() => document.getElementById('file-upload-input')?.click()}
                  >
                    <input
                      id="file-upload-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <EmptyUploadIllustration className="w-16 h-16 text-linear-text-muted dark:text-linear-text-muted-dark mb-4" />
                    <h3 className="text-sm font-semibold text-linear-text-light dark:text-linear-text-dark mb-1">
                      Drop an Indian traffic sign image here
                    </h3>
                    <p className="text-xs text-linear-text-muted dark:text-linear-text-muted-dark max-w-xs mb-4">
                      Supports JPEG, PNG, and WebP format. Standard Indian road sign photos work best.
                    </p>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-md border border-linear-border-light dark:border-linear-border-dark bg-linear-bg-light dark:bg-linear-surface-dark text-xs font-medium text-linear-text-light dark:text-linear-text-dark shadow-subtle hover:bg-linear-surface-light dark:hover:bg-[#2b2b32] transition-colors"
                    >
                      Select from computer
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Camera view */}
            {mode === 'camera' && (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${!isCameraActive ? 'hidden' : ''}`}
                />
                {/* Permission / inactive UI */}
                {!isCameraActive && (
                  <div className="p-6 text-center max-w-sm">
                    {cameraError ? (
                      <div className="flex flex-col items-center">
                        <CameraPermissionIllustration className="w-16 h-16 text-linear-text-muted dark:text-linear-text-muted-dark mb-3" />
                        <h3 className="text-sm font-semibold text-red-500 mb-1">
                          Camera Access Restricted
                        </h3>
                        <p className="text-xs text-linear-text-muted dark:text-linear-text-muted-dark mb-4 leading-relaxed">
                          {cameraError}
                        </p>
                        <button
                          onClick={startCamera}
                          className="px-4 py-1.5 rounded-md bg-linear-accent text-white text-xs font-medium"
                        >
                          Retry Permission
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Camera size={32} className="text-linear-text-muted mb-3" />
                        <h3 className="text-sm font-semibold text-white mb-1">
                          Browser Camera Feed
                        </h3>
                        <p className="text-xs text-zinc-400 mb-4">
                          Camera permissions are requested only upon activation. Point your camera at an Indian traffic sign.
                        </p>
                        <button
                          onClick={startCamera}
                          className="px-4 py-2 rounded-md bg-linear-accent hover:bg-linear-accent-hover text-white text-xs font-medium shadow-subtle flex items-center gap-1.5"
                        >
                          <Play size={13} />
                          <span>Start Camera</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Reticle overlay when camera is active */}
                {isCameraActive && (
                  <>
                    <div className="absolute inset-8 sm:inset-12 border border-white/40 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                      <div className="flex justify-between">
                        <span className="w-4 h-4 border-t-2 border-l-2 border-linear-accent"></span>
                        <span className="w-4 h-4 border-t-2 border-r-2 border-linear-accent"></span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                          Align Indian Traffic Sign Inside Frame
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="w-4 h-4 border-b-2 border-l-2 border-linear-accent"></span>
                        <span className="w-4 h-4 border-b-2 border-r-2 border-linear-accent"></span>
                      </div>
                    </div>

                    {isProcessing && (
                      <div className="absolute inset-0 pointer-events-none flex flex-col justify-start">
                        <div className="w-full h-0.5 bg-linear-accent shadow-[0_0_12px_#6E56CF] animate-scan"></div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Action bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-linear-border-light dark:border-linear-border-dark bg-linear-bg-light dark:bg-linear-surface-dark">
            <div className="text-xs text-linear-text-muted dark:text-linear-text-muted-dark">
              {mode === 'upload' ? (
                selectedFile ? (
                  <span className="font-mono text-linear-text-light dark:text-linear-text-dark">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                ) : (
                  <span>No image selected yet</span>
                )
              ) : isCameraActive ? (
                <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  Camera stream active
                </span>
              ) : (
                <span>Camera stopped</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {mode === 'upload' && (
                <button
                  onClick={() => runDetection()}
                  disabled={!selectedFile || isProcessing}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                    !selectedFile || isProcessing
                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                      : 'bg-linear-accent hover:bg-linear-accent-hover text-white shadow-subtle'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Classifying ResNet18...</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} />
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-linear-accent hover:bg-linear-accent-hover text-white shadow-subtle transition-all"
                  >
                    <Camera size={13} />
                    <span>Capture Frame</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="p-2 text-xs rounded-md border border-linear-border-light dark:border-linear-border-dark hover:bg-linear-surface-light dark:hover:bg-[#2b2b32] text-linear-text-muted"
                    title="Stop Camera"
                  >
                    <Square size={13} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Sample picker */}
          {samples.length > 0 && (
            <div className="p-3.5 rounded-lg border border-linear-border-light dark:border-linear-border-dark bg-linear-surface-light/40 dark:bg-linear-surface-dark/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-linear-text-muted dark:text-linear-text-muted-dark uppercase tracking-wider">
                  Test with Authentic Indian Dataset Signs:
                </span>
                <span className="text-[11px] text-linear-text-muted dark:text-linear-text-muted-dark">
                  Click to test
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {samples.map((s) => (
                  <button
                    key={s.class_name}
                    onClick={() => loadSampleSign(s.class_name)}
                    className="flex-shrink-0 flex items-center gap-2 p-1.5 pr-2.5 rounded border border-linear-border-light dark:border-linear-border-dark bg-linear-bg-light dark:bg-linear-surface-dark hover:border-linear-accent transition-colors"
                  >
                    <div className="w-7 h-7 rounded bg-white dark:bg-zinc-800 p-0.5 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                      <img
                        src={s.image_url}
                        alt={s.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-linear-text-light dark:text-linear-text-dark">
                      {s.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right pane – results */}
        <div className="lg:col-span-5">
          <div className="border border-linear-border-light dark:border-linear-border-dark rounded-lg bg-linear-bg-light dark:bg-linear-surface-dark p-5 shadow-subtle min-h-[460px] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-linear-border-light dark:border-linear-border-dark mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-linear-text-muted dark:text-linear-text-muted-dark">
                  Detection Results
                </h2>
                <span className="text-[11px] font-mono text-linear-text-muted dark:text-linear-text-muted-dark font-medium">
                  {prediction?.model_info?.name || currentModel.name} (
                  {prediction?.model_info?.test_accuracy || currentModel.accuracy})
                </span>
              </div>

              {/* Error banner */}
              {errorMsg && (
                <div className="p-3.5 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 mb-4 flex items-start gap-2">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Classification Error</span>
                    <span>{errorMsg}</span>
                  </div>
                </div>
              )}

              {/* Result content */}
              {prediction ? (
                <div className="space-y-4">
                  {/* Top prediction banner */}
                  <div className="p-4 rounded-md border border-linear-border-light dark:border-linear-border-dark bg-linear-surface-light dark:bg-[#1f1f23]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded tracking-wider ${
                          prediction.metadata.category_type === 'mandatory'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            : prediction.metadata.category_type === 'cautionary'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {prediction.metadata.category}
                      </span>
                      <span className="text-xs font-bold font-mono text-linear-accent dark:text-linear-accent-dark">
                        {prediction.confidence.toFixed(1)}% Confidence
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-linear-text-light dark:text-linear-text-dark tracking-tight">
                      {prediction.title}
                    </h3>
                    <p className="text-xs text-linear-text-muted dark:text-linear-text-muted-dark font-mono mt-0.5">
                      Class ID: {prediction.predicted_class}
                    </p>

                    {/* Confidence bar */}
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          prediction.confidence >= 80
                            ? 'bg-green-500'
                            : prediction.confidence >= 50
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(prediction.confidence, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Top alternate hypotheses */}
                  {prediction.top_predictions && prediction.top_predictions.length > 1 && (
                    <div>
                      <h4 className="text-xs font-semibold text-linear-text-muted dark:text-linear-text-muted-dark mb-2">
                        Top Model Hypotheses
                      </h4>
                      <div className="space-y-1.5">
                        {prediction.top_predictions.slice(0, 4).map((p, idx) => (
                          <div
                            key={p.class_name}
                            className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded bg-linear-surface-light/60 dark:bg-linear-surface-dark/60 border border-linear-border-light dark:border-linear-border-dark"
                          >
                            <span className="font-medium text-linear-text-light dark:text-linear-text-dark truncate max-w-[200px]">
                              {idx + 1}. {p.title}
                            </span>
                            <span className="font-mono text-linear-text-muted dark:text-linear-text-muted-dark">
                              {p.confidence.toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Statutory info */}
                  <div className="p-3 rounded-md border border-linear-border-light dark:border-linear-border-dark bg-linear-surface-light/40 dark:bg-linear-surface-dark/40 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-linear-text-muted dark:text-linear-text-muted-dark">Standard:</span>
                      <span className="font-medium text-linear-text-light dark:text-linear-text-dark">
                        {prediction.metadata.irc_code}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-linear-text-muted dark:text-linear-text-muted-dark">Geometry:</span>
                      <span className="font-medium text-linear-text-light dark:text-linear-text-dark">
                        {prediction.metadata.shape}
                      </span>
                    </div>
                  </div>
                </div>
              ) : isProcessing ? (
                // Loading spinner
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-linear-accent border-t-transparent animate-spin mb-4"></div>
                  <h3 className="text-sm font-semibold text-linear-text-light dark:text-linear-text-dark">
                    Running {currentModel.name} Inference...
                  </h3>
                  <p className="text-xs text-linear-text-muted dark:text-linear-text-muted-dark mt-1 max-w-xs">
                    Evaluating 224×224 feature maps and softmax distribution with {currentModel.architecture}.
                  </p>
                </div>
              ) : (
                // Empty state
                <div className="py-14 flex flex-col items-center justify-center text-center">
                  <EmptyUploadIllustration className="w-16 h-16 text-linear-text-muted dark:text-linear-text-muted-dark mb-3 opacity-60" />
                  <h3 className="text-sm font-semibold text-linear-text-light dark:text-linear-text-dark">
                    Awaiting Input
                  </h3>
                  <p className="text-xs text-linear-text-muted dark:text-linear-text-muted-dark mt-1 max-w-xs">
                    Upload a traffic sign image or click one of the authentic test samples below to run detection.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom button – navigate to explainer */}
            <div className="pt-4 border-t border-linear-border-light dark:border-linear-border-dark mt-4">
              <button
                onClick={() => {
                  if (prediction) {
                    navigate(`/explain?sign=${prediction.predicted_class}`);
                  }
                }}
                disabled={!prediction}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-md transition-all ${
                  prediction
                    ? 'bg-linear-accent hover:bg-linear-accent-hover text-white shadow-subtle'
                    : 'bg-zinc-100 dark:bg-[#25252a] text-zinc-400 dark:text-zinc-600 cursor-not-allowed border border-linear-border-light dark:border-linear-border-dark'
                }`}
              >
                <span>Understand This Sign</span>
                <ArrowRight size={14} />
              </button>
              <p className="text-[11px] text-center text-linear-text-muted dark:text-linear-text-muted-dark mt-2">
                Transfers detected sign to AI Explainer for statutory meaning & driver directives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
