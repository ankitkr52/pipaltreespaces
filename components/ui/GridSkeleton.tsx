// Loading placeholder for the grid during a filter transition: a 16:9 shimmer
// plate plus two text bars per card, matching PropertyCard's footprint.

function Shimmer({ className }: { className: string }) {
  return <div className={"animate-pulse rounded-md bg-bg-sunken " + className} />;
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul
      aria-hidden
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }, (_, i) => (
        <li
          key={i}
          className="overflow-hidden rounded-card border border-border-subtle bg-bg-raised p-5 shadow-lift-inner"
        >
          <div className="-mx-5 -mt-5 mb-4" style={{ aspectRatio: "16 / 9" }}>
            <Shimmer className="h-full w-full rounded-none" />
          </div>
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="mt-3 h-4 w-1/2" />
        </li>
      ))}
    </ul>
  );
}
