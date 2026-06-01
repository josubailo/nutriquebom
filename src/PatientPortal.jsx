import React, { useState } from 'react'
import { supabase } from './supabase'
import { Utensils, Activity, FlaskConical, FileText, LogOut, UserCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function PatientPortal({ patientData, user }) {
  const [tab, setTab] = useState('diets')
  const { patient, diets, assessments, exams } = patientData

  const signOut = () => supabase.auth.signOut()

  return (
    <div className="np">
      <div className="layout">
        <aside className="side">
          <div className="brand">
            <div className="logo"><Utensils size={17} /></div>
            <b>Nutriquébom</b>
          </div>
          <div className="navlabel">Olá, {patient.name.split(' ')[0]}!</div>
          <button className={"navitem" + (tab === 'diets'       ? ' active' : '')} onClick={() => setTab('diets')}><Utensils size={18} /> Minhas Dietas</button>
          <button className={"navitem" + (tab === 'assessments' ? ' active' : '')} onClick={() => setTab('assessments')}><Activity size={18} /> Avaliações</button>
          <button className={"navitem" + (tab === 'exams'       ? ' active' : '')} onClick={() => setTab('exams')}><FlaskConical size={18} /> Exames</button>
          <div style={{ flex: 1 }} />
          <button className="navitem" onClick={signOut} style={{ color: '#e5484d' }}>
            <LogOut size={18} /> Sair
          </button>
        </aside>

        <main className="main">
          {tab === 'diets'       && <PatientDiets diets={diets} />}
          {tab === 'assessments' && <PatientAssessments assessments={assessments} />}
          {tab === 'exams'       && <PatientExams exams={exams} />}
        </main>
      </div>
    </div>
  )
}

/* ── Dietas do paciente ─────────────────────────────────────── */
function PatientDiets({ diets }) {
  const [open, setOpen] = useState(null)

  if (!diets.length) return (
    <div className="empty"><Utensils size={40} style={{ opacity: .4 }} /><p>Nenhuma dieta disponível ainda.</p></div>
  )

  return (
    <>
      <h1 className="title">Minhas <span>Dietas</span></h1>
      <p className="sub">Planos alimentares elaborados pelo seu nutricionista</p>
      <div style={{ marginTop: 20 }}>
        {diets.map(diet => (
          <div className="panel" key={diet.id} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{diet.name}</div>
                <div style={{ color: '#5d6f66', fontSize: 13, marginTop: 3 }}>
                  {diet.createdAt ? new Date(diet.createdAt).toLocaleDateString('pt-BR') : ''}
                </div>
              </div>
              <button className="btn sm ghost" onClick={() => setOpen(open === diet.id ? null : diet.id)}>
                {open === diet.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {open === diet.id ? 'Fechar' : 'Ver dieta'}
              </button>
            </div>

            {open === diet.id && (
              <div style={{ marginTop: 18 }}>
                {(diet.meals || []).map(meal => (
                  <div className="meal" key={meal.id}>
                    <div className="meal-head">
                      <Utensils size={16} style={{ color: '#1f9d63' }} />
                      <span className="mn">{meal.name}</span>
                      <span className="time">{meal.time}</span>
                    </div>
                    {meal.items?.length > 0 && (
                      <div className="meal-body">
                        {meal.items.map((item, i) => (
                          <div className="item" key={i}>
                            <div>
                              <div className="inm">{item.name || item.foodId}</div>
                              <div className="iqt">{item.grams}g</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

/* ── Avaliações do paciente ─────────────────────────────────── */
function PatientAssessments({ assessments }) {
  if (!assessments.length) return (
    <div className="empty"><Activity size={40} style={{ opacity: .4 }} /><p>Nenhuma avaliação registrada ainda.</p></div>
  )

  return (
    <>
      <h1 className="title">Minhas <span>Avaliações</span></h1>
      <p className="sub">Histórico de avaliações físicas</p>
      <div style={{ marginTop: 20 }}>
        {assessments.map(a => {
          const h = (+a.height || 0) / 100
          const imc = h > 0 ? (+a.weight / (h * h)).toFixed(1) : '—'
          return (
            <div className="panel" key={a.id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <Blk label="Data" value={a.date || '—'} />
                <Blk label="Peso" value={a.weight ? `${a.weight} kg` : '—'} />
                <Blk label="Altura" value={a.height ? `${a.height} cm` : '—'} />
                <Blk label="IMC" value={imc} />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ── Exames do paciente ─────────────────────────────────────── */
function PatientExams({ exams }) {
  if (!exams.length) return (
    <div className="empty"><FlaskConical size={40} style={{ opacity: .4 }} /><p>Nenhum exame registrado ainda.</p></div>
  )

  return (
    <>
      <h1 className="title">Meus <span>Exames</span></h1>
      <p className="sub">Resultados de exames laboratoriais</p>
      <div style={{ marginTop: 20 }}>
        {exams.map(exam => (
          <div className="panel" key={exam.id} style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>{exam.date || 'Exame'}</div>
            {(exam.results || []).map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e4e9e3', fontSize: 14 }}>
                <span>{r.name} {r.unit ? `(${r.unit})` : ''}</span>
                <span style={{ fontWeight: 700, color: r.status === 'Normal' ? '#1f9d63' : r.status === 'Alto' ? '#e5484d' : '#2d7ff9' }}>
                  {r.result} — {r.status}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

function Blk({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: '#5d6f66', marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700 }}>{value}</div>
    </div>
  )
}
