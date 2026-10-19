export interface SignMetadata {
  class_name: string;
  title: string;
  category: string;
  category_type: 'mandatory' | 'cautionary' | 'informatory';
  shape: string;
  meaning: string;
  driver_action: string;
  safety_context: string;
  legal_reference: string;
  irc_code: string;
  sources: string[];
}

export interface PredictionItem {
  class_name: string;
  title: string;
  confidence: number;
}

export interface ModelOption {
  id: string;
  name: string;
  short_name: string;
  tag: string;
  accuracy: string;
  macro_f1: string;
  weighted_f1: string;
  architecture: string;
  description: string;
  is_default: boolean;
  checkpoint_exists?: boolean;
  is_loaded?: boolean;
}

export interface PredictionResponse {
  predicted_class: string;
  title: string;
  confidence: number;
  metadata: SignMetadata;
  top_predictions: PredictionItem[];
  model_info: {
    model_id?: string;
    name?: string;
    short_name?: string;
    architecture: string;
    test_accuracy: string;
    macro_f1?: string;
    weighted_f1?: string;
    num_classes: number;
    tag?: string;
  };
}

export interface SampleSign {
  class_name: string;
  title: string;
  category: string;
  category_type: string;
  image_url: string;
}

export interface ExplanationResponse {
  sign_name: string;
  title: string;
  question?: string;
  answer?: string;
  metadata: SignMetadata;
  sections?: {
    meaning: string;
    driver_action: string;
    safety_context: string;
    legal_reference: string;
    sources: string[];
    irc_code: string;
  };
}
