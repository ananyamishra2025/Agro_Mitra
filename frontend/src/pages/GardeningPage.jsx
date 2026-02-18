import { useEffect, useState } from "react";
import Card from "../components/common/Card";
import { getGardeningTips } from "../api/gardeningApi";

const GardeningPage = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoading(true);
        const response = await getGardeningTips();
        setTips(response.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Gardening Tips
      </h1>

      {loading ? (
        <p>Loading tips...</p>
      ) : tips.length === 0 ? (
        <p>No tips available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <Card key={index}>
              <h2 className="text-lg font-semibold text-green-700">
                {tip.title}
              </h2>
              <p className="text-gray-700 mt-2">
                {tip.description}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GardeningPage;
