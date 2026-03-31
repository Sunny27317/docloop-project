type AiDraftModalProps = {
  open: boolean
  clientName: string
  onClose: () => void
}

export default function AiDraftModal({
  open,
  clientName,
  onClose,
}: AiDraftModalProps) {
  if (!open) return null

  const draft = `Hi ${clientName}, just a quick reminder to upload your monthly documents for review. Please send over your bank statement and any missing files when you can. Thanks.`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/80">
              AI Draft Preview
            </p>
            <h3 className="mt-2 text-2xl font-semibold">Follow-up message</h3>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            Close
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="whitespace-pre-line text-sm leading-7 text-zinc-200">
            {draft}
          </p>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            Cancel
          </button>
          <button className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400">
            Use Draft
          </button>
        </div>
      </div>
    </div>
  )
}