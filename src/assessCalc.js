/* ── Cálculos de avaliação física compartilhados
   entre o Builder (nutricionista) e o Portal do Paciente ────────── */

export const r0 = (n) => Math.round(n || 0);
export const r1 = (n) => Math.round((n || 0) * 10) / 10;

const siri = (d) => 495 / d - 450;

export function bodyFatManual(eq, sex, age, sf) {
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

export function assessResults(a) {
  const h = (+a.height || 0) / 100;
  const imc = h > 0 ? +a.weight / (h * h) : 0;
  let bf;
  if (a.method === "manual") bf = bodyFatManual(a.equation, a.sex, +a.age, a.skinfolds || {});
  else if (a.method === "bioimpedancia") bf = +a.bioFat || 0;
  else bf = +a.iaFat || 0;
  bf = Math.max(0, bf || 0);
  const fatMass = (+a.weight) * bf / 100;
  const leanMass = (+a.weight) - fatMass;
  const rcq = (+a.perimeters?.cintura && +a.perimeters?.quadril) ? +a.perimeters.cintura / +a.perimeters.quadril : 0;
  return { imc, bf, fatMass, leanMass, rcq };
}

export const imcClass = (imc) => imc < 18.5 ? ["Abaixo do peso", "#2d7ff9"] : imc < 25 ? ["Eutrófico", "#1f9d63"] : imc < 30 ? ["Sobrepeso", "#f1932c"] : ["Obesidade", "#e5484d"];

export function bfClass(bf, sex) {
  const t = sex === "M" ? [6, 14, 18, 25] : [14, 21, 25, 32];
  if (bf < t[0]) return ["Essencial", "#2d7ff9"];
  if (bf < t[1]) return ["Atlético", "#1f9d63"];
  if (bf < t[2]) return ["Bom", "#1f9d63"];
  if (bf < t[3]) return ["Aceitável", "#f1932c"];
  return ["Elevado", "#e5484d"];
}

const skinfoldSum = (a) => {
  if (!a.skinfolds) return null;
  const vals = Object.values(a.skinfolds).map(Number).filter(v => v > 0);
  return vals.length ? vals.reduce((s, v) => s + v, 0) : null;
};

export const ASSESS_METRICS = [
  { label: 'Peso atual (Kg)',              get: (a) => +a.weight || null },
  { label: 'Altura atual (cm)',            get: (a) => +a.height || null },
  { label: 'IMC (Kg/m²)',                 get: (a, r) => r.imc || null },
  { label: '% Gordura',                   get: (a, r) => r.bf || null },
  { label: 'Massa de Gordura (Kg)',        get: (a, r) => r.fatMass || null },
  { label: 'Massa Livre de Gordura (Kg)', get: (a, r) => r.leanMass || null },
  { label: 'Somatório de Dobras (mm)',     get: (a) => skinfoldSum(a) },
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
