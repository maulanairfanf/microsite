export default function TenantPageLoading() {
  return (
    <main className="min-h-screen flex items-start justify-center py-0 md:pt-8 bg-page">
      <div className="w-full max-w-lg overflow-hidden container-bg container-border container-shadow header-font">
        <div className="animate-pulse space-y-4 p-6">
          <div className="h-48 bg-gray-200 rounded-lg" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
