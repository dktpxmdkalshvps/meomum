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
- `src/assets/korea-municipalities-simplified.json`: 시군구 경계 GeoJSON
- `src/assets/korea-provinces-simplified.json`: 시도 경계 GeoJSON
- `src/main.jsx`: React 엔트리 파일
- `src/index.css`: Tailwind 및 기본 전역 스타일
- `package.json`: 실행/빌드 스크립트 및 의존성
- `vite.config.js`: Vite 설정
- `tailwind.config.js`, `postcss.config.js`: Tailwind 설정
- `stackblitz.json`: StackBlitz 실행 설정

## 메모
- 지도 영역은 실제 대한민국 시군구 경계 GeoJSON을 사용한 choropleth 지도입니다.
- 현재 색상 점수는 첨부 공공데이터의 해상도에 맞춰 시도 단위 정규화 결과를 시군구 경계 위에 반영합니다.
- 이후 시군구 단위 원천 데이터를 추가하면 같은 컴포넌트 구조에서 상세 랭킹으로 확장할 수 있습니다.
