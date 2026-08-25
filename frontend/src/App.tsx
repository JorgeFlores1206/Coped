import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { LoginPage } from './pages/LoginPage';
import { SectorDashboard } from './pages/SectorDashboard';
import { ImportPage } from './pages/ImportPage';
import { getSession, onAuthStateChange, signOut } from './services/authService';
import { getUserSector } from './services/ordersService';

type Page = 'login' | 'dashboard' | 'import';

export default function App() {
  const [page, setPage] = useState<Page>('login'); const [session, setSession] = useState<Session | null>(null); const [sectorId, setSectorId] = useState<number | null>(null); const [profileError, setProfileError] = useState(''); const [loading, setLoading] = useState(true);
  useEffect(() => { let mounted = true; void getSession().then(({ data }) => { if (mounted) { setSession(data.session); setLoading(false); } }); const { data: { subscription } } = onAuthStateChange(async (_event, nextSession) => { setSession(nextSession); setLoading(false); }); return () => { mounted = false; subscription.unsubscribe(); }; }, []);
  useEffect(() => { if (!session?.user.id) { setSectorId(null); setProfileError(''); return; } let mounted = true; setProfileError(''); void getUserSector(session.user.id).then((sector) => { if (mounted) { setSectorId(sector); setPage('dashboard'); } }).catch((error: unknown) => { if (mounted) setProfileError(error instanceof Error ? error.message : 'No se pudo cargar el perfil.'); }); return () => { mounted = false; }; }, [session]);
  async function handleSignOut() { await signOut(); setPage('login'); }
  const authenticated = Boolean(session && sectorId);
  return <div className="app"><header className="topbar"><h1 className="brand">COPEd</h1><nav className="nav">{!authenticated ? <button onClick={() => setPage('login')}>Ingresar</button> : <><button className={page === 'dashboard' ? 'active' : ''} onClick={() => setPage('dashboard')}>Sectores</button>{sectorId === 1 && <button className={page === 'import' ? 'active' : ''} onClick={() => setPage('import')}>Importar</button>}<button className="secondary" onClick={() => void handleSignOut()}>Salir</button></>}</nav></header><main className="container">{loading ? <section className="card">Cargando sesión...</section> : !session ? <LoginPage onSuccess={() => setPage('dashboard')} /> : profileError ? <section className="card"><p role="alert" className="error">{profileError}</p></section> : sectorId && <>{page === 'import' && sectorId === 1 ? <ImportPage /> : <SectorDashboard sectorId={sectorId} />}</>}</main></div>;
}
