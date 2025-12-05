"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { LogOut, User as UserIcon, RefreshCw } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useRouter } from 'next/navigation';

export function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const supabase = createClient();
    const { t } = useLanguageStore();
    const { fetchDocuments, syncLocalDocuments } = useDocumentStore();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
            if (user) {
                // Check if we need to sync
                handleSync();
                fetchDocuments();
            } else {
                useDocumentStore.setState({ isInitialized: true });
            }
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                await handleSync();
                fetchDocuments();
            } else {
                // Clear documents on logout to avoid showing stale data, then fetch local if any (though local mode handles this)
                useDocumentStore.setState({ documents: [], activeDocumentId: null, isInitialized: true });
                fetchDocuments(); // Will fetch local docs
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchDocuments]);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const count = await syncLocalDocuments();
            if (count > 0) {
                // Use a more subtle notification in production, but alert is what was requested/easiest for now.
                // Ideally, replace this with a nice toast.
                alert(`Successfully synced ${count} local documents to your account.`);
            }
        } catch (error) {
            console.error("Sync failed", error);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleLogin = () => {
        router.push('/login');
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (loading) {
        return <Button variant="ghost" disabled size="sm" className="w-9 h-9 p-0"><span className="sr-only">Loading...</span></Button>;
    }

    if (user) {
        return (
            <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col items-end text-xs mr-1">
                    <span className="font-medium">{user.user_metadata.full_name || user.email}</span>
                </div>
                {isSyncing && (
                    <div className="flex items-center text-xs text-muted-foreground animate-pulse mr-2">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Syncing...
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="h-9 w-9 p-0"
                    title="Sign out"
                >
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <Button
            variant="default"
            size="sm"
            onClick={handleLogin}
            className="h-9 px-4"
        >
            <UserIcon className="h-4 w-4 mr-2" />
            Login
        </Button>
    );
}
