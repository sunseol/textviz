export type Language = 'en' | 'ko';

export interface Translations {
  // Header
  header: {
    export: string;
  };

  // Navigation
  nav: {
    markdown: string;
    latex: string;
    mermaid: string;
    jsonBuilder: string;
  };

  // Document Sidebar
  sidebar: {
    documents: string;
    noDocuments: string;
    clickToCreate: string;
    words: string;
    draft: string;
    synced: string;
    document: string;
    documents_plural: string;
  };

  // Editor
  editor: {
    autoSaved: string;
    untitled: string;
  };

  // Confirm Dialog
  dialog: {
    createNewDocument: string;
    createNewDocumentMessage: string;
    createNew: string;
    cancel: string;
    confirm: string;
  };

  // Home Page
  home: {
    title: string;
    subtitle: string;
    getStarted: string;
    recentFiles: string;
    noRecentFiles: string;
    features: {
      markdown: {
        title: string;
        description: string;
      };
      latex: {
        title: string;
        description: string;
      };
      mermaid: {
        title: string;
        description: string;
      };
      jsonBuilder: {
        title: string;
        description: string;
      };
    };
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      export: 'Export',
    },
    nav: {
      markdown: 'Markdown',
      latex: 'LaTeX',
      mermaid: 'Mermaid',
      jsonBuilder: 'JSON Builder',
    },
    sidebar: {
      documents: 'Documents',
      noDocuments: 'No documents yet',
      clickToCreate: 'Click + to create one',
      words: 'words',
      draft: 'Draft',
      synced: 'Synced',
      document: 'document',
      documents_plural: 'documents',
    },
    editor: {
      autoSaved: 'Auto-saved',
      untitled: 'Untitled',
    },
    dialog: {
      createNewDocument: 'Create New Document?',
      createNewDocumentMessage: 'This will create a new document with the default template.',
      createNew: 'Create New',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
    home: {
      title: 'Welcome to TextViz',
      subtitle: 'A powerful visual editor suite for text-based formats',
      getStarted: 'Get Started',
      recentFiles: 'Recent Files',
      noRecentFiles: 'No recent files',
      features: {
        markdown: {
          title: 'Markdown Editor',
          description: 'Write and preview Markdown with live rendering',
        },
        latex: {
          title: 'LaTeX Editor',
          description: 'Create beautiful mathematical documents',
        },
        mermaid: {
          title: 'Mermaid Diagrams',
          description: 'Design flowcharts and diagrams visually',
        },
        jsonBuilder: {
          title: 'JSON Builder',
          description: 'Build JSON structures with drag and drop',
        },
      },
    },
  },
  ko: {
    header: {
      export: '내보내기',
    },
    nav: {
      markdown: '마크다운',
      latex: 'LaTeX',
      mermaid: '머메이드',
      jsonBuilder: 'JSON 빌더',
    },
    sidebar: {
      documents: '문서',
      noDocuments: '아직 문서가 없습니다',
      clickToCreate: '+ 를 눌러 생성하세요',
      words: '단어',
      draft: '초안',
      synced: '동기화됨',
      document: '개 문서',
      documents_plural: '개 문서',
    },
    editor: {
      autoSaved: '자동 저장됨',
      untitled: '제목 없음',
    },
    dialog: {
      createNewDocument: '새 문서를 만드시겠습니까?',
      createNewDocumentMessage: '기본 템플릿으로 새 문서가 생성됩니다.',
      createNew: '새로 만들기',
      cancel: '취소',
      confirm: '확인',
    },
    home: {
      title: 'TextViz에 오신 것을 환영합니다',
      subtitle: '텍스트 기반 형식을 위한 강력한 비주얼 에디터',
      getStarted: '시작하기',
      recentFiles: '최근 파일',
      noRecentFiles: '최근 파일 없음',
      features: {
        markdown: {
          title: '마크다운 편집기',
          description: '실시간 렌더링으로 마크다운 작성 및 미리보기',
        },
        latex: {
          title: 'LaTeX 편집기',
          description: '아름다운 수학 문서 작성',
        },
        mermaid: {
          title: '머메이드 다이어그램',
          description: '시각적으로 순서도와 다이어그램 디자인',
        },
        jsonBuilder: {
          title: 'JSON 빌더',
          description: '드래그 앤 드롭으로 JSON 구조 구축',
        },
      },
    },
  },
};
