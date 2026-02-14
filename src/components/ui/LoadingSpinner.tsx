export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-brand-700 border-t-brand-300 rounded-full animate-spin" />
    </div>
  );
}
