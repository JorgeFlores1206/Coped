import { useState, type FormEvent } from 'react';
import { signIn } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabaseClient';

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

  return <section className="card"><h2>Iniciar sesión</h2>
    {!isSupabaseConfigured && <p className="notice">Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para habilitar el inicio de sesión.</p>}
    {error && <p role="alert">{error}</p>}
    <form className="form" onSubmit={handleSubmit}>
      <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit" disabled={loading || !isSupabaseConfigured}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
    </form>
  </section>;
}
