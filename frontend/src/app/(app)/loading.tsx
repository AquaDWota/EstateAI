export default function AppLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-52 animate-pulse rounded bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded bg-muted" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded bg-muted" />
    </div>
  );
}
