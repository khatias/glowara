import { CheckCircle2, AlertCircle } from "lucide-react";
import clsx from "clsx";

export function FormMessage({
  success,
  message,
}: {
  success: boolean;
  message?: string;
}) {
  if (!message) return null;

  return (
    <div
      className={clsx(
        "flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm",
        success
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      )}
    >
      {success ? (
        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}