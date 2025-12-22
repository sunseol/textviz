'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function ThemeProvider() {
    const { isDarkMode } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Effect to apply theme based on store state
    useEffect(() => {
        if (!mounted) return;

        const root = window.document.documentElement;

        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode, mounted]);

    // Effect to Enforce theme state (Protection against F12/DevTools tampering)
    useEffect(() => {
        if (!mounted) return;

        const root = window.document.documentElement;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === 'attributes' &&
                    mutation.attributeName === 'class'
                ) {
                    const hasDarkClass = root.classList.contains('dark');

                    // If DOM indicates dark but Store says light -> Force Remove
                    if (hasDarkClass && !isDarkMode) {
                        console.warn('[ThemeProvider] Detected external theme change (Dark added). Reverting to Light.');
                        root.classList.remove('dark');
                    }
                    // If DOM indicates light but Store says dark -> Force Add
                    else if (!hasDarkClass && isDarkMode) {
                        console.warn('[ThemeProvider] Detected external theme change (Dark removed). Reverting to Dark.');
                        root.classList.add('dark');
                    }
                }
            });
        });

        observer.observe(root, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, [isDarkMode, mounted]);

    return null;
}
