/**
 * Seed script — creates an admin user + sample data
 * Run: bun run db:seed
 */
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

// Direct instantiation for seed (bypasses Next.js singleton pattern)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.log(process.env.DATABASE_URL || "")


async function main() {
  console.log("🌱 Seeding database…")

  // Admin user
  const adminHash = await bcrypt.hash("admin123456", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@haus.dev" },
    update: {},
    create: {
      email: "admin@haus.dev",
      name: "Admin",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  })
  console.log(`✅ Администратор: ${admin.email}`)

  // Realtor user
  const realtorHash = await bcrypt.hash("realtor123456", 12)
  const realtor = await prisma.user.upsert({
    where: { email: "realtor@haus.dev" },
    update: {},
    create: {
      email: "realtor@haus.dev",
      name: "Мария Иванова",
      passwordHash: realtorHash,
      role: "REALTOR",
      phone: "+375 29 123-45-67",
    },
  })
  console.log(`✅ Агент: ${realtor.email}`)

  // Sample properties
  const properties = [
    {
      title: "Просторная 2-комнатная квартира в центре города",
      description:
        "Красивая квартира с современным ремонтом, паркетными полами и потрясающим видом на город. Пешком до магазинов, ресторанов и общественного транспорта. Светлые комнаты, качественная отделка, новая мебель.",
      dealType: "SALE" as const,
      propertyType: "APARTMENT" as const,
      price: "450000",
      currency: "BYN",
      rooms: 2,
      area: "75.5",
      floor: 8,
      totalFloors: 15,
      address: "пр. Независимости, 60, кв. 87",
      city: "Минск",
      district: "Центральный",
      moderationStatus: "PUBLISHED" as const,
      ownerId: realtor.id,
    },
    {
      title: "Уютная студия рядом с университетом",
      description:
        "Идеально подходит для студентов и молодых специалистов. Недавно отремонтирована, полностью меблирована, все коммунальные услуги включены. Отличное естественное освещение, современная кухня, просторный санузел.",
      dealType: "RENT" as const,
      propertyType: "STUDIO" as const,
      price: "1500",
      currency: "BYN",
      rooms: 1,
      area: "32",
      floor: 3,
      totalFloors: 6,
      address: "ул. Академическая, 28, кв. 12",
      city: "Минск",
      district: "Академический",
      moderationStatus: "PUBLISHED" as const,
      ownerId: realtor.id,
    },
    {
      title: "Семейный дом с садом в пригороде",
      description:
        "Очаровательный четырёхкомнатный семейный дом с большим задним двором, гаражом на две машины и обновлённой кухней. Расположен в тихом районе с хорошими школами поблизости. Просторные комнаты, отличная планировка, безопасное соседство.",
      dealType: "SALE" as const,
      propertyType: "HOUSE" as const,
      price: "850000",
      currency: "BYN",
      rooms: 4,
      area: "180",
      address: "мкр. Сокол, 45",
      city: "Минск",
      district: "Боровляны",
      moderationStatus: "PUBLISHED" as const,
      ownerId: realtor.id,
    },
  ]

  for (const data of properties) {
    const p = await prisma.property.create({ data })
    console.log(`✅ Объект: "${p.title}"`)
  }

  console.log("\n🎉 Заполнение базы завершено!")
  console.log("   Вход администратора: admin@haus.dev / admin123456")
  console.log("   Вход агента: realtor@haus.dev / realtor123456")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
