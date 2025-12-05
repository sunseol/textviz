"use client";

import React, { useEffect } from 'react';
import { DocumentSidebar } from '@/components/layout/DocumentSidebar';
import { X } from 'lucide-react';

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    active: "markdown" | "latex" | "mermaid"; // Reusing types from sidebar would be better but simple string is easier for now
}

export function MobileSidebar({ isOpen, onClose, active }: MobileSidebarProps) {
    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] transform bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
                {/* Close Button Header (Optional, sidebar has its own header but maybe duplicate?) */}
                <div className="flex justify-end p-2 absolute top-2 right-2 z-10">
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="h-full pt-8">
                    <DocumentSidebar active={active} />
                </div>
            </div>
        </div>
    );
}
