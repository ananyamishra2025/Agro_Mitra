import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { getLearningResources } from "../api/learningApi";
import BackButton from "../components/common/BackButton";

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
    <div className="space-y-8">
      <BackButton />
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">Knowledge hub</p>
        <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-5xl">Agriculture Learning Resources</h1>
      </section>

      {loading ? (
        <Loader />
      ) : resources.length === 0 ? (
        <EmptyState type="learning" title="No resources available" text="Learning content will show here when the backend returns resources." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((item, index) => (
            <Card key={index}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                <BookOpen size={24} />
              </span>
              <h2 className="mt-4 text-2xl font-black text-slate-900">{item.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPage;
