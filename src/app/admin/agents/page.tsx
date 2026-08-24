import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { Badge } from "@/components/Badge";
import { formatDate } from "@/lib/format";
import { setAgentStatus } from "../admin-actions";

export const metadata = { title: "Agents" };

export default async function AdminAgentsPage() {
  await requireRole("ADMIN");
  const agents = await prisma.user.findMany({
    where: { role: "AGENT" },
    include: { _count: { select: { listings: true, reviews: true } } },
    orderBy: [{ agentStatus: "desc" }, { createdAt: "desc" }],
  });
  const pending = agents.filter((a) => a.agentStatus === "PENDING");
  const rest = agents.filter((a) => a.agentStatus !== "PENDING");

  const AgentCard = ({ agent }: { agent: (typeof agents)[number] }) => (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-slate-900">{agent.agencyName ?? agent.name}</h2>
            <Badge value={agent.agentStatus ?? "PENDING"} />
          </div>
          <p className="text-sm text-slate-500">
            {agent.name} - {agent.email}{agent.phone ? ` - ${agent.phone}` : ""}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Applied {formatDate(agent.createdAt)} - {agent._count.listings} listings - {agent._count.reviews} reviews
          </p>
          {agent.bio && <p className="mt-2 text-sm text-slate-600 max-w-xl">{agent.bio}</p>}
        </div>
        <div className="flex gap-2">
          {agent.agentStatus !== "APPROVED" && (
            <form action={setAgentStatus}>
              <input type="hidden" name="id" value={agent.id} />
              <input type="hidden" name="status" value="APPROVED" />
              <button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors cursor-pointer">
                Approve
              </button>
            </form>
          )}
          {agent.agentStatus === "APPROVED" && (
            <form action={setAgentStatus}>
              <input type="hidden" name="id" value={agent.id} />
              <input type="hidden" name="status" value="SUSPENDED" />
              <button className="rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                Suspend
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Agents</h1>

      {pending.length > 0 && (
        <>
          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-amber-600">
            Awaiting review ({pending.length})
          </h2>
          <div className="mt-3 space-y-3">
            {pending.map((a) => <AgentCard key={a.id} agent={a} />)}
          </div>
        </>
      )}

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-slate-400">
        All agents ({rest.length})
      </h2>
      <div className="mt-3 space-y-3">
        {rest.map((a) => <AgentCard key={a.id} agent={a} />)}
      </div>
    </div>
  );
}
