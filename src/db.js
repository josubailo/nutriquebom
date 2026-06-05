/**
 * db.js — todas as operações com o Supabase
 * O App.jsx chama essas funções ao invés de mexer direto no banco.
 */
import { supabase } from './supabase'

// ── Carrega todos os dados do nutricionista ──────────────────
export async function loadAll(nutritionistId) {
  const [
    { data: patients },
    { data: diets },
    { data: assessments },
    { data: exams },
    { data: anamneseRows },
    { data: appointments },
    { data: customFoods },
    { data: settings },
  ] = await Promise.all([
    supabase.from('patients').select('*').eq('nutritionist_id', nutritionistId).order('created_at', { ascending: false }),
    supabase.from('diets').select('*').eq('nutritionist_id', nutritionistId),
    supabase.from('assessments').select('*').eq('nutritionist_id', nutritionistId),
    supabase.from('exams').select('*').eq('nutritionist_id', nutritionistId),
    supabase.from('anamnese').select('*').eq('nutritionist_id', nutritionistId),
    supabase.from('appointments').select('*').eq('nutritionist_id', nutritionistId),
    supabase.from('custom_foods').select('*').eq('nutritionist_id', nutritionistId),
    supabase.from('nutritionist_settings').select('*').eq('id', nutritionistId).maybeSingle(),
  ])

  // Reconstrói o shape que o App.jsx espera
  const dietsMap = {}
  for (const d of diets || []) {
    if (!dietsMap[d.patient_id]) dietsMap[d.patient_id] = []
    dietsMap[d.patient_id].push({ ...d.data, id: d.id, name: d.name, createdAt: d.created_at })
  }

  const assessmentsMap = {}
  for (const a of assessments || []) {
    if (!assessmentsMap[a.patient_id]) assessmentsMap[a.patient_id] = []
    assessmentsMap[a.patient_id].push({ ...a.data, id: a.id })
  }

  const examsMap = {}
  for (const e of exams || []) {
    if (!examsMap[e.patient_id]) examsMap[e.patient_id] = []
    examsMap[e.patient_id].push({ ...e.data, id: e.id })
  }

  const anamneseMap = {}
  for (const a of anamneseRows || []) {
    anamneseMap[a.patient_id] = a.answers
  }

  return {
    patients: (patients || []).map(rowToPatient),
    diets: dietsMap,
    assessments: assessmentsMap,
    exams: examsMap,
    anamnese: anamneseMap,
    appointments: (appointments || []).map(a => ({ ...a.data, id: a.id })),
    customFoods: (customFoods || []).map(f => ({ ...f.data, id: f.id })),
    profile: settings?.profile_data || {},
    anamneseTemplate: settings?.anamnese_template || null,
  }
}

// ── Pacientes ────────────────────────────────────────────────
export async function insertPatient(nutritionistId, patient) {
  await supabase.from('patients').insert({
    id:              patient.id,
    nutritionist_id: nutritionistId,
    user_id:         patient.userId || null,
    name:            patient.name,
    email:           patient.email || null,
    phone:           patient.phone || null,
    birth:           patient.birth || null,
    sex:             patient.sex  || null,
    notes:           patient.notes || null,
    created_at:      patient.createdAt,
  })
}

export async function updatePatient(nutritionistId, patient) {
  await supabase.from('patients').update({
    name:  patient.name,
    email: patient.email || null,
    phone: patient.phone || null,
    birth: patient.birth || null,
    sex:   patient.sex   || null,
    notes: patient.notes || null,
  }).eq('id', patient.id).eq('nutritionist_id', nutritionistId)
}

export async function deletePatient(nutritionistId, patientId) {
  await supabase.from('patients').delete()
    .eq('id', patientId).eq('nutritionist_id', nutritionistId)
}

// ── Dietas ───────────────────────────────────────────────────
export async function upsertDiet(nutritionistId, patientId, diet) {
  const { id, name, createdAt, ...rest } = diet
  await supabase.from('diets').upsert({
    id,
    patient_id:      patientId,
    nutritionist_id: nutritionistId,
    name:            name || 'Plano',
    created_at:      createdAt || Date.now(),
    data:            rest,
  })
}

export async function deleteDiet(nutritionistId, dietId) {
  await supabase.from('diets').delete()
    .eq('id', dietId).eq('nutritionist_id', nutritionistId)
}

// ── Avaliações físicas ───────────────────────────────────────
export async function upsertAssessment(nutritionistId, patientId, asmt) {
  const { id, date, ...rest } = asmt
  await supabase.from('assessments').upsert({
    id,
    patient_id:      patientId,
    nutritionist_id: nutritionistId,
    date:            date || null,
    data:            { ...rest, id, date },
  })
}

export async function deleteAssessment(nutritionistId, assessmentId) {
  await supabase.from('assessments').delete()
    .eq('id', assessmentId).eq('nutritionist_id', nutritionistId)
}

// ── Exames ───────────────────────────────────────────────────
export async function insertExam(nutritionistId, patientId, exam) {
  await supabase.from('exams').insert({
    id:              exam.id,
    patient_id:      patientId,
    nutritionist_id: nutritionistId,
    created_at:      Date.now(),
    data:            exam,
  })
}

export async function deleteExam(nutritionistId, examId) {
  await supabase.from('exams').delete()
    .eq('id', examId).eq('nutritionist_id', nutritionistId)
}

// ── Anamnese ─────────────────────────────────────────────────
export async function upsertAnamnese(nutritionistId, patientId, answers) {
  await supabase.from('anamnese').upsert({
    patient_id:      patientId,
    nutritionist_id: nutritionistId,
    answers,
    updated_at:      new Date().toISOString(),
  })
}

// ── Agendamentos ─────────────────────────────────────────────
export async function insertAppointment(nutritionistId, appt) {
  await supabase.from('appointments').insert({
    id:              appt.id,
    nutritionist_id: nutritionistId,
    patient_id:      appt.patientId || null,
    data:            appt,
  })
}

// ── Alimentos customizados ───────────────────────────────────
export async function insertFood(nutritionistId, food) {
  await supabase.from('custom_foods').insert({
    id:              food.id,
    nutritionist_id: nutritionistId,
    data:            food,
  })
}

export async function updateFood(nutritionistId, food) {
  await supabase.from('custom_foods').update({ data: food })
    .eq('id', food.id).eq('nutritionist_id', nutritionistId)
}

export async function deleteFood(nutritionistId, foodId) {
  await supabase.from('custom_foods').delete()
    .eq('id', foodId).eq('nutritionist_id', nutritionistId)
}

// ── Configurações ────────────────────────────────────────────
export async function upsertSettings(nutritionistId, { profile, anamneseTemplate }) {
  await supabase.from('nutritionist_settings').upsert({
    id:                nutritionistId,
    profile_data:      profile,
    anamnese_template: anamneseTemplate || null,
  })
}

// ── Portal do paciente ───────────────────────────────────────
export async function loadPatientData(userId) {
  const { data: patient } = await supabase
    .from('patients').select('*').eq('user_id', userId).maybeSingle()

  if (!patient) return null

  const [
    { data: diets },
    { data: assessments },
    { data: exams },
    { data: anamneseRow },
    { data: messages },
    { data: videoRequests },
    { data: photos },
  ] = await Promise.all([
    supabase.from('diets').select('*').eq('patient_id', patient.id),
    supabase.from('assessments').select('*').eq('patient_id', patient.id),
    supabase.from('exams').select('*').eq('patient_id', patient.id),
    supabase.from('anamnese').select('*').eq('patient_id', patient.id).maybeSingle(),
    supabase.from('patient_messages').select('*').eq('patient_id', patient.id).order('created_at', { ascending: false }),
    supabase.from('patient_video_requests').select('*').eq('patient_id', patient.id).order('created_at', { ascending: false }),
    supabase.from('patient_photos').select('*').eq('patient_id', patient.id).order('created_at', { ascending: false }),
  ])

  return {
    patient:        rowToPatient(patient),
    diets:          (diets || []).map(d => ({ ...d.data, id: d.id, name: d.name, createdAt: d.created_at })),
    assessments:    (assessments || []).map(a => ({ ...a.data, id: a.id })),
    exams:          (exams || []).map(e => ({ ...e.data, id: e.id })),
    anamnese:       anamneseRow?.answers || {},
    messages:       messages || [],
    videoRequests:  videoRequests || [],
    photos:         photos || [],
  }
}

// ── Mensagens do paciente ────────────────────────────────────
export async function submitPatientMessage(patientId, nutritionistId, content) {
  const { data, error } = await supabase.from('patient_messages').insert({
    patient_id:      patientId,
    nutritionist_id: nutritionistId,
    content,
  }).select().single()
  return { data, error }
}

export async function replyToMessage(messageId, reply) {
  await supabase.from('patient_messages').update({
    reply,
    replied_at: new Date().toISOString(),
  }).eq('id', messageId)
}

export async function loadPatientMessages(nutritionistId) {
  const { data } = await supabase.from('patient_messages')
    .select('*').eq('nutritionist_id', nutritionistId).order('created_at', { ascending: false })
  return data || []
}

// ── Solicitações de vídeo chamada ────────────────────────────
export async function submitVideoRequest(patientId, nutritionistId, message, preferredDate) {
  const { data, error } = await supabase.from('patient_video_requests').insert({
    patient_id:      patientId,
    nutritionist_id: nutritionistId,
    message,
    preferred_date:  preferredDate,
    status:          'pending',
  }).select().single()
  return { data, error }
}

export async function updateVideoRequestStatus(requestId, status) {
  await supabase.from('patient_video_requests').update({ status }).eq('id', requestId)
}

export async function loadVideoRequests(nutritionistId) {
  const { data } = await supabase.from('patient_video_requests')
    .select('*').eq('nutritionist_id', nutritionistId).order('created_at', { ascending: false })
  return data || []
}

// ── Fotos dos pacientes ──────────────────────────────────────
export async function uploadPatientPhoto(patientId, nutritionistId, file, caption) {
  const path = `${patientId}/${Date.now()}_${file.name}`
  const { error: upErr } = await supabase.storage.from('patient-photos').upload(path, file)
  if (upErr) return { error: upErr }

  const { data: { publicUrl } } = supabase.storage.from('patient-photos').getPublicUrl(path)

  const { data, error } = await supabase.from('patient_photos').insert({
    patient_id:      patientId,
    nutritionist_id: nutritionistId,
    storage_path:    path,
    public_url:      publicUrl,
    caption,
  }).select().single()
  return { data, error }
}

export async function deletePatientPhoto(photoId, storagePath) {
  if (storagePath) {
    await supabase.storage.from('patient-photos').remove([storagePath])
  }
  const { error } = await supabase.from('patient_photos').delete().eq('id', photoId)
  return { error }
}

export async function loadPatientPhotos(nutritionistId, patientId) {
  const q = supabase.from('patient_photos').select('*').eq('nutritionist_id', nutritionistId)
  if (patientId) q.eq('patient_id', patientId)
  const { data } = await q.order('created_at', { ascending: false })
  return data || []
}

// ── Próxima consulta ─────────────────────────────────────────
export async function setNextAppointment(nutritionistId, patientId, nextAppointment) {
  await supabase.from('patients').update({ next_appointment: nextAppointment })
    .eq('id', patientId).eq('nutritionist_id', nutritionistId)
}

// ── Helper interno ───────────────────────────────────────────
function rowToPatient(p) {
  return {
    id:              p.id,
    name:            p.name,
    email:           p.email,
    phone:           p.phone,
    birth:           p.birth,
    sex:             p.sex,
    notes:           p.notes,
    createdAt:       p.created_at,
    userId:          p.user_id,
    nutritionistId:  p.nutritionist_id,
    nextAppointment: p.next_appointment,
  }
}
