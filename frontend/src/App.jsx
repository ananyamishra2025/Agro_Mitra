import { useState } from "react";

export default function App(){
  const [resp,setResp]=useState(null);
  const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({
    soil:"clay",
    area:1.5,
    budget:5000,
    location:"Patna,IN"
  });

  async function runDemo(){
    setLoading(true);
    try{
      const r=await fetch("http://localhost:5000/api/demo");
      const j=await r.json();
      setResp(j);
    }catch(err){
      setResp({error:err.message});
    }
    setLoading(false);
  }

  async function submitRecommend(e){
    e.preventDefault();
    setLoading(true);
    try{
      const r=await fetch("http://localhost:5000/api/recommend",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form)
      });
      const j=await r.json();
      setResp(j);
    }catch(err){
      setResp({error:err.message});
    }
    setLoading(false);
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

      <pre style={{
        background:"#f0f0f0",
        padding:"15px",
        borderRadius:"5px",
        maxHeight:"300px",
        overflow:"auto"
      }}>
        {loading ? "Loading..." : JSON.stringify(resp,null,2)}
      </pre>
    </div>
  );
}
