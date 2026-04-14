import {
  Building2,
  CheckCircle2,
  FileText,
  Home,
  Landmark,
  Phone,
  Send,
  Shield,
  Star,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "О нас — HAUS Real Estate",
  description:
    "HAUS Real Estate — профессиональное агентство недвижимости в Беларуси. Полное сопровождение сделок с гарантией юридической чистоты.",
};

const services = [
  {
    icon: Home,
    title: "Жилая недвижимость",
    description:
      "Квартиры, комнаты, дома, коттеджи, земельные участки, гаражи и машиноместа. Первичный и вторичный рынок.",
  },
  {
    icon: Landmark,
    title: "Коммерческая недвижимость",
    description:
      "Покупка и продажа коммерческих объектов, перевод помещений из жилого в нежилой фонд.",
  },
  {
    icon: FileText,
    title: "Юридическое сопровождение",
    description:
      "Подготовка документов, регистрация сделок, проверка юридической чистоты объекта.",
  },
  {
    icon: Building2,
    title: "Строительство и реконструкция",
    description:
      "Ввод в эксплуатацию, разрешения на строительство, консультации по перепланировке.",
  },
];

const advantages = [
  {
    icon: Shield,
    title: "Гарантия юридической чистоты",
    description:
      "Ни одной оспоренной сделки. Каждый объект проходит тщательную правовую проверку.",
  },
  {
    icon: CheckCircle2,
    title: "Застрахованные сделки",
    description:
      "Бесплатное страхование объекта при купле-продаже или сопровождении сделки через агентство.",
  },
  {
    icon: Star,
    title: "Цены от застройщика",
    description:
      "Прямые партнёрства с застройщиками — вы платите столько же, сколько в офисе продаж.",
  },
  {
    icon: Users,
    title: "Ипотечное партнёрство",
    description:
      "Помогаем оформить ипотеку через банки-партнёры на выгодных условиях.",
  },
];

const team = [
  {
    name: "Сергей Сусолкин",
    role: "Учредитель и директор",
    initials: "СС",
    image: "/team/sergey-susolkin.png",
  },
  {
    name: "Татьяна Федорович",
    role: "Лицензированный риелтор",
    initials: "ТФ",
    image: "/team/tatiana-fedorovich.jpg",
  },
  {
    name: "Павел Голубев",
    role: "Лицензированный риелтор",
    initials: "ПГ",
    image: "/team/pavel-golubev.jpg",
  },
  {
    name: "Наталья Пчельникова",
    role: "Лицензированный риелтор",
    initials: "НП",
    image: "/team/natalia-pchelnikova.jpg",
  },
  {
    name: "Владислав Гладченко",
    role: "Агент по операциям",
    initials: "ВГ",
    image: "/team/vladislav-gladchenko.jpg",
  },
  {
    name: "Денис Волков",
    role: "Агент по операциям",
    initials: "ДВ",
    image: "/team/denis-volkov.jpg",
  },
  {
    name: "Святослав Завгородний",
    role: "Агент по операциям",
    initials: "СЗ",
    image: "/team/sviatoslav-zavgorodny.jpg",
  },
  {
    name: "Арсений Чепик",
    role: "Специалист по клиентам",
    initials: "АЧ",
    image: "/team/arseny-chepik.jpg",
  },
  {
    name: "Анжелика Данько",
    role: "Специалист по клиентам",
    initials: "АД",
    image: "/team/angelika-danko.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/40 border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4">
                О компании
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                HAUS Real Estate
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Профессиональное агентство недвижимости в Республике Беларусь.
                Оказываем полный спектр услуг в сфере недвижимости — от подбора
                объекта до юридического сопровождения сделок любой сложности.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/catalog">Смотреть объекты</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="tel:+375296487551">Позвонить нам</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Наша миссия</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Мы убеждены, что каждая сделка с недвижимостью должна быть
                безопасной, прозрачной и выгодной для клиента. Наша цель — не
                просто помочь купить или продать объект, а обеспечить полную
                защиту ваших интересов на каждом этапе.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Работаем официально, заключаем договора, страхуем каждую сделку.
                За годы работы не было ни одного оспоренного или признанного
                недействительным договора.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "0", label: "Оспоренных сделок" },
                { value: "100%", label: "Официальные договора" },
                { value: "4+", label: "Лицензированных риелтора" },
                { value: "24/7", label: "Поддержка клиентов" },
              ].map((stat) => (
                <Card key={stat.label} className="text-center">
                  <CardContent className="pt-6 pb-6">
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="bg-muted/40 border-y">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Наши услуги</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Полный спектр услуг в сфере недвижимости — от жилых объектов до
                коммерческих сделок и юридического сопровождения.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Card key={service.title} className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Special offer */}
        <section className="container mx-auto px-4 py-16">
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="pt-8 pb-8 md:pt-12 md:pb-12 px-6 md:px-12">
              <div className="max-w-2xl">
                <Badge
                  variant="secondary"
                  className="mb-4 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
                >
                  Специальное предложение
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Полное сопровождение — полная защита!
                </h2>
                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                  При оформлении сделки купли-продажи или сопровождении сделки
                  через наше агентство — страхование объекта недвижимости в
                  подарок.
                </p>
                <Button variant="secondary" asChild>
                  <Link href="/catalog">Найти объект</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Advantages */}
        <section className="bg-muted/40 border-y">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Почему выбирают нас</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Мы работаем так, чтобы вы были спокойны за каждый этап сделки.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {advantages.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Наша команда</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Профессиональные лицензированные риелторы с опытом работы на рынке
              недвижимости Беларуси.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="overflow-hidden">
                <div className="relative w-full aspect-square bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/40">
                        {member.initials}
                      </span>
                    </div>
                  )}
                </div>
                <CardContent className="pt-4 pb-4 text-center">
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contacts */}
        <section className="bg-muted/40 border-t">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Свяжитесь с нами</h2>
              <p className="text-muted-foreground">
                Готовы ответить на любые вопросы и помочь с выбором объекта.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Card className="flex-1 max-w-xs mx-auto sm:mx-0">
                <CardContent className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Основной телефон
                    </p>
                    <a
                      href="tel:+375296487551"
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      +375 (29) 648-75-51
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1 max-w-xs mx-auto sm:mx-0">
                <CardContent className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                    <Send className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Telegram
                    </p>
                    <a
                      href="https://t.me/susolkin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      @susolkin
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1 max-w-xs mx-auto sm:mx-0">
                <CardContent className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Отдел кадров
                    </p>
                    <a
                      href="tel:+375447903518"
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      +375 (44) 790-35-18
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
