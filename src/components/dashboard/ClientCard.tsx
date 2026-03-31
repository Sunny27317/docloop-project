"use client";

type Client = {
  id: string;
  business_name: string;
  contact_name: string | null;
  email: string | null;
};

type ClientCardProps = {
  client: Client;
  score: number;
  onAiDraft: (clientName: string, businessName: string, score: number) => void;
};

export default function ClientCard({
  client,
  score,
  onAiDraft,
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
        <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-300">
          Intelligence Score: {score}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-400">Generate follow-up</p>

        <button
          onClick={() =>
            onAiDraft(
              client.contact_name || client.business_name,
              client.business_name,
              score
            )
          }
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
        >
          AI Draft
        </button>
      </div>
    </div>
  );
}