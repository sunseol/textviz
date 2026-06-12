import { Bot, Clock, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Document } from "@/store/useDocumentStore";

type TextiePanelHeaderProps = {
  readonly activeDoc: Document | null;
  readonly historyOpen: boolean;
  readonly onToggleHistory: () => void;
  readonly onNewChat: () => void;
  readonly onClose: () => void;
};

export function TextiePanelHeader({
  activeDoc,
  historyOpen,
  onToggleHistory,
  onNewChat,
  onClose,
}: TextiePanelHeaderProps) {
  return (
    <div className="relative flex items-center justify-between border-b border-neutral-100 bg-white/50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 shadow-sm">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">Textie</h3>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Online · {activeDoc ? `Observing ${activeDoc.title}` : "Idle (Landing)"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          onClick={onToggleHistory}
          title={historyOpen ? "Close History" : "History"}
        >
          <Clock className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          onClick={onNewChat}
          title="New Chat"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
