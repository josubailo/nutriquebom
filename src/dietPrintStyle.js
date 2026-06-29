/* ── Estilo de impressão do plano alimentar - compartilhado entre o
   Builder (nutricionista) e o Portal do Paciente, para gerar sempre o
   mesmo PDF, independente de quem clicar em "Gerar PDF" ────────── */
export const DIET_PRINT_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=DM+Sans:wght@400;500;600&display=swap');
@media print {
  body > *:not(.dp-print) { display: none !important; }
  .dp-print {
    display: block !important;
    position: static;
    width: 100%;
    box-sizing: border-box;
    font-family: 'DM Sans', sans-serif;
    color: #16241d; font-size: 13px; background: #fff;
  }
  .dp-title {
    font-family: 'Fraunces', serif; font-size: 30px; font-weight: 700;
    color: #1f9d63; text-align: center; margin: 0 0 16px; letter-spacing: -.3px;
  }
  .dp-meta {
    display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: 1.5px solid #e4e9e3; padding-bottom: 10px; margin-bottom: 22px;
  }
  .dp-meta .pac { font-weight: 700; font-size: 13px; }
  .dp-meta .dt  { color: #5d6f66; font-size: 13px; }
  .dp-meal { margin-bottom: 20px; page-break-inside: avoid; }
  .dp-meal-head {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    font-size: 13px; font-weight: 700; color: #16241d; margin-bottom: 6px;
  }
  .dp-meal-head .nm { display: flex; align-items: center; gap: 6px; text-align: left; }
  .dp-meal-head .tm { display: flex; align-items: center; gap: 4px; font-weight: 600; font-size: 12px; color: #7a8f84; }
  .dp-meal-head svg { flex-shrink: 0; }
  .dp-table { width: 100%; border-collapse: collapse; }
  .dp-table th { font-size: 11.5px; font-weight: 700; color: #16241d; text-align: left; padding: 5px 0; border-bottom: 1.5px solid #16241d; }
  .dp-table th:last-child { text-align: right; }
  .dp-table td { padding: 9px 0; font-size: 13px; text-align: left; border-bottom: 1px solid #e4e9e3; }
  .dp-table td:last-child { text-align: right; color: #5d6f66; }
  .dp-subs, .dp-recipe { width: 100%; border-collapse: collapse; margin-top: 4px; }
  .dp-subs tr:first-child td, .dp-recipe tr:first-child td { padding-top: 7px; }
  .dp-subs { border-top: 1px dashed #cfd8d2; }
  .dp-recipe { border-top: 1px solid #cde8d8; }
  .dp-subs td, .dp-recipe td { font-size: 10.5px; color: #7a8f84; padding: 3px 4px; text-align: left; }
  .dp-subs td:first-child { width: 42%; }
  .dp-recipe .dp-recipe-title { color: #157a4c; font-weight: 700; }
  .dp-sups { margin-top: 18px; page-break-inside: avoid; }
  .dp-note { margin-top: 18px; page-break-inside: avoid; }
  .dp-note p { white-space: pre-wrap; font-size: 13px; margin: 0; }
  @page { margin: 20mm 22mm; size: A4; }
}
`;
