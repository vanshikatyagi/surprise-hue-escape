import { jsPDF } from "jspdf";

interface Activity {
  time: string;
  start_time?: string;
  duration?: string;
  travel_time?: string;
  activity: string;
  description: string;
  type: string;
  cost_estimate?: string;
  hidden_gem?: boolean;
  photo_spot?: boolean;
  local_food_tip?: string;
  insider_tip?: string;
  community_pick?: boolean;
}
interface DayPlan { day: number; title: string; weather_note?: string; activities: Activity[]; }
interface Itinerary {
  destination: string;
  destination_airport?: string;
  duration: string;
  summary?: string;
  days: DayPlan[];
  estimated_budget: string;
  best_season?: string;
  tips?: string[];
  packing_essentials?: string[];
  local_phrases?: string[];
  flight_suggestion?: { from_hub: string; to: string; estimated_price_range: string; flight_duration: string };
  hotel_suggestion?: { name: string; area: string; style: string; estimated_price_range: string };
  budget_breakdown?: Record<string, string>;
}

interface QuizExtras {
  food_preferences?: string | string[];
  beverage_preferences?: string | string[];
  departure_city?: string | string[];
}

// Premium minimal palette
const INK: [number, number, number] = [28, 28, 32];
const SUBTLE: [number, number, number] = [115, 115, 125];
const ACCENT: [number, number, number] = [194, 154, 70]; // muted gold
const HAIR: [number, number, number] = [225, 225, 230];
const SOFT_BG: [number, number, number] = [248, 247, 244];

// Strip emoji / symbol noise from any AI text before drawing
function clean(text: string): string {
  if (!text) return "";
  return text
    // remove emoji ranges
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{1F000}-\u{1F2FF}]/gu, "")
    // remove markdown asterisks/backticks
    .replace(/[*`_~]+/g, "")
    // collapse whitespace
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function exportItineraryPdf(itinerary: Itinerary, quizData: QuizExtras = {}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  const departureCity = Array.isArray(quizData.departure_city)
    ? quizData.departure_city[0]
    : (quizData.departure_city || "");

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin - 24) {
      doc.addPage();
      y = margin;
    }
  };

  const setColor = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);

  const addText = (
    text: string,
    opts: { size?: number; color?: [number, number, number]; bold?: boolean; indent?: number; gap?: number; italic?: boolean } = {},
  ) => {
    const { size = 10.5, color = INK, bold = false, indent = 0, gap = 4, italic = false } = opts;
    const cleaned = clean(text);
    if (!cleaned) return;
    doc.setFontSize(size);
    setColor(color);
    doc.setFont("helvetica", bold ? "bold" : italic ? "italic" : "normal");
    const lines = doc.splitTextToSize(cleaned, pageW - margin * 2 - indent);
    lines.forEach((line: string) => {
      ensureSpace(size + 4);
      doc.text(line, margin + indent, y);
      y += size + 4;
    });
    y += gap;
  };

  const sectionTitle = (label: string) => {
    ensureSpace(38);
    y += 6;
    doc.setDrawColor(ACCENT[0], ACCENT[1], ACCENT[2]);
    doc.setLineWidth(1.5);
    doc.line(margin, y, margin + 28, y);
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    setColor(INK);
    doc.text(clean(label).toUpperCase(), margin, y);
    y += 18;
  };

  // ── COVER ──
  doc.setFillColor(SOFT_BG[0], SOFT_BG[1], SOFT_BG[2]);
  doc.rect(0, 0, pageW, pageH, "F");

  // accent bar
  doc.setFillColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  doc.rect(margin, 120, 40, 3, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setColor(SUBTLE);
  doc.text("MYSTIGO  ·  PREMIUM TRAVEL GUIDE", margin, 100);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  setColor(INK);
  const destLines = doc.splitTextToSize(clean(itinerary.destination), pageW - margin * 2);
  let dy = 170;
  destLines.forEach((l: string) => { doc.text(l, margin, dy); dy += 38; });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  setColor(SUBTLE);
  doc.text(clean(`${itinerary.duration}  ·  ${itinerary.estimated_budget}`), margin, dy + 6);
  if (itinerary.best_season) {
    doc.text(clean(`Best Season  ${itinerary.best_season}`), margin, dy + 28);
  }

  // cover image
  const cover = await fetchImageAsDataUrl(
    `https://source.unsplash.com/1200x800/?${encodeURIComponent(itinerary.destination.split(",")[0])},travel,landscape`,
  );
  if (cover) {
    try {
      const imgW = pageW - margin * 2;
      const imgH = 220;
      doc.addImage(cover, "JPEG", margin, pageH - margin - imgH, imgW, imgH, undefined, "FAST");
    } catch {}
  }

  // ── PAGE 2: OVERVIEW ──
  doc.addPage();
  y = margin;
  sectionTitle("Trip Overview");
  if (itinerary.summary) {
    addText(itinerary.summary, { size: 11, color: SUBTLE, gap: 12 });
  }

  // Quick facts grid
  const facts: { label: string; value: string }[] = [
    { label: "Destination", value: itinerary.destination },
    { label: "Duration", value: itinerary.duration },
    { label: "Estimated Budget", value: itinerary.estimated_budget },
    { label: "Best Season", value: itinerary.best_season || "Year-round" },
    { label: "Travelling From", value: departureCity || "—" },
    { label: "Days Planned", value: String(itinerary.days?.length || 0) },
  ];
  ensureSpace(140);
  const colW = (pageW - margin * 2) / 2;
  facts.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = margin + col * colW;
    const cy = y + row * 44;
    doc.setFontSize(8.5);
    setColor(SUBTLE);
    doc.setFont("helvetica", "normal");
    doc.text(clean(f.label).toUpperCase(), cx, cy);
    doc.setFontSize(11.5);
    doc.setFont("helvetica", "bold");
    setColor(INK);
    doc.text(clean(f.value), cx, cy + 16);
  });
  y += Math.ceil(facts.length / 2) * 44 + 16;

  // ── HOTEL ──
  if (itinerary.hotel_suggestion) {
    sectionTitle("Where You'll Stay");
    const h = itinerary.hotel_suggestion;
    addText(h.name, { size: 14, bold: true, gap: 2 });
    addText(`${h.area}  ·  ${h.style}`, { size: 10.5, color: SUBTLE, gap: 6 });
    addText(`Rate range  ${h.estimated_price_range}`, { size: 10.5, gap: 12 });
  }

  // ── TRANSPORT ──
  if (itinerary.flight_suggestion) {
    sectionTitle("Getting There");
    const f = itinerary.flight_suggestion;
    addText(`${f.from_hub}  →  ${f.to}`, { size: 14, bold: true, gap: 2 });
    addText(`Flight time  ${f.flight_duration}`, { size: 10.5, color: SUBTLE, gap: 2 });
    addText(`Fare range  ${f.estimated_price_range}`, { size: 10.5, gap: 12 });
  }

  // ── BUDGET ──
  if (itinerary.budget_breakdown) {
    sectionTitle("Budget Breakdown");
    Object.entries(itinerary.budget_breakdown).forEach(([k, v]) => {
      const label = k.charAt(0).toUpperCase() + k.slice(1);
      ensureSpace(20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      setColor(INK);
      doc.text(clean(label), margin, y);
      doc.setFont("helvetica", "bold");
      const valStr = clean(v);
      const w = doc.getTextWidth(valStr);
      doc.text(valStr, pageW - margin - w, y);
      y += 8;
      doc.setDrawColor(HAIR[0], HAIR[1], HAIR[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageW - margin, y);
      y += 10;
    });
  }

  // ── DAY BY DAY ──
  for (let idx = 0; idx < (itinerary.days?.length || 0); idx++) {
    const day = itinerary.days[idx];
    doc.addPage();
    y = margin;

    // Day header
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setColor(SUBTLE);
    doc.text(`DAY ${day.day} OF ${itinerary.days.length}`, margin, y);
    y += 22;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    setColor(INK);
    const titleLines = doc.splitTextToSize(clean(day.title), pageW - margin * 2);
    titleLines.forEach((l: string) => { doc.text(l, margin, y); y += 26; });

    if (day.weather_note) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      setColor(SUBTLE);
      const wn = doc.splitTextToSize(clean(day.weather_note), pageW - margin * 2);
      wn.forEach((l: string) => { doc.text(l, margin, y); y += 14; });
    }
    y += 10;

    // 1 image per day (top-of-page hero strip)
    const cityQ = encodeURIComponent(itinerary.destination.split(",")[0]);
    const themeQ = encodeURIComponent(clean(day.title).split(" ").slice(0, 3).join(",") || "scenery");
    const dayImg = await fetchImageAsDataUrl(
      `https://source.unsplash.com/900x500/?${cityQ},${themeQ}`,
    );
    if (dayImg) {
      try {
        const imgW = pageW - margin * 2;
        const imgH = 150;
        ensureSpace(imgH + 14);
        doc.addImage(dayImg, "JPEG", margin, y, imgW, imgH, undefined, "FAST");
        y += imgH + 16;
      } catch {}
    }

    // Group activities by time block
    const blocks = ["Morning", "Afternoon", "Evening", "Night"] as const;
    blocks.forEach((blk) => {
      const items = day.activities?.filter((a) => clean(a.time).toLowerCase().includes(blk.toLowerCase()));
      if (!items || items.length === 0) return;

      ensureSpace(40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      setColor(ACCENT);
      doc.text(blk.toUpperCase(), margin, y);
      y += 16;

      items.forEach((act) => {
        ensureSpace(60);
        // time + cost line
        const meta = [act.start_time, act.duration, act.cost_estimate].map(clean).filter(Boolean).join("  ·  ");
        if (meta) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          setColor(SUBTLE);
          doc.text(meta, margin + 12, y);
          y += 12;
        }
        // title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11.5);
        setColor(INK);
        const aLines = doc.splitTextToSize(clean(act.activity), pageW - margin * 2 - 12);
        aLines.forEach((l: string) => { ensureSpace(16); doc.text(l, margin + 12, y); y += 15; });
        // description (1-2 lines max)
        if (act.description) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          setColor(SUBTLE);
          const dLines = doc.splitTextToSize(clean(act.description), pageW - margin * 2 - 12).slice(0, 2);
          dLines.forEach((l: string) => { ensureSpace(14); doc.text(l, margin + 12, y); y += 13; });
        }
        y += 8;
      });
      y += 4;
    });
  }

  // ── CLOSING NOTES ──
  if (itinerary.tips?.length || itinerary.packing_essentials?.length) {
    doc.addPage();
    y = margin;

    if (itinerary.tips?.length) {
      sectionTitle("Travel Notes");
      itinerary.tips.forEach((t) => {
        ensureSpace(20);
        doc.setFont("helvetica", "bold");
        setColor(ACCENT);
        doc.setFontSize(10);
        doc.text("·", margin, y);
        doc.setFont("helvetica", "normal");
        setColor(INK);
        const lines = doc.splitTextToSize(clean(t), pageW - margin * 2 - 14);
        lines.forEach((l: string, i: number) => {
          ensureSpace(14);
          doc.text(l, margin + 12, y);
          y += 14;
          if (i === 0) {} // already placed bullet
        });
        y += 4;
      });
    }

    if (itinerary.packing_essentials?.length) {
      sectionTitle("Packing Essentials");
      itinerary.packing_essentials.forEach((t) => {
        ensureSpace(16);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10.5);
        setColor(INK);
        doc.text(`·  ${clean(t)}`, margin, y);
        y += 16;
      });
    }
  }

  // ── Footer on every page ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    setColor(SUBTLE);
    doc.setFont("helvetica", "normal");
    const footer = `MystiGo  ·  ${clean(itinerary.destination)}  ·  ${i} / ${pageCount}`;
    doc.text(footer, margin, pageH - 24);
  }

  const safe = clean(itinerary.destination).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`mystigo-${safe}-guide.pdf`);
}
