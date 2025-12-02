# TextViz 개발 로드맵 (Development Roadmap)

이 문서는 TextViz 프로젝트의 상세 개발 계획과 진행 상황을 추적하기 위한 Todo List를 담고 있습니다.

## 1. 프로젝트 초기화 및 환경 설정 (Initialization)
- [x] **[Init] Next.js 프로젝트 생성**
- [x] **[Init] 프로젝트 폴더 구조 정리**
- [x] **[Deps] 필수 라이브러리 설치**

## 2. 전역 설정 및 공통 컴포넌트 (Global & UI Components)
- [x] **[Global] Tailwind 설정 및 테마 정의**
- [x] **[Global] Zustand Store 생성**
- [x] **[UI] 기본 레이아웃 컴포넌트 (Header, LayoutWrapper)**
- [x] **[UI] 기본 UI 요소 (Button, NavigationCard)**
- [x] **[UI] Resizable Split Pane** (이슈 해결됨: h-full/flex-col 적용)
- [x] **[UI] Monaco Editor Wrapper**

## 3. 홈 (Dashboard) 및 네비게이션
- [x] **[Home] 랜딩 페이지 Hero Section**
- [x] **[Home] 도구 진입 카드 (Navigation Cards)**
- [x] **[Home] 최근 작업 목록 (Recent Files)**

## 4. Markdown Editor (/markdown)
- [x] **[Markdown] 페이지 구조 및 라우팅**
- [x] **[Markdown] 렌더러 구현 (React-Markdown)**
- [x] **[Markdown] 툴바 UI 및 기능 연결**
- [x] **[Markdown] 자동 저장 로직**

## 5. LaTeX Studio (/latex)
- [x] **[LaTeX] 페이지 구조 및 라우팅**
- [x] **[LaTeX] 렌더러 구현 (KaTeX, A4 View)**
- [x] **[LaTeX] 심볼 팔레트 (Symbol Palette)**
- [x] **[LaTeX] 자동 저장 로직**

## 6. Mermaid Live (/mermaid)
- [x] **[Mermaid] 페이지 구조 및 라우팅**
- [x] **[Mermaid] 렌더러 구현 (mermaid.js, Zoom/Pan)**
- [x] **[Mermaid] 에러 핸들링**
- [x] **[Mermaid] 자동 저장 로직**

## 7. JSON Prompt Builder (/json-builder)
- [x] **[JSON] 페이지 구조 (3-Column Layout)**
- [x] **[JSON] 데이터 구조 정의**
- [x] **[JSON] Builder Store (Zustand)**
- [x] **[JSON] 블록 라이브러리 (Left Panel)**
- [x] **[JSON] 조립 캔버스 (Center Panel)**
- [x] **[JSON] 속성 편집기 (Right Panel)**
- [x] **[JSON] 실시간 JSON 변환 및 내보내기**

## 8. 내보내기 및 마무리 (Export & Polish)
- [x] **[Export] 이미지 다운로드 (PNG/SVG)**
- [x] **[Settings] 설정 페이지 (Data Reset)**
- [x] **[Polish] 404 페이지**
- [x] **[Final] 버그 수정 및 안정화**
    - Markdown/Mermaid 입력 불가 이슈 해결 (ResizableSplitPane 스타일 수정).
    - Hydration Mismatch 해결 (mounted check).
