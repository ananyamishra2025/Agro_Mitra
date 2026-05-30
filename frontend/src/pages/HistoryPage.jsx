import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { getHistory } from "../api/historyApi";
import BackButton from "../components/common/BackButton";

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
      <BackButton />
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">Activity timeline</p>
        <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-5xl">User History</h1>
      </section>

      {loading ? (
        <Loader />
      ) : history.length === 0 ? (
        <EmptyState type="history" title="No history found" text="Your advisory and assistant activity will be listed here." />
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <Card key={index} className="flex gap-4">
              <span className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 size={24} />
              </span>
              <div>
                <h2 className="text-2xl font-black text-slate-900">{item.type || "Advisory"}</h2>
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
