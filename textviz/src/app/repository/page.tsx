"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDocumentStore, Document } from '@/store/useDocumentStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Header } from '@/components/layout/Header';
import {
    FileText,
    Sigma,
    GitGraph,
    Braces,
    Search,
    Trash2,
    Clock,
    File,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function RepositoryPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<'all' | 'markdown' | 'latex' | 'mermaid' | 'json-builder'>('all');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { documents, fetchDocuments, deleteDocument, setActiveDocument } = useDocumentStore();
    const { t } = useLanguageStore();

    useEffect(() => {
        setMounted(true);
        fetchDocuments();
    }, [fetchDocuments]);

    // Document Type Configuration
    const docConfig = {
        markdown: { icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", label: t.nav.markdown },
        latex: { icon: Sigma, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20", label: t.nav.latex },
        mermaid: { icon: GitGraph, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20", label: t.nav.mermaid },
        'json-builder': { icon: Braces, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20", label: t.nav.jsonBuilder },
    };

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || doc.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleCardClick = (doc: Document) => {
        setActiveDocument(doc.id);
        router.push(`/${doc.type}`);
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await deleteDocument(deleteId);
            setDeleteId(null);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background font-sans">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">{t.nav.repository}</h1>
                        <p className="text-muted-foreground">
                            {documents.length} {t.sidebar.documents_plural}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 h-10 w-full sm:w-64 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex items-center gap-2 bg-muted p-1 rounded-md h-10 self-start">
                            <button
                                onClick={() => setTypeFilter('all')}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-sm transition-all",
                                    typeFilter === 'all' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                All
                            </button>
                            {(Object.keys(docConfig) as Array<keyof typeof docConfig>).map(type => {
                                const ConfigIcon = docConfig[type].icon;
                                return (
                                    <button
                                        key={type}
                                        onClick={() => setTypeFilter(type)}
                                        className={cn(
                                            "p-1.5 rounded-sm transition-all",
                                            typeFilter === type ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                        )}
                                        title={docConfig[type].label}
                                    >
                                        <ConfigIcon className="h-4 w-4" />
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {filteredDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDocuments.map((doc) => {
                            const config = docConfig[doc.type] || { icon: File, color: "text-gray-500", bg: "bg-gray-100", label: "Unknown" };
                            const Icon = config.icon;

                            return (
                                <div
                                    key={doc.id}
                                    onClick={() => handleCardClick(doc)}
                                    className="group relative flex flex-col justify-between rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md cursor-pointer overflow-hidden h-64 border-neutral-200 dark:border-neutral-800"
                                >
                                    <div className="p-5 flex flex-col h-full">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={cn("p-2.5 rounded-lg", config.bg)}>
                                                <Icon className={cn("h-5 w-5", config.color)} />
                                            </div>
                                            <button
                                                onClick={(e) => handleDeleteClick(e, doc.id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-destructive/10 hover:text-destructive rounded-md text-muted-foreground"
                                                title={t.dialog.confirm} // Using confirm text as "Delete" isn't strictly in i18n yet for tooltip
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                                                {doc.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-3 font-mono bg-muted/50 p-2 rounded-md h-[4.5rem]">
                                                {doc.content}
                                            </p>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                                            <Clock className="h-3 w-3" />
                                            <span>
                                                {new Date(doc.updatedAt).toLocaleDateString()} {new Date(doc.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-muted/30 p-6 rounded-full mb-4">
                            <Search className="h-10 w-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{t.sidebar.noDocuments}</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto">
                            Try adjusting your search or filters, or create a new document from the menu.
                        </p>
                    </div>
                )}
            </main>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title={t.dialog.confirm}
                message="Are you sure you want to delete this document? This action cannot be undone."
                confirmText="Delete"
                cancelText={t.dialog.cancel}
            />
        </div>
    );
}
