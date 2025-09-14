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
    <Card className="h-full border-border/40 overflow-hidden">
      <CardContent className="p-6 space-y-3">
        <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2">
          <h3 className="font-medium text-lg text-left break-words line-clamp-1 min-w-0">{item.name}</h3>
          <div className="flex items-start justify-end gap-2">
            <Badge variant="secondary" className="text-xs whitespace-nowrap">
              {item.category === "official_integrations" ? "Official" : "Community"}
            </Badge>
            {item.icons?.[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.icons[0]} alt="logo" className="h-10 w-10 rounded-sm border border-border/40 bg-background" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3 break-words text-left col-span-2">{item.description}</p>
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


