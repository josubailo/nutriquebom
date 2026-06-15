/* ── Visualizações de avaliação física compartilhadas
   entre o Builder (nutricionista) e o Portal do Paciente ────────── */
import { Pencil } from 'lucide-react';
import { r1, ASSESS_METRICS } from './assessCalc';

export function StackedBarChart({ rows }) {
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

const cellStyle = { padding: '9px 12px', fontSize: 13, borderBottom: '1px solid #eef2ee', textAlign: 'center', whiteSpace: 'nowrap' };
const headStyle = { ...cellStyle, fontWeight: 700, fontSize: 12, background: '#f5f9f5', color: '#5d6f66' };

const fmtDelta = (cur, prev) => {
  if (prev == null || cur == null) return null;
  const d = +(cur - prev).toFixed(1);
  if (Math.abs(d) < 0.05) return null;
  const up = d > 0;
  return <span style={{ fontSize: 11, color: up ? '#e5484d' : '#1f9d63', marginLeft: 3, whiteSpace: 'nowrap' }}>{up ? '↑' : '↓'} ({up ? '+' : ''}{d})</span>;
};

/* Tabela comparativa de avaliações — usada no Builder (com edição) e no Portal (somente leitura) */
export function AssessComparisonTable({ rows, editable = false, onEdit }) {
  return (
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
              {editable && <th style={{ ...headStyle, width: 36 }}></th>}
            </tr>
          </thead>
          <tbody>
            {ASSESS_METRICS.filter(m => {
              if (m.section) return true;
              return rows.some(x => m.get(x.a, x.r) != null);
            }).map((m, mi) => {
              if (m.section) return (
                <tr key={'sec-' + mi}>
                  <td colSpan={rows.length + (editable ? 2 : 1)} style={{ ...cellStyle, background: '#f0f7f3', fontWeight: 700, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--green-d)', textAlign: 'left', paddingTop: 10 }}>
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
                  {editable && <td style={cellStyle}></td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {editable && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid #eef2ee', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {rows.map((x, i) => (
            <button key={i} className="btn sm ghost" style={{ fontSize: 12 }} onClick={() => onEdit(x.a.id)}>
              <Pencil size={13} /> {x.a.date ? new Date(x.a.date + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
