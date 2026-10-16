export default function SuperAdminLoading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse h-24 bg-gray-200 rounded-lg" />
        ))}
      </div>
      <div className="animate-pulse h-64 bg-gray-200 rounded-lg" />
    </div>
  );
}
