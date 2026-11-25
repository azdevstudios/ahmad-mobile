"use client";

import { TriangleAlert } from "lucide-react";
import toast from "react-hot-toast";

export function confirmDeleteToast({ title, description, onConfirm, successMessage = "Item deleted." }) {
  return toast.custom(
    (item) => (
      <div
        role="alertdialog"
        aria-label={title}
        className="w-[min(92vw,420px)] rounded-xl border border-border bg-card p-4 text-foreground shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
            <TriangleAlert size={18} />
          </span>
          <div className="min-w-0 pt-0.5">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => toast.dismiss(item.id)}
            className="h-9 rounded-lg border border-border px-3 text-xs font-semibold hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={async () => {
              toast.dismiss(item.id);
              try {
                await onConfirm();
                toast.success(successMessage);
              } catch (error) {
                toast.error(error.message || "Could not delete this item.");
              }
            }}
            className="h-9 rounded-lg bg-red-600 px-3 text-xs font-semibold text-white hover:bg-red-700"
          >
            Delete phone
          </button>
        </div>
      </div>
    ),
    { duration: Infinity, position: "top-center" }
  );
}
