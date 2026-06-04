import React, { useState } from 'react'
import { supabase } from './supabase'
import { Utensils, Mail, Lock, ArrowRight, Loader } from 'lucide-react'

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');

.login-wrap * { box-sizing: border-box; }
.login-wrap {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: 'DM Sans', sans-serif;
  background: #f4f6f3;
}
@media (max-width: 700px) {
  .login-wrap { grid-template-columns: 1fr; }
  .login-left  { display: none; }
}
.login-left {
  background: linear-gradient(160deg, #1f9d63 0%, #157a4c 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 52px;
  color: #fff;
}
.login-left h1 {
  font-family: 'Fraunces', serif;
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 16px;
}
.login-left p {
  font-size: 17px;
  opacity: .85;
  line-height: 1.6;
  margin: 0;
  max-width: 340px;
}
.login-left .logo {
  width: 52px; height: 52px;
  background: rgba(255,255,255,.2);
  border-radius: 16px;
  display: grid; place-items: center;
  margin-bottom: 32px;
}
.login-left .features {
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.login-left .feat {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  opacity: .9;
}
.login-left .feat-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,.6);
  flex-shrink: 0;
}

.login-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}
.login-card {
  width: 100%;
  max-width: 400px;
}
.login-card h2 {
  font-family: 'Fraunces', serif;
  font-size: 28px;
  font-weight: 700;
  color: #16241d;
  margin: 0 0 6px;
}
.login-card .sub {
  color: #5d6f66;
  font-size: 14px;
  margin: 0 0 32px;
}
.login-field {
  position: relative;
  margin-bottom: 16px;
}
.login-field svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #5d6f66;
}
.login-field input {
  width: 100%;
  padding: 13px 14px 13px 44px;
  border: 1px solid #e4e9e3;
  border-radius: 12px;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  color: #16241d;
  background: #fff;
  outline: none;
  transition: .15s;
}
.login-field input:focus {
  border-color: #1f9d63;
  box-shadow: 0 0 0 3px #e7f4ec;
}
.login-btn {
  width: 100%;
  padding: 14px;
  background: #1f9d63;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: .15s;
  margin-top: 8px;
}
.login-btn:hover:not(:disabled) { background: #157a4c; }
.login-btn:disabled { opacity: .6; cursor: default; }
.login-toggle {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #5d6f66;
}
.login-toggle button {
  background: none;
  border: none;
  color: #1f9d63;
  font-weight: 700;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  padding: 0;
}
.login-error {
  background: #fde8e9;
  border: 1px solid #f3c5c6;
  color: #9b1c1f;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 13.5px;
  margin-bottom: 16px;
}
.login-success {
  background: #e7f4ec;
  border: 1px solid #cde8d8;
  color: #157a4c;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 13.5px;
  margin-bottom: 16px;
}
.login-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  color: #5d6f66;
  font-size: 12px;
}
.login-divider::before, .login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e4e9e3;
}
`

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'reset'
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    if (error) setError(error.message === 'Invalid login credentials'
      ? 'E-mail ou senha incorretos.'
      : error.message)
    setLoading(false)
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: window.location.origin,
    })
    if (error) setError(error.message)
    else setSuccess('E-mail de redefinição enviado! Verifique sua caixa de entrada.')
    setLoading(false)
  }

  return (
    <div className="login-wrap">
      <style>{STYLE}</style>

      {/* Lado esquerdo — branding */}
      <div className="login-left">
        <div className="logo"><Utensils size={26} color="#fff" /></div>
        <h1>Nutriquébom</h1>
        <p>Plataforma completa para nutricionistas gerenciarem seus pacientes com eficiência.</p>
        <div className="features">
          {['Montagem de planos alimentares', 'Avaliação física e dobras cutâneas', 'Acompanhamento de exames laboratoriais', 'Anamnese nutricional personalizada', 'Acesso do paciente à sua dieta'].map(f => (
            <div className="feat" key={f}>
              <div className="feat-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="login-right">
        <div className="login-card">

          {mode === 'login' && (
            <>
              <h2>Entrar</h2>
              <p className="sub">Bem-vindo de volta. Acesse sua conta.</p>
              {error   && <div className="login-error">{error}</div>}
              {success && <div className="login-success">{success}</div>}
              <form onSubmit={handleLogin}>
                <div className="login-field">
                  <Mail size={18} />
                  <input type="email" placeholder="Seu e-mail" value={form.email}
                    onChange={e => up('email', e.target.value)} required />
                </div>
                <div className="login-field">
                  <Lock size={18} />
                  <input type="password" placeholder="Senha" value={form.password}
                    onChange={e => up('password', e.target.value)} required />
                </div>
                <div style={{ textAlign: 'right', marginBottom: 8 }}>
                  <button type="button" onClick={() => { setMode('reset'); setError(''); setSuccess('') }}
                    style={{ background: 'none', border: 'none', color: '#1f9d63', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Esqueci minha senha
                  </button>
                </div>
                <button className="login-btn" disabled={loading}>
                  {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <><ArrowRight size={18} /> Entrar</>}
                </button>
              </form>
              <div className="login-toggle">
                <button onClick={() => { setMode('reset'); setError(''); setSuccess('') }}>Esqueceu a senha?</button>
              </div>
            </>
          )}

          {mode === 'reset' && (
            <>
              <h2>Redefinir senha</h2>
              <p className="sub">Enviaremos um link para o seu e-mail.</p>
              {error   && <div className="login-error">{error}</div>}
              {success && <div className="login-success">{success}</div>}
              <form onSubmit={handleReset}>
                <div className="login-field">
                  <Mail size={18} />
                  <input type="email" placeholder="Seu e-mail" value={form.email}
                    onChange={e => up('email', e.target.value)} required />
                </div>
                <button className="login-btn" disabled={loading}>
                  {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Enviar link'}
                </button>
              </form>
              <div className="login-toggle">
                <button onClick={() => { setMode('login'); setError(''); setSuccess('') }}>← Voltar ao login</button>
              </div>
            </>
          )}

        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
