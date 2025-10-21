"use client";

import { useEffect, useState } from "react";

interface TryOnLoadingAnimationProps {
  productName: string;
  isFullScreen?: boolean;
}

export function TryOnLoadingAnimation({
  productName,
  isFullScreen = false,
}: TryOnLoadingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      icon: "📤",
      title: "Subiendo imagen",
      description: "Cargando tu foto...",
    },
    {
      icon: "🔍",
      title: "Analizando",
      description: "Detectando tu silueta...",
    },
    {
      icon: "✨",
      title: "Aplicando IA",
      description: "Probando la prenda...",
    },
    {
      icon: "🎨",
      title: "Finalizando",
      description: "Ajustando detalles...",
    },
  ];

  useEffect(() => {
    // Simulate progress through steps
    const stepDuration = 3500; // 3.5 seconds per step
    const progressInterval = 50; // Update every 50ms

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / stepDuration) * progressInterval;
        if (newProgress >= 100) {
          return 0; // Reset for next step
        }
        return newProgress;
      });
    }, progressInterval);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 3) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, []);

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <LoadingContent
            steps={steps}
            currentStep={currentStep}
            progress={progress}
            productName={productName}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6">
      <LoadingContent
        steps={steps}
        currentStep={currentStep}
        progress={progress}
        productName={productName}
      />
    </div>
  );
}

function LoadingContent({
  steps,
  currentStep,
  progress,
  productName,
}: {
  steps: Array<{ icon: string; title: string; description: string }>;
  currentStep: number;
  progress: number;
  productName: string;
}) {
  return (
    <>
      {/* Main Animation */}
      <div className="flex flex-col items-center mb-8">
        {/* Animated Icon Circle */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
              <span className="text-4xl animate-bounce">
                {steps[currentStep].icon}
              </span>
            </div>
          </div>
          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* Step Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
          {steps[currentStep].title}
        </h3>
        <p className="text-sm text-gray-600 mb-1 text-center">
          {steps[currentStep].description}
        </p>
        <p className="text-xs text-gray-500 text-center">
          Probando <strong>{productName}</strong>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Paso {currentStep + 1} de {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={`${step.title}-${index}`}
            className={`flex items-center gap-3 transition-all duration-300 ${
              index === currentStep
                ? "scale-105"
                : index < currentStep
                ? "opacity-60"
                : "opacity-30"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                index < currentStep
                  ? "bg-green-500 text-white"
                  : index === currentStep
                  ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white animate-pulse"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {index < currentStep ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="text-lg">{step.icon}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${
                  index === currentStep ? "text-gray-900" : "text-gray-600"
                }`}
              >
                {step.title}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Info Message */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-blue-600 text-lg">⏱️</span>
          <div className="flex-1">
            <p className="text-xs text-blue-900 font-medium">
              Esto puede tomar unos segundos
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Nuestra IA está trabajando para crear la mejor prueba virtual posible
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
