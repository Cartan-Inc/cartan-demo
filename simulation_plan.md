# 50-Year Simulation Panel — Implementation Plan

## Current State
Each panel shows: icon, label, description, and generic animated bars. No meaningful data.

## Goal
Each of the 5 panels shows realistic, time-dependent simulation data that responds to the year slider and BCR/CR toggle. Data should be illustrative of real FEA/simulation output.

---

## Panel 1: Cyclic Stress
**What it represents:** Von Mises stress distribution on the tibial bridge (the bone island between the ACL footprint and the tibial cut). This is a key BCR failure mode — if the bridge is too thin or too stressed, it fractures.

**Visualization:**
- **Heatmap grid** (8×6) representing the tibial plateau surface, color-coded by stress level (green→yellow→orange→red)
- Stress accumulates over time (cyclic loading ~1M cycles/year from walking)
- **Key metric:** Peak stress (MPa) and fatigue safety factor
- **BCR vs CR:** BCR shows stress concentration on the tibial bridge; CR shows uniform low stress (no bridge)
- **Time dependence:** Stress stays roughly constant but fatigue damage accumulates — safety factor decreases over time

**Data model:**
```
peakStress(BCR) = 45 + noise      (MPa, near fatigue limit)
peakStress(CR) = 22 + noise       (MPa, well below limit)
safetyFactor(t) = 2.8 - t*0.02    (BCR: starts 2.8, drops to 1.8 at 50yr)
safetyFactor(t) = 5.2 - t*0.01    (CR: starts 5.2, stays >4)
cycles = t * 1,000,000
```

---

## Panel 2: HXLPE Wear
**What it represents:** Volumetric wear of the highly cross-linked polyethylene (HXLPE) tibial insert over time. Measured in mm³ per year, total volume loss, and maximum linear penetration depth.

**Visualization:**
- **Line chart** showing cumulative volumetric wear (mm³) over time
- **Wear rate** annotation (mm³/year) — starts higher (bedding-in), then stabilizes
- **Linear penetration** gauge (mm) — shown as a fill bar against a threshold
- **BCR vs CR:** BCR has slightly better wear due to more physiologic kinematics (less paradoxical anterior slide); CR has ~15-20% more wear
- Cross-hatching pattern on a simplified insert shape showing worn zone

**Data model:**
```
wearRate(BCR) = 12 mm³/yr (first 2yr), then 6 mm³/yr (steady state)
wearRate(CR) = 15 mm³/yr (first 2yr), then 8 mm³/yr (steady state)
cumulativeWear(t) = bedding_in + steady * (t - 2)
linearPenetration(t) = 0.02 + t * 0.003  (mm, BCR)
linearPenetration(t) = 0.02 + t * 0.004  (mm, CR)
threshold = 0.3 mm (clinical concern)
```

---

## Panel 3: Fracture Risk (Tibial Island)
**What it represents:** Probability of tibial island fracture over time. This is BCR-specific — the preserved tibial eminence/island where the ACL attaches can fracture if undersized or overloaded. Not applicable to CR.

**Visualization:**
- **Risk curve** — cumulative probability of fracture (%) over time
- **Risk zone bands:** Green (<2%), Yellow (2-5%), Red (>5%)
- Key parameters shown: island width (mm), bone mineral density, peak moment (Nm)
- **BCR vs CR:** BCR shows real risk curve; CR shows "N/A — No tibial island"
- **Time dependence:** Risk increases slowly due to stress fatigue + potential bone remodeling

**Data model:**
```
fracRisk(BCR, t) = 0.5% + t * 0.06%   (starts 0.5%, reaches ~3.5% at 50yr)
islandWidth = 12mm (from surgeon parameter)
boneDensity = T-score -1.2
peakMoment = 18.4 Nm
```

---

## Panel 4: Bone Ingrowth
**What it represents:** Osseointegration progress — how well bone grows into the porous implant surface over time. Measured as percentage of implant surface with mature bone contact.

**Visualization:**
- **Ingrowth curve** — percentage coverage over time (rapid early, plateau)
- **Regional breakdown** as stacked bars: femoral (anterior/posterior), tibial (medial/lateral)
- **Fixation strength** gauge (MPa shear strength)
- **BCR vs CR:** Similar trajectories, BCR slightly better (more physiologic loading patterns stimulate ingrowth)
- **Time dependence:** Rapid first 6 months, 80% by 1 year, 95%+ by 3 years, plateau

**Data model:**
```
ingrowth(t_months) = 95 * (1 - exp(-t_months / 4))  (% coverage)
fixationStrength(t) = 18 * (1 - exp(-t_months / 6))  (MPa)
Regional: femoral ant 92%, femoral post 96%, tibial med 94%, tibial lat 91%
(Values at steady-state; scale by ingrowth curve for time dependence)
```

---

## Panel 5: Aseptic Loosening
**What it represents:** Risk of implant loosening due to mechanical failure of the bone-implant interface. Driven by micromotion, stress shielding, and particle-induced osteolysis.

**Visualization:**
- **Micromotion chart** — amplitude (μm) at the bone-implant interface over time
- **Threshold line** at 150μm (above = fibrous tissue, below = bone ingrowth)
- **Stress shielding index** — percentage of bone under physiologic stress (higher = better)
- **Loosening probability** — cumulative risk curve with confidence band
- **BCR vs CR:** BCR has lower loosening risk (more natural load transfer, less stress shielding)

**Data model:**
```
micromotion(BCR, early) = 80μm → stabilizes at 25μm by 6 months
micromotion(CR, early) = 95μm → stabilizes at 35μm by 6 months
stressShielding(BCR) = 82% (good)
stressShielding(CR) = 71% (moderate — more distal stress bypass)
looseningRisk(BCR, t) = 0.2% + t * 0.04%
looseningRisk(CR, t) = 0.3% + t * 0.06%
```

---

## Implementation Approach

Each panel gets a dedicated React component with:
1. **Time-responsive data** computed from the year slider
2. **BCR/CR comparison** where applicable
3. **Meaningful chart** (line chart, heatmap, gauge, or bar chart) — built with pure CSS/SVG, no chart library needed
4. **Key metrics** displayed as prominent numbers
5. **Clinical context** — threshold lines, risk zones, reference ranges

Panels should feel like actual simulation output — dense with data, technically credible, but still readable for non-engineers.

## Execution
- Build a `SimulationPanelData` module with the data models
- Build 5 panel visualization components
- Integrate into existing SimulationScene, replacing the placeholder
- All data reacts to `years` slider and `implantType` toggle
