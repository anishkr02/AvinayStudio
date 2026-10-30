import { Loader2 } from 'lucide-react';

export function AdminLoading() {
  return (
    <div className="flex min-h-[240px] items-center justify-center gap-3 text-sm text-[#B8B3AB]">
      <Loader2 className="h-5 w-5 animate-spin text-[#DFC08F]" />
      <span>Loading...</span>
    </div>
  );
}

export function AdminError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-[#552222] bg-[#221212] p-5 text-sm text-[#E8DFD8]"
    >
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg bg-[#DFC08F] px-4 py-2 text-xs font-bold text-[#050505] hover:bg-[#E8DFD8]"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function getAdminErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}
