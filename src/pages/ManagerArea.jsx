import React, { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, Megaphone, AlertTriangle, Users, Plus, Trash2, CheckCircle, Clock, Loader2, Building2 } from 'lucide-react';
import { Card, Badge, ButtonPrimary } from '../components/UiKit';
import { supabase } from '../services/supabase';

// --- SUB-COMPONENTES ---

const DashboardHome = ({ stats }) => (
  <div className="animate-fade-in space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-t-4 border-t-blue-500">
        <div className="flex justify-between items-start mb-4"><div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Users size={24}/></div></div>
        <p className="text-slate-400 text-sm font-medium">Moradores</p>
        <p className="text-3xl font-bold text-white tracking-tight">{stats.totalUsers}</p>
        <p className="text-xs text-slate-500 mt-2">Neste condomínio.</p>
      </Card>
      
      <Card className="border-t-4 border-t-yellow-500">
        <div className="flex justify-between items-start mb-4"><div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><AlertTriangle size={24}/></div></div>
        <p className="text-slate-400 text-sm font-medium">Ocorrências Abertas</p>
        <p className="text-3xl font-bold text-white tracking-tight">{stats.openOccurrences}</p>
        <p className="text-xs text-slate-500 mt-2">Pendentes de resolução.</p>
      </Card>

      <Card className="border-t-4 border-t-emerald-500">
        <div className="flex justify-between items-start mb-4"><div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><Megaphone size={24}/></div></div>
        <p className="text-slate-400 text-sm font-medium">Avisos Ativos</p>
        <p className="text-3xl font-bold text-white tracking-tight">{stats.activeNotices}</p>
        <p className="text-xs text-slate-500 mt-2">No mural do prédio.</p>
      </Card>
    </div>
  </div>
);

const NoticesManager = ({ notices, fetchNotices, fetchStats, managerProfile }) => {
    const [newNotice, setNewNotice] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(false);

    const handlePublish = async () => {
        if(!newNotice.title || !newNotice.content) return alert("Preencha título e conteúdo.");
        if(!managerProfile?.condo_id) return alert("Erro: Você não está vinculado a um condomínio!");
        
        try {
            setLoading(true);
            const { error } = await supabase.from('notices').insert([{
                title: newNotice.title,
                content: newNotice.content,
                date: new Date().toLocaleDateString('pt-BR'),
                likes: 0,
                type: 'info',
                condo_id: managerProfile.condo_id // <--- VÍNCULO IMPORTANTE
            }]);

            if(error) throw error;
            
            alert("Aviso publicado para seu condomínio!");
            setNewNotice({ title: '', content: '' });
            fetchNotices(); 
            fetchStats();   
        } catch (error) { alert("Erro: " + error.message); } 
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Apagar este aviso?")) return;
        try {
            const { error } = await supabase.from('notices').delete().eq('id', id);
            if(error) throw error;
            fetchNotices();
            fetchStats();
        } catch (error) { alert("Erro: " + error.message); }
    };

    return (
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Card className="sticky top-24 border border-slate-700 bg-slate-800/50">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Plus size={18} className="text-emerald-400"/> Novo Comunicado</h3>
                    <div className="space-y-4">
                        <input value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} placeholder="Título" className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:border-emerald-500 outline-none"/>
                        <textarea value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} placeholder="Mensagem..." rows="6" className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:border-emerald-500 outline-none"/>
                        <ButtonPrimary onClick={handlePublish} disabled={loading}>{loading ? <Loader2 className="animate-spin"/> : 'PUBLICAR'}</ButtonPrimary>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-white mb-4">Mural do Condomínio</h3>
                {notices.length === 0 ? (
                    <div className="text-center text-slate-500 py-10 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">Nenhum aviso local publicado.</div>
                ) : (
                    notices.map(notice => (
                        <Card key={notice.id} className={`group transition-colors ${notice.condo_id ? 'border-blue-500/30' : 'border-red-500/30 border-l-4 border-l-red-500'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-white text-lg">{notice.title}</h4>
                                        {!notice.condo_id && <Badge type="error">Broadcast Admin</Badge>}
                                    </div>
                                    <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded mt-1 inline-block">{notice.date}</span>
                                </div>
                                {notice.condo_id && <button onClick={() => handleDelete(notice.id)} className="text-slate-600 hover:text-red-500 p-2 transition-colors"><Trash2 size={18}/></button>}
                            </div>
                            <p className="text-slate-300 mt-3 text-sm leading-relaxed">{notice.content}</p>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

const OccurrencesManager = ({ occurrences, onUpdate }) => {
    const handleStatusChange = async (id, newStatus) => {
        try {
            const { error } = await supabase.from('occurrences').update({ status: newStatus }).eq('id', id);
            if(error) throw error;
            onUpdate();
        } catch (error) { alert("Erro: " + error.message); }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-white">Ocorrências do Prédio</h2>
            <div className="grid gap-4">
                {occurrences.length === 0 ? (
                    <div className="text-center text-slate-500 py-10 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">Tudo tranquilo por aqui.</div>
                ) : (
                    occurrences.map(occ => (
                        <Card key={occ.id} className={`border-l-4 ${occ.status === 'open' ? 'border-l-red-500' : occ.status === 'progress' ? 'border-l-yellow-500' : 'border-l-emerald-500'}`}>
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge type={occ.status === 'open' ? 'error' : occ.status === 'progress' ? 'warning' : 'success'}>
                                            {occ.status === 'open' ? 'Aberto' : occ.status === 'progress' ? 'Em Andamento' : 'Resolvido'}
                                        </Badge>
                                        <span className="text-slate-500 text-xs font-bold uppercase">{occ.type}</span>
                                        <span className="text-slate-600 text-xs">• {occ.date}</span>
                                    </div>
                                    <h3 className="font-bold text-white text-lg">{occ.title}</h3>
                                    <p className="text-slate-300 text-sm mt-1">{occ.description}</p>
                                    <div className="flex gap-4 mt-3">
                                        <p className="text-slate-500 text-xs font-bold flex items-center gap-1"><Users size={12}/> Unidade: {occ.unit}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-start md:self-center bg-slate-900 p-2 rounded-xl border border-slate-800">
                                    <button onClick={() => handleStatusChange(occ.id, 'progress')} disabled={occ.status === 'progress'} title="Marcar Em Andamento" className={`p-2 rounded-lg transition-colors ${occ.status === 'progress' ? 'bg-yellow-500 text-white' : 'text-slate-400 hover:bg-yellow-500/20 hover:text-yellow-500'}`}><Clock size={18}/></button>
                                    <button onClick={() => handleStatusChange(occ.id, 'resolved')} disabled={occ.status === 'resolved'} title="Marcar Resolvido" className={`p-2 rounded-lg transition-colors ${occ.status === 'resolved' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-500'}`}><CheckCircle size={18}/></button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

const ManagerArea = ({ onLogout }) => {
  const [screen, setScreen] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [managerProfile, setManagerProfile] = useState(null);
  const [condoData, setCondoData] = useState(null);
  
  const [stats, setStats] = useState({ totalUsers: 0, openOccurrences: 0, activeNotices: 0 });
  const [notices, setNotices] = useState([]);
  const [occurrences, setOccurrences] = useState([]);

  // --- LÓGICA DE CARREGAMENTO ISOLADA ---
  const loadData = async () => {
      try {
        setLoading(true);
        // 1. Pega Perfil + Dados do Condomínio
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) return;

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setManagerProfile(profile);

        if (profile?.condo_id) {
            const { data: condo } = await supabase.from('condominiums').select('*').eq('id', profile.condo_id).single();
            setCondoData(condo);
            
            // 2. Estatísticas (FILTRADAS PELO CONDO_ID)
            const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('condo_id', profile.condo_id);
            const { count: occCount } = await supabase.from('occurrences').select('*', { count: 'exact', head: true }).eq('condo_id', profile.condo_id).eq('status', 'open');
            const { count: noticesCount } = await supabase.from('notices').select('*', { count: 'exact', head: true }).eq('condo_id', profile.condo_id);
            setStats({ totalUsers: userCount || 0, openOccurrences: occCount || 0, activeNotices: noticesCount || 0 });

            // 3. Listas (FILTRADAS)
            // Avisos: Mostra os do condomínio E os globais (condo_id is null)
            const { data: noticesData } = await supabase.from('notices').select('*').or(`condo_id.eq.${profile.condo_id},condo_id.is.null`).order('created_at', { ascending: false });
            setNotices(noticesData || []);

            // Ocorrências: Só do condomínio
            const { data: occData } = await supabase.from('occurrences').select('*').eq('condo_id', profile.condo_id).order('created_at', { ascending: false });
            setOccurrences(occData || []);
        }

      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  // Wrapper para recarregar dados quando algo mudar
  const refreshData = () => { loadData(); };

  if(loading) return <div className="min-h-screen bg-[#0B1120] flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col">
      <header className="h-20 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#FDFBF7] rounded-xl p-1.5 flex items-center justify-center shadow-lg cursor-pointer" onClick={() => setScreen('dashboard')}><img src="/logo2.png" alt="Logo" className="h-full w-full object-contain" /></div>
            <div>
                <span className="font-bold text-white hidden md:block">Área do Síndico</span>
                {condoData && <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider hidden md:block">{condoData.name}</p>}
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block"><p className="text-white font-bold text-sm">{managerProfile?.name || 'Gestor'}</p><p className="text-emerald-400 text-xs font-bold">Administrador Local</p></div>
            <button onClick={onLogout} className="bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 p-2.5 rounded-full transition-all border border-slate-700"><LogOut size={20}/></button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        {!managerProfile?.condo_id ? (
            <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl text-center text-red-200">
                <AlertTriangle size={48} className="mx-auto mb-4"/>
                <h2 className="text-xl font-bold">Sem Vínculo de Condomínio</h2>
                <p>Sua conta de Síndico não está ligada a nenhum condomínio. Peça ao Admin para configurar seu perfil.</p>
            </div>
        ) : (
            <>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-6">Painel de Controle</h1>
                    <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">
                        <button onClick={() => setScreen('dashboard')} className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${screen === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><LayoutDashboard size={18}/> Visão Geral</button>
                        <button onClick={() => setScreen('notices')} className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${screen === 'notices' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><Megaphone size={18}/> Gerenciar Avisos</button>
                        <button onClick={() => setScreen('occurrences')} className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${screen === 'occurrences' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><AlertTriangle size={18}/> Ocorrências ({stats.openOccurrences})</button>
                    </div>
                </div>
                {screen === 'dashboard' && <DashboardHome stats={stats} />}
                {screen === 'notices' && <NoticesManager notices={notices} fetchNotices={refreshData} fetchStats={refreshData} managerProfile={managerProfile} />}
                {screen === 'occurrences' && <OccurrencesManager occurrences={occurrences} onUpdate={refreshData} />}
            </>
        )}
      </main>
    </div>
  );
};

export default ManagerArea;