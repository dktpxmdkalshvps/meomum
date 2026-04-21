
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import {
  SlidersHorizontal,
  MapPinned,
  Radar as RadarIcon,
  Share2,
  Trophy,
  ShieldCheck,
  Trees,
  TrainFront,
  Building2,
  Wifi,
  Hospital,
  RefreshCcw,
} from "lucide-react";
import { REGION_DATA, PRESETS, METRIC_META, KPI_ORDER, SOURCE_TAGS } from "./data";

function normalizeWeights(weights) {
  const total = Object.values(weights).reduce((acc, value) => acc + value, 0);
  if (!total) {
    return Object.fromEntries(KPI_ORDER.map((key) => [key, 20]));
  }
  return Object.fromEntries(
    KPI_ORDER.map((key) => [key, (weights[key] / total) * 100])
  );
}

function calculateRanking(regions, weights) {
  const normalized = normalizeWeights(weights);
  return regions
    .map((region) => {
      const score = KPI_ORDER.reduce(
        (acc, key) => acc + region.metrics[key] * (normalized[key] / 100),
        0
      );
      return {
        ...region,
        finalScore: Number(score.toFixed(1)),
        normalizedWeights: normalized,
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function formatArea(value) {
  if (!value) return "0㎡";
  return `${formatNumber(value)}㎡`;
}

function gradeLabel(grade) {
  return `${grade}등급`;
}

function gradeTone(grade) {
  if (grade <= 2) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (grade === 3) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

function scoreColor(value) {
  if (value >= 75) return "#16a34a";
  if (value >= 60) return "#65a30d";
  if (value >= 45) return "#f59e0b";
  return "#ef4444";
}

function scoreTone(value) {
  if (value >= 75) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (value >= 60) return "bg-lime-50 text-lime-700 border-lime-200";
  if (value >= 45) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

function getMapPoint(region) {
  const minLat = 33.1;
  const maxLat = 38.3;
  const minLng = 126.2;
  const maxLng = 129.5;
  const x = ((region.lng - minLng) / (maxLng - minLng)) * 100;
  const y = 100 - ((region.lat - minLat) / (maxLat - minLat)) * 100;
  return { x: Math.min(Math.max(x, 8), 92), y: Math.min(Math.max(y, 10), 92) };
}

function strongestMetric(region) {
  return KPI_ORDER.map((key) => ({ key, score: region.metrics[key] })).sort(
    (a, b) => b.score - a.score
  )[0];
}

function weakestMetric(region) {
  return KPI_ORDER.map((key) => ({ key, score: region.metrics[key] })).sort(
    (a, b) => a.score - b.score
  )[0];
}

function RangeSlider({ label, value, onChange, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-700">{label}</div>
        <div className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {value}%
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900"
        style={{ accentColor: color }}
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{helper}</div>
    </div>
  );
}

export default function LongStayRegionRecommenderPrototype() {
  const [draftWeights, setDraftWeights] = useState(PRESETS["균형형"]);
  const [appliedWeights, setAppliedWeights] = useState(PRESETS["균형형"]);
  const [activePreset, setActivePreset] = useState("균형형");
  const [mapMetric, setMapMetric] = useState("overall");
  const [selectedRegionId, setSelectedRegionId] = useState("제주");
  const [shareState, setShareState] = useState("");

  const ranking = useMemo(
    () => calculateRanking(REGION_DATA, appliedWeights),
    [appliedWeights]
  );
  const top10 = ranking.slice(0, 10);
  const selectedRegion =
    ranking.find((item) => item.id === selectedRegionId) || ranking[0];
  const normalizedDraft = useMemo(
    () => normalizeWeights(draftWeights),
    [draftWeights]
  );


  const radarData = useMemo(() => {
    if (!selectedRegion) return [];
    return KPI_ORDER.map((key) => ({
      subject: METRIC_META[key].label,
      value: selectedRegion.metrics[key],
      fullMark: 100,
    }));
  }, [selectedRegion]);

  const barData = useMemo(
    () =>
      top10.map((item) => ({
        name: item.name,
        score: item.finalScore,
      })),
    [top10]
  );

  const strongest = selectedRegion ? strongestMetric(selectedRegion) : null;
  const weakest = selectedRegion ? weakestMetric(selectedRegion) : null;

  const handlePreset = (presetName) => {
    setActivePreset(presetName);
    setDraftWeights(PRESETS[presetName]);
  };

  const applyRanking = () => {
    setAppliedWeights(draftWeights);
  };

  const shareResult = async () => {
    const payload = {
      region: selectedRegion?.name,
      weights: draftWeights,
      heatmap: mapMetric,
    };
    const shareUrl = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(
      JSON.stringify(payload)
    )}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "장기 체류관광 맞춤형 추천 결과",
          text: `${selectedRegion?.name} 중심 추천 결과를 공유합니다.`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
      setShareState("공유 링크가 준비되었습니다.");
      setTimeout(() => setShareState(""), 2000);
    } catch (error) {
      setShareState("공유가 취소되었거나 브라우저가 제한했습니다.");
      setTimeout(() => setShareState(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-900 p-6 text-white shadow-xl"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold">
                Meomum : 장기 체류관광 맞춤형 지역 추천 및 랭킹 서비스 · Prototype v1
              </div>
              <h1 className="text-2xl font-bold md:text-4xl">
                지역생활 데이터를 반영한 장기 체류관광 추천
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 md:text-base">
                교통, 문화, 생활편의, 안전, 자연 5대 지표를 직접 가중치로 조정하고,
                시도 단위 정규화 점수와 결합해 Top 10 지역을 도출하는 프로토타입입니다.
                지도 영역은 실제 지도 API 연동 전 단계의 인터랙션 시안으로 구성했습니다.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {SOURCE_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:w-[430px]">
              <StatCard
                icon={Trophy}
                label="현재 1위"
                value={ranking[0]?.name || "-"}
                helper={`${ranking[0]?.finalScore || 0}점`}
              />
              <StatCard
                icon={SlidersHorizontal}
                label="가중치 합"
                value={`${Math.round(
                  Object.values(normalizedDraft).reduce((a, b) => a + b, 0)
                )}%`}
                helper="산출 시 내부 정규화 적용"
              />
              <StatCard
                icon={ShieldCheck}
                label="선택 지역"
                value={selectedRegion?.name || "-"}
                helper={selectedRegion ? `${selectedRegion.finalScore}점` : "선택 없음"}
              />
              <StatCard
                icon={Trees}
                label="Top 10"
                value="실시간"
                helper="슬라이더 적용 후 재산출"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-slate-700" />
                <h2 className="text-lg font-bold">맞춤형 필터</h2>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2">
                {Object.keys(PRESETS).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handlePreset(preset)}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      activePreset === preset
                        ? "bg-slate-900 text-white shadow-md"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <RangeSlider
                  label="교통"
                  value={draftWeights.traffic}
                  color={METRIC_META.traffic.color}
                  onChange={(value) =>
                    setDraftWeights((prev) => ({ ...prev, traffic: value }))
                  }
                />
                <RangeSlider
                  label="문화"
                  value={draftWeights.culture}
                  color={METRIC_META.culture.color}
                  onChange={(value) =>
                    setDraftWeights((prev) => ({ ...prev, culture: value }))
                  }
                />
                <RangeSlider
                  label="생활편의"
                  value={draftWeights.convenience}
                  color={METRIC_META.convenience.color}
                  onChange={(value) =>
                    setDraftWeights((prev) => ({ ...prev, convenience: value }))
                  }
                />
                <RangeSlider
                  label="안전"
                  value={draftWeights.safety}
                  color={METRIC_META.safety.color}
                  onChange={(value) =>
                    setDraftWeights((prev) => ({ ...prev, safety: value }))
                  }
                />
                <RangeSlider
                  label="자연"
                  value={draftWeights.nature}
                  color={METRIC_META.nature.color}
                  onChange={(value) =>
                    setDraftWeights((prev) => ({ ...prev, nature: value }))
                  }
                />
              </div>

              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  적용 예정 비율
                </div>
                <div className="space-y-2">
                  {KPI_ORDER.map((key) => (
                    <div key={key}>
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                        <span>{METRIC_META[key].label}</span>
                        <span>{normalizedDraft[key].toFixed(1)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${normalizedDraft[key]}%`,
                            backgroundColor: METRIC_META[key].color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={applyRanking}
                  className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:translate-y-[-1px]"
                >
                  랭킹 다시 계산
                </button>
                <button
                  onClick={() => {
                    setActivePreset("균형형");
                    setDraftWeights(PRESETS["균형형"]);
                    setAppliedWeights(PRESETS["균형형"]);
                  }}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  초기화
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <h2 className="text-lg font-bold">Top 10 지역 랭킹</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  산출 기준: 100점 만점
                </span>
              </div>

              <div className="space-y-2">
                {top10.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedRegionId(item.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selectedRegion?.id === item.id
                        ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                              item.rank <= 3
                                ? "bg-amber-400 text-slate-900"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {item.rank}
                          </span>
                          <span className="text-base font-bold">{item.name}</span>
                        </div>
                        <div
                          className={`mt-2 text-xs ${
                            selectedRegion?.id === item.id
                              ? "text-slate-300"
                              : "text-slate-500"
                          }`}
                        >
                          강점: {METRIC_META[strongestMetric(item).key].label} · 약점:{" "}
                          {METRIC_META[weakestMetric(item).key].label}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{item.finalScore}</div>
                        <div
                          className={`text-xs ${
                            selectedRegion?.id === item.id
                              ? "text-slate-300"
                              : "text-slate-500"
                          }`}
                        >
                          {item.population
                            ? `인구 ${formatNumber(item.population)}명`
                            : ""}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPinned className="h-5 w-5 text-sky-600" />
                    <h2 className="text-lg font-bold">지역 히트맵 / 마커 프로토타입</h2>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    지도 API 연동 전 UI 시안
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {Object.keys(METRIC_META).map((key) => (
                    <button
                      key={key}
                      onClick={() => setMapMetric(key)}
                      className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                        mapMetric === key
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {METRIC_META[key].label}
                    </button>
                  ))}
                </div>

                <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.08),_transparent_42%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] p-4">
                  <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                    <span>색상 농도: {METRIC_META[mapMetric].label}</span>
                    <span>원 크기: 종합 점수</span>
                  </div>

                  <svg viewBox="0 0 100 100" className="aspect-[0.82/1] w-full rounded-2xl">
                    <defs>
                      <linearGradient id="seaGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f8fafc" />
                        <stop offset="100%" stopColor="#e0f2fe" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="100" height="100" rx="8" fill="url(#seaGradient)" />
                    <path
                      d="M33 12 C40 7, 54 7, 62 14 C68 18, 71 26, 72 31 C76 35, 78 40, 78 45 C78 51, 74 57, 71 61 C69 64, 67 68, 69 74 C71 80, 68 86, 61 88 C55 90, 49 87, 45 82 C42 78, 37 74, 32 69 C28 64, 25 58, 24 52 C23 46, 24 41, 27 35 C27 28, 28 20, 33 12 Z"
                      fill="rgba(15,23,42,0.04)"
                      stroke="rgba(51,65,85,0.14)"
                      strokeWidth="1.2"
                    />
                    <circle
                      cx="20"
                      cy="86"
                      r="6.5"
                      fill="rgba(15,23,42,0.04)"
                      stroke="rgba(51,65,85,0.14)"
                      strokeWidth="1"
                    />
                    {ranking.map((region) => {
                      const point = getMapPoint(region);
                      const heatValue =
                        mapMetric === "overall"
                          ? region.finalScore
                          : region.metrics[mapMetric];
                      const radius = 2.6 + (region.finalScore / 100) * 4.2;
                      const isSelected = selectedRegion?.id === region.id;
                      return (
                        <g key={region.id}>
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r={isSelected ? radius + 2.2 : radius + 0.6}
                            fill="transparent"
                            stroke={isSelected ? "#0f172a" : "rgba(15,23,42,0.12)"}
                            strokeWidth={isSelected ? 1.4 : 0.6}
                          />
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r={radius}
                            fill={scoreColor(heatValue)}
                            fillOpacity={0.28 + heatValue / 170}
                            stroke={scoreColor(heatValue)}
                            strokeWidth="1"
                            className="cursor-pointer transition hover:opacity-90"
                            onClick={() => setSelectedRegionId(region.id)}
                          />
                          <text
                            x={point.x}
                            y={point.y - radius - 1.7}
                            textAnchor="middle"
                            className="fill-slate-700 text-[3px] font-semibold"
                          >
                            {region.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RadarIcon className="h-5 w-5 text-violet-600" />
                    <h2 className="text-lg font-bold">선택 지역 지표 분석</h2>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      selectedRegion ? scoreTone(selectedRegion.finalScore) : ""
                    }`}
                  >
                    {selectedRegion ? `${selectedRegion.finalScore}점` : "-"}
                  </span>
                </div>

                <div className="mb-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {selectedRegion?.name}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        인구 {selectedRegion ? formatNumber(selectedRegion.population) : "-"}명
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-slate-500">강점</div>
                      <div className="font-semibold text-slate-900">
                        {strongest ? METRIC_META[strongest.key].label : "-"}
                      </div>
                      <div className="mt-2 text-slate-500">보완</div>
                      <div className="font-semibold text-slate-900">
                        {weakest ? METRIC_META[weakest.key].label : "-"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#cbd5e1" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#334155", fontSize: 12 }}
                      />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar dataKey="value" stroke="#0f172a" fill="#14b8a6" fillOpacity={0.35} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  {KPI_ORDER.map((key) => (
                    <div key={key} className="rounded-2xl border border-slate-200 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {METRIC_META[key].label}
                      </div>
                      <div className="mt-1 text-xl font-bold text-slate-900">
                        {selectedRegion?.metrics[key]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold">랭킹 분포</h2>
                  <button
                    onClick={applyRanking}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    재계산
                  </button>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#475569", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "#475569", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip cursor={{ fill: "rgba(15,23,42,0.04)" }} />
                      <Bar dataKey="score" radius={[10, 10, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={scoreColor(entry.score)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold">결과 공유</h2>
                  <Share2 className="h-5 w-5 text-slate-500" />
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  현재 선택 지역, 가중치, 히트맵 기준을 해시 URL로 생성하는 선택 기능입니다.
                  카카오톡/메신저 연동은 추후 SDK 연결로 확장 가능합니다.
                </div>
                <button
                  onClick={shareResult}
                  className="mt-4 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md"
                >
                  결과 링크 생성/공유
                </button>
                <div className="mt-3 text-xs text-slate-500">
                  {shareState ||
                    "현재 프로토타입은 Web Share API 또는 클립보드 복사 방식으로 동작합니다."}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">지역별 세부 인프라 요약</h2>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                  원천 데이터 기반 요약
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-3 flex items-center gap-2 text-slate-600">
                    <TrainFront className="h-4 w-4" />
                    <span className="text-sm font-semibold">교통 접근성</span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between"><span>버스정류장</span><strong>{formatNumber(selectedRegion?.details.busStops || 0)}개</strong></div>
                    <div className="flex justify-between"><span>철도역</span><strong>{formatNumber(selectedRegion?.details.railStations || 0)}개</strong></div>
                    <div className="flex justify-between"><span>고속철역</span><strong>{formatNumber(selectedRegion?.details.highspeedStations || 0)}개</strong></div>
                    <div className="flex justify-between"><span>접근성 지표</span><strong>{selectedRegion?.details.transportAccessibility}</strong></div>
                    <div className="flex justify-between"><span>평균 5G</span><strong>{selectedRegion?.details.fivegMbps} Mbps</strong></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-3 flex items-center gap-2 text-slate-600">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm font-semibold">문화 · 체류 인프라</span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between"><span>문화시설</span><strong>{formatNumber(selectedRegion?.details.cultureFacilities || 0)}개</strong></div>
                    <div className="flex justify-between"><span>관광숙박시설</span><strong>{formatNumber(selectedRegion?.details.tourismAccommodations || 0)}개</strong></div>
                    <div className="flex justify-between"><span>공공 와이파이</span><strong>{formatNumber(selectedRegion?.details.wifiCount || 0)}개</strong></div>
                    <div className="flex justify-between"><span>공원 수</span><strong>{formatNumber(selectedRegion?.details.parks || 0)}개</strong></div>
                    <div className="flex justify-between"><span>공원 면적</span><strong>{formatArea(selectedRegion?.details.parkAreaSqm || 0)}</strong></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-3 flex items-center gap-2 text-slate-600">
                    <Hospital className="h-4 w-4" />
                    <span className="text-sm font-semibold">생활편의 · 의료</span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between"><span>병원 수</span><strong>{formatNumber(selectedRegion?.details.hospitals || 0)}개</strong></div>
                    <div className="flex justify-between"><span>약국 수</span><strong>{formatNumber(selectedRegion?.details.pharmacies || 0)}개</strong></div>
                    <div className="flex justify-between"><span>의사 수</span><strong>{formatNumber(selectedRegion?.details.doctors || 0)}명</strong></div>
                    <div className="flex justify-between"><span>사업체 수</span><strong>{formatNumber(selectedRegion?.details.businesses || 0)}개</strong></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-3 flex items-center gap-2 text-slate-600">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-sm font-semibold">안전 · 자연</span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between"><span>PM10 평균</span><strong>{selectedRegion?.details.pm10Avg} ㎍/㎥</strong></div>
                    <div className="flex justify-between"><span>CO 평균</span><strong>{selectedRegion?.details.coAvg} ppm</strong></div>
                    <div className="flex justify-between"><span>연평균 기온</span><strong>{selectedRegion?.details.annualTempAvg}℃</strong></div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedRegion &&
                      Object.entries(selectedRegion.details.safetyGrades).map(([label, grade]) => (
                        <span
                          key={label}
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${gradeTone(
                            grade
                          )}`}
                        >
                          {label} · {gradeLabel(grade)}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-slate-200 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <h2 className="text-lg font-bold text-white">구현 메모</h2>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                    <li>• 요구사항의 5대 슬라이더, 세대별 프리셋, Top 10 랭킹, 방사형 차트, 지도형 히트맵 UI, 상세정보 패널, 공유 기능을 모두 한 화면 흐름으로 배치했습니다.</li>
                    <li>• 점수는 첨부 데이터의 시도 단위 집계값을 사용한 프로토타입용 정규화 결과이며, 실제 서비스에서는 백엔드 API와 DB 정규화 파이프라인으로 대체하면 됩니다.</li>
                    </ul>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="font-semibold text-white">확장 포인트</div>
                  <div className="mt-2 space-y-1">
                    <div>• 결과 저장 및 비교</div>
                    <div>• 시군구 단위 Drill-down</div>
                    <div>• 실시간 날씨/대기질 API</div>
                    <div>• 카카오 공유 SDK</div>
                    <div>• 지도 API 기반 마커/오버레이</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
