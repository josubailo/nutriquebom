/* ── Corpo do PDF do plano alimentar - compartilhado entre o
   Builder (nutricionista) e o Portal do Paciente ────────────────── */
import { Utensils, Clock, Pill, ClipboardList, Repeat } from 'lucide-react';

const cleanName = (n) => (n || '').replace(/\s+/g, ' ').trim();
const subLabel = (s) => typeof s === 'string' ? s.replace(/—|–/g, '-') : `${s.name} (${s.grams}g)`;
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
        const mealSubs = (diet.mealSubs || {})[meal.id] || [];
        const mealAlts = (diet.mealAlts || {})[meal.id] || [];
        return (
          <div className="dp-meal" key={meal.id}>
            <div className="dp-meal-head">
              <span className="nm"><Utensils size={13} /> {meal.name}</span>
              <span className="tm"><Clock size={12} /> {meal.time}</span>
            </div>
            <div className="dp-meal-body">
              <table className="dp-table">
                <thead><tr><th>Alimento</th><th>Porção</th></tr></thead>
                <tbody>
                  {meal.items.map((it, i) => {
                    const subs = (diet.subs || {})[it.foodId || it.name] || [];
                    return (
                      <tr key={it.id || i}>
                        <td>
                          {cleanName(it.name)}
                          {subs.length > 0 && (
                            <div className="dp-inline-sub"><Repeat size={11} /> Substituir por: {joinOr(subs)}</div>
                          )}
                        </td>
                        <td>{it.label || `${it.grams}g`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {mealSubs.map((rs, i) => (
                <table className="dp-recipe" key={i}>
                  <tbody>
                    <tr><td colSpan={2} className="dp-recipe-title">• Refeição inteira - substituir por: {rs.name}</td></tr>
                    {rs.items.map((it, j) => (
                      <tr key={j}>
                        <td style={{ paddingLeft: 14 }}>{cleanName(it.name)}</td>
                        <td>{it.role === 'free' ? 'à vontade' : (it.unit || `${it.scaledGrams}g`)}</td>
                      </tr>
                    ))}
                    {rs.note && (
                      <tr>
                        <td colSpan={2} style={{ paddingLeft: 14, paddingTop: 6, color: '#5d6f66', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>{rs.note}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ))}

              {mealAlts.map((alt, idx) => (
                <table className="dp-recipe" key={alt.id}>
                  <tbody>
                    <tr><td colSpan={2} className="dp-recipe-title">• Opção {idx + 1}</td></tr>
                    {alt.items.map((it, j) => (
                      <tr key={j}>
                        <td style={{ paddingLeft: 14 }}>{cleanName(it.name)}</td>
                        <td>{it.label || `${it.grams}g`}</td>
                      </tr>
                    ))}
                    {alt.note?.trim() && (
                      <tr>
                        <td colSpan={2} style={{ paddingLeft: 14, paddingTop: 6, color: '#5d6f66', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>{alt.note.trim()}</td>
                      </tr>
                    )}
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
            <div className="dp-meal-body">
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
        <div className="dp-meal dp-note">
          <div className="dp-meal-head"><span className="nm"><ClipboardList size={13} /> Observação</span></div>
          <div className="dp-meal-body"><p>{diet.note.trim()}</p></div>
        </div>
      )}
    </>
  );
}
