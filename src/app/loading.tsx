export default function Loading() {
  return (
    <div className="min-h-dvh gwen-noise flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-r-transparent" />
        <p className="text-sm text-muted">Um momento…</p>
      </div>
    </div>
  );
}
