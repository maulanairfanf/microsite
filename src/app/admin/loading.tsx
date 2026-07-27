export default function AdminLoading() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar skeleton */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 p-6 space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-96 bg-gray-200 rounded" />
        <div className="h-64 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
}
