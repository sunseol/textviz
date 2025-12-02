# Monaco Editor 높이 렌더링 문제 해결

## 문제 개요

- **날짜**: 2024-12-02
- **영향 범위**: Markdown 편집기, LaTeX 편집기
- **증상**: Monaco Editor가 화면에 보이지 않거나 매우 작은 높이(3줄 정도)로만 표시됨

## 문제 상세

### 증상
- 툴바는 정상적으로 표시됨
- Monaco Editor 영역이 비어있거나 매우 작게 보임
- 에디터를 클릭하면 포커스는 받지만 시각적으로 보이지 않음
- 텍스트 입력 시 오른쪽 미리보기는 업데이트되지만 에디터는 보이지 않음

### 원인 분석

Monaco Editor는 `height="100%"`로 설정되어 있었는데, CSS에서 **퍼센트(%) 높이가 제대로 계산되려면 부모 요소들의 높이가 명시적으로 정의되어 있어야 합니다.**

#### 문제가 된 컴포넌트 구조

```
LayoutWrapper (h-[calc(100vh-3.5rem)]) ✅ 명시적 높이
  └─ ResizableSplitPane (h-full) 
      └─ left 패널 (flex flex-col)
          └─ MarkdownToolbar (고정 높이 ~48px)
          └─ 에디터 컨테이너 (flex-1 min-h-0) ❌ 문제 발생!
              └─ MonacoEditorWrapper
                  └─ Editor (height="100%") ❌ 부모 높이 미정의
```

#### 왜 `flex-1`이 작동하지 않았나?

1. **Flexbox의 `flex-1` 동작**
   - `flex-1`은 `flex-grow: 1`을 의미하며, 남은 공간을 채움
   - 그러나 부모의 높이가 컨텐츠에 의해 결정되면 "남은 공간"이 0이 됨

2. **퍼센트 높이의 동작**
   - `height: 100%`는 부모의 **명시적 높이**를 기준으로 계산됨
   - Flexbox에서 `flex-1`로 늘어난 높이는 "명시적 높이"로 인식되지 않음

3. **Monaco Editor의 특성**
   - Monaco Editor는 내부적으로 `height="100%"`를 사용
   - 부모가 픽셀 단위의 명확한 높이를 가지고 있어야 정상 렌더링됨

## 해결 방법

### 최종 해결책: `calc()` 함수로 명시적 높이 계산

에디터 컨테이너에 `calc()`를 사용하여 정확한 픽셀 높이를 계산:

```tsx
// Markdown 페이지 (src/app/markdown/page.tsx)
<div style={{ height: 'calc(100vh - 3.5rem - 48px)' }}>
  <MonacoEditorWrapper ... />
</div>

// LaTeX 페이지 (src/app/latex/page.tsx)
<div style={{ height: 'calc(100vh - 3.5rem - 140px)' }}>
  <MonacoEditorWrapper ... />
</div>
```

**계산 분해:**
- `100vh` - 전체 뷰포트 높이
- `-3.5rem` - 헤더 높이 (56px)
- `-48px` - 마크다운 툴바 높이
- `-140px` - LaTeX 심볼 팔레트 높이 (더 큼)

### 시도했으나 실패한 방법들

1. **`flex-1 min-h-0` 조합**
   ```tsx
   <div className="flex-1 min-h-0">
     <MonacoEditorWrapper />
   </div>
   ```
   - 결과: 실패. Monaco Editor가 높이 0으로 렌더링됨

2. **CSS Grid 사용**
   ```tsx
   <div style={{ gridTemplateRows: '1fr' }}>
     {children}
   </div>
   ```
   - 결과: 부분적 성공. 그러나 여전히 높이 계산 문제 발생

3. **`absolute inset-0` 포지셔닝**
   ```tsx
   <div className="relative">
     <div className="absolute inset-0">
       <MonacoEditorWrapper />
     </div>
   </div>
   ```
   - 결과: 실패. 부모의 명시적 높이가 없으면 작동하지 않음

4. **중첩 래퍼 추가**
   ```tsx
   <div className="h-full w-full flex flex-col">
     <Toolbar />
     <div className="flex-1">
       <MonacoEditorWrapper />
     </div>
   </div>
   ```
   - 결과: 실패. 래퍼를 추가해도 높이 상속 문제 해결 안 됨

## 추가 변경 사항

### ResizableSplitPane 컴포넌트 수정

Flexbox에서 CSS Grid로 변경하여 레이아웃 안정성 향상:

```tsx
// 변경 전
<div className="flex h-full w-full">
  <div style={{ width: `${leftWidth}%` }}>...</div>
  ...
</div>

// 변경 후
<div 
  className="grid w-full overflow-hidden" 
  style={{ 
    gridTemplateColumns: `${leftWidth}% 4px 1fr`,
    gridTemplateRows: '1fr',
    height: '100%' 
  }}
>
  ...
</div>
```

### MonacoEditorWrapper 단순화

불필요한 래퍼 div 제거:

```tsx
// 변경 전
return (
  <div className="h-full w-full min-h-0 relative group">
    <Editor height="100%" ... />
  </div>
);

// 변경 후
return (
  <Editor height="100%" width="100%" ... />
);
```

## 교훈 및 권장사항

1. **Monaco Editor 사용 시**
   - 항상 부모 컨테이너에 **명시적 픽셀/calc 높이** 설정
   - `flex-1`이나 `h-full` 같은 상대적 높이에 의존하지 않기

2. **CSS 높이 계산 이해**
   - `%` 높이는 부모의 **명시적 높이**가 있어야 작동
   - Flexbox의 `flex-grow`는 명시적 높이로 인식되지 않음

3. **디버깅 팁**
   - 브라우저 개발자 도구에서 요소의 computed height 확인
   - 각 부모 요소의 높이가 0이 아닌지 체인 전체 확인

## 관련 파일

- `src/app/markdown/page.tsx` - 마크다운 편집기 페이지
- `src/app/latex/page.tsx` - LaTeX 편집기 페이지
- `src/components/ui/ResizableSplitPane.tsx` - 분할 패널 컴포넌트
- `src/components/ui/MonacoEditorWrapper.tsx` - Monaco Editor 래퍼

## 참고 자료

- [Monaco Editor GitHub Issues - Height 관련](https://github.com/microsoft/monaco-editor/issues)
- [CSS height: 100% 작동 원리](https://developer.mozilla.org/en-US/docs/Web/CSS/height)
- [Flexbox와 height 계산](https://css-tricks.com/flexbox-and-truncated-text/)

