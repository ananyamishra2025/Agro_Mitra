import { useState } from "react";
import AdvisoryForm from "../components/advisory/AdvisoryForm";
import AdvisoryResult from "../components/advisory/AdvisoryResult";

const AdvisoryPage = () => {
  const [result, setResult] = useState(null);

  return (
    <div className="space-y-8">
      <section>
        <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">AI crop planning</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">Crop Advisory</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Enter your farm context to get polished recommendations for crops, fertilizer, and next actions.
        </p>
      </section>

      <AdvisoryForm setResult={setResult} />
      {result && <AdvisoryResult data={result} />}
    </div>
  );
};

export default AdvisoryPage;
