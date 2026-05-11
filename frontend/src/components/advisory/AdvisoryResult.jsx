import Card from "../common/Card";

const AdvisoryResult = ({ data }) => {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <h2 className="text-xl font-black text-slate-950">🌾 Recommended Crops</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {data?.recommendedCrops?.map((crop, index) => (
            <span 
              key={index} 
              className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700"
            >
              {crop}
            </span>
          )) || <p className="text-slate-600">No crop recommendation returned.</p>}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-black text-slate-950">🧪 Fertilizer Advice</h2>
        <p className="mt-4 leading-7 text-slate-600">{data?.fertilizerAdvice || "No fertilizer advice returned."}</p>
      </Card>

      <Card>
        <h2 className="text-xl font-black text-slate-950">📅 Action Plan</h2>
        <p className="mt-4 leading-7 text-slate-600">{data?.actionPlan || "No action plan returned."}</p>
      </Card>
    </div>
  );
};

export default AdvisoryResult;
