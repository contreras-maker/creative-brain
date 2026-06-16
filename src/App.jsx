import { useState } from "react";

const RACE_DATE = new Date("2026-08-30");
const TODAY = new Date("2026-06-15");

const phases = {
  BUILD: { label: "BUILD", color: "#1E6B8C" },
  SHARPEN: { label: "SHARPEN", color: "#1A5E3A" },
  PEAK: { label: "PEAK", color: "#8B1A1A" },
  TAPER: { label: "TAPER", color: "#5A3E85" },
  RACE: { label: "RACE DAY", color: "#F5A623" },
};

const sessionColors = {
  "Hill Intervals": "#F5A623",
  "Long Run": "#1E6B8C",
  "Long Run + MP": "#E84855",
  "Easy Run": "#3A4A5C",
  "Run Club": "#3A4A5C",
  "Race": "#F5A623",
};

const weeks = [
  {
    week: 1, label: "W1", dateRange: "Jun 16–22", phase: "BUILD",
    totalKm: 38, elevationFocus: "Introduce hills",
    sessions: [
      { day: "TUE", date: "Jun 17", type: "Hill Intervals", name: "6 × Hill Intervals", key: false,
        steps: [
          { name: "Warm Up", detail: "15 min easy jog to your hill", pace: "6:10–6:20 /km" },
          { name: "6 × Hill Rep", detail: "~400m hard uphill, 90s jog recovery down", pace: "4:40–4:45 effort" },
          { name: "Cool Down", detail: "10 min flat easy jog", pace: "6:20 /km" },
        ],
        coachNote: "Judge the hill effort by feel — GPS pace means nothing going uphill. Hard but controlled breathing.", },
      { day: "THU", date: "Jun 19", type: "Easy Run", name: "Easy 6km", key: false,
        steps: [{ name: "Easy Run", detail: "6km flat or gently undulating", pace: "6:10–6:20 /km" }],
        coachNote: "HR must stay under 145. If it climbs, walk.", },
      { day: "FRI", date: "Jun 20", type: "Run Club", name: "Run Club 5km", key: false,
        steps: [{ name: "Easy Run", detail: "5km with run club — social pace", pace: "6:00–6:20 /km" }],
        coachNote: "This is recovery running, not training. Enjoy it.", },
      { day: "SUN", date: "Jun 22", type: "Long Run", name: "Long Run 20km", key: false,
        steps: [{ name: "Long Run", detail: "20km — build elevation into your route", pace: "6:05–6:15 /km" }],
        coachNote: "If you finish thinking 'that was easy' — you ran it right. Don't push the last km.", },
    ],
  },
  {
    week: 2, label: "W2", dateRange: "Jun 23–29", phase: "BUILD",
    totalKm: 40, elevationFocus: "Extend interval volume",
    sessions: [
      { day: "TUE", date: "Jun 24", type: "Hill Intervals", name: "5 × Longer Hill Intervals", key: false,
        steps: [
          { name: "Warm Up", detail: "15 min easy jog", pace: "6:10 /km" },
          { name: "5 × Hill Rep", detail: "~500m hard uphill (slightly longer than W1), 2min jog recovery", pace: "4:45 effort" },
          { name: "Cool Down", detail: "10 min flat easy", pace: "6:20 /km" },
        ],
        coachNote: "5 longer reps instead of 6 shorter — same load, more specific strength.", },
      { day: "THU", date: "Jun 26", type: "Easy Run", name: "Easy 7km", key: false,
        steps: [{ name: "Easy Run", detail: "7km easy", pace: "6:10 /km" }],
        coachNote: "HR under 145.", },
      { day: "FRI", date: "Jun 27", type: "Run Club", name: "Run Club 5km", key: false,
        steps: [{ name: "Easy Run", detail: "5km run club", pace: "6:00–6:20 /km" }],
        coachNote: "Social pace.", },
      { day: "SUN", date: "Jun 29", type: "Long Run", name: "Long Run 22km", key: false,
        steps: [{ name: "Long Run", detail: "22km — undulating route, 120–150m elevation", pace: "6:05 /km" }],
        coachNote: "Eat a gel at km 14. Start practising race nutrition now.", },
    ],
  },
  {
    week: 3, label: "W3", dateRange: "Jun 30–Jul 6", phase: "BUILD",
    totalKm: 43, elevationFocus: "First MP finish",
    sessions: [
      { day: "TUE", date: "Jul 1", type: "Hill Intervals", name: "6 × Hills + Strides", key: false,
        steps: [
          { name: "Warm Up", detail: "15 min easy jog", pace: "6:10 /km" },
          { name: "6 × Strides", detail: "20 sec fast but relaxed on flat, 40 sec walk between", pace: "Relaxed fast" },
          { name: "6 × Hill Rep", detail: "~400m hard uphill, 90s jog recovery", pace: "4:38–4:42 effort" },
          { name: "Cool Down", detail: "10 min easy", pace: "6:20 /km" },
        ],
        coachNote: "Strides prime your neuromuscular system before the hill reps. Don't skip them.", },
      { day: "THU", date: "Jul 3", type: "Easy Run", name: "Easy 7km + Strides", key: false,
        steps: [
          { name: "Easy Run", detail: "7km easy", pace: "6:10 /km" },
          { name: "6 × Strides", detail: "20 sec fast, 40 sec walk", pace: "Relaxed fast" },
        ],
        coachNote: "Strides sharpen leg turnover without adding fatigue.", },
      { day: "FRI", date: "Jul 4", type: "Run Club", name: "Run Club 5km", key: false,
        steps: [{ name: "Easy Run", detail: "5km run club", pace: "6:00–6:20 /km" }],
        coachNote: "Easy.", },
      { day: "SUN", date: "Jul 6", type: "Long Run + MP", name: "24km with MP Finish ⚡", key: true,
        steps: [
          { name: "Easy Long Run", detail: "20km — 150m+ elevation gain", pace: "6:05–6:10 /km" },
          { name: "MP Finish", detail: "Last 4km at race pace on tired legs", pace: "5:20 /km" },
        ],
        coachNote: "KEY SESSION. If you can hold 5:20 for the last 4km after 20km easy, you're on track for 3:45. If you can't — your easy section was too fast.", },
    ],
  },
  {
    week: 4, label: "W4", dateRange: "Jul 7–13", phase: "BUILD",
    totalKm: 30, elevationFocus: "Recovery — absorb W1–3",
    recovery: true,
    sessions: [
      { day: "TUE", date: "Jul 8", type: "Hill Intervals", name: "4 × Hills (Reduced)", key: false,
        steps: [
          { name: "Warm Up", detail: "10 min easy", pace: "6:10 /km" },
          { name: "4 × Hill Rep", detail: "~400m, 2min jog recovery — 2 fewer reps than W3", pace: "4:45 effort" },
          { name: "Cool Down", detail: "10 min easy", pace: "6:20 /km" },
        ],
        coachNote: "Recovery week. If your legs still feel heavy, take Thursday off entirely.", },
      { day: "THU", date: "Jul 10", type: "Easy Run", name: "Easy 6km", key: false,
        steps: [{ name: "Easy Run", detail: "6km easy — skip if tired", pace: "6:15 /km" }],
        coachNote: "Most skippable session of the plan.", },
      { day: "FRI", date: "Jul 11", type: "Run Club", name: "Run Club 5km", key: false,
        steps: [{ name: "Easy Run", detail: "5km run club", pace: "6:20 /km" }],
        coachNote: "Slower than usual.", },
      { day: "SUN", date: "Jul 13", type: "Long Run", name: "Easy Long Run 18km", key: false,
        steps: [{ name: "Long Run", detail: "18km — gentle hills only, no MP finish", pace: "6:15–6:20 /km" }],
        coachNote: "Finish feeling like you could have done 5 more km. That feeling = recovery working.", },
    ],
  },
  {
    week: 5, label: "W5", dateRange: "Jul 14–20", phase: "SHARPEN",
    totalKm: 46, elevationFocus: "Race-specific hills",
    sessions: [
      { day: "TUE", date: "Jul 15", type: "Hill Intervals", name: "3 × 2km Tempo Hills", key: false,
        steps: [
          { name: "Warm Up", detail: "15 min easy", pace: "6:10 /km" },
          { name: "3 × 2km Tempo", detail: "2km at tempo effort on hill route, 2min recovery", pace: "5:00 /km effort" },
          { name: "Cool Down", detail: "10 min easy", pace: "6:20 /km" },
        ],
        coachNote: "Longer tempo reps replace short hill sprints — building lactate threshold on gradient.", },
      { day: "THU", date: "Jul 17", type: "Easy Run", name: "Easy 8km", key: false,
        steps: [{ name: "Easy Run", detail: "8km easy", pace: "6:10 /km" }],
        coachNote: "HR under 145.", },
      { day: "FRI", date: "Jul 18", type: "Run Club", name: "Run Club 5km", key: false,
        steps: [{ name: "Easy Run", detail: "5km run club", pace: "6:00–6:20 /km" }], coachNote: "", },
      { day: "SUN", date: "Jul 20", type: "Long Run + MP", name: "26km with 6km MP Finish ⚡", key: true,
        steps: [
          { name: "Easy Long Run", detail: "20km — hilly route, 150m+ gain", pace: "6:05 /km" },
          { name: "MP Finish", detail: "Last 6km at race pace", pace: "5:20 /km" },
        ],
        coachNote: "2km more MP than W3. This is where fitness is being built.", },
    ],
  },
  {
    week: 6, label: "W6", dateRange: "Jul 21–27", phase: "SHARPEN",
    totalKm: 49, elevationFocus: "First 10km MP test",
    sessions: [
      { day: "TUE", date: "Jul 22", type: "Hill Intervals", name: "6 × 1km Hill Intervals", key: false,
        steps: [
          { name: "Warm Up", detail: "15 min easy", pace: "6:10 /km" },
          { name: "6 × 1km", detail: "1km hard on hill, 90s jog recovery", pace: "4:42 /km effort" },
          { name: "Cool Down", detail: "10 min easy", pace: "6:20 /km" },
        ],
        coachNote: "Back to shorter, faster reps — sharper neuromuscular stimulus.", },
      { day: "THU", date: "Jul 24", type: "Easy Run", name: "Easy 8km + Strides", key: false,
        steps: [
          { name: "Easy Run", detail: "8km easy", pace: "6:10 /km" },
          { name: "Strides", detail: "6 × 20 sec", pace: "Relaxed fast" },
        ], coachNote: "", },
      { day: "FRI", date: "Jul 25", type: "Run Club", name: "Run Club 5km", key: false,
        steps: [{ name: "Easy Run", detail: "5km run club", pace: "6:00–6:20 /km" }], coachNote: "", },
      { day: "SUN", date: "Jul 27", type: "Long Run + MP", name: "28km with 8km MP Finish ⚡", key: true,
        steps: [
          { name: "Easy Long Run", detail: "20km — hilly route", pace: "6:00 /km" },
          { name: "MP Finish", detail: "Last 8km at race pace — your first real MP test", pace: "5:20 /km" },
        ],
        coachNote: "KEY SESSION. 8km at 5:20 after 20km is exactly what Sydney feels like at km 30. If this goes well, 3:45 is real.", },
    ],
  },
  {
    week: 7, label: "W7", dateRange: "Jul 28–Aug 3", phase: "SHARPEN",
    totalKm: 51, elevationFocus: "Simulate race terrain",
    sessions: [
      { day: "TUE", date: "Jul 29", type: "Hill Intervals", name: "2 × 3km Tempo Hills", key: false,
        steps: [
          { name: "Warm Up", detail: "15 min easy", pace: "6:10 /km" },
          { name: "2 × 3km Tempo", detail: "3km at tempo on hill route, 3min recovery", pace: "5:00 /km effort" },
          { name: "Cool Down", detail: "10 min easy", pace: "6:20 /km" },
        ],
        coachNote: "Longest tempo reps of the plan. If you can't hold 5:00, slow to 5:05 — don't blow up.", },
      { day: "THU", date: "Jul 31", type: "Easy Run", name: "Easy 8km", key: false,
        steps: [{ name: "Easy Run", detail: "8km easy", pace: "6:10 /km" }], coachNote: "", },
      { day: "FRI", date: "Aug 1", type: "Run Club", name: "Run Club 5km", key: false,
        steps: [{ name: "Easy Run", detail: "5km run club", pace: "6:00–6:20 /km" }], coachNote: "", },
      { day: "SUN", date: "Aug 3", type: "Long Run", name: "Long Run 30km", key: true,
        steps: [{ name: "Long Run", detail: "30km — hilly route, 180m+ elevation gain, controlled", pace: "6:05–6:10 /km" }],
        coachNote: "No MP finish — just complete this controlled. A 30km at 6:05 is excellent stimulus. No heroics.", },
    ],
  },
  {
    week: 8, label: "W8", dateRange: "Aug 4–10", phase: "SHARPEN",
    totalKm: 31, elevationFocus: "Recovery — absorb W5–7",
    recovery: true,
    sessions: [
      { day: "TUE", date: "Aug 5", type: "Hill Intervals", name: "4 × 1km Hills (Reduced)", key: false,
        steps: [
          { name: "Warm Up", detail: "10 min easy", pace: "6:10 /km" },
          { name: "4 × 1km", detail: "1km hard uphill, 2min recovery — 2 fewer than W6", pace: "4:45 effort" },
          { name: "Cool Down", detail: "10 min easy", pace: "6:20 /km" },
        ], coachNote: "Recovery week. Run these at W6 effort but don't chase the split.", },
      { day: "THU", date: "Aug 7", type: "Easy Run", name: "Easy 6km", key: false,
        steps: [{ name: "Easy Run", detail: "6km easy", pace: "6:15 /km" }], coachNote: "", },
      { day: "FRI", date: "Aug 8", type: "Run Club", name: "Run Club 5km", key: false,
        steps: [{ name: "Easy Run", detail: "5km run club", pace: "6:20 /km" }], coachNote: "", },
      { day: "SUN", date: "Aug 10", type: "Long Run", name: "Easy Long Run 20km", key: false,
        steps: [{ name: "Long Run", detail: "20km easy — gentle terrain", pace: "6:10 /km" }],
        coachNote: "Deliberate step-back. Your 32km is next week. Arrive fresh.", },
    ],
  },
  {
    week: 9, label: "W9", dateRange: "Aug 11–17", phase: "PEAK",
    totalKm: 53, elevationFocus: "Peak week",
    sessions: [
      { day: "TUE", date: "Aug 12", type: "Hill Intervals", name: "5 × 1km Hill Intervals", key: false,
        steps: [
          { name: "Warm Up", detail: "15 min easy", pace: "6:10 /km" },
          { name: "5 × 1km", detail: "1km hard uphill, 90s recovery", pace: "4:40 /km effort" },
          { name: "Cool Down", detail: "10 min easy", pace: "6:20 /km" },
        ], coachNote: "Sharpest you've felt all cycle — use it.", },
      { day: "THU", date: "Aug 14", type: "Easy Run", name: "Easy 8km", key: false,
        steps: [{ name: "Easy Run", detail: "8km easy", pace: "6:10 /km" }], coachNote: "", },
      { day: "FRI", date: "Aug 15", type: "Run Club", name: "Run Club 5km", key: false,
        steps: [{ name: "Easy Run", detail: "5km run club", pace: "6:00–6:20 /km" }], coachNote: "", },
      { day: "SUN", date: "Aug 17", type: "Long Run + MP", name: "32km with 10km MP Finish 🔥", key: true,
        steps: [
          { name: "Easy Long Run", detail: "22km — hilly route, 180m+ elevation", pace: "6:00–6:05 /km" },
          { name: "MP Finish", detail: "Last 10km at race pace", pace: "5:20 /km" },
        ],
        coachNote: "THE most important run of your entire training block. 10km at 5:20 after 22km is a dress rehearsal for Sydney. If you hit this, you are ready.", },
    ],
  },
  {
    week: 10, label: "W10", dateRange: "Aug 18–24", phase: "TAPER",
    totalKm: 33, elevationFocus: "Cut volume 30%",
    sessions: [
      { day: "TUE", date: "Aug 19", type: "Hill Intervals", name: "4 × 1km Hills (Taper)", key: false,
        steps: [
          { name: "Warm Up", detail: "10 min easy", pace: "6:10 /km" },
          { name: "4 × 1km", detail: "1km at race-sharp effort on hill, 2min recovery", pace: "4:45 effort" },
          { name: "Cool Down", detail: "10 min easy", pace: "6:20 /km" },
        ], coachNote: "Taper legs feel strange. Ignore the urge to run more. Trust the process.", },
      { day: "THU", date: "Aug 21", type: "Easy Run", name: "Easy 6km", key: false,
        steps: [{ name: "Easy Run", detail: "6km easy", pace: "6:15 /km" }], coachNote: "", },
      { day: "FRI", date: "Aug 22", type: "Run Club", name: "Run Club 5km", key: false,
        steps: [{ name: "Easy Run", detail: "5km run club", pace: "6:20 /km" }], coachNote: "", },
      { day: "SUN", date: "Aug 24", type: "Long Run", name: "Easy Long Run 20km", key: false,
        steps: [{ name: "Long Run", detail: "20km easy with 3km @ MP in the middle", pace: "6:10 /km (3km @ 5:20)" }],
        coachNote: "Keep the 3km MP effort controlled. This is to remind your legs what race pace feels like, not to tire them.", },
    ],
  },
  {
    week: 11, label: "W11", dateRange: "Aug 25–30", phase: "RACE",
    totalKm: 15, elevationFocus: "Race week",
    sessions: [
      { day: "TUE", date: "Aug 26", type: "Hill Intervals", name: "3 × 1km @ MP (Shake-out)", key: false,
        steps: [
          { name: "Warm Up", detail: "10 min easy", pace: "6:10 /km" },
          { name: "3 × 1km", detail: "1km at marathon pace — feel sharp, stay relaxed", pace: "5:20 /km" },
          { name: "Cool Down", detail: "5 min easy", pace: "6:20 /km" },
        ], coachNote: "These should feel almost embarrassingly easy. That means you're ready.", },
      { day: "THU", date: "Aug 28", type: "Easy Run", name: "4km Shake-out", key: false,
        steps: [{ name: "Shake-out", detail: "4km very easy — just move your legs", pace: "6:20–6:30 /km" }],
        coachNote: "Short and slow. Last run before race day.", },
      { day: "FRI", date: "Aug 29", type: "Easy Run", name: "REST", key: false,
        steps: [{ name: "Rest", detail: "Full rest day. Eat well. Stay off your feet.", pace: "" }],
        coachNote: "Don't walk around the city. Stay horizontal.", },
      { day: "SUN", date: "Aug 30", type: "Race", name: "SYDNEY MARATHON 🏁", key: true,
        steps: [
          { name: "Km 0–8", detail: "To Harbour Bridge — go out controlled", pace: "5:28 /km" },
          { name: "Km 8–12", detail: "Bridge + descent — let the downhill come to you", pace: "5:20–5:25 /km" },
          { name: "Km 12–22", detail: "City + Anzac Parade climb — shorten stride on the hill", pace: "5:20–5:25 /km" },
          { name: "Km 22–30", detail: "Centennial Park — where last year was lost. Stay patient.", pace: "5:20 /km" },
          { name: "Km 30–38", detail: "Push gradually if you've executed correctly", pace: "5:15 /km" },
          { name: "Km 38–42", detail: "Empty the tank", pace: "All out" },
        ],
        coachNote: "You will feel great at km 10. That feeling is a trap. Trust the plan, not your legs.", },
    ],
  },
];

const paceRef = [
  { type: "Easy / Long Run", pace: "6:00–6:20 /km", hr: "< 145 bpm", when: "Thu & Sun base" },
  { type: "Marathon Pace", pace: "5:20 /km", hr: "~155–160 bpm", when: "MP segments in long runs" },
  { type: "Tempo", pace: "4:55–5:05 /km", hr: "160–165 bpm", when: "Sustained hard efforts" },
  { type: "Hill Intervals", pace: "4:35–4:45 effort", hr: "168–175 bpm", when: "Tuesday sessions" },
  { type: "Recovery Jog", pace: "6:30–7:00 /km", hr: "< 130 bpm", when: "Between interval reps" },
];

function daysToRace() {
  return Math.ceil((RACE_DATE - TODAY) / (1000 * 60 * 60 * 24));
}

function weeksToRace() {
  return Math.ceil(daysToRace() / 7);
}

function RaceCountdown() {
  const days = daysToRace();
  const weeks = Math.floor(days / 7);
  const remaining = days % 7;
  const progress = ((11 - weeksToRace()) / 11) * 100;

  return (
    <div style={{
      background: "linear-gradient(135deg, #0B1A2E 0%, #0F2540 100%)",
      border: "1px solid #1E3A5F",
      borderRadius: 16,
      padding: "24px 20px",
      marginBottom: 24,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120,
        borderRadius: "50%", background: "rgba(245,166,35,0.06)", pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "#8FA3B1", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
            Race Countdown
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ color: "#F5A623", fontSize: 52, fontWeight: 800, lineHeight: 1, fontFamily: "monospace" }}>
              {days}
            </span>
            <span style={{ color: "#4A6A8A", fontSize: 16 }}>days</span>
          </div>
          <div style={{ color: "#8FA3B1", fontSize: 12, marginTop: 4 }}>
            {weeks}w {remaining}d · Sun 30 Aug 2026
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#8FA3B1", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
            Goal
          </div>
          <div style={{ color: "#FFFFFF", fontSize: 32, fontWeight: 800, fontFamily: "monospace" }}>3:45</div>
          <div style={{ color: "#4A6A8A", fontSize: 12 }}>5:20 /km</div>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ color: "#8FA3B1", fontSize: 11 }}>Plan progress</span>
          <span style={{ color: "#F5A623", fontSize: 11, fontFamily: "monospace" }}>
            Week {Math.min(12 - weeksToRace(), 11)} of 11
          </span>
        </div>
        <div style={{ background: "#1A2E44", borderRadius: 4, height: 6 }}>
          <div style={{
            background: "linear-gradient(90deg, #1E6B8C, #F5A623)",
            height: 6, borderRadius: 4,
            width: `${Math.max(progress, 2)}%`,
            transition: "width 0.8s ease",
          }} />
        </div>
      </div>
    </div>
  );
}

function PhaseBar({ activeWeek }) {
  const phaseGroups = [
    { phase: "BUILD", weeks: [1,2,3,4], color: phases.BUILD.color },
    { phase: "SHARPEN", weeks: [5,6,7,8], color: phases.SHARPEN.color },
    { phase: "PEAK", weeks: [9], color: phases.PEAK.color },
    { phase: "TAPER", weeks: [10], color: phases.TAPER.color },
    { phase: "RACE", weeks: [11], color: phases.RACE.color },
  ];

  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
      {phaseGroups.map(g => (
        <div key={g.phase} style={{
          flex: g.weeks.length,
          background: g.weeks.includes(activeWeek) ? g.color : `${g.color}44`,
          borderRadius: 4, padding: "4px 6px", textAlign: "center",
          transition: "all 0.3s ease",
        }}>
          <div style={{ color: "#FFF", fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>{g.phase}</div>
        </div>
      ))}
    </div>
  );
}

function WeekSelector({ activeWeek, setActiveWeek }) {
  return (
    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 16 }}>
      {weeks.map(w => {
        const isActive = w.week === activeWeek;
        const phaseColor = phases[w.phase].color;
        const isCurrentWeek = w.week === (12 - weeksToRace());
        return (
          <button key={w.week} onClick={() => setActiveWeek(w.week)}
            style={{
              minWidth: 52, padding: "8px 4px",
              background: isActive ? phaseColor : "rgba(255,255,255,0.04)",
              border: isCurrentWeek && !isActive ? `1px solid ${phaseColor}` : "1px solid transparent",
              borderRadius: 10, cursor: "pointer", transition: "all 0.2s ease",
              flexShrink: 0,
            }}>
            <div style={{ color: isActive ? "#FFF" : "#8FA3B1", fontSize: 11, fontWeight: 700 }}>
              {w.label}
            </div>
            <div style={{ color: isActive ? "rgba(255,255,255,0.7)" : "#4A6A8A", fontSize: 9, marginTop: 2 }}>
              {w.recovery ? "REST" : `${w.totalKm}km`}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function SessionCard({ session, isExpanded, onClick }) {
  const typeColor = sessionColors[session.type] || "#8FA3B1";
  const isRest = session.name === "REST";

  return (
    <div onClick={onClick} style={{
      background: isExpanded ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${isExpanded ? typeColor + "66" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 12,
      padding: "14px 16px",
      marginBottom: 8,
      cursor: isRest ? "default" : "pointer",
      transition: "all 0.2s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            background: typeColor + "22",
            border: `1px solid ${typeColor}44`,
            borderRadius: 6, padding: "2px 8px",
          }}>
            <span style={{ color: typeColor, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>
              {session.day}
            </span>
          </div>
          {session.key && (
            <span style={{ color: "#E84855", fontSize: 9, fontWeight: 700, letterSpacing: 1,
              background: "#E8485522", border: "1px solid #E8485544", borderRadius: 4, padding: "1px 6px" }}>
              KEY
            </span>
          )}
          <div>
            <div style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 600 }}>{session.name}</div>
            <div style={{ color: "#4A6A8A", fontSize: 10, marginTop: 1 }}>{session.date}</div>
          </div>
        </div>
        {!isRest && (
          <div style={{ color: "#4A6A8A", fontSize: 16, transition: "transform 0.2s",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</div>
        )}
      </div>

      {isExpanded && !isRest && (
        <div style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {session.steps.map((step, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#FFFFFF", fontSize: 12, fontWeight: 600 }}>{step.name}</div>
                  <div style={{ color: "#6A8AA0", fontSize: 11, marginTop: 2 }}>{step.detail}</div>
                </div>
                {step.pace && (
                  <div style={{
                    fontFamily: "monospace", color: typeColor,
                    fontSize: 11, fontWeight: 700, textAlign: "right",
                    background: typeColor + "15", borderRadius: 6,
                    padding: "4px 8px", marginLeft: 10, whiteSpace: "nowrap",
                  }}>
                    {step.pace}
                  </div>
                )}
              </div>
            ))}
          </div>
          {session.coachNote && (
            <div style={{
              marginTop: 12, background: "#F5A62310",
              border: "1px solid #F5A62330",
              borderRadius: 8, padding: "10px 12px",
              display: "flex", gap: 8, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 14, marginTop: 1 }}>💬</span>
              <div style={{ color: "#C8A85A", fontSize: 11, lineHeight: 1.5, fontStyle: "italic" }}>
                {session.coachNote}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function WeekDetail({ week }) {
  const [expandedSession, setExpandedSession] = useState(null);
  const phaseColor = phases[week.phase].color;
  const phaseData = phases[week.phase];

  return (
    <div>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 16,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#FFFFFF", fontSize: 18, fontWeight: 800 }}>
              Week {week.week}
            </span>
            <span style={{
              color: phaseColor, fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
              background: phaseColor + "22", border: `1px solid ${phaseColor}44`,
              borderRadius: 6, padding: "2px 8px",
            }}>
              {phaseData.label}
            </span>
            {week.recovery && (
              <span style={{
                color: "#8FA3B1", fontSize: 10, fontWeight: 700, letterSpacing: 1,
                background: "rgba(143,163,177,0.15)", borderRadius: 6, padding: "2px 8px",
              }}>
                RECOVERY
              </span>
            )}
          </div>
          <div style={{ color: "#4A6A8A", fontSize: 12, marginTop: 2 }}>{week.dateRange}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#F5A623", fontSize: 22, fontWeight: 800, fontFamily: "monospace" }}>
            {week.totalKm}
          </div>
          <div style={{ color: "#4A6A8A", fontSize: 10 }}>km this week</div>
        </div>
      </div>

      <div style={{
        background: phaseColor + "15", border: `1px solid ${phaseColor}30`,
        borderRadius: 8, padding: "8px 12px", marginBottom: 16,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 13 }}>🎯</span>
        <span style={{ color: "#A0C0D0", fontSize: 11 }}>{week.elevationFocus}</span>
      </div>

      {week.sessions.map((session, i) => (
        <SessionCard
          key={i}
          session={session}
          isExpanded={expandedSession === i}
          onClick={() => session.name !== "REST" && setExpandedSession(expandedSession === i ? null : i)}
        />
      ))}
    </div>
  );
}

function PaceReference() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12, padding: "12px 16px",
        cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>⚡</span>
          <span style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 600 }}>Pace Reference</span>
        </div>
        <span style={{ color: "#4A6A8A", fontSize: 14, transform: open ? "rotate(180deg)" : "none",
          transition: "transform 0.2s" }}>▾</span>
      </button>
      {open && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          {paceRef.map((p, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", borderRadius: 10,
              padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ color: "#FFFFFF", fontSize: 12, fontWeight: 600 }}>{p.type}</div>
                <div style={{ color: "#4A6A8A", fontSize: 10, marginTop: 2 }}>{p.when}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#F5A623", fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>{p.pace}</div>
                <div style={{ color: "#4A6A8A", fontSize: 10, marginTop: 1 }}>{p.hr}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RaceStrategy() {
  const [open, setOpen] = useState(false);
  const segments = [
    { km: "0–8", label: "To Harbour Bridge", pace: "5:28", note: "Go out controlled. You will feel you're going too slow. That's correct." },
    { km: "8–12", label: "Bridge + descent", pace: "5:20–5:25", note: "Let the downhill come to you. Don't attack it." },
    { km: "12–22", label: "City + Anzac Parade", pace: "5:20–5:25", note: "Shorten stride on the hill at km 20. Don't fight it." },
    { km: "22–30", label: "Centennial Park", pace: "5:20", note: "Where last year was lost. Stay patient. HR under 165." },
    { km: "30–38", label: "Push gradually", pace: "5:15", note: "If you've executed correctly, you have something left here." },
    { km: "38–42", label: "Empty the tank", pace: "All out", note: "Nothing to save." },
  ];

  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "rgba(232,72,85,0.08)",
        border: "1px solid rgba(232,72,85,0.25)",
        borderRadius: 12, padding: "12px 16px",
        cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>🏁</span>
          <span style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 600 }}>Race Day Strategy</span>
        </div>
        <span style={{ color: "#4A6A8A", fontSize: 14, transform: open ? "rotate(180deg)" : "none",
          transition: "transform 0.2s" }}>▾</span>
      </button>
      {open && (
        <div style={{ marginTop: 8 }}>
          {segments.map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, padding: "10px 14px",
              background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent",
              borderRadius: 8, marginBottom: 4,
            }}>
              <div style={{ minWidth: 40 }}>
                <div style={{ color: "#F5A623", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>
                  km {s.km}
                </div>
                <div style={{ color: "#E84855", fontFamily: "monospace", fontSize: 11, fontWeight: 600, marginTop: 2 }}>
                  {s.pace}
                </div>
              </div>
              <div>
                <div style={{ color: "#FFFFFF", fontSize: 12, fontWeight: 600 }}>{s.label}</div>
                <div style={{ color: "#6A8AA0", fontSize: 11, marginTop: 2, lineHeight: 1.4 }}>{s.note}</div>
              </div>
            </div>
          ))}
          <div style={{
            background: "#F5A62312", border: "1px solid #F5A62330",
            borderRadius: 8, padding: "10px 14px", marginTop: 8,
          }}>
            <div style={{ color: "#C8A85A", fontSize: 11, fontStyle: "italic", lineHeight: 1.5 }}>
              💬 You will feel great at km 10. That feeling is a trap. Trust the plan, not your legs. Your 4:06 last year wasn't fitness — it was execution. This time you know the course.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeWeek, setActiveWeek] = useState(1);
  const currentWeekData = weeks.find(w => w.week === activeWeek);

  return (
    <div style={{
      background: "#0B1A2E",
      minHeight: "100vh",
      padding: "20px 16px 40px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: "#FFFFFF",
      maxWidth: 480,
      margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "#4A6A8A", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
          Sydney Marathon 2026
        </div>
        <div style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 800, lineHeight: 1.1 }}>
          Training Plan
        </div>
        <div style={{ color: "#8FA3B1", fontSize: 12, marginTop: 4 }}>
          Gerardo · 4 days/week · Goal 3:45
        </div>
      </div>

      <RaceCountdown />
      <PaceReference />
      <RaceStrategy />

      {/* Week navigation */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "#4A6A8A", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
          Training Weeks
        </div>
        <PhaseBar activeWeek={activeWeek} />
        <WeekSelector activeWeek={activeWeek} setActiveWeek={setActiveWeek} />
      </div>

      {/* Week detail */}
      <WeekDetail week={currentWeekData} />

      {/* Footer */}
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <div style={{ color: "#2A3F55", fontSize: 10, letterSpacing: 1 }}>
          BUILT FOR GERARDO · SYDNEY MARATHON 30 AUG 2026
        </div>
      </div>
    </div>
  );
}
