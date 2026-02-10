import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Database, Server, Trophy, Users, RefreshCw, AlertCircle } from 'lucide-react';

function App() {
  // Initialize with empty arrays to prevent crashes
  const [health, setHealth] = useState({ status: 'Unknown' });
  const [staticSports, setStaticSports] = useState([]);
  const [dbSports, setDbSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg('');
    
    try {
      // 1. Check Health
      try {
        const healthRes = await axios.get('/api/health');
        setHealth(healthRes.data || { status: 'Unknown' });
      } catch (e) { console.warn("Health check failed"); }

      // 2. Fetch Static Data
      try {
        const staticRes = await axios.get('/api/sports');
        // CRITICAL: Only set data if it is truly an array
        if (Array.isArray(staticRes.data)) {
          setStaticSports(staticRes.data);
        } else {
          console.error("Static API returned non-array:", staticRes.data);
          setStaticSports([]); 
        }
      } catch (e) { console.warn("Static fetch failed"); }

      // 3. Fetch DB Data
      try {
        const dbRes = await axios.get('/api/sports/db');
        if (Array.isArray(dbRes.data)) {
          setDbSports(dbRes.data);
        } else {
          setDbSports([]);
        }
      } catch (e) { console.warn("DB fetch failed"); }

    } catch (err) {
      console.error("Global Error:", err);
      setErrorMsg("Failed to connect to Backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      
      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Sports Analytics
          </h1>
          <p className="text-slate-400 mt-2">DevOps Containerization Demo</p>
        </div>

        <div className="flex gap-4">
          <StatusBadge 
            icon={<Activity size={18} />} 
            label="API Health" 
            status={health?.status === 'OK' ? 'success' : 'error'} 
          />
          <button onClick={fetchData} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        
        {/* SECTION 1: STATIC DATA */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Server className="text-blue-400" />
            <h2 className="text-2xl font-semibold">Public Directory</h2>
          </div>
          
          {/* SAFETY CHECK: Check if array exists and has items */}
          {Array.isArray(staticSports) && staticSports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staticSports.map((sport, idx) => (
                <SportCard key={idx} sport={sport} type="static" />
              ))}
            </div>
          ) : (
             <div className="p-6 bg-slate-800 rounded-xl text-slate-400 text-center">
               No static data available. Is the backend running?
             </div>
          )}
        </section>

        {/* SECTION 2: DATABASE DATA */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Database className="text-purple-400" />
            <h2 className="text-2xl font-semibold">Premium Records (DB)</h2>
          </div>

          {Array.isArray(dbSports) && dbSports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbSports.map((sport, idx) => (
                <SportCard key={sport._id || idx} sport={sport} type="db" />
              ))}
            </div>
          ) : (
            <div className="bg-red-900/20 border border-red-800 p-6 rounded-xl flex items-center gap-4 text-red-200">
              <AlertCircle size={24} />
              <div>
                <p className="font-bold">Database Disconnected or Empty</p>
                <p className="text-sm opacity-80">Check your MongoDB container connection.</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// --- COMPONENTS ---
const StatusBadge = ({ icon, label, status }) => {
  const color = status === 'success' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20';
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${color}`}>
      {icon} <span className="font-medium text-sm">{label}</span>
    </div>
  );
};

const SportCard = ({ sport, type }) => {
  const isDb = type === 'db';
  return (
    <div className={`relative overflow-hidden rounded-xl p-6 border ${isDb ? 'bg-slate-800 border-purple-500/30' : 'bg-slate-800 border-slate-700'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${isDb ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
          <Trophy size={24} />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-1">{sport.name}</h3>
      <div className="flex items-center gap-2 text-slate-400 text-sm mt-4">
        <Users size={16} /> <span>{sport.players} Players</span>
      </div>
    </div>
  );
};

export default App;