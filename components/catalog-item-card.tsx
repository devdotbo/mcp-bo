import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
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
    <Card className="h-full border-border/40">
      <CardContent className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-lg">{item.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {item.category === "official_integrations" ? "Official" : "Community"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
          </div>
          {item.icons?.[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.icons[0]} alt="logo" className="h-10 w-10 rounded-sm border border-border/40 bg-background" />
          )}
        </div>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0">
        <Link
          href={item.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          Visit homepage
        </Link>
      </CardFooter>
    </Card>
  )
}


