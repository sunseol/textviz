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
    repository: string;
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
    empty: string;
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

  // JSON Builder
  jsonBuilder: {
    library: string;
    dragOrClick: string;
    properties: string;
    noParameters: string;
    selectBlock: string;
    jsonOutput: string;
    blocks: string;
  };

  // LaTeX
  latex: {
    categories: {
      templates: string;
      greek: string;
      operators: string;
      relations: string;
      arrows: string;
      sets: string;
      matrices: string;
      accents: string;
    };
    tip: string;
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
      repository: 'Repository',
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
      empty: 'Empty',
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
    jsonBuilder: {
      library: 'Library',
      dragOrClick: 'Drag or click to add',
      properties: 'Properties',
      noParameters: 'No parameters to configure.',
      selectBlock: 'Select a block to edit properties',
      jsonOutput: 'JSON Output',
      blocks: 'blocks',
    },
    latex: {
      categories: {
        templates: 'Templates',
        greek: 'Greek',
        operators: 'Operators',
        relations: 'Relations',
        arrows: 'Arrows',
        sets: 'Sets',
        matrices: 'Matrices',
        accents: 'Accents',
      },
      tip: 'Tip: Use $$...$$ for display math, $...$ for inline',
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
      repository: '저장소',
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
      empty: '비어있음',
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
    jsonBuilder: {
      library: '라이브러리',
      dragOrClick: '드래그하거나 클릭하여 추가',
      properties: '속성',
      noParameters: '설정할 매개변수가 없습니다.',
      selectBlock: '속성을 편집하려면 블록을 선택하세요',
      jsonOutput: 'JSON 출력',
      blocks: '블록',
    },
    latex: {
      categories: {
        templates: '템플릿',
        greek: '그리스 문자',
        operators: '연산자',
        relations: '관계',
        arrows: '화살표',
        sets: '집합',
        matrices: '행렬',
        accents: '강세',
      },
      tip: '팁: 수식 블록은 $$...$$, 인라인 수식은 $...$ 를 사용하세요',
    },
  },
};
