"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import AiDraftModal from "@/components/shared/AiDraftModal";
import StatCard from "@/components/dashboard/StatCard";
import ClientCard from "@/components/dashboard/ClientCard";

type Client = {
  id: string;
  business_name: string;
  contact_name: string | null;
  email: string | null;
};

type IntelligenceScoreRow = {
  client_id: string;
  score: number | null;
};

type DraftTarget = {
  clientName: string;
  businessName: string;
  score: number;
} | null;

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [scores, setScores] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(true);
  const [draftTarget, setDraftTarget] = useState<DraftTarget>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      const [
        { data: clientsData, error: clientsError },
        { data: scoresData, error: scoresError },
      ] = await Promise.all([
        supabase.from("clients").select("id, business_name, contact_name, email"),
        supabase.from("intelligence_scores").select("client_id, score"),
      ]);

      if (clientsError) {
        console.error("Clients error:", clientsError);
      }

      if (scoresError) {
        console.error("Scores error:", scoresError);
      }

      setClients((clientsData as Client[]) ?? []);

      const scoreMap: Record<string, number | null> = {};
      ((scoresData as IntelligenceScoreRow[]) ?? []).forEach((row) => {
        scoreMap[row.client_id] = row.score;
      });
      setScores(scoreMap);

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.length;

    const averageScore =
      clients.length > 0
        ? Math.round(
            clients.reduce((sum, client) => sum + (scores[client.id] ?? 0), 0) /
              clients.length
          )
        : 0;

    const highPriority = clients.filter(
      (client) => (scores[client.id] ?? 0) < 80
    ).length;

    return {
      totalClients,
      activeClients,
      averageScore,
      highPriority,
    };
  }, [clients, scores]);

  const handleAiDraft = (
    clientName: string,
    businessName: string,
    score: number
  ) => {
    setDraftTarget({
      clientName,
      businessName,
      score,
    });
  };

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mb-10">
        <p className="mb-2 text-xs tracking-[0.3em] text-emerald-400">
          INVESTOR DEMO PREVIEW
        </p>
        <h1 className="text-4xl font-bold">DocLoop Dashboard</h1>
        <p className="mt-2 text-zinc-400">
          AI-powered client operations platform
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard label="Total Clients" value={stats.totalClients} />
        <StatCard label="Active Clients" value={stats.activeClients} />
        <StatCard label="Average Score" value={stats.averageScore} />
        <StatCard label="Needs Attention" value={stats.highPriority} />
      </div>

      <h2 className="mb-4 text-xl font-semibold">Clients</h2>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6 text-zinc-400">
          Loading...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              score={scores[client.id] ?? 0}
              onAiDraft={handleAiDraft}
            />
          ))}
        </div>
      )}

      <AiDraftModal
        open={draftTarget !== null}
        onClose={() => setDraftTarget(null)}
        clientName={draftTarget?.clientName ?? ""}
        businessName={draftTarget?.businessName ?? ""}
        score={draftTarget?.score ?? 80}
      />
    </main>
  );
}