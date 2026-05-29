export default function RootLoading() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-5xl flex-col gap-4 px-4 py-10">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-36 animate-pulse rounded bg-muted" />
        <div className="h-36 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-52 animate-pulse rounded bg-muted" />
    </div>
  );
}
