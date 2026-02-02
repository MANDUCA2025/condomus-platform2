import React from 'react';
import { Search, Zap, Droplets, BrickWall, PaintBucket, Wind, Wrench, Hammer, Key, BoxSelect, Layers, Sparkles, Shirt, Sprout, LifeBuoy, Truck, Baby, HeartHandshake, Dog, BookOpen, Dumbbell, Scissors, Flame, Laptop, HardHat, ShieldCheck } from 'lucide-react';

export const residentCategories = [
  { id: 'all', label: 'Todos', icon: <Search size={16}/> },
  // Manutenção e Obras
  { id: 'Eletricista', label: 'Elétrica', icon: <Zap size={16}/> },
  { id: 'Encanador', label: 'Hidráulica', icon: <Droplets size={16}/> },
  { id: 'Pedreiro', label: 'Pedreiro', icon: <BrickWall size={16}/> },
  { id: 'Pintor', label: 'Pintura', icon: <PaintBucket size={16}/> },
  { id: 'Ar Condicionado', label: 'Climatização', icon: <Wind size={16}/> },
  { id: 'Marido de Aluguel', label: 'Marido de Aluguel', icon: <Wrench size={16}/> },
  { id: 'Marceneiro', label: 'Marcenaria', icon: <Hammer size={16}/> },
  { id: 'Serralheiro', label: 'Serralheria', icon: <Key size={16}/> },
  { id: 'Vidraceiro', label: 'Vidraçaria', icon: <BoxSelect size={16}/> },
  { id: 'Gesseiro', label: 'Gesso/Drywall', icon: <Layers size={16}/> },
  // Limpeza e Casa
  { id: 'Diarista', label: 'Limpeza', icon: <Sparkles size={16}/> },
  { id: 'Passadeira', label: 'Passadeira', icon: <Shirt size={16}/> },
  { id: 'Jardineiro', label: 'Jardinagem', icon: <Sprout size={16}/> },
  { id: 'Piscineiro', label: 'Piscineiro', icon: <LifeBuoy size={16}/> },
  { id: 'Mudanças', label: 'Fretes/Mudanças', icon: <Truck size={16}/> },
  // Cuidados e Família
  { id: 'Baba', label: 'Babá', icon: <Baby size={16}/> },
  { id: 'Cuidador', label: 'Cuidador de Idosos', icon: <HeartHandshake size={16}/> },
  { id: 'Pet Sitter', label: 'Passeador de Cães', icon: <Dog size={16}/> },
  { id: 'Professor', label: 'Aulas Particulares', icon: <BookOpen size={16}/> },
  // Bem-estar e Lazer
  { id: 'Personal', label: 'Personal Trainer', icon: <Dumbbell size={16}/> },
  { id: 'Beleza', label: 'Cabeleireiro/Manicure', icon: <Scissors size={16}/> },
  { id: 'Churrasqueiro', label: 'Churrasqueiro', icon: <Flame size={16}/> },
  // Tecnologia
  { id: 'Informatica', label: 'Técnico TI', icon: <Laptop size={16}/> },
];

export const initialResidentProviders = [
  { id: 1, category: 'Eletricista', name: "Carlos Silva", doc: "123.456.789-00", job: "Eletricista Residencial", rating: "4.9", reviews: 84, verified: true, image: "⚡", phone: "5511999999999" },
  { id: 2, category: 'Ar Condicionado', name: "Refrigeração Express", doc: "22.333.444/0001-99", job: "Técnico de Ar Condicionado", rating: "4.8", reviews: 32, verified: true, image: "❄️", phone: "5511988888888" },
  { id: 3, category: 'Pintor', name: "Marcos Pinturas", doc: "321.654.987-11", job: "Pintor e Acabamentos", rating: "4.5", reviews: 12, verified: false, image: "🖌️", phone: "5511977777777" },
  { id: 4, category: 'Cuidador', name: "Sônia Cuidados", doc: "444.555.666-77", job: "Enfermeira e Cuidadora", rating: "5.0", reviews: 15, verified: true, image: "👵", phone: "5511966666666" },
  { id: 5, category: 'Personal', name: "Pedro Fit", doc: "555.666.777-88", job: "Personal Trainer Funcional", rating: "4.9", reviews: 40, verified: true, image: "💪", phone: "5511955555555" },
];

export const condoCategories = [
  { id: 'all', label: 'Todos', icon: <Search size={16}/> },
  { id: 'eng', label: 'Engenharia', icon: <HardHat size={16}/> },
  { id: 'sec', label: 'Segurança', icon: <ShieldCheck size={16}/> },
  { id: 'mant', label: 'Manutenção', icon: <Wrench size={16}/> },
];

export const initialCondoProviders = [
  { id: 10, category: 'eng', name: "Alpha Engenharia", doc: "55.666.777/0001-00", job: "Restauro de Fachadas", rating: "5.0", jobs: 4, verified: true, image: "🏗️", phone: "5511999999999" },
  { id: 12, category: 'sec', name: "SafeGuard Portaria", doc: "99.888.777/0001-22", job: "Portaria Remota 24h", rating: "4.9", jobs: 8, verified: true, image: "📹", phone: "5511977777777" },
];

export const initialPendingProviders = [
  { id: 901, type: 'resident', category: 'Pintor', name: "João das Tintas", doc: "000.111.222-33", job: "Pintura Geral", docStatus: "Análise", date: "Hoje", image: "🖌️" },
];

export const initialPendingResidents = [
  { id: 501, name: "Ana Beatriz", cpf: "333.444.555-66", phone: "(11) 99999-1111", unit: "Apto 302 - Bloco A", date: "Hoje, 09:00" },
];

export const initialNotices = [
  { id: 1, title: "Manutenção Elevador Social", date: "29/01", content: "O elevador ficará desligado das 14h às 16h para troca de cabos.", type: "alert", likes: 5, comments: [{ user: "Sra. Maria (102)", text: "Obrigada pelo aviso!" }] },
  { id: 2, title: "Festa Junina do Condomínio", date: "25/01", content: "Preparem suas roupas xadrez! Dia 20/06 teremos nossa festa.", type: "info", likes: 12, comments: [] }
];

export const commonAreas = [
  { id: 1, name: "Salão de Festas", capacity: "80 pessoas", image: "🎉", rules: "Proibido som após 22h. Entregar limpo e sem lixo." }, 
  { id: 2, name: "Churrasqueira", capacity: "20 pessoas", image: "🍖", rules: "Limpar grelha após uso. Cuidado com vidros na área da piscina." }
];

export const initialReservations = [
  { id: 101, areaId: 1, date: 5, period: 'noite', user: 'Outro Morador', guests: "Família Silva" },
  { id: 102, areaId: 2, date: 12, period: 'tarde', user: 'Outro Morador', guests: "Amigos do Futebol" }
];

export const initialOccurrences = [
  { id: 1, type: 'manutencao', title: "Lâmpada Queimada Hall", desc: "A lâmpada do 3º andar está piscando.", status: "open", date: "Hoje", unit: "104-B" },
  { id: 2, type: 'barulho', title: "Som alto vizinho", desc: "Unidade 502 com som alto após 22h.", status: "resolved", date: "20/01", unit: "104-B" },
];

export const myRequestsData = [{ id: 1, provider: "Carlos Silva", service: "Troca de Disjuntor", status: "completed" }, { id: 2, provider: "Refrigeração Express", service: "Limpeza AC", status: "pending" }];