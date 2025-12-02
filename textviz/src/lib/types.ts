export interface PromptBlock {
  id: string;
  name: string;
  description: string;
  category: 'style' | 'camera' | 'lighting' | 'subject' | 'extra';
  parameters: Record<string, any>; // e.g., { strength: 0.5, color: 'red' }
  template: string; // e.g., "A {{style}} painting of {{subject}}"
}

export interface PromptProject {
  id: string;
  name: string;
  blocks: PromptBlock[]; // Ordered list of blocks in the canvas
}
