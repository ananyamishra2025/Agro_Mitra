import { useEffect, useState } from "react";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
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
      <section>
        <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">Knowledge hub</p>
        <h1 className="mt-4 text-5xl md:text-6xl font-extrabold leading-tight">Agriculture Learning Resources</h1>
      </section>

      {loading ? (
        <Loader />
      ) : resources.length === 0 ? (
        <Card className="text-center">
          <p className="text-5xl">📚</p>
          <h2 className="mt-4 text-4xl font-black text-slate-900">No resources available</h2>
          <p className="mt-2 text-slate-600">Learning content will show here when the backend returns resources.</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((item, index) => (
            <Card key={index}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-2xl">📘</span>
              <h2 className="mt-4 text-4xl font-black text-slate-900">{item.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPage;
