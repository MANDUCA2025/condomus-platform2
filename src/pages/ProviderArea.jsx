import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Briefcase, User, Star, CheckCircle, TrendingUp, Eye, Clock, Building2, FileText, Phone, Instagram, Globe, MapPin, Camera, Upload, Send, MessageCircle, Wrench, X, Loader2 } from 'lucide-react';
import { Card, Badge } from '../components/UiKit';
import { supabase } from '../services/supabase';

// --- FUNÇÃO AUXILIAR DE UPLOAD ---
const uploadToSupabase = async (file) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`; 
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        return data.publicUrl;
    } catch (error) {
        alert("Erro no upload: " + error.message);
        return null;
    }
};

// --- DADOS VISUAIS (MOCK) PARA PREENCHER O VAZIO ---
const mockReviews = [
    { id: 1, user: "Ana Beatriz", rating: 5, text: "Excelente profissional! Chegou no horário e resolveu o problema rápido.", date: "Ontem" },
    { id: 2, user: "Roberto Gomes", rating: 4, text: "Serviço muito bom, mas demorou um pouco para responder o agendamento.", date: "25/01" },
    { id: 3, user: "Condomínio Alpha", rating: 5, text: "Resolveu o curto-circuito da portaria com muita competência.", date: "20/01" },
];

const mockStats = [
    { condo: "Residencial Flores", count: 12 },
    { condo: "Edifício Horizon", count: 5 },
    { condo: "Vila Verde", count: 28 },
];

// --- SUB-COMPONENTES ---

const ProfileScreen = ({ profile, setProfile, isEditing, setIsEditing, onSave }) => {
  const avatarInputRef = useRef(null);
  const portfolioInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const triggerAvatarSelect = () => { if(!isEditing) return; avatarInputRef.current.click(); };
  
  const handleAvatarUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      const publicUrl = await uploadToSupabase(file);
      setUploading(false);
      if (publicUrl) setProfile({...profile, avatar_url: publicUrl});
  };
  
  const triggerPortfolioSelect = () => { if((profile.portfolio || []).length >= 5) return alert("Limite atingido"); portfolioInputRef.current.click(); };
  
  const handlePortfolioUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      const publicUrl = await uploadToSupabase(file);
      setUploading(false);
      if (publicUrl) {
          setProfile({...profile, portfolio: [...(profile.portfolio || []), publicUrl]});
      }
      e.target.value = null; 
  };

  // Cálculo visual da força do perfil
  const hasAvatar = !!profile.avatar_url;
  const hasDesc = !!profile.description;
  const hasPortfolio = (profile.portfolio || []).length > 0;
  const profileStrength = 30 + (hasAvatar ? 30 : 0) + (hasDesc ? 20 : 0) + (hasPortfolio ? 20 : 0);

  return (
      <div className="animate-fade-in space-y-6">
        <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
        <input type="file" ref={portfolioInputRef} onChange={handlePortfolioUpload} className="hidden" accept="image/*" />
        
        {uploading && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center flex-col">
                <Loader2 className="animate-spin text-blue-500 mb-2" size={40}/>
                <p className="text-white font-bold">Enviando Imagem...</p>
            </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white">Meu Perfil</h2>
                <p className="text-slate-400 text-sm">Gerencie como os moradores te veem.</p>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                <div className="hidden md:block text-right">
                    <p className="text-xs font-bold text-emerald-400 uppercase">Força do Perfil</p>
                    <div className="w-32 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{width: `${profileStrength}%`}}></div>
                    </div>
                </div>
                <button 
                    onClick={() => { if(isEditing) onSave(); setIsEditing(!isEditing); }} 
                    className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${isEditing ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}
                >
                    {isEditing ? <><CheckCircle size={20}/> Salvar Alterações</> : <><Wrench size={20}/> Editar Perfil</>}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border-t-4 border-t-blue-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Briefcase size={120}/></div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8 relative z-10 text-center sm:text-left">
                    <div onClick={triggerAvatarSelect} className={`w-24 h-24 shrink-0 rounded-2xl flex items-center justify-center text-5xl border-2 shadow-lg shadow-blue-900/20 overflow-hidden bg-slate-900 relative ${isEditing ? 'cursor-pointer hover:border-emerald-500 border-dashed border-slate-600 group' : 'border-blue-500'}`}>
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="Logo" className="w-full h-full object-cover"/>
                        ) : (
                            <span>⚡</span>
                        )}
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={20} className="text-white mb-1"/>
                                <span className="text-[8px] uppercase font-bold text-white">Alterar</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 w-full pt-1">
                        {isEditing ? (
                            <input value={profile.company_name || ''} onChange={e => setProfile({...profile, company_name: e.target.value})} placeholder="Nome da Empresa" className="w-full bg-slate-900 text-white font-bold text-xl sm:text-2xl p-2 rounded-lg border border-slate-700 mb-2 focus:border-blue-500 outline-none text-center sm:text-left"/>
                        ) : (
                            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{profile.company_name || profile.name}</h3>
                        )}
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-sm text-slate-400 mt-2">
                            <Badge type="info">{profile.category || 'Sem Categoria'}</Badge>
                            <span className="flex items-center gap-1 bg-slate-900/50 px-3 py-1 rounded-lg border border-slate-700/50"><FileText size={14} className="text-slate-500"/> {profile.cnpj || 'CPF/CNPJ não inf.'}</span>
                        </div>
                    </div>
                </div>
            
                <div className="space-y-6 relative z-10">
                    <div>
                        <label className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block">Sobre a empresa</label>
                        {isEditing ? (
                            <textarea value={profile.description || ''} onChange={e => setProfile({...profile, description: e.target.value})} placeholder="Descreva seus serviços..." className="w-full bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-700 h-32 focus:border-blue-500 outline-none shadow-inner leading-relaxed"/>
                        ) : (
                            <p className="text-slate-300 leading-relaxed bg-slate-900/30 p-4 rounded-xl border border-slate-800">{profile.description || 'Nenhuma descrição informada. Clique em editar para adicionar.'}</p>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">WhatsApp</label>
                            <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-white">
                                <Phone size={18} className="text-emerald-500 shrink-0"/>
                                {isEditing ? <input value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} className="bg-transparent w-full outline-none font-medium"/> : <span className="font-medium truncate">{profile.phone}</span>}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail</label>
                            <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-white">
                                <Briefcase size={18} className="text-blue-500 shrink-0"/>
                                <span className="font-medium truncate block w-full text-slate-400 cursor-not-allowed">{profile.email}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Instagram</label>
                            <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-white">
                                <Instagram size={18} className="text-pink-500 shrink-0"/>
                                {isEditing ? <input value={profile.instagram || ''} onChange={e => setProfile({...profile, instagram: e.target.value})} placeholder="@seu.insta" className="bg-transparent w-full outline-none font-medium"/> : <span className="font-medium truncate">{profile.instagram || '-'}</span>}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Website</label>
                            <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-white">
                                <Globe size={18} className="text-cyan-500 shrink-0"/>
                                {isEditing ? <input value={profile.website || ''} onChange={e => setProfile({...profile, website: e.target.value})} placeholder="www.site.com" className="bg-transparent w-full outline-none font-medium"/> : <span className="font-medium truncate block w-full">{profile.website || '-'}</span>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-1 pt-2 border-t border-slate-800">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Endereço</label>
                        <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-white">
                            <MapPin size={18} className="text-red-500 shrink-0"/>
                            {isEditing ? <input value={profile.address || ''} onChange={e => setProfile({...profile, address: e.target.value})} placeholder="Seu endereço completo" className="bg-transparent w-full outline-none font-medium"/> : <span className="font-medium text-slate-300 truncate">{profile.address || '-'}</span>}
                        </div>
                    </div>
                </div>
            </Card>

            <div className="space-y-6">
                <Card className="h-full flex flex-col border-dashed border-2 border-slate-700 bg-slate-800/20">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Camera size={20} className="text-blue-500"/> Galeria (Max 5)</h4>
                    <div className="grid grid-cols-2 gap-3 flex-1 content-start">
                        {(profile.portfolio || []).map((img, idx) => (
                            <div key={idx} className="aspect-square bg-slate-800 rounded-xl flex items-center justify-center text-4xl border border-slate-700 hover:border-blue-500 cursor-pointer transition-all hover:scale-105 relative group shadow-md overflow-hidden">
                                {img ? (<img src={img} alt="P" className="w-full h-full object-cover"/>) : (<span>?</span>)}
                                {isEditing && <button onClick={() => setProfile({...profile, portfolio: profile.portfolio.filter((_, i) => i !== idx)})} className="absolute -top-2 -right-2 bg-red-500 p-1.5 rounded-full text-white shadow-lg hover:scale-110 transition-transform"><X size={14}/></button>}
                            </div>
                        ))}
                        {isEditing && (profile.portfolio || []).length < 5 && (
                            <div onClick={triggerPortfolioSelect} className="aspect-square border-2 border-dashed border-blue-500/40 bg-blue-500/5 rounded-xl flex flex-col items-center justify-center text-blue-400 hover:bg-blue-500/10 hover:border-blue-500 transition-all cursor-pointer group">
                                <Upload size={24} className="mb-1 group-hover:-translate-y-1 transition-transform"/>
                                <span className="text-xs font-bold">Add Foto</span>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
      </div>
  );
};

const ReviewsScreen = ({ reviews }) => {
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const handleReply = (id) => { if(!replyText) return; alert(`Resposta enviada: "${replyText}"`); setReplyingTo(null); setReplyText(""); };
    
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-white">Reputação e Ranking</h2><div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-sm font-bold text-slate-300">Total: {reviews.length} Avaliações</div></div>
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-500/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between mb-8 relative overflow-hidden shadow-2xl gap-6">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Star size={180} className="text-yellow-400"/></div>
          <div className="relative z-10 text-center md:text-left">
            <Badge type="warning">Ranking da Categoria</Badge>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mt-2">Você é o Top #3</h3>
            <p className="text-blue-200 text-sm mt-1">Entre 48 Técnicos na região.</p>
          </div>
          <div className="text-right z-10 bg-slate-950/30 p-4 rounded-xl backdrop-blur-sm border border-white/10 w-full md:w-auto flex flex-col items-center md:items-end">
            <div className="text-5xl font-black text-yellow-400 flex items-center gap-2 tracking-tighter">4.9 <Star fill="currentColor" size={32}/></div>
            <p className="text-slate-300 text-xs font-bold uppercase mt-1 tracking-widest">Média Geral</p>
          </div>
        </div>
        <div className="grid gap-4">
          {reviews.map(r => (<Card key={r.id} className="flex flex-col sm:flex-row gap-5 border-l-4 border-l-transparent hover:border-l-blue-500 transition-all"><div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center font-bold text-white text-lg border border-slate-600 shadow-inner shrink-0">{r.user.charAt(0)}</div><div className="flex-1"><div className="flex justify-between items-start"><h4 className="font-bold text-white text-lg">{r.user}</h4><span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">{r.date}</span></div><div className="flex text-yellow-500 my-1.5">{[...Array(5)].map((_,i)=><Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} className={i >= r.rating ? "text-slate-700" : ""}/>)}</div><p className="text-slate-300 text-sm leading-relaxed">"{r.text}"</p>{replyingTo === r.id ? (<div className="mt-4 animate-fade-in"><textarea className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-blue-500 outline-none" rows="2" placeholder="Escreva um agradecimento ou resposta..." value={replyText} onChange={e => setReplyText(e.target.value)}></textarea><div className="flex gap-2 mt-2 justify-end"><button onClick={() => setReplyingTo(null)} className="text-xs font-bold text-slate-500 hover:text-white px-3 py-2">Cancelar</button><button onClick={() => handleReply(r.id)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2"><Send size={12}/> Enviar Resposta</button></div></div>) : (<button onClick={() => setReplyingTo(r.id)} className="text-blue-400 hover:text-blue-300 text-xs font-bold mt-3 flex items-center gap-1"><MessageCircle size={12}/> Responder</button>)}</div></Card>))}
        </div>
      </div>
    );
};

const DashboardScreen = ({ profile, setProfile, setScreen }) => {
    // Verifica se os campos essenciais estão preenchidos para definir o status
    const isProfileComplete = profile.description && profile.phone && profile.avatar_url;

    return (
      <div className="animate-fade-in max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Olá, {profile.name?.split(' ')[0]}</h2>
            <p className="text-slate-400 flex items-center gap-2 text-sm md:text-base"><Briefcase size={14} className="text-blue-500"/> Painel do Parceiro Condomus</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-lg self-start md:self-auto">
             <span className="text-sm font-bold px-2 text-emerald-400">Conta Ativa</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card onClick={() => setScreen('profile')} className={`cursor-pointer group hover:-translate-y-1 border-t-4 ${isProfileComplete ? 'border-t-emerald-500' : 'border-t-yellow-500'}`}>
            <div className="flex justify-between items-start mb-4"><div className={`p-2 rounded-lg ${isProfileComplete ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}><Eye size={24}/></div></div>
            <p className="text-slate-400 text-sm font-medium">Status do Perfil</p>
            <p className="text-xl font-bold text-white tracking-tight mt-1">{isProfileComplete ? 'Campeão 🏆' : 'Incompleto'}</p>
            <p className="text-xs text-blue-400 mt-2 font-bold cursor-pointer hover:underline">{isProfileComplete ? 'Manter atualizado' : 'Completar Agora'}</p>
          </Card>
          
          <Card className="group hover:-translate-y-1 relative overflow-hidden border-t-4 border-t-blue-500">
            <div className="flex justify-between items-start mb-4"><div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><CheckCircle size={24}/></div></div>
            <p className="text-slate-400 text-sm font-medium">Serviços Realizados</p>
            <p className="text-3xl font-bold text-white tracking-tight">45</p>
            <p className="text-xs text-slate-500 mt-2">Total histórico (Simulado)</p>
          </Card>

          <Card onClick={() => setScreen('reviews')} className="cursor-pointer group hover:-translate-y-1 border-t-4 border-t-yellow-500">
            <div className="flex justify-between items-start mb-4"><div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><Star size={24}/></div></div>
            <p className="text-slate-400 text-sm font-medium">Reputação</p>
            <p className="text-3xl font-bold text-white tracking-tight">4.9 <span className="text-sm text-slate-500 font-normal">/ 5.0</span></p>
            <p className="text-xs text-slate-500 mt-2">Baseado em avaliações.</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div><h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Clock size={18} className="text-slate-400"/> Atividade Recente</h3><div className="space-y-3"><div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-blue-500"></div><div className="flex-1"><p className="text-white text-sm">Você recebeu uma nova avaliação 5 estrelas.</p><p className="text-xs text-slate-500">Hoje, 09:30</p></div></div><div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><div className="flex-1"><p className="text-white text-sm">Orçamento aprovado: Condomínio Vila Verde.</p><p className="text-xs text-slate-500">Ontem, 14:20</p></div></div></div></div>
            <div><h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Building2 size={18} className="text-slate-400"/> Top Clientes</h3><div className="space-y-3">{mockStats.map((stat, idx) => (<div key={idx} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between hover:bg-slate-700/50 transition-colors"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-slate-400 font-bold border border-slate-700">{idx + 1}</div><div><h4 className="font-bold text-white text-sm">{stat.condo}</h4><p className="text-xs text-slate-500">Cliente desde 2023</p></div></div><div className="text-right"><p className="text-xl font-bold text-white">{stat.count}</p><p className="text-[10px] uppercase font-bold text-slate-500">Serviços</p></div></div>))}</div></div>
        </div>
      </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

const ProviderArea = ({ onLogout }) => {
  const [screen, setScreen] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (error) throw error;
                if (data) setProfile(data);
            }
        } catch (error) {
            console.error("Erro ao buscar perfil:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
      try {
          const { error } = await supabase
              .from('profiles')
              .update({
                  company_name: profile.company_name,
                  description: profile.description,
                  phone: profile.phone,
                  instagram: profile.instagram,
                  website: profile.website,
                  address: profile.address,
                  avatar_url: profile.avatar_url,
                  portfolio: profile.portfolio
              })
              .eq('id', profile.id);

          if (error) throw error;
          alert("Perfil salvo com sucesso!");
      } catch (error) {
          alert("Erro ao salvar: " + error.message);
      }
  };

  if (loading) {
      return <div className="min-h-screen bg-[#0B1120] flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col">
      <header className="h-20 md:h-24 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="h-10 w-10 md:h-14 md:w-14 bg-[#FDFBF7] rounded-xl p-1.5 flex items-center justify-center shadow-lg cursor-pointer" onClick={() => setScreen('dashboard')}>
            <img src="/logo2.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
          <nav className="flex items-center gap-2 bg-slate-900/50 p-1 md:p-1.5 rounded-xl border border-slate-800">
             <button onClick={() => setScreen('dashboard')} className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-bold text-sm transition-all duration-300 flex items-center gap-2 ${screen === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Briefcase size={18}/> <span className="hidden md:inline">Dashboard</span>
             </button>
             <button onClick={() => setScreen('profile')} className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-bold text-sm transition-all duration-300 flex items-center gap-2 ${screen === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <User size={18}/> <span className="hidden md:inline">Meu Perfil</span>
             </button>
             <button onClick={() => setScreen('reviews')} className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-bold text-sm transition-all duration-300 flex items-center gap-2 ${screen === 'reviews' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Star size={18}/> <span className="hidden md:inline">Avaliações</span>
             </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
            <span className="hidden lg:block text-right">
                <p className="text-white font-bold text-sm">{profile.name}</p>
                <p className="text-blue-400 text-xs uppercase">{profile.category}</p>
            </span>
            <button onClick={onLogout} className="bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 p-2 md:p-3 rounded-full transition-all border border-slate-700 hover:border-red-500/30">
                <LogOut size={20}/>
            </button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full overflow-x-hidden">
        {screen === 'dashboard' && <DashboardScreen profile={profile} setProfile={setProfile} setScreen={setScreen} />}
        {screen === 'profile' && <ProfileScreen profile={profile} setProfile={setProfile} isEditing={isEditing} setIsEditing={setIsEditing} onSave={handleSaveProfile} />}
        {screen === 'reviews' && <ReviewsScreen reviews={mockReviews} />}
      </main>
    </div>
  );
};

export default ProviderArea;