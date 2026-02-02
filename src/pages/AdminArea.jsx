import React, { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, Building2, Users, Briefcase, Shield, Trash2, CheckCircle, Plus, Search, X, Loader2, MapPin, BarChart3, Radio, FileText, AlertTriangle } from 'lucide-react';
import { Card, ButtonPrimary } from '../components/UiKit';
import { supabase } from '../services/supabase';

// --- FUNÇÃO DE LOG (GLOBAL PARA O ADMIN) ---
const logAction = async (action, details) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('audit_logs').insert([{
            admin_email: user?.email || 'admin@sistema',
            action: action,
            details: details
        }]);
    } catch (e) { console.error("Erro ao gerar log", e); }
};

// --- COMPONENTES DAS SUB-TELAS ---

// 1. DASHBOARD GERAL
const DashboardOverview = ({ stats }) => (
  <div className="animate-fade-in space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
       <Card className="border-l-4 border-l-blue-500 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><Building2 size={24}/></div>
          <div><p className="text-slate-400 text-xs font-bold uppercase">Condomínios</p><h3 className="text-2xl font-bold text-white">{stats.totalCondos}</h3></div>
       </Card>
       <Card className="border-l-4 border-l-emerald-500 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500"><Users size={24}/></div>
          <div><p className="text-slate-400 text-xs font-bold uppercase">Usuários Totais</p><h3 className="text-2xl font-bold text-white">{stats.totalUsers}</h3></div>
       </Card>
       <Card className="border-l-4 border-l-purple-500 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-full text-purple-500"><Briefcase size={24}/></div>
          <div><p className="text-slate-400 text-xs font-bold uppercase">Prestadores</p><h3 className="text-2xl font-bold text-white">{stats.totalProviders}</h3></div>
       </Card>
       <Card className="border-l-4 border-l-amber-500 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-full text-amber-500"><Shield size={24}/></div>
          <div><p className="text-slate-400 text-xs font-bold uppercase">Síndicos Ativos</p><h3 className="text-2xl font-bold text-white">{stats.totalManagers}</h3></div>
       </Card>
    </div>
    <Card className="h-64 flex flex-col justify-center items-center border-dashed border-2 border-slate-700 bg-slate-800/20">
        <BarChart3 size={48} className="text-slate-600 mb-4"/>
        <p className="text-slate-400 font-medium">Atividade do Sistema (Em tempo real)</p>
    </Card>
  </div>
);

// 2. GESTÃO DE CONDOMÍNIOS
const CondosManager = ({ condos, fetchCondos }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCondo, setNewCondo] = useState({ name: '', address: '', units: '' });

    const handleAddCondo = async () => {
        if(!newCondo.name) return alert("Nome é obrigatório");
        try {
            const { error } = await supabase.from('condominiums').insert([{
                name: newCondo.name,
                address: newCondo.address,
                units_count: parseInt(newCondo.units) || 0,
                status: 'active'
            }]);
            if(error) throw error;
            
            await logAction('ADD_CONDO', `Cadastrou condomínio: ${newCondo.name}`);
            alert("Condomínio cadastrado!");
            setIsModalOpen(false);
            setNewCondo({ name: '', address: '', units: '' });
            fetchCondos();
        } catch (error) { alert(error.message); }
    };

    const handleDeleteCondo = async (condo) => {
        if(!window.confirm("ATENÇÃO: Excluir apaga o registro permanentemente. Continuar?")) return;
        try {
            const { error } = await supabase.from('condominiums').delete().eq('id', condo.id);
            if(error) throw error;
            await logAction('DELETE_CONDO', `Excluiu condomínio: ${condo.name}`);
            fetchCondos();
        } catch (error) { alert(error.message); }
    };

    const toggleStatus = async (condo) => {
        const newStatus = condo.status === 'active' ? 'suspended' : 'active';
        const action = newStatus === 'active' ? 'Ativar' : 'Suspender';
        if(!window.confirm(`Deseja realmente ${action} o acesso do condomínio ${condo.name}?`)) return;

        try {
            const { error } = await supabase.from('condominiums').update({ status: newStatus }).eq('id', condo.id);
            if(error) throw error;
            await logAction(newStatus === 'active' ? 'ACTIVATE_CONDO' : 'SUSPEND_CONDO', `${action} condomínio: ${condo.name}`);
            fetchCondos();
        } catch (error) { alert(error.message); }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Condomínios Parceiros</h2>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"><Plus size={18}/> Novo Condomínio</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {condos.map(condo => (
                    <Card key={condo.id} className={`flex justify-between items-center group transition-colors border-l-4 ${condo.status === 'active' ? 'border-l-emerald-500 border-slate-700' : 'border-l-red-500 border-red-900/30 bg-red-900/10'}`}>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className={`font-bold text-lg flex items-center gap-2 ${condo.status === 'active' ? 'text-white' : 'text-red-400'}`}>
                                    <Building2 size={18} className={condo.status === 'active' ? "text-blue-500" : "text-red-500"}/> {condo.name}
                                </h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${condo.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{condo.status === 'active' ? 'Ativo' : 'Suspenso'}</span>
                            </div>
                            <p className="text-slate-400 text-sm mt-1 flex items-center gap-1"><MapPin size={12}/> {condo.address || 'Sem endereço'}</p>
                            <span className="text-xs text-slate-500 font-bold mt-2 block">{condo.units_count} Unidades estimadas</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => toggleStatus(condo)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all w-24 text-center ${condo.status === 'active' ? 'bg-slate-800 text-slate-300 hover:bg-red-500 hover:text-white' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>{condo.status === 'active' ? 'Suspender' : 'Reativar'}</button>
                            <button onClick={() => handleDeleteCondo(condo)} className="p-1.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex justify-center"><Trash2 size={16}/></button>
                        </div>
                    </Card>
                ))}
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl">
                        <div className="flex justify-between mb-4"><h3 className="text-xl font-bold text-white">Novo Condomínio</h3><button onClick={() => setIsModalOpen(false)}><X className="text-slate-400"/></button></div>
                        <div className="space-y-3">
                            <input placeholder="Nome" value={newCondo.name} onChange={e => setNewCondo({...newCondo, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-xl"/>
                            <input placeholder="Endereço" value={newCondo.address} onChange={e => setNewCondo({...newCondo, address: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-xl"/>
                            <input type="number" placeholder="Unidades" value={newCondo.units} onChange={e => setNewCondo({...newCondo, units: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-xl"/>
                            <ButtonPrimary onClick={handleAddCondo}>CADASTRAR</ButtonPrimary>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// 3. GESTÃO DE SÍNDICOS
const ManagersList = ({ managers, fetchUsers }) => {
    const handleDemote = async (manager) => {
        if(!window.confirm("Rebaixar este síndico para morador comum?")) return;
        const { error } = await supabase.from('profiles').update({ type: 'resident' }).eq('id', manager.id);
        if(!error) {
            await logAction('DEMOTE_MANAGER', `Rebaixou síndico: ${manager.name}`);
            fetchUsers();
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-white">Gestão de Síndicos</h2>
            <div className="space-y-3">
                {managers.map(manager => (
                    <Card key={manager.id} className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center border border-amber-500/20"><Shield size={24}/></div>
                            <div><h3 className="font-bold text-white">{manager.name}</h3><p className="text-slate-400 text-sm">{manager.email}</p></div>
                        </div>
                        <button onClick={() => handleDemote(manager)} className="bg-slate-800 hover:bg-red-500/10 hover:text-red-500 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-bold transition-all">Remover Cargo</button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// 4. GESTÃO DE PRESTADORES
const ProvidersList = ({ providers, fetchUsers }) => {
    const toggleVerify = async (provider) => {
        const { error } = await supabase.from('profiles').update({ verified: !provider.verified }).eq('id', provider.id);
        if(!error) {
            await logAction(provider.verified ? 'UNVERIFY_PROVIDER' : 'VERIFY_PROVIDER', `${provider.verified ? 'Removeu selo' : 'Verificou'}: ${provider.name}`);
            fetchUsers();
        }
    };
    const handleDelete = async (provider) => {
        if(!window.confirm("Excluir este prestador permanentemente?")) return;
        const { error } = await supabase.from('profiles').delete().eq('id', provider.id);
        if(!error) {
            await logAction('DELETE_PROVIDER', `Excluiu prestador: ${provider.name}`);
            fetchUsers();
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-white">Aprovação de Prestadores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {providers.map(prov => (
                    <Card key={prov.id} className={`relative ${prov.verified ? 'border-blue-500/30' : 'border-slate-700 opacity-80'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-xl">{prov.name?.charAt(0)}</div>
                                <div><h4 className="font-bold text-white leading-tight">{prov.company_name || prov.name}</h4><p className="text-xs text-slate-500">{prov.category}</p></div>
                            </div>
                            {prov.verified && <CheckCircle size={18} className="text-blue-500"/>}
                        </div>
                        <div className="flex gap-2 mt-auto">
                            <button onClick={() => toggleVerify(prov)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${prov.verified ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>{prov.verified ? 'Revogar' : 'Aprovar'}</button>
                            <button onClick={() => handleDelete(prov)} className="p-2 bg-slate-800 hover:bg-red-500 hover:text-white rounded-lg text-slate-500 transition-colors"><Trash2 size={16}/></button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// 5. LISTAGEM GERAL DE USUÁRIOS
const AllUsersList = ({ users, fetchUsers }) => {
    const [search, setSearch] = useState('');
    const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

    const handlePromote = async (user) => {
        if(!window.confirm("Promover a Síndico?")) return;
        const { error } = await supabase.from('profiles').update({ type: 'manager' }).eq('id', user.id);
        if(!error) {
            await logAction('PROMOTE_USER', `Promoveu a síndico: ${user.name}`);
            fetchUsers();
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
             <div className="flex justify-between items-end">
                <div><h2 className="text-2xl font-bold text-white">Todos os Usuários</h2><p className="text-slate-400 text-sm">Gerencie permissões e acessos.</p></div>
                <div className="relative"><Search className="absolute left-3 top-2.5 text-slate-500" size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar nome..." className="bg-slate-900 border border-slate-700 text-white pl-9 pr-4 py-2 rounded-lg text-sm focus:border-blue-500 outline-none"/></div>
             </div>
             <div className="space-y-2">
                {filtered.map(user => (
                    <div key={user.id} className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${user.type === 'resident' ? 'bg-emerald-500/20 text-emerald-500' : user.type === 'manager' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'}`}>{user.type === 'resident' ? 'M' : user.type === 'manager' ? 'S' : 'P'}</div>
                            <div><p className="text-white font-bold text-sm">{user.name}</p><p className="text-slate-500 text-xs">{user.email} • {user.type}</p></div>
                        </div>
                        <div className="flex items-center gap-2">
                            {user.type === 'resident' && <button onClick={() => handlePromote(user)} title="Promover a Síndico" className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"><Shield size={16}/></button>}
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
};

// 6. NOVO: BROADCAST (AVISO GLOBAL)
const BroadcastManager = () => {
    const [msg, setMsg] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if(!msg.title || !msg.content) return alert("Preencha tudo");
        setLoading(true);
        try {
            // Cria um aviso sem ID de condomínio (Global)
            const { error } = await supabase.from('notices').insert([{
                title: `📢 ${msg.title}`,
                content: msg.content,
                date: new Date().toLocaleDateString('pt-BR'),
                type: 'alert' // Destaque de alerta
            }]);
            if(error) throw error;
            await logAction('BROADCAST_SENT', `Enviou aviso global: ${msg.title}`);
            alert("Broadcast enviado para todos!");
            setMsg({title: '', content: ''});
        } catch (e) { alert(e.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30"><Radio size={32}/></div>
                <h2 className="text-2xl font-bold text-white">Broadcast Global</h2>
                <p className="text-slate-400">Envie uma mensagem urgente para TODOS os usuários do sistema.</p>
            </div>
            <Card className="border-red-500/30">
                <div className="space-y-4">
                    <div>
                        <label className="text-slate-400 text-xs font-bold uppercase mb-1 block">Título do Alerta</label>
                        <input value={msg.title} onChange={e=>setMsg({...msg, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:border-red-500 outline-none" placeholder="Ex: Manutenção Programada"/>
                    </div>
                    <div>
                        <label className="text-slate-400 text-xs font-bold uppercase mb-1 block">Mensagem</label>
                        <textarea rows="5" value={msg.content} onChange={e=>setMsg({...msg, content: e.target.value})} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:border-red-500 outline-none" placeholder="Descreva o comunicado..."/>
                    </div>
                    <button onClick={handleSend} disabled={loading} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin"/> : <><AlertTriangle size={18}/> ENVIAR PARA TODOS</>}
                    </button>
                </div>
            </Card>
        </div>
    );
};

// 7. NOVO: LOGS DE AUDITORIA
const AuditLogViewer = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            const { data } = await supabase.from('audit_logs').select('*').order('created_at', {ascending: false}).limit(50);
            if(data) setLogs(data);
            setLoading(false);
        };
        fetchLogs();
    }, []);

    if(loading) return <Loader2 className="animate-spin text-slate-500 mx-auto mt-10"/>;

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-white">Auditoria de Segurança</h2>
            <p className="text-slate-400 text-sm">Últimas 50 ações administrativas registradas.</p>
            <div className="space-y-2">
                {logs.map(log => (
                    <div key={log.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-start gap-4 text-sm font-mono">
                         <div className="text-slate-500 whitespace-nowrap pt-0.5">{new Date(log.created_at).toLocaleString('pt-BR')}</div>
                         <div className="flex-1">
                             <span className="text-blue-400 font-bold block mb-1">{log.action}</span>
                             <span className="text-slate-300">{log.details}</span>
                             <span className="text-slate-600 block text-xs mt-1">Por: {log.admin_email}</span>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

const AdminArea = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [condos, setCondos] = useState([]);

  const fetchData = async () => {
      setLoading(true);
      try {
          const { data: profiles } = await supabase.from('profiles').select('*');
          setUsers(profiles || []);
          const { data: condosData } = await supabase.from('condominiums').select('*').order('created_at', {ascending: false});
          setCondos(condosData || []);
          setStats({
              totalUsers: profiles?.length || 0,
              totalProviders: profiles?.filter(u => u.type === 'provider').length || 0,
              totalManagers: profiles?.filter(u => u.type === 'manager').length || 0,
              totalCondos: condosData?.length || 0
          });
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="min-h-screen bg-[#0B1120] flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  const managers = users.filter(u => u.type === 'manager');
  const providers = users.filter(u => u.type === 'provider');

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">A</div>
                <h1 className="font-bold text-xl tracking-tight">Admin</h1>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}><LayoutDashboard size={18}/> Visão Geral</button>
                <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-600 uppercase">Gestão</div>
                <button onClick={() => setActiveTab('condos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'condos' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}><Building2 size={18}/> Condomínios</button>
                <button onClick={() => setActiveTab('managers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'managers' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}><Shield size={18}/> Síndicos</button>
                <button onClick={() => setActiveTab('providers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'providers' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}><Briefcase size={18}/> Prestadores</button>
                <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}><Users size={18}/> Todos Usuários</button>
                
                <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-600 uppercase">Ferramentas</div>
                <button onClick={() => setActiveTab('broadcast')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'broadcast' ? 'bg-red-600 text-white' : 'text-red-400 hover:text-white hover:bg-red-900/20'}`}><Radio size={18}/> Broadcast</button>
                <button onClick={() => setActiveTab('audit')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'audit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}><FileText size={18}/> Auditoria</button>
            </nav>
            <div className="p-4 border-t border-slate-800">
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"><LogOut size={18}/> Sair do Painel</button>
            </div>
        </aside>
        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen custom-scrollbar">
            {activeTab === 'dashboard' && <DashboardOverview stats={stats} />}
            {activeTab === 'condos' && <CondosManager condos={condos} fetchCondos={fetchData} />}
            {activeTab === 'managers' && <ManagersList managers={managers} fetchUsers={fetchData} />}
            {activeTab === 'providers' && <ProvidersList providers={providers} fetchUsers={fetchData} />}
            {activeTab === 'users' && <AllUsersList users={users} fetchUsers={fetchData} />}
            {activeTab === 'broadcast' && <BroadcastManager />}
            {activeTab === 'audit' && <AuditLogViewer />}
        </main>
    </div>
  );
};

export default AdminArea;