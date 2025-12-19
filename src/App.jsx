import React, { useState, useMemo, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Users, Home, TrendingUp, Briefcase, MapPin, Activity, RefreshCcw, X, Info, Layers, EyeOff, List, PieChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const translations = {
  en: {
    title: "PPIKN 2025 Dashboard",
    subtitle: "Directorate of Data and AI - OIKN Statistics",
    refresh: "Refresh Data",
    totalPop: "Total Population",
    totalHH: "Total Households",
    depRatio: "Dependency Ratio",
    popPyramid: "Population Pyramid",
    male: "Male",
    female: "Female",
    agingIndex: "Aging Index",
    agingDesc: "Low aging, high youth density",
    sexRatio: "Sex Ratio",
    sexRatioDesc: "Males per 100 Females",
    econTitle: "Employment Intelligence",
    econMacro: "Sector View",
    econMicro: "Raw Job View",
    econDesc: "Toggle between high-level economic sectors or granular workforce categories.",
    spatialTitle: "Spatial Intelligence",
    spatialNarrative: "High concentration detected: 50% of the population resides in just {count} villages. Primary clusters are {v1} and {v2}.",
    hotspots: "Critical Hotspots",
    hotspotsDef: "Villages where population density and service pressure are highest.",
    desaCore: "Monitoring Units",
    desaCoreDef: "Total administrative villages within the OIKN regional framework.",
    spatialMapTitle: "IKN Residency & Density Map",
    spatialMapDesc: "Distinguishing between 'Family Hubs' and 'Worker Transit' zones based on household size.",
    footer: "© 2025 PPIKN Analysis Platform | OIKN Data Analytics",
    close: "Close",
    details: "Metric Details",
    popExpl: "Total recorded individuals across the OIKN monitoring zone.",
    hhExpl: "Total unique family registration units (KK).",
    depExpl: "Ratio of young/elderly vs working-age population.",
    agingExpl: "Elderly population per 100 children.",
    sexExpl: "Gender balance in the regional workforce.",
    residentialLabel: "Residency Type",
    densityLabel: "Avg Household Size",
    sectorPrimary: "Primary (Agri/Mining)",
    sectorSecondary: "Secondary (Industry/Const)",
    sectorTertiary: "Tertiary (Services)",
    sectorUnknown: "Data Visibility Gap",
    familyType: "Pusat Keluarga",
    transitType: "Zona Transit Pekerja",
    jobLabels: {
      "Perdagangan besar dan eceran, reparasi dan perawatan mobil dan sepeda motor": "Retail & Repair",
      "Perkebunan": "Plantations",
      "Pertambangan dan penggalian": "Mining",
      "Konstruksi": "Construction",
      "Penyediaan akomodasi dan penyediaan makan minum": "Hospitality",
      "Industri pengolahan": "Manufacturing",
      "Pendidikan": "Education",
      "Administrasi pemerintahan, pertahanan, dan jaminan sosial wajib": "Gov & Defense"
    }
  },
  id: {
    title: "Dasbor PPIKN 2025",
    subtitle: "Direktorat Data dan AI - Statistik OIKN",
    refresh: "Perbarui Data",
    totalPop: "Total Populasi",
    totalHH: "Total Rumah Tangga",
    depRatio: "Rasio Ketergantungan",
    popPyramid: "Piramida Penduduk",
    male: "Laki-laki",
    female: "Perempuan",
    agingIndex: "Indeks Penuaan",
    agingDesc: "Penuaan rendah, kepadatan pemuda tinggi",
    sexRatio: "Rasio Jenis Kelamin",
    sexRatioDesc: "Laki-laki per 100 Perempuan",
    econTitle: "Intelijen Pekerjaan",
    econMacro: "Tampilan Sektor",
    econMicro: "Tampilan Mentah",
    econDesc: "Beralih antara sektor ekonomi tingkat tinggi atau kategori tenaga kerja granular.",
    spatialTitle: "Intelijen Spasial",
    spatialNarrative: "Konsentrasi tinggi terdeteksi: 50% populasi tinggal di hanya {count} desa. Klaster utama adalah {v1} dan {v2}.",
    hotspots: "Titik Panas Kritis",
    hotspotsDef: "Desa dengan kepadatan penduduk dan tekanan layanan tertinggi.",
    desaCore: "Unit Pemantauan",
    desaCoreDef: "Total desa administratif dalam kerangka regional OIKN.",
    spatialMapTitle: "Peta Hunian & Kepadatan IKN",
    spatialMapDesc: "Membedakan antara 'Pusat Keluarga' dan zona 'Transit Pekerja' berdasarkan ukuran rumah tangga.",
    footer: "© 2025 Platform Analisis PPIKN | OIKN Data Analytics",
    close: "Tutup",
    details: "Detail Metrik",
    popExpl: "Total individu yang tercatat di zona pemantauan OIKN.",
    hhExpl: "Total unit pendaftaran keluarga unik (KK).",
    depExpl: "Rasio populasi muda/lansia vs usia kerja.",
    agingExpl: "Populasi lansia per 100 anak-anak.",
    sexExpl: "Keseimbangan gender dalam tenaga kerja regional.",
    residentialLabel: "Tipe Hunian",
    densityLabel: "Rata-rata Ukuran KK",
    sectorPrimary: "Primer (Agri/Tambang)",
    sectorSecondary: "Sekunder (Industri/Konst)",
    sectorTertiary: "Tersier (Jasa)",
    sectorUnknown: "Celah Visibilitas Data",
    familyType: "Pusat Keluarga",
    transitType: "Zona Transit Pekerja",
    jobLabels: {
      "Perdagangan besar dan eceran, reparasi dan perawatan mobil dan sepeda motor": "Perdagangan & Reparasi",
      "Perkebunan": "Perkebunan",
      "Pertambangan dan penggalian": "Pertambangan",
      "Konstruksi": "Konstruksi",
      "Penyediaan akomodasi dan penyediaan makan minum": "Akomodasi & Kuliner",
      "Industri pengolahan": "Industri Pengolahan",
      "Pendidikan": "Pendidikan",
      "Administrasi pemerintahan, pertahanan, dan jaminan sosial wajib": "Pemerintahan & Pertahanan"
    }
  }
};

// --- Sub-components ---
const Modal = ({ isOpen, onClose, title, content, t }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-600" /> {t.details}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-slate-500 cursor-pointer" />
          </button>
        </div>
        <div className="p-8">
          <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">{title}</p>
          <p className="text-slate-600 leading-relaxed text-lg">{content}</p>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-95 cursor-pointer">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

const KPICard = React.memo(({ title, value, icon: Icon, colorClass, onClick }) => (
  <button onClick={onClick} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:border-indigo-400 hover:shadow-md active:scale-[0.98] text-left w-full group cursor-pointer">
    <div className={`p-4 rounded-2xl ${colorClass} transition-transform group-hover:scale-110 cursor-pointer`}>
      <Icon className="w-10 h-10 text-white cursor-pointer" />
    </div>
    <div className="cursor-pointer">
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider cursor-pointer">{title}</p>
      <p className="text-3xl font-black text-slate-900 mt-1 cursor-pointer">{value}</p>
    </div>
  </button>
));

const Header = ({ t, lang, setLang, onRefresh, isRefreshing }) => (
  <header className="mb-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
    <div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t.title}</h1>
      <p className="text-lg text-slate-500 mt-2">{t.subtitle}</p>
    </div>
    <div className="flex items-center gap-4">
      <button onClick={onRefresh} disabled={isRefreshing} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer">
        <RefreshCcw className={`w-4 h-4 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
        {t.refresh}
      </button>
      <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
        {['en', 'id'].map((l) => (
          <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded-md text-sm font-medium transition-all cursor-pointer ${lang === l ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>{l.toUpperCase()}</button>
        ))}
      </div>
    </div>
  </header>
);

const Reveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = React.useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(domRef.current);
        }
      });
    }, { threshold: 0.1 });

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  return (
    <div
      ref={domRef}
      className={`reveal ${isVisible ? 'visible' : ''} ${delay ? `reveal-delay-${delay}` : ''} ${className}`}
    >
      {children}
    </div>
  );
};

const App = () => {
  const [lang, setLang] = useState('en');
  const [data, setData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [useMacroJobs, setUseMacroJobs] = useState(true);

  const t = translations[lang];

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/data/dashboard_data.json');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const pyramidData = useMemo(() => {
    if (!data) return null;
    return {
      labels: data.ageLabels,
      datasets: [
        { label: t.male, data: data.ageData.male.map(v => -v), backgroundColor: '#0ea5e9', borderRadius: 4 },
        { label: t.female, data: data.ageData.female, backgroundColor: '#f472b6', borderRadius: 4 }
      ]
    };
  }, [t, data]);

  const jobChartData = useMemo(() => {
    if (!data) return null;

    if (useMacroJobs) {
      const s = data.sectors;
      return {
        labels: [t.sectorPrimary, t.sectorSecondary, t.sectorTertiary, t.sectorUnknown],
        datasets: [{
          data: [s.Primary, s.Secondary, s.Tertiary, s.Unknown],
          backgroundColor: ['#10b981', '#f59e0b', '#6366f1', '#94a3b8'],
          borderWidth: 0,
          borderRadius: 8
        }]
      };
    } else {
      return {
        labels: data.microJobs.map(j => t.jobLabels[j.nama_jenis_pekerjaan] || j.nama_jenis_pekerjaan),
        datasets: [{
          label: t.totalPop,
          data: data.microJobs.map(j => j.jumlah),
          backgroundColor: '#6366f1',
          borderRadius: 6,
        }]
      };
    }
  }, [t, data, useMacroJobs]);

  const spatialNarrative = useMemo(() => {
    if (!data) return "";
    return t.spatialNarrative
      .replace('{count}', data.summary.pareto_concentration)
      .replace('{v1}', data.summary.top_villages[0])
      .replace('{v2}', data.summary.top_villages[1]);
  }, [t, data]);

  if (!data) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-4">
        <RefreshCcw className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium">Deep Data Synchronization...</p>
      </div>
    </div>
  );

  const { summary, villages } = data;

  return (
    <div className="min-h-screen bg-slate-50 w-full p-8 font-sans transition-colors duration-500">
      <Header t={t} lang={lang} setLang={setLang} onRefresh={fetchData} isRefreshing={isRefreshing} />

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Reveal><KPICard title={t.totalPop} value={summary.total_population.toLocaleString()} icon={Users} colorClass="bg-blue-600" onClick={() => setActiveModal('pop')} /></Reveal>
        <Reveal delay={100}><KPICard title={t.totalHH} value={summary.total_households.toLocaleString()} icon={Home} colorClass="bg-indigo-600" onClick={() => setActiveModal('hh')} /></Reveal>
        <Reveal delay={200}><KPICard title={t.depRatio} value={`${summary.dependency_ratio}%`} icon={TrendingUp} colorClass="bg-amber-600" onClick={() => setActiveModal('dep')} /></Reveal>

        <Reveal className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 h-full">
            <div className="mb-8"><h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Activity className="text-sky-500" /> {t.popPyramid}</h2></div>
            <div className="h-[400px]">
              {pyramidData && <Bar data={pyramidData} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true, ticks: { callback: (v) => Math.abs(v) } }, y: { stacked: true } }, plugins: { legend: { display: false } } }} />}
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col justify-center space-y-8 text-center h-full">
            <button onClick={() => setActiveModal('age')} className="hover:bg-slate-50 p-4 rounded-xl transition-all group cursor-pointer">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1 group-hover:text-indigo-600 cursor-pointer">{t.agingIndex}</p>
              <p className="text-5xl font-black text-slate-800 cursor-pointer">{summary.aging_index}</p>
              <p className="text-xs text-slate-400 mt-2 cursor-pointer">{t.agingDesc}</p>
            </button>
            <div className="border-t border-slate-100 pt-8">
              <button onClick={() => setActiveModal('sex')} className="hover:bg-slate-50 p-4 rounded-xl transition-all group w-full cursor-pointer">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1 group-hover:text-indigo-600 cursor-pointer">{t.sexRatio}</p>
                <p className="text-5xl font-black text-slate-800 cursor-pointer">{summary.sex_ratio}</p>
                <p className="text-xs text-slate-400 mt-2 cursor-pointer">{summary.sex_ratio}:100 {t.sexRatioDesc}</p>
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Briefcase className="text-indigo-500" /> {t.econTitle}</h2>
                <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setUseMacroJobs(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${useMacroJobs ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    <PieChart className="w-3.5 h-3.5" /> {t.econMacro}
                  </button>
                  <button
                    onClick={() => setUseMacroJobs(false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${!useMacroJobs ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    <List className="w-3.5 h-3.5" /> {t.econMicro}
                  </button>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-1 mb-8">{t.econDesc}</p>
              <div className="h-[300px]"><Bar data={jobChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } } }} /></div>
            </div>
            <div className="flex flex-col justify-center space-y-6 bg-slate-50 p-6 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Primary Workforce</p>
                <p className="text-3xl font-black text-emerald-600">{summary.primary_workforce_pct}%</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><EyeOff className="w-3 h-3" /> Data Visibility Gap</p>
                <p className="text-3xl font-black text-slate-400">{summary.data_visibility_gap}%</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col h-full relative">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-1"><MapPin className="text-indigo-500" /> {t.spatialMapTitle}</h2>
              <p className="text-slate-400 text-sm mb-6">{t.spatialMapDesc}</p>
              <div className="flex-grow w-full rounded-xl border border-slate-200 overflow-hidden shadow-inner relative min-h-[460px]">
                <div className="absolute inset-0">
                  <MapContainer center={[-0.92, 116.95]} zoom={11} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {villages.map((v, i) => (
                      <CircleMarker key={i} center={[v.lat, v.lng]} radius={v.pop / 650} pathOptions={{ fillColor: v.type === 'Family' ? '#6366f1' : '#f59e0b', color: v.type === 'Family' ? '#4338ca' : '#d97706', weight: 1, fillOpacity: 0.6 }}>
                        <Popup>
                          <div className="text-sm font-sans">
                            <strong className="text-indigo-600 block text-base mb-1">{v.name}</strong>
                            <div className="flex flex-col gap-1 border-t border-slate-100 pt-1">
                              <span>{t.totalPop}: <strong>{v.pop.toLocaleString()}</strong></span>
                              <span>{t.residentialLabel}: <strong className={v.type === 'Family' ? 'text-indigo-600' : 'text-amber-600'}>{v.type === 'Family' ? t.familyType : t.transitType}</strong></span>
                              <span>{t.densityLabel}: <strong>{v.density}</strong></span>
                            </div>
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                  </MapContainer>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col shadow-xl h-full">
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Layers className="text-indigo-400" /> {t.spatialTitle}</h3>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] px-10 py-10 mb-4 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all"></div>

                  <div className="mb-10">
                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em] mb-4">{lang === 'en' ? 'Concentration Alert' : 'Peringatan Konsentrasi'}</p>

                    <div className="flex items-center gap-6 mb-4">
                      <span className="text-7xl font-black text-white tracking-tighter leading-none">50%</span>
                      <div className="bg-indigo-600/40 px-5 py-4 rounded-3xl border border-indigo-400/30 text-center min-w-[70px] backdrop-blur-md shadow-lg">
                        <p className="text-3xl font-black text-white leading-none mb-1.5">{summary.pareto_concentration}</p>
                        <p className="text-indigo-200 text-[9px] font-black uppercase tracking-widest leading-none">{lang === 'en' ? 'Hubs' : 'Desa'}</p>
                      </div>
                    </div>

                    <div className="text-slate-400">
                      <p className="text-[11px] font-black uppercase tracking-[0.1em]">{lang === 'en' ? 'OF TOTAL POPULATION' : 'DARI TOTAL POPULASI'}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 mb-1">
                      <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div> {summary.pareto_concentration} {lang === 'en' ? 'Concentrated Villages' : 'Desa Terkonsentrasi'}</span>
                      <span>{summary.desa_core} {lang === 'en' ? 'Total Units' : 'Total Desa'}</span>
                    </div>
                    <div className="h-4 bg-slate-800/50 rounded-full p-1 border border-white/5 backdrop-blur-md">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-sky-400 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-1000 ease-in-out"
                        style={{ width: `${(summary.pareto_concentration / summary.desa_core) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-slate-400 text-[13px] leading-relaxed mt-10 border-t border-white/5 pt-8 italic font-medium">
                    {lang === 'en' ? 'Severe concentration detected: half the region resides in small subsets of villages.' : 'Konsentrasi ekstrem terdeteksi di mana separuh total populasi terpadat di sebagian kecil desa.'}
                  </p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                {[{ l: t.hotspots, v: summary.hotspots, d: t.hotspotsDef, c: 'bg-rose-500/20 border-rose-500/40' }, { l: t.desaCore, v: summary.desa_core, d: t.desaCoreDef, c: 'bg-indigo-500/20 border-indigo-500/40' }].map((stat, i) => (
                  <div key={i} className={`p-5 rounded-2xl border ${stat.c}`}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">{stat.l}</p>
                      <p className="text-3xl font-black text-white leading-none">{stat.v}</p>
                    </div>
                    <p className="text-slate-400 text-[13px] border-t border-white/10 pt-3 leading-relaxed">{stat.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </main>
      <footer className="mt-16 text-center text-slate-400 text-sm pb-8 border-t border-slate-200 pt-8">{t.footer}</footer>
      <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={activeModal ? (activeModal === 'pop' ? t.totalPop : activeModal === 'hh' ? t.totalHH : activeModal === 'dep' ? t.depRatio : activeModal === 'age' ? t.agingIndex : t.sexRatio) : ""} content={activeModal ? (activeModal === 'pop' ? t.popExpl : activeModal === 'hh' ? t.hhExpl : activeModal === 'dep' ? t.depExpl : activeModal === 'age' ? t.agingExpl : t.sexExpl) : ""} t={t} />
    </div>
  );
};

export default App;
