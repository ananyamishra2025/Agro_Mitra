import { useState } from "react";

export default function App(){
  const [resp,setResp]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");              // <--- ADDED
  const [form,setForm]=useState({
    soil:"clay",
    area:1.5,
    budget:5000,
    location:"Patna,IN"
  });

  async function runDemo(){
    setError("");
    setLoading(true);
    try{
      const r = await fetch("http://localhost:5000/api/demo", { cache: "no-store" });
      if (r.status === 304) {
        const r2 = await fetch("http://localhost:5000/api/demo", { cache: "no-store", headers: { "Pragma": "no-cache" } });
        if (!r2.ok) throw new Error(`Server ${r2.status}`);
        const j2 = await r2.json();
        setResp(j2 || null);
        return;
      }
      if (!r.ok) throw new Error(`Server ${r.status}`);
      const j = await r.json();
      setResp(j ?? null);
    } catch (err) {
      setResp(null);
      setError(err.message || "Unknown error");
      console.error("runDemo error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function submitRecommend(e){
    e.preventDefault();
    setError("");
    setLoading(true);
    try{
      const r = await fetch("http://localhost:5000/api/recommend", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(form),
        cache: "no-store"
      });
      if (!r.ok) throw new Error(`Server ${r.status}`);
      const j = await r.json();
      setResp(j ?? null);
    } catch (err) {
      setResp(null);
      setError(err.message || "Unknown error");
      console.error("submitRecommend error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{padding:"20px",maxWidth:"800px",margin:"auto"}}>
      <h1 style={{fontSize:"24px",fontWeight:"bold",marginBottom:"10px"}}>Agro-Mitra — Demo</h1>

      <button onClick={runDemo} style={{
        margin:"10px 0",
        padding:"10px",
        backgroundColor:"green",
        color:"white",
        borderRadius:"4px",
        cursor:"pointer"
      }}>
        One-Click Demo
      </button>

      <form onSubmit={submitRecommend} style={{marginBottom:"20px"}}>
        <div>
          <label>Soil:</label>
          <select 
            value={form.soil} 
            onChange={e=>setForm({...form,soil:e.target.value})}
            style={{marginLeft:"10px"}}
          >
            <option value="loamy">Loamy</option>
            <option value="sandy">Sandy</option>
            <option value="clay">Clay</option>
          </select>
        </div>

        <div>
          <label>Area (ha):</label>
          <input 
            type="number" 
            value={form.area} 
            onChange={e=>setForm({...form,area:Number(e.target.value)})}
            style={{marginLeft:"10px"}}
          />
        </div>

        <div>
          <label>Budget:</label>
          <input 
            type="number" 
            value={form.budget} 
            onChange={e=>setForm({...form,budget:Number(e.target.value)})}
            style={{marginLeft:"10px"}}
          />
        </div>

        <div>
          <label>Location:</label>
          <input 
            type="text" 
            value={form.location} 
            onChange={e=>setForm({...form,location:e.target.value})}
            style={{marginLeft:"10px"}}
          />
        </div>

        <button type="submit" style={{
          marginTop:"10px",
          padding:"8px",
          backgroundColor:"blue",
          color:"white",
          borderRadius:"4px",
          cursor:"pointer"
        }}>
          Get Recommendations
        </button>
      </form>

      <div style={{display:"grid",gap:12}}>
        { error && <div style={{color:"#ffb4a2"}}>Error: {error}</div> }

        {!loading && !resp && !error && (
          <div style={{color:"#bdbdbd"}}>No data yet. Click <b>One-Click Demo</b> or submit the form.</div>
        )}

        {resp && (
          <>
            <div style={{background:"#111",padding:12,borderRadius:8}}>
              <h3 style={{margin:0}}>Weather</h3>
              <div>Temp: {resp.weather?.temp ?? "N/A"} °C</div>
              <div>Humidity: {resp.weather?.humidity ?? "N/A"}%</div>
              <div>Desc: {resp.weather?.description ?? "N/A"}</div>
            </div>

            <div style={{background:"#111",padding:12,borderRadius:8}}>
              <h3 style={{margin:0}}>Recommended Crops</h3>
              {Array.isArray(resp.crops) && resp.crops.length ? resp.crops.map((c,i)=>(
                <div key={i} style={{padding:"8px 0",borderBottom:"1px dashed #333"}}>
                  <b>{c.crop}</b> — est yield: {c.est_yield_kg ?? c.est_yield ?? "N/A"} kg
                  <div style={{fontSize:13,marginTop:4}}>Notes: {c.notes ?? "-"}</div>
                </div>
              )) : <div>No crops</div>}
            </div>

            <div style={{background:"#111",padding:12,borderRadius:8}}>
              <h3 style={{margin:0}}>Fertilizer Plan</h3>
              {Array.isArray(resp.fertilizer_plan) && resp.fertilizer_plan.length ? resp.fertilizer_plan.map((f,i)=>(
                <div key={i} style={{padding:"8px 0",borderBottom:"1px dashed #333"}}>
                  <b>{f.crop}</b> — {f.fertilizer} : {f.qty_kg} kg ({f.timing})
                </div>
              )) : <div>No fertilizer plan</div>}
            </div>
  
            <div style={{background:"#111",padding:12,borderRadius:8}}>
              <h3 style={{margin:0}}>Action Plan (7 days)</h3>
              {Array.isArray(resp.action_plan) ? resp.action_plan.map((ap,i)=>(
                <div key={i} style={{marginTop:8}}>
                  <b>{ap.crop}</b>
                  <ol>
                    {ap.plan.map((p,pi)=>(<li key={pi}>{p}</li>))}
                  </ol>
                </div>
              )) : <div>No action plan</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}