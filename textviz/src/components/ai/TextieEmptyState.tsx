import { Sparkles } from "lucide-react";
import type { DocumentType } from "@/store/useDocumentStore";

type TextieEmptyStateProps = {
  readonly onQuickAction: (prompt: string, type: DocumentType) => void;
};

export function TextieEmptyState({ onQuickAction }: TextieEmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-neutral-500">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-200/50 dark:bg-neutral-800 dark:ring-neutral-700/50">
        <Sparkles className="h-8 w-8 text-amber-400" />
      </div>
      <div className="max-w-xs space-y-1">
        <p className="font-medium text-neutral-900 dark:text-white">무엇을 도와드릴까요?</p>
        <p className="text-sm">문서 요약, 다이어그램 생성, 수식 변환 등 {"\n"}필요한 작업을 말씀해주세요.</p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={() => onQuickAction("이 문서 시놉시스 써줘", "markdown")}
          className="rounded-lg border bg-white px-3 py-2 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        >
          글쓰기/요약
        </button>
        <button
          onClick={() => onQuickAction("다이어그램 그려줘", "mermaid")}
          className="rounded-lg border bg-white px-3 py-2 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        >
          다이어그램
        </button>
      </div>
    </div>
  );
}
