import { Bot } from "lucide-react";

type TextieLauncherProps = {
  readonly onOpen: () => void;
};

export function TextieLauncher({ onOpen }: TextieLauncherProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
      <button
        onClick={onOpen}
        className="group flex items-center gap-3 rounded-full bg-neutral-900 pr-6 pl-2 py-2 text-white shadow-2xl transition-all hover:-translate-y-1 hover:shadow-neutral-900/20 active:translate-y-0 dark:bg-white dark:text-neutral-900 dark:hover:shadow-white/10"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <span className="font-semibold">Textie에게 물어보세요</span>
        <div className="flex items-center gap-1 text-xs text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-neutral-500">
          <span className="bg-neutral-800 dark:bg-neutral-200 px-1.5 py-0.5 rounded">Ctrl + \</span>
        </div>
      </button>
    </div>
  );
}
