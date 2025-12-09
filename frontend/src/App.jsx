// frontend/src/App.jsx
import { useState } from "react";
import Navbar from "./components/Navbar"; // see note below if this errors

export default function App(){
  const [resp,setResp]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [form,setForm]=useState({
    soil:"clay",
    area:1.5,
    budget:5000,
    location:"Patna,IN"
  });

  // fertilizer calculator form state
  const [fertForm,setFertForm] = useState({ 
    crop: "Maize", 
    soil: "loamy", 
    area: 1 
  });
  const [fertResult, setFertResult] = useState(null);
  const [fertLoading, setFertLoading] = useState(false);
  const [fertError, setFertError] = useState("");

  // advisory form state
  const [advForm,setAdvForm] = useState({ 
    name:"", 
    village:"", 
    crop:"Maize", 
    soil:"clay", 
    area:1, 
    location:"Patna,IN", 
    extra:"" 
  });
  const [advResult, setAdvResult] = useState(null);
  const [advLoading, setAdvLoading] = useState(false);

  async function runDemo(){
    setError(""); setLoading(true);
    try{
      const r = await fetch("http://localhost:5000/api/demo", { cache: "no-store" });
      if (!r.ok) throw new Error(`Server ${r.status}`);
      const j = await r.json();
      setResp(j ?? null);
    } catch (err) {
      setResp(null); setError(err.message || "Unknown error");
      console.error("runDemo error:", err);
    } finally { setLoading(false); }
  }

  async function submitRecommend(e){
    e.preventDefault();
    setError(""); setLoading(true);
    try{
      const r = await fetch("http://localhost:5000/api/recommend", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form), cache:"no-store"
      });
      if(!r.ok) throw new Error(`Server ${r.status}`);
      setResp(await r.json());
    } catch(err){ setResp(null); setError(err.message || "Unknown error"); console.error("submitRecommend", err) }
    finally{ setLoading(false); }
  }

  // Fertilizer calc handler
  async function runFertilizerCalc(e){
    e.preventDefault();
    setFertError(""); setFertLoading(true); setFertResult(null);
    try{
      const r = await fetch("http://localhost:5000/api/fertilizer", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(fertForm),
        cache: "no-store"
      });
      if(!r.ok) throw new Error(`Server ${r.status}`);
      const j = await r.json();
      setFertResult(j);
    } catch(err){
      setFertError(err.message || "Unknown error"); console.error("fertErr", err);
    } finally {
      setFertLoading(false);
    }
  }

  // Advisory handler (calls /api/advisory)
  async function runAdvisory(e){
    e.preventDefault();
    setAdvResult(null); setAdvLoading(true);
    try{
      const r = await fetch("http://localhost:5000/api/advisory", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify(advForm),
        cache: "no-store"
      });
      if(!r.ok) throw new Error(`Server ${r.status}`);
      const j = await r.json();
      setAdvResult(j);
    } catch(err){
      setAdvResult({ error: err.message || "Unknown error" });
      console.error("advisory err", err)
    } finally {
      setAdvLoading(false);
    }
  }

  // small helper to download current recommendation JSON
  function downloadJSON(filename = "recommendation.json", data = null){
    const blob = new Blob([JSON.stringify(data ?? resp, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-6 text-center">Agro-Mitra — Demo</h1>

        {/* Demo / Recommendation controls */}
        <div className="mb-6 flex gap-3">
          <button onClick={runDemo} disabled={loading} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white">
            {loading ? "Working..." : "One-Click Demo"}
          </button>
          <button onClick={() => downloadJSON()} className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-white">
            Download JSON
          </button>
        </div>

        <form onSubmit={submitRecommend} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Soil</label>
            <select value={form.soil} onChange={e=>setForm({...form,soil:e.target.value})} className="w-full p-2 rounded-md bg-gray-800 border border-gray-700">
              <option value="loamy">Loamy</option>
              <option value="sandy">Sandy</option>
              <option value="clay">Clay</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Area (ha)</label>
            <input type="number" value={form.area} onChange={e=>setForm({...form,area:Number(e.target.value)})} className="w-full p-2 rounded-md bg-gray-800 border border-gray-700"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Budget (₹)</label>
            <input type="number" value={form.budget} onChange={e=>setForm({...form,budget:Number(e.target.value)})} className="w-full p-2 rounded-md bg-gray-800 border border-gray-700"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input type="text" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} className="w-full p-2 rounded-md bg-gray-800 border border-gray-700"/>
          </div>

          <div className="sm:col-span-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white">{loading ? "Working..." : "Get Recommendations"}</button>
          </div>
        </form>

        <div className="space-y-4 mb-6">
          {error && <div className="bg-red-900 text-red-100 p-3 rounded">{error}</div>}
          {!loading && !resp && !error && <div className="text-gray-400">No data yet. Click <strong>One-Click Demo</strong> or submit the form.</div>}

          {resp && (
            <>
              {/* Weather card placed inside requested container */}
              <div className="bg-black/30 p-5 rounded-lg border border-white/10 mt-4">
                <h2 className="text-xl font-semibold mb-2">Weather</h2>
                <div className="text-sm">Temp: <span className="font-medium">{resp.weather?.temp ?? "N/A"} °C</span></div>
                <div className="text-sm">Humidity: <span className="font-medium">{resp.weather?.humidity ?? "N/A"}%</span></div>
                <div className="text-sm">Desc: <span className="font-medium">{resp.weather?.description ?? "N/A"}</span></div>
              </div>

              <div className="bg-gray-800 p-4 rounded shadow mt-4">
                <h2 className="text-xl font-semibold mb-3">Recommended Crops</h2>
                {Array.isArray(resp.crops) && resp.crops.length ? resp.crops.map((c,i)=>(/* ...crop card */ 
                  <div key={i} className="pb-3 mb-3 border-b border-gray-700">
                    <div className="text-lg font-bold">{c.crop} <span className="text-sm font-normal">— est yield: {c.est_yield_kg ?? c.est_yield ?? "N/A"} kg</span></div>
                    <div className="text-sm text-gray-300 mt-1">Notes: {c.notes ?? "-"}</div>
                  </div>
                )) : <div>No crops</div>}
              </div>

              <div className="bg-gray-800 p-4 rounded shadow mt-4">
                <h2 className="text-xl font-semibold mb-3">Fertilizer Plan</h2>
                {Array.isArray(resp.fertilizer_plan) && resp.fertilizer_plan.length ? resp.fertilizer_plan.map((f,i)=>((
                  <div key={i} className="pb-2 mb-2 border-b border-gray-700">
                    <div className="font-semibold">{f.crop} — <span className="font-normal">{f.fertilizer} : {f.qty_kg} kg</span></div>
                    <div className="text-sm text-gray-300">{f.timing}</div>
                  </div>
                ))) : <div>No fertilizer plan</div>}
              </div>

              <div className="bg-gray-800 p-4 rounded shadow mt-4">
                <h2 className="text-xl font-semibold mb-3">Action Plan (7 days)</h2>
                {Array.isArray(resp.action_plan) ? resp.action_plan.map((ap,i)=>((
                  <div key={i} className="mb-4">
                    <div className="font-semibold mb-2">{ap.crop}</div>
                    <ol className="list-decimal ml-6 text-gray-200">
                      {ap.plan.map((p,pi)=>(<li key={pi}>{p}</li>))}
                    </ol>
                  </div>
                ))) : <div>No action plan</div>}
              </div>
            </>
          )}
        </div>

        {/* Fertilizer Calculator */}
        <div className="bg-gray-800 p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-3">Fertilizer Calculator</h2>
          <form onSubmit={runFertilizerCalc} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm mb-1">Crop</label>
              <select className="p-2 rounded-md bg-gray-700 w-full" value={fertForm.crop} onChange={e=>setFertForm({...fertForm,crop:e.target.value})}>
                <option>Maize</option>
                <option>Wheat</option>
                <option>Paddy</option>
                <option>Groundnut</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Soil</label>
              <select className="p-2 rounded-md bg-gray-700 w-full" value={fertForm.soil} onChange={e=>setFertForm({...fertForm,soil:e.target.value})}>
                <option value="loamy">Loamy</option>
                <option value="sandy">Sandy</option>
                <option value="clay">Clay</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Area (ha)</label>
              <input type="number" className="p-2 rounded-md bg-gray-700 w-full" value={fertForm.area} onChange={e=>setFertForm({...fertForm,area:Number(e.target.value)})}/>
            </div>

            <div className="sm:col-span-3 mt-2">
              <button type="submit" disabled={fertLoading} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-white">
                {fertLoading ? "Calculating..." : "Calculate Fertilizer"}
              </button>
            </div>
          </form>

          <div className="mt-4">
            {fertError && <div className="text-red-300">{fertError}</div>}
            {fertResult && <div className="bg-gray-900 p-3 rounded text-gray-100"><pre>{JSON.stringify(fertResult,null,2)}</pre></div>}
          </div>
        </div>

        {/* Localized Advisory */}
        <div className="bg-gray-800 p-4 rounded shadow mb-12">
          <h2 className="text-xl font-semibold mb-3">Localized Advisory (GenAI or Heuristic)</h2>

          <form onSubmit={runAdvisory} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Farmer name</label>
              <input className="p-2 rounded-md bg-gray-700 w-full" value={advForm.name} onChange={e=>setAdvForm({...advForm,name:e.target.value})}/>
            </div>
            <div>
              <label className="block text-sm mb-1">Village</label>
              <input className="p-2 rounded-md bg-gray-700 w-full" value={advForm.village} onChange={e=>setAdvForm({...advForm,village:e.target.value})}/>
            </div>
            <div>
              <label className="block text-sm mb-1">Crop</label>
              <input className="p-2 rounded-md bg-gray-700 w-full" value={advForm.crop} onChange={e=>setAdvForm({...advForm,crop:e.target.value})}/>
            </div>
            <div>
              <label className="block text-sm mb-1">Soil</label>
              <input className="p-2 rounded-md bg-gray-700 w-full" value={advForm.soil} onChange={e=>setAdvForm({...advForm,soil:e.target.value})}/>
            </div>
            <div>
              <label className="block text-sm mb-1">Area (ha)</label>
              <input type="number" className="p-2 rounded-md bg-gray-700 w-full" value={advForm.area} onChange={e=>setAdvForm({...advForm,area:Number(e.target.value)})}/>
            </div>
            <div>
              <label className="block text-sm mb-1">Location</label>
              <input className="p-2 rounded-md bg-gray-700 w-full" value={advForm.location} onChange={e=>setAdvForm({...advForm,location:e.target.value})}/>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm mb-1">Extra (optional)</label>
              <input className="p-2 rounded-md bg-gray-700 w-full" value={advForm.extra} onChange={e=>setAdvForm({...advForm,extra:e.target.value})}/>
            </div>

            <div className="sm:col-span-2">
              <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-md text-black" disabled={advLoading}>
                {advLoading ? "Generating..." : "Get Localized Advisory"}
              </button>
            </div>
          </form>

          <div className="mt-4">
            {advResult && (
              <div className="bg-gray-900 p-3 rounded text-gray-100">
                <pre style={{whiteSpace:"pre-wrap"}}>{JSON.stringify(advResult,null,2)}</pre>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center text-sm text-gray-400 py-6">
          © 2025 Agro-Mitra — Made for Final Year Project
        </footer>
      </main>
    </div>
  );
}
