
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class MathErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Only catch KaTeX errors or generic errors if desired
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            const isKatexError = this.state.error?.message?.includes('KaTeX');

            return (
                <div className="flex flex-col items-center justify-center p-8 text-center text-neutral-500 dark:text-neutral-400">
                    <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        {isKatexError ? 'Invalid Formula Detected' : 'Something went wrong'}
                    </h3>
                    <p className="max-w-md text-sm">
                        {isKatexError
                            ? 'A mathematical formula in this document has invalid syntax. Please verify your LaTeX code.'
                            : 'An unexpected error occurred in the editor.'}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="mt-6 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                        Try reloading editor
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
