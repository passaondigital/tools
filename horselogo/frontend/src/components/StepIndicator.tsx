interface Props {
  currentStep: number
  totalSteps?: number
}

const STEPS = ['Dein Business', 'Dein Design', 'Vorschläge', 'Checkout']

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {STEPS.map((label, i) => {
        const step = i + 1
        const isDone = step < currentStep
        const isActive = step === currentStep
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isDone
                    ? 'bg-[rgba(201,168,76,0.3)] text-[#C9A84C] border border-[rgba(201,168,76,0.5)]'
                    : isActive
                    ? 'bg-[#C9A84C] text-[#0a0700]'
                    : 'bg-[rgba(255,255,255,0.04)] text-[rgba(232,228,221,0.35)] border border-[rgba(255,255,255,0.06)]'
                }`}
              >
                {isDone ? '✓' : step}
              </div>
              <span
                className={`text-xs font-semibold hidden sm:block transition-colors duration-300 ${
                  isActive ? 'text-[#E8E4DD]' : 'text-[rgba(232,228,221,0.35)]'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 h-px transition-all duration-300 ${
                  isDone ? 'bg-[rgba(201,168,76,0.4)]' : 'bg-[rgba(255,255,255,0.06)]'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
