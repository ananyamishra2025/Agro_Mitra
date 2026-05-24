import { useState } from "react";
import AdvisoryForm from "../components/advisory/AdvisoryForm";
import AdvisoryResult from "../components/advisory/AdvisoryResult";
import BackButton from "../components/common/BackButton";

const AdvisoryPage = () => {
  const [result, setResult] = useState(null);

  return (
    <div className="space-y-8">
      <BackButton />
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-green-900 via-emerald-800 to-lime-700 p-10 text-white shadow-2xl">

        {/* Glow Effect */}
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

        {/* Small Heading */}
        <p className="font-extrabold uppercase tracking-[0.3em] text-lime-100">
          AI Crop Planning
        </p>

        {/* Main Heading */}
        <h1 className="mt-4 text-5xl md:text-6xl font-extrabold leading-tight">
          Crop Advisory
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
          Enter your farm details to receive intelligent recommendations
          for crops, fertilizer, irrigation, and seasonal planning.
        </p>

      </section>

      {/* FORM SECTION */}
      <AdvisoryForm setResult={setResult} />

      {/* RESULT SECTION */}
      {result && <AdvisoryResult data={result} />}

    </div>
  );
};

export default AdvisoryPage;
