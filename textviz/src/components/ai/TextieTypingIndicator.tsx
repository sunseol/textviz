import { Bot } from "lucide-react";

export function TextieTypingIndicator() {
  return (
    <div className="flex gap-3 p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
        <Bot className="h-4 w-4 text-blue-600" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-neutral-900">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 delay-0" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 delay-150" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 delay-300" />
      </div>
    </div>
  );
}
