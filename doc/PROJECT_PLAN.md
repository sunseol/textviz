# 텍스트 렌더링 서비스 (가칭: TextViz) 기획서

## 1. 서비스 개요
**TextViz**는 다양한 텍스트 기반 포맷(Markdown, LaTeX, Mermaid)의 전문적인 저작 도구와 AI 생성 모델을 위한 **JSON 프롬프트 빌더**를 각각의 최적화된 환경으로 제공하는 웹 플랫폼입니다.

## 2. 목표 (Objective)
*   **전문성:** 각 포맷(언어)의 특성에 맞춘 전용 UI/UX 제공으로 작업 효율 극대화.
*   **관리 효율성:** 반복되는 AI 프롬프트를 블록(모듈) 단위로 저장하고 조합하여 재사용성 극대화.
*   **독립성:** 각 도구는 독립적인 페이지와 작업 환경을 가짐.

## 3. 핵심 기능 및 도구별 특징 (Tools)

### 3.1 Markdown Editor (`/markdown`)
*   **UI:** Classic Split View (좌측 에디터 - 우측 실시간 프리뷰).
*   **기능:** GFM 지원, 문서 구조(TOC) 네비게이션, 빠른 서식 툴바.
*   **용도:** 일반 문서, 기술 블로그, 메모 작성.

### 3.2 LaTeX Studio (`/latex`)
*   **UI:** Document Focused View (좌측 소스 코드 - 우측 A4/Letter 종이 형태의 미리보기).
*   **기능:** 수식 입력 도우미(심볼 팔레트), 참고문헌 관리, PDF 내보내기 최적화.
*   **용도:** 학술 논문, 수식이 포함된 보고서, 전문 조판 문서.

### 3.3 Mermaid Live (`/mermaid`)
*   **UI:** Diagram Canvas View (좌측 코드 - 우측 무한 캔버스).
*   **기능:** 다이어그램 줌/팬(Zoom/Pan), 다이어그램 종류별 템플릿, SVG/PNG 고해상도 저장.
*   **용도:** 시스템 설계도, 플로우차트, 시퀀스 다이어그램 작성.

### 3.4 JSON Prompt Builder (`/json-builder`)
*   **UI:** 3-Column Builder View (좌측 블록 라이브러리 - 중앙 조립 캔버스 - 우측 속성/JSON 뷰).
*   **기능:**
    *   **블록 시스템:** 프롬프트 조각(화풍, 카메라 등)을 블록화하여 저장/관리.
    *   **Drag & Drop:** 블록을 끌어다 놓아 프롬프트 구성.
    *   **Form Inputs:** 복잡한 JSON 구문을 직관적인 폼으로 입력.
*   **용도:** AI 이미지/영상 생성 프롬프트 설계 및 저장.

## 4. 기술 스택 (Tech Stack)
*   **Framework:** Next.js (React), TypeScript
*   **State Management:** Zustand (도구별 상태 및 전역 설정 관리)
*   **Styling:** Tailwind CSS
*   **Libraries:** `@monaco-editor/react`, `react-markdown`, `katex`, `mermaid`, `dnd-kit`(빌더용), `react-zoom-pan-pinch`(다이어그램용)

## 5. 사이트맵 (Sitemap)

*   **/** (Home / Dashboard)
    *   **Hero Section:** 서비스 소개 및 각 도구로의 빠른 진입 버튼.
    *   **Recent Works:** 최근 작업한 문서 목록 (Local Storage 기반).

*   **/markdown** (Markdown Editor)
    *   **Header:** [File], [Edit], [View]
    *   **Toolbar:** Bold, Italic, Link, Image 등 서식 도구.
    *   **Main:** Split View Editor.

*   **/latex** (LaTeX Studio)
    *   **Sidebar:** 수식 기호 팔레트, 파일 탐색기.
    *   **Main:** LaTeX Editor & PDF-like Preview.

*   **/mermaid** (Mermaid Live)
    *   **Header:** 다이어그램 타입 선택 (Flowchart, Sequence, Gantt...)
    *   **Main:** Code Editor & Interactive Canvas (Zoom/Pan).

*   **/json-builder** (Prompt Builder)
    *   **Left Panel:** **Block Library** (Saved Blocks, Presets).
    *   **Center Panel:** **Assembly Canvas** (블록 조립 영역).
    *   **Right Panel:** **Property & Output** (블록 속성 설정 및 최종 JSON 미리보기).

*   **/settings** (Global Settings)
    *   테마 설정, 데이터 초기화, 백업/복구.

## 6. 데이터 저장 정책
*   각 도구(`markdown`, `latex` 등)는 독립적인 Local Storage 키를 사용하여 데이터를 분리 저장합니다.
*   예: `textviz_markdown_draft`, `textviz_json_blocks` 등.