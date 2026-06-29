/* ── Corpo do PDF do plano alimentar - compartilhado entre o
   Builder (nutricionista) e o Portal do Paciente ────────────────── */
import { Utensils, Clock, Pill, ClipboardList } from 'lucide-react';

const cleanName = (n) => (n || '').replace(/\s+/g, ' ').trim();
const subLabel = (s) => typeof s === 'string' ? s : `${s.name} (${s.grams}g)`;
const joinOr = (arr) => {
  if (!arr || arr.length === 0) return '';
  const labels = arr.map(subLabel);
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(', ')} ou ${labels[labels.length - 1]}`;
};

export function DietPrintBody({ diet, patient, profile }) {
  const pr = profile || {};
  const meals = (diet.meals || []).filter((m) => m.items?.length > 0);

  return (
    <>
      {(pr.name || pr.clinic) && (
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <b style={{ fontSize: 16 }}>{pr.clinic || pr.name}</b>
          {pr.name && pr.clinic ? <span> · {pr.name}</span> : null}
          {pr.crn ? <span> · {pr.crn}</span> : null}
        </div>
      )}
      <div className="dp-title">Plano Alimentar Personalizado</div>
      <div className="dp-meta">
        <span className="pac">Paciente: {patient?.name}</span>
        <span className="dt">Data: {new Date().toLocaleDateString('pt-BR')}</span>
      </div>

      {meals.map((meal) => {
        const ingredientSubs = meal.items.filter((it) => (diet.subs || {})[it.foodId || it.name]?.length > 0);
        const mealSubs = (diet.mealSubs || {})[meal.id] || [];
        return (
          <div className="dp-meal" key={meal.id}>
            <div className="dp-meal-head">
              <span className="nm"><Utensils size={13} /> {meal.name}</span>
              <span className="tm"><Clock size={12} /> {meal.time}</span>
            </div>
            <div className="dp-cols">
              <table className="dp-table">
                <thead><tr><th>Alimento</th><th>Porção</th></tr></thead>
                <tbody>
                  {meal.items.map((it, i) => (
                    <tr key={it.id || i}><td>{cleanName(it.name)}</td><td>{it.label || `${it.grams}g`}</td></tr>
                  ))}
                </tbody>
              </table>

              {ingredientSubs.length > 0 && (
                <table className="dp-subs">
                  <tbody>
                    {ingredientSubs.map((it) => (
                      <tr key={it.id}>
                        <td>• {cleanName(it.name)}</td>
                        <td>pode substituir por: {joinOr(diet.subs[it.foodId || it.name])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {mealSubs.map((rs, i) => (
                <table className="dp-recipe" key={i}>
                  <tbody>
                    <tr><td colSpan={2} className="dp-recipe-title">• Refeição inteira - substituir por: {rs.name}</td></tr>
                    {rs.items.map((it, j) => (
                      <tr key={j}>
                        <td style={{ paddingLeft: 14 }}>{cleanName(it.name)}</td>
                        <td>{it.role === 'free' ? 'à vontade' : `${it.scaledGrams}g`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
          </div>
        );
      })}

      {(diet.supplements || []).length > 0 && (
        <div className="dp-sups">
          <div className="dp-meal">
            <div className="dp-meal-head"><span className="nm"><Pill size={13} /> Suplementação</span></div>
            <div className="dp-cols">
              <table className="dp-table">
                <thead><tr><th>Suplemento</th><th>Dose / Horário</th></tr></thead>
                <tbody>
                  {diet.supplements.map((s, i) => (
                    <tr key={i}><td>{s.name}</td><td>{s.dose} - {s.time}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {diet.note?.trim() && (
        <div className="dp-note">
          <div className="dp-meal-head"><span className="nm"><ClipboardList size={13} /> Observação</span></div>
          <p>{diet.note.trim()}</p>
        </div>
      )}
    </>
  );
}
