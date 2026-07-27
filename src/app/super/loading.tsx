export default function SuperLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="h-4 w-96 bg-gray-200 rounded" />
      <div className="h-64 bg-white rounded-lg border border-gray-200" />
    </div>
  );
}
