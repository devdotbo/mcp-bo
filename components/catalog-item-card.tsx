import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export type CatalogItem = {
  _id: string
  _creationTime: number
  name: string
  category: "official_integrations" | "community_servers"
  orderInSection: number
  description: string
  homepage: string
  icons?: Array<string>
}

export function CatalogItemCard({ item }: { item: CatalogItem }) {
  return (
    <Link
      href={item.homepage}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full group"
    >
      <Card className="h-full border-border/40 overflow-hidden">
        <CardContent className="p-6 space-y-3">
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_auto] items-start gap-3">
              <h3 className="font-medium text-lg text-left break-words line-clamp-1 min-w-0 group-hover:text-primary underline underline-offset-4 decoration-muted-foreground/40 group-hover:decoration-primary">
                {item.name}
              </h3>
              <div className="flex items-start justify-end gap-2">
                <Badge
                  variant={item.category === "official_integrations" ? "official" : "community"}
                  className="text-xs whitespace-nowrap"
                >
                  {item.category === "official_integrations" ? "Official" : "Community"}
                </Badge>
                {item.icons?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.icons[0]}
                    alt="logo"
                    className="h-10 w-10 rounded-sm border border-border/40 bg-background"
                  />
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3 break-words text-left">{item.description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}


