import { useState } from "react";
import AdvisoryForm from "../components/advisory/AdvisoryForm";
import AdvisoryResult from "../components/advisory/AdvisoryResult";
import BackButton from "../components/common/BackButton";
import heroFarmer from "../assets/images/hero-farmer.png";

const AdvisoryPage = () => {
  const [result, setResult] = useState(null);

  return (
    <div className="space-y-8">
      <BackButton />
      <section className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="p-8">
          <p className="font-extrabold uppercase tracking-[0.22em] text-emerald-700">
            AI Crop Planning
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            Crop Advisory
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-slate-600">
            Get AI-powered crop recommendations based on your farm details.
          </p>
        </div>
        <img src={heroFarmer} alt="Crop advisory field" className="h-56 w-full object-cover lg:h-full" />
      </section>

      {/* FORM SECTION */}
      <AdvisoryForm setResult={setResult} />

      {/* RESULT SECTION */}
      {result && <AdvisoryResult data={result} />}

    </div>
  );
};

export default AdvisoryPage;
