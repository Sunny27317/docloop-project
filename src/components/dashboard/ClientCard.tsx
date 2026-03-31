import IntelligenceScore from "@/components/shared/IntelligenceScore"

type ClientCardProps = {
  client: {
    id: string
    business_name: string
    contact_name: string | null
    email: string | null
  }
  score: number
  onOpenDraft: (name: string) => void
}

export default function ClientCard({
  client,
  score,
  onOpenDraft,
}: ClientCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-lg">
      <h3 className="text-lg font-semibold">{client.business_name}</h3>
      <p className="text-sm text-zinc-400">
        {client.contact_name || "No contact"}
      </p>
      <p className="mb-4 text-sm text-zinc-500">
        {client.email || "No email"}
      </p>

      <div className="mb-4">
        <IntelligenceScore score={score} />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-400">Generate follow-up</p>

        <button
          onClick={() =>
            onOpenDraft(client.contact_name || client.business_name)
          }
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
        >
          AI Draft
        </button>
      </div>
    </div>
  )
}