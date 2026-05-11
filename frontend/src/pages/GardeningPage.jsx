import { useEffect, useState } from "react";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
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
    <div className="space-y-8">
      <section>
        <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">Home garden care</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">Gardening Tips</h1>
      </section>

      {loading ? (
        <Loader />
      ) : tips.length === 0 ? (
        <Card className="text-center">
          <p className="text-5xl">🌱</p>
          <h2 className="mt-4 text-2xl font-black text-slate-950">No tips available</h2>
          <p className="mt-2 text-slate-600">Gardening tips will appear when the API responds.</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip, index) => (
            <Card key={index}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-100 text-2xl">🌿</span>
              <h2 className="mt-5 text-xl font-black text-slate-950">{tip.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{tip.description}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GardeningPage;
