# 장기 체류관광 맞춤형 지역 추천 및 랭킹 서비스

StackBlitz에서 바로 확인할 수 있도록 Vite + React + Tailwind CSS 기반으로 구성한 프로토타입입니다.

## 실행 방법

### StackBlitz에서 열기
1. 이 ZIP 파일을 다운로드합니다.
2. StackBlitz에서 새 프로젝트를 만든 뒤 ZIP 업로드 또는 파일 전체 드래그앤드롭으로 가져옵니다.
3. 의존성 설치 후 자동으로 실행되며, 필요하면 터미널에서 아래 명령을 실행합니다.

```bash
npm install
npm run dev
```

## 포함 파일
- `src/App.jsx`: 메인 프로토타입 화면
- `src/main.jsx`: React 엔트리 파일
- `src/index.css`: Tailwind 및 기본 전역 스타일
- `package.json`: 실행/빌드 스크립트 및 의존성
- `vite.config.js`: Vite 설정
- `tailwind.config.js`, `postcss.config.js`: Tailwind 설정
- `stackblitz.json`: StackBlitz 실행 설정

## 메모
- 지도 영역은 실제 Kakao/Naver Map SDK 연동 전의 SVG 기반 프로토타입입니다.
- 점수 계산은 첨부 공공데이터를 집계한 시도 단위 정규화 결과를 반영합니다.
