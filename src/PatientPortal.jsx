import React, { useState, useRef } from 'react'
import { supabase } from './supabase'
import {
  Utensils, Activity, FlaskConical, LogOut, ChevronDown, ChevronUp,
  CalendarDays, Video, HelpCircle, Camera, Send, Check, Clock, ImageIcon,
  FileDown, UserCircle, Pencil, Scale, TrendingUp, Percent
} from 'lucide-react'
import * as db from './db'
import { NP_STYLE } from './npStyles'

/* ── estilos de print — replica o PDF de referência ─────────── */
const PRINT_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=DM+Sans:wght@400;500;600&display=swap');
@media print {
  body * { visibility: hidden !important; }
  .pp-print, .pp-print * { visibility: visible !important; }
  .pp-print {
    position: fixed; inset: 0;
    padding: 20mm 22mm;
    font-family: 'DM Sans', sans-serif;
    color: #16241d; font-size: 13px; background: #fff;
  }
  .pp-title {
    font-family: 'Fraunces', serif; font-size: 30px; font-weight: 700;
    color: #1f9d63; text-align: center; margin: 0 0 16px; letter-spacing: -.3px;
  }
  .pp-meta {
    display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: 1.5px solid #e4e9e3; padding-bottom: 10px; margin-bottom: 22px;
  }
  .pp-meta .pac { font-weight: 700; font-size: 13px; }
  .pp-meta .dt  { color: #5d6f66; font-size: 13px; }
  .pp-meal { margin-bottom: 20px; page-break-inside: avoid; }
  .pp-meal-head {
    text-align: center; font-size: 12px; color: #7a8f84;
    font-weight: 600; letter-spacing: .04em; margin-bottom: 6px;
  }
  .pp-meal table { width: 100%; border-collapse: collapse; }
  .pp-meal th {
    font-size: 11.5px; font-weight: 700; color: #16241d;
    text-align: left; padding: 5px 0; border-bottom: 1.5px solid #16241d;
  }
  .pp-meal th:last-child { text-align: right; }
  .pp-meal td { padding: 9px 0; font-size: 13px; border-bottom: 1px solid #e4e9e3; }
  .pp-meal td:last-child { text-align: right; color: #5d6f66; }
  .pp-sups { margin-top: 18px; page-break-inside: avoid; }
  @page { margin: 0; size: A4; }
}
`

/* ══════════════════════════════════════════════════════════════ */
export default function PatientPortal({ patientData }) {
  const [tab, setTab] = useState('diets')
  const { patient, diets, assessments, exams,
          messages: init_m, videoRequests: init_v, photos: init_p } = patientData
  const [messages,  setMessages]  = useState(init_m || [])
  const [videoReqs, setVideoReqs] = useState(init_v || [])
  const [photos,    setPhotos]    = useState(init_p || [])

  const appt = patient.next_appointment || patient.nextAppointment

  const NAV = [
    { id: 'diets',       icon: <Utensils size={18} />,     label: 'Minha Dieta' },
    { id: 'appointment', icon: <CalendarDays size={18} />, label: 'Próxima Consulta' },
    { id: 'photos',      icon: <Camera size={18} />,       label: 'Minhas Fotos' },
    { id: 'messages',    icon: <HelpCircle size={18} />,   label: 'Dúvidas' },
    { id: 'video',       icon: <Video size={18} />,        label: 'Vídeo Chamada' },
    { id: 'assessments', icon: <Activity size={18} />,     label: 'Avaliações' },
    { id: 'exams',       icon: <FlaskConical size={18} />, label: 'Exames' },
  ]

  return (
    <div className="np">
      <style>{NP_STYLE}</style>
      <style>{PRINT_STYLE}</style>
      <div className="layout">

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="side">
          <div className="brand">
            <div className="logo"><Utensils size={17} /></div>
            <b>Nutriquébom</b>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px 16px', flexShrink: 0 }}>
            <div className="avatar" style={{ width: 36, height: 36 }}>
              <UserCircle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{patient.name.split(' ')[0]}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>Meu portal</div>
            </div>
          </div>

          {appt && (
            <div
              onClick={() => setTab('appointment')}
              style={{ background: 'var(--green-soft)', border: '1px solid #cde8d8', borderRadius: 12, padding: '9px 12px', margin: '0 2px 12px', cursor: 'pointer', flexShrink: 0 }}
            >
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--green-d)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>Próxima consulta</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{fmtDate(appt)}</div>
            </div>
          )}

          <div className="navlabel">Menu</div>
          {NAV.map(n => (
            <button key={n.id} className={'navitem' + (tab === n.id ? ' active' : '')} onClick={() => setTab(n.id)}>
              {n.icon} {n.label}
            </button>
          ))}

          <div style={{ flex: 1 }} />
          <button className="navitem" onClick={() => supabase.auth.signOut()} style={{ color: '#e5484d', flexShrink: 0 }}>
            <LogOut size={18} /> Sair
          </button>
        </aside>

        {/* ── Main ────────────────────────────────────────────── */}
        <main className="main">
          {tab === 'diets'       && <PtDiets diets={diets} patient={patient} />}
          {tab === 'appointment' && <PtAppointment patient={patient} />}
          {tab === 'photos'      && <PtPhotos patient={patient} photos={photos} onAdd={p => setPhotos(prev => [p, ...prev])} />}
          {tab === 'messages'    && <PtMessages patient={patient} messages={messages} onAdd={m => setMessages(prev => [m, ...prev])} />}
          {tab === 'video'       && <PtVideo patient={patient} reqs={videoReqs} onAdd={r => setVideoReqs(prev => [r, ...prev])} />}
          {tab === 'assessments' && <PtAssessments assessments={assessments} />}
          {tab === 'exams'       && <PtExams exams={exams} patient={patient} />}
        </main>
      </div>
    </div>
  )
}

/* ══ DIETA ═════════════════════════════════════════════════════ */
function PtDiets({ diets, patient }) {
  const [openId, setOpenId] = useState(null)

  // Mostra a dieta marcada como publicada (active: true),
  // ou a mais recente se nenhuma foi explicitamente publicada
  const sorted = [...diets].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  const hasExplicitActive = diets.some(d => d.active === true)
  const current = hasExplicitActive
    ? diets.find(d => d.active === true) || sorted[0]
    : sorted[0] || null
  const visibleDiets = current ? [current] : []

  const active = visibleDiets.find(d => d.id === openId)

  if (!current) return (
    <div className="empty">
      <Utensils size={44} style={{ opacity: .25, marginBottom: 12 }} />
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, marginBottom: 6 }}>Nenhuma dieta ainda</div>
      <p>Seu nutricionista ainda não cadastrou nenhum plano alimentar.</p>
    </div>
  )

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="title">Minha <span>Dieta</span></h1>
          <p className="sub">Plano alimentar elaborado pelo seu nutricionista</p>
        </div>
        {active && (
          <button className="btn sm ghost" onClick={() => window.print()}>
            <FileDown size={15} /> Baixar PDF
          </button>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        {visibleDiets.map(diet => {
          const isOpen  = openId === diet.id
          const meals   = (diet.meals || []).filter(m => m.items?.length > 0)
          const hasSups = (diet.supplements || []).length > 0
          return (
            <div key={diet.id}>
              <div className="panel" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 18, marginBottom: isOpen ? 0 : 12, borderBottomLeftRadius: isOpen ? 0 : 16, borderBottomRightRadius: isOpen ? 0 : 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{diet.name}</div>
                    <span style={{ fontSize: 11, background: 'var(--green-soft)', color: 'var(--green-d)', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>Dieta atual</span>
                  </div>
                  <div className="sub" style={{ fontSize: 13, marginTop: 3 }}>
                    {diet.createdAt ? new Date(diet.createdAt).toLocaleDateString('pt-BR') : ''}
                    {meals.length > 0 && <span> · {meals.length} refeição(ões)</span>}
                    {hasSups && <span> · suplementação</span>}
                  </div>
                </div>
                <button className="btn sm ghost" onClick={() => setOpenId(isOpen ? null : diet.id)}>
                  {isOpen ? <><ChevronUp size={15} /> Fechar</> : <><Pencil size={15} /> Ver dieta</>}
                </button>
                {isOpen && (
                  <button className="btn sm ghost" onClick={() => window.print()} title="Baixar como PDF">
                    <FileDown size={15} />
                  </button>
                )}
              </div>

              {isOpen && (
                <div style={{ border: '1px solid var(--line)', borderTop: 'none', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, padding: '18px 22px 16px', background: '#fff', marginBottom: 12 }}>
                  {meals.map(meal => (
                    <div className="meal" key={meal.id}>
                      <div className="meal-head">
                        <Utensils size={15} style={{ color: 'var(--green)' }} />
                        <span className="mn">{meal.name}</span>
                        <span className="time"><Clock size={13} /> {meal.time}</span>
                      </div>
                      <div className="meal-body">
                        {meal.items.map((it, i) => (
                          <div className="item" key={i}>
                            <div style={{ flex: 1 }}>
                              <div className="inm">{it.name || it.foodId}</div>
                            </div>
                            <div className="imac">{it.label || `${it.grams}g`}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {hasSups && (
                    <div className="panel" style={{ marginTop: 8, marginBottom: 0, background: 'var(--bg)' }}>
                      <h2 style={{ fontSize: 15, marginBottom: 10 }}>💊 Suplementação</h2>
                      <div>
                        {diet.supplements.map((s, i) => (
                          <span key={i} className="chip">{s.name} · {s.dose} · {s.time}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {active && <PrintDiet diet={active} patient={patient} />}
    </>
  )
}

/* ── Print layout ────────────────────────────────────────────── */
function PrintDiet({ diet, patient }) {
  const meals = (diet.meals || []).filter(m => m.items?.length > 0)
  return (
    <div className="pp-print" style={{ display: 'none' }}>
      <div className="pp-title">Plano Alimentar Personalizado</div>
      <div className="pp-meta">
        <span className="pac">Paciente: {patient.name}</span>
        <span className="dt">Data: {new Date().toLocaleDateString('pt-BR')}</span>
      </div>
      {meals.map(meal => (
        <div className="pp-meal" key={meal.id}>
          <div className="pp-meal-head">{meal.time} — {meal.name}</div>
          <table>
            <thead><tr><th style={{ width: '65%' }}>Alimento</th><th>Porção</th></tr></thead>
            <tbody>
              {meal.items.map((it, i) => (
                <tr key={i}>
                  <td>{it.name || it.foodId}</td>
                  <td>{it.label || `${it.grams}g`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {(diet.supplements || []).length > 0 && (
        <div className="pp-sups">
          <div className="pp-meal">
            <div className="pp-meal-head">💊 Suplementação</div>
            <table>
              <thead><tr><th style={{ width: '50%' }}>Suplemento</th><th>Dose</th><th>Horário</th></tr></thead>
              <tbody>
                {diet.supplements.map((s, i) => (
                  <tr key={i}><td>{s.name}</td><td>{s.dose}</td><td>{s.time}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

/* ══ PRÓXIMA CONSULTA ══════════════════════════════════════════ */
function PtAppointment({ patient }) {
  const appt = patient.next_appointment || patient.nextAppointment
  return (
    <>
      <h1 className="title">Próxima <span>Consulta</span></h1>
      <p className="sub">Agendada pelo seu nutricionista</p>
      <div style={{ marginTop: 24 }}>
        {appt ? (
          <div className="calc" style={{ borderRadius: 18, padding: '32px 36px', gap: 0 }}>
            <div style={{ textAlign: 'center', width: '100%' }}>
              <CalendarDays size={40} style={{ color: 'var(--green-d)', marginBottom: 12 }} />
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 700, color: 'var(--green-d)' }}>{fmtDate(appt)}</div>
              <p style={{ color: 'var(--ink-soft)', marginTop: 10, fontSize: 14 }}>Entre em contato com seu nutricionista para confirmar o horário.</p>
            </div>
          </div>
        ) : (
          <div className="panel" style={{ textAlign: 'center', padding: '52px 40px' }}>
            <CalendarDays size={44} style={{ color: 'var(--ink-soft)', opacity: .3, marginBottom: 14 }} />
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Nenhuma consulta agendada</div>
            <p className="sub">Aguarde seu nutricionista definir a próxima data.</p>
          </div>
        )}
        <a
          href="https://wa.me/5567996029305"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <div className="panel" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: '.15s', border: '1.5px solid #25d366' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#e8fef1', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.492-5.18-1.355l-.371-.22-3.762.896.952-3.677-.242-.381A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#1a8a47' }}>Falar no WhatsApp</div>
              <div style={{ color: 'var(--ink-soft)', fontSize: 13 }}>Para cancelar, reagendar ou tirar dúvidas rápidas.</div>
            </div>
          </div>
        </a>
      </div>
    </>
  )
}

/* ══ FOTOS ═════════════════════════════════════════════════════ */
const EVAL_SUBTYPES = [
  'Frente', 'Lado Direito', 'Lado Esquerdo', 'Costas', 'Pose de Musculação', 'Outra'
]

function PtPhotos({ patient, photos, onAdd }) {
  const [photoMode,  setPhotoMode]  = useState('progresso') // 'progresso' | 'avaliacao'
  const [subType,    setSubType]    = useState('Frente')
  const [caption,    setCaption]    = useState('')
  const [obs,        setObs]        = useState('')
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [preview,    setPreview]    = useState(null)
  const fileRef = useRef()

  const pickFile = e => {
    const f = e.target.files[0]
    if (f) setPreview({ file: f, url: URL.createObjectURL(f) })
  }

  const upload = async () => {
    if (!preview) return
    setLoading(true); setError('')
    const nid = patient.nutritionist_id || patient.nutritionistId
    let finalCaption = ''
    if (photoMode === 'avaliacao') {
      finalCaption = `[Avaliação - ${subType}]${obs.trim() ? ' ' + obs.trim() : ''}`
    } else {
      finalCaption = caption.trim()
    }
    const { data, error: err } = await db.uploadPatientPhoto(patient.id, nid, preview.file, finalCaption)
    if (err) setError(`Erro ao enviar: ${err.message || 'Tente novamente.'}`)
    else {
      onAdd(data)
      setCaption(''); setObs(''); setPreview(null)
      setPhotoMode('progresso'); setSubType('Frente')
    }
    setLoading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <>
      <h1 className="title">Minhas <span>Fotos</span></h1>
      <p className="sub">Registre seu progresso e fotos dos pratos</p>

      <div className="panel" style={{ marginTop: 20 }}>
        <h2>Enviar nova foto</h2>

        {/* Tipo de foto */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { id: 'progresso', label: 'Progresso / Alimentar' },
            { id: 'avaliacao', label: 'Foto de Avaliação' },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setPhotoMode(m.id)}
              style={{
                padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
                background: photoMode === m.id ? 'var(--green)' : 'var(--bg)',
                color: photoMode === m.id ? '#fff' : 'var(--ink-soft)',
              }}
            >{m.label}</button>
          ))}
        </div>

        {/* Sub-tipo para avaliação */}
        {photoMode === 'avaliacao' && (
          <div style={{ marginBottom: 14 }}>
            <label className="lbl">Tipo de foto de avaliação</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {EVAL_SUBTYPES.map(s => (
                <button
                  key={s}
                  onClick={() => setSubType(s)}
                  style={{
                    padding: '5px 12px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', border: '1.5px solid',
                    borderColor: subType === s ? 'var(--green)' : 'var(--line)',
                    background: subType === s ? 'var(--green-soft)' : '#fff',
                    color: subType === s ? 'var(--green-d)' : 'var(--ink-soft)',
                  }}
                >{s}</button>
              ))}
            </div>
            {subType === 'Outra' && (
              <input
                className="field"
                style={{ marginTop: 8 }}
                value={obs}
                onChange={e => setObs(e.target.value)}
                placeholder="Descreva o motivo da foto…"
              />
            )}
          </div>
        )}

        {error && <div className="infobox" style={{ background: '#fde8e9', borderColor: '#f3c5c6', color: '#9b1c1f' }}>{error}</div>}

        {!preview ? (
          <div className="photodrop" onClick={() => fileRef.current?.click()}>
            <Camera size={30} style={{ marginBottom: 8 }} />
            <div style={{ fontWeight: 600 }}>Clique para escolher uma foto</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>JPG, PNG ou HEIC</div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <img src={preview.url} alt="preview" style={{ width: 130, height: 130, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--line)', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 200 }}>
              {photoMode === 'progresso' && (
                <div className="row" style={{ marginBottom: 0 }}>
                  <label className="lbl">Descrição (opcional)</label>
                  <input className="field" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Ex.: almoço, evolução semana 3…" />
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn sm" onClick={upload} disabled={loading}>
                  <Send size={14} /> {loading ? 'Enviando…' : 'Enviar'}
                </button>
                <button className="btn sm ghost" onClick={() => { setPreview(null); setCaption(''); setObs('') }}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={pickFile} />
      </div>

      {photos.length === 0 ? (
        <div className="empty">
          <ImageIcon size={44} style={{ opacity: .25, marginBottom: 10 }} />
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, marginBottom: 4 }}>Nenhuma foto ainda</div>
          <p>Envie a sua primeira acima.</p>
        </div>
      ) : (
        <>
          <div style={{ fontWeight: 700, fontSize: 15, margin: '24px 0 12px' }}>Galeria ({photos.length})</div>
          <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))' }}>
            {photos.map(p => (
              <div key={p.id} className="pcard" style={{ padding: 0, overflow: 'hidden' }}>
                <img src={p.public_url} alt={p.caption || 'foto'} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                <div style={{ padding: '10px 14px' }}>
                  {p.caption && <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{p.caption}</div>}
                  <div style={{ color: 'var(--ink-soft)', fontSize: 12 }}>
                    {new Date(p.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

/* ══ DÚVIDAS ═══════════════════════════════════════════════════ */
function PtMessages({ patient, messages, onAdd }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const send = async () => {
    if (!content.trim()) return
    setLoading(true); setError('')
    const nid = patient.nutritionist_id || patient.nutritionistId
    const { data, error: err } = await db.submitPatientMessage(patient.id, nid, content.trim())
    if (err) setError('Erro ao enviar. Tente novamente.')
    else { onAdd(data); setContent('') }
    setLoading(false)
  }

  return (
    <>
      <h1 className="title">Minhas <span>Dúvidas</span></h1>
      <p className="sub">Envie perguntas diretamente ao seu nutricionista</p>

      <div className="panel" style={{ marginTop: 20 }}>
        <h2>Nova pergunta</h2>
        <p className="ph">Sua dúvida será respondida em breve pelo nutricionista.</p>
        {error && <div className="infobox" style={{ background: '#fde8e9', borderColor: '#f3c5c6', color: '#9b1c1f' }}>{error}</div>}
        <textarea className="field" rows={4} value={content} onChange={e => setContent(e.target.value)}
          placeholder="Ex.: posso substituir o frango por atum? Sinto fome à noite, o que fazer?…"
          style={{ resize: 'vertical', marginBottom: 12 }} />
        <button className="btn" disabled={loading || !content.trim()} onClick={send}>
          <Send size={16} /> {loading ? 'Enviando…' : 'Enviar pergunta'}
        </button>
      </div>

      {messages.length === 0 && (
        <div className="empty">
          <HelpCircle size={44} style={{ opacity: .25, marginBottom: 10 }} />
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, marginBottom: 4 }}>Nenhuma dúvida ainda</div>
          <p>Envie sua primeira pergunta acima!</p>
        </div>
      )}

      {messages.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Histórico ({messages.length})</div>
          {messages.map(m => (
            <div key={m.id} className="panel" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="avatar" style={{ width: 30, height: 30, flexShrink: 0 }}>
                    <UserCircle size={16} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Você</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                    {new Date(m.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
                {m.reply
                  ? <span style={{ fontSize: 11.5, background: 'var(--green-soft)', color: 'var(--green-d)', padding: '2px 10px', borderRadius: 999, fontWeight: 700 }}>
                      <Check size={11} style={{ verticalAlign: '-1px' }} /> Respondida
                    </span>
                  : <span style={{ fontSize: 11.5, background: '#fdedd9', color: '#8a5a13', padding: '2px 10px', borderRadius: 999, fontWeight: 700 }}>
                      <Clock size={11} style={{ verticalAlign: '-1px' }} /> Aguardando
                    </span>
                }
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink)', marginBottom: m.reply ? 14 : 0 }}>
                {m.content}
              </div>
              {m.reply && (
                <div style={{ background: 'var(--green-soft)', border: '1px solid #cde8d8', borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--green)', display: 'grid', placeItems: 'center' }}>
                      <Utensils size={13} style={{ color: '#fff' }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--green-d)' }}>Nutriquébom</span>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink)' }}>{m.reply}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/* ══ VÍDEO CHAMADA ═════════════════════════════════════════════ */
function PtVideo({ patient, reqs, onAdd }) {
  const [message, setMessage] = useState('')
  const [date,    setDate]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const send = async () => {
    setLoading(true); setError('')
    const nid = patient.nutritionist_id || patient.nutritionistId
    const { data, error: err } = await db.submitVideoRequest(patient.id, nid, message, date)
    if (err) setError('Erro ao enviar. Tente novamente.')
    else { onAdd(data); setMessage(''); setDate('') }
    setLoading(false)
  }

  const ST = {
    pending:  { label: 'Aguardando', bg: '#fdedd9', color: '#8a5a13' },
    approved: { label: 'Confirmada',  bg: 'var(--green-soft)', color: 'var(--green-d)' },
    rejected: { label: 'Indisponível', bg: '#fde8e9', color: '#9b1c1f' },
  }

  return (
    <>
      <h1 className="title">Vídeo <span>Chamada</span></h1>
      <p className="sub">Solicite uma consulta online com seu nutricionista</p>

      <div className="panel" style={{ marginTop: 20 }}>
        <h2>Nova solicitação</h2>
        <p className="ph">Escolha uma data preferida e aguarde a confirmação.</p>
        {error && <div className="infobox" style={{ background: '#fde8e9', borderColor: '#f3c5c6', color: '#9b1c1f' }}>{error}</div>}
        <div className="two">
          <div>
            <label className="lbl"><CalendarDays size={13} /> Data preferida *</label>
            <input type="date" className="field" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="lbl"><HelpCircle size={13} /> Motivo (opcional)</label>
            <input className="field" value={message} onChange={e => setMessage(e.target.value)} placeholder="Ex.: tirar dúvidas sobre a dieta…" />
          </div>
        </div>
        <button className="btn" disabled={loading || !date} onClick={send}>
          <Video size={16} /> {loading ? 'Enviando…' : 'Solicitar vídeo chamada'}
        </button>
      </div>

      {reqs.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Solicitações enviadas</div>
          {reqs.map(r => {
            const s = ST[r.status] || ST.pending
            return (
              <div key={r.id} className="panel" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 18, marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, display: 'grid', placeItems: 'center', color: s.color, flexShrink: 0 }}>
                  <Video size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{r.preferred_date ? fmtDate(r.preferred_date) : '—'}</div>
                  {r.message && <div className="sub" style={{ fontSize: 13, marginTop: 2 }}>{r.message}</div>}
                  <div style={{ color: 'var(--ink-soft)', fontSize: 12, marginTop: 2 }}>{new Date(r.created_at).toLocaleDateString('pt-BR')}</div>
                </div>
                <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 999, fontWeight: 700, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

/* ══ AVALIAÇÕES — com gráficos de evolução ═════════════════════ */
function PtMiniChart({ points, color, suffix = '' }) {
  if (!points || points.length === 0) return null
  if (points.length === 1) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 70 }}>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 700, color }}>{points[0].y}{suffix}</div>
    </div>
  )
  const w = 300, ht = 80, pad = 14
  const ys = points.map(p => p.y)
  const min = Math.min(...ys), max = Math.max(...ys), range = max - min || 1
  const stepX = (w - 2 * pad) / (points.length - 1)
  const coords = points.map((p, i) => [pad + i * stepX, ht - pad - ((p.y - min) / range) * (ht - 2 * pad)])
  const path = coords.map((c, i) => (i ? 'L' : 'M') + c[0].toFixed(1) + ' ' + c[1].toFixed(1)).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${ht}`} style={{ width: '100%', height: 80 }}>
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((c, i) => <circle key={i} cx={c[0]} cy={c[1]} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />)}
      <text x={pad} y={12} fontSize="10" fill="#5d6f66">{points[0].y}{suffix}</text>
      <text x={w - pad} y={12} fontSize="10" fill={color} textAnchor="end" fontWeight="700">{points[points.length - 1].y}{suffix}</text>
    </svg>
  )
}

function r1pt(n) { return Math.round((n || 0) * 10) / 10 }

function PtAssessments({ assessments }) {
  if (!assessments.length) return (
    <div className="empty">
      <Activity size={44} style={{ opacity: .25, marginBottom: 12 }} />
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, marginBottom: 6 }}>Nenhuma avaliação</div>
      <p>Seu nutricionista ainda não registrou avaliações físicas.</p>
    </div>
  )

  const sorted = [...assessments].sort((a, b) => (a.date || '').localeCompare(b.date || ''))

  // Pontos para os gráficos
  const bfPoints  = sorted.map(a => ({ y: r1pt(a.results?.bf  ?? (+a.bioFat || 0)) }))
  const lmPoints  = sorted.map(a => {
    const weight = +a.weight || 0
    const bf = a.results?.bf ?? (+a.bioFat || 0)
    const lm = a.results?.leanMass ?? (weight - weight * bf / 100)
    return { y: r1pt(lm) }
  })

  const SKINFOLD_LABELS = {
    peitoral: 'Peitoral', axilarMedia: 'Axilar Média', triceps: 'Tríceps',
    subescapular: 'Subescapular', abdominal: 'Abdominal', supraIliaca: 'Supra-ilíaca', coxa: 'Coxa'
  }
  const skinfoldKeys = Object.keys(SKINFOLD_LABELS).filter(k =>
    sorted.some(a => a.skinfolds?.[k] != null && +a.skinfolds[k] > 0)
  )

  const last = sorted[sorted.length - 1]
  const lastBf = last ? (last.results?.bf ?? (+last.bioFat || 0)) : 0
  const lastWeight = last ? +last.weight || 0 : 0
  const lastLm = last ? (last.results?.leanMass ?? (lastWeight - lastWeight * lastBf / 100)) : 0

  const bfColor = lastBf > 25 ? '#e5484d' : lastBf > 18 ? '#f1932c' : '#1f9d63'

  return (
    <>
      <h1 className="title">Minhas <span>Avaliações</span></h1>
      <p className="sub">Histórico de avaliações físicas e evolução corporal</p>

      {/* Gráficos de evolução */}
      {sorted.length > 1 && (
        <>
          <div className="chartwrap" style={{ marginTop: 20 }}>
            <div className="chartcard">
              <div className="ct"><Percent size={15} style={{ color: '#e5484d' }} /> % Gordura</div>
              <PtMiniChart points={bfPoints} color="#e5484d" suffix="%" />
            </div>
            <div className="chartcard">
              <div className="ct"><Scale size={15} style={{ color: '#1f9d63' }} /> Massa Magra (kg)</div>
              <PtMiniChart points={lmPoints} color="#1f9d63" suffix=" kg" />
            </div>
          </div>
          {skinfoldKeys.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 10 }}>Evolução das Dobras Cutâneas (mm)</div>
              <div className="chartwrap">
                {skinfoldKeys.map(k => (
                  <div key={k} className="chartcard">
                    <div className="ct">{SKINFOLD_LABELS[k]}</div>
                    <PtMiniChart
                      points={sorted.map(a => ({ y: r1pt(+(a.skinfolds?.[k] || 0)) }))}
                      color="#2d7ff9"
                      suffix=" mm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Cards individuais */}
      <div style={{ marginTop: sorted.length > 1 ? 0 : 20 }}>
        {[...sorted].reverse().map((a, idx) => {
const bf = a.results?.bf ?? (+a.bioFat || 0)
          const lm = a.results?.leanMass ?? (lastWeight - lastWeight * bf / 100)
          const bfCol = bf > 32 ? '#e5484d' : bf > 25 ? '#f1932c' : '#1f9d63'
          return (
            <div key={a.id} className="panel" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 17 }}>
                  Avaliação de {a.date ? new Date(a.date + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
                </h2>
                {idx === 0 && (
                  <span style={{ fontSize: 11.5, background: 'var(--green-soft)', color: 'var(--green-d)', padding: '3px 10px', borderRadius: 999, fontWeight: 700 }}>
                    Mais recente
                  </span>
                )}
              </div>
              <div className="resgrid">
                {[
                  { l: 'Peso',       v: a.weight ? `${a.weight}` : '—', u: 'kg', color: 'var(--ink)' },
                  { l: 'Altura',     v: a.height ? `${a.height}` : '—', u: 'cm', color: 'var(--ink)' },
                  { l: '% Gordura',  v: bf ? r1pt(bf).toFixed(1) : '—', u: '%',  color: bfCol },
                  { l: 'Massa Magra', v: lm ? r1pt(lm).toFixed(1) : '—', u: ' kg', color: '#1f9d63' },
                ].map(b => (
                  <div key={b.l} className="rescard">
                    <div className="rl">{b.l}</div>
                    <div className="rv" style={{ color: b.color }}>{b.v}<span style={{ fontSize: 14 }}>{b.u}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ══ EXAMES — agrupados por marcador com evolução ══════════════ */
function PtExams({ exams, patient }) {
  const [openGroup, setOpenGroup] = useState(null)

  if (!exams || !exams.length) return (
    <div className="empty">
      <FlaskConical size={44} style={{ opacity: .25, marginBottom: 12 }} />
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, marginBottom: 6 }}>Nenhum exame</div>
      <p>Seu nutricionista ainda não registrou exames laboratoriais.</p>
    </div>
  )

  // Agrupamento por nome do exame
  const groups = {}
  for (const e of exams) {
    const key = e.name || 'Sem nome'
    if (!groups[key]) groups[key] = { name: key, unit: e.unit || '', ref: e.ref || '', note: e.note || '', entries: [] }
    groups[key].entries.push(e)
  }
  for (const g of Object.values(groups)) {
    g.entries.sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  }
  const groupList = Object.values(groups).sort((a, b) => a.name.localeCompare(b.name))

  return (
    <>
      <h1 className="title">Meus <span>Exames</span></h1>
      <p className="sub">Resultados e evolução dos seus exames laboratoriais</p>
      <div style={{ marginTop: 20 }}>
        {groupList.map(g => {
          const isOpen = openGroup === g.name
          const last = g.entries[g.entries.length - 1]
          const statusColor = last?.status === 'Normal' ? 'var(--green)' : last?.status === 'Alto' ? '#e5484d' : '#2d7ff9'
          const statusBg    = last?.status === 'Normal' ? 'var(--green-soft)' : last?.status === 'Alto' ? '#fde8e9' : '#e1ecfe'
          const chartPoints = g.entries.map(e => ({ y: r1pt(+e.result || 0) }))

          return (
            <div key={g.name} className="panel" style={{ marginBottom: 14, padding: 0, overflow: 'hidden' }}>
              {/* Cabeçalho do grupo */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', cursor: 'pointer', background: isOpen ? 'var(--green-soft)' : '#fff', transition: '.15s' }}
                onClick={() => setOpenGroup(isOpen ? null : g.name)}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: isOpen ? 'var(--green)' : 'var(--green-soft)', display: 'grid', placeItems: 'center', color: isOpen ? '#fff' : 'var(--green-d)', transition: '.15s', flexShrink: 0 }}>
                  <FlaskConical size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700 }}>{g.name} {g.unit ? <span style={{ color: 'var(--ink-soft)', fontSize: 12, fontWeight: 400 }}>({g.unit})</span> : ''}</div>
                  <div style={{ color: 'var(--ink-soft)', fontSize: 13, marginTop: 2 }}>
                    {g.entries.length} medição(ões)
                    {last?.date && <span> · última: {new Date(last.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 20 }}>{last?.result} <small style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{g.unit}</small></div>
                </div>
                {isOpen ? <ChevronUp size={18} style={{ color: 'var(--ink-soft)', flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: 'var(--ink-soft)', flexShrink: 0 }} />}
              </div>

              {/* Detalhes expandidos */}
              {isOpen && (
                <div style={{ padding: '16px 20px', borderTop: '1px solid var(--line)' }}>
                  {/* Gráfico de evolução */}
                  {g.entries.length > 1 && (
                    <div className="chartcard" style={{ marginBottom: 16 }}>
                      <div className="ct" style={{ marginBottom: 8 }}>
                        <TrendingUp size={14} style={{ color: 'var(--green)' }} /> Evolução — {g.name}
                        {g.ref && <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--ink-soft)', fontWeight: 400 }}>ref: {g.ref} {g.unit}</span>}
                      </div>
                      <PtMiniChart points={chartPoints} color={statusColor} suffix={g.unit ? ` ${g.unit}` : ''} />
                    </div>
                  )}

                  {/* Histórico de medições */}
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Histórico</div>
                  {[...g.entries].reverse().map((e, i) => {
                    const eColor = e.status === 'Normal' ? 'var(--green)' : e.status === 'Alto' ? '#e5484d' : '#2d7ff9'
                    const eBg    = e.status === 'Normal' ? 'var(--green-soft)' : e.status === 'Alto' ? '#fde8e9' : '#e1ecfe'
                    return (
                      <div key={e.id || i} className="exrow">
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500 }}>
                            {e.date ? new Date(e.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                          </div>
                        </div>
                        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 17 }}>
                          {e.result} <small style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{g.unit}</small>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ── Helpers ─────────────────────────────────────────────────── */
function fmtDate(d) {
  if (!d) return '—'
  const hasTime = d.includes('T') && d.length > 10
  const dt = hasTime ? new Date(d) : new Date(d + 'T12:00:00')
  if (isNaN(dt)) return d
  const dateStr = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  if (hasTime) {
    const timeStr = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    return `${dateStr} às ${timeStr}`
  }
  return dateStr
}
