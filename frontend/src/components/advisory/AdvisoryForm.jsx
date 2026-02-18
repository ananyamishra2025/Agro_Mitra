import { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
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
    <Card>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          name="location"
          placeholder="Location"
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="season"
          placeholder="Season"
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="soilType"
          placeholder="Soil Type"
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="number"
          name="landSize"
          placeholder="Land Size (acres)"
          className="border p-2 rounded"
          onChange={handleChange}
        />
      </div>

      <div className="mt-6 flex gap-4">
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
