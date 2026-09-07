# 03. 디자인 시스템 & 스타일 가이드 (Design System)

## 1. CSS 변수 (CSS Custom Properties) 및 컬러 테마

### 1.1. 라이트 모드 (Light Mode) / 다크 모드 (Dark Mode)
```css
:root {
  /* 브랜드 컬러 */
  --primary-color: #3b82f6;       /* Blue */
  --primary-hover: #2563eb;
  --secondary-color: #10b981;     /* Emerald */
  --accent-color: #8b5cf6;        /* Purple */

  /* 라이트 모드 기본 색상 */
  --bg-color: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-card: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* 레이아웃 & 간격 */
  --max-width: 1200px;
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;
  --transition: all 0.3s ease;
}

[data-theme="dark"] {
  /* 다크 모드 색상 오버라이드 */
  --bg-color: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #1e293b;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --border-color: #334155;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
}
```

---

## 2. 타이포그래피 (Typography)

- **기본 폰트 패밀리**: `'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', sans-serif`
- **폰트 사이즈 계층**:
  - `Display / Hero Title`: 2.5rem ~ 3.5rem (40px ~ 56px), Weight: 700
  - `Section Title (h2)`: 2.0rem ~ 2.5rem (32px ~ 40px), Weight: 700
  - `Card Title (h3)`: 1.25rem ~ 1.5rem (20px ~ 24px), Weight: 600
  - `Body Text (p)`: 1.0rem (16px), Line-height: 1.6, Weight: 400
  - `Small / Badge (span)`: 0.875rem (14px), Weight: 500

---

## 3. 반응형 브레이크포인트 (Breakpoints)

| 장치 | 해상도 범위 | 레이아웃 특징 |
| :--- | :--- | :--- |
| **모바일 (Mobile)** | `< 768px` | 1단 컬럼 레이아웃, 햄버거 메뉴 활성화 |
| **태블릿 (Tablet)** | `768px ~ 1023px` | 2단 카드 그리드, 여백 축소 |
| **데스크톱 (Desktop)** | `>= 1024px` | 3단 카드 그리드, 고정 가로폭 (최대 1200px 중앙 정렬) |

---

## 4. UI 컴포넌트 규격
1. **버튼 (Buttons)**:
   - Primary: 배경 `--primary-color`, 글자 흰색, hover 시 `--primary-hover`
   - Secondary / Outline: 배경 투명, 테두리 `--primary-color`, hover 시 배경 채움
2. **카드 (Card Component)**:
   - 배경: `--bg-card`
   - 테두리: `1px solid var(--border-color)`
   - Hover 효과: `transform: translateY(-5px)` 및 그림자 강조
3. **배지/태그 (Tag / Badge)**:
   - 둥근 모서리 (`--radius-full`), 은은한 배경색과 폰트 크기 `0.85rem`
