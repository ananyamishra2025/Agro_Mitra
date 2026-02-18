import { useEffect, useState } from "react";
import Card from "../components/common/Card";
import { getLearningResources } from "../api/learningApi";

const LearningPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await getLearningResources();
        setResources(response.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Agriculture Learning Resources
      </h1>

      {loading ? (
        <p>Loading resources...</p>
      ) : resources.length === 0 ? (
        <p>No resources available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((item, index) => (
            <Card key={index}>
              <h2 className="text-lg font-semibold text-green-700">
                {item.title}
              </h2>
              <p className="text-gray-700 mt-2">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPage;
