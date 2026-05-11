import { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import { getAdvisory, runDemo } from "../../api/advisoryApi";

const AdvisoryForm = ({ setResult }) => {
  const [formData, setFormData] = useState({
    location: "",
    season: "",
    soilType: "",
    landSize: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await getAdvisory(formData);
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error fetching advisory");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    try {
      setLoading(true);
      const response = await runDemo();
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Demo failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-emerald-100/80">
      <div className="mb-6">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-700">Field details</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Tell us about your farm</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input 
          name="location" 
          label="Location" 
          placeholder="e.g. Pune, Maharashtra" 
          value={formData.location} 
          onChange={handleChange} 
        />

        <Input 
          name="season" 
          label="Season" 
          placeholder="e.g. Kharif / Rabi" 
          value={formData.season} 
          onChange={handleChange} 
        />

        <Input 
          name="soilType" 
          label="Soil Type" 
          placeholder="e.g. Black cotton soil" 
          value={formData.soilType} 
          onChange={handleChange} 
        />

        <Input 
          name="landSize" 
          type="number" 
          label="Land Size" 
          placeholder="Acres" 
          value={formData.landSize} 
          onChange={handleChange} 
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Analyzing..." : "Get Recommendation"}
        </Button>

        <Button variant="secondary" onClick={handleDemo} disabled={loading}>
          Run Demo
        </Button>
      </div>
    </Card>
  );
};

export default AdvisoryForm;
