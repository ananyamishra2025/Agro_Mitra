import { useEffect, useState } from "react";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import { getHistory } from "../api/historyApi";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
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
    <div className="space-y-8">
      <section>
        <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">Activity timeline</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">User History</h1>
      </section>

      {loading ? (
        <Loader />
      ) : history.length === 0 ? (
        <Card className="text-center">
          <p className="text-5xl">📜</p>
          <h2 className="mt-4 text-2xl font-black text-slate-950">No history found</h2>
          <p className="mt-2 text-slate-600">Your advisory and assistant activity will be listed here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <Card key={index} className="flex gap-4">
              <span className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-xl">✓</span>
              <div>
                <h2 className="text-xl font-black text-slate-950">{item.type || "Advisory"}</h2>
                <p className="mt-2 leading-7 text-slate-600">{item.summary || JSON.stringify(item)}</p>
                {item.createdAt && (
                  <p className="mt-3 text-sm font-bold text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
