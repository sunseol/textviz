"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useDocumentStore } from '@/store/useDocumentStore';

export function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const { t } = useLanguageStore();
    const fetchDocuments = useDocumentStore((state) => state.fetchDocuments);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
            if (user) {
                fetchDocuments();
            }
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchDocuments();
            } else {
                useDocumentStore.setState({ documents: [], activeDocumentId: null });
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchDocuments]);

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
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
