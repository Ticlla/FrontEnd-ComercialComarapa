/**
 * Processing indicator with progress bar and status.
 */

// =============================================================================
// TYPES
// =============================================================================

interface ProcessingIndicatorProps {
  progress: number;
  filesCount: number;
  status?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ProcessingIndicator({
  progress,
  filesCount,
  status = 'Procesando imágenes...',
}: ProcessingIndicatorProps) {
  return (
    <div className="w-full max-w-md mx-auto p-8">
      {/* Animated Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-pulse" />
          
          {/* Inner spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin" />
          </div>
          
          {/* AI Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {status}
        </h3>
        <p className="text-sm text-gray-500">
          Analizando {filesCount} {filesCount === 1 ? 'imagen' : 'imágenes'} con IA
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        {/* Percentage */}
        <div className="absolute -top-6 right-0 text-sm font-medium text-indigo-600">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Steps */}
      <div className="mt-6 space-y-2">
        <ProcessingStep
          completed={progress > 20}
          active={progress <= 20}
          label="Subiendo imágenes"
        />
        <ProcessingStep
          completed={progress > 50}
          active={progress > 20 && progress <= 50}
          label="Extrayendo texto con AI Vision"
        />
        <ProcessingStep
          completed={progress > 80}
          active={progress > 50 && progress <= 80}
          label="Identificando productos"
        />
        <ProcessingStep
          completed={progress >= 100}
          active={progress > 80 && progress < 100}
          label="Buscando coincidencias"
        />
      </div>
    </div>
  );
}

// =============================================================================
// SUB-COMPONENT
// =============================================================================

interface ProcessingStepProps {
  completed: boolean;
  active: boolean;
  label: string;
}

function ProcessingStep({ completed, active, label }: ProcessingStepProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Icon */}
      <div
        className={`
          w-5 h-5 rounded-full flex items-center justify-center transition-colors
          ${completed
            ? 'bg-green-500'
            : active
            ? 'bg-indigo-500 animate-pulse'
            : 'bg-gray-200'
          }
        `}
      >
        {completed ? (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : active ? (
          <div className="w-2 h-2 bg-white rounded-full" />
        ) : null}
      </div>

      {/* Label */}
      <span
        className={`
          text-sm transition-colors
          ${completed
            ? 'text-green-700 font-medium'
            : active
            ? 'text-indigo-700 font-medium'
            : 'text-gray-400'
          }
        `}
      >
        {label}
      </span>
    </div>
  );
}






