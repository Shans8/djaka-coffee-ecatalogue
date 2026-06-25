import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';

function ModeOffline() {
  const [online, setOnline] = useState(navigator.onLine); const [note, setNote] = useState(localStorage.getItem('offlineNote') || '');
  useEffect(() => { const on = () => setOnline(true); const off = () => setOnline(false); window.addEventListener('online', on); window.addEventListener('offline', off); return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); }; }, []);
  const save = () => { localStorage.setItem('offlineNote', note); alert('Aktivitas sementara disimpan di localStorage.'); };
  const sync = () => { if (!online) return alert('Koneksi masih offline.'); localStorage.removeItem('offlineNote'); setNote(''); alert('Simulasi sinkronisasi berhasil.'); };
  return <AppLayout role="sales" title="Mode Offline / Status Koneksi"><div className="grid-2"><div className="panel status-panel"><span className={online ? 'connection online' : 'connection offline'}>{online ? 'Online' : 'Offline'}</span><h2>{online ? 'Koneksi tersedia' : 'Koneksi tidak tersedia'}</h2><p>{online ? 'Data dapat diproses langsung ke server.' : 'Data akan disimpan sementara dan disinkronkan saat koneksi kembali tersedia.'}</p></div><div className="panel form-grid"><p className="page-kicker">Local Storage</p><h2>Catatan Aktivitas Sementara</h2><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Contoh: pelanggan seminar minta paket budget Rp25.000" /><div className="actions"><button className="btn btn-primary" onClick={save}>Simpan Offline</button><button className="btn btn-outline" onClick={sync}>Sinkronkan</button></div></div></div></AppLayout>;
}
export default ModeOffline;
