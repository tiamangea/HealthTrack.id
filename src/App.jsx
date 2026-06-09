import React, { useState, useEffect } from 'react';
import { 
  Activity, ShieldAlert, Users, FileText,
  Heart, Wind, Thermometer, Zap, AlertTriangle, 
  CheckCircle, Clock, Lock, User, LogOut,
  Mail, Key, UserPlus, LogIn, Search, Bot, ArrowRight,
  BrainCircuit, Database, Calendar, TrendingUp,
  MessageSquare, Phone, PhoneCall, ChevronLeft, Home,
  Camera, Edit2, Save, EyeOff, ShieldCheck, RefreshCw,
  Droplets, Trash2
} from 'lucide-react';

// --- DATA GENERATOR (Min 30 Pekerja) ---
const generateWorkers = () => {
  const roles = ['Driller (Offshore)', 'Roughneck (Onshore)', 'Derrickman', 'Technician', 'Safety Officer', 'Mechanic', 'Roustabout', 'Electrician'];
  const prsOptions = ['Stabil', 'Sedang', 'Tinggi'];
  
  const names = [
    "Budi Santoso", "Andi Pratama", "Rina Wijaya", "Joko Anwar", "Siti Aminah", 
    "Ahmad Fauzi", "Dewi Lestari", "Rizky Saputra", "Maya Sari", "Hendra Gunawan", 
    "Fitriani", "Agus Setiawan", "Dian Kusuma", "Eko Prasetyo", "Nita Permata", 
    "Bambang Pamungkas", "Yulianti", "Reza Rahadian", "Sari Indah", "Dedi Syahputra", 
    "Ratna Galih", "Arif Rahman", "Linda Wati", "Fajar Hidayat", "Tuti Handayani", 
    "Wahyu Hidayat", "Rini Marlina", "Iwan Fals", "Mila Karmila", "Surya Saputra", 
    "Ika Nurhayati", "Rudi Hartono", "Tina Toon", "Gilang Dirga", "Ayu Tingting"
  ];

  return names.map((name, i) => {
    const isBadCondition = Math.random() < 0.2; 
    const pfi = isBadCondition ? Math.floor(Math.random() * 40) + 20 : Math.floor(Math.random() * 30) + 70;
    const prs = isBadCondition ? prsOptions[Math.floor(Math.random() * 2) + 1] : 'Stabil';
    
    const prsScore = prs === 'Stabil' ? 90 : prs === 'Sedang' ? 60 : 30;
    const wwi = Math.floor((pfi + prsScore) / 2);

    const phone = "+62 8" + Math.floor(10 + Math.random() * 89) + "-" + Math.floor(1000 + Math.random() * 8999) + "-" + Math.floor(1000 + Math.random() * 8999);

    const history = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'].map(m => {
        const histBad = Math.random() < 0.2;
        const histPFI = histBad ? Math.floor(Math.random() * 30) + 40 : Math.floor(Math.random() * 20) + 75;
        const histPRS = histBad ? prsOptions[Math.floor(Math.random() * 2) + 1] : 'Stabil';
        const histPRSScore = histPRS === 'Stabil' ? 90 : histPRS === 'Sedang' ? 60 : 30;
        return {
            month: m,
            avgPFI: histPFI,
            prsStatus: histPRS,
            avgWWI: Math.floor((histPFI + histPRSScore) / 2),
            incidents: histBad && Math.random() > 0.5 ? 1 : 0
        };
    });

    return {
      id: `W-${String(i + 1).padStart(3, '0')}`,
      name: name,
      role: i === 0 ? 'Driller (Offshore)' : roles[Math.floor(Math.random() * roles.length)],
      phone: phone,
      pfi: pfi, 
      prs: prs, 
      wwi: wwi, 
      history: history,
      status: wwi >= 80 ? 'Normal' : wwi >= 60 ? 'Waspada' : 'Kritis',
      sensors: { 
        bpm: isBadCondition ? Math.floor(Math.random() * 30) + 95 : Math.floor(Math.random() * 20) + 65, 
        spo2: isBadCondition ? Math.floor(Math.random() * 5) + 90 : Math.floor(Math.random() * 4) + 96, 
        temp: +(36.5 + Math.random() * 1.5).toFixed(1), 
        gsr: +(isBadCondition ? 3 + Math.random() * 3 : 0.5 + Math.random() * 1.5).toFixed(2) 
      }
    };
  });
};

const initialWorkers = generateWorkers();

const defaultUsers = [
  { id: 'U2', name: 'Dr. Anita (HSSE)', email: 'medis@wellguard.com', password: 'password', role: 'medis', phone: '081234567890', avatar: null, linkedWorkerId: null },
  { id: 'U3', name: 'Haryanto (SPV)', email: 'spv@wellguard.com', password: 'password', role: 'supervisor', phone: '089876543210', avatar: null, linkedWorkerId: null },
  { id: 'U4', name: 'Budi Santoso', email: 'budi@wellguard.com', password: 'password', role: 'pekerja', phone: '08111222333', avatar: null, linkedWorkerId: 'W-001' }
];

// --- HELPER FUNCTIONS ---
const getWWIColor = (score) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-400';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-600';
};

const getWWITextColor = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

const getAIRecommendation = (worker) => {
  if (worker.wwi < 40 || worker.prs === 'Tinggi') {
    return { level: 3, action: "Evakuasi", desc: "Risiko kritis terdeteksi. Segera evakuasi pekerja ke klinik." };
  } else if (worker.pfi < 60 && worker.prs === 'Stabil') {
    return { level: 2, action: "Rotasi", desc: "Kelelahan fisik akumulatif. Jadwalkan istirahat dan rotasi tugas." };
  } else {
    return { level: 2, action: "Observasi", desc: "Indikasi stres menengah (NLP). Lakukan pendekatan persuasif." };
  }
};

// ==========================================
// SHARED & EXTRACTED COMPONENTS
// ==========================================

const MobileFrame = ({ children, appMessage }) => (
  <div className="min-h-screen bg-slate-200 flex justify-center items-center py-8 font-sans">
    <div className="w-[400px] h-[820px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[12px] border-slate-900 relative flex flex-col">
      <div className="absolute top-0 inset-x-0 h-6 z-50 flex justify-center">
          <div className="w-32 h-6 bg-slate-900 rounded-b-xl"></div>
      </div>
      {appMessage && appMessage.show && (
        <div className="absolute top-10 inset-x-4 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`p-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-bold text-white ${appMessage.type === 'success' ? 'bg-green-600' : appMessage.type === 'warning' ? 'bg-orange-500' : 'bg-blue-600'}`}>
             {appMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
             {appMessage.text}
          </div>
        </div>
      )}
      {children}
    </div>
  </div>
);

const TopBar = ({ title, currentUser }) => (
  <div className="bg-white px-5 pt-10 pb-4 border-b border-slate-200 flex justify-between items-center shrink-0">
    <h1 className="font-bold text-lg text-slate-800">{title}</h1>
    {currentUser?.avatar ? (
       <img src={currentUser.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow-sm" />
    ) : (
       <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200 shadow-sm">
          {currentUser?.name.charAt(0)}
       </div>
    )}
  </div>
);

const ScreenHeader = ({ title, onBack }) => (
  <div className="bg-white px-4 pt-10 pb-4 border-b border-slate-200 flex items-center gap-3 shrink-0 sticky top-0 z-10">
    <button onClick={onBack} className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700">
      <ChevronLeft size={20} />
    </button>
    <h1 className="font-bold text-lg text-slate-800 line-clamp-1">{title}</h1>
  </div>
);

// --- TAB COMPONENTS ---

const HomeTabAdmin = ({ avgWWI, totalWorkers, activeAlertsCount, activeAlertsList, setIsAlertsListOpen, setActiveDetailWorker, currentUser }) => (
  <div className="flex-1 overflow-y-auto bg-slate-50 pb-20">
    <TopBar title="Live Command" currentUser={currentUser} />
    <div className="p-4 space-y-4">
       <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={80}/></div>
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">Rata-Rata WWI Shift</p>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-5xl font-black text-green-400 tracking-tighter">{avgWWI}</span>
            <span className="text-sm font-medium text-slate-300 pb-1">/ 100</span>
          </div>
          <div className="flex gap-4 border-t border-slate-700 pt-3">
            <div>
              <p className="text-xs text-slate-400">Total Pekerja</p>
              <p className="font-bold text-lg">{totalWorkers} <span className="text-xs font-normal">Org</span></p>
            </div>
            <div className="pl-4 border-l border-slate-700 active:opacity-70 transition-opacity" onClick={() => setIsAlertsListOpen(true)}>
              <p className="text-xs text-slate-400">Peringatan Aktif</p>
              <p className={`font-bold text-lg flex items-center gap-1 ${activeAlertsCount > 0 ? 'text-orange-400' : 'text-slate-200'}`}>
                {activeAlertsCount} {activeAlertsCount > 0 && <AlertTriangle size={14}/>}
              </p>
            </div>
          </div>
       </div>

       <div className="flex justify-between items-center px-1">
         <h3 className="font-bold text-slate-800 text-sm">Pekerja Risiko Tertinggi</h3>
       </div>

       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {activeAlertsList.slice(0,5).map((w, idx) => (
            <div key={w.id} onClick={() => setActiveDetailWorker(w)} className={`p-4 flex items-center justify-between active:bg-slate-50 cursor-pointer ${idx !== 0 ? 'border-t border-slate-100' : ''}`}>
               <div className="flex items-center gap-3">
                  <div className={`w-2 h-10 rounded-full ${w.wwi < 40 ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{w.name}</h4>
                    <p className="text-[10px] text-slate-500">{w.role}</p>
                  </div>
               </div>
               <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold text-white ${getWWIColor(w.wwi)}`}>WWI: {w.wwi}</span>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">Detail <ArrowRight size={10}/></p>
               </div>
            </div>
          ))}
          {activeAlertsList.length === 0 && <div className="p-6 text-center text-slate-500 text-xs">Semua pekerja dalam kondisi aman.</div>}
       </div>
    </div>
  </div>
);

const DatabaseTab = ({ workers, setActiveDbWorker, currentUser }) => {
  const [search, setSearch] = useState('');
  const filtered = workers.filter(w => w.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 pb-20 flex flex-col h-full">
       <TopBar title="Database Rekam Jejak" currentUser={currentUser} />
       <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="relative">
             <Search size={16} className="absolute top-2.5 left-3 text-slate-400" />
             <input 
               type="text" placeholder="Cari pekerja..." 
               className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-blue-500 focus:bg-white"
               value={search} onChange={(e) => setSearch(e.target.value)}
             />
          </div>
       </div>
       <div className="p-4 space-y-3">
         {filtered.map(w => (
           <div 
             key={w.id} onClick={() => setActiveDbWorker(w)}
             className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between active:bg-slate-50 cursor-pointer"
           >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  <Database size={18}/>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{w.name}</h4>
                  <p className="text-[10px] text-slate-500">{w.id} • {w.role}</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-300"/>
           </div>
         ))}
       </div>
    </div>
  );
};

const ChatTab = ({ workers, setActiveContactWorker, currentUser }) => {
  const sortedWorkers = [...workers].sort((a, b) => a.wwi - b.wwi);
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 pb-20 h-full">
       <TopBar title="Hubungi Pekerja" currentUser={currentUser} />
       <div className="bg-orange-50 px-4 py-2 border-b border-orange-100 flex items-center gap-2">
         <AlertTriangle size={14} className="text-orange-600"/>
         <span className="text-[10px] text-orange-800 font-bold uppercase tracking-wider">Diurutkan berdasarkan WWI Terendah</span>
       </div>
       <div className="p-2">
         {sortedWorkers.map(w => (
           <div 
             key={w.id} 
             onClick={() => setActiveContactWorker(w)}
             className="bg-white p-3 mb-2 rounded-xl border border-slate-100 flex items-center justify-between active:bg-slate-50 cursor-pointer"
           >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <User size={18}/>
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${w.wwi < 60 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{w.name}</h4>
                  <p className="text-[10px] text-slate-500">{w.role} • <span className="font-medium text-blue-600">{w.phone}</span></p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold text-white ${getWWIColor(w.wwi)}`}>WWI: {w.wwi}</span>
                <a 
                  href={`tel:${w.phone.replace(/[^0-9+]/g, '')}`} 
                  onClick={(e) => e.stopPropagation()} 
                  className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-600 active:bg-green-200 mt-1"
                >
                  <Phone size={12}/>
                </a>
              </div>
           </div>
         ))}
       </div>
    </div>
  );
};

const HomeTabWorker = ({ myWorkerData: w, isPrivacyPaused, currentUser }) => {
  if(!w) return null;
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 pb-20">
      <TopBar title="My Bio-Sync" currentUser={currentUser} />
      {isPrivacyPaused && (
         <div className="bg-orange-600 text-white px-4 py-2 text-xs font-bold flex justify-center items-center gap-2">
           <EyeOff size={14}/> Mode Jeda Privasi Aktif. Data tidak dikirim.
         </div>
      )}
      <div className="p-4 space-y-4">
         <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center relative overflow-hidden">
           <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-blue-400 to-emerald-400"></div>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 mb-1">Skor Kebugaran Anda (WWI)</p>
           <h2 className={`text-7xl font-black tracking-tighter ${getWWITextColor(w.wwi)}`}>{w.wwi}</h2>
           <p className="text-sm text-slate-500 font-medium mb-4">Target harian: &gt;80</p>
           <div className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${w.wwi >= 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {w.wwi >= 60 ? <CheckCircle size={14}/> : <AlertTriangle size={14}/>}
              {w.wwi >= 80 ? 'Fit for Duty (Optimal)' : w.wwi >= 60 ? 'Fit with Caution (Normal)' : 'Unfit (Butuh Istirahat)'}
           </div>
         </div>

         <h3 className="font-bold text-slate-800 text-sm px-1 mt-6">Sensor Biometrik Langsung</h3>
         
         <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
               <Heart size={24} className="text-red-500 mb-2" />
               <p className="text-2xl font-black text-slate-700">{w.sensors.bpm} <span className="text-[10px] font-normal text-slate-400">bpm</span></p>
               <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Detak Jantung</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
               <Wind size={24} className="text-blue-500 mb-2" />
               <p className="text-2xl font-black text-slate-700">{w.sensors.spo2} <span className="text-[10px] font-normal text-slate-400">%</span></p>
               <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Oksigen Darah</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
               <Thermometer size={24} className="text-orange-500 mb-2" />
               <p className="text-2xl font-black text-slate-700">{w.sensors.temp} <span className="text-[10px] font-normal text-slate-400">°C</span></p>
               <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Suhu Kulit</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
               <Zap size={24} className="text-yellow-500 mb-2" />
               <p className="text-2xl font-black text-slate-700">{w.sensors.gsr} <span className="text-[10px] font-normal text-slate-400">μS</span></p>
               <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Stres (GSR)</p>
            </div>
         </div>
      </div>
    </div>
  );
};

const CoachTabWorker = ({ myWorkerData: w, showMessage, currentUser }) => {
  const [isBreathing, setIsBreathing] = useState(false);
  if(!w) return null;

  const handleBreathe = () => {
    setIsBreathing(true);
    setTimeout(() => {
      setIsBreathing(false);
      showMessage('Latihan pernapasan selesai. Detak jantung Anda mulai stabil.', 'success');
    }, 5000); 
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 pb-20">
      <TopBar title="AI Self-Care Coach" currentUser={currentUser} />
      <div className="p-4 space-y-4">
         <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
           <Bot size={80} className="absolute -right-4 -bottom-4 opacity-20" />
           <h2 className="font-bold text-lg mb-1">Halo, {currentUser?.name.split(' ')[0]}!</h2>
           <p className="text-xs text-blue-100 leading-relaxed mb-4">
             Saya menganalisis data sensor dan teks Anda hari ini. {w.wwi < 70 ? 'Anda terlihat sedikit lelah.' : 'Kondisi Anda sangat prima untuk bekerja.'}
           </p>
           {w.sensors.temp > 37 || w.sensors.gsr > 2.0 ? (
              <div className="bg-white/20 p-3 rounded-xl flex items-start gap-3 backdrop-blur-sm">
                <Droplets size={18} className="shrink-0 text-blue-100 mt-0.5"/>
                <div>
                  <p className="text-xs font-bold text-white">Rekomendasi Hidrasi</p>
                  <p className="text-[10px] text-blue-50 mt-1">Suhu kulit dan level stres Anda agak tinggi. Minum 300ml air sekarang untuk menghindari dehidrasi.</p>
                </div>
              </div>
           ) : (
              <div className="bg-white/20 p-3 rounded-xl flex items-start gap-3 backdrop-blur-sm">
                <CheckCircle size={18} className="shrink-0 text-blue-100 mt-0.5"/>
                <div>
                  <p className="text-xs font-bold text-white">Semua Parameter Normal</p>
                  <p className="text-[10px] text-blue-50 mt-1">Pertahankan postur ergonomis yang baik selama bekerja.</p>
                </div>
              </div>
           )}
         </div>

         <h3 className="font-bold text-slate-800 text-sm px-1 mt-6">Latihan Regulasi Stres</h3>
         <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm text-center">
            <div className={`w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-4 transition-all duration-1000 ${isBreathing ? 'scale-125 bg-blue-200' : ''}`}>
               <Wind size={40} className={isBreathing ? 'animate-pulse' : ''} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Tactical Breathing</h4>
            <p className="text-xs text-slate-500 mt-2 mb-6 px-4">Latihan pernapasan 1 menit untuk menurunkan detak jantung (BPM) secara instan.</p>
            <button 
              onClick={handleBreathe} 
              disabled={isBreathing}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all shadow-sm ${isBreathing ? 'bg-slate-400' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              {isBreathing ? 'Tarik napas perlahan...' : 'Mulai Latihan'}
            </button>
         </div>
      </div>
    </div>
  );
};

const PrivacyTabWorker = ({ isPrivacyPaused, setIsPrivacyPaused, showMessage, currentUser }) => (
  <div className="flex-1 overflow-y-auto bg-slate-50 pb-20">
    <TopBar title="Perisai Privasi" currentUser={currentUser} />
    <div className="p-4 space-y-4">
       <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 mx-auto mb-3">
             <ShieldCheck size={32} />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Pusat Kendali Data Anda</h3>
          <p className="text-xs text-slate-500 mt-2 px-2 leading-relaxed">
             Sistem WellGuard tunduk pada <b>UU PDP No. 27 Tahun 2022</b>. Anda memiliki hak penuh untuk membatasi pengumpulan data di luar jam kerja.
          </p>
       </div>
       <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
             <div>
                <h4 className="font-bold text-sm text-slate-800">Mode Jeda Istirahat</h4>
                <p className="text-[10px] text-slate-500 mt-1 w-48">Hentikan transmisi sensor biometrik dan pemindaian teks (IndoBERT) sementara.</p>
             </div>
             <div 
               onClick={() => setIsPrivacyPaused(!isPrivacyPaused)}
               className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isPrivacyPaused ? 'bg-orange-500' : 'bg-slate-300'}`}
             >
                <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${isPrivacyPaused ? 'translate-x-6' : ''}`}></div>
             </div>
          </div>
       </div>
       <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mt-8">
          <h4 className="font-bold text-sm text-red-800 mb-2 flex items-center gap-2"><Trash2 size={16}/> Hak Hapus Data (Right to Erasure)</h4>
          <p className="text-[10px] text-red-600 mb-4 leading-relaxed">
             Hapus seluruh log analitik emosi dan teks dari server secara permanen. Tindakan ini tidak dapat dibatalkan.
          </p>
          <button 
             onClick={() => showMessage('Proses penghapusan data dikirim ke server.', 'success')}
             className="w-full bg-red-600 text-white font-bold text-xs py-3 rounded-xl shadow-sm active:bg-red-700"
          >
             Hapus Riwayat Saya
          </button>
       </div>
    </div>
  </div>
);

const ProfileTab = ({ currentUser, setCurrentUser, setUsersDB, showMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    password: currentUser?.password || '',
    avatar: currentUser?.avatar || null
  });

  const handleEditChange = (e) => {
     const { name, value } = e.target;
     setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
     const file = e.target.files[0];
     if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setEditForm(prev => ({ ...prev, avatar: reader.result }));
        reader.readAsDataURL(file);
     }
  };

  const saveProfile = () => {
     if (!editForm.name || !editForm.email || !editForm.password) {
        showMessage('Nama, Email, dan Kata Sandi tidak boleh kosong.', 'warning');
        return;
     }
     const updatedUser = { ...currentUser, ...editForm };
     setCurrentUser(updatedUser);
     setUsersDB(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
     setIsEditing(false);
     showMessage('Profil Anda berhasil diperbarui!', 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 pb-20">
      <TopBar title="Profil Pengguna" currentUser={currentUser} />
      <div className="p-6 flex flex-col items-center border-b border-slate-200 bg-white">
         <div className="relative mb-3">
            {editForm.avatar ? (
               <img src={editForm.avatar} alt="User Avatar" className="w-24 h-24 rounded-full object-cover border-[3px] border-blue-200 shadow-sm" />
            ) : (
               <div className="w-24 h-24 bg-blue-100 border-[3px] border-blue-200 text-blue-600 rounded-full flex items-center justify-center shadow-sm">
                 <User size={40}/>
               </div>
            )}
            {isEditing && (
               <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg active:scale-95 transition-transform border-2 border-white">
                  <Camera size={16} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
               </label>
            )}
         </div>
         {!isEditing && (
            <>
              <h2 className="text-2xl font-bold text-slate-800">{currentUser?.name}</h2>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase mt-2 border border-slate-200">
                Akses: {currentUser?.role}
              </span>
            </>
         )}
      </div>

      <div className="p-4">
        {isEditing ? (
           <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4 animate-in fade-in duration-200">
              <h3 className="font-bold text-sm text-slate-800 mb-2 border-b border-slate-100 pb-2">Ubah Data Diri</h3>
              <div>
                 <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Nama Lengkap</label>
                 <div className="relative mt-1">
                   <User size={16} className="absolute top-3 left-3 text-slate-400 pointer-events-none" />
                   <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white" />
                 </div>
              </div>
              <div>
                 <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Alamat Email</label>
                 <div className="relative mt-1">
                   <Mail size={16} className="absolute top-3 left-3 text-slate-400 pointer-events-none" />
                   <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white" />
                 </div>
              </div>
              <div>
                 <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Nomor Telepon</label>
                 <div className="relative mt-1">
                   <Phone size={16} className="absolute top-3 left-3 text-slate-400 pointer-events-none" />
                   <input type="tel" name="phone" value={editForm.phone} onChange={handleEditChange} placeholder="0812xxxxxx" className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white" />
                 </div>
              </div>
              <div>
                 <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Ubah Kata Sandi</label>
                 <div className="relative mt-1">
                   <Key size={16} className="absolute top-3 left-3 text-slate-400 pointer-events-none" />
                   <input type="password" name="password" value={editForm.password} onChange={handleEditChange} className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white" />
                 </div>
              </div>
              <div className="flex gap-3 mt-6 pt-2">
                 <button onClick={() => {setIsEditing(false); setEditForm({...currentUser});}} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl active:bg-slate-200 transition-colors text-sm">Batal</button>
                 <button onClick={saveProfile} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl active:bg-blue-700 transition-colors text-sm flex justify-center items-center gap-2">
                    <Save size={16}/> Simpan
                 </button>
              </div>
           </div>
        ) : (
           <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                 <h3 className="font-bold text-sm text-slate-800 mb-4 border-b border-slate-100 pb-2">Informasi Akun</h3>
                 <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shrink-0"><Mail size={14}/></div>
                      <div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">Email Terdaftar</p>
                         <p className="text-sm font-medium text-slate-700">{currentUser?.email}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shrink-0"><Phone size={14}/></div>
                      <div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">Nomor Telepon</p>
                         <p className="text-sm font-medium text-slate-700">{currentUser?.phone || <span className="text-slate-400 italic">Belum diatur</span>}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shrink-0"><ShieldAlert size={14}/></div>
                      <div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">Status Keamanan</p>
                         <p className="text-sm font-medium text-green-600 flex items-center gap-1"><CheckCircle size={12}/> Akun Terlindungi (Enkripsi)</p>
                      </div>
                   </div>
                 </div>
                 <button onClick={() => setIsEditing(true)} className="w-full mt-6 bg-blue-50 text-blue-700 font-bold p-3 rounded-xl flex justify-center items-center gap-2 active:bg-blue-100 transition-colors text-sm border border-blue-100">
                    <Edit2 size={16}/> Edit Profil
                 </button>
              </div>
              <button onClick={() => setCurrentUser(null)} className="w-full bg-red-50 text-red-600 font-bold p-4 rounded-2xl flex justify-center items-center gap-2 active:bg-red-100 transition-colors border border-red-100">
                 <LogOut size={18}/> Keluar Aplikasi
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

// --- MODALS / OVERLAYS ---

const WorkerDetailView = ({ activeDetailWorker: w, setActiveDetailWorker, handleIntervention }) => {
  if (!w) return null;
  const isHeadAnomalous = w.prs !== 'Stabil' || w.sensors.gsr >= 2.0; 
  const isChestAnomalous = w.sensors.bpm >= 90; 
  const isLungsAnomalous = w.sensors.spo2 <= 95; 
  const isBodyAnomalous = w.sensors.temp >= 37.5; 

  const getPartClass = (isAnomalous) => 
    isAnomalous ? "fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" : "fill-blue-400 opacity-40";

  return (
    <div className="absolute inset-0 bg-slate-900 z-20 flex flex-col animate-in slide-in-from-right-full duration-200 text-white">
      <div className="px-4 pt-10 pb-4 border-b border-slate-800 flex items-center justify-between shrink-0 sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md">
        <button onClick={() => setActiveDetailWorker(null)} className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-white">
          <ChevronLeft size={20} />
        </button>
        <div className="text-right">
           <h1 className="font-bold text-sm line-clamp-1">{w.name}</h1>
           <p className="text-[10px] text-slate-400">{w.role}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-6">
         <div className="relative h-64 w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-900 overflow-hidden border-b border-slate-800">
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <svg viewBox="0 0 100 200" className="h-56 w-auto relative z-10 drop-shadow-xl">
               <line x1="10" y1="0" x2="90" y2="0" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1" className="animate-[scan_3s_linear_infinite]" />
               <style>{`@keyframes scan { 0% { transform: translateY(0); } 100% { transform: translateY(200px); } }`}</style>
               <g className={getPartClass(isHeadAnomalous)}><path d="M 50 10 C 42 10 38 18 38 25 C 38 32 45 35 50 38 C 55 35 62 32 62 25 C 62 18 58 10 50 10 Z" /></g>
               <rect x="46" y="38" width="8" height="6" className={getPartClass(isBodyAnomalous)} />
               <g className={getPartClass(isBodyAnomalous)}><path d="M 30 45 Q 46 42 50 44 Q 54 42 70 45 L 75 90 C 75 95 65 95 65 90 L 62 55 L 50 50 L 38 55 L 35 90 C 35 95 25 95 25 90 Z" /></g>
               <g className={getPartClass(isLungsAnomalous)}><path d="M 38 55 C 35 65 42 75 48 75 C 49 70 51 70 52 75 C 58 75 65 65 62 55 C 55 58 45 58 38 55 Z" /></g>
               <circle cx="53" cy="58" r="4" className={getPartClass(isChestAnomalous)} />
               <g className={getPartClass(isBodyAnomalous)}><path d="M 40 76 L 60 76 L 58 105 L 42 105 Z" /></g>
               <g className={getPartClass(isBodyAnomalous)}>
                 <path d="M 42 106 L 48 106 L 48 170 C 48 175 40 175 40 170 L 38 130 L 42 106 Z" />
                 <path d="M 58 106 L 52 106 L 52 170 C 52 175 60 175 60 170 L 62 130 L 58 106 Z" />
               </g>
            </svg>
            <div className="absolute inset-0 z-20 pointer-events-none">
               {isHeadAnomalous && <div className="absolute top-[20%] left-1/2 ml-10 flex items-center"><div className="w-8 h-[1px] bg-red-500"></div><span className="text-[8px] bg-red-500/20 border border-red-500 text-red-300 px-1 py-0.5 rounded ml-1 animate-pulse">STRES TINGGI</span></div>}
               {isChestAnomalous && <div className="absolute top-[40%] right-1/2 mr-10 flex items-center justify-end"><span className="text-[8px] bg-red-500/20 border border-red-500 text-red-300 px-1 py-0.5 rounded mr-1 animate-pulse">BPM TINGGI</span><div className="w-8 h-[1px] bg-red-500"></div></div>}
               {isLungsAnomalous && <div className="absolute top-[48%] left-1/2 ml-10 flex items-center"><div className="w-8 h-[1px] bg-red-500"></div><span className="text-[8px] bg-red-500/20 border border-red-500 text-red-300 px-1 py-0.5 rounded ml-1 animate-pulse">SPO2 RENDAH</span></div>}
               {isBodyAnomalous && <div className="absolute top-[70%] left-1/2 ml-8 flex items-center"><div className="w-8 h-[1px] bg-red-500"></div><span className="text-[8px] bg-red-500/20 border border-red-500 text-red-300 px-1 py-0.5 rounded ml-1 animate-pulse">SUHU NAIK</span></div>}
            </div>
         </div>
         <div className="p-4 space-y-4 mt-2">
            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 flex items-center justify-between shadow-sm">
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Worker Wellness Index</p>
                 <p className="text-xs text-slate-500 mt-1">Integrasi Fisik & Mental (AI)</p>
               </div>
               <div className="flex justify-center items-end gap-1">
                 <span className={`text-4xl font-black ${w.wwi < 60 ? 'text-red-400' : 'text-white'}`}>{w.wwi}</span>
                 <span className="text-xs text-slate-500 pb-1">/100</span>
               </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
               <div className={`rounded-xl p-3 text-center border ${isChestAnomalous ? 'bg-red-900/30 border-red-500/50 text-red-300 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                 <Heart size={14} className="mx-auto mb-1 opacity-70"/>
                 <p className="text-sm font-black">{w.sensors.bpm}</p>
                 <p className="text-[8px] uppercase mt-1">BPM</p>
               </div>
               <div className={`rounded-xl p-3 text-center border ${isLungsAnomalous ? 'bg-red-900/30 border-red-500/50 text-red-300 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                 <Wind size={14} className="mx-auto mb-1 opacity-70"/>
                 <p className="text-sm font-black">{w.sensors.spo2}</p>
                 <p className="text-[8px] uppercase mt-1">SpO2</p>
               </div>
               <div className={`rounded-xl p-3 text-center border ${isHeadAnomalous ? 'bg-red-900/30 border-red-500/50 text-red-300 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                 <Zap size={14} className="mx-auto mb-1 opacity-70"/>
                 <p className="text-sm font-black">{w.sensors.gsr}</p>
                 <p className="text-[8px] uppercase mt-1">GSR</p>
               </div>
               <div className={`rounded-xl p-3 text-center border ${isBodyAnomalous ? 'bg-red-900/30 border-red-500/50 text-red-300 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                 <Thermometer size={14} className="mx-auto mb-1 opacity-70"/>
                 <p className="text-sm font-black">{w.sensors.temp}</p>
                 <p className="text-[8px] uppercase mt-1">Suhu</p>
               </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex justify-between items-center">
               <p className="text-xs text-slate-400 font-bold flex items-center gap-2"><FileText size={14}/> Analisis Teks NLP (PRS)</p>
               <span className={`text-[10px] font-bold px-2 py-1 rounded ${w.prs === 'Stabil' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400 animate-pulse'}`}>{w.prs}</span>
            </div>
            <div className="pt-4 border-t border-slate-800">
               <p className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Aksi Intervensi Cepat</p>
               <div className="flex gap-3">
                  <button onClick={() => handleIntervention(w.id, 2)} className="flex-1 bg-orange-600/20 border border-orange-500/50 text-orange-400 hover:bg-orange-600/40 text-xs font-bold py-3 rounded-xl shadow-sm transition-colors">Rotasi Tugas</button>
                  <button onClick={() => handleIntervention(w.id, 3)} className="flex-1 bg-red-600 text-white hover:bg-red-500 text-xs font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all">Evakuasi Medis</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const DatabaseDetailView = ({ activeDbWorker: w, setActiveDbWorker }) => {
  if (!w) return null;
  return (
    <div className="absolute inset-0 bg-slate-50 z-20 flex flex-col animate-in slide-in-from-right-full duration-200">
      <ScreenHeader title="Track Record Bulanan" onBack={() => setActiveDbWorker(null)} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-10">
         <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center text-slate-600"><User size={24}/></div>
            <div>
               <h2 className="text-lg font-bold text-slate-800">{w.name}</h2>
               <p className="text-xs text-slate-500">{w.role}</p>
            </div>
         </div>
         <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-[10px] text-blue-800 flex gap-2">
           <TrendingUp size={16} className="shrink-0"/>
           <p><strong>Insight AI:</strong> Tren kelelahan 6 bulan terakhir {w.history[5].avgWWI < 60 ? 'menunjukkan degradasi. Butuh cuti panjang.' : 'relatif stabil.'}</p>
         </div>
         <div className="space-y-3">
           {w.history.map((h, i) => (
             <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
               <div className="flex justify-between items-center mb-3">
                 <p className="font-bold text-sm text-slate-800">{h.month}</p>
                 {h.incidents > 0 
                   ? <span className="bg-red-100 text-red-600 text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><AlertTriangle size={10}/> {h.incidents} Insiden</span>
                   : <span className="bg-green-100 text-green-600 text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle size={10}/> Aman</span>}
               </div>
               <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-100 pt-3">
                 <div>
                   <p className="text-[8px] text-slate-400 uppercase font-bold">WWI</p>
                   <p className={`font-bold text-sm ${getWWITextColor(h.avgWWI)}`}>{h.avgWWI}</p>
                 </div>
                 <div>
                   <p className="text-[8px] text-slate-400 uppercase font-bold">Fisik</p>
                   <p className="font-bold text-sm text-slate-700">{h.avgPFI}</p>
                 </div>
                 <div>
                   <p className="text-[8px] text-slate-400 uppercase font-bold">Mental</p>
                   <p className={`font-bold text-xs mt-0.5 ${h.prsStatus === 'Stabil'?'text-green-600':'text-red-500'}`}>{h.prsStatus}</p>
                 </div>
               </div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

const ContactDetailView = ({ activeContactWorker: w, setActiveContactWorker, showMessage }) => {
  const [isCalling, setIsCalling] = useState(false);
  if (!w) return null;
  const aiRec = getAIRecommendation(w);

  const handleCall = () => {
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
      showMessage(`Log panggilan dengan ${w.name} telah disimpan.`, 'info');
    }, 2000);
  }

  return (
    <div className="absolute inset-0 bg-white z-20 flex flex-col animate-in slide-in-from-right-full duration-200">
      <ScreenHeader title="Panggilan Darurat" onBack={() => setActiveContactWorker(null)} />
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6 pb-20">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4 relative">
             <User size={40} className="text-slate-400"/>
             <div className={`absolute bottom-1 right-1 w-6 h-6 border-4 border-white rounded-full ${w.wwi < 60 ? 'bg-red-500' : 'bg-green-500'}`}></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 text-center">{w.name}</h2>
          <p className="text-sm text-slate-500 mb-8">{w.role}</p>
          <p className="text-3xl font-black text-slate-800 tracking-wider mb-10">{w.phone}</p>
          <div className="flex gap-4 w-full">
            <button onClick={handleCall} disabled={isCalling} className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl text-white font-bold transition-all shadow-md ${isCalling ? 'bg-slate-400' : 'bg-green-500 active:bg-green-600'}`}>
              <PhoneCall size={28} className={isCalling ? "animate-pulse" : ""} />
              <span className="text-xs">{isCalling ? 'Memanggil...' : 'VoIP Sistem'}</span>
            </button>
            <a href={`tel:${w.phone.replace(/[^0-9+]/g, '')}`} className="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl text-blue-700 bg-blue-50 font-bold border border-blue-200 active:bg-blue-100 shadow-sm">
              <Phone size={28} />
              <span className="text-xs">Seluler</span>
            </a>
          </div>
          {w.wwi < 60 && (
            <div className="mt-8 bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3 w-full">
              <Bot className="text-orange-600 shrink-0 mt-0.5" size={20}/>
              <p className="text-[11px] text-orange-800 leading-relaxed">
                <strong>Saran AI:</strong> {aiRec.desc}
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

const AlertsListView = ({ isAlertsListOpen, setIsAlertsListOpen, activeAlertsCount, activeAlertsList, setActiveDetailWorker, handleIntervention }) => {
  if (!isAlertsListOpen) return null;
  return (
    <div className="absolute inset-0 bg-slate-50 z-20 flex flex-col animate-in slide-in-from-bottom-full duration-200">
      <ScreenHeader title={`Peringatan Aktif (${activeAlertsCount})`} onBack={() => setIsAlertsListOpen(false)} />
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-10">
         <div className="bg-orange-600 text-white p-4 rounded-xl flex items-start gap-3 shadow-md mb-2">
           <BrainCircuit className="shrink-0 mt-0.5"/>
           <p className="text-[10px] leading-relaxed font-medium">Sistem telah mensintesis data fisik dan NLP IndoBERT untuk prioritas evakuasi/rotasi. Segera tindaklanjuti daftar di bawah.</p>
         </div>
         {activeAlertsList.map(w => {
           const aiRec = getAIRecommendation(w);
           return (
             <div key={w.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
               <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{w.name}</h4>
                    <p className="text-[10px] text-slate-500">WWI: <span className="font-bold text-red-500">{w.wwi}</span></p>
                  </div>
                  <button onClick={() => {setIsAlertsListOpen(false); setActiveDetailWorker(w);}} className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100">Buka Digital Twin</button>
               </div>
               <div className="bg-orange-50/50 p-3 flex justify-between items-center gap-2">
                  <p className="text-[10px] text-slate-600 line-clamp-2 pr-2"><strong>AI:</strong> {aiRec.action}</p>
                  <button onClick={() => handleIntervention(w.id, aiRec.level)} className="shrink-0 bg-orange-500 text-white px-3 py-1.5 text-[10px] font-bold rounded-lg shadow-sm">Aksi</button>
               </div>
             </div>
           )
         })}
      </div>
    </div>
  );
};

const BottomNav = ({ activeTab, setActiveTab, currentUser }) => {
  const isWorker = currentUser?.role === 'pekerja';
  return (
    <div className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-2 z-10 rounded-b-[2.5rem]">
       <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 p-2 ${activeTab==='home'?'text-blue-600':'text-slate-400'}`}>
         <Home size={22} className={activeTab==='home'?'fill-blue-100':''}/>
         <span className="text-[9px] font-bold">{isWorker ? 'Bio-Sync' : 'Live'}</span>
       </button>
       {isWorker ? (
          <>
            <button onClick={() => setActiveTab('aicoach')} className={`flex flex-col items-center gap-1 p-2 ${activeTab==='aicoach'?'text-blue-600':'text-slate-400'}`}>
              <Bot size={22} />
              <span className="text-[9px] font-bold">AI Coach</span>
            </button>
            <button onClick={() => setActiveTab('privacy')} className={`flex flex-col items-center gap-1 p-2 ${activeTab==='privacy'?'text-blue-600':'text-slate-400'}`}>
              <ShieldCheck size={22} />
              <span className="text-[9px] font-bold">Privasi</span>
            </button>
          </>
       ) : (
          <>
            <button onClick={() => setActiveTab('database')} className={`flex flex-col items-center gap-1 p-2 ${activeTab==='database'?'text-blue-600':'text-slate-400'}`}>
              <Database size={22} />
              <span className="text-[9px] font-bold">Database</span>
            </button>
            <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 p-2 ${activeTab==='chat'?'text-blue-600':'text-slate-400'}`}>
              <MessageSquare size={22} />
              <span className="text-[9px] font-bold">Kontak</span>
            </button>
          </>
       )}
       <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 p-2 ${activeTab==='profile'?'text-blue-600':'text-slate-400'}`}>
         <User size={22} className={activeTab==='profile'?'fill-blue-100':''}/>
         <span className="text-[9px] font-bold">Profil</span>
       </button>
    </div>
  );
};


// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [authMode, setAuthMode] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [usersDB, setUsersDB] = useState(defaultUsers);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'pekerja' });
  const [authError, setAuthError] = useState('');

  const [workers, setWorkers] = useState(initialWorkers);
  const [activeTab, setActiveTab] = useState('home'); 
  
  const [activeDetailWorker, setActiveDetailWorker] = useState(null); 
  const [activeDbWorker, setActiveDbWorker] = useState(null); 
  const [activeContactWorker, setActiveContactWorker] = useState(null); 
  const [isAlertsListOpen, setIsAlertsListOpen] = useState(false);

  const [appMessage, setAppMessage] = useState({ show: false, text: '', type: 'info' });
  const [isPrivacyPaused, setIsPrivacyPaused] = useState(false);

  const showMessage = (text, type = 'info') => {
    setAppMessage({ show: true, text, type });
    setTimeout(() => setAppMessage({ show: false, text: '', type: 'info' }), 3000);
  };

  const totalWorkers = workers.length;
  const avgWWI = (workers.reduce((acc, curr) => acc + curr.wwi, 0) / totalWorkers).toFixed(1);
  const activeAlertsCount = workers.filter(w => w.wwi < 60).length;
  const activeAlertsList = workers.filter(w => w.wwi < 60).sort((a,b) => a.wwi - b.wwi);

  const myWorkerData = currentUser?.role === 'pekerja' 
    ? workers.find(w => w.id === currentUser.linkedWorkerId) || workers[0] 
    : null;

  useEffect(() => {
    if (!currentUser) return; 
    const interval = setInterval(() => {
      setWorkers(prevWorkers => 
        prevWorkers.map(w => {
          if (currentUser.role === 'pekerja' && w.id === currentUser.linkedWorkerId && isPrivacyPaused) {
            return w;
          }
          return {
            ...w,
            sensors: {
              ...w.sensors,
              bpm: w.sensors.bpm + (Math.floor(Math.random() * 5) - 2),
              gsr: Math.max(0.1, +(w.sensors.gsr + (Math.random() * 0.2 - 0.1)).toFixed(2))
            }
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [currentUser, isPrivacyPaused]);

  const handleIntervention = (workerId, level) => {
    showMessage(`Protokol Intervensi Level ${level} berhasil dikirim ke lapangan!`, 'success');
  };

  const handleAuthInputChange = (e) => {
    const { name, value } = e.target;
    setAuthForm(prev => ({ ...prev, [name]: value }));
    setAuthError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!authForm.role || !authForm.email || !authForm.password) {
      setAuthError('Mohon isi semua kolom untuk masuk.');
      return;
    }

    // Bypass: Cari template user berdasarkan ROLE saja (Abaikan validasi email/password asli)
    const templateUser = [...usersDB].reverse().find(u => u.role === authForm.role);
    
    if (templateUser) {
      setCurrentUser({ ...templateUser, email: authForm.email }); 
      setActiveTab('home');
      setIsPrivacyPaused(false);
      setAuthForm({ name: '', email: '', password: '', role: 'pekerja' });
    } else {
      setAuthError('Gagal memuat profil sistem.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!authForm.name || !authForm.email || !authForm.password) {
      setAuthError('Semua kolom wajib diisi.'); return;
    }
    if (usersDB.some(u => u.email === authForm.email)) {
      setAuthError('Email ini sudah terdaftar.'); return;
    }
    const newUser = { 
      id: `U${Date.now()}`, 
      ...authForm, 
      phone: '', 
      avatar: null,
      linkedWorkerId: authForm.role === 'pekerja' ? `W-001` : null 
    };
    setUsersDB([...usersDB, newUser]);
    setCurrentUser(newUser);
    setActiveTab('home');
    setAuthForm({ name: '', email: '', password: '', role: 'pekerja' });
  };

  if (!currentUser) {
    return (
      <MobileFrame appMessage={appMessage}>
        <div className="flex-1 bg-slate-50 flex flex-col p-6 overflow-y-auto pt-12">
          <div className="flex flex-col items-center justify-center py-8">
             <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <ShieldAlert className="text-blue-600" size={32} />
             </div>
             <h1 className="text-2xl font-black text-slate-800 tracking-wider">WellGuard</h1>
             <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">Mobile Command Center</p>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-800 mb-6 text-center">
              {authMode === 'login' ? 'Masuk ke Sistem' : 'Pendaftaran Akun'}
            </h2>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg flex items-center gap-2">
                <AlertTriangle size={14} /> {authError}
              </div>
            )}

            <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
              
              {/* 1. Menu Pilihan Role (Paling Atas) */}
              <div>
                <div className="relative">
                  <Users size={16} className="absolute top-3 left-3 text-slate-400 pointer-events-none" />
                  <select name="role" value={authForm.role} onChange={handleAuthInputChange} className="w-full pl-10 pr-3 py-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white text-slate-700 appearance-none">
                    <option value="pekerja">{authMode === 'login' ? 'Masuk sebagai Pekerja' : 'Pekerja Lapangan / Operator'}</option>
                    <option value="supervisor">{authMode === 'login' ? 'Masuk sebagai Supervisor' : 'Supervisor Operasi'}</option>
                    <option value="medis">{authMode === 'login' ? 'Masuk sebagai Tim Medis' : 'Tim Medis / HSSE'}</option>
                  </select>
                  <ChevronLeft size={16} className="absolute top-3 right-3 text-slate-400 pointer-events-none transform -rotate-90" />
                </div>
              </div>

              {/* Kolom Nama (Hanya Register) */}
              {authMode === 'register' && (
                <div>
                  <div className="relative">
                    <User size={16} className="absolute top-3 left-3 text-slate-400 pointer-events-none" />
                    <input type="text" name="name" value={authForm.name} onChange={handleAuthInputChange} className="w-full pl-10 pr-3 py-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white" placeholder="Nama Lengkap" required />
                  </div>
                </div>
              )}
              
              {/* 2. Kolom Email */}
              <div>
                <div className="relative">
                  <Mail size={16} className="absolute top-3 left-3 text-slate-400 pointer-events-none" />
                  <input type="email" name="email" value={authForm.email} onChange={handleAuthInputChange} className="w-full pl-10 pr-3 py-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white" placeholder="Alamat Email" required />
                </div>
              </div>

              {/* 3. Kolom Kata Sandi */}
              <div>
                <div className="relative">
                  <Key size={16} className="absolute top-3 left-3 text-slate-400 pointer-events-none" />
                  <input type="password" name="password" value={authForm.password} onChange={handleAuthInputChange} className="w-full pl-10 pr-3 py-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white" placeholder="Kata Sandi" required />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors mt-2 shadow-sm">
                {authMode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              {authMode === 'login' 
                ? <p>Belum punya akun? <button onClick={() => setAuthMode('register')} className="text-blue-600 font-bold hover:underline">Daftar</button></p>
                : <p>Sudah punya akun? <button onClick={() => setAuthMode('login')} className="text-blue-600 font-bold hover:underline">Masuk</button></p>}
            </div>
          </div>

          {authMode === 'login' && (
            <div className="mt-8 p-4 bg-emerald-50/50 rounded-xl text-xs text-emerald-800 border border-emerald-100/50 shadow-sm">
              <p className="font-bold mb-2 flex items-center gap-1.5"><ShieldCheck size={14}/> Auto-Bypass Mode Aktif</p>
              <p className="mb-2 text-emerald-700/80 leading-relaxed">Anda dapat masuk menggunakan <b>Email & Password ngasal</b> (apa saja bisa). Sistem akan meloloskan Anda secara otomatis asalkan kolom terisi.</p>
            </div>
          )}
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame appMessage={appMessage}>
       {/* Role-Based Tabs */}
       {currentUser.role === 'pekerja' ? (
          <>
            {activeTab === 'home' && <HomeTabWorker myWorkerData={myWorkerData} isPrivacyPaused={isPrivacyPaused} currentUser={currentUser} />}
            {activeTab === 'aicoach' && <CoachTabWorker myWorkerData={myWorkerData} showMessage={showMessage} currentUser={currentUser} />}
            {activeTab === 'privacy' && <PrivacyTabWorker isPrivacyPaused={isPrivacyPaused} setIsPrivacyPaused={setIsPrivacyPaused} showMessage={showMessage} currentUser={currentUser} />}
            {activeTab === 'profile' && <ProfileTab currentUser={currentUser} setCurrentUser={setCurrentUser} setUsersDB={setUsersDB} showMessage={showMessage} />}
          </>
       ) : (
          <>
            {activeTab === 'home' && <HomeTabAdmin avgWWI={avgWWI} totalWorkers={totalWorkers} activeAlertsCount={activeAlertsCount} activeAlertsList={activeAlertsList} setIsAlertsListOpen={setIsAlertsListOpen} setActiveDetailWorker={setActiveDetailWorker} currentUser={currentUser} />}
            {activeTab === 'database' && <DatabaseTab workers={workers} setActiveDbWorker={setActiveDbWorker} currentUser={currentUser} />}
            {activeTab === 'chat' && <ChatTab workers={workers} setActiveContactWorker={setActiveContactWorker} currentUser={currentUser} />}
            {activeTab === 'profile' && <ProfileTab currentUser={currentUser} setCurrentUser={setCurrentUser} setUsersDB={setUsersDB} showMessage={showMessage} />}
          </>
       )}

       <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} />

       {/* Overlays / Modals */}
       <AlertsListView isAlertsListOpen={isAlertsListOpen} setIsAlertsListOpen={setIsAlertsListOpen} activeAlertsCount={activeAlertsCount} activeAlertsList={activeAlertsList} setActiveDetailWorker={setActiveDetailWorker} handleIntervention={handleIntervention} />
       <WorkerDetailView activeDetailWorker={activeDetailWorker} setActiveDetailWorker={setActiveDetailWorker} handleIntervention={handleIntervention} />
       <DatabaseDetailView activeDbWorker={activeDbWorker} setActiveDbWorker={setActiveDbWorker} />
       <ContactDetailView activeContactWorker={activeContactWorker} setActiveContactWorker={setActiveContactWorker} showMessage={showMessage} />
    </MobileFrame>
  );
}