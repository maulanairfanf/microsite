export function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-2.5 space-y-1.5">
        <div className="h-3 bg-gray-100 rounded" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-1" />
      </div>
    </div>
  );
}
