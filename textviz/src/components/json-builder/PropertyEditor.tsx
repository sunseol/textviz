"use client";

import React from 'react';
import { useJsonBuilderStore } from '@/store/useJsonBuilderStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { MonacoEditorWrapper } from '@/components/ui/MonacoEditorWrapper';
import { Button } from '@/components/ui/button';
import { Copy, Download, Check } from 'lucide-react';

export function PropertyEditor() {
  const { canvasBlocks, selectedBlockId, updateBlockParameter } = useJsonBuilderStore();
  const { t } = useLanguageStore();
  const [copied, setCopied] = React.useState(false);

  const selectedBlock = canvasBlocks.find(b => b.id === selectedBlockId);

  // Generate final JSON prompt
  const promptObject = {
    prompt: canvasBlocks.map(b => {
      let text = b.template;
      // Replace placeholders with parameters
      Object.entries(b.parameters).forEach(([key, value]) => {
        text = text.replace(`{{${key}}}`, String(value));
      });
      return text;
    }).join(', '),
    blocks: canvasBlocks
  };

  const jsonString = JSON.stringify(promptObject, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full border-l bg-white dark:bg-neutral-900">
      <div className="flex-1 p-4 border-b overflow-y-auto h-1/2">
        <h2 className="text-lg font-semibold mb-4">{t.jsonBuilder.properties}</h2>
        {selectedBlock ? (
          <div className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <h3 className="font-medium">{selectedBlock.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedBlock.description}</p>
            </div>

            <div className="space-y-3">
              {Object.keys(selectedBlock.parameters).length === 0 ? (
                <p className="text-sm text-muted-foreground italic">{t.jsonBuilder.noParameters}</p>
              ) : (
                Object.entries(selectedBlock.parameters).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium capitalize">{key}</label>
                    <input
                      type="text"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={value}
                      onChange={(e) => updateBlockParameter(selectedBlock.id, key, e.target.value)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            {t.jsonBuilder.selectBlock}
          </div>
        )}
      </div>

      <div className="h-1/2 flex flex-col border-t">
        <div className="p-2 border-b bg-muted/20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-muted-foreground">{t.jsonBuilder.jsonOutput}</span>
            <span className="text-xs text-muted-foreground">({canvasBlocks.length} {t.jsonBuilder.blocks})</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy} title="Copy JSON">
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDownload} title="Download JSON">
              <Download className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="flex-1 relative">
          <MonacoEditorWrapper
            language="json"
            value={jsonString}
            options={{
              minimap: { enabled: false },
              readOnly: true,
              lineNumbers: 'off',
              fontSize: 12
            }}
          />
        </div>
      </div>
    </div>
  );
}
