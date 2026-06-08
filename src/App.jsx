import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Users, CalendarDays, Activity, FlaskConical, UserCircle, Utensils,
  Plus, Search, X, Copy, ChevronDown, ChevronUp, Pencil, Trash2,
  ArrowLeft, FileDown, Save, ClipboardList, Pill, Repeat, Mail, Phone, Cake,
  Camera, Ruler, Scale, TrendingUp, Percent, ImageIcon, Apple, FileText, LogOut,
  Video, HelpCircle, Send, Lock, Clock
} from "lucide-react";
import { supabase, supabaseAdmin } from "./supabase";
import * as db from "./db";
import Login from "./Login";
import PatientPortal from "./PatientPortal";
import { NP_STYLE } from "./npStyles";
//import "./supabase"; APENAS TESTE DO BD

/* ============================================================
   NutriPlano — app de nutrição (nome provisório, fácil de trocar)
   ============================================================ */
const APP_NAME = "Nutriquébom";

/* ---------- Tema / CSS — definido em npStyles.js ---------- */
const _STYLE_START = `

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
  --p: #e5484d;   /* proteína */
  --c: #f1932c;   /* carbo */
  --f: #2d7ff9;   /* gordura */
  --fib: #6aa84f; /* fibra */
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
.np .meal-head .time { color:var(--ink-soft); font-size:13px; display:flex; align-items:center; gap:5px; }
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

/* print */
.np-print { display:none; }
@media print {
  body * { visibility: hidden; }
  .np-print, .np-print * { visibility: visible; }
  .np-print { display:block; position:absolute; left:0; top:0; width:100%; padding:30px; font-family:'DM Sans',sans-serif; color:#16241d; }
  .np-print h1 { color:#1f9d63; font-family:'Fraunces',serif; text-align:center; }
  .np-print .meal-title { background:#1f9d63; color:#fff; padding:8px 14px; border-radius:8px; font-weight:700; margin:18px 0 0; }
  .np-print table { width:100%; border-collapse:collapse; }
  .np-print td, .np-print th { padding:7px 10px; text-align:left; border-bottom:1px solid #e4e9e3; font-size:13px; }
}
`; // _STYLE_START (não usado — mantido apenas como referência histórica)
const STYLE = NP_STYLE;

/* ---------- Dados ---------- */
const ACTIVITY = [
  { k: "Sedentário (1.2)", v: 1.2 },
  { k: "Levemente ativo (1.375)", v: 1.375 },
  { k: "Moderadamente ativo (1.55)", v: 1.55 },
  { k: "Muito ativo (1.725)", v: 1.725 },
  { k: "Extremamente ativo (1.9)", v: 1.9 },
];

const FORMULAS = {
  mifflin: { label: "Mifflin-St Jeor (1990)", needsBf: false },
  hb1984: { label: "Harris-Benedict (1984, revisada)", needsBf: false },
  hb1919: { label: "Harris-Benedict (1919, clássica)", needsBf: false },
  katch: { label: "Katch-McArdle (usa massa magra)", needsBf: true },
};

function tmbCalc(formula, sex, weight, height, age, bf) {
  const w = +weight, h = +height, a = +age;
  if (formula === "mifflin")
    return 10 * w + 6.25 * h - 5 * a + (sex === "M" ? 5 : -161);
  if (formula === "hb1984")
    return sex === "M"
      ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
      : 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;
  if (formula === "hb1919")
    return sex === "M"
      ? 66.5 + 13.75 * w + 5.003 * h - 6.755 * a
      : 655.1 + 9.563 * w + 1.85 * h - 4.676 * a;
  if (formula === "katch") {
    const lbm = w * (1 - (+bf || 20) / 100);
    return 370 + 21.6 * lbm;
  }
  return 0;
}

// base alimentos por 100g (valores aproximados — tabela inicial, expansível)
/* ---------- Base de alimentos comuns (porção habitual) — macros, fibra e micronutrientes via TACO 4ª ed., por 100 g ---------- */
const FOODS = [
  {id:"f0",n:"Ovo de galinha, cozido",g:"Proteínas",kcal:146,p:13.3,c:0.6,f:9.5,fib:0,m:[["1 unidade",50]],mc:{ca:49.2,fe:1.5,mg:11.2,k:138.9,na:145.9,zn:1.2,va:0,vc:0,b6:0}},
  {id:"f1",n:"Ovo de galinha, frito",g:"Proteínas",kcal:240,p:15.6,c:1.2,f:18.6,fib:0,m:[["1 unidade",50]],mc:{ca:72.9,fe:2.1,mg:16.3,k:184,na:166.1,zn:1.5,va:0,vc:0,b6:0}},
  {id:"f2",n:"Frango, peito grelhado",g:"Proteínas",kcal:159,p:32,c:0,f:2.5,fib:0,m:[["1 filé",100]],mc:{ca:5.3,fe:0.3,mg:18.3,k:387.4,na:50.2,zn:0.8,va:0,vc:0,b6:0}},
  {id:"f3",n:"Frango, peito cozido",g:"Proteínas",kcal:163,p:31.5,c:0,f:3.2,fib:0,m:[["1 filé",100]],mc:{ca:6.4,fe:0.3,mg:13.8,k:231.1,na:36.2,zn:0.9,va:0,vc:0,b6:0}},
  {id:"f4",n:"Frango, coxa cozida (s/ pele)",g:"Proteínas",kcal:167,p:26.9,c:0,f:5.8,fib:0,m:[["1 unidade",55]],mc:{ca:11.8,fe:0.8,mg:11.1,k:191.1,na:64.3,zn:2.8,va:0,vc:0,b6:0}},
  {id:"f5",n:"Frango, sobrecoxa assada (s/ pele)",g:"Proteínas",kcal:233,p:29.2,c:0,f:12,fib:0,m:[["1 unidade",65]],mc:{ca:12.2,fe:1.2,mg:17.2,k:382.2,na:106.1,zn:2.2,va:10.7,vc:0,b6:0}},
  {id:"f6",n:"Patinho grelhado",g:"Proteínas",kcal:219,p:35.9,c:0,f:7.3,fib:0,m:[["1 bife",100],["1 colher de sopa",25]],mc:{ca:4.8,fe:3,mg:27.3,k:421,na:60.3,zn:8.1,va:0,vc:0,b6:0}},
  {id:"f7",n:"Carne moída (acém) cozida",g:"Proteínas",kcal:212,p:26.7,c:0,f:10.9,fib:0,m:[["1 colher de sopa",20]],mc:{ca:4,fe:2.7,mg:17.1,k:255.7,na:52.4,zn:8.1,va:0,vc:0,b6:0}},
  {id:"f8",n:"Contrafilé grelhado",g:"Proteínas",kcal:194,p:35.9,c:0,f:4.5,fib:0,m:[["1 bife",100]],mc:{ca:5,fe:2.4,mg:21.1,k:386.5,na:57.5,zn:5.1,va:0,vc:0,b6:0.2}},
  {id:"f9",n:"Lombo suíno assado",g:"Proteínas",kcal:210,p:35.7,c:0,f:6.4,fib:0,m:[["1 fatia",80]],mc:{ca:19.5,fe:0.5,mg:18.1,k:311.1,na:38.9,zn:1.8,va:0,vc:0,b6:0.1}},
  {id:"f10",n:"Salmão grelhado",g:"Proteínas",kcal:243,p:26.1,c:0,f:14.5,fib:0,m:[["1 posta",120]],mc:{ca:15.1,fe:0.4,mg:37.9,k:517.9,na:95.8,zn:0.5,va:0,vc:0,b6:0}},
  {id:"f11",n:"Sardinha assada",g:"Proteínas",kcal:164,p:32.2,c:0,f:3,fib:0,m:[["1 unidade",40]],mc:{ca:437.7,fe:1.3,mg:51.4,k:574.3,na:74.5,zn:1.8,va:0,vc:0,b6:0}},
  {id:"f12",n:"Merluza (peixe branco) assada",g:"Proteínas",kcal:122,p:26.6,c:0,f:0.9,fib:0,m:[["1 filé",100]],mc:{ca:35.9,fe:0.4,mg:20.3,k:363.6,na:119.9,zn:0.9,va:0,vc:0,b6:0}},
  {id:"f13",n:"Whey protein (genérico)",g:"Proteínas",kcal:380,p:75,c:8,f:6,fib:0,m:[["1 scoop",30]],mc:{ca:200,fe:0.5,mg:40,k:180,na:180,zn:1.2,va:0,vc:0,b6:0}},
  {id:"f14",n:"Arroz branco cozido",g:"Carboidratos",kcal:128,p:2.5,c:28.1,f:0.2,fib:1.6,m:[["1 colher de sopa",25],["1 escumadeira",80]],mc:{ca:3.5,fe:0.1,mg:2.3,k:14.7,na:1.2,zn:0.5,va:0,vc:0,b6:0}},
  {id:"f15",n:"Arroz integral cozido",g:"Carboidratos",kcal:124,p:2.6,c:25.8,f:1,fib:2.7,m:[["1 colher de sopa",25],["1 escumadeira",80]],mc:{ca:5.2,fe:0.3,mg:58.7,k:75.2,na:1.2,zn:0.7,va:0,vc:0,b6:0.1}},
  {id:"f16",n:"Feijão carioca cozido",g:"Carboidratos",kcal:76,p:4.8,c:13.6,f:0.5,fib:8.5,m:[["1 concha",80],["1 colher de sopa",20]],mc:{ca:26.6,fe:1.3,mg:42.3,k:254.6,na:1.8,zn:0.7,va:0,vc:0,b6:0}},
  {id:"f17",n:"Feijão preto cozido",g:"Carboidratos",kcal:77,p:4.5,c:14,f:0.5,fib:8.4,m:[["1 concha",80]],mc:{ca:29,fe:1.5,mg:40.4,k:256.4,na:1.9,zn:0.7,va:0,vc:0,b6:0}},
  {id:"f18",n:"Lentilha cozida",g:"Carboidratos",kcal:93,p:6.3,c:16.3,f:0.5,fib:7.9,m:[["1 colher de sopa",25]],mc:{ca:16.1,fe:1.5,mg:21.6,k:219.9,na:1.2,zn:1.1,va:0,vc:0,b6:0}},
  {id:"f19",n:"Grão-de-bico cozido",g:"Carboidratos",kcal:164,p:8.9,c:27.4,f:2.6,fib:7.6,m:[["1 colher de sopa",25]],mc:{ca:49,fe:2.9,mg:48,k:291,na:7,zn:1.5,va:1,vc:1.3,b6:0.1}},
  {id:"f20",n:"Batata inglesa cozida",g:"Carboidratos",kcal:52,p:1.2,c:11.9,f:0,fib:1.3,m:[["1 unidade média",100]],mc:{ca:3.5,fe:0.2,mg:5.4,k:161.3,na:2.3,zn:0.2,va:0,vc:3.8,b6:0.1}},
  {id:"f21",n:"Batata doce cozida",g:"Carboidratos",kcal:77,p:0.6,c:18.4,f:0.1,fib:2.2,m:[["1 fatia",60],["1 unid. pequena",130]],mc:{ca:17.2,fe:0.2,mg:11.2,k:148.4,na:2.7,zn:0.1,va:0,vc:23.8,b6:0.1}},
  {id:"f22",n:"Mandioquinha/baroa cozida",g:"Carboidratos",kcal:80,p:0.9,c:18.9,f:0.2,fib:1.8,m:[["1 unidade",60]],mc:{ca:11.8,fe:0.4,mg:7.6,k:258.3,na:2.1,zn:0.4,va:0,vc:17.1,b6:0}},
  {id:"f23",n:"Mandioca/aipim cozida",g:"Carboidratos",kcal:125,p:0.6,c:30.1,f:0.3,fib:1.6,m:[["1 pedaço",80]],mc:{ca:18.6,fe:0.1,mg:26.8,k:100.4,na:0.9,zn:0.2,va:0,vc:11.1,b6:0}},
  {id:"f24",n:"Cuscuz de milho cozido",g:"Carboidratos",kcal:113,p:2.2,c:25.3,f:0.7,fib:2.1,m:[["1 fatia",80]],mc:{ca:1.5,fe:0.2,mg:2.7,k:10.9,na:247.7,zn:0.2,va:0,vc:0,b6:0.1}},
  {id:"f25",n:"Macarrão cozido",g:"Carboidratos",kcal:158,p:5.8,c:30.9,f:0.9,fib:1.8,m:[["1 escumadeira",80],["1 pegador",110]],mc:{ca:7,fe:0.9,mg:18,k:44,na:1,zn:0.5,va:0,vc:0,b6:0.1}},
  {id:"f26",n:"Aveia em flocos",g:"Carboidratos",kcal:394,p:13.9,c:66.6,f:8.5,fib:9.1,m:[["1 colher de sopa",15]],mc:{ca:47.9,fe:4.4,mg:118.8,k:336.3,na:4.6,zn:2.6,va:0,vc:1.4,b6:0}},
  {id:"f27",n:"Pão francês",g:"Carboidratos",kcal:300,p:8,c:58.6,f:3.1,fib:2.3,m:[["1 unidade",50]],mc:{ca:15.8,fe:1,mg:25.5,k:142.2,na:647.7,zn:0.8,va:0,vc:0,b6:0.6}},
  {id:"f28",n:"Pão de forma integral",g:"Carboidratos",kcal:253,p:9.4,c:49.9,f:3.7,fib:6.9,m:[["1 fatia",25],["2 fatias",50]],mc:{ca:131.8,fe:3,mg:60.4,k:162.9,na:506.1,zn:1.6,va:0,vc:0,b6:0.1}},
  {id:"f29",n:"Pão de queijo",g:"Carboidratos",kcal:363,p:5.1,c:34.2,f:24.6,fib:0.6,m:[["1 unidade",30]],mc:{ca:102.5,fe:0.3,mg:8.2,k:93.1,na:773.5,zn:0.6,va:0,vc:0,b6:0}},
  {id:"f30",n:"Tapioca (goma hidratada)",g:"Carboidratos",kcal:240,p:0.4,c:59.5,f:0,fib:0.6,m:[["1 colher de sopa",20],["1 disco médio",60]],mc:{ca:5,fe:0.3,mg:3,k:11,na:2,zn:0.1,va:0,vc:0,b6:0}},
  {id:"f31",n:"Granola",g:"Carboidratos",kcal:471,p:10,c:64,f:17,fib:8,m:[["1 colher de sopa",15]],mc:{ca:60,fe:3.5,mg:120,k:350,na:15,zn:2.5,va:0,vc:0,b6:0.2}},
  {id:"f32",n:"Leite integral",g:"Laticínios",kcal:61,p:3.2,c:4.7,f:3.3,fib:0,m:[["1 copo",200]],mc:{ca:123,fe:0,mg:11,k:150,na:49,zn:0.4,va:34,vc:0.9,b6:0}},
  {id:"f33",n:"Leite desnatado",g:"Laticínios",kcal:35,p:3.4,c:4.9,f:0.2,fib:0,m:[["1 copo",200]],mc:{ca:124,fe:0,mg:11,k:156,na:52,zn:0.4,va:1,vc:0.9,b6:0}},
  {id:"f34",n:"Iogurte natural integral",g:"Laticínios",kcal:51,p:4.1,c:1.9,f:3,fib:0,m:[["1 pote",170]],mc:{ca:143.1,fe:0,mg:11.3,k:71.3,na:51.6,zn:0.4,va:0,vc:0.9,b6:0}},
  {id:"f35",n:"Iogurte natural desnatado",g:"Laticínios",kcal:41,p:3.8,c:5.8,f:0.3,fib:0,m:[["1 pote",170]],mc:{ca:157,fe:0,mg:12,k:182.1,na:59.6,zn:0.5,va:0,vc:0.3,b6:0}},
  {id:"f36",n:"Queijo minas frescal",g:"Laticínios",kcal:264,p:17.4,c:3.2,f:20.2,fib:0,m:[["1 fatia",30]],mc:{ca:579.3,fe:0.9,mg:6.9,k:104.8,na:31.2,zn:0.3,va:0,vc:0,b6:0}},
  {id:"f37",n:"Queijo mussarela",g:"Laticínios",kcal:330,p:22.6,c:3,f:25.2,fib:0,m:[["1 fatia",20]],mc:{ca:875,fe:0.3,mg:23.6,k:61.9,na:581.4,zn:3.5,va:0,vc:0,b6:0}},
  {id:"f38",n:"Requeijão cremoso",g:"Laticínios",kcal:257,p:9.6,c:2.4,f:23.4,fib:0,m:[["1 colher de sopa",30]],mc:{ca:259.5,fe:0.1,mg:11.6,k:93.1,na:557.9,zn:1.3,va:0,vc:0,b6:0}},
  {id:"f39",n:"Ricota",g:"Laticínios",kcal:140,p:12.6,c:3.8,f:8.1,fib:0,m:[["1 fatia",30]],mc:{ca:253.2,fe:0.1,mg:11.8,k:112.4,na:282.6,zn:0.5,va:0,vc:0,b6:0}},
  {id:"f40",n:"Banana prata",g:"Frutas",kcal:98,p:1.3,c:26,f:0.1,fib:2,m:[["1 unidade",70]],mc:{ca:7.6,fe:0.4,mg:26.3,k:357.7,na:0,zn:0.1,va:16.2,vc:21.6,b6:0.1}},
  {id:"f41",n:"Banana nanica",g:"Frutas",kcal:92,p:1.4,c:23.8,f:0.1,fib:1.9,m:[["1 unidade",90]],mc:{ca:3.4,fe:0.3,mg:27.8,k:376.5,na:0,zn:0.2,va:6.8,vc:5.9,b6:0.1}},
  {id:"f42",n:"Maçã",g:"Frutas",kcal:56,p:0.3,c:15.2,f:0,fib:1.3,m:[["1 unidade",130]],mc:{ca:1.9,fe:0.1,mg:2,k:74.7,na:0,zn:0,va:1.8,vc:2.4,b6:0}},
  {id:"f43",n:"Mamão papaya",g:"Frutas",kcal:40,p:0.5,c:10.4,f:0.1,fib:1,m:[["1 fatia",150]],mc:{ca:22.4,fe:0.2,mg:22.2,k:126.1,na:1.6,zn:0.1,va:59,vc:82.2,b6:0}},
  {id:"f44",n:"Laranja pera",g:"Frutas",kcal:37,p:1,c:8.9,f:0.1,fib:0.8,m:[["1 unidade",130]],mc:{ca:21.9,fe:0.1,mg:8.6,k:162.8,na:0,zn:0.1,va:0.5,vc:53.7,b6:0}},
  {id:"f45",n:"Morango",g:"Frutas",kcal:30,p:0.9,c:6.8,f:0.3,fib:1.7,m:[["1 unidade",12],["1 porção",100]],mc:{ca:10.9,fe:0.3,mg:9.7,k:184.4,na:0,zn:0.2,va:0,vc:63.6,b6:0}},
  {id:"f46",n:"Abacate",g:"Frutas",kcal:96,p:1.2,c:6,f:8.4,fib:6.3,m:[["1 colher de sopa",30],["1/2 unidade",100]],mc:{ca:7.9,fe:0.2,mg:14.7,k:206.3,na:0,zn:0.2,va:0,vc:8.7,b6:0}},
  {id:"f47",n:"Uva",g:"Frutas",kcal:53,p:0.7,c:13.6,f:0.2,fib:0.9,m:[["1 unidade",8],["1 cacho pequeno",100]],mc:{ca:6.7,fe:0.1,mg:5,k:161.9,na:0,zn:0,va:2.7,vc:3.3,b6:0}},
  {id:"f48",n:"Manga",g:"Frutas",kcal:72,p:0.4,c:19.4,f:0.2,fib:1.6,m:[["1 fatia",100]],mc:{ca:11.6,fe:0.1,mg:8.7,k:156.5,na:1.9,zn:0.1,va:393.5,vc:65.5,b6:0}},
  {id:"f49",n:"Melancia",g:"Frutas",kcal:33,p:0.9,c:8.1,f:0,fib:0.1,m:[["1 fatia",200]],mc:{ca:7.7,fe:0.2,mg:9.6,k:104,na:0,zn:0.1,va:30.5,vc:6.1,b6:0}},
  {id:"f50",n:"Abacaxi",g:"Frutas",kcal:48,p:0.9,c:12.3,f:0.1,fib:1,m:[["1 fatia",100]],mc:{ca:22.4,fe:0.3,mg:18.4,k:131.3,na:0,zn:0.1,va:0,vc:34.6,b6:0}},
  {id:"f51",n:"Pera",g:"Frutas",kcal:53,p:0.6,c:14,f:0.1,fib:3,m:[["1 unidade",130]],mc:{ca:8.3,fe:0.1,mg:5.8,k:115.9,na:0,zn:0.1,va:0,vc:2.8,b6:0}},
  {id:"f52",n:"Tangerina/mexerica",g:"Frutas",kcal:38,p:0.8,c:9.6,f:0.1,fib:0.9,m:[["1 unidade",100]],mc:{ca:12.9,fe:0.1,mg:7.7,k:131.4,na:0,zn:0,va:23.7,vc:48.8,b6:0}},
  {id:"f53",n:"Brócolis cozido",g:"Vegetais",kcal:25,p:2.1,c:4.4,f:0.5,fib:3.4,m:[["1 colher de sopa",20]],mc:{ca:50.8,fe:0.5,mg:14.5,k:118.5,na:2.1,zn:0.2,va:0,vc:42,b6:0}},
  {id:"f54",n:"Cenoura crua",g:"Vegetais",kcal:34,p:1.3,c:7.7,f:0.2,fib:3.2,m:[["1 unidade",60],["1 colher de sopa ralada",20]],mc:{ca:22.5,fe:0.2,mg:11.2,k:314.8,na:3.3,zn:0.2,va:663,vc:5.1,b6:0.1}},
  {id:"f55",n:"Cenoura cozida",g:"Vegetais",kcal:30,p:0.8,c:6.7,f:0.2,fib:2.6,m:[["1 colher de sopa",20]],mc:{ca:25.6,fe:0.1,mg:14.5,k:175.5,na:7.9,zn:0.2,va:306,vc:0,b6:0.1}},
  {id:"f56",n:"Tomate",g:"Vegetais",kcal:15,p:1.1,c:3.1,f:0.2,fib:1.2,m:[["1 unidade",90]],mc:{ca:6.9,fe:0.2,mg:10.5,k:222.4,na:1,zn:0.1,va:27,vc:21.2,b6:0}},
  {id:"f57",n:"Alface",g:"Vegetais",kcal:11,p:1.3,c:1.7,f:0.2,fib:1.8,m:[["1 porção (folhas)",40]],mc:{ca:38,fe:0.4,mg:11,k:267.1,na:3.4,zn:0.3,va:117,vc:15.6,b6:0}},
  {id:"f58",n:"Abobrinha refogada",g:"Vegetais",kcal:24,p:1.1,c:4.2,f:0.8,fib:1.4,m:[["1 colher de sopa",25]],mc:{ca:20.7,fe:0.4,mg:12.7,k:193.6,na:2.2,zn:0.3,va:20.8,vc:7.5,b6:0}},
  {id:"f59",n:"Beterraba cozida",g:"Vegetais",kcal:32,p:1.3,c:7.2,f:0.1,fib:1.9,m:[["1 colher de sopa",30]],mc:{ca:15.3,fe:0.2,mg:16.5,k:245.5,na:22.8,zn:0.4,va:0,vc:1.2,b6:0}},
  {id:"f60",n:"Couve refogada",g:"Vegetais",kcal:90,p:1.7,c:8.7,f:6.6,fib:5.7,m:[["1 colher de sopa",25]],mc:{ca:177.3,fe:0.5,mg:26.2,k:314.9,na:11.4,zn:0.2,va:192,vc:76.9,b6:0.1}},
  {id:"f61",n:"Espinafre refogado",g:"Vegetais",kcal:67,p:2.7,c:4.2,f:5.4,fib:2.5,m:[["1 colher de sopa",25]],mc:{ca:112.4,fe:0.6,mg:122.7,k:149.2,na:47,zn:0.6,va:311.9,vc:5.3,b6:0.1}},
  {id:"f62",n:"Couve-flor cozida",g:"Vegetais",kcal:19,p:1.2,c:3.9,f:0.3,fib:2.1,m:[["1 colher de sopa",20]],mc:{ca:16.1,fe:0.1,mg:5.4,k:80.5,na:1.8,zn:0.3,va:0,vc:23.7,b6:0}},
  {id:"f63",n:"Pepino",g:"Vegetais",kcal:10,p:0.9,c:2,f:0,fib:1.1,m:[["1 porção (rodelas)",50]],mc:{ca:9.6,fe:0.1,mg:9.3,k:153.7,na:0,zn:0.1,va:1.8,vc:5,b6:0}},
  {id:"f64",n:"Azeite de oliva",g:"Gorduras",kcal:884,p:0,c:0,f:100,fib:0,m:[["1 fio",3],["1 colher de sopa",8]],mc:{ca:0,fe:0,mg:0,k:0,na:0,zn:0,va:0,vc:0,b6:0}},
  {id:"f65",n:"Óleo de soja",g:"Gorduras",kcal:884,p:0,c:0,f:100,fib:0,m:[["1 colher de sopa",8]],mc:{ca:0,fe:0,mg:0,k:0,na:0,zn:0,va:0,vc:0,b6:0}},
  {id:"f66",n:"Manteiga",g:"Gorduras",kcal:726,p:0.4,c:0.1,f:82.4,fib:0,m:[["1 ponta de faca",5],["1 colher de sopa",14]],mc:{ca:9.4,fe:0.2,mg:1.5,k:14.8,na:578.7,zn:0,va:0,vc:0,b6:0}},
  {id:"f67",n:"Castanha do Pará",g:"Gorduras",kcal:643,p:14.5,c:15.1,f:63.5,fib:7.9,m:[["1 unidade",5]],mc:{ca:146.3,fe:2.3,mg:365.1,k:651,na:0.7,zn:4.2,va:0,vc:0,b6:0.4}},
  {id:"f68",n:"Castanha de caju",g:"Gorduras",kcal:570,p:18.5,c:29.1,f:46.3,fib:3.7,m:[["1 unidade",3]],mc:{ca:32.6,fe:5.2,mg:236.6,k:671.5,na:125,zn:4.7,va:0,vc:0,b6:0.4}},
  {id:"f69",n:"Amendoim torrado",g:"Gorduras",kcal:606,p:22.5,c:18.7,f:54,fib:7.8,m:[["1 colher de sopa",19]],mc:{ca:39.4,fe:1.3,mg:159.3,k:495.7,na:375.7,zn:2.1,va:0,vc:0,b6:0.2}},
  {id:"f70",n:"Amêndoa",g:"Gorduras",kcal:581,p:18.6,c:29.5,f:47.3,fib:11.6,m:[["1 unidade",1.2],["1 porção",30]],mc:{ca:236.7,fe:3.1,mg:222.1,k:639.6,na:278.5,zn:2.6,va:0,vc:0,b6:0}},
  {id:"f71",n:"Noz",g:"Gorduras",kcal:620,p:14,c:18.4,f:59.4,fib:7.2,m:[["1 unidade",5]],mc:{ca:105.3,fe:2,mg:152.9,k:533.3,na:4.6,zn:2.1,va:0,vc:0,b6:0.1}},
  {id:"f72",n:"Pasta de amendoim",g:"Gorduras",kcal:588,p:25,c:20,f:50,fib:6,m:[["1 colher de sopa",15]],mc:{ca:43,fe:1.9,mg:154,k:649,na:17,zn:2.9,va:0,vc:0,b6:0.4}},
  {id:"f73",n:"Chocolate meio amargo",g:"Outros",kcal:475,p:4.9,c:62.4,f:29.9,fib:4.9,m:[["1 quadrado",5],["1 porção",25]],mc:{ca:44.7,fe:3.6,mg:107.4,k:431.7,na:8.9,zn:1.5,va:0,vc:2.1,b6:0}},
  {id:"f74",n:"Chocolate ao leite",g:"Outros",kcal:540,p:7.2,c:59.6,f:30.3,fib:2.2,m:[["1 porção",25]],mc:{ca:191.2,fe:1.6,mg:57.1,k:354.5,na:77.1,zn:1.1,va:0,vc:0,b6:0.6}},
  {id:"f75",n:"Mel",g:"Outros",kcal:309,p:0,c:84,f:0,fib:0,m:[["1 colher de sopa",20]],mc:{ca:10.2,fe:0.3,mg:5.5,k:99.3,na:6,zn:0.2,va:0,vc:0.7,b6:0}},
  {id:"f76",n:"Açúcar refinado",g:"Outros",kcal:387,p:0.3,c:99.5,f:0,fib:0,m:[["1 colher de chá",5],["1 colher de sopa",12]],mc:{ca:3.5,fe:0.1,mg:0.5,k:6.4,na:12.2,zn:0,va:0,vc:0,b6:0}}
];

const SUPPLEMENTS = ["Creatina", "Whey Protein", "Cafeína", "Ômega 3", "Vitamina D", "Multivitamínico", "Glutamina", "Beta-Alanina"];

/* ---------- Exames laboratoriais: catálogo com faixas de referência ---------- */
// r: faixa única [min,max]; rM/rF: faixas por sexo. note: o que o marcador indica.
const EXAM_CATALOG = [
  { n: "Glicose em jejum", u: "mg/dL", r: [70, 99], note: "Controle glicêmico; acima de 99 sugere pré-diabetes." },
  { n: "Hemoglobina glicada (HbA1c)", u: "%", r: [4, 5.6], note: "Média glicêmica de ~3 meses; ≥5,7% pré-diabetes." },
  { n: "Insulina em jejum", u: "µU/mL", r: [2, 25], note: "Avalia resistência à insulina junto da glicose." },
  { n: "HOMA-IR", u: "", r: [0, 2.5], note: "Índice de resistência à insulina; acima de 2,5 sugere RI." },
  { n: "Colesterol total", u: "mg/dL", r: [0, 190], note: "Desejável abaixo de 190 mg/dL (sem jejum)." },
  { n: "LDL", u: "mg/dL", r: [0, 130], note: "Alvo varia com risco; geralmente abaixo de 130." },
  { n: "HDL", u: "mg/dL", rM: [40, 200], rF: [50, 200], note: "Quanto maior, melhor; baixo é fator de risco." },
  { n: "Triglicerídeos", u: "mg/dL", r: [0, 150], note: "Acima de 150 associa-se a dieta rica em açúcar/álcool." },
  { n: "Ferritina", u: "ng/mL", rM: [30, 400], rF: [15, 150], note: "Estoque de ferro; baixa sugere deficiência." },
  { n: "Ferro sérico", u: "mcg/dL", r: [60, 170], note: "Ferro circulante no sangue." },
  { n: "Hemoglobina", u: "g/dL", rM: [13, 17], rF: [12, 16], note: "Baixa indica anemia." },
  { n: "Hematócrito", u: "%", rM: [40, 52], rF: [36, 48], note: "Proporção de glóbulos vermelhos." },
  { n: "Vitamina D (25-OH)", u: "ng/mL", r: [30, 100], note: "Suficiente ≥30; abaixo de 20 é deficiência." },
  { n: "Vitamina B12", u: "pg/mL", r: [200, 900], note: "Baixa comum em dietas veganas; afeta sangue e nervos." },
  { n: "Ácido fólico", u: "ng/mL", r: [3, 17], note: "Folato sérico." },
  { n: "TSH", u: "mUI/L", r: [0.4, 4.0], note: "Função tireoidiana; alto sugere hipotireoidismo." },
  { n: "T4 livre", u: "ng/dL", r: [0.9, 1.7], note: "Hormônio tireoidiano livre." },
  { n: "Creatinina", u: "mg/dL", rM: [0.7, 1.3], rF: [0.6, 1.1], note: "Função renal." },
  { n: "Ureia", u: "mg/dL", r: [15, 45], note: "Função renal e ingestão proteica." },
  { n: "Ácido úrico", u: "mg/dL", rM: [3.4, 7.0], rF: [2.4, 6.0], note: "Alto associa-se a gota e dieta purínica." },
  { n: "TGO (AST)", u: "U/L", r: [5, 40], note: "Enzima hepática." },
  { n: "TGP (ALT)", u: "U/L", r: [7, 56], note: "Enzima hepática mais específica do fígado." },
  { n: "GGT", u: "U/L", rM: [8, 61], rF: [5, 36], note: "Sensível a álcool e esteatose hepática." },
  { n: "PCR (proteína C reativa)", u: "mg/L", r: [0, 3], note: "Marcador de inflamação." },
  { n: "Albumina", u: "g/dL", r: [3.5, 5.2], note: "Estado proteico/nutricional." },
  { n: "Cálcio total", u: "mg/dL", r: [8.5, 10.5], note: "Cálcio sanguíneo." },
  { n: "Magnésio", u: "mg/dL", r: [1.7, 2.4], note: "Mineral envolvido em centenas de reações." },
  { n: "Zinco", u: "mcg/dL", r: [70, 120], note: "Imunidade e cicatrização." },
  { n: "Sódio", u: "mEq/L", r: [135, 145], note: "Equilíbrio hidroeletrolítico." },
  { n: "Potássio", u: "mEq/L", r: [3.5, 5.1], note: "Função muscular e cardíaca." },
];
const examRange = (cat, sex) => cat ? (cat.r || (sex === "F" ? cat.rF : cat.rM)) : null;
function classifyExam(cat, sex, result) {
  const rg = examRange(cat, sex);
  if (!rg || result === "" || result == null || isNaN(+result)) return { status: "—", color: "var(--ink-soft)" };
  const v = +result;
  if (v < rg[0]) return { status: "Baixo", color: "#2d7ff9" };
  if (v > rg[1]) return { status: "Alto", color: "#e5484d" };
  return { status: "Normal", color: "var(--green)" };
}

/* ---------- Anamnese: ficha nutricional padrão (editável) ---------- */
const DEFAULT_ANAMNESE = [
  { id: "s1", title: "Histórico Social e Familiar", questions: [
    { id: "q_prof", label: "Profissão", type: "text" },
    { id: "q_carga", label: "Carga horária de trabalho", type: "text" },
    { id: "q_civil", label: "Estado civil", type: "select", options: ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União estável"] },
    { id: "q_comp", label: "Composição familiar (com quem mora)", type: "text" },
    { id: "q_compra", label: "Quem compra os alimentos?", type: "text" },
    { id: "q_freqcompra", label: "Frequência da compra de alimentos", type: "radio", options: ["Diariamente", "Semanalmente", "Quinzenalmente", "Mensalmente"] },
    { id: "q_prepara", label: "Quem prepara as refeições?", type: "text" },
    { id: "q_comquem", label: "Com quem realiza as refeições?", type: "text" },
  ] },
  { id: "s2", title: "Histórico Clínico", questions: [
    { id: "q_doencas", label: "Possui alguma doença diagnosticada?", type: "textarea" },
    { id: "q_medic", label: "Faz uso de medicamentos? Quais?", type: "textarea" },
    { id: "q_histfam", label: "Histórico familiar de doenças", type: "textarea" },
    { id: "q_cirurgia", label: "Já realizou alguma cirurgia?", type: "text" },
    { id: "q_alergias", label: "Alergias ou intolerâncias alimentares", type: "textarea" },
    { id: "q_intestino", label: "Funcionamento intestinal", type: "radio", options: ["Normal", "Constipado", "Diarreia", "Alternado"] },
  ] },
  { id: "s3", title: "Hábitos de Vida", questions: [
    { id: "q_ativ", label: "Pratica atividade física? Qual e com que frequência?", type: "textarea" },
    { id: "q_alcool", label: "Consome bebida alcoólica?", type: "radio", options: ["Não", "Socialmente", "Frequentemente"] },
    { id: "q_fuma", label: "Fuma?", type: "radio", options: ["Não", "Sim", "Ex-fumante"] },
    { id: "q_agua", label: "Ingestão de água por dia (litros)", type: "text" },
    { id: "q_sono", label: "Horas de sono por noite", type: "number" },
    { id: "q_estresse", label: "Nível de estresse", type: "radio", options: ["Baixo", "Médio", "Alto"] },
  ] },
  { id: "s4", title: "Hábitos Alimentares", questions: [
    { id: "q_nref", label: "Quantas refeições faz por dia?", type: "number" },
    { id: "q_pref", label: "Preferências alimentares", type: "textarea" },
    { id: "q_aver", label: "Aversões alimentares", type: "textarea" },
    { id: "q_belisca", label: "Costuma beliscar entre as refeições?", type: "radio", options: ["Não", "Às vezes", "Sempre"] },
    { id: "q_record", label: "Recordatório alimentar habitual (o que come num dia)", type: "textarea" },
    { id: "q_suple", label: "Suplementos em uso", type: "textarea" },
  ] },
  { id: "s5", title: "Objetivos", questions: [
    { id: "q_obj", label: "Qual seu principal objetivo?", type: "textarea" },
    { id: "q_dietas", label: "Já fez dieta antes? Como foi?", type: "textarea" },
    { id: "q_expect", label: "Expectativas com o acompanhamento", type: "textarea" },
  ] },
];

/* ---------- Avaliação física: perímetros, dobras, equações ---------- */
const PERIMETERS = {
  ombro: "Ombro", peitoral: "Peitoral/Tórax", cintura: "Cintura", abdomen: "Abdômen",
  quadril: "Quadril", braco: "Braço relaxado", bracoContr: "Braço contraído",
  antebraco: "Antebraço", coxa: "Coxa", panturrilha: "Panturrilha",
};
const SKINFOLDS = {
  peitoral: "Peitoral", axilarMedia: "Axilar Média", triceps: "Tríceps",
  subescapular: "Subescapular", abdominal: "Abdominal", supraIliaca: "Supra-ilíaca", coxa: "Coxa",
};
const EQUATIONS = {
  jp3: "Jackson & Pollock — 3 dobras",
  jp7: "Jackson & Pollock — 7 dobras",
  faulkner: "Faulkner — 4 dobras",
};
const EQ_FIELDS = {
  jp3: (sex) => (sex === "M" ? ["peitoral", "abdominal", "coxa"] : ["triceps", "supraIliaca", "coxa"]),
  jp7: () => ["peitoral", "axilarMedia", "triceps", "subescapular", "abdominal", "supraIliaca", "coxa"],
  faulkner: () => ["triceps", "subescapular", "supraIliaca", "abdominal"],
};

const siri = (d) => 495 / d - 450;
function bodyFatManual(eq, sex, age, sf) {
  const g = (k) => +sf[k] || 0;
  if (eq === "jp3") {
    let sum, d;
    if (sex === "M") { sum = g("peitoral") + g("abdominal") + g("coxa"); d = 1.10938 - 0.0008267 * sum + 0.0000016 * sum * sum - 0.0002574 * age; }
    else { sum = g("triceps") + g("supraIliaca") + g("coxa"); d = 1.0994921 - 0.0009929 * sum + 0.0000023 * sum * sum - 0.0001392 * age; }
    return siri(d);
  }
  if (eq === "jp7") {
    const sum = ["peitoral", "axilarMedia", "triceps", "subescapular", "abdominal", "supraIliaca", "coxa"].reduce((a, k) => a + g(k), 0);
    const d = sex === "M"
      ? 1.112 - 0.00043499 * sum + 0.00000055 * sum * sum - 0.00028826 * age
      : 1.097 - 0.00046971 * sum + 0.00000056 * sum * sum - 0.00012828 * age;
    return siri(d);
  }
  if (eq === "faulkner") return (g("triceps") + g("subescapular") + g("supraIliaca") + g("abdominal")) * 0.153 + 5.783;
  return 0;
}
function assessResults(a) {
  const h = (+a.height || 0) / 100;
  const imc = h > 0 ? +a.weight / (h * h) : 0;
  let bf = 0;
  if (a.method === "manual") bf = bodyFatManual(a.equation, a.sex, +a.age, a.skinfolds || {});
  else if (a.method === "bioimpedancia") bf = +a.bioFat || 0;
  else bf = +a.iaFat || 0;
  bf = Math.max(0, bf || 0);
  const fatMass = (+a.weight) * bf / 100;
  const leanMass = (+a.weight) - fatMass;
  const rcq = (+a.perimeters?.cintura && +a.perimeters?.quadril) ? +a.perimeters.cintura / +a.perimeters.quadril : 0;
  return { imc, bf, fatMass, leanMass, rcq };
}
const imcClass = (imc) => imc < 18.5 ? ["Abaixo do peso", "#2d7ff9"] : imc < 25 ? ["Eutrófico", "#1f9d63"] : imc < 30 ? ["Sobrepeso", "#f1932c"] : ["Obesidade", "#e5484d"];
function bfClass(bf, sex) {
  const t = sex === "M" ? [6, 14, 18, 25] : [14, 21, 25, 32];
  if (bf < t[0]) return ["Essencial", "#2d7ff9"];
  if (bf < t[1]) return ["Atlético", "#1f9d63"];
  if (bf < t[2]) return ["Bom", "#1f9d63"];
  if (bf < t[3]) return ["Aceitável", "#f1932c"];
  return ["Elevado", "#e5484d"];
}
const newAssessment = (patient) => ({
  id: uid(), patientId: patient?.id, date: new Date().toISOString().slice(0, 10),
  age: ageFrom(patient?.birth) || 30, weight: 70, height: 170,
  sex: patient?.sex === "Feminino" ? "F" : "M", ethnicity: "Branco",
  method: null, perimeters: {}, equation: "jp3", skinfolds: {},
  bioFat: "", bioMuscle: "", bioWater: "", iaFat: "",
});
const ASSESS_STEPS = {
  null: ["Dados Básicos", "Método"],
  manual: ["Dados Básicos", "Método", "Perímetros", "Dobras Cutâneas", "Resultados"],
  bioimpedancia: ["Dados Básicos", "Método", "Bioimpedância", "Resultados"],
  ia: ["Dados Básicos", "Método", "Análise por Foto", "Resultados"],
};

/* ---------- Helpers ---------- */
const uid = () => Math.random().toString(36).slice(2, 9);
const r0 = (n) => Math.round(n || 0);
const r1 = (n) => Math.round((n || 0) * 10) / 10;
const ageFrom = (birth) => {
  if (!birth) return "";
  const d = new Date(birth); if (isNaN(d)) return "";
  const t = new Date(); let a = t.getFullYear() - d.getFullYear();
  const mo = t.getMonth() - d.getMonth();
  if (mo < 0 || (mo === 0 && t.getDate() < d.getDate())) a--;
  return a;
};
const itemMacros = (it) => {
  const base = it.per100 || (() => { const f = FOODS.find((x) => x.id === it.foodId); return f ? { kcal: f.kcal, p: f.p, c: f.c, f: f.f, fib: f.fib } : { kcal: 0, p: 0, c: 0, f: 0, fib: 0 }; })();
  const k = it.grams / 100;
  return { kcal: base.kcal * k, p: base.p * k, c: base.c * k, f: base.f * k, fib: (base.fib || 0) * k };
};
const sumMacros = (items) =>
  items.reduce((a, it) => { const m = itemMacros(it); return { kcal: a.kcal + m.kcal, p: a.p + m.p, c: a.c + m.c, f: a.f + m.f, fib: a.fib + m.fib }; }, { kcal: 0, p: 0, c: 0, f: 0, fib: 0 });

const MICRO_KEYS = ["ca", "fe", "mg", "k", "na", "zn", "va", "vc", "b6", "vd", "b12", "ve"];
const sumMicros = (items) =>
  items.reduce((a, it) => { const k = it.grams / 100; const mc = it.mc || {}; MICRO_KEYS.forEach((m) => { a[m] = (a[m] || 0) + (mc[m] || 0) * k; }); return a; }, {});
// metas de micronutrientes (adulto). na = limite superior. fib via 14g/1000kcal
const microTargets = (sex, vet) => ({
  fib: { label: "Fibras", unit: "g", goal: 14 * vet / 1000, type: "goal", hi: true },
  ca: { label: "Cálcio", unit: "mg", goal: 1000, type: "goal" },
  fe: { label: "Ferro", unit: "mg", goal: sex === "M" ? 8 : 18, type: "goal" },
  mg: { label: "Magnésio", unit: "mg", goal: sex === "M" ? 400 : 310, type: "goal" },
  k: { label: "Potássio", unit: "mg", goal: sex === "M" ? 3400 : 2600, type: "goal" },
  zn: { label: "Zinco", unit: "mg", goal: sex === "M" ? 11 : 8, type: "goal" },
  va: { label: "Vitamina A", unit: "mcg", goal: sex === "M" ? 900 : 700, type: "goal" },
  vc: { label: "Vitamina C", unit: "mg", goal: sex === "M" ? 90 : 75, type: "goal" },
  b6: { label: "Vitamina B6", unit: "mg", goal: 1.3, type: "goal" },
  vd: { label: "Vitamina D", unit: "mcg", goal: 15, type: "goal" },
  b12: { label: "Vitamina B12", unit: "mcg", goal: 2.4, type: "goal" },
  ve: { label: "Vitamina E", unit: "mg", goal: 15, type: "goal" },
  na: { label: "Sódio", unit: "mg", goal: 2300, type: "limit" },
});

const defaultMeals = () => [
  { id: uid(), name: "Café da Manhã", time: "07:00", items: [] },
  { id: uid(), name: "Lanche da Manhã", time: "10:00", items: [] },
  { id: uid(), name: "Almoço", time: "12:30", items: [] },
  { id: uid(), name: "Lanche da Tarde", time: "15:30", items: [] },
  { id: uid(), name: "Jantar", time: "19:00", items: [] },
  { id: uid(), name: "Ceia", time: "21:00", items: [] },
];

const newDiet = (patient) => ({
  id: uid(),
  name: "Plano " + new Date().toLocaleDateString("pt-BR"),
  createdAt: Date.now(),
  sex: patient?.sex === "Feminino" ? "F" : "M",
  weight: 70, height: 170, age: ageFrom(patient?.birth) || 30, bf: 20,
  formula: "mifflin", activity: 1.55, objective: "manutencao", adjust: 500,
  proteinPerKg: 2.0, fatPerKg: 0.8,
  meals: defaultMeals(),
  subs: {}, supplements: [],
});

/* ---------- NumInput: campo numérico que aceita vírgula e ponto ---------- */
function NumInput({ value, onChange, className, ...props }) {
  const [local, setLocal] = useState(value == null || value === "" ? "" : String(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setLocal(value == null || value === "" ? "" : String(value));
  }, [value]);

  const commit = (raw) => {
    const normalized = raw.replace(",", ".");
    const n = parseFloat(normalized);
    if (!isNaN(n)) onChange(n);
  };

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      className={className}
      value={local}
      onFocus={() => { focused.current = true; }}
      onChange={(e) => {
        const raw = e.target.value;
        if (/^-?\d*[,.]?\d*$/.test(raw)) {
          setLocal(raw);
          commit(raw);
        }
      }}
      onBlur={() => {
        focused.current = false;
        const normalized = local.replace(",", ".");
        const n = parseFloat(normalized);
        if (!isNaN(n)) {
          onChange(n);
          setLocal(String(n));
        } else {
          setLocal(value == null || value === "" ? "" : String(value));
        }
      }}
    />
  );
}

/* ============================================================ */
export default function App() {
  /* ── Auth ── */
  const [user, setUser]               = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile]         = useState(null); // perfil Supabase (role)
  const [patientData, setPatientData] = useState(null); // dados do portal do paciente

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ── Carrega role quando user muda ── */
  useEffect(() => {
    if (!user) { setProfile(null); setPatientData(null); return; }
    supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  /* ── Dados do app ── */
  const seedFoods = () => FOODS.map((f) => ({ ...f, m: f.m ? f.m.map((x) => [...x]) : undefined, mc: { ...(f.mc || {}) } }));
  const [data, setData] = useState({ patients: [], diets: {}, appointments: [], assessments: {}, exams: {}, foods: seedFoods(), anamneseTemplate: DEFAULT_ANAMNESE, anamnese: {}, profile: {} });
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("patients");
  const [activePatient, setActivePatient] = useState(null);
  const [activeDiet, setActiveDiet] = useState(null);

  /* ── Carrega dados do Supabase quando nutricionista loga ── */
  useEffect(() => {
    if (!user || !profile) return;
    if (profile.role === 'patient') {
      db.loadPatientData(user.id).then(setPatientData);
      setLoaded(true);
      return;
    }
    // nutricionista
    db.loadAll(user.id).then((remote) => {
      const customFoods = (remote.customFoods || []).map(f => ({ ...f, custom: true, g: f.g || "Meus Alimentos" }));
      setData(d => ({
        ...d,
        patients:         remote.patients || [],
        diets:            remote.diets || {},
        assessments:      remote.assessments || {},
        exams:            remote.exams || {},
        anamnese:         remote.anamnese || {},
        appointments:     remote.appointments || [],
        profile:          remote.profile || {},
        anamneseTemplate: remote.anamneseTemplate || DEFAULT_ANAMNESE,
        foods:            [...seedFoods(), ...customFoods],
      }));
      setLoaded(true);
    });
  }, [user, profile]);

  /* ── CRUD — cada operação atualiza estado local E salva no Supabase ── */
  const patients = data.patients;
  const dietsOf  = (pid) => data.diets[pid] || [];

  const addPatient = async (p, onDone, onError) => {
    const { password, ...patientFields } = p;
    let userId = null;

    // Se informou email + senha, cria a conta de acesso do paciente
    if (patientFields.email && password) {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: patientFields.email,
        password,
        options: { data: { name: patientFields.name, role: 'patient' } },
      });
      if (authErr) {
        onError?.(authErr.message === 'User already registered'
          ? 'Este e-mail já possui uma conta cadastrada.'
          : authErr.message);
        return;
      }
      userId = authData.user?.id || null;
    }

    const novo = { id: uid(), createdAt: Date.now(), ...patientFields, userId };
    setData((d) => ({ ...d, patients: [novo, ...d.patients] }));
    db.insertPatient(user.id, novo);
    onDone?.();
  };

  const saveNextAppointment = (pid, date) => {
    setData((d) => ({ ...d, patients: d.patients.map(p => p.id === pid ? { ...p, nextAppointment: date } : p) }));
    db.setNextAppointment(user.id, pid, date);
  };

  const saveDiet = (pid, diet) => {
    const withTs = { ...diet, updatedAt: Date.now() };
    setData((d) => {
      const list   = d.diets[pid] || [];
      const exists = list.some((x) => x.id === withTs.id);
      const upd    = exists ? list.map((x) => (x.id === withTs.id ? withTs : x)) : [withTs, ...list];
      return { ...d, diets: { ...d.diets, [pid]: upd } };
    });
    db.upsertDiet(user.id, pid, withTs);
  };

  const delDiet = (pid, did) => {
    setData((d) => ({ ...d, diets: { ...d.diets, [pid]: (d.diets[pid] || []).filter((x) => x.id !== did) } }));
    db.deleteDiet(user.id, did);
  };

  const addAppt = (a) => {
    const novo = { id: uid(), ...a };
    setData((d) => ({ ...d, appointments: [...d.appointments, novo] }));
    db.insertAppointment(user.id, novo);
  };

  const saveAssessment = (pid, asmt) => {
    setData((d) => {
      const list   = d.assessments[pid] || [];
      const exists = list.some((x) => x.id === asmt.id);
      const upd    = exists ? list.map((x) => (x.id === asmt.id ? asmt : x)) : [asmt, ...list];
      return { ...d, assessments: { ...d.assessments, [pid]: upd } };
    });
    db.upsertAssessment(user.id, pid, asmt);
  };

  const delAssessment = (pid, aid) => {
    setData((d) => ({ ...d, assessments: { ...d.assessments, [pid]: (d.assessments[pid] || []).filter((x) => x.id !== aid) } }));
    db.deleteAssessment(user.id, aid);
  };

  const assessOf = (pid) => data.assessments[pid] || [];

  const openNewDiet  = (p) => { setActivePatient(p); setActiveDiet(newDiet(p)); setView("builder"); };
  const openDiet     = (p, diet) => { setActivePatient(p); setActiveDiet(JSON.parse(JSON.stringify(diet))); setView("builder"); };
  const openAssessment = (p) => { setActivePatient(p); setView("assessment"); };

  const examsOf  = (pid) => data.exams?.[pid] || [];
  const saveExam = (pid, exam) => {
    const novo = { id: uid(), ...exam };
    setData((d) => ({ ...d, exams: { ...d.exams, [pid]: [novo, ...(d.exams?.[pid] || [])] } }));
    db.insertExam(user.id, pid, novo);
  };
  const delExam = (pid, eid) => {
    setData((d) => ({ ...d, exams: { ...d.exams, [pid]: (d.exams?.[pid] || []).filter((x) => x.id !== eid) } }));
    db.deleteExam(user.id, eid);
  };

  const openExams    = (p) => { setActivePatient(p); setView("exams"); };
  const openAnamnese = (p) => { setActivePatient(p); setView("anamnese"); };
  const anamneseOf   = (pid) => data.anamnese?.[pid] || {};

  const saveAnamnese = (pid, answers) => {
    setData((d) => ({ ...d, anamnese: { ...d.anamnese, [pid]: answers } }));
    db.upsertAnamnese(user.id, pid, answers);
  };

  const saveTemplate = (t) => {
    setData((d) => ({ ...d, anamneseTemplate: t }));
    db.upsertSettings(user.id, { profile: data.profile, anamneseTemplate: t });
  };

  const saveProfile = (p) => {
    setData((d) => ({ ...d, profile: p }));
    db.upsertSettings(user.id, { profile: p, anamneseTemplate: data.anamneseTemplate });
  };

  const foods      = data.foods || [];
  const addFood    = (f) => {
    const novo = { id: "c" + uid(), custom: true, g: f.g || "Meus Alimentos", ...f };
    setData((d) => ({ ...d, foods: [novo, ...(d.foods || [])] }));
    db.insertFood(user.id, novo);
  };
  const updateFood = (id, patch) => {
    setData((d) => ({ ...d, foods: (d.foods || []).map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
    const updated = (data.foods || []).find(x => x.id === id);
    if (updated) db.updateFood(user.id, { ...updated, ...patch });
  };
  const delFood    = (id) => {
    setData((d) => ({ ...d, foods: (d.foods || []).filter((x) => x.id !== id) }));
    db.deleteFood(user.id, id);
  };
  const allFoods = foods;

  /* ── Render guards ── */
  const ADMIN_EMAIL = 'josuebailonutri@gmail.com';
  if (authLoading) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'sans-serif', color: '#5d6f66' }}>Carregando…</div>;
  if (!user) return <Login />;

  // Ainda carregando o perfil
  if (!profile) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'sans-serif', color: '#5d6f66' }}>Carregando…</div>;

  // Portal do paciente
  if (profile.role === 'patient' && patientData) return <PatientPortal patientData={patientData} user={user} />;
  if (profile.role === 'patient' && !patientData) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'sans-serif', color: '#5d6f66' }}>Carregando dados…</div>;

  // Bloqueia qualquer usuário que não seja o admin
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f4f6f3', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: 'center', maxWidth: 360, padding: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontFamily: "'Fraunces', serif", color: '#16241d', marginBottom: 8 }}>Acesso restrito</h2>
          <p style={{ color: '#5d6f66', marginBottom: 24 }}>Esta conta não tem acesso ao painel administrativo. Entre em contato com seu nutricionista.</p>
          <button onClick={() => supabase.auth.signOut()} style={{ background: '#1f9d63', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Sair</button>
        </div>
      </div>
    );
  }

  return (
    <div className="np">
      <style>{STYLE}</style>
      <div className="layout">
        <aside className="side">
          <div className="brand"><div className="logo"><Utensils size={17} /></div><b>{APP_NAME}</b></div>
          <div className="navlabel">Menu Principal</div>
          <button className={"navitem" + (view === "patients" ? " active" : "")} onClick={() => setView("patients")}><Users size={18} /> Meus Pacientes</button>
          <button className={"navitem" + (view === "agenda" ? " active" : "")} onClick={() => setView("agenda")}><CalendarDays size={18} /> Minha Agenda</button>
          <button className={"navitem" + (view === "myfoods" ? " active" : "")} onClick={() => setView("myfoods")}><Apple size={18} /> Meus Alimentos</button>
          <button className={"navitem" + (view === "profile" ? " active" : "")} onClick={() => setView("profile")}><UserCircle size={18} /> Perfil</button>

          {activePatient && (
            <>
              <div className="navlabel">Paciente Atual</div>
              <div style={{ padding: "0 11px 6px", fontWeight: 600, fontSize: 13 }}>{activePatient.name}</div>
              <button className={"navitem" + (view === "portal" ? " active" : "")} onClick={() => setView("portal")} style={{ color: 'var(--green-d)', fontWeight: 600 }}><UserCircle size={18} /> Portal do Paciente</button>
              <button className={"navitem" + (view === "builder" ? " active" : "")} onClick={() => openNewDiet(activePatient)}><Utensils size={18} /> Nova Dieta</button>
              <button className={"navitem" + (view === "history" ? " active" : "")} onClick={() => setView("history")}><ClipboardList size={18} /> Histórico de Dietas</button>
              <button className={"navitem" + (view === "assessment" ? " active" : "")} onClick={() => setView("assessment")}><Activity size={18} /> Avaliação Física</button>
              <button className={"navitem" + (view === "exams" ? " active" : "")} onClick={() => setView("exams")}><FlaskConical size={18} /> Exames Lab.</button>
              <button className={"navitem" + (view === "anamnese" ? " active" : "")} onClick={() => setView("anamnese")}><FileText size={18} /> Anamnese</button>
              <button className="navitem" style={{ color: '#e5484d', marginTop: 4 }} onClick={() => { setActivePatient(null); setView("patients"); }}><LogOut size={18} /> Sair do Paciente</button>
            </>
          )}
          <div style={{ flex: 1 }} />
          <button className="navitem" onClick={() => supabase.auth.signOut()} style={{ color: "#e5484d", marginTop: 8 }}>
            <LogOut size={18} /> Sair
          </button>
        </aside>

        <main className="main">
          {!loaded ? <div className="empty">Carregando…</div> :
            view === "patients" ? <PatientsView patients={patients} onAdd={addPatient} onNewDiet={openNewDiet} onHistory={(p) => { setActivePatient(p); setView("history"); }} onAssessment={openAssessment} onExams={openExams} onAnamnese={openAnamnese} dietsOf={dietsOf} onPortal={(p) => { setActivePatient(p); setView("portal"); }} /> :
            view === "portal" ? <PatientPortalAdmin patient={activePatient} nutritionistId={user.id} onSaveAppt={(d) => saveNextAppointment(activePatient.id, d)} onBack={() => setView("patients")} /> :
            view === "agenda" ? <AgendaView patients={patients} /> :
            view === "myfoods" ? <MyFoodsView foods={foods} onAdd={addFood} onUpdate={updateFood} onDel={delFood} /> :
            view === "assessment" ? <AssessmentView patient={activePatient} assessments={assessOf(activePatient?.id)} onSave={(a) => saveAssessment(activePatient.id, a)} onDel={(aid) => delAssessment(activePatient.id, aid)} onPickPatient={() => setView("patients")} /> :
            view === "exams" ? <ExamsView patient={activePatient} exams={examsOf(activePatient?.id)} onSave={(e) => saveExam(activePatient.id, e)} onDel={(eid) => delExam(activePatient.id, eid)} onPickPatient={() => setView("patients")} /> :
            view === "anamnese" ? <AnamneseView key={activePatient?.id} patient={activePatient} template={data.anamneseTemplate || DEFAULT_ANAMNESE} answers={anamneseOf(activePatient?.id)} onSaveAnswers={(a) => saveAnamnese(activePatient.id, a)} onSaveTemplate={saveTemplate} onPickPatient={() => setView("patients")} /> :
            view === "profile" ? <ProfileView profile={data.profile || {}} onSave={saveProfile} /> :
            view === "history" ? <HistoryView patient={activePatient} diets={dietsOf(activePatient?.id)} onOpen={(d) => openDiet(activePatient, d)} onNew={() => openNewDiet(activePatient)} onDel={(did) => delDiet(activePatient.id, did)} onDuplicate={(d) => { const copy = { ...JSON.parse(JSON.stringify(d)), id: uid(), name: d.name + " (cópia)", createdAt: Date.now(), active: false }; saveDiet(activePatient.id, copy); }} onRename={(did, name) => { const diet = dietsOf(activePatient.id).find(x => x.id === did); if (diet) saveDiet(activePatient.id, { ...diet, name }); }} onSetActive={(did) => { dietsOf(activePatient.id).forEach(d => saveDiet(activePatient.id, { ...d, active: d.id === did })); }} /> :
            view === "builder" ? <Builder patient={activePatient} diet={activeDiet} setDiet={setActiveDiet} foods={allFoods} profile={data.profile || {}} onSave={() => { saveDiet(activePatient.id, activeDiet); setView("history"); }} onBack={() => setView("history")} /> :
            null}
        </main>
      </div>
      {/* PrintView fica fora do .layout para evitar páginas em branco no PDF */}
      {view === "builder" && activeDiet && activePatient && (
        <PrintView diet={activeDiet} patient={activePatient} profile={data.profile || {}} />
      )}
    </div>
  );
}

/* ---------- Pacientes ---------- */
function PatientsView({ patients, onAdd, onNewDiet, onHistory, onAssessment, onExams, onAnamnese, dietsOf, onPortal }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const list = patients.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <h1 className="title">Meus <span>Pacientes</span></h1>
      <p className="sub">Gerencie seus pacientes e dietas</p>
      <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
        <div className="searchbar"><Search size={18} /><input className="field" placeholder="Buscar pacientes…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <button className="btn" onClick={() => setOpen(true)}><Plus size={18} /> Novo Paciente</button>
      </div>

      {list.length === 0 ? (
        <div className="empty"><Users size={40} style={{ opacity: .4 }} /><p>Nenhum paciente ainda. Clique em “Novo Paciente” para começar.</p></div>
      ) : (
        <div className="grid-cards">
          {list.map((p) => (
            <div className="pcard" key={p.id}>
              <div className="top"><div className="avatar"><UserCircle size={26} /></div><div><div className="nm">{p.name}</div><div className="ag">{ageFrom(p.birth) ? ageFrom(p.birth) + " anos" : (p.sex || "")}</div></div></div>
              <div className="meta">
                {p.email && <div><Mail size={14} /> {p.email}</div>}
                {p.phone && <div><Phone size={14} /> {p.phone}</div>}
                {p.birth && <div><Cake size={14} /> {new Date(p.birth).toLocaleDateString("pt-BR")}</div>}
                <div><ClipboardList size={14} /> {dietsOf(p.id).length} dieta(s)</div>
              </div>
              <div className="acts">
                <button className="btn sm" onClick={() => onNewDiet(p)}><Utensils size={15} /> Nova Dieta</button>
                <button className="btn sm ghost" onClick={() => onHistory(p)}><ClipboardList size={15} /> Ver Dietas</button>
                <button className="btn sm ghost" onClick={() => onAssessment(p)}><Activity size={15} /> Avaliação</button>
                <button className="btn sm ghost" onClick={() => onExams(p)}><FlaskConical size={15} /> Exames</button>
                <button className="btn sm ghost wide" onClick={() => onAnamnese(p)}><FileText size={15} /> Anamnese</button>
                <button className="btn sm ghost wide" onClick={() => onPortal(p)} style={{ color: '#1f9d63', borderColor: '#cde8d8' }}><UserCircle size={15} /> Portal do Paciente</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && <PatientModal onClose={() => setOpen(false)} onSave={onAdd} />}
    </>
  );
}

function PatientModal({ onClose, onSave }) {
  const [f, setF]       = useState({ name: "", sex: "", email: "", phone: "", birth: "", notes: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const handleSave = async () => {
    if (!f.name) return;
    if (f.email && !f.password) { setError("Informe uma senha para o paciente acessar o portal."); return; }
    if (f.password && f.password.length < 6) { setError("A senha precisa ter pelo menos 6 caracteres."); return; }
    setLoading(true); setError("");
    await onSave(f, () => { setLoading(false); onClose(); }, (msg) => { setError(msg); setLoading(false); });
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <h3>Novo Paciente <button className="x" onClick={onClose}><X size={20} /></button></h3>

        {error && <div style={{ background: '#fde8e9', border: '1px solid #f3c5c6', color: '#9b1c1f', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13 }}>{error}</div>}

        <div className="row"><label className="lbl"><UserCircle size={14} /> Nome completo *</label><input className="field" value={f.name} onChange={(e) => up("name", e.target.value)} placeholder="Nome do paciente" /></div>
        <div className="row"><label className="lbl"><Users size={14} /> Sexo</label><select className="field" value={f.sex} onChange={(e) => up("sex", e.target.value)}><option value="">Selecione</option><option>Masculino</option><option>Feminino</option></select></div>
        <div className="two">
          <div><label className="lbl"><Phone size={14} /> Telefone</label><input className="field" value={f.phone} onChange={(e) => up("phone", e.target.value)} placeholder="(00) 00000-0000" /></div>
          <div><label className="lbl"><Cake size={14} /> Nascimento</label><input type="date" className="field" value={f.birth} onChange={(e) => up("birth", e.target.value)} /></div>
        </div>
        <div className="row"><label className="lbl"><ClipboardList size={14} /> Observações</label><textarea className="field" rows={2} value={f.notes} onChange={(e) => up("notes", e.target.value)} placeholder="Anotações sobre o paciente…" /></div>

        {/* Separador de acesso ao portal */}
        <div style={{ borderTop: '1px solid #e4e9e3', margin: '16px 0 14px', paddingTop: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#1f9d63', marginBottom: 4 }}>🔑 Acesso ao Portal do Paciente</div>
          <div style={{ fontSize: 12, color: '#5d6f66', marginBottom: 12 }}>Opcional — preencha para que o paciente possa entrar no portal.</div>
          <div className="row" style={{ marginBottom: 12 }}>
            <label className="lbl"><Mail size={14} /> E-mail de acesso</label>
            <input className="field" type="email" value={f.email} onChange={(e) => up("email", e.target.value)} placeholder="email@paciente.com" />
          </div>
          {f.email && (
            <div className="row">
              <label className="lbl"><Lock size={14} /> Senha de acesso (mín. 6 caracteres)</label>
              <input className="field" type="password" value={f.password} onChange={(e) => up("password", e.target.value)} placeholder="Crie uma senha para o paciente" />
            </div>
          )}
        </div>

        <div className="foot">
          <button className="btn ghost" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="btn" disabled={!f.name || loading} onClick={handleSave}>
            {loading ? "Criando…" : "Criar Paciente"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Histórico (base da periodização) ---------- */
function HistoryView({ patient, diets, onOpen, onNew, onDel, onDuplicate, onRename, onSetActive }) {
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal]   = useState("");

  if (!patient) return <div className="empty">Selecione um paciente.</div>;

  const startRename = (d) => { setRenamingId(d.id); setRenameVal(d.name); };
  const confirmRename = (d) => {
    if (renameVal.trim() && renameVal.trim() !== d.name) onRename(d.id, renameVal.trim());
    setRenamingId(null);
  };

  // Determina qual dieta está publicada para o paciente
  const hasExplicitActive = diets.some(d => d.active === true);
  const activeDietId = hasExplicitActive
    ? diets.find(d => d.active === true)?.id
    : (diets.length > 0 ? [...diets].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0]?.id : null);

  const fmtTs = (ts) => {
    if (!ts) return null;
    return new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <div className="topbar"><h1 className="title" style={{ flex: 1 }}>Dietas — <span>{patient.name}</span></h1><button className="btn" onClick={onNew}><Plus size={17} /> Nova Dieta</button></div>
      <p className="sub" style={{ marginTop: -14, marginBottom: 18 }}>Duplique um plano para periodizar e use "Publicar para paciente" para definir qual dieta ele verá no portal.</p>
      {diets.length === 0 ? <div className="empty"><ClipboardList size={40} style={{ opacity: .4 }} /><p>Nenhuma dieta montada ainda.</p></div> :
        diets.map((d) => {
          const tgt = computeTargets(d);
          const isRenaming = renamingId === d.id;
          const isActive = d.id === activeDietId;
          return (
            <div className="panel" key={d.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 18, flexWrap: "wrap", border: isActive ? '2px solid var(--green)' : undefined }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {isRenaming ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input className="field" value={renameVal} autoFocus
                      onChange={e => setRenameVal(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") confirmRename(d); if (e.key === "Escape") setRenamingId(null); }}
                      style={{ maxWidth: 280 }} />
                    <button className="btn sm" onClick={() => confirmRename(d)}><Save size={14} /></button>
                    <button className="btn sm ghost" onClick={() => setRenamingId(null)}>Cancelar</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{d.name}</div>
                    {isActive && <span style={{ fontSize: 11, background: 'var(--green)', color: '#fff', padding: '2px 10px', borderRadius: 999, fontWeight: 700 }}>📢 Publicada</span>}
                    <button className="iconbtn" title="Renomear" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 3 }} onClick={() => startRename(d)}><Pencil size={13} /></button>
                  </div>
                )}
                {!isRenaming && (
                  <div className="sub" style={{ fontSize: 12.5, marginTop: 4 }}>
                    {r0(tgt.kcal)} kcal · {r0(tgt.p)}g P / {r0(tgt.c)}g C / {r0(tgt.f)}g G
                    <br />
                    <span style={{ color: 'var(--ink-soft)' }}>
                      Criada: {new Date(d.createdAt).toLocaleDateString("pt-BR")}
                      {d.updatedAt && d.updatedAt !== d.createdAt && (
                        <span> · Modificada: {fmtTs(d.updatedAt)}</span>
                      )}
                    </span>
                  </div>
                )}
              </div>
              {!isRenaming && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  {!isActive && (
                    <button className="btn sm" style={{ background: 'var(--green-soft)', color: 'var(--green-d)', border: '1px solid #cde8d8' }} title="Publicar esta dieta para o paciente" onClick={() => onSetActive(d.id)}>
                      📢 Publicar para paciente
                    </button>
                  )}
                  <button className="btn sm ghost" onClick={() => onOpen(d)}><Pencil size={15} /> Abrir</button>
                  <button className="btn sm ghost" onClick={() => onDuplicate(d)}><Copy size={15} /> Duplicar</button>
                  <button className="btn sm danger" onClick={() => onDel(d.id)}><Trash2 size={15} /></button>
                </div>
              )}
            </div>
          );
        })}
    </>
  );
}

/* ---------- Agenda ---------- */
function AgendaView({ patients }) {
  // Mostra somente consultas definidas via Portal do Paciente (nextAppointment)
  const withAppt = patients
    .filter(p => p.nextAppointment)
    .sort((a, b) => (a.nextAppointment || '').localeCompare(b.nextAppointment || ''));
  const hoje = new Date().toISOString().slice(0, 10);
  const proximas = withAppt.filter(p => (p.nextAppointment || '') >= hoje);
  const passadas  = withAppt.filter(p => (p.nextAppointment || '') < hoje);

  const fmtApptDate = (raw) => {
    if (!raw) return '—';
    const dt = new Date(raw.includes('T') ? raw : raw + 'T12:00');
    const dateStr = dt.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = raw.includes('T') && raw.length > 10 ? ` · ${raw.slice(11, 16)}` : '';
    return dateStr + timeStr;
  };

  const renderRow = (p) => (
    <div key={p.id} className="item" style={{ padding: '12px 4px' }}>
      <div className="avatar" style={{ width: 38, height: 38, flexShrink: 0 }}><UserCircle size={20} /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>{p.name}</div>
        {p.phone && <div className="iqt">{p.phone}</div>}
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 700, color: 'var(--green-d)', fontSize: 13 }}>{fmtApptDate(p.nextAppointment)}</div>
      </div>
    </div>
  );

  return (
    <>
      <h1 className="title">Minha <span>Agenda</span></h1>
      <p className="sub">Consultas definidas no Portal do Paciente</p>
      <div className="infobox" style={{ marginTop: 20 }}>
        Para agendar ou alterar uma consulta, acesse <b>Meus Pacientes → Portal do Paciente</b> e defina a data de "Próxima Consulta".
      </div>
      <div className="panel" style={{ marginTop: 0 }}>
        <h2>Próximas consultas ({proximas.length})</h2>
        {proximas.length === 0
          ? <div className="empty" style={{ padding: 30 }}>Nenhuma consulta futura agendada.</div>
          : proximas.map(renderRow)}
      </div>
      {passadas.length > 0 && (
        <div className="panel">
          <h2 style={{ color: 'var(--ink-soft)' }}>Consultas passadas ({passadas.length})</h2>
          {passadas.map(renderRow)}
        </div>
      )}
    </>
  );
}

/* ---------- Cálculos da dieta ---------- */
function computeTargets(d) {
  const tmb = tmbCalc(d.formula, d.sex, d.weight, d.height, d.age, d.bf);
  const get = tmb * d.activity;
  const vet = d.objective === "emagrecimento" ? get - d.adjust : d.objective === "hipertrofia" ? get + d.adjust : get;
  const pG = d.proteinPerKg * d.weight, pK = pG * 4;
  const fG = d.fatPerKg * d.weight, fK = fG * 9;
  const cK = Math.max(0, vet - pK - fK), cG = cK / 4;
  return { tmb, get, vet, kcal: vet, p: pG, c: cG, f: fG, pK, fK, cK, cPerKg: cG / d.weight };
}

/* ---------- Modal de confirmação de salvar dieta ---------- */
function SaveDietModal({ onSave, onClose }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 400, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>💾</div>
        <h3 style={{ justifyContent: 'center', fontSize: 20, marginBottom: 8 }}>Salvar dieta?</h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 22 }}>A dieta será salva no histórico do paciente.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn" style={{ justifyContent: 'center' }} onClick={onSave}>
            <Save size={16} /> Salvar e voltar ao histórico
          </button>
          <button className="btn ghost" style={{ justifyContent: 'center' }} onClick={onClose}>
            Continuar editando
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Builder ---------- */
function Builder({ patient, diet, setDiet, onSave, onBack, foods, profile }) {
  const [foodModal, setFoodModal] = useState(null); // {mealId}
  const [saveModal, setSaveModal] = useState(false);
  const tgt = useMemo(() => computeTargets(diet), [diet]);
  const dayTotals = useMemo(() => sumMacros(diet.meals.flatMap((m) => m.items)), [diet]);
  const microTotals = useMemo(() => sumMicros(diet.meals.flatMap((m) => m.items)), [diet]);
  const microGoals = useMemo(() => microTargets(diet.sex, tgt.vet), [diet.sex, tgt.vet]);
  const up = (k, v) => setDiet((d) => ({ ...d, [k]: v }));

  const pFill = ((diet.proteinPerKg - 1.0) / (3.5 - 1.0)) * 100;
  const fFill = ((diet.fatPerKg - 0.5) / (2.0 - 0.5)) * 100;

  const usedFoods = useMemo(() => {
    const seen = {}; diet.meals.forEach((m) => m.items.forEach((it) => { const key = it.foodId || it.name; if (!seen[key]) seen[key] = { id: key, n: it.name || "Alimento" }; }));
    return Object.values(seen).filter(Boolean);
  }, [diet]);

  const pct = (val, t) => (t > 0 ? Math.min(100, (val / t) * 100) : 0);

  return (
    <>
      <div className="topbar">
        <button className="btn sm ghost" onClick={onBack}><ArrowLeft size={16} /> Voltar</button>
        <div className="ttl">Dieta — {patient?.name}</div>
        <button className="btn sm ghost" onClick={() => window.print()}><FileDown size={16} /> Gerar PDF</button>
        <button className="btn sm" onClick={() => setSaveModal(true)}><Save size={16} /> Salvar</button>
      </div>

      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <span style={{ background: "var(--green-soft)", color: "var(--green-d)", padding: "5px 14px", borderRadius: 999, fontWeight: 600, fontSize: 13 }}>✦ Nova Dieta</span>
        <h1 className="serif" style={{ fontSize: 34, margin: "10px 0 2px" }}>Monte a <span style={{ color: "var(--green)" }}>Dieta</span></h1>
        <p className="sub">Configure o perfil nutricional do paciente.</p>
      </div>

      {/* Config */}
      <div className="panel">
        <div className="sex-toggle">
          <div className={"sexbtn" + (diet.sex === "M" ? " on" : "")} onClick={() => up("sex", "M")}><span className="emo">🧑</span>Masculino</div>
          <div className={"sexbtn" + (diet.sex === "F" ? " on" : "")} onClick={() => up("sex", "F")}><span className="emo">👩</span>Feminino</div>
        </div>
        <div className="three">
          <div><label className="lbl">Peso (kg)</label><NumInput className="field" value={diet.weight} onChange={(v) => up("weight", v)} /></div>
          <div><label className="lbl">Altura (cm)</label><NumInput className="field" value={diet.height} onChange={(v) => up("height", v)} /></div>
          <div><label className="lbl">Idade</label><NumInput className="field" value={diet.age} onChange={(v) => up("age", v)} /></div>
        </div>
        <div className="two">
          <div><label className="lbl">Fórmula de TMB/GET</label><select className="field" value={diet.formula} onChange={(e) => up("formula", e.target.value)}>{Object.entries(FORMULAS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
          <div><label className="lbl">Nível de Atividade</label><select className="field" value={diet.activity} onChange={(e) => up("activity", +e.target.value)}>{ACTIVITY.map((a) => <option key={a.v} value={a.v}>{a.k}</option>)}</select></div>
        </div>
        <div className="two">
          <div><label className="lbl">Objetivo</label><select className="field" value={diet.objective} onChange={(e) => up("objective", e.target.value)}><option value="manutencao">Manutenção</option><option value="emagrecimento">Emagrecimento (déficit)</option><option value="hipertrofia">Hipertrofia (superávit)</option></select></div>
          {diet.objective !== "manutencao" && <div><label className="lbl">{diet.objective === "emagrecimento" ? "Déficit (kcal)" : "Superávit (kcal)"}</label><select className="field" value={diet.adjust} onChange={(e) => up("adjust", +e.target.value)}>{[300, 500, 600, 750, 1000].map((n) => <option key={n} value={n}>{n} kcal</option>)}</select></div>}
          {FORMULAS[diet.formula].needsBf && <div><label className="lbl">% Gordura corporal</label><NumInput className="field" value={diet.bf} onChange={(v) => up("bf", v)} /></div>}
        </div>
      </div>

      {/* Cálculos energéticos */}
      <div className="panel">
        <div className="calc">
          <div className="blk"><div className="k">🔥 TMB (Taxa Metabólica Basal)</div><div className="v">{r0(tgt.tmb)} <small style={{ fontSize: 14 }}>kcal</small></div></div>
          <div className="blk"><div className="k">⚡ GET (Gasto Energético Total)</div><div className="v">{r0(tgt.get)} <small style={{ fontSize: 14 }}>kcal</small></div></div>
          <div className="blk"><div className="k">🎯 VET (Meta Calórica)</div><div className="v vet">{r0(tgt.vet)} <small style={{ fontSize: 14 }}>kcal</small></div></div>
          <div className="note">Peso: {diet.weight}kg · {diet.objective === "manutencao" ? "manutenção" : `${diet.adjust} kcal (${diet.objective === "emagrecimento" ? "déficit" : "superávit"})`}</div>
        </div>

        {/* Sliders de macro — o coração */}
        <div className="slider-row">
          <div className="slider-head"><div className="name">🥩 Proteína</div><div className="pill p">{r1(diet.proteinPerKg)} g/kg</div></div>
          <input type="range" className="p" min="1.0" max="3.5" step="0.1" value={diet.proteinPerKg} style={{ "--fill": pFill + "%" }} onChange={(e) => up("proteinPerKg", +e.target.value)} />
          <div className="scale"><span>1.0 g/kg</span><span>2.0 g/kg</span><span>3.5 g/kg</span></div>
        </div>
        <div className="slider-row">
          <div className="slider-head"><div className="name">🫒 Gordura</div><div className="pill f">{r1(diet.fatPerKg)} g/kg</div></div>
          <input type="range" className="f" min="0.5" max="2.0" step="0.1" value={diet.fatPerKg} style={{ "--fill": fFill + "%" }} onChange={(e) => up("fatPerKg", +e.target.value)} />
          <div className="scale"><span>0.5 g/kg</span><span>1.0 g/kg</span><span>2.0 g/kg</span></div>
        </div>
        <div className="slider-row">
          <div className="slider-head"><div className="name">🍚 Carboidrato <span style={{ color: "var(--ink-soft)", fontWeight: 400, fontSize: 12 }}>(automático)</span></div><div className="pill c">{r1(tgt.cPerKg)} g/kg</div></div>
          <div className="carbbar"><div style={{ width: Math.min(100, (tgt.cPerKg / 8) * 100) + "%" }} /></div>
          <div className="scale"><span>0 g/kg</span><span>4.0 g/kg</span><span>8.0 g/kg</span></div>
        </div>

        <table className="macrotable">
          <thead><tr><th></th><th>🥩 PTN</th><th>🫒 LIP</th><th>🍚 CHO</th></tr></thead>
          <tbody>
            <tr><td>g/kg</td><td className="cp">{r1(diet.proteinPerKg)}</td><td className="cf">{r1(diet.fatPerKg)}</td><td className="cc">{r1(tgt.cPerKg)}</td></tr>
            <tr><td>g/dia</td><td className="cp">{r0(tgt.p)}</td><td className="cf">{r0(tgt.f)}</td><td className="cc">{r0(tgt.c)}</td></tr>
            <tr><td>kcal</td><td className="cp">{r0(tgt.pK)}</td><td className="cf">{r0(tgt.fK)}</td><td className="cc">{r0(tgt.cK)}</td></tr>
            <tr><td>% do VET</td><td className="cp">{r0((tgt.pK / tgt.vet) * 100)}%</td><td className="cf">{r0((tgt.fK / tgt.vet) * 100)}%</td><td className="cc">{r0((tgt.cK / tgt.vet) * 100)}%</td></tr>
          </tbody>
        </table>
      </div>

      {/* Resumo + refeições */}
      <div className="panel">
        <h2 style={{ marginBottom: 16 }}>📊 Resumo Nutricional</h2>
        <div className="summary five">
          {[
            { lab: "Calorias", val: dayTotals.kcal, t: tgt.kcal, u: "", col: "var(--kcal)" },
            { lab: "Proteínas", val: dayTotals.p, t: tgt.p, u: "g", col: "var(--p)" },
            { lab: "Carboidratos", val: dayTotals.c, t: tgt.c, u: "g", col: "var(--c)" },
            { lab: "Gorduras", val: dayTotals.f, t: tgt.f, u: "g", col: "var(--f)" },
            { lab: "Fibras", val: dayTotals.fib, t: 14 * tgt.vet / 1000, u: "g", col: "var(--fib)" },
          ].map((s) => (
            <div className="it" key={s.lab}>
              <div className="lab">{s.lab}</div>
              <div className="big" style={{ color: s.col }}>{r0(s.val)}{s.u}</div>
              <div className="track"><div style={{ width: pct(s.val, s.t) + "%", background: s.col }} /></div>
              <div className="tgt">meta {r0(s.t)}{s.u} · {r0(pct(s.val, s.t))}%</div>
            </div>
          ))}
        </div>
      </div>

      {diet.meals.map((meal) => {
        const mm = sumMacros(meal.items);
        return (
          <div className="meal" key={meal.id}>
            <div className="meal-head">
              <input value={meal.name} onChange={(e) => setDiet((d) => ({ ...d, meals: d.meals.map((m) => m.id === meal.id ? { ...m, name: e.target.value } : m) }))} style={{ border: "none", background: "none", fontWeight: 700, fontSize: 15, width: 160, color: "var(--ink)" }} />
              <input type="time" value={meal.time} onChange={(e) => setDiet((d) => ({ ...d, meals: d.meals.map((m) => m.id === meal.id ? { ...m, time: e.target.value } : m) }))} className="time" style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "3px 7px", fontFamily: "inherit" }} />
              <div className="meal-macros">
                <span style={{ color: "var(--kcal)" }}>KCAL {r0(mm.kcal)}</span>
                <span style={{ color: "var(--p)" }}>PTN {r0(mm.p)}g</span>
                <span style={{ color: "var(--c)" }}>CHO {r0(mm.c)}g</span>
                <span style={{ color: "var(--f)" }}>LIP {r0(mm.f)}g</span>
                <span style={{ color: "var(--fib)" }}>FIB {r0(mm.fib)}g</span>
                <button className="iconbtn" title="Copiar refeição" onClick={() => setDiet((d) => { const idx = d.meals.findIndex((m) => m.id === meal.id); const copy = { ...JSON.parse(JSON.stringify(meal)), id: uid(), name: meal.name + " (cópia)", items: meal.items.map((it) => ({ ...it, id: uid() })) }; const meals = [...d.meals]; meals.splice(idx + 1, 0, copy); return { ...d, meals }; })}><Copy size={16} /></button>
                <button className="iconbtn" title="Excluir refeição" onClick={() => setDiet((d) => ({ ...d, meals: d.meals.filter((m) => m.id !== meal.id) }))}><X size={16} /></button>
              </div>
            </div>
            <div className="meal-body">
              {meal.items.map((it) => { const m = itemMacros(it); return (
                <div className="item" key={it.id}>
                  <div><div className="inm">{it.name}</div><div className="iqt">{it.label}</div></div>
                  <div className="imac">{r0(m.kcal)} kcal · P{r0(m.p)} C{r0(m.c)} G{r0(m.f)}</div>
                  <button className="iconbtn" onClick={() => setDiet((d) => ({ ...d, meals: d.meals.map((mm2) => mm2.id === meal.id ? { ...mm2, items: mm2.items.filter((x) => x.id !== it.id) } : mm2) }))}><Trash2 size={15} /></button>
                </div>
              ); })}
              <button className="btn sm ghost" style={{ marginTop: 10 }} onClick={() => setFoodModal({ mealId: meal.id })}><Plus size={15} /> Adicionar alimento</button>
            </div>
          </div>
        );
      })}

      <button className="btn ghost" style={{ marginBottom: 24 }} onClick={() => setDiet((d) => ({ ...d, meals: [...d.meals, { id: uid(), name: "Nova Refeição", time: "12:00", items: [] }] }))}><Plus size={16} /> Adicionar refeição</button>

      {/* Micronutrientes, fibras e vitaminas */}
      <div className="panel">
        <h2><Activity size={18} style={{ verticalAlign: "-3px" }} /> Fibras, Vitaminas e Minerais</h2>
        <p className="ph">Quanto a dieta atingiu da recomendação diária. A meta de fibras segue 14 g por 1000 kcal.</p>
        <div className="micros">
          {Object.entries(microGoals).map(([key, g]) => {
            const val = key === "fib" ? dayTotals.fib : (microTotals[key] || 0);
            const ratio = g.goal > 0 ? val / g.goal : 0;
            const isLimit = g.type === "limit";
            const over = isLimit && ratio > 1;
            const reached = !isLimit && ratio >= 0.9;
            const color = over ? "#e5484d" : isLimit ? "#f1932c" : reached ? "var(--green)" : ratio >= 0.5 ? "#f1932c" : "#e5484d";
            return (
              <div className={"micro" + (g.hi ? " hi" : "")} key={key}>
                <div className="top">
                  <span className="nm">{g.hi ? "🌾 " : ""}{g.label}</span>
                  <span className="vl"><b>{r1(val)}</b> / {isLimit ? "máx " : ""}{r0(g.goal)} {g.unit} · {r0(ratio * 100)}%</span>
                </div>
                <div className="track"><div style={{ width: Math.min(100, ratio * 100) + "%", background: color }} /></div>
              </div>
            );
          })}
        </div>
        <p className="ph" style={{ marginTop: 14, marginBottom: 0 }}>Observação: a tabela TACO não traz Vitamina D, B12 e E — preencha esses valores nos alimentos em “Meus Alimentos” para que apareçam aqui. Alimentos próprios entram com fibra e com os micronutrientes que você informar.</p>
      </div>

      {/* Suplementação */}
      <div className="panel">
        <h2><Pill size={18} style={{ verticalAlign: "-3px" }} /> Suplementação</h2>
        <p className="ph">Adicione suplementos com dose e horário.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          {(diet.supplements || []).map((s, i) => (
            <span className="chip" key={i}>{s.name} · {s.dose} · {s.time}<button onClick={() => setDiet((d) => ({ ...d, supplements: d.supplements.filter((_, j) => j !== i) }))}><X size={13} /></button></span>
          ))}
        </div>
        <SupplementAdder onAdd={(s) => setDiet((d) => ({ ...d, supplements: [...(d.supplements || []), s] }))} />
      </div>

      {/* Substituições */}
      <div className="panel">
        <h2><Repeat size={18} style={{ verticalAlign: "-3px" }} /> Substituições Permitidas</h2>
        <p className="ph">Defina alternativas para cada alimento usado na dieta.</p>
        {usedFoods.length === 0 ? <div className="empty" style={{ padding: 24 }}>Adicione alimentos às refeições para definir substituições.</div> :
          usedFoods.map((food) => (
            <div className="subrow" key={food.id}>
              <div className="a">{food.n}</div>
              <div className="b">
                {(diet.subs[food.id] || []).map((s, i) => (
                  <span className="chip" key={i}>{s}<button onClick={() => setDiet((d) => ({ ...d, subs: { ...d.subs, [food.id]: d.subs[food.id].filter((_, j) => j !== i) } }))}><X size={13} /></button></span>
                ))}
                <SubAdder onAdd={(val) => setDiet((d) => ({ ...d, subs: { ...d.subs, [food.id]: [...(d.subs[food.id] || []), val] } }))} />
              </div>
            </div>
          ))}
      </div>

      {foodModal && <FoodModal meal={diet.meals.find((m) => m.id === foodModal.mealId)} foods={foods} onClose={() => setFoodModal(null)} onAdd={(item) => { setDiet((d) => ({ ...d, meals: d.meals.map((m) => m.id === foodModal.mealId ? { ...m, items: [...m.items, item] } : m) })); setFoodModal(null); }} />}

      {/* Botão salvar fixo no final */}
      <div style={{ position: 'sticky', bottom: 24, display: 'flex', justifyContent: 'flex-end', marginTop: 8, marginBottom: 24, pointerEvents: 'none' }}>
        <button className="btn" style={{ pointerEvents: 'all', boxShadow: '0 4px 20px rgba(31,157,99,.4)', padding: '13px 24px', fontSize: 15 }} onClick={() => setSaveModal(true)}>
          <Save size={18} /> Salvar Dieta
        </button>
      </div>

      {saveModal && <SaveDietModal onSave={() => { setSaveModal(false); onSave(); }} onClose={() => setSaveModal(false)} />}
    </>
  );
}

function SupplementAdder({ onAdd }) {
  const [s, setS] = useState({ name: "Creatina", dose: "5g", time: "08:00" });
  return (
    <div className="two" style={{ gridTemplateColumns: "1.4fr 1fr 1fr auto", alignItems: "end", marginBottom: 0 }}>
      <div><label className="lbl">Suplemento</label><select className="field" value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })}>{SUPPLEMENTS.map((x) => <option key={x}>{x}</option>)}</select></div>
      <div><label className="lbl">Dose</label><input className="field" value={s.dose} onChange={(e) => setS({ ...s, dose: e.target.value })} /></div>
      <div><label className="lbl">Horário</label><input type="time" className="field" value={s.time} onChange={(e) => setS({ ...s, time: e.target.value })} /></div>
      <button className="btn" onClick={() => onAdd(s)}><Plus size={16} /></button>
    </div>
  );
}

function SubAdder({ onAdd }) {
  const [name, setName] = useState("");
  const [qty,  setQty]  = useState("");

  const add = () => {
    if (!name.trim()) return;
    const text = qty.trim() ? `${name.trim()} — ${qty.trim()}` : name.trim();
    onAdd(text);
    setName(""); setQty("");
  };

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap", maxWidth: 560 }}>
      <input className="field" style={{ flex: 2, minWidth: 150 }} placeholder="Alimento substituto…" value={name}
        onChange={e => setName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") add(); }} />
      <input className="field" style={{ flex: 1, minWidth: 110 }} placeholder="Quantidade (ex: 130g)" value={qty}
        onChange={e => setQty(e.target.value)} onKeyDown={e => { if (e.key === "Enter") add(); }} />
      <button className="btn sm" onClick={add}><Plus size={14} /> Adicionar</button>
    </div>
  );
}

function FoodModal({ meal, foods, onClose, onAdd }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(null);
  const [mode, setMode] = useState("gramas");
  const [qty, setQty] = useState(1);
  const [grams, setGrams] = useState(100);
  const [measureIdx, setMeasureIdx] = useState(0);
  const results = q.trim().length < 2 ? [] : foods.filter((f) => f.n.toLowerCase().includes(q.toLowerCase())).slice(0, 14);
  const hasMeasure = sel && sel.m && sel.m.length;

  const pick = (f) => { setSel(f); setMeasureIdx(0); setMode(f.m && f.m.length ? "caseira" : "gramas"); };
  const confirm = () => {
    let g, label;
    if (mode === "caseira" && hasMeasure) { const me = sel.m[measureIdx]; g = me[1] * qty; label = `${qty} × ${me[0]} (${r0(g)}g)`; }
    else { g = +grams; label = `${r0(g)}g`; }
    onAdd({ id: uid(), foodId: sel.id, name: sel.n, grams: g, label, per100: { kcal: sel.kcal, p: sel.p, c: sel.c, f: sel.f, fib: sel.fib || 0 }, mc: sel.mc || {} });
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <h3>{sel ? "Tipo de medida" : `Adicionar em ${meal?.name}`} <button className="x" onClick={onClose}><X size={20} /></button></h3>
        {!sel ? (
          <>
            <div className="searchbar"><Search size={18} /><input className="field" autoFocus placeholder="Buscar alimento (ex.: arroz, frango)…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
            <div className="food-results">
              {results.map((f) => (
                <div className="fr" key={f.id} onClick={() => pick(f)}>
                  <div>{f.n}{f.custom ? " ⭐" : ""}<br /><small>{f.kcal} kcal · P{f.p} C{f.c} G{f.f} Fib{f.fib || 0} /100g{f.g ? " · " + f.g : ""}</small></div>
                </div>
              ))}
              {q.trim().length >= 2 && results.length === 0 && <div style={{ padding: 14, color: "var(--ink-soft)" }}>Nenhum alimento encontrado. Cadastre em “Meus Alimentos”.</div>}
              {q.trim().length < 2 && <div style={{ padding: 14, color: "var(--ink-soft)" }}>Digite ao menos 2 letras para buscar.</div>}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>{sel.n}</div>
            {hasMeasure && <>
              <label className="radio"><input type="radio" checked={mode === "caseira"} onChange={() => setMode("caseira")} /> Medida caseira</label>
              {mode === "caseira" && (
                <div className="two" style={{ marginTop: 4 }}>
                  <div><label className="lbl">Medida</label><select className="field" value={measureIdx} onChange={(e) => setMeasureIdx(+e.target.value)}>{sel.m.map((me, i) => <option key={i} value={i}>{me[0]} ({me[1]}g)</option>)}</select></div>
                  <div><label className="lbl">Quantidade</label><NumInput className="field" value={qty} onChange={(v) => setQty(v)} /></div>
                </div>
              )}
            </>}
            <label className="radio"><input type="radio" checked={mode === "gramas"} onChange={() => setMode("gramas")} /> Quantidade em gramas/ml</label>
            {mode === "gramas" && <NumInput className="field" value={grams} onChange={(v) => setGrams(v)} placeholder="gramas" />}
            <div className="foot"><button className="btn ghost" onClick={() => setSel(null)}>Voltar</button><button className="btn" onClick={confirm}>Adicionar</button></div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Avaliação Física ---------- */
function AssessmentView({ patient, assessments, onSave, onDel, onPickPatient }) {
  const [tab, setTab] = useState("new");
  const [editingId, setEditingId] = useState(null);

  if (!patient) {
    return (
      <>
        <h1 className="title">Avaliação <span>Física</span></h1>
        <div className="empty"><Activity size={40} style={{ opacity: .4 }} /><p>Selecione um paciente para iniciar uma avaliação.</p><button className="btn" onClick={onPickPatient}><Users size={16} /> Ir para Meus Pacientes</button></div>
      </>
    );
  }

  const editingAssessment = editingId ? assessments.find(a => a.id === editingId) : null;

  return (
    <>
      <div className="topbar" style={{ marginBottom: 6 }}>
        <div className="avatar" style={{ width: 40, height: 40 }}><UserCircle size={22} /></div>
        <div><div style={{ fontSize: 12, color: "var(--ink-soft)" }}>Avaliação Física</div><div className="ttl" style={{ fontSize: 20 }}>{patient.name}</div></div>
      </div>
      <div className="tabs">
        <button className={"tabbtn" + (tab === "history" ? " on" : "")} onClick={() => { setTab("history"); setEditingId(null); }}><TrendingUp size={17} /> Histórico e Comparação</button>
        <button className={"tabbtn" + (tab === "new" ? " on" : "")} onClick={() => { setTab("new"); setEditingId(null); }}><Plus size={17} /> {editingId ? "Editando Avaliação" : "Nova Avaliação"}</button>
      </div>
      {tab === "new"
        ? <AssessmentWizard key={editingId || "new"} patient={patient} initialData={editingAssessment} onSave={(a) => { onSave(a); setTab("history"); setEditingId(null); }} />
        : <AssessmentHistory assessments={assessments} onEdit={(id) => { setEditingId(id); setTab("new"); }} onNew={() => { setEditingId(null); setTab("new"); }} />}
    </>
  );
}

function Stepper({ steps, step }) {
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className="stepcol">
            <div className={"dot" + (i === step ? " on" : i < step ? " done" : "")}>{i < step ? "✓" : i + 1}</div>
            <div className="steplabel">{s}</div>
          </div>
          {i < steps.length - 1 && <div className={"barline" + (i < step ? " on" : "")} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function NumGrid({ keys, labels, values, onChange, cols = 3, unit = "cm" }) {
  return (
    <div className={"ingrid" + (cols === 2 ? " two" : "")}>
      {keys.map((k) => (
        <div key={k}>
          <label className="lbl">{labels[k]} ({unit})</label>
          <NumInput className="field" value={values[k] ?? ""} onChange={(v) => onChange(k, v)} placeholder="0" />
        </div>
      ))}
    </div>
  );
}

function AssessmentWizard({ patient, onSave, initialData }) {
  const [a, setA] = useState(() => initialData ? { ...initialData } : newAssessment(patient));
  const [step, setStep] = useState(0);
  const steps = ASSESS_STEPS[a.method] || ASSESS_STEPS.null;
  const up = (k, v) => setA((s) => ({ ...s, [k]: v }));
  const upObj = (group, k, v) => setA((s) => ({ ...s, [group]: { ...s[group], [k]: v } }));
  const res = useMemo(() => assessResults(a), [a]);
  const last = steps.length - 1;
  const h = (+a.height || 0) / 100;
  const imcNow = h > 0 ? +a.weight / (h * h) : 0;
  const photoRef = useRef({});
  const [photos, setPhotos] = useState({});

  const pickPhoto = (slot, file) => { if (file) setPhotos((p) => ({ ...p, [slot]: URL.createObjectURL(file) })); };

  return (
    <>
      <Stepper steps={steps} step={step} />
      <div className="panel">
        {/* STEP 0 — Dados Básicos */}
        {step === 0 && (
          <>
            <h2><Scale size={18} style={{ verticalAlign: "-3px" }} /> Dados Básicos</h2>
            <p className="ph">Informações gerais do paciente</p>
            <div className="two">
              <div><label className="lbl">Data da Avaliação</label><input type="date" className="field" value={a.date} onChange={(e) => up("date", e.target.value)} /></div>
              <div><label className="lbl">Idade (anos)</label><NumInput className="field" value={a.age} onChange={(v) => up("age", v)} /></div>
            </div>
            <div className="two">
              <div><label className="lbl">Peso (kg)</label><NumInput className="field" value={a.weight} onChange={(v) => up("weight", v)} /></div>
              <div><label className="lbl">Altura (cm)</label><NumInput className="field" value={a.height} onChange={(v) => up("height", v)} /></div>
            </div>
            <div className="two">
              <div><label className="lbl">Sexo</label><select className="field" value={a.sex} onChange={(e) => up("sex", e.target.value)}><option value="M">Masculino</option><option value="F">Feminino</option></select></div>
              <div><label className="lbl">Etnia</label><select className="field" value={a.ethnicity} onChange={(e) => up("ethnicity", e.target.value)}><option>Branco</option><option>Negro</option><option>Pardo</option><option>Asiático</option><option>Indígena</option></select></div>
            </div>
            <div className="calc" style={{ marginTop: 6 }}>
              <div className="blk"><div className="k">IMC</div><div className="v">{r1(imcNow)} <small style={{ fontSize: 13 }}>kg/m²</small></div></div>
              <div className="note" style={{ color: imcClass(imcNow)[1], fontWeight: 600 }}>{imcClass(imcNow)[0]}</div>
            </div>
          </>
        )}

        {/* STEP 1 — Método */}
        {step === 1 && (
          <>
            <h2><Activity size={18} style={{ verticalAlign: "-3px" }} /> Método de Avaliação</h2>
            <p className="ph">Escolha como deseja realizar a avaliação</p>
            <div className="methods">
              <div className={"method" + (a.method === "ia" ? " on" : "")} onClick={() => up("method", "ia")}>
                <div className="mi" style={{ background: "#7c5cff" }}><Camera size={22} /></div>
                <h4>Análise por IA</h4>
                <p>Envie fotos do paciente e receba estimativas de composição corporal e perímetros.</p>
                <span className="tag">Ideal para atendimentos online →</span>
              </div>
              <div className={"method" + (a.method === "manual" ? " on" : "")} onClick={() => up("method", "manual")}>
                <div className="mi" style={{ background: "#1f9d63" }}><Ruler size={22} /></div>
                <h4>Avaliação Manual</h4>
                <p>Insira perímetros e dobras cutâneas com cálculo por equações validadas.</p>
                <span className="tag">Ideal para atendimentos presenciais →</span>
              </div>
              <div className={"method" + (a.method === "bioimpedancia" ? " on" : "")} onClick={() => up("method", "bioimpedancia")}>
                <div className="mi" style={{ background: "#2d7ff9" }}><Scale size={22} /></div>
                <h4>Bioimpedância</h4>
                <p>Insira diretamente os valores obtidos pelo exame de bioimpedância.</p>
                <span className="tag">Cadastro rápido de resultados →</span>
              </div>
            </div>
          </>
        )}

        {/* STEP 2 manual — Perímetros */}
        {step === 2 && a.method === "manual" && (
          <>
            <h2><Ruler size={18} style={{ verticalAlign: "-3px" }} /> Perímetros Corporais</h2>
            <p className="ph">Medidas em centímetros (deixe em branco o que não medir).</p>
            <NumGrid keys={Object.keys(PERIMETERS)} labels={PERIMETERS} values={a.perimeters} onChange={(k, v) => upObj("perimeters", k, v)} />
            {res.rcq > 0 && <div className="infobox" style={{ background: "var(--green-soft)", border: "1px solid #cde8d8", color: "var(--green-d)" }}>Relação Cintura/Quadril (RCQ): <b>{r1(res.rcq) ? res.rcq.toFixed(2) : "—"}</b></div>}
          </>
        )}

        {/* STEP 3 manual — Dobras */}
        {step === 3 && a.method === "manual" && (
          <>
            <h2><Percent size={18} style={{ verticalAlign: "-3px" }} /> Dobras Cutâneas</h2>
            <p className="ph">Escolha a equação e informe as dobras em milímetros.</p>
            <label className="lbl">Equação</label>
            <select className="field" style={{ marginBottom: 16 }} value={a.equation} onChange={(e) => up("equation", e.target.value)}>
              {Object.entries(EQUATIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <NumGrid keys={EQ_FIELDS[a.equation](a.sex)} labels={SKINFOLDS} values={a.skinfolds} onChange={(k, v) => upObj("skinfolds", k, v)} unit="mm" />
            <div className="infobox" style={{ background: "var(--green-soft)", border: "1px solid #cde8d8", color: "var(--green-d)" }}>% de gordura estimado: <b>{r1(res.bf)}%</b> (conversão por equação de Siri)</div>
          </>
        )}

        {/* STEP 2 bio — valores */}
        {step === 2 && a.method === "bioimpedancia" && (
          <>
            <h2><Scale size={18} style={{ verticalAlign: "-3px" }} /> Resultados da Bioimpedância</h2>
            <p className="ph">Transcreva os valores do exame.</p>
            <div className="three">
              <div><label className="lbl">% Gordura</label><NumInput className="field" value={a.bioFat} onChange={(v) => up("bioFat", v)} /></div>
              <div><label className="lbl">Massa muscular (kg)</label><NumInput className="field" value={a.bioMuscle} onChange={(v) => up("bioMuscle", v)} /></div>
              <div><label className="lbl">Água corporal (%)</label><NumInput className="field" value={a.bioWater} onChange={(v) => up("bioWater", v)} /></div>
            </div>
          </>
        )}

        {/* STEP 2 ia — fotos */}
        {step === 2 && a.method === "ia" && (
          <>
            <h2><Camera size={18} style={{ verticalAlign: "-3px" }} /> Análise por Foto</h2>
            <p className="ph">Envie fotos do paciente de frente, lado e costas.</p>
            <div className="ingrid">
              {["frente", "lado", "costas"].map((slot) => (
                <div key={slot}>
                  <label className="lbl" style={{ textTransform: "capitalize" }}>{slot}</label>
                  <div className="photodrop" onClick={() => photoRef.current[slot]?.click()}>
                    {photos[slot] ? <img src={photos[slot]} alt={slot} /> : <><ImageIcon size={26} /><div>Clique para enviar</div></>}
                  </div>
                  <input type="file" accept="image/*" hidden ref={(el) => (photoRef.current[slot] = el)} onChange={(e) => pickPhoto(slot, e.target.files?.[0])} />
                </div>
              ))}
            </div>
            <div className="infobox">A estimativa automática por IA precisa de um servidor com modelo de visão (próxima etapa). Por enquanto, informe abaixo o % de gordura estimado para registrar a avaliação.</div>
            <div style={{ maxWidth: 220 }}><label className="lbl">% Gordura estimado</label><NumInput className="field" value={a.iaFat} onChange={(v) => up("iaFat", v)} /></div>
          </>
        )}

        {/* RESULTADOS */}
        {step === last && a.method && (
          <>
            <h2><TrendingUp size={18} style={{ verticalAlign: "-3px" }} /> Resultados</h2>
            <p className="ph">Composição corporal estimada.</p>
            <div className="resgrid">
              {[
                { l: "IMC", v: r1(res.imc), u: " kg/m²", cls: imcClass(res.imc) },
                { l: "% Gordura", v: r1(res.bf), u: "%", cls: bfClass(res.bf, a.sex) },
                { l: "Massa Gorda", v: r1(res.fatMass), u: " kg", cls: null },
                { l: "Massa Magra", v: r1(res.leanMass), u: " kg", cls: null },
              ].map((c) => (
                <div className="rescard" key={c.l}>
                  <div className="rl">{c.l}</div>
                  <div className="rv">{c.v}<small style={{ fontSize: 14 }}>{c.u}</small></div>
                  {c.cls && <div className="rc" style={{ background: c.cls[1] + "22", color: c.cls[1] }}>{c.cls[0]}</div>}
                </div>
              ))}
            </div>
            {res.rcq > 0 && <div className="infobox" style={{ background: "var(--green-soft)", border: "1px solid #cde8d8", color: "var(--green-d)" }}>Relação Cintura/Quadril: <b>{res.rcq.toFixed(2)}</b> · Método: {a.method === "manual" ? EQUATIONS[a.equation] : a.method === "bioimpedancia" ? "Bioimpedância" : "Análise por foto"}</div>}
          </>
        )}

        {/* navegação */}
        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "space-between" }}>
          <button className="btn ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}><ArrowLeft size={16} /> Voltar</button>
          {step < last
            ? <button className="btn" disabled={step === 1 && !a.method} onClick={() => setStep((s) => s + 1)}>Próximo</button>
            : <button className="btn" onClick={() => onSave({ ...a, results: res })}><Save size={16} /> Salvar Avaliação</button>}
        </div>
      </div>
    </>
  );
}

function StackedBarChart({ rows }) {
  const W = 560, H = 210, PL = 40, PR = 16, PT = 32, PB = 52;
  const innerW = W - PL - PR, innerH = H - PT - PB;
  if (!rows.length) return null;
  const maxVal = Math.max(...rows.map(r => +r.a.weight || 0)) * 1.18;
  const n = rows.length;
  const barW = Math.min(48, (innerW / n) * 0.55);
  const toY = v => H - PB - (v / maxVal) * innerH;
  const toX = i => PL + (innerW / n) * i + (innerW / n) / 2;
  const stepVal = maxVal > 60 ? 20 : 10;
  const ticks = [];
  for (let v = 0; v <= maxVal + stepVal; v += stepVal) if (v <= maxVal * 1.05) ticks.push(v);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
      {/* Grid lines */}
      {ticks.map(t => (
        <g key={t}>
          <line x1={PL} y1={toY(t).toFixed(1)} x2={W - PR} y2={toY(t).toFixed(1)} stroke="#e8ede8" strokeWidth="1" />
          <text x={PL - 5} y={+toY(t).toFixed(1) + 4} fontSize="9" fill="#8a9a90" textAnchor="end">{Math.round(t)}</text>
        </g>
      ))}
      {/* Axis */}
      <line x1={PL} y1={toY(0)} x2={PL} y2={PT} stroke="#c8d8c8" strokeWidth="1" />
      <line x1={PL} y1={toY(0)} x2={W - PR} y2={toY(0)} stroke="#c8d8c8" strokeWidth="1" />

      {/* Bars */}
      {rows.map((x, i) => {
        const fat  = +(x.r.fatMass  || 0);
        const lean = +(x.r.leanMass || 0);
        const total = +x.a.weight || (fat + lean);
        const cx = toX(i);
        const bx = cx - barW / 2;
        const yBase  = toY(0);
        const yFatT  = toY(fat);
        const yTotal = toY(total);
        return (
          <g key={x.a.id}>
            {fat > 0 && <rect x={bx} y={yFatT} width={barW} height={yBase - yFatT} fill="#e8c84a" opacity="0.9" rx="3" ry="3" />}
            {lean > 0 && <rect x={bx} y={yTotal} width={barW} height={Math.max(0, yFatT - yTotal)} fill="#e07878" opacity="0.85" rx="3" ry="3" />}
          </g>
        );
      })}

      {/* Line — Massa corporal total */}
      {rows.length > 1 && (
        <polyline
          points={rows.map((x, i) => `${toX(i).toFixed(1)},${toY(+x.a.weight || 0).toFixed(1)}`).join(' ')}
          fill="none" stroke="#555" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        />
      )}
      {rows.map((x, i) => (
        <circle key={i} cx={toX(i)} cy={toY(+x.a.weight || 0)} r="4.5" fill="#555" />
      ))}

      {/* Date labels */}
      {rows.map((x, i) => (
        <text key={i} x={toX(i)} y={H - 6} fontSize="9" fill="#5d6f66" textAnchor="middle">
          {x.a.date ? new Date(x.a.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '—'}
        </text>
      ))}

      {/* Legend */}
      <rect x={PL} y={6} width={9} height={9} fill="#555" rx="2" />
      <text x={PL + 12} y={14} fontSize="9" fill="#5d6f66">Massa corporal total (Kg)</text>
      <rect x={PL + 148} y={6} width={9} height={9} fill="#e8c84a" rx="2" />
      <text x={PL + 160} y={14} fontSize="9" fill="#5d6f66">Massa gordurosa (Kg)</text>
      <rect x={PL + 286} y={6} width={9} height={9} fill="#e07878" rx="2" />
      <text x={PL + 298} y={14} fontSize="9" fill="#5d6f66">Massa livre de gordura (Kg)</text>
    </svg>
  );
}

function AssessmentHistory({ assessments, onEdit, onNew }) {
  const sorted = [...assessments].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  if (sorted.length === 0)
    return <div className="empty"><Activity size={40} style={{ opacity: .4 }} /><p>Nenhuma avaliação registrada ainda.</p><button className="btn" onClick={onNew}><Plus size={16} /> Nova Avaliação</button></div>;

  const rows = sorted.map((a) => ({ a, r: assessResults(a) }));

  const fmtDelta = (cur, prev) => {
    if (prev == null || cur == null) return null;
    const d = +(cur - prev).toFixed(1);
    if (Math.abs(d) < 0.05) return null;
    const up = d > 0;
    return <span style={{ fontSize: 11, color: up ? '#e5484d' : '#1f9d63', marginLeft: 3, whiteSpace: 'nowrap' }}>{up ? '↑' : '↓'} ({up ? '+' : ''}{d})</span>;
  };

  const skinfoldSum = (a) => {
    if (!a.skinfolds) return null;
    const vals = Object.values(a.skinfolds).map(Number).filter(v => v > 0);
    return vals.length ? vals.reduce((s, v) => s + v, 0) : null;
  };

  const METRICS = [
    { label: 'Peso atual (Kg)',              get: (a, r) => +a.weight || null },
    { label: 'Altura atual (cm)',            get: (a, r) => +a.height || null },
    { label: 'IMC (Kg/m²)',                 get: (a, r) => r.imc || null },
    { label: '% Gordura',                   get: (a, r) => r.bf || null },
    { label: 'Massa de Gordura (Kg)',        get: (a, r) => r.fatMass || null },
    { label: 'Massa Livre de Gordura (Kg)', get: (a, r) => r.leanMass || null },
    { label: 'Somatório de Dobras (mm)',     get: (a, r) => skinfoldSum(a) },
    { section: 'Dobras Cutâneas (mm)' },
    { label: 'Peitoral (mm)',        get: (a) => +a.skinfolds?.peitoral || null },
    { label: 'Axilar Média (mm)',    get: (a) => +a.skinfolds?.axilarMedia || null },
    { label: 'Tríceps (mm)',         get: (a) => +a.skinfolds?.triceps || null },
    { label: 'Subescapular (mm)',    get: (a) => +a.skinfolds?.subescapular || null },
    { label: 'Abdominal (mm)',       get: (a) => +a.skinfolds?.abdominal || null },
    { label: 'Supra-ilíaca (mm)',    get: (a) => +a.skinfolds?.supraIliaca || null },
    { label: 'Coxa (mm)',            get: (a) => +a.skinfolds?.coxa || null },
    { section: 'Circunferências (cm)' },
    { label: 'Ombro (cm)',           get: (a) => +a.perimeters?.ombro || null },
    { label: 'Peitoral/Tórax (cm)', get: (a) => +a.perimeters?.peitoral || null },
    { label: 'Cintura (cm)',         get: (a) => +a.perimeters?.cintura || null },
    { label: 'Abdômen (cm)',         get: (a) => +a.perimeters?.abdomen || null },
    { label: 'Quadril (cm)',         get: (a) => +a.perimeters?.quadril || null },
    { label: 'Braço relaxado (cm)',  get: (a) => +a.perimeters?.braco || null },
    { label: 'Braço contraído (cm)',get: (a) => +a.perimeters?.bracoContr || null },
    { label: 'Antebraço (cm)',       get: (a) => +a.perimeters?.antebraco || null },
    { label: 'Coxa (cm)',            get: (a) => +a.perimeters?.coxa || null },
    { label: 'Panturrilha (cm)',     get: (a) => +a.perimeters?.panturrilha || null },
  ];

  const cellStyle = { padding: '9px 12px', fontSize: 13, borderBottom: '1px solid #eef2ee', textAlign: 'center', whiteSpace: 'nowrap' };
  const headStyle = { ...cellStyle, fontWeight: 700, fontSize: 12, background: '#f5f9f5', color: '#5d6f66' };

  return (
    <>
      {/* Gráfico de barras empilhadas */}
      <div className="panel" style={{ marginTop: 18, padding: '16px 16px 10px' }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: 'var(--ink)' }}>Gráfico de evolução da composição corporal</div>
        <StackedBarChart rows={rows} />
      </div>

      {/* Tabela comparativa */}
      <div className="panel" style={{ marginTop: 14, padding: 0, overflow: 'hidden' }}>
        <div style={{ fontWeight: 700, fontSize: 14, padding: '14px 16px 10px', borderBottom: '1px solid #eef2ee' }}>Comparativo de avaliações</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 420 }}>
            <thead>
              <tr>
                <th style={{ ...headStyle, textAlign: 'left', minWidth: 180 }}>Parâmetro</th>
                {rows.map((x, i) => (
                  <th key={i} style={headStyle}>
                    {x.a.date ? new Date(x.a.date + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
                  </th>
                ))}
                <th style={{ ...headStyle, width: 36 }}></th>
              </tr>
            </thead>
            <tbody>
              {METRICS.filter(m => {
                if (m.section) return true;
                return rows.some(x => m.get(x.a, x.r) != null);
              }).map((m, mi) => {
                if (m.section) return (
                  <tr key={'sec-' + mi}>
                    <td colSpan={rows.length + 2} style={{ ...cellStyle, background: '#f0f7f3', fontWeight: 700, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--green-d)', textAlign: 'left', paddingTop: 10 }}>
                      {m.section}
                    </td>
                  </tr>
                );
                return (
                  <tr key={m.label}>
                    <td style={{ ...cellStyle, textAlign: 'left', color: 'var(--ink-soft)', fontSize: 12.5 }}>{m.label}</td>
                    {rows.map((x, i) => {
                      const val = m.get(x.a, x.r);
                      const prev = i > 0 ? m.get(rows[i - 1].a, rows[i - 1].r) : null;
                      return (
                        <td key={i} style={{ ...cellStyle, fontWeight: i === rows.length - 1 ? 700 : 500 }}>
                          {val != null ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                              {r1(val)}
                              {fmtDelta(val, prev)}
                            </span>
                          ) : '—'}
                        </td>
                      );
                    })}
                    <td style={cellStyle}></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Linha de edição */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid #eef2ee', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {rows.map((x, i) => (
            <button key={i} className="btn sm ghost" style={{ fontSize: 12 }} onClick={() => onEdit(x.a.id)}>
              <Pencil size={13} /> {x.a.date ? new Date(x.a.date + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

const MICRO_FIELDS = [
  ["ca", "Cálcio (mg)"], ["fe", "Ferro (mg)"], ["mg", "Magnésio (mg)"], ["k", "Potássio (mg)"],
  ["na", "Sódio (mg)"], ["zn", "Zinco (mg)"], ["va", "Vitamina A (mcg)"], ["vc", "Vitamina C (mg)"],
  ["b6", "Vitamina B6 (mg)"], ["vd", "Vitamina D (mcg)"], ["b12", "Vitamina B12 (mcg)"], ["ve", "Vitamina E (mg)"],
];

function MyFoodsView({ foods, onAdd, onUpdate, onDel }) {
  const blank = { n: "", g: "Meus Alimentos", kcal: "", p: "", c: "", f: "", fib: "", measLabel: "", measGrams: "", micros: {} };
  const [f, setF] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [showMicros, setShowMicros] = useState(false);
  const [q, setQ] = useState("");
  const formRef = useRef(null);
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const upMicro = (k, v) => setF((s) => ({ ...s, micros: { ...s.micros, [k]: v } }));
  const valid = f.n.trim() && f.kcal !== "";

  const startEdit = (food) => {
    setEditing(food.id);
    setF({
      n: food.n, g: food.g || "Meus Alimentos", kcal: food.kcal ?? "", p: food.p ?? "", c: food.c ?? "", f: food.f ?? "", fib: food.fib ?? "",
      measLabel: food.m && food.m[0] ? food.m[0][0] : "", measGrams: food.m && food.m[0] ? food.m[0][1] : "",
      micros: { ...(food.mc || {}) },
    });
    setShowMicros(Object.values(food.mc || {}).some((v) => v));
    if (formRef.current) formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const cancel = () => { setEditing(null); setF(blank); setShowMicros(false); };

  const submit = () => {
    const mc = {};
    MICRO_FIELDS.forEach(([k]) => { if (f.micros[k] !== "" && f.micros[k] != null && !isNaN(+f.micros[k])) mc[k] = +f.micros[k]; });
    const food = { n: f.n.trim(), g: f.g, kcal: +f.kcal || 0, p: +f.p || 0, c: +f.c || 0, f: +f.f || 0, fib: +f.fib || 0, mc };
    food.m = (f.measLabel.trim() && f.measGrams) ? [[f.measLabel.trim(), +f.measGrams]] : undefined;
    if (editing) onUpdate(editing, food); else onAdd(food);
    cancel();
  };

  const list = foods.filter((x) => x.n.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <h1 className="title">Meus <span>Alimentos</span></h1>
      <p className="sub">Toda a base fica aqui. Edite qualquer alimento ou cadastre os seus (uma marca, um doce, uma torrada…) para usar nas dietas.</p>

      <div className="panel" style={{ marginTop: 20 }} ref={formRef}>
        <h2>{editing ? "Editar alimento" : "Novo alimento"}</h2>
        <p className="ph">Valores <b>por 100 g</b>. Medida caseira e micronutrientes são opcionais.</p>
        <div className="row" style={{ marginBottom: 14 }}><label className="lbl">Nome do alimento *</label><input className="field" value={f.n} onChange={(e) => up("n", e.target.value)} placeholder="Ex.: Torrada integral da marca X" /></div>
        <div className="ingrid">
          <div><label className="lbl">Calorias (kcal)</label><NumInput className="field" value={f.kcal} onChange={(v) => up("kcal", v)} placeholder="por 100g" /></div>
          <div><label className="lbl">Proteína (g)</label><NumInput className="field" value={f.p} onChange={(v) => up("p", v)} placeholder="por 100g" /></div>
          <div><label className="lbl">Carboidrato (g)</label><NumInput className="field" value={f.c} onChange={(v) => up("c", v)} placeholder="por 100g" /></div>
        </div>
        <div className="ingrid" style={{ marginTop: 14 }}>
          <div><label className="lbl">Gordura (g)</label><NumInput className="field" value={f.f} onChange={(v) => up("f", v)} placeholder="por 100g" /></div>
          <div><label className="lbl">Fibra (g)</label><NumInput className="field" value={f.fib} onChange={(v) => up("fib", v)} placeholder="por 100g" /></div>
          <div></div>
        </div>
        <div className="ingrid" style={{ marginTop: 14 }}>
          <div><label className="lbl">Medida caseira (opcional)</label><input className="field" value={f.measLabel} onChange={(e) => up("measLabel", e.target.value)} placeholder="Ex.: 1 fatia" /></div>
          <div><label className="lbl">Peso da medida (g)</label><NumInput className="field" value={f.measGrams} onChange={(v) => up("measGrams", v)} placeholder="Ex.: 25" /></div>
          <div></div>
        </div>

        <button className="btn ghost sm" style={{ marginTop: 16 }} onClick={() => setShowMicros((s) => !s)}>
          {showMicros ? <ChevronUp size={15} /> : <ChevronDown size={15} />} Micronutrientes (opcional)
        </button>
        {showMicros && (
          <div className="ingrid" style={{ marginTop: 12 }}>
            {MICRO_FIELDS.map(([k, lbl]) => (
              <div key={k}><label className="lbl">{lbl}</label><NumInput className="field" value={f.micros[k] ?? ""} onChange={(v) => upMicro(k, v)} placeholder="por 100g" /></div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button className="btn" disabled={!valid} onClick={submit}>{editing ? <><Save size={16} /> Salvar alterações</> : <><Plus size={17} /> Adicionar alimento</>}</button>
          {editing && <button className="btn ghost" onClick={cancel}>Cancelar</button>}
        </div>
      </div>

      <div className="panel">
        <h2 style={{ marginBottom: 12 }}>Cadastrados ({foods.length})</h2>
        <div className="searchbar" style={{ marginBottom: 14 }}><Search size={18} /><input className="field" placeholder="Buscar alimento…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        {list.length === 0 ? <div className="empty" style={{ padding: 30 }}><Apple size={36} style={{ opacity: .4 }} /><p>Nenhum alimento encontrado.</p></div> :
          list.map((x) => (
            <div className="item" key={x.id}>
              <div style={{ flex: 1 }}><div className="inm">{x.n}{x.custom ? " ⭐" : ""}</div><div className="iqt">{x.m && x.m[0] ? `${x.m[0][0]} = ${x.m[0][1]}g · ` : ""}{x.g || ""} · por 100g</div></div>
              <div className="imac">{r0(x.kcal)} kcal · P{r1(x.p)} C{r1(x.c)} G{r1(x.f)} Fib{r1(x.fib || 0)}</div>
              <button className="iconbtn" title="Editar" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4 }} onClick={() => startEdit(x)}><Pencil size={15} /></button>
              <button className="iconbtn" title="Excluir" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4 }} onClick={() => onDel(x.id)}><Trash2 size={15} /></button>
            </div>
          ))}
      </div>
    </>
  );
}

function ExamsView({ patient, exams, onSave, onDel, onPickPatient }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(null);
  const [unit, setUnit] = useState("");
  const [result, setResult] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);

  if (!patient) {
    return (
      <>
        <h1 className="title">Exames <span>Laboratoriais</span></h1>
        <div className="empty"><FlaskConical size={40} style={{ opacity: .4 }} /><p>Selecione um paciente para registrar exames.</p><button className="btn" onClick={onPickPatient}><Users size={16} /> Ir para Meus Pacientes</button></div>
      </>
    );
  }
  const sex = patient.sex === "Feminino" ? "F" : "M";
  const matches = q.trim() ? EXAM_CATALOG.filter((e) => e.n.toLowerCase().includes(q.toLowerCase())).slice(0, 8) : [];
  const pickCat = (c) => { setCat(c); setQ(c.n); setUnit(c.u); setOpen(false); };
  const liveClass = cat ? classifyExam(cat, sex, result) : { status: "—", color: "var(--ink-soft)" };
  const rg = cat ? examRange(cat, sex) : null;

  const save = () => {
    const name = (cat ? cat.n : q).trim();
    if (!name || result === "") return;
    const cls = classifyExam(cat, sex, result);
    onSave({ name, unit: unit || (cat ? cat.u : ""), result: +result, date, status: cls.status, color: cls.color, ref: rg ? `${rg[0]}–${rg[1]}` : "", note: cat ? cat.note : "" });
    setCat(null); setQ(""); setUnit(""); setResult("");
  };

  // Agrupa exames por nome e ordena por data
  const groups = {};
  for (const e of exams) {
    const key = e.name || "Sem nome";
    if (!groups[key]) groups[key] = { name: key, unit: e.unit || "", ref: e.ref || "", note: e.note || "", entries: [] };
    groups[key].entries.push(e);
  }
  for (const g of Object.values(groups)) {
    g.entries.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }
  const groupList = Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <div className="topbar" style={{ marginBottom: 10 }}>
        <div className="avatar" style={{ width: 40, height: 40 }}><FlaskConical size={20} /></div>
        <div><div style={{ fontSize: 12, color: "var(--ink-soft)" }}>Exames Laboratoriais</div><div className="ttl" style={{ fontSize: 20 }}>{patient.name}</div></div>
      </div>

      <div className="panel">
        <h2>✦ Novo Exame</h2>
        <p className="ph">Digite o nome do exame e o resultado. A classificação é automática pela faixa de referência (ajustada por sexo).</p>
        <div className="two" style={{ marginBottom: 0 }}>
          <div style={{ position: "relative" }}>
            <label className="lbl">Nome do Exame</label>
            <input className="field" value={q} placeholder="Ex.: Ferritina, Glicose, Vitamina D…"
              onChange={(e) => { setQ(e.target.value); setCat(null); setOpen(true); }} onFocus={() => setOpen(true)} />
            {open && matches.length > 0 && (
              <div className="food-results" style={{ position: "absolute", zIndex: 5, background: "#fff", width: "100%" }}>
                {matches.map((c) => (
                  <div className="fr" key={c.n} onClick={() => pickCat(c)}>
                    <div>{c.n}<br /><small>ref: {(c.r || (sex === "F" ? c.rF : c.rM)).join("–")} {c.u}</small></div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="lbl">Resultado {unit ? `(${unit})` : ""}</label>
            <NumInput className="field" value={result} onChange={(v) => setResult(v)} placeholder="valor" />
          </div>
        </div>
        {cat && (
          <div className="infobox" style={{ background: "var(--green-soft)", border: "1px solid #cde8d8", color: "var(--ink)" }}>
            Faixa de referência: <b>{rg ? `${rg[0]}–${rg[1]} ${cat.u}` : "—"}</b>
            {result !== "" && <> · Classificação: <b style={{ color: liveClass.color }}>{liveClass.status}</b></>}
            <div style={{ color: "var(--ink-soft)", fontSize: 12.5, marginTop: 4 }}>{cat.note}</div>
          </div>
        )}
        <div className="two" style={{ marginTop: 14, marginBottom: 0 }}>
          <div><label className="lbl">Data</label><input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div style={{ display: "flex", alignItems: "flex-end" }}><button className="btn" style={{ width: "100%", justifyContent: "center" }} disabled={!q.trim() || result === ""} onClick={save}><Plus size={17} /> Salvar exame</button></div>
        </div>
      </div>

      {/* Evolução por grupo */}
      <div style={{ fontWeight: 700, fontSize: 17, fontFamily: "'Fraunces',serif", margin: "0 0 12px" }}>
        Evolução por Exame ({groupList.length} marcador{groupList.length !== 1 ? "es" : ""})
      </div>
      {groupList.length === 0 ? (
        <div className="empty" style={{ padding: 36 }}><FlaskConical size={36} style={{ opacity: .4 }} /><p>Nenhum exame registrado ainda.<br />Digite o nome e o resultado acima para começar.</p></div>
      ) : groupList.map((g) => {
        const isOpen = openGroup === g.name;
        const last = g.entries[g.entries.length - 1];
        const statusColor = last?.color || "var(--ink-soft)";
        const statusBg    = last?.color ? last.color + "22" : "var(--line)";
        const chartPoints = g.entries.map(e => ({ y: r1(+e.result || 0) }));

        return (
          <div className="panel" key={g.name} style={{ padding: 0, overflow: "hidden", marginBottom: 12 }}>
            {/* Cabeçalho do grupo */}
            <div
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", cursor: "pointer", background: isOpen ? "var(--green-soft)" : "#fff", transition: ".15s" }}
              onClick={() => setOpenGroup(isOpen ? null : g.name)}
            >
              <div style={{ width: 38, height: 38, borderRadius: 10, background: isOpen ? "var(--green)" : "var(--green-soft)", display: "grid", placeItems: "center", color: isOpen ? "#fff" : "var(--green-d)", transition: ".15s", flexShrink: 0 }}>
                <FlaskConical size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700 }}>{g.name} {g.unit ? <span style={{ color: "var(--ink-soft)", fontSize: 12, fontWeight: 400 }}>({g.unit})</span> : ""}</div>
                <div style={{ color: "var(--ink-soft)", fontSize: 13, marginTop: 2 }}>
                  {g.entries.length} medição(ões)
                  {last?.date && <span> · última: {new Date(last.date + "T12:00:00").toLocaleDateString("pt-BR")}</span>}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 20 }}>{last?.result} <small style={{ fontSize: 11, color: "var(--ink-soft)" }}>{g.unit}</small></div>
                {last?.status && last.status !== "—" && (
                  <span style={{ fontSize: 11.5, padding: "2px 9px", borderRadius: 999, fontWeight: 700, background: statusBg, color: statusColor }}>{last.status}</span>
                )}
              </div>
              {isOpen ? <ChevronUp size={18} style={{ color: "var(--ink-soft)", flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: "var(--ink-soft)", flexShrink: 0 }} />}
            </div>

            {/* Detalhes expandidos */}
            {isOpen && (
              <div style={{ padding: "16px 20px", borderTop: "1px solid var(--line)" }}>
                {g.entries.length > 1 && (
                  <div className="chartcard" style={{ marginBottom: 16 }}>
                    <div className="ct" style={{ marginBottom: 8 }}>
                      <TrendingUp size={14} style={{ color: "var(--green)" }} /> Evolução — {g.name}
                      {g.ref && <span style={{ marginLeft: 8, fontSize: 12, color: "var(--ink-soft)", fontWeight: 400 }}>ref: {g.ref} {g.unit}</span>}
                    </div>
                    <MiniChart points={chartPoints} color={last?.color || "#1f9d63"} suffix={g.unit ? ` ${g.unit}` : ""} />
                  </div>
                )}
                {g.note && <div className="infobox" style={{ marginBottom: 14 }}>{g.note}</div>}

                <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 10, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: ".04em" }}>Histórico</div>
                {[...g.entries].reverse().map((e) => (
                  <div key={e.id} className="exrow">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{e.date ? new Date(e.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</div>
                      {g.ref && <div className="iqt">ref: {g.ref} {g.unit}</div>}
                    </div>
                    <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 18 }}>
                      {e.result} <small style={{ fontSize: 11, color: "var(--ink-soft)" }}>{g.unit}</small>
                    </div>
                    {e.status && e.status !== "—" && (
                      <span style={{ fontSize: 11.5, padding: "2px 9px", borderRadius: 999, fontWeight: 700, background: (e.color || "var(--ink-soft)") + "22", color: e.color || "var(--ink-soft)" }}>{e.status}</span>
                    )}
                    <button className="iconbtn" title="Excluir" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4, marginLeft: 4 }} onClick={() => onDel(e.id)}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

function AnamneseField({ q, value, onChange }) {
  if (q.type === "textarea") return <textarea className="field" rows={2} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="Resposta…" />;
  if (q.type === "number") return <NumInput className="field" value={value || ""} onChange={(v) => onChange(v)} placeholder="Resposta…" />;
  if (q.type === "select") return <select className="field" value={value || ""} onChange={(e) => onChange(e.target.value)}><option value="">Selecione…</option>{(q.options || []).map((o) => <option key={o}>{o}</option>)}</select>;
  if (q.type === "radio") return <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>{(q.options || []).map((o) => <label key={o} className="radio" style={{ padding: "4px 0" }}><input type="radio" name={q.id} checked={value === o} onChange={() => onChange(o)} /> {o}</label>)}</div>;
  return <input className="field" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="Resposta…" />;
}

function AnamneseView({ patient, template, answers, onSaveAnswers, onSaveTemplate, onPickPatient }) {
  const [mode, setMode] = useState("fill");
  const [ans, setAns] = useState(answers || {});
  const [draft, setDraft] = useState(template);
  const [copied, setCopied] = useState(false);

  if (!patient) {
    return (
      <>
        <h1 className="title"><span>Anamnese</span></h1>
        <div className="empty"><FileText size={40} style={{ opacity: .4 }} /><p>Selecione um paciente para preencher a anamnese.</p><button className="btn" onClick={onPickPatient}><Users size={16} /> Ir para Meus Pacientes</button></div>
      </>
    );
  }
  const setA = (qid, v) => { const next = { ...ans, [qid]: v }; setAns(next); onSaveAnswers(next); };

  const buildText = () => "Anamnese Nutricional — " + patient.name + "\n\n" +
    template.map((s) => s.title.toUpperCase() + "\n" + s.questions.map((q) => "- " + q.label + (q.options ? ` (${q.options.join(" / ")})` : "") + ":").join("\n")).join("\n\n");
  const copy = () => { try { navigator.clipboard.writeText(buildText()); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch (e) {} };

  // edição do template
  const upQ = (sid, qid, patch) => setDraft((d) => d.map((s) => s.id === sid ? { ...s, questions: s.questions.map((q) => q.id === qid ? { ...q, ...patch } : q) } : s));
  const delQ = (sid, qid) => setDraft((d) => d.map((s) => s.id === sid ? { ...s, questions: s.questions.filter((q) => q.id !== qid) } : s));
  const addQ = (sid) => setDraft((d) => d.map((s) => s.id === sid ? { ...s, questions: [...s.questions, { id: "q" + uid(), label: "Nova pergunta", type: "text" }] } : s));
  const upSec = (sid, title) => setDraft((d) => d.map((s) => s.id === sid ? { ...s, title } : s));
  const delSec = (sid) => setDraft((d) => d.filter((s) => s.id !== sid));
  const addSec = () => setDraft((d) => [...d, { id: "s" + uid(), title: "Nova seção", questions: [] }]);
  const saveTpl = () => { onSaveTemplate(draft); setMode("fill"); };
  const resetTpl = () => setDraft(DEFAULT_ANAMNESE);

  return (
    <>
      <div className="topbar" style={{ marginBottom: 8 }}>
        <div className="avatar" style={{ width: 40, height: 40 }}><FileText size={20} /></div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 12, color: "var(--ink-soft)" }}>Ficha de anamnese nutricional</div><div className="ttl" style={{ fontSize: 20 }}>{patient.name}</div></div>
        {mode === "fill" && <button className="btn sm ghost" onClick={copy}><Copy size={15} /> {copied ? "Copiado!" : "Copiar p/ enviar"}</button>}
        <button className="btn sm ghost" onClick={() => { setDraft(template); setMode(mode === "edit" ? "fill" : "edit"); }}>{mode === "edit" ? <>Voltar</> : <><Pencil size={15} /> Editar perguntas</>}</button>
      </div>

      {mode === "fill" ? (
        <>
          <div className="infobox">Para o paciente responder de casa por um link próprio é necessário um servidor (etapa futura). Por enquanto, use “Copiar p/ enviar” para mandar as perguntas pelo WhatsApp e registrar as respostas aqui.</div>
          {template.map((s) => (
            <div className="panel" key={s.id}>
              <h2>{s.title}</h2>
              <div style={{ marginTop: 8 }}>
                {s.questions.map((q) => (
                  <div key={q.id} style={{ marginBottom: 16 }}>
                    <label className="lbl" style={{ marginBottom: 7 }}>{q.label}</label>
                    <AnamneseField q={q} value={ans[q.id]} onChange={(v) => setA(q.id, v)} />
                  </div>
                ))}
                {s.questions.length === 0 && <div className="iqt">Seção sem perguntas.</div>}
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="infobox" style={{ background: "var(--green-soft)", border: "1px solid #cde8d8", color: "var(--ink)" }}>Edite o modelo da anamnese. As alterações valem para todos os pacientes. As respostas já preenchidas são mantidas.</div>
          {draft.map((s) => (
            <div className="panel" key={s.id}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                <input className="field" value={s.title} onChange={(e) => upSec(s.id, e.target.value)} style={{ fontWeight: 700 }} />
                <button className="btn sm danger" onClick={() => delSec(s.id)}><Trash2 size={15} /></button>
              </div>
              {s.questions.map((q) => (
                <div key={q.id} style={{ borderTop: "1px solid var(--line)", paddingTop: 12, marginTop: 12 }}>
                  <div className="two" style={{ marginBottom: 8 }}>
                    <div><label className="lbl">Pergunta</label><input className="field" value={q.label} onChange={(e) => upQ(s.id, q.id, { label: e.target.value })} /></div>
                    <div><label className="lbl">Tipo</label><select className="field" value={q.type} onChange={(e) => upQ(s.id, q.id, { type: e.target.value })}><option value="text">Texto curto</option><option value="textarea">Texto longo</option><option value="number">Número</option><option value="select">Lista (selecionar)</option><option value="radio">Opções (escolher 1)</option></select></div>
                  </div>
                  {(q.type === "select" || q.type === "radio") && (
                    <div style={{ marginBottom: 8 }}><label className="lbl">Opções (separadas por vírgula)</label><input className="field" value={(q.options || []).join(", ")} onChange={(e) => upQ(s.id, q.id, { options: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} /></div>
                  )}
                  <button className="btn sm danger" onClick={() => delQ(s.id, q.id)}><Trash2 size={14} /> Remover pergunta</button>
                </div>
              ))}
              <button className="btn sm ghost" style={{ marginTop: 14 }} onClick={() => addQ(s.id)}><Plus size={15} /> Adicionar pergunta</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <button className="btn ghost" onClick={addSec}><Plus size={16} /> Adicionar seção</button>
            <button className="btn ghost" onClick={resetTpl}>Restaurar padrão</button>
            <div style={{ flex: 1 }}></div>
            <button className="btn" onClick={saveTpl}><Save size={16} /> Salvar perguntas</button>
          </div>
        </>
      )}
    </>
  );
}

function ProfileView({ profile, onSave }) {
  const [p, setP] = useState(profile || {});
  const [saved, setSaved] = useState(false);
  const up = (k, v) => { setP((s) => ({ ...s, [k]: v })); setSaved(false); };
  const save = () => { onSave(p); setSaved(true); setTimeout(() => setSaved(false), 2500); };
  return (
    <>
      <h1 className="title">Meu <span>Perfil</span></h1>
      <p className="sub">Seus dados profissionais. Nome e registro aparecem no cabeçalho do PDF da dieta.</p>
      <div className="panel" style={{ marginTop: 20, maxWidth: 640 }}>
        <h2>Dados profissionais</h2>
        <div className="row" style={{ marginTop: 14, marginBottom: 14 }}><label className="lbl"><UserCircle size={14} /> Nome completo</label><input className="field" value={p.name || ""} onChange={(e) => up("name", e.target.value)} placeholder="Seu nome" /></div>
        <div className="two">
          <div><label className="lbl"><FileText size={14} /> CRN (registro)</label><input className="field" value={p.crn || ""} onChange={(e) => up("crn", e.target.value)} placeholder="Ex.: CRN-3 12345" /></div>
          <div><label className="lbl">Especialidade</label><input className="field" value={p.specialty || ""} onChange={(e) => up("specialty", e.target.value)} placeholder="Ex.: Nutrição esportiva" /></div>
        </div>
        <div className="two">
          <div><label className="lbl"><Mail size={14} /> E-mail</label><input className="field" value={p.email || ""} onChange={(e) => up("email", e.target.value)} placeholder="email@exemplo.com" /></div>
          <div><label className="lbl"><Phone size={14} /> Telefone</label><input className="field" value={p.phone || ""} onChange={(e) => up("phone", e.target.value)} placeholder="(00) 00000-0000" /></div>
        </div>
        <div className="row"><label className="lbl">Clínica / Consultório</label><input className="field" value={p.clinic || ""} onChange={(e) => up("clinic", e.target.value)} placeholder="Nome do consultório (opcional)" /></div>
        <button className="btn" style={{ marginTop: 16 }} onClick={save}><Save size={16} /> {saved ? "Salvo!" : "Salvar perfil"}</button>
      </div>
    </>
  );
}

/* ── Galeria de Fotos compartilhada ────────────────────────── */
const EVAL_ORDER = ['Frente','Lado Direito','Lado Esquerdo','Costas','Pose de Musculação','Outra']

function parsePhotoCaption(caption) {
  const m = (caption || '').match(/^\[Avaliação - (.+?)\](.*)$/)
  if (m) return { group: m[1].trim(), label: m[2].trim() || '' }
  return { group: 'Progresso / Alimentar', label: caption || '' }
}

function timeDiff(d1, d2) {
  const days = Math.round((new Date(d2) - new Date(d1)) / 86400000)
  if (days < 1) return null
  if (days < 30) return `${days} dia${days > 1 ? 's' : ''} depois`
  const months = Math.round(days / 30.4)
  return `${months} ${months === 1 ? 'mês' : 'meses'} depois`
}

function PhotoGallery({ photos, canDelete, onDelete }) {
  const [lightbox, setLightbox] = React.useState(null)
  const [confirm, setConfirm]   = React.useState(null)

  // Agrupamento
  const groups = {}
  const sorted = [...photos].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  for (const p of sorted) {
    const { group } = parsePhotoCaption(p.caption)
    if (!groups[group]) groups[group] = []
    groups[group].push(p)
  }
  const groupKeys = [
    ...EVAL_ORDER.filter(k => groups[k]),
    ...Object.keys(groups).filter(k => !EVAL_ORDER.includes(k)),
  ]

  const handleDelete = async (p) => {
    if (confirm === p.id) {
      setConfirm(null)
      await onDelete(p)
    } else {
      setConfirm(p.id)
      setTimeout(() => setConfirm(c => c === p.id ? null : c), 3000)
    }
  }

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <img src={lightbox.public_url} alt="" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, objectFit: 'contain' }} />
          <a
            href={lightbox.public_url}
            download
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ position: 'absolute', top: 20, right: 70, background: '#1f9d63', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer', textDecoration: 'none' }}
          >
            ⬇ Baixar
          </a>
          <button
            onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,.15)', color: '#fff', border: 'none', borderRadius: 8, width: 40, height: 40, fontSize: 20, cursor: 'pointer' }}
          >✕</button>
        </div>
      )}

      {groupKeys.map(gk => {
        const gPhotos = groups[gk]
        return (
          <div key={gk} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{gk}</div>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)', background: 'var(--bg)', borderRadius: 999, padding: '2px 10px' }}>{gPhotos.length} foto{gPhotos.length > 1 ? 's' : ''}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6 }}>
              {gPhotos.map((p, i) => {
                const { label } = parsePhotoCaption(p.caption)
                const diff = i > 0 ? timeDiff(gPhotos[i - 1].created_at, p.created_at) : null
                return (
                  <React.Fragment key={p.id}>
                    {diff && (
                      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: 11, fontWeight: 600, maxWidth: 60 }}>
                          <div style={{ fontSize: 16 }}>→</div>
                          {diff}
                        </div>
                      </div>
                    )}
                    <div style={{ flexShrink: 0, width: 170, background: '#fff', border: '1px solid #e4e9e3', borderRadius: 14, overflow: 'hidden' }}>
                      <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setLightbox(p)}>
                        <img src={p.public_url} alt={p.caption || 'foto'} style={{ width: '100%', height: 190, objectFit: 'cover', display: 'block' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: '.15s' }} className="photo-hover" />
                        <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,.45)', borderRadius: 6, padding: '3px 7px', fontSize: 11, color: '#fff' }}>🔍</div>
                      </div>
                      <div style={{ padding: '8px 10px' }}>
                        <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginBottom: 4 }}>
                          {new Date(p.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        {label && <div style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>{label}</div>}
                        <div style={{ display: 'flex', gap: 5 }}>
                          <a
                            href={p.public_url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ flex: 1, background: 'var(--green-soft)', color: 'var(--green-d)', border: 'none', borderRadius: 7, padding: '4px 0', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'block' }}
                          >⬇ Baixar</a>
                          {canDelete && onDelete && (
                            <button
                              onClick={() => handleDelete(p)}
                              style={{ background: confirm === p.id ? '#e5484d' : '#fde8e9', color: confirm === p.id ? '#fff' : '#9b1c1f', border: 'none', borderRadius: 7, padding: '4px 8px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >{confirm === p.id ? 'Confirmar' : '🗑'}</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        )
      })}
    </>
  )
}

/* ── Portal do Paciente — visão do admin ──────────────────── */
function PatientPortalAdmin({ patient, nutritionistId, onSaveAppt, onBack }) {
  const [tab, setTab]           = useState('appointment')

  // Parse appt value → date + time
  const rawAppt = patient?.nextAppointment || '';
  const [apptDate, setApptDate] = useState(() => rawAppt.includes('T') ? rawAppt.slice(0, 10) : rawAppt)
  const [apptTime, setApptTime] = useState(() => rawAppt.includes('T') ? rawAppt.slice(11, 16) : '')
  const [apptSaved, setApptSaved] = useState(false)

  const [messages, setMessages] = useState(null)
  const [photos, setPhotos]     = useState(null)
  const [videoReqs, setVideoReqs] = useState(null)
  const [reply, setReply]       = useState({})
  const [replying, setReplying] = useState(null)

  React.useEffect(() => {
    if (!patient) return
    db.loadPatientMessages(nutritionistId).then(all => setMessages(all.filter(m => m.patient_id === patient.id)))
    db.loadVideoRequests(nutritionistId).then(all => setVideoReqs(all.filter(r => r.patient_id === patient.id)))
    db.loadPatientPhotos(nutritionistId, patient.id).then(setPhotos)
  }, [patient?.id])

  if (!patient) return null

  const sendReply = async (msgId) => {
    const text = reply[msgId]
    if (!text?.trim()) return
    await db.replyToMessage(msgId, text.trim())
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, reply: text.trim(), replied_at: new Date().toISOString() } : m))
    setReplying(null)
  }

  const updateVideoStatus = async (id, status) => {
    await db.updateVideoRequestStatus(id, status)
    setVideoReqs(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  const tabStyle = (t) => ({ padding: '10px 20px', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: tab === t ? '#1f9d63' : '#fff', color: tab === t ? '#fff' : '#5d6f66', transition: '.15s' })

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <button className="btn sm ghost" onClick={onBack}><ArrowLeft size={16} /> Voltar</button>
        <h1 className="title" style={{ margin: 0 }}>Portal — <span>{patient.name}</span></h1>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[['appointment','Próxima Consulta'],['messages','Dúvidas'],['photos','Fotos'],['video','Vídeo Chamada']].map(([t,l]) => (
          <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {tab === 'appointment' && (
        <div className="panel" style={{ maxWidth: 520 }}>
          <h2 style={{ marginBottom: 4 }}>📅 Próxima Consulta</h2>
          <p className="ph">A data e horário aparecerão no portal do paciente e na Minha Agenda.</p>

          <div className="two" style={{ marginTop: 16 }}>
            <div>
              <label className="lbl"><CalendarDays size={14} /> Data da consulta</label>
              <input type="date" className="field" value={apptDate} onChange={e => { setApptDate(e.target.value); setApptSaved(false); }} />
            </div>
            <div>
              <label className="lbl"><Clock size={14} /> Horário</label>
              <input type="time" className="field" value={apptTime} onChange={e => { setApptTime(e.target.value); setApptSaved(false); }} />
            </div>
          </div>

          <button className="btn" onClick={() => {
            const combined = apptDate ? (apptTime ? `${apptDate}T${apptTime}` : apptDate) : '';
            onSaveAppt(combined);
            setApptSaved(true);
          }}>
            <Save size={16} /> Salvar consulta
          </button>

          {apptSaved && apptDate && (
            <div className="infobox" style={{ background: 'var(--green-soft)', border: '1px solid #cde8d8', color: 'var(--green-d)', marginTop: 16 }}>
              ✅ Consulta salva com sucesso!
              <div style={{ fontWeight: 700, marginTop: 6, fontSize: 15 }}>
                {new Date((apptDate + (apptTime ? 'T' + apptTime : 'T12:00')).replace(/T/, 'T')).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                {apptTime && ` às ${apptTime}`}
              </div>
              <div style={{ fontSize: 12.5, marginTop: 4, color: 'var(--green-d)' }}>
                O paciente já pode ver essa data no portal dele.
              </div>
            </div>
          )}

          {!apptSaved && (apptDate || rawAppt) && (
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg)', borderRadius: 12, fontSize: 13, color: 'var(--ink-soft)' }}>
              {rawAppt ? (
                <>Última consulta salva: <b style={{ color: 'var(--ink)' }}>
                  {new Date((rawAppt.includes('T') ? rawAppt : rawAppt + 'T12:00')).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  {rawAppt.includes('T') && rawAppt.length > 10 ? ` às ${rawAppt.slice(11, 16)}` : ''}
                </b></>
              ) : 'Nenhuma consulta salva ainda.'}
            </div>
          )}
        </div>
      )}

      {tab === 'messages' && (
        <>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, marginBottom: 16 }}>Dúvidas de {patient.name}</h2>
          {messages === null ? <div className="empty">Carregando…</div> :
           messages.length === 0 ? <div className="empty"><HelpCircle size={36} style={{ opacity: .4 }} /><p>Nenhuma dúvida enviada.</p></div> :
           messages.map(m => (
            <div key={m.id} className="panel" style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: '#5d6f66', marginBottom: 8 }}>{new Date(m.created_at).toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' })}</div>
              <div style={{ fontSize: 15, marginBottom: 12, lineHeight: 1.5 }}>{m.content}</div>
              {m.reply ? (
                <div style={{ background: '#e7f4ec', border: '1px solid #cde8d8', borderRadius: 10, padding: '10px 14px', fontSize: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: '#157a4c', marginBottom: 4 }}>Sua resposta:</div>
                  {m.reply}
                </div>
              ) : replying === m.id ? (
                <div>
                  <textarea className="field" rows={3} value={reply[m.id] || ''} onChange={e => setReply(r => ({ ...r, [m.id]: e.target.value }))} placeholder="Escreva sua resposta…" style={{ marginBottom: 10, resize: 'vertical' }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn sm" onClick={() => sendReply(m.id)}><Send size={14} /> Responder</button>
                    <button className="btn sm ghost" onClick={() => setReplying(null)}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <button className="btn sm ghost" onClick={() => setReplying(m.id)}><Send size={14} /> Responder</button>
              )}
            </div>
          ))}
        </>
      )}

      {tab === 'photos' && (
        <>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, marginBottom: 16 }}>Fotos de {patient.name}</h2>
          {photos === null ? <div className="empty">Carregando…</div> :
           photos.length === 0 ? <div className="empty"><Camera size={36} style={{ opacity: .4 }} /><p>Nenhuma foto enviada.</p></div> : (
            <PhotoGallery
              photos={photos}
              canDelete={true}
              onDelete={async (p) => {
                await db.deletePatientPhoto(p.id, p.storage_path)
                setPhotos(prev => prev.filter(x => x.id !== p.id))
              }}
            />
          )}
        </>
      )}

      {tab === 'video' && (
        <>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, marginBottom: 16 }}>Solicitações de vídeo chamada</h2>
          {videoReqs === null ? <div className="empty">Carregando…</div> :
           videoReqs.length === 0 ? <div className="empty"><Video size={36} style={{ opacity: .4 }} /><p>Nenhuma solicitação.</p></div> :
           videoReqs.map(r => (
            <div key={r.id} className="panel" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
              <Video size={20} style={{ color: '#1f9d63', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{r.preferred_date ? new Date(r.preferred_date + 'T12:00:00').toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' }) : '—'}</div>
                {r.message && <div style={{ color: '#5d6f66', fontSize: 13, marginTop: 2 }}>{r.message}</div>}
                <div style={{ color: '#5d6f66', fontSize: 12, marginTop: 2 }}>{new Date(r.created_at).toLocaleDateString('pt-BR')}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {r.status !== 'approved' && <button className="btn sm" onClick={() => updateVideoStatus(r.id, 'approved')}>Aprovar</button>}
                {r.status !== 'rejected' && <button className="btn sm danger" onClick={() => updateVideoStatus(r.id, 'rejected')}>Recusar</button>}
                {r.status === 'approved' && <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: '#e7f4ec', color: '#157a4c', fontWeight: 600 }}>Aprovada</span>}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  )
}

function PrintView({ diet, patient, profile }) {
  const pr = profile || {};

  // Mapeia foodId → nome para as substituições
  const foodNames = {};
  (diet.meals || []).forEach(m => m.items.forEach(it => { foodNames[it.foodId || it.id] = it.name || it.foodId; }));

  const subsEntries = Object.entries(diet.subs || {}).filter(([, subs]) => subs && subs.length > 0);

  return (
    <div className="np-print">
      {(pr.name || pr.clinic) && (
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <b style={{ fontSize: 16 }}>{pr.clinic || pr.name}</b>
          {pr.name && pr.clinic ? <span> · {pr.name}</span> : null}
          {pr.crn ? <span> · {pr.crn}</span> : null}
        </div>
      )}
      <h1>Plano Alimentar Personalizado</h1>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "14px 0 4px" }}>
        <b>Paciente: {patient?.name}</b><span>Data: {new Date().toLocaleDateString("pt-BR")}</span>
      </div>
      <hr style={{ marginBottom: 10 }} />

      {diet.meals.filter((m) => m.items.length).map((m) => (
        <div key={m.id} className="print-section">
          <div className="meal-title">{m.time} — {m.name}</div>
          <table>
            <thead><tr><th style={{ width: '65%' }}>Alimento</th><th>Porção</th></tr></thead>
            <tbody>{m.items.map((it) => <tr key={it.id}><td>{it.name}</td><td>{it.label}</td></tr>)}</tbody>
          </table>
        </div>
      ))}

      {(diet.supplements || []).length > 0 && (
        <div className="print-section">
          <div className="meal-title">💊 Suplementação</div>
          <table>
            <thead><tr><th style={{ width: '50%' }}>Suplemento</th><th>Dose</th><th>Horário</th></tr></thead>
            <tbody>{diet.supplements.map((s, i) => <tr key={i}><td>{s.name}</td><td>{s.dose}</td><td>{s.time}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {subsEntries.length > 0 && (
        <div className="print-section">
          <div className="meal-title">🔄 Substituições Permitidas</div>
          <table>
            <thead><tr><th style={{ width: '40%' }}>Alimento</th><th>Pode substituir por</th></tr></thead>
            <tbody>
              {subsEntries.map(([foodId, subs]) => (
                <tr key={foodId}>
                  <td style={{ fontWeight: 600 }}>{foodNames[foodId] || foodId}</td>
                  <td>{subs.join(' / ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
