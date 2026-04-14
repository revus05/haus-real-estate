import { Building2, ClipboardList, Plus, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Личный кабинет" };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const [myListings, myLeads] = await Promise.all([
    prisma.property.count({ where: { ownerId: session.id } }),
    session.role !== "USER"
      ? prisma.lead.count({ where: { realtorId: session.id } })
      : Promise.resolve(0),
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Личный кабинет</h1>
        <p className="text-muted-foreground mt-1">
          Добро пожаловать, {session.name}! 👋
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Мои объявления
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myListings}</div>
          </CardContent>
        </Card>
        {session.role !== "USER" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Заявки</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myLeads}</div>
            </CardContent>
          </Card>
        )}
        {session.role === "ADMIN" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Администрирование
              </CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button size="sm" asChild className="mt-1">
                <Link href="/admin">В администрирование</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        <h2 className="font-semibold">Быстрые действия</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/listings/new">
              <Plus className="h-4 w-4 mr-2" />
              Новое объявление
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/listings">
              <Building2 className="h-4 w-4 mr-2" />
              Мои объявления
            </Link>
          </Button>
          {session.role !== "USER" && (
            <Button variant="outline" asChild>
              <Link href="/leads">
                <ClipboardList className="h-4 w-4 mr-2" />
                Просмотреть заявки
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/catalog">Просмотреть каталог</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
