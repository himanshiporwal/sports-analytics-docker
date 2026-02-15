import { useState, useEffect } from "react";
import axios from "axios";
import {
  Activity,
  Database,
  Server,
  Trophy,
  Tag,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

function App() {
  // Safe defaults
  const [health, setHealth] = useState({ status: "Unknown" });
  const [staticSports, setStaticSports] = useState([]);
  const [dbSports, setDbSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      // 1) Health
      try {
        const healthRes = await axios.get('http://localhost:5000/api/health')

        setHealth(healthRes.data || { status: "Unknown" });
      } catch (e) {
        console.warn("Health check failed", e);
        setHealth({ status: "Down" });
      }

      // 2) Static sports
      try {
        const staticRes = await axios.get("/api/sports");
        console.log("STATIC:", staticRes.data);

        if (Array.isArray(staticRes.data)) {
          setStaticSports(staticRes.data);
        } else {
          setStaticSports([]);
        }
      } catch (e) {
        console.warn("Static fetch failed", e);
        setStaticSports([]);
      }

      // 3) DB sports
      try {
        const dbRes = await axios.get("/api/sports/db");
        console.log("DB:", dbRes.data);

        if (Array.isArray(dbRes.data)) {
          setDbSports(dbRes.data);
        } else {
          setDbSports([]);
        }
      } catch (e) {
        console.warn("DB fetch failed", e);
        setDbSports([]);
      }
    } catch (err) {
      console.error("Global Error:", err);
      setErrorMsg("Failed to connect to Backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apiOk = health?.status === "OK";

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-8 font-sans">
      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Sports Analytics
          </h1>
          <p className="text-slate-400 mt-2">DevOps Containerization Demo</p>
          <p className="text-slate-500 text-sm mt-1">
            Backend: <span className="text-slate-300">/api/health</span>,{" "}
            <span className="text-slate-300">/api/sports</span>,{" "}
            <span className="text-slate-300">/api/sports/db</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge
            icon={<Activity size={18} />}
            label={`API Health: ${health?.status ?? "Unknown"}`}
            status={apiOk ? "success" : "error"}
          />

          <button
            onClick={fetchData}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
            title="Refresh"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {/* ERROR MESSAGE */}
      {errorMsg ? (
        <div className="max-w-6xl mx-auto mb-8 bg-red-900/20 border border-red-800 p-4 rounded-xl flex items-center gap-3 text-red-200">
          <AlertCircle size={22} />
          <div>
            <p className="font-semibold">{errorMsg}</p>
            <p className="text-sm opacity-80">
              Check docker compose logs and Vite proxy configuration.
            </p>
          </div>
        </div>
      ) : null}

      <main className="max-w-6xl mx-auto space-y-12">
        {/* SECTION 1: STATIC */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <Server className="text-blue-400" />
            <h2 className="text-2xl font-semibold">Public Directory (Static)</h2>
          </div>

          {Array.isArray(staticSports) && staticSports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staticSports.map((sport, idx) => (
                <SportCard
                  key={sport._id || `${sport.name || "static"}-${idx}`}
                  sport={sport}
                  type="static"
                />
              ))}
            </div>
          ) : (
            <EmptyBox text="No static data available. Is /api/sports returning an array?" />
          )}
        </section>

        {/* SECTION 2: DB */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <Database className="text-purple-400" />
            <h2 className="text-2xl font-semibold">Premium Records (MongoDB)</h2>
          </div>

          {Array.isArray(dbSports) && dbSports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbSports.map((sport, idx) => (
                <SportCard key={sport._id || `db-${idx}`} sport={sport} type="db" />
              ))}
            </div>
          ) : (
            <div className="bg-red-900/20 border border-red-800 p-6 rounded-xl flex items-center gap-4 text-red-200">
              <AlertCircle size={24} />
              <div>
                <p className="font-bold">Database Empty / Not Loaded</p>
                <p className="text-sm opacity-80">
                  Check Mongo container + seed data, and confirm /api/sports/db returns array.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* ---------------- Components ---------------- */

const StatusBadge = ({ icon, label, status }) => {
  const cls =
    status === "success"
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : "text-red-400 bg-red-500/10 border-red-500/20";
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${cls}`}>
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
};

const EmptyBox = ({ text }) => (
  <div className="p-6 bg-slate-800 rounded-xl text-slate-400 text-center border border-slate-700">
    {text}
  </div>
);

const SportCard = ({ sport, type }) => {
  const isDb = type === "db";

  // Support both formats:
  // - DB: {name, category, premium}
  // - Static: could be any shape; try to read name/category if present
  const name = sport?.name ?? "Unnamed Sport";
  const category = sport?.category ?? sport?.type ?? "Unknown";
  const premium = Boolean(sport?.premium);

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-6 border ${
        isDb ? "bg-slate-800 border-purple-500/30" : "bg-slate-800 border-slate-700"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-lg ${
            isDb ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"
          }`}
        >
          <Trophy size={24} />
        </div>

        {isDb ? (
          <span
            className={`text-xs px-2 py-1 rounded-lg border ${
              premium
                ? "border-purple-500/30 bg-purple-500/10 text-purple-200"
                : "border-slate-600 bg-slate-700/30 text-slate-200"
            }`}
          >
            {premium ? "Premium" : "Free"}
          </span>
        ) : (
          <span className="text-xs px-2 py-1 rounded-lg border border-slate-600 bg-slate-700/30 text-slate-200">
            Static
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold mb-2">{name}</h3>

      <div className="flex items-center gap-2 text-slate-300 text-sm">
        <Tag size={16} className={isDb ? "text-purple-300" : "text-blue-300"} />
        <span className="opacity-90">{category}</span>
      </div>

      {/* Optional: show mongo id */}
      {isDb && sport?._id ? (
        <p className="text-xs text-slate-500 mt-4 break-all">id: {sport._id}</p>
      ) : null}
    </div>
  );
};

export default App;
