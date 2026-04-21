
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { geoIdentity, geoPath } from "d3-geo";
import municipalityGeo from "./assets/korea-municipalities-simplified.json";
import provinceGeo from "./assets/korea-provinces-simplified.json";
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

const REGION_DATA = [
  {
    "id": "서울",
    "name": "서울",
    "lat": 37.5665,
    "lng": 126.978,
    "population": 9304400,
    "metrics": {
      "traffic": 11.8,
      "culture": 12.5,
      "convenience": 92.6,
      "safety": 66.7,
      "nature": 27.0
    },
    "details": {
      "busStops": 16980,
      "railStations": 8,
      "highspeedStations": 6,
      "transportAccessibility": 10.97,
      "fivegMbps": 1169.2,
      "cultureFacilities": 499,
      "tourismAccommodations": 572,
      "wifiCount": 17084,
      "hospitals": 19726,
      "pharmacies": 5851,
      "doctors": 46750,
      "businesses": 1177287,
      "parks": 1777,
      "parkAreaSqm": 46635017,
      "pm10Avg": 31.2,
      "coAvg": 0.41,
      "annualTempAvg": 14.1,
      "safetyGrades": {
        "교통사고": 1,
        "화재": 4,
        "범죄": 3,
        "생활안전": 2,
        "자살": 2,
        "감염병": 2
      }
    }
  },
  {
    "id": "부산",
    "name": "부산",
    "lat": 35.1796,
    "lng": 129.0756,
    "population": 3237227,
    "metrics": {
      "traffic": 18.7,
      "culture": 9.3,
      "convenience": 77.0,
      "safety": 33.3,
      "nature": 61.5
    },
    "details": {
      "busStops": 9975,
      "railStations": 9,
      "highspeedStations": 2,
      "transportAccessibility": 18.55,
      "fivegMbps": 1070.4,
      "cultureFacilities": 152,
      "tourismAccommodations": 382,
      "wifiCount": 2629,
      "hospitals": 5623,
      "pharmacies": 1732,
      "doctors": 12138,
      "businesses": 401008,
      "parks": 713,
      "parkAreaSqm": 31157198,
      "pm10Avg": 25.5,
      "coAvg": 0.32,
      "annualTempAvg": 16.0,
      "safetyGrades": {
        "교통사고": 3,
        "화재": 5,
        "범죄": 5,
        "생활안전": 1,
        "자살": 4,
        "감염병": 4
      }
    }
  },
  {
    "id": "대구",
    "name": "대구",
    "lat": 35.8714,
    "lng": 128.6014,
    "population": 2350042,
    "metrics": {
      "traffic": 22.7,
      "culture": 2.2,
      "convenience": 80.4,
      "safety": 37.5,
      "nature": 44.6
    },
    "details": {
      "busStops": 5993,
      "railStations": 15,
      "highspeedStations": 2,
      "transportAccessibility": 15.44,
      "fivegMbps": 1135.3,
      "cultureFacilities": 115,
      "tourismAccommodations": 42,
      "wifiCount": 787,
      "hospitals": 4225,
      "pharmacies": 1422,
      "doctors": 9030,
      "businesses": 285388,
      "parks": 656,
      "parkAreaSqm": 17728569,
      "pm10Avg": 27.5,
      "coAvg": 0.42,
      "annualTempAvg": 15.1,
      "safetyGrades": {
        "교통사고": 4,
        "화재": 3,
        "범죄": 3,
        "생활안전": 3,
        "자살": 3,
        "감염병": 5
      }
    }
  },
  {
    "id": "인천",
    "name": "인천",
    "lat": 37.4563,
    "lng": 126.7052,
    "population": 3055983,
    "metrics": {
      "traffic": 17.6,
      "culture": 6.4,
      "convenience": 55.2,
      "safety": 41.7,
      "nature": 44.0
    },
    "details": {
      "busStops": 9278,
      "railStations": 1,
      "highspeedStations": 1,
      "transportAccessibility": 18.22,
      "fivegMbps": 1185.6,
      "cultureFacilities": 132,
      "tourismAccommodations": 193,
      "wifiCount": 3545,
      "hospitals": 3894,
      "pharmacies": 1318,
      "doctors": 8331,
      "businesses": 322297,
      "parks": 814,
      "parkAreaSqm": 55539360,
      "pm10Avg": 33.0,
      "coAvg": 0.45,
      "annualTempAvg": 13.4,
      "safetyGrades": {
        "교통사고": 2,
        "화재": 2,
        "범죄": 2,
        "생활안전": 5,
        "자살": 5,
        "감염병": 4
      }
    }
  },
  {
    "id": "광주",
    "name": "광주",
    "lat": 35.1595,
    "lng": 126.8526,
    "population": 1387619,
    "metrics": {
      "traffic": 49.7,
      "culture": 11.2,
      "convenience": 77.0,
      "safety": 37.5,
      "nature": 71.6
    },
    "details": {
      "busStops": 4267,
      "railStations": 26,
      "highspeedStations": 8,
      "transportAccessibility": 18.86,
      "fivegMbps": 1102.6,
      "cultureFacilities": 92,
      "tourismAccommodations": 17,
      "wifiCount": 1871,
      "hospitals": 2331,
      "pharmacies": 740,
      "doctors": 5572,
      "businesses": 173424,
      "parks": 981,
      "parkAreaSqm": 24633967,
      "pm10Avg": 25.7,
      "coAvg": 0.41,
      "annualTempAvg": 15.2,
      "safetyGrades": {
        "교통사고": 4,
        "화재": 3,
        "범죄": 4,
        "생활안전": 4,
        "자살": 3,
        "감염병": 3
      }
    }
  },
  {
    "id": "대전",
    "name": "대전",
    "lat": 36.3504,
    "lng": 127.3845,
    "population": 1441779,
    "metrics": {
      "traffic": 24.1,
      "culture": 3.3,
      "convenience": 73.5,
      "safety": 58.3,
      "nature": 49.1
    },
    "details": {
      "busStops": 3245,
      "railStations": 13,
      "highspeedStations": 4,
      "transportAccessibility": 13.7,
      "fivegMbps": 987.0,
      "cultureFacilities": 65,
      "tourismAccommodations": 17,
      "wifiCount": 1404,
      "hospitals": 2373,
      "pharmacies": 797,
      "doctors": 5363,
      "businesses": 167782,
      "parks": 465,
      "parkAreaSqm": 11730709,
      "pm10Avg": 27.3,
      "coAvg": 0.37,
      "annualTempAvg": 14.4,
      "safetyGrades": {
        "교통사고": 2,
        "화재": 2,
        "범죄": 4,
        "생활안전": 2,
        "자살": 4,
        "감염병": 2
      }
    }
  },
  {
    "id": "울산",
    "name": "울산",
    "lat": 35.5384,
    "lng": 129.3114,
    "population": 1088672,
    "metrics": {
      "traffic": 33.9,
      "culture": 3.7,
      "convenience": 55.1,
      "safety": 58.3,
      "nature": 60.0
    },
    "details": {
      "busStops": 3960,
      "railStations": 12,
      "highspeedStations": 3,
      "transportAccessibility": 22.07,
      "fivegMbps": 972.3,
      "cultureFacilities": 52,
      "tourismAccommodations": 30,
      "wifiCount": 690,
      "hospitals": 1436,
      "pharmacies": 443,
      "doctors": 2786,
      "businesses": 116666,
      "parks": 470,
      "parkAreaSqm": 19189376,
      "pm10Avg": 29.3,
      "coAvg": 0.41,
      "annualTempAvg": 15.0,
      "safetyGrades": {
        "교통사고": 5,
        "화재": 1,
        "범죄": 2,
        "생활안전": 3,
        "자살": 2,
        "감염병": 3
      }
    }
  },
  {
    "id": "세종",
    "name": "세종",
    "lat": 36.48,
    "lng": 127.289,
    "population": 391072,
    "metrics": {
      "traffic": 57.6,
      "culture": 16.4,
      "convenience": 0.0,
      "safety": 66.7,
      "nature": 42.5
    },
    "details": {
      "busStops": 3194,
      "railStations": 4,
      "highspeedStations": 1,
      "transportAccessibility": 49.23,
      "fivegMbps": 986.6,
      "cultureFacilities": 30,
      "tourismAccommodations": 5,
      "wifiCount": 705,
      "hospitals": 0,
      "pharmacies": 0,
      "doctors": 0,
      "businesses": 34099,
      "parks": 199,
      "parkAreaSqm": 4902218,
      "pm10Avg": 30.0,
      "coAvg": 0.45,
      "annualTempAvg": 13.7,
      "safetyGrades": {
        "교통사고": 3,
        "화재": 4,
        "범죄": 1,
        "생활안전": 4,
        "자살": 1,
        "감염병": 1
      }
    }
  },
  {
    "id": "경기",
    "name": "경기",
    "lat": 37.2636,
    "lng": 127.0286,
    "population": 13745673,
    "metrics": {
      "traffic": 12.4,
      "culture": 5.7,
      "convenience": 58.8,
      "safety": 87.5,
      "nature": 30.7
    },
    "details": {
      "busStops": 38089,
      "railStations": 6,
      "highspeedStations": 1,
      "transportAccessibility": 16.64,
      "fivegMbps": 1050.5,
      "cultureFacilities": 658,
      "tourismAccommodations": 200,
      "wifiCount": 17905,
      "hospitals": 18106,
      "pharmacies": 6019,
      "doctors": 36916,
      "businesses": 1562116,
      "parks": 4736,
      "parkAreaSqm": 110961914,
      "pm10Avg": 32.5,
      "coAvg": 0.38,
      "annualTempAvg": 13.3,
      "safetyGrades": {
        "교통사고": 1,
        "화재": 1,
        "범죄": 4,
        "생활안전": 1,
        "자살": 1,
        "감염병": 1
      }
    }
  },
  {
    "id": "강원",
    "name": "강원",
    "lat": 37.8813,
    "lng": 127.7298,
    "population": 1506843,
    "metrics": {
      "traffic": 39.5,
      "culture": 61.6,
      "convenience": 68.5,
      "safety": 37.5,
      "nature": 67.7
    },
    "details": {
      "busStops": 8348,
      "railStations": 11,
      "highspeedStations": 4,
      "transportAccessibility": 33.4,
      "fivegMbps": 986.6,
      "cultureFacilities": 267,
      "tourismAccommodations": 265,
      "wifiCount": 4812,
      "hospitals": 1993,
      "pharmacies": 714,
      "doctors": 4063,
      "businesses": 209314,
      "parks": 692,
      "parkAreaSqm": 18812344,
      "pm10Avg": 25.2,
      "coAvg": 0.32,
      "annualTempAvg": 13.8,
      "safetyGrades": {
        "교통사고": 3,
        "화재": 3,
        "범죄": 3,
        "생활안전": 4,
        "자살": 4,
        "감염병": 4
      }
    }
  },
  {
    "id": "충북",
    "name": "충북",
    "lat": 36.6424,
    "lng": 127.489,
    "population": 1597976,
    "metrics": {
      "traffic": 51.3,
      "culture": 21.2,
      "convenience": 64.6,
      "safety": 58.3,
      "nature": 57.3
    },
    "details": {
      "busStops": 13054,
      "railStations": 12,
      "highspeedStations": 2,
      "transportAccessibility": 49.18,
      "fivegMbps": 969.3,
      "cultureFacilities": 152,
      "tourismAccommodations": 36,
      "wifiCount": 2457,
      "hospitals": 2209,
      "pharmacies": 743,
      "doctors": 3857,
      "businesses": 203356,
      "parks": 800,
      "parkAreaSqm": 23125031,
      "pm10Avg": 28.5,
      "coAvg": 0.39,
      "annualTempAvg": 14.8,
      "safetyGrades": {
        "교통사고": 3,
        "화재": 3,
        "범죄": 3,
        "생활안전": 3,
        "자살": 2,
        "감염병": 2
      }
    }
  },
  {
    "id": "충남",
    "name": "충남",
    "lat": 36.8151,
    "lng": 127.1139,
    "population": 2136826,
    "metrics": {
      "traffic": 59.1,
      "culture": 22.1,
      "convenience": 64.9,
      "safety": 45.8,
      "nature": 59.6
    },
    "details": {
      "busStops": 24342,
      "railStations": 11,
      "highspeedStations": 0,
      "transportAccessibility": 68.46,
      "fivegMbps": 794.9,
      "cultureFacilities": 212,
      "tourismAccommodations": 45,
      "wifiCount": 3150,
      "hospitals": 2877,
      "pharmacies": 1008,
      "doctors": 5157,
      "businesses": 276134,
      "parks": 1740,
      "parkAreaSqm": 44849443,
      "pm10Avg": 31.4,
      "coAvg": 0.39,
      "annualTempAvg": 13.4,
      "safetyGrades": {
        "교통사고": 4,
        "화재": 2,
        "범죄": 3,
        "생활안전": 4,
        "자살": 3,
        "감염병": 3
      }
    }
  },
  {
    "id": "전북",
    "name": "전북",
    "lat": 35.8242,
    "lng": 127.148,
    "population": 1720812,
    "metrics": {
      "traffic": 51.4,
      "culture": 28.2,
      "convenience": 81.6,
      "safety": 54.2,
      "nature": 77.1
    },
    "details": {
      "busStops": 13180,
      "railStations": 15,
      "highspeedStations": 5,
      "transportAccessibility": 46.15,
      "fivegMbps": 905.8,
      "cultureFacilities": 198,
      "tourismAccommodations": 92,
      "wifiCount": 2302,
      "hospitals": 2930,
      "pharmacies": 1004,
      "doctors": 5517,
      "businesses": 239757,
      "parks": 653,
      "parkAreaSqm": 38442796,
      "pm10Avg": 28.8,
      "coAvg": 0.32,
      "annualTempAvg": 14.5,
      "safetyGrades": {
        "교통사고": 3,
        "화재": 4,
        "범죄": 2,
        "생활안전": 2,
        "자살": 3,
        "감염병": 3
      }
    }
  },
  {
    "id": "전남",
    "name": "전남",
    "lat": 34.8161,
    "lng": 126.4629,
    "population": 1775126,
    "metrics": {
      "traffic": 55.2,
      "culture": 57.3,
      "convenience": 70.5,
      "safety": 29.2,
      "nature": 77.5
    },
    "details": {
      "busStops": 18483,
      "railStations": 6,
      "highspeedStations": 1,
      "transportAccessibility": 62.55,
      "fivegMbps": 905.1,
      "cultureFacilities": 251,
      "tourismAccommodations": 434,
      "wifiCount": 6712,
      "hospitals": 2627,
      "pharmacies": 847,
      "doctors": 4541,
      "businesses": 243020,
      "parks": 1035,
      "parkAreaSqm": 33154875,
      "pm10Avg": 25.7,
      "coAvg": 0.35,
      "annualTempAvg": 15.2,
      "safetyGrades": {
        "교통사고": 5,
        "화재": 5,
        "범죄": 1,
        "생활안전": 3,
        "자살": 4,
        "감염병": 5
      }
    }
  },
  {
    "id": "경북",
    "name": "경북",
    "lat": 36.576,
    "lng": 128.5056,
    "population": 2499357,
    "metrics": {
      "traffic": 85.2,
      "culture": 27.6,
      "convenience": 65.9,
      "safety": 41.7,
      "nature": 51.6
    },
    "details": {
      "busStops": 29735,
      "railStations": 37,
      "highspeedStations": 8,
      "transportAccessibility": 71.71,
      "fivegMbps": 986.1,
      "cultureFacilities": 241,
      "tourismAccommodations": 126,
      "wifiCount": 6508,
      "hospitals": 3420,
      "pharmacies": 1145,
      "doctors": 5573,
      "businesses": 336555,
      "parks": 1013,
      "parkAreaSqm": 23577068,
      "pm10Avg": 28.2,
      "coAvg": 0.34,
      "annualTempAvg": 14.5,
      "safetyGrades": {
        "교통사고": 4,
        "화재": 4,
        "범죄": 2,
        "생활안전": 3,
        "자살": 3,
        "감염병": 4
      }
    }
  },
  {
    "id": "경남",
    "name": "경남",
    "lat": 35.2279,
    "lng": 128.6811,
    "population": 3198787,
    "metrics": {
      "traffic": 39.6,
      "culture": 17.8,
      "convenience": 62.6,
      "safety": 58.3,
      "nature": 77.6
    },
    "details": {
      "busStops": 20642,
      "railStations": 17,
      "highspeedStations": 6,
      "transportAccessibility": 38.84,
      "fivegMbps": 949.6,
      "cultureFacilities": 244,
      "tourismAccommodations": 131,
      "wifiCount": 5839,
      "hospitals": 4268,
      "pharmacies": 1412,
      "doctors": 8382,
      "businesses": 399164,
      "parks": 1307,
      "parkAreaSqm": 44096052,
      "pm10Avg": 23.4,
      "coAvg": 0.32,
      "annualTempAvg": 14.7,
      "safetyGrades": {
        "교통사고": 2,
        "화재": 3,
        "범죄": 4,
        "생활안전": 2,
        "자살": 2,
        "감염병": 3
      }
    }
  },
  {
    "id": "제주",
    "name": "제주",
    "lat": 33.4996,
    "lng": 126.5312,
    "population": 663177,
    "metrics": {
      "traffic": 30.3,
      "culture": 100.0,
      "convenience": 77.9,
      "safety": 37.5,
      "nature": 75.1
    },
    "details": {
      "busStops": 4300,
      "railStations": 0,
      "highspeedStations": 0,
      "transportAccessibility": 38.9,
      "fivegMbps": 986.6,
      "cultureFacilities": 128,
      "tourismAccommodations": 409,
      "wifiCount": 3395,
      "hospitals": 1054,
      "pharmacies": 330,
      "doctors": 1807,
      "businesses": 99122,
      "parks": 271,
      "parkAreaSqm": 10896265,
      "pm10Avg": 26.1,
      "coAvg": 0.26,
      "annualTempAvg": 17.8,
      "safetyGrades": {
        "교통사고": 2,
        "화재": 2,
        "범죄": 5,
        "생활안전": 5,
        "자살": 5,
        "감염병": 2
      }
    }
  }
];

const PRESETS = {
  "2030": {
    "traffic": 28,
    "culture": 32,
    "convenience": 18,
    "safety": 10,
    "nature": 12
  },
  "4050": {
    "traffic": 20,
    "culture": 18,
    "convenience": 24,
    "safety": 18,
    "nature": 20
  },
  "60대+": {
    "traffic": 14,
    "culture": 10,
    "convenience": 28,
    "safety": 24,
    "nature": 24
  },
  "균형형": {
    "traffic": 20,
    "culture": 20,
    "convenience": 20,
    "safety": 20,
    "nature": 20
  }
};

const METRIC_META = {
  overall: { label: "종합 점수", color: "#0f766e" },
  traffic: { label: "교통", color: "#2563eb" },
  culture: { label: "문화", color: "#7c3aed" },
  convenience: { label: "생활편의", color: "#ea580c" },
  safety: { label: "안전", color: "#059669" },
  nature: { label: "자연", color: "#16a34a" },
};

const KPI_ORDER = ["traffic", "culture", "convenience", "safety", "nature"];

const SOURCE_TAGS = [
  "버스정류장 위치정보",
  "철도역 위치정보",
  "문화인프라 시도별 분석결과",
  "전국 관광숙박시설 현황",
  "무료 와이파이 정보",
  "병원정보서비스",
  "약국정보서비스",
  "지역안전지수 산출 결과",
  "전국도시공원정보",
  "대기오염도 PM10/CO",
  "기상청 월별 기온",
];

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

function getMetricValue(region, mapMetric) {
  return mapMetric === "overall" ? region.finalScore : region.metrics[mapMetric];
}

function getChoroplethColor(value) {
  const clamped = Math.max(0, Math.min(100, value));
  const lightness = 96 - clamped * 0.44;
  const saturation = 42 + clamped * 0.26;
  return `hsl(23 ${Math.min(84, saturation)}% ${Math.max(34, lightness)}%)`;
}

function KoreaMunicipalityMap({ ranking, mapMetric, selectedRegionId, onSelectRegion }) {
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  const rankingMap = useMemo(
    () => new Map(ranking.map((item) => [item.id, item])),
    [ranking]
  );

  const projection = useMemo(
    () => geoIdentity().reflectY(true).fitExtent([[18, 20], [622, 742]], municipalityGeo),
    []
  );

  const pathGenerator = useMemo(() => geoPath(projection), [projection]);

  const provinceLabels = useMemo(
    () =>
      provinceGeo.features
        .map((feature) => {
          const [[x0, y0], [x1, y1]] = pathGenerator.bounds(feature);
          if (![x0, y0, x1, y1].every(Number.isFinite)) return null;
          return {
            regionId: feature.properties.regionId,
            regionLabel: feature.properties.regionLabel,
            x: (x0 + x1) / 2,
            y: (y0 + y1) / 2,
          };
        })
        .filter(Boolean),
    [pathGenerator]
  );

  const selectedProvinceShape = useMemo(
    () =>
      provinceGeo.features.find(
        (feature) => feature.properties.regionId === selectedRegionId
      ),
    [selectedRegionId]
  );

  const topHighlights = useMemo(
    () =>
      [...ranking]
        .sort((a, b) => getMetricValue(b, mapMetric) - getMetricValue(a, mapMetric))
        .slice(0, 3),
    [ranking, mapMetric]
  );

  const selectedRegion = rankingMap.get(selectedRegionId);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[24px] border border-[#dccfbe] bg-[#f5f2ec] shadow-inner">
        <div className="flex items-center justify-between border-b border-[#e6dac8] px-4 py-3 text-xs text-[#8b5e3c]">
          <span className="font-semibold tracking-[0.18em] uppercase">GeoJSON Choropleth</span>
          <span>{METRIC_META[mapMetric].label} · 시군구 경계</span>
        </div>

        <svg viewBox="0 0 640 760" className="w-full bg-[#f7f3ed]">
          <rect x="0" y="0" width="640" height="760" fill="#f7f3ed" />

          {municipalityGeo.features.map((feature, index) => {
            const region = rankingMap.get(feature.properties.regionId);
            if (!region) return null;
            const value = getMetricValue(region, mapMetric);
            const isSelected = feature.properties.regionId === selectedRegionId;
            return (
              <path
                key={`${feature.properties.id}-${index}`}
                d={pathGenerator(feature)}
                fill={getChoroplethColor(value)}
                stroke={isSelected ? "rgba(111,47,24,0.62)" : "rgba(255,255,255,0.92)"}
                strokeWidth={isSelected ? 1.05 : 0.68}
                vectorEffect="non-scaling-stroke"
                className="cursor-pointer transition-opacity duration-150 hover:opacity-90"
                onMouseEnter={() =>
                  setHoveredDistrict({
                    district: feature.properties.title,
                    regionId: feature.properties.regionId,
                    regionLabel: feature.properties.regionLabel,
                    value,
                  })
                }
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => onSelectRegion(feature.properties.regionId)}
              />
            );
          })}

          {provinceGeo.features.map((feature) => (
            <path
              key={feature.properties.regionId}
              d={pathGenerator(feature)}
              fill="none"
              stroke="rgba(110,67,38,0.38)"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {selectedProvinceShape && (
            <path
              d={pathGenerator(selectedProvinceShape)}
              fill="none"
              stroke="#5f2f18"
              strokeWidth="2.7"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {provinceLabels.map((label) => (
            <g key={label.regionId} className="pointer-events-none">
              <rect
                x={label.x - 20}
                y={label.y - 10}
                width="40"
                height="18"
                rx="9"
                fill="rgba(255,255,255,0.72)"
              />
              <text
                x={label.x}
                y={label.y + 2}
                textAnchor="middle"
                className="fill-slate-700 text-[10px] font-semibold"
              >
                {label.regionId}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            <span>{METRIC_META[mapMetric].label} 낮음</span>
            <span>높음</span>
          </div>
          <div
            className="h-3 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${getChoroplethColor(4)} 0%, ${getChoroplethColor(28)} 25%, ${getChoroplethColor(52)} 50%, ${getChoroplethColor(76)} 75%, ${getChoroplethColor(100)} 100%)`,
            }}
          />
          <div className="mt-3 text-xs leading-5 text-slate-500">
            시군구 경계는 실제 GeoJSON 경계를 사용했고, 현재 색상 점수는 첨부 데이터 해상도에 맞춰
            상위 시도 점수를 동일하게 적용했습니다.
          </div>
          <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
            {hoveredDistrict ? (
              <>
                <div className="font-semibold text-slate-900">{hoveredDistrict.district}</div>
                <div className="mt-1">소속 권역: {hoveredDistrict.regionLabel}</div>
                <div className="mt-1">현재 표시 점수: {hoveredDistrict.value.toFixed(1)}점</div>
              </>
            ) : selectedRegion ? (
              <>
                <div className="font-semibold text-slate-900">{selectedRegion.name}</div>
                <div className="mt-1">선택된 권역의 시군구 경계를 강조하고 있습니다.</div>
                <div className="mt-1">현재 표시 점수: {getMetricValue(selectedRegion, mapMetric).toFixed(1)}점</div>
              </>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          {topHighlights.map((region, index) => (
            <button
              key={region.id}
              onClick={() => onSelectRegion(region.id)}
              className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                selectedRegionId === region.id
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
                {METRIC_META[mapMetric].label} {index + 1}위
              </div>
              <div className="mt-1 text-base font-bold">{region.name}</div>
              <div className="mt-1 text-sm">{getMetricValue(region, mapMetric).toFixed(1)}점</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
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

  useEffect(() => {
    if (!ranking.some((item) => item.id === selectedRegionId)) {
      setSelectedRegionId(ranking[0]?.id);
    }
  }, [ranking, selectedRegionId]);

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
                장기 체류관광 맞춤형 지역 추천 및 랭킹 서비스 · Prototype v1
              </div>
              <h1 className="text-2xl font-bold md:text-4xl">
                첨부 데이터를 반영한 장기 체류관광 추천 프론트
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 md:text-base">
                교통, 문화, 생활편의, 안전, 자연 5대 지표를 사용자가 직접 가중치로 조정하고,
                시도 단위 정규화 점수와 결합해 Top 10 지역을 도출하는 프로토타입입니다.
                지도 영역은 실제 대한민국 시군구 GeoJSON 경계를 붙여 진짜 지도 형태로 렌더링했습니다.
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
                    <h2 className="text-lg font-bold">대한민국 시군구 GeoJSON 지도</h2>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    실제 경계 데이터 반영
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

                <KoreaMunicipalityMap
                  ranking={ranking}
                  mapMetric={mapMetric}
                  selectedRegionId={selectedRegion?.id}
                  onSelectRegion={setSelectedRegionId}
                />
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
                    <li>• 지도는 SVG 기반 시안이므로 Kakao Maps 또는 Naver Maps SDK로 교체해도 상태/컴포넌트 구조는 그대로 재사용할 수 있습니다.</li>
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
