import { useState } from "react";
import AdvisoryForm from "../components/advisory/AdvisoryForm";
import AdvisoryResult from "../components/advisory/AdvisoryResult";

const AdvisoryPage = () => {
  const [result, setResult] = useState(null);

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-8">Crop Advisory</h1>

      <AdvisoryForm setResult={setResult} />

      {result && <AdvisoryResult data={result} />}
    </div>
  );
};

export default AdvisoryPage;
