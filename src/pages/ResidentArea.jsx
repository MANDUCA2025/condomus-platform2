import React, { useState, useEffect } from 'react';
import { LogOut, Wrench, AlertTriangle, Search, Star, MapPin, Phone, Megaphone, CheckCircle, Clock, Loader2, Building2, X, ChevronRight, Plus, FileText, Trash2 } from 'lucide-react';
import { Card, Badge, ButtonPrimary } from '../components/UiKit';
import { residentCategories } from '../data/mockData';
import { supabase } from '../services/supabase';

// --- COMPONENTE: MODAL DE DETALHES DO PRESTADOR ---
const ProviderModal = ({ provider, onClose }) => {
  if (!provider) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0f172a] w-full max-w-2xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="relative h-32 bg-gradient-to-r from-blue-900 to-slate-900 shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/30 hover:bg-red-500 text-white p-2 rounded-full transition-colors backdrop-blur-md z-10"><X size={20}/></button>
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-2xl bg-slate-950 p-1 shadow-xl">
               {provider.avatar_url ? <img src={provider.avatar_url} className="w-full h-full object-cover rounded-xl" /> : <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center text-3xl">👷</div>}
            </div>
          </div>
        </div>
        <div className="pt-16 pb-8 px-8 overflow-y-auto custom-scrollbar">
           <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-2xl font-bold text-white">{provider.company_name || provider.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                   <Badge type="info">{residentCategories.find(c => c.id === provider.category)?.label || provider.category}</Badge>
                   <span className="flex items-center gap-1 text-yellow-400 text-sm font-bold"><Star size={14} fill="currentColor"/> 5.0</span>
                </div>
              </div>
              {provider.verified && <Badge type="success">Verificado</Badge>}
           </div>
           <div className="space-y-6 mt-6">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                 <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Sobre</h3>
                 <p className="text-slate-300 leading-relaxed">{provider.description || "Sem descrição."}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {provider.phone && <a href={`https://wa.me/55${provider.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-600/30 p-3 rounded-xl transition-colors group cursor-pointer"><div className="bg-emerald-500 text-white p-2 rounded-lg"><Phone size={20}/></div><div><p className="text-xs text-emerald-400 font-bold uppercase">WhatsApp</p><p className="text-white font-medium group-hover:underline">Chamar Agora</p></div></a>}
              </div>
              {provider.portfolio && provider.portfolio.length > 0 && <div><h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><Wrench size={14}/> Galeria</h3><div className="grid grid-cols-3 gap-2">{provider.portfolio.map((img, i) => (<div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-800"><img src={img} className="w-full h-full object-cover" /></div>))}</div></div>}
           </div>
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 shrink-0 flex justify-end"><button onClick={onClose} className="text-slate-400 hover:text-white px-6 py-3 font-bold">Fechar</button></div>
      </div>
    </div>
  );
};

// --- COMPONENTE: MERCADO DE SERVIÇOS ---
const ServiceMarketplace = ({ providers, loading, onShowDetails }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;
  
  const filtered = providers.filter(p => {
    const matchesCategory = filter === 'all' || (p.category || 'outros') === filter;
    const matchesSearch = (p.company_name || p.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative"><Search className="absolute left-4 top-3.5 text-slate-500" size={20}/><input type="text" placeholder="Buscar prestador..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-2xl focus:border-blue-500 outline-none shadow-inner"/></div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">{residentCategories.map(cat => (<button key={cat.id} onClick={() => setFilter(cat.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border shadow-sm ${filter === cat.id ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>{cat.icon} {cat.label}</button>))}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? <div className="col-span-full text-center py-16 text-slate-500 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 flex flex-col items-center"><Wrench size={48} className="mb-4 opacity-20"/><p>Nenhum prestador encontrado.</p></div> : 
            filtered.map(provider => (
            <Card key={provider.id} className="group hover:border-blue-500/50 transition-all flex flex-col h-full border-t-4 border-t-slate-700 hover:border-t-blue-500 relative">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 shrink-0">{provider.avatar_url ? <img src={provider.avatar_url} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-2xl text-slate-600">{provider.name?.charAt(0)}</div>}</div>
                    <div><h3 className="font-bold text-white group-hover:text-blue-400 transition-colors text-lg leading-tight">{provider.company_name || provider.name}</h3><div className="flex items-center gap-2 mt-1.5"><Badge type="info" size="xs">{residentCategories.find(c => c.id === provider.category)?.label || provider.category}</Badge><span className="flex items-center text-yellow-500 text-xs font-bold gap-1 bg-yellow-500/10 px-1.5 py-0.5 rounded"><Star size={10} fill="currentColor"/> 5.0</span></div></div>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1 h-10">{provider.description || 'Prestador verificado.'}</p>
                <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center">{provider.phone ? <a href={`https://wa.me/55${provider.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-emerald-400 text-xs font-bold flex items-center gap-1 hover:underline"><Phone size={14}/> WhatsApp</a> : <span></span>}<button onClick={() => onShowDetails(provider)} className="bg-slate-800 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">Ver Detalhes <ChevronRight size={14}/></button></div>
            </Card>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE: MURAL DE AVISOS ---
const NoticesBoard = ({ notices }) => (
    <div className="animate-fade-in space-y-4">
        {notices.length === 0 ? <div className="text-center text-slate-500 py-10 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">Nenhum aviso no mural.</div> : notices.map(notice => (
            <Card key={notice.id} className={`border-l-4 ${notice.condo_id ? 'border-l-blue-500' : 'border-l-red-500 bg-red-900/5'}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-lg">{notice.title}</h3>
                            {!notice.condo_id && <Badge type="error">IMPORTANTE</Badge>}
                        </div>
                        <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">{notice.date}</span>
                    </div>
                </div>
                <p className="text-slate-300 mt-2 text-sm leading-relaxed">{notice.content}</p>
            </Card>
        ))}
    </div>
);

// --- COMPONENTE: OCORRÊNCIAS ---
const OccurrencesPanel = ({ myProfile }) => {
    const [tab, setTab] = useState('new'); // 'new' ou 'list'
    const [myOccurrences, setMyOccurrences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', type: 'manutencao' });

    // Buscar ocorrências do usuário
    const fetchMyOccurrences = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user) {
            const { data } = await supabase.from('occurrences').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
            if(data) setMyOccurrences(data);
        }
    };

    useEffect(() => { fetchMyOccurrences(); }, []);

    // Criar nova ocorrência
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.title || !formData.description) return alert("Preencha todos os campos.");
        if(!myProfile?.condo_id) return alert("Erro crítico: Seu perfil não está vinculado a nenhum condomínio.");

        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            
            const { error } = await supabase.from('occurrences').insert([{
                user_id: user.id,
                condo_id: myProfile.condo_id, // <--- CAMPO ESSENCIAL PARA O SÍNDICO VER
                unit: myProfile.unit || 'Não Inf.',
                title: formData.title,
                description: formData.description,
                type: formData.type,
                status: 'open',
                date: new Date().toLocaleDateString('pt-BR')
            }]);

            if(error) throw error;

            alert("Ocorrência aberta com sucesso!");
            setFormData({ title: '', description: '', type: 'manutencao' });
            setTab('list');
            fetchMyOccurrences();

        } catch (error) {
            alert("Erro: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Deletar ocorrência
    const handleDelete = async (id) => {
        if(!window.confirm("Deseja cancelar este chamado?")) return;
        const { error } = await supabase.from('occurrences').delete().eq('id', id);
        if(!error) fetchMyOccurrences();
    };

    return (
        <div className="animate-fade-in max-w-3xl mx-auto">
            <div className="flex gap-4 mb-6 border-b border-slate-800 pb-2">
                <button onClick={() => setTab('new')} className={`pb-2 font-bold text-sm transition-colors ${tab === 'new' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}>Abrir Novo</button>
                <button onClick={() => setTab('list')} className={`pb-2 font-bold text-sm transition-colors ${tab === 'list' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}>Meus Chamados ({myOccurrences.length})</button>
            </div>

            {tab === 'new' && (
                <Card>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Plus size={20} className="text-emerald-500"/> Nova Ocorrência</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Tipo</label>
                            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl outline-none focus:border-blue-500">
                                <option value="manutencao">Manutenção</option>
                                <option value="barulho">Barulho</option>
                                <option value="seguranca">Segurança</option>
                                <option value="outros">Outros</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Título</label>
                            <input type="text" placeholder="Ex: Lâmpada do hall queimada" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl outline-none focus:border-blue-500"/>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Descrição</label>
                            <textarea rows="4" placeholder="Descreva o problema com detalhes..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl outline-none focus:border-blue-500"/>
                        </div>
                        <ButtonPrimary type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin"/> : 'ABRIR CHAMADO'}</ButtonPrimary>
                    </form>
                </Card>
            )}

            {tab === 'list' && (
                <div className="space-y-4">
                    {myOccurrences.length === 0 ? (
                        <div className="text-center text-slate-500 py-10 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">Você não tem chamados abertos.</div>
                    ) : (
                        myOccurrences.map(occ => (
                            <Card key={occ.id} className={`border-l-4 ${occ.status === 'open' ? 'border-l-red-500' : occ.status === 'progress' ? 'border-l-yellow-500' : 'border-l-emerald-500'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge type={occ.status === 'open' ? 'error' : occ.status === 'progress' ? 'warning' : 'success'}>
                                                {occ.status === 'open' ? 'Aberto' : occ.status === 'progress' ? 'Em Andamento' : 'Resolvido'}
                                            </Badge>
                                            <span className="text-xs text-slate-500">{occ.date}</span>
                                        </div>
                                        <h3 className="font-bold text-white">{occ.title}</h3>
                                        <p className="text-slate-400 text-sm mt-1">{occ.description}</p>
                                    </div>
                                    {occ.status === 'open' && (
                                        <button onClick={() => handleDelete(occ.id)} className="text-slate-600 hover:text-red-500 p-2"><Trash2 size={16}/></button>
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// --- TELA PRINCIPAL DO MORADOR ---
const ResidentArea = ({ onLogout }) => {
  const [screen, setScreen] = useState('services'); 
  const [providers, setProviders] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myProfile, setMyProfile] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [condoName, setCondoName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // 1. Pega perfil
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                setMyProfile(profile);

                if(profile?.condo_id) {
                    // 2. Pega nome do condomínio
                    const { data: condo } = await supabase.from('condominiums').select('name').eq('id', profile.condo_id).single();
                    if(condo) setCondoName(condo.name);
                    
                    // 3. Pega avisos (Locais OU Globais)
                    const { data: noticesData } = await supabase.from('notices').select('*')
                        .or(`condo_id.eq.${profile.condo_id},condo_id.is.null`)
                        .order('created_at', { ascending: false });
                    setNotices(noticesData || []);
                }
            }
            // 4. Prestadores (Globais)
            const { data: providersData } = await supabase.from('profiles').select('*').eq('type', 'provider');
            if (providersData) setProviders(providersData);

        } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col">
      <ProviderModal provider={selectedProvider} onClose={() => setSelectedProvider(null)} />

      <header className="h-20 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#FDFBF7] rounded-xl p-1.5 flex items-center justify-center shadow-lg cursor-pointer" onClick={() => setScreen('services')}>
                <img src="/logo2.png" alt="Logo" className="h-full w-full object-contain" />
            </div>
            <div>
                <span className="font-bold text-white hidden md:block">Condomus</span>
                {condoName && <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider hidden md:block">{condoName}</p>}
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block"><p className="text-white font-bold text-sm">{myProfile?.name || 'Morador'}</p><p className="text-emerald-400 text-xs font-bold">{myProfile?.unit ? `Apto ${myProfile.unit}` : '...'}</p></div>
            <button onClick={onLogout} className="bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 p-2.5 rounded-full transition-all border border-slate-700"><LogOut size={20}/></button>
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full pb-24 md:pb-8">
        {!myProfile?.condo_id ? (
             <div className="bg-yellow-500/10 border border-yellow-500/50 p-6 rounded-xl text-center text-yellow-200">
                <AlertTriangle size={48} className="mx-auto mb-4"/>
                <h2 className="text-xl font-bold">Perfil em Análise</h2>
                <p>Você ainda não foi vinculado a um condomínio. Aguarde a aprovação do síndico ou administrador.</p>
            </div>
        ) : (
            <>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-6">Olá, {myProfile?.name?.split(' ')[0] || 'Vizinho'} 👋</h1>
                    <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">
                        <button onClick={() => setScreen('services')} className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${screen === 'services' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><Wrench size={18}/> Contratar Serviços</button>
                        <button onClick={() => setScreen('notices')} className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${screen === 'notices' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><Megaphone size={18}/> Mural de Avisos</button>
                        <button onClick={() => setScreen('occurrences')} className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${screen === 'occurrences' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><AlertTriangle size={18}/> Abrir Chamado</button>
                    </div>
                </div>

                {screen === 'services' && <ServiceMarketplace providers={providers} loading={loading} onShowDetails={setSelectedProvider} />}
                {screen === 'notices' && <NoticesBoard notices={notices} />}
                {screen === 'occurrences' && <OccurrencesPanel myProfile={myProfile} />}
            </>
        )}
      </main>
    </div>
  );
};

export default ResidentArea;