# TextViz 개발 로드맵 (Development Roadmap)

이 문서는 TextViz 프로젝트의 상세 개발 계획과 진행 상황을 추적하기 위한 Todo List를 담고 있습니다.

## 1. 프로젝트 초기화 및 환경 설정 (Initialization)
- [x] **[Init] Next.js 프로젝트 생성**
    - TypeScript, Tailwind CSS, App Router 사용.
- [x] **[Init] 프로젝트 폴더 구조 정리**
    - `components`, `lib`, `store`, `hooks` 등 디렉토리 체계화.
- [x] **[Deps] 필수 라이브러리 설치**
    - **UI/Styling:** `lucide-react`, `clsx`, `tailwind-merge`
    - **Editor & State:** `@monaco-editor/react`, `zustand`
    - **Rendering:** `react-markdown`, `katex`, `mermaid`, `remark-gfm`, `remark-math`, `rehype-katex`
    - **Utils:** `html-to-image`, `dnd-kit` (@core, @sortable, @utilities), `react-zoom-pan-pinch`, `react-hook-form`, `uuid`

## 2. 전역 설정 및 공통 컴포넌트 (Global & UI Components)
- [x] **[Global] Tailwind 설정 및 테마 정의**
    - 색상 팔레트, 폰트 설정, 다크 모드 `class` 전략 설정.
- [x] **[Global] Zustand Store 생성**
    - `useAppStore`: 전역 테마, 사이드바 상태 관리.
- [x] **[UI] 기본 레이아웃 컴포넌트**
    - `Header`, `LayoutWrapper` (Main Content 영역).
- [x] **[UI] 기본 UI 요소 (Atom)**
    - `Button`, `IconButton` (NavigationCard 등).
- [x] **[UI] Resizable Split Pane**
    - 마우스 드래그로 좌우 영역 크기를 조절하는 컨테이너.
- [x] **[UI] Monaco Editor Wrapper**
    - 로딩 상태 처리, 공통 옵션(미니맵, 라인 넘버 등)이 적용된 에디터 컴포넌트.

## 3. 홈 (Dashboard) 및 네비게이션
- [x] **[Home] 랜딩 페이지 Hero Section**
    - 서비스 소개 문구 및 CTA 버튼.
- [x] **[Home] 도구 진입 카드 (Navigation Cards)**
    - Markdown, LaTeX, Mermaid, JSON Builder로 이동하는 카드 UI.
- [ ] **[Home] 최근 작업 목록 (Recent Files)**
    - 로컬 스토리지에서 최근 수정된 문서를 불러와 목록 표시.

## 4. Markdown Editor (/markdown)
- [x] **[Markdown] 페이지 구조 및 라우팅**
- [x] **[Markdown] 렌더러 구현 (React-Markdown)**
    - GFM(Table, List), Syntax Highlighting 적용.
- [ ] **[Markdown] 툴바 UI 및 기능 연결**
    - 에디터 커서 위치에 볼드, 이탤릭 등 서식 삽입.
- [x] **[Markdown] 자동 저장 로직**
    - `useMarkdownStore`를 통해 입력 내용 디바운스(Debounce) 저장.

## 5. LaTeX Studio (/latex)
- [ ] **[LaTeX] 페이지 구조 및 라우팅**
- [ ] **[LaTeX] 렌더러 구현 (KaTeX)**
    - 에러 발생 시 원본 텍스트 표시 (Error Tolerance).
- [ ] **[LaTeX] Paper View 스타일링**
    - A4 비율 유지 및 실제 문서와 같은 그림자/여백 처리.
- [ ] **[LaTeX] 심볼 팔레트 (Symbol Palette)**
    - 자주 쓰는 수식 기호 모음집 UI 및 클릭 시 삽입 기능.
- [ ] **[LaTeX] 자동 저장 로직**

## 6. Mermaid Live (/mermaid)
- [ ] **[Mermaid] 페이지 구조 및 라우팅**
- [ ] **[Mermaid] 렌더러 구현**
    - `mermaid.render()` 비동기 처리 및 SVG 삽입.
- [ ] **[Mermaid] 줌/팬 (Zoom/Pan) 캔버스**
    - `react-zoom-pan-pinch`를 활용하여 큰 다이어그램 탐색 지원.
- [ ] **[Mermaid] 에러 핸들링**
    - 문법 오류 시 붉은색 에러 박스 표시.
- [ ] **[Mermaid] 템플릿 선택**
    - Flowchart, Sequence 등 기본 예제 코드 주입 기능.
- [ ] **[Mermaid] 자동 저장 로직**

## 7. JSON Prompt Builder (/json-builder)
- [ ] **[JSON] 페이지 구조 (3-Column Layout)**
- [ ] **[JSON] 데이터 구조 정의 (TypeScript Interface)**
    - `PromptBlock`, `PromptProject` 타입 정의.
- [ ] **[JSON] Builder Store (Zustand)**
    - 블록 목록, 캔버스 배치 상태 관리.
- [ ] **[JSON] 블록 라이브러리 (Left Panel)**
    - 저장된 블록 리스트 표시 및 드래그 시작(Draggable).
- [ ] **[JSON] 조립 캔버스 (Center Panel)**
    - 드롭 영역(Droppable) 및 블록 순서 변경(Sortable).
- [ ] **[JSON] 속성 편집기 (Right Panel)**
    - 선택된 블록의 세부 값 수정 폼.
- [ ] **[JSON] 실시간 JSON 변환 및 프리뷰**
    - 캔버스 상태를 조합하여 최종 JSON 문자열 생성.
- [ ] **[JSON] 블록 저장/로드 (Local Storage)**

## 8. 내보내기 및 마무리 (Export & Polish)
- [ ] **[Export] 이미지 다운로드**
    - `html-to-image`로 특정 DOM 요소 캡처 및 저장.
- [ ] **[Export] PDF 인쇄 스타일**
    - `@media print` CSS를 사용하여 불필요한 UI(헤더, 사이드바) 숨김.
- [ ] **[Settings] 설정 페이지**
    - 데이터 초기화 버튼, 테마 강제 설정 등.
- [ ] **[Docs] 도움말 모달**
- [ ] **[Final] 빌드 및 테스트**
    - 최종 프로덕션 빌드 확인 및 버그 수정.