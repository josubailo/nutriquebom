/**
 * Design system compartilhado entre o admin (App.jsx) e o portal do paciente (PatientPortal.jsx).
 * Injetado via <style>{NP_STYLE}</style> em ambos os componentes.
 */
export const NP_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');

.np * { box-sizing: border-box; }
.np {
  --bg: #f4f6f3;
  --panel: #ffffff;
  --ink: #16241d;
  --ink-soft: #5d6f66;
  --line: #e4e9e3;
  --green: #1f9d63;
  --green-d: #157a4c;
  --green-soft: #e7f4ec;
  --p: #e5484d;
  --c: #f1932c;
  --f: #2d7ff9;
  --fib: #6aa84f;
  --kcal: #1f9d63;
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
  background: var(--bg);
  min-height: 100vh;
  font-size: 14px;
}
.np .serif { font-family: 'Fraunces', serif; }

.np .layout { display: flex; min-height: 100vh; }
.np .side {
  width: 232px; flex-shrink: 0; background: var(--panel);
  border-right: 1px solid var(--line); padding: 20px 14px;
  display: flex; flex-direction: column; gap: 4px; position: sticky; top: 0; height: 100vh;
  overflow-y: auto;
}
.np .brand { display:flex; align-items:center; gap:9px; padding: 4px 8px 18px; }
.np .brand .logo {
  width: 30px; height: 30px; border-radius: 9px;
  background: linear-gradient(135deg, var(--green), #2bbd7c);
  display:grid; place-items:center; color:#fff;
}
.np .brand b { font-family:'Fraunces',serif; font-size: 18px; font-weight: 700; }
.np .navlabel { font-size: 10.5px; letter-spacing: .12em; color: var(--ink-soft); font-weight:700; padding: 14px 10px 6px; text-transform: uppercase; }
.np .navitem {
  display:flex; align-items:center; gap:11px; padding: 9px 11px; border-radius: 10px;
  color: var(--ink-soft); cursor: pointer; font-weight: 500; border: none; background: none; width: 100%; text-align: left; font-size: 14px;
  transition: .15s;
}
.np .navitem:hover { background: var(--bg); color: var(--ink); }
.np .navitem.active { background: var(--green-soft); color: var(--green-d); font-weight: 600; }
.np .navitem.soon { opacity:.5; cursor: default; }
.np .navitem.soon:hover { background:none; color: var(--ink-soft); }
.np .badge-soon { margin-left:auto; font-size:9.5px; background:var(--line); color:var(--ink-soft); padding:1px 6px; border-radius:6px; font-weight:600; }

.np .main { flex: 1; padding: 30px 38px; max-width: 1180px; }
.np h1.title { font-family:'Fraunces',serif; font-size: 30px; font-weight: 600; margin: 0; }
.np h1.title span { color: var(--green); }
.np .sub { color: var(--ink-soft); margin: 4px 0 0; }

.np .btn {
  display:inline-flex; align-items:center; gap:7px; border: none; cursor: pointer;
  background: var(--green); color:#fff; padding: 10px 16px; border-radius: 11px; font-weight: 600; font-size: 14px;
  font-family:'DM Sans',sans-serif; transition:.15s;
}
.np .btn:hover { background: var(--green-d); }
.np .btn.ghost { background:#fff; color: var(--ink); border:1px solid var(--line); }
.np .btn.ghost:hover { background: var(--bg); }
.np .btn.sm { padding: 7px 12px; font-size: 13px; border-radius:9px; }
.np .btn.danger { background:#fff; color:var(--p); border:1px solid #f3d2d3; }
.np .btn:disabled { opacity: .55; cursor: default; }

.np .field { background:#fff; border:1px solid var(--line); border-radius: 12px; padding: 11px 13px; width:100%; font-size:14px; color:var(--ink); font-family:'DM Sans',sans-serif; outline:none; }
.np .field:focus { border-color: var(--green); box-shadow: 0 0 0 3px var(--green-soft); }
.np select.field { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%235d6f66' stroke-width='2'%3E%3Cpath d='M3 5l4 4 4-4'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position: right 13px center; padding-right:34px; }
.np label.lbl { font-size: 12.5px; font-weight:600; color:var(--ink-soft); display:flex; align-items:center; gap:6px; margin-bottom:6px; }

.np .searchbar { position:relative; flex:1; }
.np .searchbar svg { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--ink-soft); }
.np .searchbar input { padding-left:40px; }

.np .grid-cards { display:grid; grid-template-columns: repeat(auto-fill, minmax(320px,1fr)); gap:16px; margin-top:20px; }
.np .pcard { background:#fff; border:1px solid var(--line); border-radius:16px; padding:18px; transition:.15s; }
.np .pcard:hover { box-shadow: 0 8px 24px rgba(22,36,29,.07); transform: translateY(-2px); }
.np .pcard .top { display:flex; gap:13px; align-items:center; margin-bottom:14px; }
.np .avatar { width:46px; height:46px; border-radius:50%; background:var(--green-soft); display:grid; place-items:center; color:var(--green-d); flex-shrink:0; }
.np .pcard .nm { font-weight:700; font-size:16px; }
.np .pcard .ag { color:var(--ink-soft); font-size:13px; }
.np .pcard .meta { display:flex; flex-direction:column; gap:6px; color:var(--ink-soft); font-size:13px; margin-bottom:15px; }
.np .pcard .meta div { display:flex; align-items:center; gap:8px; }
.np .pcard .acts { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.np .pcard .acts .wide { grid-column: span 2; }

.np .modal-bg { position:fixed; inset:0; background:rgba(22,36,29,.45); display:grid; place-items:center; z-index:50; padding:20px; }
.np .modal { background:#fff; border-radius:18px; width:100%; max-width:440px; padding:24px; max-height:90vh; overflow:auto; }
.np .modal h3 { font-family:'Fraunces',serif; font-size:21px; margin:0 0 18px; display:flex; justify-content:space-between; align-items:center; }
.np .modal .x { cursor:pointer; color:var(--ink-soft); background:none; border:none; }
.np .modal .row { margin-bottom:14px; }
.np .modal .foot { display:flex; gap:10px; margin-top:8px; }
.np .modal .foot .btn { flex:1; justify-content:center; }

/* builder */
.np .topbar { display:flex; align-items:center; gap:16px; margin-bottom:24px; }
.np .topbar .ttl { font-family:'Fraunces',serif; font-size:22px; flex:1; }
.np .panel { background:#fff; border:1px solid var(--line); border-radius:16px; padding:22px; margin-bottom:18px; }
.np .panel h2 { font-family:'Fraunces',serif; font-size:19px; margin:0 0 4px; }
.np .panel .ph { color:var(--ink-soft); font-size:13px; margin:0 0 18px; }
.np .sex-toggle { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:18px; }
.np .sexbtn { border:2px solid var(--line); background:#fff; border-radius:14px; padding:16px; cursor:pointer; text-align:center; font-weight:600; font-size:15px; transition:.15s; }
.np .sexbtn .emo { font-size:26px; display:block; margin-bottom:4px; }
.np .sexbtn.on { border-color:var(--green); background:var(--green-soft); color:var(--green-d); }
.np .three { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-bottom:16px; }
.np .two { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px; }

.np .calc { background:var(--green-soft); border:1px solid #cde8d8; border-radius:14px; padding:18px; display:flex; gap:40px; align-items:center; flex-wrap:wrap; }
.np .calc .blk .k { font-size:12px; color:var(--ink-soft); display:flex; align-items:center; gap:6px; }
.np .calc .blk .v { font-family:'Fraunces',serif; font-size:30px; font-weight:700; }
.np .calc .blk .v.vet { color:var(--green-d); }
.np .calc .note { color:var(--ink-soft); font-size:13px; }

/* sliders */
.np .slider-row { margin: 22px 0; }
.np .slider-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.np .slider-head .name { display:flex; align-items:center; gap:8px; font-weight:600; }
.np .pill { font-weight:700; padding:5px 12px; border-radius:999px; font-size:14px; }
.np .pill.p { background:#fde8e9; color:var(--p); }
.np .pill.c { background:#fdedd9; color:var(--c); }
.np .pill.f { background:#e1ecfe; color:var(--f); }
.np input[type=range] { -webkit-appearance:none; appearance:none; width:100%; height:8px; border-radius:999px; outline:none; }
.np input[type=range].p { background: linear-gradient(90deg,var(--p) var(--fill,50%), #f6dadb var(--fill,50%)); }
.np input[type=range].f { background: linear-gradient(90deg,var(--f) var(--fill,50%), #d9e7fd var(--fill,50%)); }
.np input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:22px; height:22px; border-radius:50%; background:#fff; border:3px solid var(--green); cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,.18); }
.np input[type=range]::-moz-range-thumb { width:22px; height:22px; border-radius:50%; background:#fff; border:3px solid var(--green); cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,.18); }
.np .scale { display:flex; justify-content:space-between; color:var(--ink-soft); font-size:11.5px; margin-top:6px; }
.np .carbbar { height:8px; border-radius:999px; background:#fdedd9; overflow:hidden; }
.np .carbbar > div { height:100%; background:var(--c); border-radius:999px; }

.np .macrotable { width:100%; border-collapse:collapse; margin-top:18px; font-size:13px; }
.np .macrotable th, .np .macrotable td { padding:9px 12px; text-align:center; border-bottom:1px solid var(--line); }
.np .macrotable th:first-child, .np .macrotable td:first-child { text-align:left; color:var(--ink-soft); }
.np .macrotable thead th { font-weight:700; }
.np .macrotable .cp { color:var(--p); font-weight:700; }
.np .macrotable .cc { color:var(--c); font-weight:700; }
.np .macrotable .cf { color:var(--f); font-weight:700; }

/* resumo nutricional */
.np .summary { display:grid; grid-template-columns: repeat(4,1fr); gap:18px; }
.np .summary.five { grid-template-columns: repeat(5,1fr); gap:14px; }
.np .micros { display:grid; grid-template-columns: repeat(2,1fr); gap:10px 26px; }
.np .micro { }
.np .micro.hi { grid-column: span 2; background:var(--green-soft); border:1px solid #cde8d8; border-radius:10px; padding:10px 12px; }
.np .micro .top { display:flex; justify-content:space-between; font-size:13px; margin-bottom:5px; }
.np .micro .top .nm { font-weight:600; }
.np .micro .top .vl { color:var(--ink-soft); }
.np .micro .top .vl b { color:var(--ink); }
.np .summary .it .lab { font-size:12px; color:var(--ink-soft); }
.np .summary .it .big { font-family:'Fraunces',serif; font-size:22px; font-weight:700; }
.np .summary .it .tgt { font-size:12px; color:var(--ink-soft); }
.np .track { height:6px; border-radius:999px; background:var(--line); margin:7px 0; overflow:hidden; }
.np .track > div { height:100%; border-radius:999px; }

/* meals */
.np .meal { border:1px solid var(--line); border-radius:14px; margin-bottom:12px; overflow:hidden; background:#fff; }
.np .meal-head { display:flex; align-items:center; gap:12px; padding:14px 16px; background:#fbfcfb; }
.np .meal-head .mn { font-weight:700; font-size:15px; }
.np .meal-head .time { color:var(--ink-soft); font-size:13px; display:flex; align-items:center; gap:5px; margin-left: auto; }
.np .meal-macros { margin-left:auto; display:flex; gap:14px; align-items:center; font-size:12.5px; font-weight:600; }
.np .meal-macros .iconbtn { color:var(--ink-soft); background:none; border:none; cursor:pointer; padding:4px; border-radius:6px; }
.np .meal-macros .iconbtn:hover { background:var(--bg); color:var(--ink); }
.np .meal-body { padding:14px 16px; }
.np .item { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--line); }
.np .item:last-child { border-bottom:none; }
.np .item .inm { font-weight:500; }
.np .item .iqt { color:var(--ink-soft); font-size:12.5px; }
.np .item .imac { margin-left:auto; font-size:12px; color:var(--ink-soft); }
.np .food-search { position:relative; margin-top:8px; }
.np .food-results { border:1px solid var(--line); border-radius:12px; margin-top:6px; max-height:230px; overflow:auto; }
.np .food-results .fr { display:flex; justify-content:space-between; padding:10px 13px; cursor:pointer; border-bottom:1px solid var(--line); }
.np .food-results .fr:last-child { border-bottom:none; }
.np .food-results .fr:hover { background:var(--green-soft); }
.np .food-results .fr small { color:var(--ink-soft); }

.np .subrow { display:flex; gap:14px; padding:12px 0; border-bottom:1px solid var(--line); align-items:flex-start; }
.np .subrow:last-child { border-bottom:none; }
.np .subrow .a { width:200px; font-weight:600; flex-shrink:0; }
.np .subrow .b { flex:1; }
.np .chip { display:inline-flex; align-items:center; gap:6px; background:var(--bg); border:1px solid var(--line); border-radius:999px; padding:4px 10px; font-size:12.5px; margin:0 6px 6px 0; }
.np .chip button { background:none; border:none; cursor:pointer; color:var(--ink-soft); display:flex; }

.np .empty { text-align:center; color:var(--ink-soft); padding:50px 20px; }
.np .radio { display:flex; align-items:center; gap:9px; padding:9px 0; cursor:pointer; }
.np .radio input { accent-color: var(--green); width:17px; height:17px; }

/* avaliação física */
.np .tabs { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:20px 0 6px; }
.np .tabbtn { padding:13px; border-radius:12px; border:1px solid var(--line); background:#fff; cursor:pointer; font-weight:600; font-size:14px; display:flex; align-items:center; justify-content:center; gap:8px; color:var(--ink-soft); }
.np .tabbtn.on { background:var(--green); color:#fff; border-color:var(--green); }
.np .stepper { display:flex; align-items:flex-start; margin: 6px 0 22px; }
.np .stepcol { display:flex; flex-direction:column; align-items:center; gap:6px; }
.np .dot { width:34px; height:34px; border-radius:50%; display:grid; place-items:center; font-weight:700; background:#fff; border:2px solid var(--line); color:var(--ink-soft); flex-shrink:0; transition:.2s; }
.np .dot.on { background:var(--green); border-color:var(--green); color:#fff; }
.np .dot.done { background:var(--green-soft); border-color:var(--green); color:var(--green-d); }
.np .steplabel { font-size:11px; color:var(--ink-soft); text-align:center; max-width:80px; }
.np .barline { flex:1; height:2px; background:var(--line); margin:17px 4px 0; border-radius:2px; }
.np .barline.on { background:var(--green); }

.np .methods { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:6px; }
.np .method { border:2px solid var(--line); border-radius:16px; padding:20px; cursor:pointer; transition:.15s; }
.np .method:hover { border-color:#bfe0cd; }
.np .method.on { border-color:var(--green); background:var(--green-soft); }
.np .method .mi { width:46px; height:46px; border-radius:13px; display:grid; place-items:center; margin-bottom:13px; color:#fff; }
.np .method h4 { margin:0 0 7px; font-size:16px; font-family:'Fraunces',serif; }
.np .method p { margin:0; font-size:12.5px; color:var(--ink-soft); line-height:1.5; }
.np .method .tag { color:var(--green-d); font-size:12px; font-weight:600; margin-top:11px; display:block; }

.np .ingrid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.np .ingrid.two { grid-template-columns:repeat(2,1fr); }

.np .resgrid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:18px; }
.np .rescard { background:#fff; border:1px solid var(--line); border-radius:14px; padding:18px; text-align:center; }
.np .rescard .rl { font-size:12px; color:var(--ink-soft); margin-bottom:4px; }
.np .rescard .rv { font-family:'Fraunces',serif; font-size:28px; font-weight:700; }
.np .rescard .rc { font-size:11.5px; font-weight:700; margin-top:5px; display:inline-block; padding:2px 9px; border-radius:999px; }

.np .photodrop { border:2px dashed var(--line); border-radius:14px; padding:22px; text-align:center; cursor:pointer; color:var(--ink-soft); }
.np .photodrop:hover { border-color:var(--green); color:var(--green-d); }
.np .photodrop img { max-height:120px; border-radius:8px; }
.np .infobox { background:#fff7ed; border:1px solid #fcd9a8; color:#8a5a13; border-radius:12px; padding:13px 15px; font-size:13px; margin:14px 0; }

.np .histrow { display:grid; grid-template-columns:1fr 90px 90px 100px 80px 40px; gap:8px; align-items:center; padding:11px 4px; border-bottom:1px solid var(--line); font-size:13.5px; }
.np .histrow .hh { color:var(--ink-soft); font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; }
.np .delta { font-size:12px; font-weight:600; }
.np .chartwrap { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:18px; }
.np .chartcard { background:#fff; border:1px solid var(--line); border-radius:14px; padding:16px; }
.np .chartcard .ct { font-weight:600; font-size:13px; margin-bottom:6px; display:flex; align-items:center; gap:7px; }
.np .exrow { display:flex; align-items:center; gap:12px; padding:13px 4px; border-bottom:1px solid var(--line); }
.np .exrow:last-child { border-bottom:none; }

/* print admin */
.np-print { display:none; }
@media print {
  /* Esconde toda a UI, mostra apenas o bloco de impressão */
  .np > .layout { display: none !important; }
  .np-print {
    display: block !important;
    position: static !important;
    width: 100%;
    padding: 20mm 18mm;
    font-family: 'DM Sans', sans-serif;
    color: #16241d;
    background: white;
  }
  .np-print h1 { color:#1f9d63; font-family:'Fraunces',serif; text-align:center; margin:0 0 16px; }
  .np-print .meal-title { background:#1f9d63; color:#fff; padding:8px 14px; border-radius:8px; font-weight:700; margin:18px 0 6px; page-break-after: avoid; }
  .np-print table { width:100%; border-collapse:collapse; margin-bottom: 4px; }
  .np-print td, .np-print th { padding:7px 10px; text-align:left; border-bottom:1px solid #e4e9e3; font-size:13px; }
  .np-print .print-section { page-break-inside: avoid; }
  @page { margin: 0; size: A4; }
}

@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }

/* ── Responsivo para celular ──────────────────────────────────── */
@media (max-width: 768px) {
  .np .layout { flex-direction: column; }
  .np .side {
    width: 100%; height: auto; position: relative;
    flex-direction: row; flex-wrap: nowrap;
    overflow-x: auto; padding: 8px 10px;
    gap: 2px; border-right: none;
    border-bottom: 1px solid var(--line);
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .np .side::-webkit-scrollbar { display: none; }
  .np .side .navlabel { display: none; }
  .np .side .brand { min-width: 120px; padding-bottom: 0; border-right: 1px solid var(--line); margin-right: 6px; padding-right: 10px; align-items: center; }
  .np .navitem { white-space: nowrap; width: auto; padding: 7px 10px; flex-shrink: 0; }
  .np .side > div[style*="flex: 1"] { display: none; }
  .np .main { padding: 16px 14px; }

  .np .three { grid-template-columns: 1fr 1fr; }
  .np .ingrid { grid-template-columns: 1fr 1fr; }
  .np .two { grid-template-columns: 1fr; }
  .np .resgrid { grid-template-columns: 1fr 1fr; }
  .np .summary { grid-template-columns: 1fr 1fr; }
  .np .summary.five { grid-template-columns: 1fr 1fr; }
  .np .chartwrap { grid-template-columns: 1fr; }
  .np .methods { grid-template-columns: 1fr; }
  .np .grid-cards { grid-template-columns: 1fr; }
  .np .pcard .acts { grid-template-columns: 1fr 1fr; }
  .np .pcard .acts .wide { grid-column: span 2; }
  .np .histrow { grid-template-columns: 1fr 80px 80px 36px; }
  .np h1.title { font-size: 22px; }
  .np .topbar { flex-wrap: wrap; gap: 10px; }
  .np .modal { padding: 18px; }
  .np .panel { padding: 16px; }
  .np .macrotable { font-size: 12px; }
  .np .macrotable th, .np .macrotable td { padding: 7px 6px; }
}

@media (max-width: 480px) {
  .np .three { grid-template-columns: 1fr; }
  .np .ingrid { grid-template-columns: 1fr; }
  .np .resgrid { grid-template-columns: 1fr 1fr; }
  .np .histrow { grid-template-columns: 1fr 70px 36px; }
  .np .side { padding: 6px 8px; }
  .np .navitem { font-size: 12px; padding: 6px 8px; gap: 6px; }
  .np .brand b { font-size: 14px; }
  .np .main { padding: 12px 10px; }
  .np h1.title { font-size: 20px; }
}
`
