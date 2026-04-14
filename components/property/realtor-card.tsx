import { Phone, Mail } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RealtorCardProps {
  owner: {
    id: string
    name: string
    email: string
    phone: string | null
    avatarUrl: string | null
  }
}

export function RealtorCard({ owner }: RealtorCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Размещено</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            {owner.avatarUrl && <AvatarImage src={owner.avatarUrl} alt={owner.name} />}
            <AvatarFallback>{owner.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{owner.name}</p>
            <p className="text-xs text-muted-foreground">Агент</p>
          </div>
        </div>
        <div className="space-y-2">
          {owner.phone && (
            <a
              href={`tel:${owner.phone}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="h-4 w-4" />
              {owner.phone}
            </a>
          )}
          <a
            href={`mailto:${owner.email}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4" />
            {owner.email}
          </a>
        </div>
        {owner.phone && (
          <Button className="w-full" asChild>
            <a href={`tel:${owner.phone}`}>Позвонить агенту</a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
