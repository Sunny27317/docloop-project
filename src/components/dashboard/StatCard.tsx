type StatCardProps = {
  label: string
  value: number
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
      <p className="text-sm text-zinc-400">{label}</p>
      <h3 className="mt-2 text-2xl font-bold">{value}</h3>
    </div>
  )
}