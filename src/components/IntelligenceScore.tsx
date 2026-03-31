type IntelligenceScoreProps = {
  score: number | null
}

export default function IntelligenceScore({
  score,
}: IntelligenceScoreProps) {
  const safeScore = score ?? 0

  const getColor = () => {
    if (safeScore >= 85) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    if (safeScore >= 70) return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    return 'bg-rose-500/15 text-rose-300 border-rose-500/30'
  }

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${getColor()}`}>
      <span className="h-2 w-2 rounded-full bg-current opacity-80" />
      <span>Intelligence Score: {safeScore}</span>
    </div>
  )
}