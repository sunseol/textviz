"use client";

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, AlertCircle, Loader2, User as UserIcon, Languages, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useAppStore } from '@/store/useAppStore';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const supabase = createClient();
    const router = useRouter();
    const { t, language, setLanguage } = useLanguageStore();
    const { isDarkMode, toggleDarkMode } = useAppStore();

    const [name, setName] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ko' : 'en');
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/');
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                        },
                    },
                });
                if (error) throw error;
                setIsEmailSent(true);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isEmailSent) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-950">
                <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
                    <div className="overflow-hidden rounded-xl border border-neutral-200/60 bg-white shadow-2xl dark:border-neutral-700/60 dark:bg-neutral-800 p-8 text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-white">
                            {t.auth.checkInbox}
                        </h2>
                        <p className="mb-8 text-sm text-neutral-500 dark:text-neutral-400">
                            {t.auth.sentConfirmationTo}<br />
                            <span className="font-medium text-neutral-900 dark:text-white">{email}</span>
                        </p>
                        <Button
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => {
                                setIsEmailSent(false);
                                setMode('login');
                            }}
                        >
                            {t.auth.backToLogin}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-950 relative">
            <div className="absolute top-4 left-4">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold text-2xl tracking-wide text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-bona-nova-sc)' }}>
                        TextViz
                    </span>
                </Link>
            </div>

            <div className="absolute top-4 right-4 flex items-center space-x-2">
                <button
                    onClick={toggleLanguage}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0"
                    title={language === 'en' ? '한국어' : 'English'}
                >
                    <Languages className="h-5 w-5" />
                    <span className="sr-only">Toggle language</span>
                </button>
                <button
                    onClick={toggleDarkMode}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0"
                >
                    {isDarkMode ? (
                        <Moon className="h-5 w-5" />
                    ) : (
                        <Sun className="h-5 w-5" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                </button>
            </div>

            <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
                <div className="overflow-hidden rounded-xl border border-neutral-200/60 bg-white shadow-2xl dark:border-neutral-700/60 dark:bg-neutral-800">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-neutral-200/60 bg-neutral-50/80 px-4 py-3 dark:border-neutral-700/60 dark:bg-neutral-900/80">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-400" />
                            <div className="h-3 w-3 rounded-full bg-yellow-400" />
                            <div className="h-3 w-3 rounded-full bg-green-400" />
                        </div>
                        <span className="text-xs font-medium text-neutral-500">
                            {mode === 'login' ? t.auth.signIn : t.auth.signUp}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {mode === 'login' ? t.auth.loginTitle : t.auth.signupTitle}
                            </h1>
                            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                                {mode === 'login'
                                    ? t.auth.loginSubtitle
                                    : t.auth.signupSubtitle}
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-200 dark:bg-neutral-900 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-800"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            {t.auth.continueWithGoogle}
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-neutral-200 dark:border-neutral-700" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-neutral-500 dark:bg-neutral-800">
                                    {t.auth.orContinueWith}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {mode === 'signup' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-neutral-500">{t.auth.fullName}</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-500">{t.auth.email}</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-500">{t.auth.password}</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            {mode === 'login' && (
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-500 dark:text-neutral-400"
                                    >
                                        {t.auth.rememberMe}
                                    </label>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    mode === 'login' ? t.auth.signIn : t.auth.createAccount
                                )}
                            </Button>
                        </form>

                        <div className="mt-4 text-center text-xs text-neutral-500">
                            {mode === 'login' ? (
                                <>
                                    {t.auth.dontHaveAccount}{' '}
                                    <button
                                        onClick={() => setMode('signup')}
                                        className="font-medium text-blue-500 hover:underline"
                                    >
                                        {t.auth.signUpLink}
                                    </button>
                                </>
                            ) : (
                                <>
                                    {t.auth.alreadyHaveAccount}{' '}
                                    <button
                                        onClick={() => setMode('login')}
                                        className="font-medium text-blue-500 hover:underline"
                                    >
                                        {t.auth.signInLink}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
