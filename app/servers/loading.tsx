export default function Loading() {
  return (
    <div className="container py-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-40 rounded-md border border-border/40 animate-pulse bg-black/20" />
        ))}
      </div>
    </div>
  )
}


