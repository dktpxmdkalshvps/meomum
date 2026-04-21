# 장기 체류관광 맞춤형 지역 추천 및 랭킹 서비스
## 프론트 아키텍처 문서

- 문서 버전: 1.0
- 작성 목적: 프로토타입 프론트엔드의 구조, 상태 흐름, 컴포넌트 책임, 외부 연동 포인트를 정의하여 개발 및 확장 기준선으로 사용한다.
- 대상 범위: Vite + React 기반 웹 프론트엔드

---

## 1. 아키텍처 목표

본 프론트엔드는 다음 목표를 기준으로 설계한다.

1. 사용자가 5대 지표 가중치를 직관적으로 조정할 수 있어야 한다.
2. 가중치 변경 후 지역 랭킹 결과가 빠르게 다시 계산되어야 한다.
3. 랭킹, 방사형 차트, 지도 히트맵, 상세 정보가 하나의 흐름으로 연결되어야 한다.
4. 초기 프로토타입은 프론트 단독으로 동작하되, 이후 백엔드 API 및 지도 SDK로 무리 없이 교체 가능해야 한다.
5. 모바일, 태블릿, 데스크톱 환경에서 동일한 사용 흐름을 제공해야 한다.

---

## 2. 기술 스택

### 2.1 현재 프로토타입 스택
- **Build Tool**: Vite
- **UI Library**: React
- **Styling**: Tailwind CSS
- **Chart**: Recharts
- **Animation**: Framer Motion
- **Icon**: lucide-react

### 2.2 추후 확장 스택
- **지도 SDK**: Kakao Maps 또는 Naver Maps
- **상태관리 확장 시**: Zustand 또는 Redux Toolkit
- **서버 상태 관리**: TanStack Query
- **유효성/계약 검증**: Zod
- **테스트**: Vitest + React Testing Library + Playwright

---

## 3. 화면 중심 아키텍처 개요

프론트는 단일 페이지 기반의 대시보드형 구조를 가진다.

### 3.1 주요 화면 블록
1. **Hero/Header 영역**
   - 서비스 개요
   - 현재 추천 1위 지역
   - 선택 지역 및 현재 점수 노출

2. **필터 패널**
   - 5대 지표 슬라이더
   - 세대별 프리셋 버튼
   - 랭킹 재계산 버튼

3. **랭킹 패널**
   - Top 10 지역 리스트
   - 현재 선택 지역 강조 표시
   - 강점/약점 요약 노출

4. **지도/히트맵 패널**
   - 종합점수 또는 개별 지표 기준 분포 확인
   - 선택 지역 마커 강조
   - 추후 지도 API로 교체 예정

5. **지표 분석 패널**
   - 방사형 차트
   - 선택 지역의 5대 지표 점수

6. **상세 인프라 패널**
   - 교통/문화/생활편의/안전·자연 요약 카드
   - 병원 수, 공원 수, 대중교통 접근성 등 원천 데이터 표시

7. **공유 패널**
   - 결과 링크 생성
   - 향후 카카오톡 공유 SDK 연동 가능

---

## 4. 폴더 구조 제안

현재 ZIP은 단일 `App.jsx` 중심의 프로토타입이지만, 실제 개발에서는 아래 구조를 권장한다.

```txt
src/
  app/
    App.jsx
    providers.jsx
    router.jsx
  components/
    layout/
      Header.jsx
      PageShell.jsx
    filters/
      FilterPanel.jsx
      PresetButtons.jsx
      WeightSlider.jsx
    ranking/
      RankingPanel.jsx
      RankingItem.jsx
    map/
      HeatmapPanel.jsx
      RegionMap.jsx
      RegionMarker.jsx
    charts/
      RegionRadarCard.jsx
      RankingBarChart.jsx
    details/
      RegionDetailPanel.jsx
      DetailStatCard.jsx
    share/
      SharePanel.jsx
  features/
    recommendation/
      hooks/
        useRecommendationRanking.js
      services/
        recommendation.service.js
      utils/
        scoreCalculator.js
        normalization.js
      constants/
        presets.js
        metrics.js
      types/
        region.js
    region/
      hooks/
        useSelectedRegion.js
      utils/
        regionSummary.js
  data/
    mock/
      regionData.js
  lib/
    formatters.js
    map.js
    chart.js
    env.js
  styles/
    index.css
```

### 4.1 구조 원칙
- `components`: 순수 UI 컴포넌트
- `features`: 도메인 로직과 훅, 서비스
- `data/mock`: 프로토타입 더미 데이터
- `lib`: 공통 유틸리티

이렇게 분리하면 프로토타입에서 운영 버전으로 넘어갈 때 교체 범위가 명확해진다.

---

## 5. 컴포넌트 아키텍처

### 5.1 최상위 컨테이너
`App.jsx`는 페이지 조립자 역할을 가진다.

책임:
- 전체 레이아웃 구성
- 전역 상태 훅 호출
- 하위 패널에 데이터 전달

### 5.2 프리젠테이셔널 컴포넌트
프리젠테이셔널 컴포넌트는 UI 렌더링에 집중한다.

예시:
- `WeightSlider`
- `PresetButtons`
- `RankingItem`
- `DetailStatCard`

특징:
- 계산 로직 최소화
- props 기반 렌더링
- 재사용성 높음

### 5.3 컨테이너 성격 컴포넌트
상태와 이벤트를 조합하여 여러 UI 컴포넌트를 묶는다.

예시:
- `FilterPanel`
- `RankingPanel`
- `RegionDetailPanel`
- `HeatmapPanel`

---

## 6. 상태관리 전략

### 6.1 현재 상태관리 방식
프로토타입은 `useState`, `useMemo`, `useEffect` 중심의 로컬 상태 관리로 충분하다.

핵심 상태:
- `draftWeights`: 사용자가 현재 조절 중인 가중치
- `appliedWeights`: 실제 랭킹 계산에 반영된 가중치
- `activePreset`: 선택된 프리셋 종류
- `mapMetric`: 지도 히트맵 기준 지표
- `selectedRegionId`: 현재 선택 지역
- `shareState`: 공유 처리 결과 메시지

### 6.2 상태 분리 원칙
- **입력 중 상태**와 **적용된 상태**를 분리한다.
- 사용자가 슬라이더를 움직이는 즉시 전체 랭킹이 매번 재계산되지 않도록 `draftWeights`와 `appliedWeights`를 나눈다.
- 이는 추후 API 호출 기반 구조로 전환할 때도 동일하게 유리하다.

### 6.3 확장 시 권장 상태관리
복잡도가 증가하면 다음을 분리한다.

1. **UI 상태**: Zustand
   - 사이드 패널 열림 여부
   - 선택 지표
   - 지도 줌 레벨

2. **서버 상태**: TanStack Query
   - 지역 점수 API 응답
   - 상세 인프라 API 응답
   - 실시간 날씨/대기질 API 응답

---

## 7. 데이터 흐름

### 7.1 현재 프로토타입 흐름
```txt
사용자 입력(슬라이더/프리셋)
  -> draftWeights 변경
  -> 랭킹 다시 계산 버튼 클릭
  -> appliedWeights 갱신
  -> scoreCalculator 실행
  -> ranking 생성
  -> Top10 / 지도 / 차트 / 상세정보 동시 갱신
```

### 7.2 운영 버전 목표 흐름
```txt
사용자 입력
  -> filter state 생성
  -> recommendation API 요청
  -> ranking result 수신
  -> 선택 지역 기본값 설정
  -> 상세 정보 API 요청
  -> 차트/지도/상세 패널 렌더링
```

### 7.3 데이터 계약 예시
```ts
interface RegionScore {
  id: string;
  name: string;
  lat: number;
  lng: number;
  finalScore: number;
  metrics: {
    traffic: number;
    culture: number;
    convenience: number;
    safety: number;
    nature: number;
  };
}

interface RegionDetail {
  hospitals: number;
  pharmacies: number;
  parks: number;
  parkAreaSqm: number;
  busStops: number;
  railStations: number;
  highspeedStations: number;
  transportAccessibility: number;
  cultureFacilities: number;
  tourismAccommodations: number;
  wifiCount: number;
  pm10Avg: number;
  coAvg: number;
  annualTempAvg: number;
  safetyGrades: Record<string, number>;
}
```

---

## 8. 점수 계산 아키텍처

### 8.1 계산 원칙
요구사항 기준에 따라 최종 점수는 100점 만점으로 계산한다.

```txt
최종점수 = Σ(정규화 지표 점수 × 사용자 가중치 비율)
```

### 8.2 프론트 책임과 백엔드 책임 분리

#### 프론트 책임
- 가중치 입력 및 정규화
- 계산 요청 트리거
- 결과 시각화

#### 백엔드 책임
- 원천 데이터 수집
- 결측치/이상치 처리
- Min-Max 정규화
- 행정구역 매핑 표준화
- 최종 추천 점수 산출 API 제공

### 8.3 프로토타입 구현 방식
현재는 첨부 데이터를 프론트 내부 정적 데이터로 보유한다.

- 장점: 즉시 데모 가능
- 한계: 데이터 최신화, 재현성, 운영 연동 한계

운영 환경에서는 아래 함수들을 API 기반으로 교체한다.
- `calculateRanking`
- `normalizeWeights`
- `selectedRegion 상세 조회`

---

## 9. 외부 연동 아키텍처

### 9.1 지도 API 연동
현재 `SVG mock map`을 사용하고 있으나 다음 인터페이스를 기준으로 교체한다.

#### 권장 추상화
```ts
interface MapAdapter {
  renderMap(container: HTMLElement): void;
  setMarkers(regions: RegionScore[]): void;
  highlightRegion(regionId: string): void;
  setHeatLayer(metricKey: string): void;
}
```

#### 이유
- Kakao Maps와 Naver Maps 구현 차이를 어댑터로 감출 수 있다.
- UI 로직은 그대로 유지하고 지도 엔진만 바꿀 수 있다.

### 9.2 공유 기능 연동
현재는 Web Share API와 Clipboard API를 사용한다.

추후 확장:
- 카카오 SDK 연동
- 결과 이미지 캡처 공유
- 단축 URL 생성

### 9.3 실시간 공공데이터 API
실시간 날씨/대기질 데이터는 별도 API 모듈로 분리한다.

예시:
```txt
features/recommendation/services/
  airQuality.service.js
  weather.service.js
```

운영 시 고려사항:
- 호출 한도
- 실패 시 fallback UI
- 캐싱 전략
- 최근 성공값 재사용

---

## 10. 스타일 및 반응형 전략

### 10.1 레이아웃 전략
- Mobile First 기반 설계
- 카드형 UI 조합
- 큰 화면에서는 2단 또는 3단 그리드
- 작은 화면에서는 세로 스택

### 10.2 브레이크포인트 가이드
- `sm`: 640px 이상
- `md`: 768px 이상
- `lg`: 1024px 이상
- `xl`: 1280px 이상

### 10.3 UI 원칙
- 필터 → 결과 → 상세정보 흐름이 한눈에 보여야 한다.
- 중요 정보는 카드 상단과 랭킹 상위에 집중 배치한다.
- 수치형 정보는 비교가 쉽도록 동일한 패턴으로 정렬한다.

---

## 11. 성능 아키텍처

### 11.1 현재 기준
프로토타입은 클라이언트 메모리 내 계산으로 충분하다.

### 11.2 운영 시 고려
1. `useMemo`로 계산 캐싱
2. 지도 마커/오버레이 렌더링 최적화
3. 상세 패널 lazy load 가능
4. API 결과 캐싱
5. 차트 데이터 재생성 최소화

### 11.3 성능 목표
- 필터 적용 후 결과 갱신: 3초 이내
- 주요 인터랙션: 100ms 이내 체감 반응
- 모바일 초기 렌더링: 가능한 2초 내 주요 콘텐츠 표시

---

## 12. 오류 처리 전략

### 12.1 사용자 입력 오류
- 모든 가중치가 0일 경우 균등 분배 또는 경고 메시지 제공
- 잘못된 프리셋 값이 들어오면 기본값으로 복구

### 12.2 API 오류
- 랭킹 API 실패 시 재시도 버튼 노출
- 상세 정보 API 실패 시 요약 정보만 유지
- 지도 API 실패 시 텍스트 기반 랭킹은 정상 제공

### 12.3 데이터 오류
- 특정 지역의 일부 지표 누락 시 `N/A` 노출
- 백엔드에서 결측 대체 정책을 우선 적용

---

## 13. 접근성 및 사용성

### 13.1 접근성 원칙
- 슬라이더에 레이블 명확히 제공
- 버튼 포커스 스타일 유지
- 색상 외에도 텍스트/수치로 상태 표현
- 차트는 요약 수치 카드 병행 제공

### 13.2 사용성 원칙
- 프리셋 버튼으로 빠른 시작 제공
- 현재 적용 비율 시각화 제공
- 선택 지역 강조 표시 유지
- 복잡한 지표는 상세 카드에서 풀어 설명

---

## 14. 테스트 전략

### 14.1 단위 테스트
대상:
- `normalizeWeights`
- `calculateRanking`
- `strongestMetric`
- `weakestMetric`
- formatter 함수

### 14.2 컴포넌트 테스트
대상:
- 프리셋 클릭 시 슬라이더 값 반영
- 랭킹 재계산 버튼 동작
- 지역 선택 시 차트/상세 정보 변경

### 14.3 E2E 테스트
시나리오:
1. 사용자가 2030 프리셋 선택
2. 랭킹 다시 계산 클릭
3. Top 10 확인
4. 특정 지역 클릭
5. 상세 인프라 정보와 방사형 차트 확인

---

## 15. 배포 및 환경변수

### 15.1 배포 구조
- 정적 프론트 배포: Vercel, Netlify 또는 Nginx
- 백엔드/API 서버: 별도 컨테이너
- 지도 API Key 및 공공 API Key: 환경변수 관리

### 15.2 환경변수 예시
```env
VITE_API_BASE_URL=https://api.example.com
VITE_KAKAO_MAP_KEY=your_kakao_key
VITE_NAVER_MAP_KEY=your_naver_key
VITE_KAKAO_SHARE_KEY=your_kakao_share_key
```

### 15.3 주의사항
- 클라이언트 노출 키와 서버 비밀 키 분리
- 실시간 API 키는 호출량 제한 고려

---

## 16. 단계별 고도화 로드맵

### Phase 1. 프로토타입
- 정적 데이터 기반 랭킹
- 기본 차트/지도 시안
- 공유 기능 시안

### Phase 2. API 연동
- 추천 점수 API 연결
- 상세 조회 API 연결
- 실시간 날씨/대기질 API 연결

### Phase 3. 지도 고도화
- 실제 Kakao/Naver 지도 SDK 적용
- 마커 클러스터링
- 히트맵 오버레이
- 시군구 단위 Drill-down

### Phase 4. 서비스화
- 즐겨찾기/비교 기능
- 로그인 및 사용자 선호 저장
- 링크 공유/이미지 공유 고도화
- 운영 대시보드 및 모니터링 추가

---

## 17. 현재 프로토타입과 운영 버전의 차이

| 구분 | 현재 프로토타입 | 운영 버전 목표 |
| --- | --- | --- |
| 데이터 소스 | 프론트 내부 정적 데이터 | 백엔드/DB/API 연동 |
| 랭킹 계산 | 클라이언트 계산 | 서버 계산 + 검증 |
| 지도 | SVG 기반 시안 | Kakao/Naver Maps SDK |
| 공유 | Web Share/Clipboard | 카카오 SDK, 이미지 공유 |
| 상태관리 | useState 중심 | Zustand + Query 확장 가능 |
| 행정구역 단위 | 시도 중심 | 시군구 Drill-down 가능 |

---

## 18. 결론

현재 프론트 아키텍처는 **요구사항 정의서의 핵심 기능을 빠르게 검증하기 위한 프로토타입 구조**로 적합하다.
특히 다음 강점을 가진다.

- 가중치 기반 추천 흐름이 단순하고 명확하다.
- 시각화 요소가 랭킹, 지도, 차트, 상세정보로 자연스럽게 연결된다.
- 추후 백엔드 API, 지도 SDK, 공유 SDK로 교체하기 쉽도록 책임 분리가 가능하다.
- 프로토타입에서 운영형 구조로 확장 가능한 컴포넌트 및 데이터 흐름 기준을 제공한다.

향후 실제 개발에서는 이 문서를 기준으로 컴포넌트 분리, API 계약 정의, 상태관리 표준화, 테스트 코드 작성을 진행하는 것을 권장한다.
