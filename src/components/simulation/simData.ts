/**
 * Simulation data models for 50-year implant survivorship analysis.
 * All functions take (years, implantType) and return panel-specific data.
 */

export type ImplantType = "bcr" | "cr";

/* ── Cyclic Stress ──────────────────────────────────────── */

export function getCyclicStress(years: number, implant: ImplantType) {
  const cycles = years * 1_000_000; // ~1M gait cycles/year

  // Von Mises stress on tibial bridge (BCR) vs tibial tray (CR)
  const peakStress = implant === "bcr" ? 42 + Math.sin(years * 0.3) * 3 : 21 + Math.sin(years * 0.2) * 2;
  const fatigueLimit = 55; // MPa, UHMWPE/bone fatigue limit
  const safetyFactor = implant === "bcr"
    ? Math.max(1.2, 2.8 - years * 0.025)
    : Math.max(2.5, 5.2 - years * 0.012);

  // 8x6 heatmap: stress distribution on tibial plateau
  // BCR: hot spot on bridge between ACL footprint and tibial cut
  // CR: uniform moderate stress
  const heatmap: number[][] = [];
  for (let row = 0; row < 6; row++) {
    const rowData: number[] = [];
    for (let col = 0; col < 8; col++) {
      if (implant === "bcr") {
        // Bridge region: rows 2-3, cols 3-5 (central anterior)
        const distToBridge = Math.sqrt(
          Math.pow((col - 4) / 2, 2) + Math.pow((row - 2.5) / 1.5, 2)
        );
        const base = 0.3 + 0.7 * Math.max(0, 1 - distToBridge * 0.6);
        const fatigue = base * (1 + years * 0.005);
        rowData.push(Math.min(1, fatigue));
      } else {
        // CR: fairly uniform, slight medial loading
        const medialBias = 1 - col * 0.04;
        rowData.push(0.25 + medialBias * 0.15 + years * 0.002);
      }
    }
    heatmap.push(rowData);
  }

  return {
    peakStress: Math.round(peakStress * 10) / 10,
    fatigueLimit,
    safetyFactor: Math.round(safetyFactor * 100) / 100,
    cycles,
    heatmap,
    damageFraction: implant === "bcr"
      ? Math.min(0.95, years * 0.014)
      : Math.min(0.5, years * 0.005),
  };
}

/* ── HXLPE Wear ─────────────────────────────────────────── */

export function getWearData(years: number, implant: ImplantType) {
  // Bedding-in phase (0-2 yr): higher wear rate
  // Steady-state (2+ yr): linear wear
  const beddingRate = implant === "bcr" ? 14 : 18; // mm³/yr
  const steadyRate = implant === "bcr" ? 5.5 : 7.8;  // mm³/yr

  const cumulativeWear = years <= 2
    ? beddingRate * years
    : beddingRate * 2 + steadyRate * (years - 2);

  // Linear penetration
  const linearPen = implant === "bcr"
    ? 0.015 + years * 0.0028
    : 0.015 + years * 0.0038;
  const penThreshold = 0.30; // mm — clinical concern

  // Generate curve points for chart
  const curvePoints: { year: number; wear: number }[] = [];
  for (let y = 0; y <= 50; y += 1) {
    const w = y <= 2
      ? beddingRate * y
      : beddingRate * 2 + steadyRate * (y - 2);
    curvePoints.push({ year: y, wear: Math.round(w * 10) / 10 });
  }

  // Current wear rate
  const currentRate = years <= 2 ? beddingRate : steadyRate;

  return {
    cumulativeWear: Math.round(cumulativeWear * 10) / 10,
    currentRate,
    linearPenetration: Math.round(linearPen * 1000) / 1000,
    penThreshold,
    curvePoints,
    wearDebris: Math.round(cumulativeWear * 0.15 * 100) / 100, // billion particles estimate
  };
}

/* ── Fracture Risk (Tibial Island) ──────────────────────── */

export function getFractureRisk(years: number, implant: ImplantType) {
  if (implant === "cr") {
    return {
      applicable: false,
      risk: 0,
      riskZone: "none" as const,
      islandWidth: 0,
      peakMoment: 0,
      boneDensity: -1.2,
      curvePoints: [] as { year: number; risk: number }[],
    };
  }

  // BCR tibial island fracture risk
  // Starts very low, increases slowly with fatigue
  const baseRisk = 0.4;
  const risk = baseRisk + years * 0.058 + Math.pow(years / 50, 1.5) * 1.2;
  const riskZone = risk < 2 ? "low" as const : risk < 5 ? "moderate" as const : "high" as const;

  const curvePoints: { year: number; risk: number }[] = [];
  for (let y = 0; y <= 50; y += 1) {
    const r = baseRisk + y * 0.058 + Math.pow(y / 50, 1.5) * 1.2;
    curvePoints.push({ year: y, risk: Math.round(r * 100) / 100 });
  }

  return {
    applicable: true,
    risk: Math.round(risk * 100) / 100,
    riskZone,
    islandWidth: 12.4,  // mm
    peakMoment: 18.4,   // Nm
    boneDensity: -1.2,   // T-score
    curvePoints,
  };
}

/* ── Bone Ingrowth ──────────────────────────────────────── */

export function getBoneIngrowth(years: number, implant: ImplantType) {
  const months = years * 12;

  // Ingrowth follows exponential saturation: rapid early, plateau
  const rate = implant === "bcr" ? 4.0 : 4.5; // months to 63%
  const maxIngrowth = implant === "bcr" ? 96 : 93;
  const ingrowth = maxIngrowth * (1 - Math.exp(-months / rate));

  // Fixation strength (shear, MPa)
  const maxStrength = implant === "bcr" ? 19.5 : 17.2;
  const fixationStrength = maxStrength * (1 - Math.exp(-months / 6));

  // Regional breakdown (steady-state percentages, scaled by ingrowth)
  const scale = ingrowth / maxIngrowth;
  const regions = {
    femoralAnterior: Math.round(92 * scale),
    femoralPosterior: Math.round(97 * scale),
    tibialMedial: Math.round(95 * scale),
    tibialLateral: Math.round((implant === "bcr" ? 93 : 89) * scale),
  };

  // Curve points
  const curvePoints: { year: number; ingrowth: number }[] = [];
  for (let y = 0; y <= 5; y += 0.25) {
    const m = y * 12;
    const ig = maxIngrowth * (1 - Math.exp(-m / rate));
    curvePoints.push({ year: y, ingrowth: Math.round(ig * 10) / 10 });
  }
  // Add longer timepoints
  for (let y = 6; y <= 50; y += 2) {
    const m = y * 12;
    const ig = maxIngrowth * (1 - Math.exp(-m / rate));
    curvePoints.push({ year: y, ingrowth: Math.round(ig * 10) / 10 });
  }

  return {
    ingrowth: Math.round(ingrowth * 10) / 10,
    maxIngrowth,
    fixationStrength: Math.round(fixationStrength * 10) / 10,
    maxStrength,
    regions,
    curvePoints,
  };
}

/* ── Aseptic Loosening ──────────────────────────────────── */

export function getLooseningData(years: number, implant: ImplantType) {
  const months = years * 12;

  // Micromotion: high initially (press-fit settling), drops as ingrowth stabilizes
  const initialMicro = implant === "bcr" ? 82 : 98;
  const steadyMicro = implant === "bcr" ? 22 : 38;
  const micromotion = months < 1
    ? initialMicro
    : steadyMicro + (initialMicro - steadyMicro) * Math.exp(-months / 4);
  const microThreshold = 150; // μm

  // Stress shielding index (% of periprosthetic bone under physiologic stress)
  const stressShielding = implant === "bcr" ? 83 : 71;

  // Loosening probability (cumulative)
  const looseningRisk = implant === "bcr"
    ? 0.15 + years * 0.038 + Math.pow(years / 50, 2) * 0.8
    : 0.25 + years * 0.058 + Math.pow(years / 50, 2) * 1.5;

  // Micromotion curve (first 3 years detailed, then sparse)
  const microCurve: { months: number; micro: number }[] = [];
  for (let m = 0; m <= 36; m += 1) {
    const mm = m < 1 ? initialMicro : steadyMicro + (initialMicro - steadyMicro) * Math.exp(-m / 4);
    microCurve.push({ months: m, micro: Math.round(mm * 10) / 10 });
  }

  // Loosening risk curve
  const riskCurve: { year: number; risk: number }[] = [];
  for (let y = 0; y <= 50; y += 1) {
    const r = implant === "bcr"
      ? 0.15 + y * 0.038 + Math.pow(y / 50, 2) * 0.8
      : 0.25 + y * 0.058 + Math.pow(y / 50, 2) * 1.5;
    riskCurve.push({ year: y, risk: Math.round(r * 100) / 100 });
  }

  // Bone density zones (Gruen zones equivalent)
  const boneRetention = implant === "bcr"
    ? { zone1: 94, zone2: 97, zone3: 96, zone4: 91, zone5: 98, zone6: 95, zone7: 93 }
    : { zone1: 86, zone2: 92, zone3: 94, zone4: 82, zone5: 95, zone6: 89, zone7: 84 };

  return {
    micromotion: Math.round(micromotion * 10) / 10,
    microThreshold,
    stressShielding,
    looseningRisk: Math.round(looseningRisk * 100) / 100,
    microCurve,
    riskCurve,
    boneRetention,
  };
}
