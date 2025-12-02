"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCcw } from 'lucide-react';

export default function SettingsPage() {
  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all local data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="container mx-auto px-4 md:px-8 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="space-y-8">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Data Management
            </h2>
            <p className="text-muted-foreground mb-6">
              All your work is stored locally in your browser. Clearing data will remove all your drafts and settings.
            </p>
            <Button variant="destructive" onClick={handleResetData}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Reset All Data
            </Button>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">About TextViz</h2>
            <p className="text-muted-foreground text-sm">
              TextViz is a local-first text visualization tool built with Next.js, TypeScript, and Tailwind CSS.
              <br />
              Version: 1.0.0
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
