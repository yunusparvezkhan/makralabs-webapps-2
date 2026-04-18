// Operation types for the playground
export type OperationType = "data" | "chunks" | "map";

// Schema input mode for Extract Data
export type SchemaInputMode = "schema" | "prompt";

// Available models for selection
export type ModelType = "gpt-4o" | "gpt-4o-mini" | "claude-3-opus" | "claude-3-sonnet";

// Extract Data form state
export interface ExtractDataFormState {
  autoSchema: boolean;
  schemaInputMode: SchemaInputMode;
  schema: string;
  prompt: string;
  enablePagination: boolean;
  enableNavigation: boolean;
  selectedModel: ModelType;
}

// Query Chunks form state
export interface QueryChunksFormState {
  matchingQuery: string;
  maxChunks: number;
  queryAllText: boolean;
}

// Complete form data for submission
export interface PlaygroundFormData {
  url: string;
  operationType: OperationType;
  extractData: ExtractDataFormState;
  queryChunks: QueryChunksFormState;
}

// Default values
export const DEFAULT_EXTRACT_DATA: ExtractDataFormState = {
  autoSchema: true,
  schemaInputMode: "schema",
  schema: "",
  prompt: "",
  enablePagination: false,
  enableNavigation: false,
  selectedModel: "gpt-4o",
};

export const DEFAULT_QUERY_CHUNKS: QueryChunksFormState = {
  matchingQuery: "",
  maxChunks: 10,
  queryAllText: false,
};

export const MODEL_OPTIONS: { value: ModelType; label: string }[] = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "claude-3-opus", label: "Claude 3 Opus" },
  { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
];
