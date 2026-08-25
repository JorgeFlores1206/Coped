import { useState, type FormEvent } from 'react';
import { signIn } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import './LoginPage.css';

export function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isSupabaseConfigured) return;
    setLoading(true); setError('');
    const { error: loginError } = await signIn(email, password);
    setLoading(false);
    if (loginError) setError(loginError.message); else onSuccess();
  }

  return <section className="login-shell"><div className="login-intro"><span className="login-mark">C</span><p className="eyebrow">CONTROL OPERATIVO</p><h2>Todo el flujo,<br /><em>en movimiento.</em></h2><p className="intro-copy">Coordina pedidos, sectores y tiempos desde un solo lugar.</p><div className="intro-line"><span />Seguimiento claro en cada estación</div></div><div className="login-panel"><p className="eyebrow">ACCESO AL SISTEMA</p><h3>Bienvenido de nuevo</h3><p className="muted">Ingresa tus datos para continuar.</p>
    {!isSupabaseConfigured && <p className="notice">Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para habilitar el inicio de sesión.</p>}
    {error && <p role="alert" className="error">{error}</p>}
    <form className="form" onSubmit={handleSubmit}>
      <label>Correo electrónico<input type="email" placeholder="nombre@empresa.com" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      <label>Contraseña<input type="password" placeholder="Introduce tu contraseña" value={password} onChange={e => setPassword(e.target.value)} required /></label>
      <button className="login-button" type="submit" disabled={loading || !isSupabaseConfigured}>{loading ? 'Ingresando...' : 'Ingresar al sistema'}<span aria-hidden="true">→</span></button>
    </form>
  </div></section>;
}
