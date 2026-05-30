import { useEffect, useState } from "react";
import { Sprout } from "lucide-react";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { getGardeningTips } from "../api/gardeningApi";
import BackButton from "../components/common/BackButton";

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
    <div className="space-y-8">
      <BackButton />
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">Home garden care</p>
        <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-5xl">Gardening Tips</h1>
      </section>

      {loading ? (
        <Loader />
      ) : tips.length === 0 ? (
        <EmptyState type="gardening" title="No tips available" text="Gardening tips will appear when the API responds." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip, index) => (
            <Card key={index}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-100 text-lime-700">
                <Sprout size={24} />
              </span>
              <h2 className="mt-4 text-2xl font-black text-slate-900">{tip.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{tip.description}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GardeningPage;
