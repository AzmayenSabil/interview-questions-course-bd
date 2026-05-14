interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ProgressRing({
  percentage,
  size = 28,
  strokeWidth = 2.5,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference
  const isComplete = percentage >= 100

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label={`${percentage}% complete`}
      role="img"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-border"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className={
          isComplete
            ? 'text-green-500 transition-all duration-500'
            : 'text-indigo-500 transition-all duration-500'
        }
      />
      <text
        x={size / 2}
        y={size / 2 + 3.5}
        textAnchor="middle"
        fontSize={size * 0.28}
        fontWeight="700"
        fill="currentColor"
        className={isComplete ? 'text-green-500' : 'text-muted-foreground'}
      >
        {isComplete ? '✓' : percentage}
      </text>
    </svg>
  )
}
