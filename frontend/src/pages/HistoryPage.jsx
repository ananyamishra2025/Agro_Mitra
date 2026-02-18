import { useEffect, useState } from "react";
import Card from "../components/common/Card";
import { getHistory } from "../api/historyApi";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);

        // Replace with real userId logic if needed
        const userId = "demo-user";

        const response = await getHistory(userId);

        setHistory(response.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User History</h1>

      {loading ? (
        <p>Loading history...</p>
      ) : history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <Card key={index}>
              <h2 className="font-semibold text-green-700">
                {item.type || "Advisory"}
              </h2>
              <p className="text-gray-700 mt-2">
                {item.summary || JSON.stringify(item)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
