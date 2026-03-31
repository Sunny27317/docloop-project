type IntelligenceScoreProps = {
  score: number
}

export default function IntelligenceScore({ score }: IntelligenceScoreProps) {
  return (
    <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-300">
      Intelligence Score: {score}
    </span>
  )
}