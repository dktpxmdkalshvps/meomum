# Code Review: Long Stay Region Recommender Prototype

## 1. Code Structure & Extensibility
*   **Data vs. Logic Separation:** `src/App.jsx` currently contains all static configuration data (`REGION_DATA`, `PRESETS`, `METRIC_META`, `KPI_ORDER`, `SOURCE_TAGS`) taking up over 700 lines of code. This significantly reduces the readability of the actual UI component. These should be extracted to a separate data file (e.g., `src/data.js` or `src/constants.js`).
*   **Component Modularity:** `LongStayRegionRecommenderPrototype` is a single massive component containing the entire UI structure. Consider splitting it into smaller, logically independent components:
    *   `Sidebar` (Filters and Settings)
    *   `RankingList` (Top 10 regions)
    *   `Heatmap` (Map prototype)
    *   `AnalysisDashboard` (Radar chart, Bar chart, Region Details)
*   **File Duplication:** `MeomumRegionRecommenderPrototype.jsx` is almost identical to `src/App.jsx` and should be removed if it's not actively used or serving a different purpose.

## 2. React Hooks Usage
*   **Redundant `useEffect`:**
    ```javascript
    useEffect(() => {
      if (!ranking.some((item) => item.id === selectedRegionId)) {
        setSelectedRegionId(ranking[0]?.id);
      }
    }, [ranking, selectedRegionId]);
    ```
    This `useEffect` is unnecessary. `calculateRanking` merely recalculates scores and sorts regions; it never adds or removes IDs. Therefore, `selectedRegionId` will always exist in `ranking`. Furthermore, even if it didn't, the fallback logic `const selectedRegion = ranking.find(...) || ranking[0]` already handles this gracefully without triggering an additional render cycle.
*   **Memoization:** `ranking`, `top10`, `normalizedDraft`, `radarData`, and `barData` are correctly memoized using `useMemo`, preventing expensive array mapping/sorting on every render.

## 3. Calculation Logic
*   **Weight Normalization (`normalizeWeights`):** The function handles scenarios where the total weight is 0 by falling back to equal weights (20% each). This prevents division-by-zero errors gracefully.
*   **Ranking (`calculateRanking`):** The use of `KPI_ORDER.reduce` is solid.

## 4. UI Layout & Styles
*   **Tailwind CSS:** Comprehensive and well-used. The color mappings (`scoreColor`, `gradeTone`) create clear visual feedback.
*   **Responsiveness:** The layout uses CSS Grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`, etc.), making it generally responsive, but complex nested grids could be challenging to maintain.
*   **Framer Motion:** Used subtly for the header animation.
*   **Maps (SVG Prototype):** The heatmap coordinate scaling logic (`getMapPoint`) works for a visual mockup but assumes an equirectangular projection bounded between Korea's coordinates, which is sufficient for a prototype but will require an actual Maps SDK for real-world use as noted in the README.
