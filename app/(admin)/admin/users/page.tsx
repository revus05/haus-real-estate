import type { Metadata } from "next";
import { UsersTable } from "@/components/admin/users-table";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Администрирование — Управление пользователями",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { properties: true, leads: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-5xl space-y-6 mx-auto">
      <h1 className="text-2xl font-bold">Управление пользователями</h1>
      <UsersTable users={serialized} />
    </div>
  );
}
