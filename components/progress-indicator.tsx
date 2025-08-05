interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export function ProgressIndicator({ currentStep, totalSteps, steps }: ProgressIndicatorProps) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        {steps.map((step, index) => (
          <span
            key={index}
            className={`text-sm font-medium transition-colors ${
              index + 1 <= currentStep ? "text-blue-600" : "text-gray-400"
            }`}
          >
            {step}
          </span>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}
