function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
// CONFIG — Remplace avec tes propres clés si besoin
// ============================================================
const SUPABASE_URL = 'https://pomlfseukliepmxmbetg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvbWxmc2V1a2xpZXBteG1iZXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NjQ5NDcsImV4cCI6MjA4ODU0MDk0N30.nJvIUkXVzGbYeYfposu2LS5Z8iAjEoNqHIK4WP1L-tw';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} = React;

// ============================================================
// CONSTANTS
// ============================================================
const SL = {
  draft: 'Brouillon',
  sent: 'Envoyé',
  accepted: 'Accepté',
  rejected: 'Refusé',
  scheduled: 'Planifié',
  flight_requested: 'Vol demandé',
  flight_approved: 'Vol approuvé',
  completed: 'Réalisé',
  invoiced: 'Facturé'
};
const SC = {
  draft: '#868E96',
  sent: '#1C7ED6',
  accepted: '#2B8A3E',
  rejected: '#C92A2A',
  scheduled: '#E67700',
  flight_requested: '#9C36B5',
  flight_approved: '#0CA678',
  completed: '#2B8A3E',
  invoiced: '#495057'
};
const fDate = d => d ? new Date(d).toLocaleDateString('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
}) : '—';
const fEuro = n => new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR'
}).format(n || 0);
const dDiff = (a, b) => Math.ceil((new Date(b) - new Date(a)) / 864e5);

// ============================================================
// SVG ICONS
// ============================================================
const I = ({
  d,
  s = 18,
  c = 'currentColor',
  ...p
}) => /*#__PURE__*/React.createElement("svg", _extends({
  width: s,
  height: s,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: c,
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, p), /*#__PURE__*/React.createElement("path", {
  d: d
}));
const Ic = {
  home: p => /*#__PURE__*/React.createElement(I, _extends({}, p, {
    d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
  })),
  file: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "14 2 14 8 20 8"
  })),
  cal: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16",
    y1: "2",
    x2: "16",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "2",
    x2: "8",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "10",
    x2: "21",
    y2: "10"
  })),
  plane: p => /*#__PURE__*/React.createElement(I, _extends({}, p, {
    d: "M22 2L11 13M22 2l-7 20-4-9-9-4z"
  })),
  check: p => /*#__PURE__*/React.createElement(I, _extends({}, p, {
    d: "M20 6L9 17l-5-5"
  })),
  inv: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "13",
    x2: "16",
    y2: "13"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "17",
    x2: "12",
    y2: "17"
  })),
  bell: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.73 21a2 2 0 01-3.46 0"
  })),
  cat: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 19.5A2.5 2.5 0 016.5 17H20"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
  })),
  map: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3"
  })),
  plus: p => /*#__PURE__*/React.createElement(I, _extends({}, p, {
    d: "M12 5v14M5 12h14"
  })),
  trash: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: p?.c || "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "3 6 5 6 21 6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
  })),
  edit: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
  })),
  eye: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  })),
  x: p => /*#__PURE__*/React.createElement(I, _extends({}, p, {
    d: "M18 6L6 18M6 6l12 12"
  })),
  search: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  })),
  pdf: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 2v6h6"
  })),
  tpl: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "9",
    x2: "21",
    y2: "9"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "21",
    x2: "9",
    y2: "9"
  })),
  out: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "16 17 21 12 16 7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "12",
    x2: "9",
    y2: "12"
  }))
};

// ============================================================
// SHARED COMPONENTS
// ============================================================
const Status = ({
  s
}) => {
  const c = SC[s] || '#868E96';
  return /*#__PURE__*/React.createElement("span", {
    className: "status",
    style: {
      background: c + '18',
      color: c
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "s-dot",
    style: {
      background: c
    }
  }), SL[s]);
};
const ETag = ({
  e
}) => e ? /*#__PURE__*/React.createElement("span", {
  className: "etag",
  style: {
    background: e.color + '15',
    color: e.color
  }
}, e.name) : null;
const Modal = ({
  title,
  onClose,
  children,
  footer,
  wide
}) => /*#__PURE__*/React.createElement("div", {
  className: "modal-ov",
  onClick: e => e.target === e.currentTarget && onClose()
}, /*#__PURE__*/React.createElement("div", {
  className: `modal ${wide ? 'w' : ''}`
}, /*#__PURE__*/React.createElement("div", {
  className: "modal-h"
}, /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("button", {
  className: "btn btn-g btn-sm",
  onClick: onClose
}, Ic.x())), /*#__PURE__*/React.createElement("div", {
  className: "modal-b"
}, children), footer && /*#__PURE__*/React.createElement("div", {
  className: "modal-f"
}, footer)));
const Toast = ({
  msg,
  onDone
}) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return /*#__PURE__*/React.createElement("div", {
    className: "toast"
  }, msg);
};

// ============================================================
// ADDRESS SEARCH (api-adresse.data.gouv.fr)
// ============================================================
function AddrSearch({
  value,
  onChange,
  onSelect,
  placeholder
}) {
  const [q, setQ] = useState(value || '');
  const [sug, setSug] = useState([]);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const wr = useRef(null);
  useEffect(() => {
    setQ(value || '');
  }, [value]);
  useEffect(() => {
    const h = e => {
      if (wr.current && !wr.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const search = async q => {
    if (q.length < 3) {
      setSug([]);
      return;
    }
    try {
      const r = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=5`);
      const d = await r.json();
      if (d?.features) {
        setSug(d.features.map(f => ({
          label: f.properties.label,
          name: f.properties.name,
          postcode: f.properties.postcode,
          city: f.properties.city,
          context: f.properties.context,
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0]
        })));
        setOpen(true);
      }
    } catch (e) {}
  };
  const hc = e => {
    const v = e.target.value;
    setQ(v);
    onChange?.(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => search(v), 300);
  };
  const hs = s => {
    setQ(s.label);
    setOpen(false);
    setSug([]);
    onSelect?.(s);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "addr-ac",
    ref: wr
  }, /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: q,
    onChange: hc,
    onFocus: () => sug.length > 0 && setOpen(true),
    placeholder: placeholder || "Tapez une adresse…",
    autoComplete: "off"
  }), open && sug.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "addr-sug"
  }, sug.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "addr-s",
    onClick: () => hs(s)
  }, /*#__PURE__*/React.createElement("div", {
    className: "addr-m"
  }, s.name), /*#__PURE__*/React.createElement("div", {
    className: "addr-sub"
  }, s.postcode, " ", s.city, " \u2014 ", s.context)))));
}

// ============================================================
// PDF GENERATION
// ============================================================
function dlPDF(devis, ent, lines) {
  const {
    jsPDF
  } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');
  const W = 210,
    m = 15,
    cW = W - m * 2;
  let y = 20;
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const [pr, pg, pb] = hex(ent.color || '#3B5BDB');
  doc.setFillColor(pr, pg, pb);
  doc.rect(0, 0, W, 4, 'F');
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(pr, pg, pb);
  doc.text(ent.name, m, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(ent.legal_name || '', m, y);
  y += 4;
  doc.text(ent.address || '', m, y);
  y += 4;
  doc.text(`${ent.postal_code || ''} ${ent.city || ''}`, m, y);
  y += 4;
  if (ent.phone) {
    doc.text(`Tél : ${ent.phone}`, m, y);
    y += 4;
  }
  const cx = W - m;
  let cy = 20;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text(devis.client_name || '', cx, cy, {
    align: 'right'
  });
  cy += 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  if (devis.client_address) {
    doc.text(devis.client_address, cx, cy, {
      align: 'right'
    });
    cy += 4;
  }
  doc.text(`${devis.client_postal || ''} ${devis.client_city || ''}`, cx, cy, {
    align: 'right'
  });
  cy += 4;
  doc.text('France', cx, cy, {
    align: 'right'
  });
  y = Math.max(y, cy) + 10;
  doc.setFillColor(pr, pg, pb);
  doc.roundedRect(m, y, cW, 18, 2, 2, 'F');
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`Devis N° ${devis.number}`, m + 5, y + 7);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(devis.title || '', m + 5, y + 13);
  y += 22;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date d'émission : ${fDate(devis.created_at)}     ·     Validité : ${devis.validity_days || 30} jours`, m, y);
  y += 8;
  if (devis.description) {
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const dl = doc.splitTextToSize(devis.description, cW);
    doc.text(dl, m, y);
    y += dl.length * 4 + 6;
  }
  const tl = (lines || []).map(l => [l.designation, Number(l.qty).toLocaleString('fr-FR', {
    minimumFractionDigits: 2
  }), l.unit || '', Number(l.prix_unit).toFixed(2), `${l.tva_rate || 0}%`, fEuro((l.qty || 0) * (l.prix_unit || 0))]);
  doc.autoTable({
    startY: y,
    margin: {
      left: m,
      right: m
    },
    head: [['Désignation', 'Quantité', 'Unité', 'Prix unit.', 'TVA', 'Montant HT']],
    body: tl,
    theme: 'grid',
    headStyles: {
      fillColor: [pr, pg, pb],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 3
    },
    bodyStyles: {
      fontSize: 8.5,
      cellPadding: 3,
      textColor: [40, 40, 40]
    },
    columnStyles: {
      0: {
        cellWidth: 'auto',
        halign: 'left'
      },
      1: {
        cellWidth: 22,
        halign: 'right'
      },
      2: {
        cellWidth: 18,
        halign: 'center'
      },
      3: {
        cellWidth: 22,
        halign: 'right'
      },
      4: {
        cellWidth: 15,
        halign: 'center'
      },
      5: {
        cellWidth: 28,
        halign: 'right',
        fontStyle: 'bold'
      }
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250]
    }
  });
  y = doc.lastAutoTable.finalY + 8;
  const tx = W - m - 60;
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Total HT :', tx, y);
  doc.setFont('helvetica', 'bold');
  doc.text(fEuro(devis.total_ht), W - m, y, {
    align: 'right'
  });
  y += 5;
  if ((ent.tva_rate || 0) > 0) {
    doc.setFont('helvetica', 'normal');
    doc.text(`TVA ${ent.tva_rate}% :`, tx, y);
    doc.setFont('helvetica', 'bold');
    doc.text(fEuro(devis.total_tva), W - m, y, {
      align: 'right'
    });
    y += 5;
  }
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(tx - 5, y - 4, cW - tx + m + 5, 10, 1, 1, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(pr, pg, pb);
  doc.text('Total TTC :', tx, y + 3);
  doc.text(fEuro(devis.total_ttc), W - m, y + 3, {
    align: 'right'
  });
  y += 16;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  if (ent.tva_mention) {
    doc.text(ent.tva_mention, m, y);
    y += 4;
  }
  if (ent.cgv) {
    doc.text(ent.cgv, m, y);
    y += 4;
  }
  y += 4;
  let ll = `SIREN ${ent.siren}`;
  if (ent.naf) ll += ` - NAF ${ent.naf}`;
  if (ent.rcs) ll += ` - RCS ${ent.rcs}`;
  doc.text(ll, m, y);
  y += 4;
  if (ent.tva_intra) {
    doc.text(`TVA intracommunautaire : ${ent.tva_intra}`, m, y);
    y += 4;
  }
  if (ent.iban) {
    doc.text(`IBAN: ${ent.iban}  ·  BIC: ${ent.bic}`, m, y);
    y += 4;
  }
  y += 8;
  doc.setFont('helvetica', 'italic');
  doc.text('Pour être accepté, le devis doit être daté, signé et suivi de la mention manuscrite « Bon pour accord ».', m, y);
  doc.setFillColor(pr, pg, pb);
  doc.rect(0, 293, W, 4, 'F');
  doc.save(`Devis_${String(devis.number).padStart(6, '0')}_${(devis.client_name || '').replace(/\s+/g, '_')}.pdf`);
}

// ============================================================
// DATA STORE HOOK
// ============================================================
function useStore() {
  const [ents, setEnts] = useState([]);
  const [svcs, setSvcs] = useState([]);
  const [cons, setCons] = useState([]);
  const [tpls, setTpls] = useState([]);
  const [devis, setDevis] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [e, s, c, t, d] = await Promise.all([sb.from('entities').select('*'), sb.from('services').select('*').order('sort_order'), sb.from('consumables').select('*').order('sort_order'), sb.from('templates').select('*').order('sort_order'), sb.from('devis').select('*').order('created_at', {
      ascending: false
    })]);
    setEnts(e.data || []);
    setSvcs(s.data || []);
    setCons(c.data || []);
    setTpls(t.data || []);
    setDevis(d.data || []);
    setLoading(false);
  }, []);
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);
  const fetchLines = async id => {
    const {
      data
    } = await sb.from('devis_lines').select('*').eq('devis_id', id).order('sort_order');
    return data || [];
  };
  const createDevis = async (dd, lines) => {
    const {
      data: num
    } = await sb.rpc('get_next_devis_number', {
      p_entity_id: dd.entity_id
    });
    const {
      data: nd,
      error
    } = await sb.from('devis').insert({
      ...dd,
      number: num
    }).select().single();
    if (error || !nd) return;
    if (lines.length > 0) {
      await sb.from('devis_lines').insert(lines.map((l, i) => ({
        devis_id: nd.id,
        line_type: l.line_type,
        catalog_ref: l.catalog_ref || null,
        designation: l.designation,
        qty: l.qty,
        unit: l.unit,
        prix_unit: l.prix_unit,
        tva_rate: l.tva_rate,
        sort_order: i
      })));
    }
    await fetchAll();
    return nd;
  };
  const updateDevis = async (id, upd, lines) => {
    await sb.from('devis').update(upd).eq('id', id);
    if (lines) {
      await sb.from('devis_lines').delete().eq('devis_id', id);
      if (lines.length > 0) await sb.from('devis_lines').insert(lines.map((l, i) => ({
        devis_id: id,
        line_type: l.line_type,
        catalog_ref: l.catalog_ref || null,
        designation: l.designation,
        qty: l.qty,
        unit: l.unit,
        prix_unit: l.prix_unit,
        tva_rate: l.tva_rate,
        sort_order: i
      })));
    }
    await fetchAll();
  };
  const deleteDevis = async id => {
    await sb.from('devis_lines').delete().eq('devis_id', id);
    await sb.from('devis').delete().eq('id', id);
    await fetchAll();
  };
  const updateStatus = async (id, status, extras = {}) => {
    await sb.from('devis').update({
      status,
      ...extras
    }).eq('id', id);
    await fetchAll();
  };
  const upsertSvc = async s => {
    await sb.from('services').upsert(s);
    await fetchAll();
  };
  const deleteSvc = async id => {
    await sb.from('services').delete().eq('id', id);
    await fetchAll();
  };
  const upsertCons = async c => {
    await sb.from('consumables').upsert(c);
    await fetchAll();
  };
  const deleteCons = async id => {
    await sb.from('consumables').delete().eq('id', id);
    await fetchAll();
  };
  const upsertTpl = async t => {
    await sb.from('templates').upsert(t);
    await fetchAll();
  };
  const deleteTpl = async id => {
    await sb.from('templates').delete().eq('id', id);
    await fetchAll();
  };
  return {
    ents,
    svcs,
    cons,
    tpls,
    devis,
    loading,
    fetchAll,
    fetchLines,
    createDevis,
    updateDevis,
    deleteDevis,
    updateStatus,
    upsertSvc,
    deleteSvc,
    upsertCons,
    deleteCons,
    upsertTpl,
    deleteTpl
  };
}

// ============================================================
// MAP
// ============================================================
function MapView({
  devisList,
  entities
}) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const m = L.map(ref.current).setView([46.8, -0.8], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OSM',
      maxZoom: 18
    }).addTo(m);
    mapRef.current = m;
    return () => {
      m.remove();
      mapRef.current = null;
    };
  }, []);
  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;
    m.eachLayer(l => {
      if (l instanceof L.Marker) m.removeLayer(l);
    });
    const mk = [];
    devisList.forEach(d => {
      const lat = d.delivery_lat,
        lng = d.delivery_lng;
      if (!lat || !lng) return;
      const ent = entities.find(e => e.id === d.entity_id);
      const co = ent?.color || '#3B5BDB';
      const ic = L.divIcon({
        className: '',
        html: `<div style="width:28px;height:28px;border-radius:50%;background:${co};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      const marker = L.marker([lat, lng], {
        icon: ic
      }).addTo(m);
      marker.bindPopup(`<div style="font-family:DM Sans,sans-serif"><strong>${d.client_name}</strong><br><span style="font-size:11px;color:#6C757D">N°${d.number} · ${SL[d.status]}</span><br><strong>${fEuro(d.total_ttc)}</strong>${d.intervention_date ? `<br>${fDate(d.intervention_date)}` : ''}</div>`);
      mk.push(marker);
    });
    if (mk.length > 0) m.fitBounds(L.featureGroup(mk).getBounds().pad(0.1));
  }, [devisList, entities]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "map-c"
  });
}

// ============================================================
// MAIN APP
// ============================================================
function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const st = useStore();
  const [view, setView] = useState('dashboard');
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [fEnt, setFEnt] = useState('all');
  const [toast, setToast] = useState(null);
  const show = msg => setToast(msg);
  useEffect(() => {
    sb.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const {
      data: {
        subscription
      }
    } = sb.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // AUTH
  const [aMode, setAMode] = useState('login');
  const [aEmail, setAEmail] = useState('');
  const [aPwd, setAPwd] = useState('');
  const [aName, setAName] = useState('');
  const [aErr, setAErr] = useState('');
  const [aBusy, setABusy] = useState(false);
  const doAuth = async e => {
    e.preventDefault();
    setAErr('');
    setABusy(true);
    const r = aMode === 'login' ? await sb.auth.signInWithPassword({
      email: aEmail,
      password: aPwd
    }) : await sb.auth.signUp({
      email: aEmail,
      password: aPwd,
      options: {
        data: {
          full_name: aName
        }
      }
    });
    setABusy(false);
    if (r.error) setAErr(r.error.message);
  };
  if (authLoading) return /*#__PURE__*/React.createElement("div", {
    className: "loading"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spinner"
  }));
  if (!user) return /*#__PURE__*/React.createElement("div", {
    className: "auth-p"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-c"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: '#3B5BDB'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: '#868E96',
      textTransform: 'uppercase',
      letterSpacing: 1
    }
  }, "Gestion Clients")), /*#__PURE__*/React.createElement("h1", null, aMode === 'login' ? 'Connexion' : 'Créer un compte'), /*#__PURE__*/React.createElement("p", null, aMode === 'login' ? 'Accédez à votre espace' : 'Créez votre compte'), /*#__PURE__*/React.createElement("form", {
    onSubmit: doAuth
  }, aMode === 'signup' && /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Nom"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: aName,
    onChange: e => setAName(e.target.value),
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Email"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    type: "email",
    value: aEmail,
    onChange: e => setAEmail(e.target.value),
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Mot de passe"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    type: "password",
    value: aPwd,
    onChange: e => setAPwd(e.target.value),
    required: true,
    minLength: 6
  })), aErr && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--err)',
      fontSize: 13,
      marginBottom: 12
    }
  }, aErr), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-p",
    type: "submit",
    style: {
      width: '100%',
      justifyContent: 'center',
      padding: '10px'
    },
    disabled: aBusy
  }, aBusy ? '…' : aMode === 'login' ? 'Se connecter' : 'Créer')), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 16,
      fontSize: 13,
      color: 'var(--text-sec)'
    }
  }, aMode === 'login' ? /*#__PURE__*/React.createElement(React.Fragment, null, "Pas de compte ? ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--pri)',
      cursor: 'pointer',
      fontWeight: 600
    },
    onClick: () => setAMode('signup')
  }, "Cr\xE9er un compte")) : /*#__PURE__*/React.createElement(React.Fragment, null, "D\xE9j\xE0 un compte ? ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--pri)',
      cursor: 'pointer',
      fontWeight: 600
    },
    onClick: () => setAMode('login')
  }, "Se connecter")))));
  if (st.loading) return /*#__PURE__*/React.createElement("div", {
    className: "loading"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spinner"
  }));
  const eMap = {};
  st.ents.forEach(e => {
    eMap[e.id] = e;
  });
  const fd = st.devis.filter(d => fEnt === 'all' || d.entity_id === fEnt).filter(d => {
    if (!search) return true;
    const s = search.toLowerCase();
    return d.client_name?.toLowerCase().includes(s) || d.client_city?.toLowerCase().includes(s) || String(d.number).includes(s);
  });
  const cnt = useMemo(() => {
    const a = st.devis.filter(d => fEnt === 'all' || d.entity_id === fEnt);
    const now = new Date();
    return {
      draft: a.filter(d => d.status === 'draft').length,
      sent: a.filter(d => d.status === 'sent').length,
      accepted: a.filter(d => ['accepted', 'scheduled', 'flight_requested', 'flight_approved'].includes(d.status)).length,
      toInv: a.filter(d => d.status === 'completed').length,
      flights: a.filter(d => ['accepted', 'scheduled'].includes(d.status) && !d.flight_approved).length,
      reminders: a.filter(d => {
        if (d.status !== 'invoiced' || !d.completed_date || d.reminder_done) return false;
        const y = new Date(d.completed_date);
        y.setFullYear(y.getFullYear() + 1);
        return now >= new Date(y.getTime() - 60 * 864e5);
      }).length,
      totalHT: a.filter(d => ['accepted', 'scheduled', 'flight_requested', 'flight_approved', 'completed', 'invoiced'].includes(d.status)).reduce((s, d) => s + (d.total_ht || 0), 0)
    };
  }, [st.devis, fEnt]);
  const nav = [{
    id: 'dashboard',
    l: 'Tableau de bord',
    sl: 'Accueil',
    i: Ic.home
  }, {
    id: 'devis',
    l: 'Devis',
    sl: 'Devis',
    i: Ic.file,
    b: cnt.draft
  }, {
    id: 'planning',
    l: 'Planning',
    sl: 'Planning',
    i: Ic.cal
  }, {
    id: 'flights',
    l: 'Notif. vol',
    sl: 'Vols',
    i: Ic.plane,
    b: cnt.flights
  }, {
    id: 'mapview',
    l: 'Carte',
    sl: 'Carte',
    i: Ic.map
  }, {
    id: 'invoices',
    l: 'Factures',
    sl: 'Factures',
    i: Ic.inv,
    b: cnt.toInv
  }, {
    id: 'reminders',
    l: 'Rappels',
    sl: 'Rappels',
    i: Ic.bell,
    b: cnt.reminders
  }, {
    id: 'catalog',
    l: 'Catalogue',
    sl: 'Catalogue',
    i: Ic.cat
  }];
  const mNav = [nav[0], nav[1], nav[2], nav[4], nav[7]];
  const vt = {
    dashboard: 'Tableau de bord',
    devis: 'Gestion des devis',
    planning: 'Planning',
    flights: 'Notifications de vol',
    mapview: 'Carte des chantiers',
    invoices: 'Factures',
    reminders: 'Rappels',
    catalog: 'Catalogue'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-dot"
  }), /*#__PURE__*/React.createElement("h1", null, "GESTION CLIENTS")), /*#__PURE__*/React.createElement("nav", {
    className: "sb-nav"
  }, nav.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    className: `sb-item ${view === n.id ? 'act' : ''}`,
    onClick: () => setView(n.id)
  }, n.i({
    s: 17
  }), /*#__PURE__*/React.createElement("span", null, n.l), n.b > 0 && /*#__PURE__*/React.createElement("span", {
    className: "badge"
  }, n.b)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 8px 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-label"
  }, "Structure"), [{
    id: 'all',
    l: 'Toutes',
    c: '#748FFC'
  }, ...st.ents.map(e => ({
    id: e.id,
    l: e.name,
    c: e.color
  }))].map(e => /*#__PURE__*/React.createElement("div", {
    key: e.id,
    className: `sb-ent ${fEnt === e.id ? 'sel' : ''}`,
    style: {
      background: fEnt === e.id ? e.c + '20' : 'transparent',
      color: fEnt === e.id ? e.c : '#909296'
    },
    onClick: () => setFEnt(e.id)
  }, /*#__PURE__*/React.createElement("span", null, e.l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 8px 16px',
      borderTop: '1px solid rgba(255,255,255,.06)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-item",
    onClick: () => sb.auth.signOut()
  }, Ic.out({
    s: 17
  }), /*#__PURE__*/React.createElement("span", null, "D\xE9connexion")))), /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("h2", null, vt[view]), /*#__PURE__*/React.createElement("div", {
    className: "top-acts"
  }, /*#__PURE__*/React.createElement("select", {
    className: "fs ent-flt-m",
    style: {
      width: 'auto',
      fontSize: 12,
      padding: '5px 30px 5px 8px'
    },
    value: fEnt,
    onChange: e => setFEnt(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "Toutes"), st.ents.map(e => /*#__PURE__*/React.createElement("option", {
    key: e.id,
    value: e.id
  }, e.name))), view === 'devis' && /*#__PURE__*/React.createElement("div", {
    className: "search-bar"
  }, Ic.search({
    s: 15,
    c: '#ADB5BD'
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Rechercher\u2026",
    value: search,
    onChange: e => setSearch(e.target.value)
  })), view === 'devis' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-p btn-sm",
    onClick: () => setModal({
      t: 'newD'
    })
  }, Ic.plus({
    s: 14
  }), " Nouveau"))), /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, view === 'dashboard' && /*#__PURE__*/React.createElement(Dash, {
    st: st,
    cnt: cnt,
    eMap: eMap,
    fEnt: fEnt,
    go: setView
  }), view === 'devis' && /*#__PURE__*/React.createElement(DList, {
    devis: fd,
    st: st,
    eMap: eMap,
    sm: setModal
  }), view === 'planning' && /*#__PURE__*/React.createElement(Plan, {
    devis: fd,
    eMap: eMap,
    sm: setModal
  }), view === 'flights' && /*#__PURE__*/React.createElement(Flt, {
    devis: fd,
    st: st,
    eMap: eMap,
    show: show
  }), view === 'mapview' && /*#__PURE__*/React.createElement(MapPg, {
    devis: fd,
    ents: st.ents
  }), view === 'invoices' && /*#__PURE__*/React.createElement(Inv, {
    devis: fd,
    st: st,
    eMap: eMap,
    show: show
  }), view === 'reminders' && /*#__PURE__*/React.createElement(Rem, {
    devis: fd,
    st: st,
    eMap: eMap,
    show: show
  }), view === 'catalog' && /*#__PURE__*/React.createElement(Cat, {
    st: st,
    sm: setModal
  }))), /*#__PURE__*/React.createElement("nav", {
    className: "btmbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "btm-inner"
  }, mNav.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    className: `btm-item ${view === n.id ? 'act' : ''}`,
    onClick: () => setView(n.id)
  }, n.i({
    s: 20
  }), /*#__PURE__*/React.createElement("span", null, n.sl), n.b > 0 && /*#__PURE__*/React.createElement("span", {
    className: "badge"
  }, n.b))))), modal?.t === 'newD' && /*#__PURE__*/React.createElement(DForm, {
    st: st,
    eMap: eMap,
    onClose: () => setModal(null),
    de: modal.d,
    show: show
  }), modal?.t === 'viewD' && /*#__PURE__*/React.createElement(DPrev, {
    st: st,
    eMap: eMap,
    d: modal.d,
    onClose: () => setModal(null),
    sm: setModal,
    show: show
  }), modal?.t === 'sched' && /*#__PURE__*/React.createElement(SchedM, {
    d: modal.d,
    st: st,
    onClose: () => setModal(null),
    show: show
  }), modal?.t === 'catI' && /*#__PURE__*/React.createElement(CatForm, {
    st: st,
    onClose: () => setModal(null),
    item: modal.item,
    show: show
  }), modal?.t === 'tplI' && /*#__PURE__*/React.createElement(TplForm, {
    st: st,
    onClose: () => setModal(null),
    tpl: modal.tpl,
    show: show
  }), toast && /*#__PURE__*/React.createElement(Toast, {
    msg: toast,
    onDone: () => setToast(null)
  }));
}

// ============================================================
// DASHBOARD
// ============================================================
function Dash({
  st,
  cnt,
  eMap,
  fEnt,
  go
}) {
  const all = st.devis.filter(d => fEnt === 'all' || d.entity_id === fEnt);
  const up = all.filter(d => d.intervention_date && ['scheduled', 'flight_requested', 'flight_approved'].includes(d.status)).sort((a, b) => new Date(a.intervention_date) - new Date(b.intervention_date)).slice(0, 5);
  const rec = [...all].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "stats-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-l"
  }, "CA accept\xE9 (HT)"), /*#__PURE__*/React.createElement("div", {
    className: "stat-v",
    style: {
      color: 'var(--ok)'
    }
  }, fEuro(cnt.totalHT))), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-l"
  }, "Devis en cours"), /*#__PURE__*/React.createElement("div", {
    className: "stat-v"
  }, cnt.sent), /*#__PURE__*/React.createElement("div", {
    className: "stat-s"
  }, "en attente")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-l"
  }, "\xC0 planifier"), /*#__PURE__*/React.createElement("div", {
    className: "stat-v",
    style: {
      color: 'var(--warn)'
    }
  }, cnt.accepted)), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-l"
  }, "\xC0 facturer"), /*#__PURE__*/React.createElement("div", {
    className: "stat-v",
    style: {
      color: 'var(--err)'
    }
  }, cnt.toInv))), /*#__PURE__*/React.createElement("div", {
    className: "dash-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-t"
  }, "Prochaines interventions"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-g btn-xs",
    onClick: () => go('planning')
  }, "Voir \u2192")), up.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-t"
  }, "Aucune intervention")) : up.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    className: "alert-r w",
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, d.client_name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-sec)'
    }
  }, "N\xB0", d.number, " \xB7 ", fDate(d.intervention_date))), /*#__PURE__*/React.createElement(ETag, {
    e: eMap[d.entity_id]
  }), /*#__PURE__*/React.createElement(Status, {
    s: d.status
  })))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-t"
  }, "Derniers devis"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-g btn-xs",
    onClick: () => go('devis')
  }, "Voir \u2192")), rec.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-t"
  }, "Aucun devis")) : rec.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 0',
      borderBottom: '1px solid var(--border-light)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 120
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 13
    }
  }, d.client_name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-mut)',
      marginLeft: 8
    }
  }, "N\xB0", d.number)), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 12
    }
  }, fEuro(d.total_ttc)), /*#__PURE__*/React.createElement(ETag, {
    e: eMap[d.entity_id]
  }), /*#__PURE__*/React.createElement(Status, {
    s: d.status
  }))))));
}

// ============================================================
// DEVIS LIST
// ============================================================
function DList({
  devis,
  st,
  eMap,
  sm
}) {
  return devis.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-i"
  }, "\uD83D\uDCC4"), /*#__PURE__*/React.createElement("div", {
    className: "empty-t"
  }, "Aucun devis"))) : /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tw"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "N\xB0"), /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Client"), /*#__PURE__*/React.createElement("th", null, "Structure"), /*#__PURE__*/React.createElement("th", null, "TTC"), /*#__PURE__*/React.createElement("th", null, "Statut"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, devis.map(d => /*#__PURE__*/React.createElement("tr", {
    key: d.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, d.number), /*#__PURE__*/React.createElement("td", null, fDate(d.created_at)), /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 550
    }
  }, d.client_name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(ETag, {
    e: eMap[d.entity_id]
  })), /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, fEuro(d.total_ttc)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Status, {
    s: d.status
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-g btn-xs",
    onClick: () => sm({
      t: 'viewD',
      d
    })
  }, Ic.eye({
    s: 14
  })), d.status === 'draft' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-g btn-xs",
    onClick: () => sm({
      t: 'newD',
      d
    })
  }, Ic.edit({
    s: 14
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-g btn-xs",
    onClick: async () => {
      if (confirm('Supprimer ?')) await st.deleteDevis(d.id);
    }
  }, Ic.trash({
    s: 14,
    c: '#C92A2A'
  }))))))))));
}

// ============================================================
// PLANNING / FLIGHTS / MAP / INVOICES / REMINDERS
// ============================================================
function Plan({
  devis,
  eMap,
  sm
}) {
  const s = devis.filter(d => d.intervention_date && ['scheduled', 'flight_requested', 'flight_approved'].includes(d.status)).sort((a, b) => new Date(a.intervention_date) - new Date(b.intervention_date));
  return /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-t"
  }, "Interventions \xE0 venir")), s.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-t"
  }, "Aucune intervention")) : /*#__PURE__*/React.createElement("div", {
    className: "tw"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "N\xB0"), /*#__PURE__*/React.createElement("th", null, "Client"), /*#__PURE__*/React.createElement("th", null, "Lieu"), /*#__PURE__*/React.createElement("th", null, "Structure"), /*#__PURE__*/React.createElement("th", null, "Statut"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, s.map(d => {
    const dd = dDiff(new Date(), d.intervention_date);
    return /*#__PURE__*/React.createElement("tr", {
      key: d.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600
      }
    }, fDate(d.intervention_date)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: dd <= 3 ? 'var(--err)' : 'var(--text-mut)'
      }
    }, dd <= 0 ? "Aujourd'hui" : dd === 1 ? 'Demain' : `J-${dd}`)), /*#__PURE__*/React.createElement("td", {
      className: "mono"
    }, d.number), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 550
      }
    }, d.client_name), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, d.client_city || d.delivery_city), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(ETag, {
      e: eMap[d.entity_id]
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Status, {
      s: d.status
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-g btn-xs",
      onClick: () => sm({
        t: 'viewD',
        d
      })
    }, Ic.eye({
      s: 14
    }))));
  })))));
}
function Flt({
  devis,
  st,
  eMap,
  show
}) {
  const n = devis.filter(d => ['accepted', 'scheduled', 'flight_requested'].includes(d.status));
  const mk = async (id, t) => {
    if (t === 'req') await st.updateStatus(id, 'flight_requested', {
      flight_requested: true
    });
    if (t === 'ok') await st.updateStatus(id, 'flight_approved', {
      flight_approved: true
    });
    show('Mis à jour');
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-t"
  }, "Notifications de vol")), n.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-t"
  }, "Aucune notification")) : /*#__PURE__*/React.createElement("div", {
    className: "tw"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "N\xB0"), /*#__PURE__*/React.createElement("th", null, "Client"), /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Structure"), /*#__PURE__*/React.createElement("th", null, "Demand\xE9"), /*#__PURE__*/React.createElement("th", null, "Approuv\xE9"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, n.map(d => /*#__PURE__*/React.createElement("tr", {
    key: d.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, d.number), /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 550
    }
  }, d.client_name), /*#__PURE__*/React.createElement("td", null, d.intervention_date ? fDate(d.intervention_date) : '—'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(ETag, {
    e: eMap[d.entity_id]
  })), /*#__PURE__*/React.createElement("td", null, d.flight_requested ? '✅' : '⬜'), /*#__PURE__*/React.createElement("td", null, d.flight_approved ? '✅' : '⬜'), /*#__PURE__*/React.createElement("td", null, !d.flight_requested && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-o btn-xs",
    onClick: () => mk(d.id, 'req')
  }, "Demand\xE9"), d.flight_requested && !d.flight_approved && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ok btn-xs",
    onClick: () => mk(d.id, 'ok')
  }, "Approuv\xE9"))))))));
}
function MapPg({
  devis,
  ents
}) {
  const wc = devis.filter(d => d.delivery_lat);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      fontSize: 13,
      color: 'var(--text-sec)'
    }
  }, wc.length, " chantier", wc.length > 1 ? 's' : '', " g\xE9olocalis\xE9", wc.length > 1 ? 's' : ''), /*#__PURE__*/React.createElement(MapView, {
    devisList: devis,
    entities: ents
  }));
}
function Inv({
  devis,
  st,
  eMap,
  show
}) {
  const ti = devis.filter(d => d.status === 'completed');
  const ri = devis.filter(d => d.status === 'invoiced').slice(0, 10);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-t"
  }, "Factures \xE0 \xE9diter")), ti.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-t"
  }, "Aucune facture en attente")) : /*#__PURE__*/React.createElement("div", {
    className: "tw"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "N\xB0"), /*#__PURE__*/React.createElement("th", null, "Client"), /*#__PURE__*/React.createElement("th", null, "R\xE9alis\xE9"), /*#__PURE__*/React.createElement("th", null, "Structure"), /*#__PURE__*/React.createElement("th", null, "Montant"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, ti.map(d => /*#__PURE__*/React.createElement("tr", {
    key: d.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, d.number), /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 550
    }
  }, d.client_name), /*#__PURE__*/React.createElement("td", null, fDate(d.completed_date)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(ETag, {
    e: eMap[d.entity_id]
  })), /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, fEuro(d.total_ttc)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-p btn-xs",
    onClick: async () => {
      await st.updateStatus(d.id, 'invoiced', {
        invoiced_date: new Date().toISOString()
      });
      show('Facturé');
    }
  }, Ic.check({
    s: 13
  }), " Factur\xE9")))))))), ri.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-t"
  }, "Derni\xE8res factures")), /*#__PURE__*/React.createElement("div", {
    className: "tw"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "N\xB0"), /*#__PURE__*/React.createElement("th", null, "Client"), /*#__PURE__*/React.createElement("th", null, "Factur\xE9"), /*#__PURE__*/React.createElement("th", null, "Structure"), /*#__PURE__*/React.createElement("th", null, "Montant"))), /*#__PURE__*/React.createElement("tbody", null, ri.map(d => /*#__PURE__*/React.createElement("tr", {
    key: d.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, d.number), /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 550
    }
  }, d.client_name), /*#__PURE__*/React.createElement("td", null, fDate(d.invoiced_date)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(ETag, {
    e: eMap[d.entity_id]
  })), /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, fEuro(d.total_ttc)))))))));
}
function Rem({
  devis,
  st,
  eMap,
  show
}) {
  const now = new Date();
  const items = devis.filter(d => d.status === 'invoiced' && d.completed_date && !d.reminder_done).map(d => {
    const y = new Date(d.completed_date);
    y.setFullYear(y.getFullYear() + 1);
    return {
      ...d,
      rd: y,
      du: dDiff(now, y)
    };
  }).filter(d => d.du <= 60).sort((a, b) => a.du - b.du);
  return /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-t"
  }, "V\xE9rifications \xE0 effectuer")), items.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-t"
  }, "Aucun rappel")) : /*#__PURE__*/React.createElement("div", {
    className: "tw"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "N\xB0"), /*#__PURE__*/React.createElement("th", null, "Client"), /*#__PURE__*/React.createElement("th", null, "R\xE9alis\xE9"), /*#__PURE__*/React.createElement("th", null, "\xC9ch\xE9ance"), /*#__PURE__*/React.createElement("th", null, "Jours"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, items.map(d => /*#__PURE__*/React.createElement("tr", {
    key: d.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, d.number), /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 550
    }
  }, d.client_name), /*#__PURE__*/React.createElement("td", null, fDate(d.completed_date)), /*#__PURE__*/React.createElement("td", null, fDate(d.rd)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: d.du <= 0 ? 'var(--err)' : 'var(--warn)'
    }
  }, d.du <= 0 ? 'DÉPASSÉ' : `J-${d.du}`)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ok btn-xs",
    onClick: async () => {
      await st.updateDevis(d.id, {
        reminder_done: true
      });
      show('Fait');
    }
  }, Ic.check({
    s: 13
  }), " Fait"))))))));
}

// ============================================================
// CATALOG
// ============================================================
function Cat({
  st,
  sm
}) {
  const [tab, setTab] = useState('services');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab ${tab === 'services' ? 'act' : ''}`,
    onClick: () => setTab('services')
  }, "Prestations (", st.svcs.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: `tab ${tab === 'consumables' ? 'act' : ''}`,
    onClick: () => setTab('consumables')
  }, "Consommables (", st.cons.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: `tab ${tab === 'templates' ? 'act' : ''}`,
    onClick: () => setTab('templates')
  }, "Mod\xE8les (", st.tpls.length, ")")), tab === 'templates' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-p btn-sm",
    onClick: () => sm({
      t: 'tplI'
    })
  }, Ic.plus({
    s: 14
  }), " Nouveau mod\xE8le")), st.tpls.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-h"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-t"
  }, t.name), t.category && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      padding: '1px 8px',
      borderRadius: 4,
      background: 'var(--bg)',
      color: 'var(--text-sec)',
      fontWeight: 600
    }
  }, t.category)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-g btn-xs",
    onClick: () => sm({
      t: 'tplI',
      tpl: t
    })
  }, Ic.edit({
    s: 13
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-g btn-xs",
    onClick: async () => {
      if (confirm('Supprimer ?')) await st.deleteTpl(t.id);
    }
  }, Ic.trash({
    s: 13,
    c: '#C92A2A'
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      whiteSpace: 'pre-line',
      fontSize: 12.5,
      color: '#495057',
      maxHeight: 100,
      overflow: 'hidden',
      position: 'relative'
    }
  }, t.description, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 30,
      background: 'linear-gradient(transparent,white)'
    }
  }))))) : /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0
    }
  }, tab === 'services' ? /*#__PURE__*/React.createElement("div", {
    className: "tw"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "D\xE9signation"), /*#__PURE__*/React.createElement("th", null, "Prix/m\xB2"), /*#__PURE__*/React.createElement("th", null, "Cat\xE9gorie"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 100
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-p btn-xs",
    onClick: () => sm({
      t: 'catI',
      item: {
        itemType: 'service'
      }
    })
  }, Ic.plus({
    s: 12
  }))))), /*#__PURE__*/React.createElement("tbody", null, st.svcs.map(s => /*#__PURE__*/React.createElement("tr", {
    key: s.id
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 550
    }
  }, s.designation), /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, s.prix_m2?.toFixed(2), " \u20AC/m\xB2"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      padding: '2px 8px',
      borderRadius: 4,
      background: 'var(--bg)'
    }
  }, s.category)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-g btn-xs",
    onClick: () => sm({
      t: 'catI',
      item: {
        ...s,
        itemType: 'service'
      }
    })
  }, Ic.edit({
    s: 13
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-g btn-xs",
    onClick: async () => {
      if (confirm('Supprimer ?')) await st.deleteSvc(s.id);
    }
  }, Ic.trash({
    s: 13,
    c: '#C92A2A'
  }))))))))) : /*#__PURE__*/React.createElement("div", {
    className: "tw"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "D\xE9signation"), /*#__PURE__*/React.createElement("th", null, "Prix/L"), /*#__PURE__*/React.createElement("th", null, "Conso/m\xB2"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 100
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-p btn-xs",
    onClick: () => sm({
      t: 'catI',
      item: {
        itemType: 'consumable'
      }
    })
  }, Ic.plus({
    s: 12
  }))))), /*#__PURE__*/React.createElement("tbody", null, st.cons.map(c => /*#__PURE__*/React.createElement("tr", {
    key: c.id
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 550
    }
  }, c.designation), /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, c.prix_litre?.toFixed(2), " \u20AC"), /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, c.conso_m2, " L/m\xB2"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-g btn-xs",
    onClick: () => sm({
      t: 'catI',
      item: {
        ...c,
        itemType: 'consumable'
      }
    })
  }, Ic.edit({
    s: 13
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-g btn-xs",
    onClick: async () => {
      if (confirm('Supprimer ?')) await st.deleteCons(c.id);
    }
  }, Ic.trash({
    s: 13,
    c: '#C92A2A'
  })))))))))));
}

// ============================================================
// DEVIS FORM MODAL
// ============================================================
function DForm({
  st,
  eMap,
  onClose,
  de,
  show
}) {
  const isE = !!de;
  const [ent, setEnt] = useState(de?.entity_id || st.ents[0]?.id || 'drone85');
  const [cn, setCn] = useState(de?.client_name || '');
  const [ca, setCa] = useState(de?.client_address || '');
  const [cp, setCp] = useState(de?.client_postal || '');
  const [cc, setCc] = useState(de?.client_city || '');
  const [da, setDa] = useState(de?.delivery_address || '');
  const [dp, setDp] = useState(de?.delivery_postal || '');
  const [dc, setDc] = useState(de?.delivery_city || '');
  const [dlat, setDlat] = useState(de?.delivery_lat || null);
  const [dlng, setDlng] = useState(de?.delivery_lng || null);
  const [vd, setVd] = useState(de?.validity_days || 30);
  const [desc, setDesc] = useState(de?.description || '');
  const [title, setTitle] = useState(de?.title || '');
  const [m2, setM2] = useState(de?.surface_m2 || '');
  const [lines, setLines] = useState([]);
  const [saving, setSaving] = useState(false);
  const loaded = useRef(false);
  const e = eMap[ent] || st.ents[0];
  useEffect(() => {
    if (isE && !loaded.current) {
      loaded.current = true;
      st.fetchLines(de.id).then(dl => setLines(dl.map(l => ({
        _k: Math.random().toString(36).slice(2),
        line_type: l.line_type,
        catalog_ref: l.catalog_ref,
        designation: l.designation,
        qty: l.qty,
        unit: l.unit,
        prix_unit: l.prix_unit,
        tva_rate: l.tva_rate
      }))));
    }
  }, [isE]);
  const addL = t => setLines(p => [...p, {
    _k: Math.random().toString(36).slice(2),
    line_type: t,
    catalog_ref: null,
    designation: '',
    qty: t === 'service' ? parseFloat(m2) || 0 : 0,
    unit: t === 'consumable' ? 'litres' : 'm²',
    prix_unit: 0,
    tva_rate: e?.tva_rate ?? 20
  }]);
  const updL = (k, f, v) => setLines(p => p.map(l => {
    if (l._k !== k) return l;
    const u = {
      ...l,
      [f]: v
    };
    if (f === 'catalog_ref' && v) {
      if (l.line_type === 'service') {
        const c = st.svcs.find(s => s.id === v);
        if (c) {
          u.designation = c.designation;
          u.prix_unit = c.prix_m2;
          u.qty = parseFloat(m2) || 0;
          u.unit = 'm²';
        }
      } else if (l.line_type === 'consumable') {
        const c = st.cons.find(x => x.id === v);
        if (c) {
          u.designation = c.designation;
          u.prix_unit = c.prix_litre;
          u.qty = m2 ? Math.ceil(parseFloat(m2) * c.conso_m2 * 10) / 10 : 0;
          u.unit = c.unit;
        }
      }
    }
    return u;
  }));
  const rmL = k => setLines(p => p.filter(l => l._k !== k));
  const applyTpl = t => {
    setDesc(t.description || '');
    if (t.title) setTitle(t.title);
    const nl = [];
    (t.default_services || []).forEach(sid => {
      const c = st.svcs.find(s => s.id === sid);
      if (c) nl.push({
        _k: Math.random().toString(36).slice(2),
        line_type: 'service',
        catalog_ref: sid,
        designation: c.designation,
        qty: parseFloat(m2) || 0,
        unit: 'm²',
        prix_unit: c.prix_m2,
        tva_rate: e?.tva_rate ?? 20
      });
    });
    (t.default_consumables || []).forEach(cid => {
      const c = st.cons.find(x => x.id === cid);
      if (c) {
        const l = m2 ? Math.ceil(parseFloat(m2) * c.conso_m2 * 10) / 10 : 0;
        nl.push({
          _k: Math.random().toString(36).slice(2),
          line_type: 'consumable',
          catalog_ref: cid,
          designation: c.designation,
          qty: l,
          unit: c.unit,
          prix_unit: c.prix_litre,
          tva_rate: e?.tva_rate ?? 20
        });
      }
    });
    if (nl.length) setLines(nl);
  };
  const tHT = lines.reduce((s, l) => s + (l.qty || 0) * (l.prix_unit || 0), 0);
  const tTVA = lines.reduce((s, l) => s + (l.qty || 0) * (l.prix_unit || 0) * ((l.tva_rate || 0) / 100), 0);
  const tTTC = tHT + tTVA;
  const save = async draft => {
    if (!cn) {
      alert('Nom requis');
      return;
    }
    setSaving(true);
    const dd = {
      entity_id: ent,
      client_name: cn,
      client_address: ca,
      client_postal: cp,
      client_city: cc,
      delivery_address: da,
      delivery_postal: dp,
      delivery_city: dc,
      delivery_lat: dlat,
      delivery_lng: dlng,
      title,
      description: desc,
      surface_m2: parseFloat(m2) || 0,
      validity_days: vd,
      total_ht: tHT,
      total_tva: tTVA,
      total_ttc: tTTC,
      status: draft ? 'draft' : 'sent'
    };
    const ld = lines.map(l => ({
      line_type: l.line_type,
      catalog_ref: l.catalog_ref,
      designation: l.designation,
      qty: l.qty,
      unit: l.unit,
      prix_unit: l.prix_unit,
      tva_rate: l.tva_rate
    }));
    if (isE) await st.updateDevis(de.id, dd, ld);else await st.createDevis(dd, ld);
    setSaving(false);
    show(isE ? 'Mis à jour' : 'Créé');
    onClose();
  };
  return /*#__PURE__*/React.createElement(Modal, {
    title: isE ? `Modifier N°${de.number}` : 'Nouveau devis',
    onClose: onClose,
    wide: true,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-o",
      onClick: onClose
    }, "Annuler"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-o",
      onClick: () => save(true),
      disabled: saving
    }, "Brouillon"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-p",
      onClick: () => save(false),
      disabled: saving
    }, saving ? '…' : 'Enregistrer'))
  }, /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Structure"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, st.ents.map(x => /*#__PURE__*/React.createElement("button", {
    key: x.id,
    className: "btn",
    style: {
      background: ent === x.id ? x.color : 'transparent',
      color: ent === x.id ? '#fff' : x.color,
      border: `2px solid ${x.color}`,
      fontWeight: 700,
      fontSize: 12
    },
    onClick: () => setEnt(x.id)
  }, x.name, x.tva_rate === 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      opacity: .8,
      marginLeft: 4
    }
  }, "(sans TVA)"))))), /*#__PURE__*/React.createElement("div", {
    className: "sec-t"
  }, "Client"), /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Nom *"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: cn,
    onChange: e => setCn(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Ville"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: cc,
    onChange: e => setCc(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Adresse"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: ca,
    onChange: e => setCa(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Code postal"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: cp,
    onChange: e => setCp(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sec-t"
  }, "Adresse du chantier"), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Recherche d'adresse"), /*#__PURE__*/React.createElement(AddrSearch, {
    value: da,
    onChange: v => setDa(v),
    onSelect: s => {
      setDa(s.name);
      setDp(s.postcode);
      setDc(s.city);
      setDlat(s.lat);
      setDlng(s.lng);
    },
    placeholder: "Tapez l'adresse du chantier\u2026"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fhint"
  }, "G\xE9olocalisation auto sur la carte")), /*#__PURE__*/React.createElement("div", {
    className: "form-row-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Adresse"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: da,
    onChange: e => setDa(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "CP"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: dp,
    onChange: e => setDp(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Ville"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: dc,
    onChange: e => setDc(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sec-t"
  }, "Devis"), /*#__PURE__*/React.createElement("div", {
    className: "form-row-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Intitul\xE9"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: title,
    onChange: e => setTitle(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Surface (m\xB2)"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    type: "number",
    value: m2,
    onChange: e => setM2(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Validit\xE9 (j)"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    type: "number",
    value: vd,
    onChange: e => setVd(parseInt(e.target.value) || 30)
  }))), st.tpls.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Mod\xE8le"), /*#__PURE__*/React.createElement("div", {
    className: "tpl-btns"
  }, st.tpls.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: "btn btn-xs btn-o",
    onClick: () => applyTpl(t)
  }, Ic.tpl({
    s: 12
  }), " ", t.name)))), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Description / D\xE9roul\xE9"), /*#__PURE__*/React.createElement("textarea", {
    className: "ft",
    rows: 6,
    value: desc,
    onChange: e => setDesc(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "sec-t"
  }, "Lignes"), /*#__PURE__*/React.createElement("div", {
    className: "line-item line-hdr"
  }, /*#__PURE__*/React.createElement("div", null, "D\xE9signation"), /*#__PURE__*/React.createElement("div", null, "Quantit\xE9"), /*#__PURE__*/React.createElement("div", null, "Unit\xE9"), /*#__PURE__*/React.createElement("div", null, "Prix unit."), /*#__PURE__*/React.createElement("div", null, "Montant HT"), /*#__PURE__*/React.createElement("div", null)), lines.map(l => /*#__PURE__*/React.createElement("div", {
    key: l._k,
    className: "line-item"
  }, /*#__PURE__*/React.createElement("div", null, l.line_type === 'service' ? /*#__PURE__*/React.createElement("select", {
    className: "fs",
    value: l.catalog_ref || '',
    onChange: e => updL(l._k, 'catalog_ref', e.target.value),
    style: {
      fontSize: 12.5
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Prestation \u2014"), st.svcs.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.id,
    value: s.id
  }, s.designation, " (", s.prix_m2, "\u20AC/m\xB2)"))) : l.line_type === 'consumable' ? /*#__PURE__*/React.createElement("select", {
    className: "fs",
    value: l.catalog_ref || '',
    onChange: e => updL(l._k, 'catalog_ref', e.target.value),
    style: {
      fontSize: 12.5
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Consommable \u2014"), st.cons.map(c => /*#__PURE__*/React.createElement("option", {
    key: c.id,
    value: c.id
  }, c.designation, " (", c.conso_m2, "L/m\xB2)"))) : /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: l.designation,
    onChange: e => updL(l._k, 'designation', e.target.value),
    placeholder: "Ligne libre",
    style: {
      fontSize: 12.5
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    className: "fi mono",
    type: "number",
    step: "0.01",
    value: l.qty,
    onChange: e => updL(l._k, 'qty', parseFloat(e.target.value) || 0),
    style: {
      fontSize: 12,
      textAlign: 'right'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: l.unit,
    onChange: e => updL(l._k, 'unit', e.target.value),
    style: {
      fontSize: 12
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    className: "fi mono",
    type: "number",
    step: "0.01",
    value: l.prix_unit,
    onChange: e => updL(l._k, 'prix_unit', parseFloat(e.target.value) || 0),
    style: {
      fontSize: 12,
      textAlign: 'right'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 12.5,
      textAlign: 'right',
      fontWeight: 600
    }
  }, fEuro((l.qty || 0) * (l.prix_unit || 0))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-g btn-xs",
    onClick: () => rmL(l._k)
  }, Ic.trash({
    s: 13,
    c: '#C92A2A'
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-o btn-sm",
    onClick: () => addL('service')
  }, Ic.plus({
    s: 13
  }), " Prestation"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-o btn-sm",
    onClick: () => addL('consumable')
  }, Ic.plus({
    s: 13
  }), " Consommable"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-o btn-sm",
    onClick: () => addL('custom')
  }, Ic.plus({
    s: 13
  }), " Libre")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      marginTop: 20,
      padding: '12px 0',
      borderTop: '2px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      marginBottom: 4
    }
  }, "Total HT : ", /*#__PURE__*/React.createElement("strong", {
    className: "mono"
  }, fEuro(tHT))), (e?.tva_rate ?? 0) > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      marginBottom: 4
    }
  }, "TVA ", e.tva_rate, "% : ", /*#__PURE__*/React.createElement("strong", {
    className: "mono"
  }, fEuro(tTVA))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700
    }
  }, "Total TTC : ", /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, fEuro(tTTC))), (e?.tva_rate ?? 0) === 0 && e?.tva_mention && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-mut)',
      marginTop: 4
    }
  }, e.tva_mention)));
}

// ============================================================
// DEVIS PREVIEW MODAL
// ============================================================
function DPrev({
  st,
  eMap,
  d,
  onClose,
  sm,
  show
}) {
  const e = eMap[d.entity_id];
  const [lines, setLines] = useState([]);
  useEffect(() => {
    st.fetchLines(d.id).then(setLines);
  }, [d.id]);
  const cs = async (s, x = {}) => {
    await st.updateStatus(d.id, s, x);
    show('Mis à jour');
    onClose();
  };
  const acts = {
    draft: [{
      l: 'Envoyé',
      fn: () => cs('sent'),
      c: 'btn-p'
    }],
    sent: [{
      l: 'Accepté',
      fn: () => cs('accepted'),
      c: 'btn-ok'
    }, {
      l: 'Refusé',
      fn: () => cs('rejected'),
      c: 'btn-err'
    }],
    accepted: [{
      l: 'Planifier',
      fn: () => {
        onClose();
        sm({
          t: 'sched',
          d
        });
      },
      c: 'btn-p'
    }],
    scheduled: [{
      l: 'Vol demandé',
      fn: () => cs('flight_requested', {
        flight_requested: true
      }),
      c: 'btn-o'
    }, {
      l: 'Vol approuvé',
      fn: () => cs('flight_approved', {
        flight_approved: true
      }),
      c: 'btn-ok'
    }, {
      l: 'Réalisé',
      fn: () => cs('completed', {
        completed_date: new Date().toISOString()
      }),
      c: 'btn-ok'
    }],
    flight_requested: [{
      l: 'Vol approuvé',
      fn: () => cs('flight_approved', {
        flight_approved: true
      }),
      c: 'btn-ok'
    }],
    flight_approved: [{
      l: 'Réalisé',
      fn: () => cs('completed', {
        completed_date: new Date().toISOString()
      }),
      c: 'btn-ok'
    }],
    completed: [{
      l: 'Facturé',
      fn: () => cs('invoiced', {
        invoiced_date: new Date().toISOString()
      }),
      c: 'btn-p'
    }]
  };
  const a = acts[d.status] || [];
  return /*#__PURE__*/React.createElement(Modal, {
    title: `Devis N°${d.number}`,
    onClose: onClose,
    wide: true,
    footer: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        width: '100%',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Status, {
      s: d.status
    }), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-o btn-sm",
      onClick: () => dlPDF(d, e, lines)
    }, Ic.pdf({
      s: 13
    }), " PDF")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap'
      }
    }, d.status === 'draft' && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-o btn-sm",
      onClick: () => {
        onClose();
        sm({
          t: 'newD',
          d
        });
      }
    }, Ic.edit({
      s: 13
    }), " Modifier"), a.map((x, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      className: `btn btn-sm ${x.c}`,
      onClick: x.fn
    }, x.l))))
  }, /*#__PURE__*/React.createElement("div", {
    className: "dp"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dp-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dp-ent"
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: e?.color
    }
  }, e?.name), e?.legal_name, /*#__PURE__*/React.createElement("br", null), e?.address, /*#__PURE__*/React.createElement("br", null), e?.postal_code, " ", e?.city, e?.phone && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), "T\xE9l : ", e.phone)), /*#__PURE__*/React.createElement("div", {
    className: "dp-cli"
  }, /*#__PURE__*/React.createElement("strong", null, d.client_name), d.client_address && /*#__PURE__*/React.createElement(React.Fragment, null, d.client_address, /*#__PURE__*/React.createElement("br", null)), d.client_postal, " ", d.client_city, /*#__PURE__*/React.createElement("br", null), "France")), /*#__PURE__*/React.createElement("div", {
    className: "dp-tit"
  }, "Devis N\xB0 ", d.number), d.title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 13,
      marginBottom: 4
    }
  }, d.title), /*#__PURE__*/React.createElement("div", {
    className: "dp-meta"
  }, "\xC9mission : ", fDate(d.created_at), " \xB7 Validit\xE9 : ", d.validity_days, " jours"), d.description && /*#__PURE__*/React.createElement("div", {
    className: "dp-desc"
  }, d.description), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['Désignation', 'Qté', 'Unité', 'PU', 'TVA', 'Montant HT'].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      background: e?.color || 'var(--pri)',
      color: '#fff',
      fontSize: 10,
      padding: '8px 10px',
      textAlign: i === 5 ? 'right' : 'left'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, lines.map((l, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, l.designation), /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, Number(l.qty).toLocaleString('fr-FR', {
    minimumFractionDigits: 2
  })), /*#__PURE__*/React.createElement("td", null, l.unit), /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, Number(l.prix_unit).toFixed(2)), /*#__PURE__*/React.createElement("td", null, l.tva_rate, "%"), /*#__PURE__*/React.createElement("td", {
    className: "mono",
    style: {
      textAlign: 'right',
      fontWeight: 600
    }
  }, fEuro(l.qty * l.prix_unit)))))), /*#__PURE__*/React.createElement("div", {
    className: "dp-tot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tl"
  }, "Total HT : ", /*#__PURE__*/React.createElement("strong", null, fEuro(d.total_ht))), (e?.tva_rate ?? 0) > 0 && /*#__PURE__*/React.createElement("div", {
    className: "tl"
  }, "TVA ", e.tva_rate, "% : ", /*#__PURE__*/React.createElement("strong", null, fEuro(d.total_tva))), /*#__PURE__*/React.createElement("div", {
    className: "tl ttc"
  }, "Total TTC : ", fEuro(d.total_ttc))), /*#__PURE__*/React.createElement("div", {
    className: "dp-foot"
  }, e?.tva_mention && /*#__PURE__*/React.createElement("div", null, e.tva_mention), e?.cgv && /*#__PURE__*/React.createElement("div", null, e.cgv), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, "SIREN ", e?.siren, e?.naf && ` - NAF ${e.naf}`, e?.rcs && ` - RCS ${e.rcs}`), e?.tva_intra && /*#__PURE__*/React.createElement("div", null, "TVA intracommunautaire : ", e.tva_intra), e?.iban && /*#__PURE__*/React.createElement("div", null, "IBAN: ", e.iban, " \xB7 BIC: ", e.bic), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      fontStyle: 'italic'
    }
  }, "Pour \xEAtre accept\xE9, le devis doit \xEAtre dat\xE9, sign\xE9 et suivi de la mention \xAB Bon pour accord \xBB."))));
}

// ============================================================
// SCHEDULE / CATALOG FORM / TEMPLATE FORM MODALS
// ============================================================
function SchedM({
  d,
  st,
  onClose,
  show
}) {
  const [dt, setDt] = useState(d.intervention_date || '');
  const [n, setN] = useState(d.intervention_notes || '');
  const save = async () => {
    if (!dt) {
      alert('Date requise');
      return;
    }
    await st.updateDevis(d.id, {
      intervention_date: dt,
      intervention_notes: n,
      status: 'scheduled'
    });
    show('Planifié');
    onClose();
  };
  return /*#__PURE__*/React.createElement(Modal, {
    title: `Planifier — ${d.client_name}`,
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-o",
      onClick: onClose
    }, "Annuler"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-p",
      onClick: save
    }, "Planifier"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Date"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    type: "date",
    value: dt,
    onChange: e => setDt(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Notes"), /*#__PURE__*/React.createElement("textarea", {
    className: "ft",
    value: n,
    onChange: e => setN(e.target.value)
  })));
}
function CatForm({
  st,
  onClose,
  item,
  show
}) {
  const isN = !item?.id;
  const [tp, setTp] = useState(item?.itemType || 'service');
  const [des, setDes] = useState(item?.designation || '');
  const [pm, setPm] = useState(item?.prix_m2 ?? '');
  const [cat, setCat] = useState(item?.category || '');
  const [pl, setPl] = useState(item?.prix_litre ?? '');
  const [cm, setCm] = useState(item?.conso_m2 ?? '');
  const [un, setUn] = useState(item?.unit || 'litres');
  const save = async () => {
    if (!des) {
      alert('Désignation requise');
      return;
    }
    if (tp === 'service') await st.upsertSvc({
      ...(item?.id ? {
        id: item.id
      } : {}),
      designation: des,
      prix_m2: parseFloat(pm) || 0,
      category: cat
    });else await st.upsertCons({
      ...(item?.id ? {
        id: item.id
      } : {}),
      designation: des,
      prix_litre: parseFloat(pl) || 0,
      conso_m2: parseFloat(cm) || 0,
      unit: un
    });
    show('OK');
    onClose();
  };
  return /*#__PURE__*/React.createElement(Modal, {
    title: isN ? 'Nouvel élément' : 'Modifier',
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-o",
      onClick: onClose
    }, "Annuler"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-p",
      onClick: save
    }, "OK"))
  }, isN && /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Type"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: `btn ${tp === 'service' ? 'btn-p' : 'btn-o'}`,
    onClick: () => setTp('service')
  }, "Prestation"), /*#__PURE__*/React.createElement("button", {
    className: `btn ${tp === 'consumable' ? 'btn-p' : 'btn-o'}`,
    onClick: () => setTp('consumable')
  }, "Consommable"))), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "D\xE9signation"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: des,
    onChange: e => setDes(e.target.value)
  })), tp === 'service' ? /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Prix/m\xB2"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    type: "number",
    step: "0.01",
    value: pm,
    onChange: e => setPm(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Cat\xE9gorie"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: cat,
    onChange: e => setCat(e.target.value)
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "form-row-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Prix/L"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    type: "number",
    step: "0.01",
    value: pl,
    onChange: e => setPl(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Conso/m\xB2"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    type: "number",
    step: "0.001",
    value: cm,
    onChange: e => setCm(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Unit\xE9"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: un,
    onChange: e => setUn(e.target.value)
  }))));
}
function TplForm({
  st,
  onClose,
  tpl,
  show
}) {
  const isE = !!tpl;
  const [nm, setNm] = useState(tpl?.name || '');
  const [cat, setCat] = useState(tpl?.category || '');
  const [ti, setTi] = useState(tpl?.title || '');
  const [desc, setDesc] = useState(tpl?.description || '');
  const [ds, setDs] = useState(tpl?.default_services || []);
  const [dc, setDc] = useState(tpl?.default_consumables || []);
  const tog = (a, s, id) => s(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const save = async () => {
    if (!nm || !desc) {
      alert('Nom et description requis');
      return;
    }
    await st.upsertTpl({
      ...(tpl?.id ? {
        id: tpl.id
      } : {}),
      name: nm,
      category: cat,
      title: ti,
      description: desc,
      default_services: ds,
      default_consumables: dc
    });
    show('OK');
    onClose();
  };
  return /*#__PURE__*/React.createElement(Modal, {
    title: isE ? `Modifier « ${tpl.name} »` : 'Nouveau modèle',
    onClose: onClose,
    wide: true,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-o",
      onClick: onClose
    }, "Annuler"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-p",
      onClick: save
    }, "OK"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Nom *"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: nm,
    onChange: e => setNm(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Cat\xE9gorie"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: cat,
    onChange: e => setCat(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Intitul\xE9 pr\xE9-rempli"), /*#__PURE__*/React.createElement("input", {
    className: "fi",
    value: ti,
    onChange: e => setTi(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "fg"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "D\xE9roul\xE9 *"), /*#__PURE__*/React.createElement("textarea", {
    className: "ft",
    rows: 10,
    value: desc,
    onChange: e => setDesc(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "sec-t"
  }, "Prestations par d\xE9faut"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 16
    }
  }, st.svcs.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: "btn btn-xs",
    onClick: () => tog(ds, setDs, s.id),
    style: {
      background: ds.includes(s.id) ? 'var(--pri)' : 'transparent',
      color: ds.includes(s.id) ? '#fff' : 'var(--text)',
      border: `1.5px solid ${ds.includes(s.id) ? 'var(--pri)' : 'var(--border)'}`,
      fontWeight: 550
    }
  }, ds.includes(s.id) ? '✓ ' : '', s.designation))), /*#__PURE__*/React.createElement("div", {
    className: "sec-t"
  }, "Consommables par d\xE9faut"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, st.cons.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    className: "btn btn-xs",
    onClick: () => tog(dc, setDc, c.id),
    style: {
      background: dc.includes(c.id) ? 'var(--warn)' : 'transparent',
      color: dc.includes(c.id) ? '#fff' : 'var(--text)',
      border: `1.5px solid ${dc.includes(c.id) ? 'var(--warn)' : 'var(--border)'}`,
      fontWeight: 550
    }
  }, dc.includes(c.id) ? '✓ ' : '', c.designation))));
}

// ============================================================
// RENDER
// ============================================================
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
