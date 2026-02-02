import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Lock, User, Building2, Wrench, Loader2, LogIn, UserPlus, ArrowRight, CheckCircle2, Home, Star, Zap, Users } from 'lucide-react';

const AccessPortal = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('resident'); 
  const [condoId, setCondoId] = useState(''); 
  const [unit, setUnit] = useState(''); 
  const [block, setBlock] = useState('');
  const [condosList, setCondosList] = useState([]);

  useEffect(() => {
    const loadCondos = async () => {
        const { data } = await supabase.from('condominiums').select('*').eq('status', 'active');
        if(data) setCondosList(data);
    };
    loadCondos();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        if (isLogin) {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
            if (profile) onLogin(profile.type);
        } else {
            if(type === 'resident' && !condoId) throw new Error("Selecione seu condomínio.");
            
            const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name: name } } });
            if (error) throw error;
            
            if (data.user) {
                const { error: profileError } = await supabase.from('profiles').insert([{
                    id: data.user.id, 
                    name, 
                    email, 
                    type, 
                    unit: type === 'resident' ? unit : null, 
                    block: type === 'resident' ? block : null,
                    condo_id: type === 'resident' ? condoId : null, 
                    verified: false
                }]);
                if (profileError) throw profileError;
                alert("Cadastro realizado! Faça login para entrar.");
                setIsLogin(true);
            }
        }
    } catch (error) { alert(error.message); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* --- LADO ESQUERDO: A MARCA (PROTAGONISTA) --- */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0B1120] items-center justify-center overflow-hidden border-r border-white/5">
        
        {/* Background Grid & Effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/5 via-transparent to-transparent"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse-slow"></div>

        {/* --- CONTEÚDO DA MARCA --- */}
        <div className="relative z-10 text-center px-10">
            
            {/* Logo Container - MONSTRUOSO (384px) */}
            <div className="mx-auto w-96 h-96 mb-14 relative group">
                {/* O Holofote Azul atrás do logo */}
                <div className="absolute inset-4 bg-blue-600 rounded-[5rem] blur-[120px] opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                
                {/* A Caixa do Logo */}
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 w-full h-full rounded-[4rem] flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md p-8">
                    <img src="/logo2.png" alt="Logo" className="w-64 h-64 object-contain drop-shadow-[0_0_50px_rgba(59,130,246,0.8)] transform group-hover:scale-105 transition-transform duration-500"/>
                </div>
            </div>

            {/* Typography */}
            <h1 className="text-8xl font-black text-white tracking-tighter mb-6 drop-shadow-2xl">
                CONDOMUS
            </h1>
            
            {/* TEXTO ATUALIZADO: FOCO NO MORADOR */}
            <p className="text-2xl text-blue-200/80 font-medium max-w-lg mx-auto leading-relaxed mb-12">
                A experiência definitiva de moradia. Conecte-se, resolva e viva melhor.
            </p>

            {/* Features List ATUALIZADA */}
            <div className="flex flex-wrap justify-center gap-4 text-sm font-bold text-slate-400">
                <span className="flex items-center gap-2 bg-slate-900/80 px-5 py-2.5 rounded-xl border border-white/5 shadow-lg group hover:border-blue-500/30 transition-colors">
                    <Star size={18} className="text-blue-500 group-hover:scale-110 transition-transform"/> Marketplace de Serviços
                </span>
                <span className="flex items-center gap-2 bg-slate-900/80 px-5 py-2.5 rounded-xl border border-white/5 shadow-lg group hover:border-emerald-500/30 transition-colors">
                    <Zap size={18} className="text-emerald-500 group-hover:scale-110 transition-transform"/> Prestadores de Confiança
                </span>
                <span className="flex items-center gap-2 bg-slate-900/80 px-5 py-2.5 rounded-xl border border-white/5 shadow-lg group hover:border-purple-500/30 transition-colors">
                    <Users size={18} className="text-purple-500 group-hover:scale-110 transition-transform"/> Comunidade Conectada
                </span>
            </div>
        </div>
      </div>

      {/* --- LADO DIREITO: FORMULÁRIO --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#020617] relative">
         <div className="max-w-md w-full relative z-10">
            
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-10">
                <div className="w-20 h-20 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center border border-slate-800 mb-4 shadow-lg shadow-blue-900/20">
                    <img src="/logo2.png" alt="Logo" className="w-12 h-12 object-contain"/>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter">CONDOMUS</h1>
            </div>

            <div className="text-left mb-8">
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
                    {isLogin ? 'Acesse sua conta.' : 'Junte-se a nós.'}
                </h2>
                <p className="text-slate-400 text-lg">
                    {isLogin ? 'Insira suas credenciais para continuar testando.' : 'Leve seu condomínio para o próximo nível.'}
                </p>
            </div>

            {/* Form Container */}
            <form onSubmit={handleAuth} className="space-y-6">
                
                {/* --- SWITCHER --- */}
                <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
                    <button type="button" onClick={() => setIsLogin(true)} className={`flex-1 py-3 text-sm font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${isLogin ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>Entrar</button>
                    <button type="button" onClick={() => setIsLogin(false)} className={`flex-1 py-3 text-sm font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${!isLogin ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>Criar Conta</button>
                </div>

                {!isLogin && (
                    <div className="space-y-5 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <div onClick={() => setType('resident')} className={`cursor-pointer border p-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 ${type === 'resident' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:bg-slate-900'}`}>
                                <User size={24}/> <span className="text-xs font-bold uppercase tracking-wider">Morador</span>
                            </div>
                            <div onClick={() => setType('provider')} className={`cursor-pointer border p-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 ${type === 'provider' ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:bg-slate-900'}`}>
                                <Wrench size={24}/> <span className="text-xs font-bold uppercase tracking-wider">Prestador</span>
                            </div>
                        </div>

                        <div className="relative group">
                            <User className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20}/>
                            <input type="text" placeholder="Nome Completo" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 text-white pl-12 p-4 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 font-medium" required />
                        </div>

                        {type === 'resident' && (
                            <div className="space-y-4">
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20}/>
                                    <select value={condoId} onChange={e => setCondoId(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 text-white pl-12 p-4 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer font-medium" required>
                                        <option value="">Selecione Condomínio...</option>
                                        {condosList.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20}/>
                                        <input type="text" placeholder="Bloco" value={block} onChange={e => setBlock(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 text-white pl-12 p-4 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 font-medium text-center" required />
                                    </div>
                                    <div className="relative group">
                                        <Home className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20}/>
                                        <input type="text" placeholder="Apto/Unid" value={unit} onChange={e => setUnit(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 text-white pl-12 p-4 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 font-medium text-center" required />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="relative group">
                        <User className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20}/>
                        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 text-white pl-12 p-4 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 font-medium" required />
                    </div>
                    
                    <div className="relative group">
                        <Lock className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20}/>
                        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 text-white pl-12 p-4 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 font-medium" required />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 text-base font-bold text-white rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2 group">
                    {loading ? <Loader2 className="animate-spin"/> : (isLogin ? <>Acessar Painel <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/></> : 'Finalizar Cadastro')}
                </button>
            </form>

            <div className="mt-10 text-center">
                <p className="text-slate-600 text-xs font-bold tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity cursor-default">
                    Protected by Condomus Security
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AccessPortal;