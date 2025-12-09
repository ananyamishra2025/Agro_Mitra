import { useState } from "react";
import Navbar from "./components/Navbar";

export default function App() {
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    soil: "clay",
    area: 1.5,
    budget: 5000,
    location: "Patna,IN",
  });

  const [fertForm, setFertForm] = useState({
    crop: "Maize",
    soil: "loamy",
    area: 1,
  });
  const [fertResult, setFertResult] = useState(null);
  const [fertLoading, setFertLoading] = useState(false);
  const [fertError, setFertError] = useState("");

  const [advForm, setAdvForm] = useState({
    name: "",
    village: "",
    crop: "Maize",
    soil: "clay",
    area: 1,
    location: "Patna,IN",
    extra: "",
  });
  const [advResult, setAdvResult] = useState(null);
  const [advLoading, setAdvLoading] = useState(false);

  async function runDemo() {
    setError("");
    setLoading(true);
    try {
      const r = await fetch("http://localhost:5000/api/demo");
      if (!r.ok) throw new Error(`Server ${r.status}`);
      setResp(await r.json());
    } catch (err) {
      setResp(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitRecommend(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await fetch("http://localhost:5000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error(`Server ${r.status}`);
      setResp(await r.json());
    } catch (err) {
      setResp(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function runFertilizerCalc(e) {
    e.preventDefault();
    setFertError("");
    setFertLoading(true);
    try {
      const r = await fetch("http://localhost:5000/api/fertilizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fertForm),
      });
      if (!r.ok) throw new Error(`Server ${r.status}`);
      setFertResult(await r.json());
    } catch (err) {
      setFertError(err.message);
    } finally {
      setFertLoading(false);
    }
  }

  async function runAdvisory(e) {
    e.preventDefault();
    setAdvLoading(true);
    try {
      const r = await fetch("http://localhost:5000/api/advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(advForm),
      });
      if (!r.ok) throw new Error(`Server ${r.status}`);
      setAdvResult(await r.json());
    } catch (err) {
      setAdvResult({ error: err.message });
    } finally {
      setAdvLoading(false);
    }
  }

  // Download JSON
  function downloadJSON() {
    const data = JSON.stringify(resp, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "agro_mitra_output.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-6">Agro-Mitra — Demo</h1>

        {/* ---------------------- DEMO BUTTONS ----------------------- */}
        <div className="mb-6">
          <button
            onClick={runDemo}
            className="bg-green-600 px-4 py-2 rounded mr-2"
          >
            One-Click Demo
          </button>

          <button
            onClick={downloadJSON}
            className="px-4 py-2 bg-gray-700 rounded"
          >
            Download JSON
          </button>
        </div>

        {/* ---------------------- FORM ----------------------- */}
        <form
          onSubmit={submitRecommend}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
        >
          <div>
            <label>Soil</label>
            <select
              className="w-full p-2 rounded bg-gray-900 border border-gray-700"
              value={form.soil}
              onChange={(e) => setForm({ ...form, soil: e.target.value })}
            >
              <option value="loamy">Loamy</option>
              <option value="sandy">Sandy</option>
              <option value="clay">Clay</option>
            </select>
          </div>

          <div>
            <label>Area (ha)</label>
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-900 border border-gray-700"
              value={form.area}
              onChange={(e) =>
                setForm({ ...form, area: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label>Budget (₹)</label>
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-900 border border-gray-700"
              value={form.budget}
              onChange={(e) =>
                setForm({ ...form, budget: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label>Location</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-900 border border-gray-700"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />
          </div>

          <div className="sm:col-span-2">
            <button className="bg-blue-600 px-4 py-2 rounded">
              Get Recommendations
            </button>
          </div>
        </form>

        {/* ---------------------- SHOW OUTPUT ----------------------- */}
        {error && (
          <div className="bg-red-900 p-3 rounded mb-4">{error}</div>
        )}

        {!resp && !loading && (
          <div className="text-gray-400">
            No data yet. Click <b>One-Click Demo</b> or submit the form.
          </div>
        )}

        {resp && (
          <>
            {/* ⭐⭐⭐ UPDATED WEATHER CARD ⭐⭐⭐ */}
            <div className="bg-black/30 p-5 rounded-lg border border-white/10 mt-4">
              <h2 className="text-xl font-semibold mb-2">Weather</h2>

              <div>Temp: {resp.weather?.temp ?? "N/A"} °C</div>
              <div>Humidity: {resp.weather?.humidity ?? "N/A"}%</div>
              <div>Description: {resp.weather?.description ?? "N/A"}</div>
            </div>

            {/* ---------------- Crops ---------------- */}
            <div className="bg-gray-800 p-4 rounded shadow mt-4">
              <h2 className="text-xl font-semibold mb-3">
                Recommended Crops
              </h2>

              {resp.crops.map((c, i) => (
                <div
                  key={i}
                  className="pb-3 mb-3 border-b border-gray-700"
                >
                  <div className="text-lg font-bold">
                    {c.crop} — est yield:{" "}
                    {c.est_yield_kg ?? c.est_yield} kg
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    Notes: {c.notes ?? "-"}
                  </div>
                </div>
              ))}
            </div>

            {/* Fertilizer Plan */}
            <div className="bg-gray-800 p-4 rounded shadow mt-4">
              <h2 className="text-xl font-semibold mb-3">
                Fertilizer Plan
              </h2>

              {resp.fertilizer_plan.map((f, i) => (
                <div
                  key={i}
                  className="pb-2 mb-2 border-b border-gray-700"
                >
                  <div className="font-semibold">
                    {f.crop} — {f.fertilizer}: {f.qty_kg} kg
                  </div>
                  <div className="text-sm text-gray-300">{f.timing}</div>
                </div>
              ))}
            </div>

            {/* Action Plan */}
            <div className="bg-gray-800 p-4 rounded shadow mt-4">
              <h2 className="text-xl font-semibold mb-3">
                Action Plan (7 days)
              </h2>

              {resp.action_plan.map((ap, i) => (
                <div key={i} className="mb-4">
                  <div className="font-semibold">{ap.crop}</div>
                  <ol className="ml-6 list-decimal">
                    {ap.plan.map((p, pi) => (
                      <li key={pi}>{p}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </>
        )}

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
            {fertResult && <div className="bg-gray-900 p-3 rounded text-gray-100">{JSON.stringify(fertResult,null,2)}</div>}
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
      </div>
    </div>
  );
}
