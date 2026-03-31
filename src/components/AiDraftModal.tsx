"use client";

import { useCallback, useEffect, useState } from "react";
import {
  X,
  Loader2,
  Copy,
  CheckCheck,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  clientName: string;
  businessName?: string;
  score?: number;
}

interface Draft {
  subject: string;
  body: string;
  meta: {
    urgency: "gentle" | "firm" | "urgent";
    score: number;
    generatedAt: string;
  };
}

type Status = "idle" | "loading" | "success" | "error";

const URGENCY_LABEL: Record<string, string> = {
  gentle: "Gentle Reminder",
  firm: "Firm Reminder",
  urgent: "Urgent Notice",
};

const URGENCY_STYLE: Record<string, string> = {
  gentle: "bg-emerald-100 text-emerald-700 border-emerald-200",
  firm: "bg-amber-100 text-amber-700 border-amber-200",
  urgent: "bg-red-100 text-red-700 border-red-200",
};

export default function AiDraftModal({
  open,
  onClose,
  clientName,
  businessName,
  score = 80,
}: Props) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState<"subject" | "body" | null>(null);

  const generate = useCallback(() => {
    setStatus("loading");
    setDraft(null);
    setErrorMsg("");
    setCopied(null);

    fetch("/api/generate-draft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientName,
        businessName: businessName ?? clientName,
        score,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? `Request failed (${res.status})`);
        }
        return res.json() as Promise<Draft>;
      })
      .then((data) => {
        setDraft(data);
        setStatus("success");
      })
      .catch((err: Error) => {
        setErrorMsg(err.message);
        setStatus("error");
      });
  }, [clientName, businessName, score]);

  useEffect(() => {
    if (open) generate();
  }, [open, generate]);

  const handleClose = () => {
    setDraft(null);
    setStatus("idle");
    setErrorMsg("");
    setCopied(null);
    onClose();
  };

  const copyText = async (field: "subject" | "body", text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // clipboard API unavailable
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
        <div className="flex shrink-0 items-center gap-3 border-b border-gray-700 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight text-white">
              AI Draft
            </p>
            <p className="truncate text-xs text-gray-400">{clientName}</p>
          </div>

          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="relative mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/20">
                  <Sparkles className="h-7 w-7 text-indigo-400" />
                </div>
                <div className="absolute -inset-1 animate-ping rounded-2xl border-2 border-indigo-500/40" />
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                Generating…
              </div>

              <p className="mt-1.5 text-xs text-gray-500">
                Personalising based on client score ({score})
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-red-400">
                  Failed to generate draft
                </p>
                <p className="mt-0.5 break-words text-xs text-red-500/80">
                  {errorMsg}
                </p>
              </div>
            </div>
          )}

          {status === "success" && draft && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    URGENCY_STYLE[draft.meta.urgency] ??
                    "border-gray-200 bg-gray-100 text-gray-600"
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                  {URGENCY_LABEL[draft.meta.urgency] ?? draft.meta.urgency}
                </span>

                <span className="text-xs text-gray-500">
                  Score {draft.meta.score}
                </span>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Subject
                  </label>

                  <button
                    onClick={() => copyText("subject", draft.subject)}
                    className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-indigo-400"
                  >
                    {copied === "subject" ? (
                      <>
                        <CheckCheck className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="rounded-xl border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-sm font-medium leading-snug text-gray-100">
                  {draft.subject}
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Message
                  </label>

                  <button
                    onClick={() => copyText("body", draft.body)}
                    className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-indigo-400"
                  >
                    {copied === "body" ? (
                      <>
                        <CheckCheck className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="whitespace-pre-wrap rounded-xl border border-gray-700 bg-gray-800 px-4 py-3.5 text-sm leading-relaxed text-gray-300">
                  {draft.body}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-700 px-5 py-4">
          <button
            onClick={generate}
            disabled={status === "loading"}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "loading" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Regenerate
          </button>

          <button
            onClick={handleClose}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}