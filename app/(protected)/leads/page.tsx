import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LeadsTable } from "@/components/leads/leads-table";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Заявки" };

export default async function LeadsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "USER") redirect("/dashboard");

  const leads = await prisma.lead.findMany({
    where: { realtorId: session.id },
    orderBy: { createdAt: "desc" },
    include: {
      property: { select: { id: true, title: true } },
    },
  });

  const serialized = leads.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  }));

  return (
    <div className="max-w-5xl space-y-6 mx-auto">
      <h1 className="text-2xl font-bold">Заявки</h1>
      <LeadsTable leads={serialized} />
    </div>
  );
}
