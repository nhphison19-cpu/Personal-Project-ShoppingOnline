import { Loader2 } from "lucide-react";

export function LoadingSpinner({ msg = "Loading..." }: { msg?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-2">
      <Loader2 id="spinner-loader" className="w-8 h-8 text-indigo-600 animate-spin" />
      <p className="text-sm font-medium text-slate-500">{msg}</p>
    </div>
  );
}
export default LoadingSpinner;
