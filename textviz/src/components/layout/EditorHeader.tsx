import React, { useState, useRef, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { cn } from '@/lib/utils';
import { Check, Pencil, Menu } from 'lucide-react';

interface EditorHeaderProps {
    title: string;
    typeLabel: string;
    onTitleChange: (newTitle: string) => void;
    onMobileMenuClick?: () => void;
}

export function EditorHeader({ title, typeLabel, onTitleChange, onMobileMenuClick }: EditorHeaderProps) {
    const { t } = useLanguageStore();
    const [isEditing, setIsEditing] = useState(false);

    // Parse title and extension
    // Matches everything until the last dot as the name, and the dot plus everything after as extension
    // If no dot, extension is empty string.
    const match = title.match(/^(.*)(\.[^.]+)$/);
    const name = match ? match[1] : title;
    const extension = match ? match[2] : "";

    const [editName, setEditName] = useState(name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setEditName(name);
    }, [name]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (editName.trim() && editName !== name) {
            onTitleChange(editName.trim() + extension);
        } else {
            setEditName(name); // Revert if unchanged
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setEditName(name);
            setIsEditing(false);
        }
    };

    return (
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-neutral-50/80 px-4 py-2.5 dark:border-neutral-800 dark:bg-neutral-900/80">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 ">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>

                {onMobileMenuClick && (
                    <button
                        onClick={onMobileMenuClick}
                        className="lg:hidden p-1 mr-1 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    >
                        <Menu className="h-4 w-4" />
                    </button>
                )}

                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <input
                            ref={inputRef}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            className="h-6 w-48 rounded-sm border border-neutral-200 bg-white px-2 text-sm font-medium focus:border-primary focus:outline-none dark:border-neutral-800 dark:bg-neutral-950"
                        />
                        {/* Optional: Show extension as non-editable text if desired, but user implementation requested "not needed", so hidden. */}
                    </div>
                ) : (
                    <div
                        onClick={() => setIsEditing(true)}
                        className="group flex items-center gap-2 cursor-pointer rounded hover:bg-neutral-200/50 px-2 py-0.5 -ml-2 transition-colors dark:hover:bg-neutral-800"
                        title="Click to rename"
                    >
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            {name}
                        </span>
                        <Pencil className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
                    {typeLabel}
                </span>
                <span>{t.editor.autoSaved}</span>
            </div>
        </div>
    );
}
