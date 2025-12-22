"use client";

import React from 'react';
import { Milkdown, MilkdownProvider, useEditor, useInstance } from '@milkdown/react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { nord } from '@milkdown/theme-nord';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { history } from '@milkdown/plugin-history';
import { clipboard } from '@milkdown/plugin-clipboard';
import { prism } from '@milkdown/plugin-prism';
import { math } from '@milkdown/plugin-math';
import * as MathPlugin from '@milkdown/plugin-math';

console.log('[DEBUG-MATH] exports:', MathPlugin);
console.log('[DEBUG-MATH] keys:', Object.keys(MathPlugin));
import { diagram } from '@milkdown/plugin-diagram';
import { slashFactory } from '@milkdown/plugin-slash';
import { Ctx } from '@milkdown/ctx';
import { useAppStore } from '@/store/useAppStore';
import {
    toggleStrongCommand,
    toggleEmphasisCommand,
    toggleInlineCodeCommand,
    toggleLinkCommand,
    wrapInHeadingCommand,
    wrapInBlockquoteCommand,
    wrapInBulletListCommand,
    wrapInOrderedListCommand,
    createCodeBlockCommand,
} from '@milkdown/preset-commonmark';
import { toggleStrikethroughCommand } from '@milkdown/preset-gfm';
import { callCommand } from '@milkdown/utils';
import '@milkdown/theme-nord/style.css';

interface MilkdownEditorProps {
    content: string;
    onChange: (markdown: string) => void;
}

const ToolbarButton: React.FC<{
    label: string;
    onClick: () => void;
}> = ({ label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="rounded-md border border-neutral-200/80 bg-white px-3 py-1 text-sm font-medium text-neutral-700 shadow-sm transition hover:-translate-y-[1px] hover:border-neutral-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-neutral-300 active:translate-y-0 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-700"
    >
        {label}
    </button>
);

const MilkdownToolbar: React.FC = () => {
    const [loading, getEditor] = useInstance();

    const runCommand = React.useCallback(
        (command: { key: any }, payload?: any) => {
            const editor = getEditor();
            if (!editor || !command?.key) return;
            editor.action(callCommand(command.key, payload));
        },
        [getEditor],
    );

    const promptLink = () => {
        const href = window.prompt('링크 URL을 입력하세요');
        if (!href) return;
        runCommand(toggleLinkCommand, { href });
    };

    return (
        <div className="flex flex-wrap gap-2 border-b border-neutral-200/80 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/60">
            <ToolbarButton label="B" onClick={() => runCommand(toggleStrongCommand)} />
            <ToolbarButton label="I" onClick={() => runCommand(toggleEmphasisCommand)} />
            <ToolbarButton label="Code" onClick={() => runCommand(toggleInlineCodeCommand)} />
            <ToolbarButton label="Strike" onClick={() => runCommand(toggleStrikethroughCommand)} />
            <ToolbarButton label="H1" onClick={() => runCommand(wrapInHeadingCommand, 1)} />
            <ToolbarButton label="H2" onClick={() => runCommand(wrapInHeadingCommand, 2)} />
            <ToolbarButton label="Quote" onClick={() => runCommand(wrapInBlockquoteCommand)} />
            <ToolbarButton label="• List" onClick={() => runCommand(wrapInBulletListCommand)} />
            <ToolbarButton label="1. List" onClick={() => runCommand(wrapInOrderedListCommand)} />
            <ToolbarButton label="Code Block" onClick={() => runCommand(createCodeBlockCommand)} />
            <ToolbarButton label="Link" onClick={promptLink} />
        </div>
    );
};

const MilkdownEditorContent: React.FC<MilkdownEditorProps> = ({ content, onChange }) => {
    const { isDarkMode } = useAppStore();
    const slash = React.useMemo(() => slashFactory('slash'), []);
    const [loading, getEditor] = useInstance();

    const lastEmittedContent = React.useRef(content);

    const editor = useEditor((root) => {
        return Editor.make()
            .config((ctx: Ctx) => {
                ctx.set(rootCtx, root);
                ctx.set(defaultValueCtx, content);

                // Configure KaTeX to not throw on error (Removed for test)
                // try { ctx.inject(...) } catch { ctx.set(...) }

                ctx.get(listenerCtx).markdownUpdated((ctx: Ctx, markdown: string, prevMarkdown: string) => {
                    if (markdown !== prevMarkdown) {
                        lastEmittedContent.current = markdown;
                        onChange(markdown);
                    }
                });
            })
            .config(nord)
            .use(commonmark)
            .use(gfm)
            .use(listener)
            .use(history)
            .use(clipboard)
            .use(prism)
            .use(math)
            .use(diagram)
            .use(slash);
    }, []);

    React.useEffect(() => {
        if (loading || !content) return;

        if (content !== lastEmittedContent.current) {
            const instance = getEditor();
            if (instance) {
                import('@milkdown/utils').then(({ replaceAll }) => {
                    instance.action(replaceAll(content));
                    lastEmittedContent.current = content;
                });
            }
        }
    }, [content, loading, getEditor]);

    return (
        <div className="milkdown-editor-wrapper flex h-full w-full flex-col overflow-hidden rounded-xl bg-white dark:bg-neutral-900">
            <MilkdownToolbar />
            <div
                className="prose h-full max-w-none overflow-auto p-8 dark:prose-invert focus:outline-none"
            >
                <Milkdown />
            </div>
        </div>
    );
};

export const MilkdownEditor: React.FC<MilkdownEditorProps> = (props) => {
    return (
        <MilkdownProvider>
            <MilkdownEditorContent {...props} />
        </MilkdownProvider>
    );
};
