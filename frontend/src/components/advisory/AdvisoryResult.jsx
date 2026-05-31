import { CalendarCheck, Sprout, TestTube2 } from "lucide-react";
import Card from "../common/Card";

const AdvisoryResult = ({ data }) => {
  const recommendedCrops = Array.isArray(data?.recommendedCrops)
    ? data.recommendedCrops
    : [];

  const actionPlan = Array.isArray(data?.actionPlan)
    ? data.actionPlan
    : data?.actionPlan
      ? [data.actionPlan]
      : [];

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
            <Sprout size={24} />
          </span>
          <h2 className="text-xl font-black text-slate-950">Recommended Crops</h2>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {recommendedCrops.length > 0 ? (
            recommendedCrops.map((crop, index) => (
              <span
                key={index}
                className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700"
              >
                {crop}
              </span>
            ))
          ) : (
            <p className="text-slate-600">No crop recommendation returned.</p>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-sky-100 p-3 text-sky-700">
            <TestTube2 size={24} />
          </span>
          <h2 className="text-xl font-black text-slate-950">Fertilizer Advice</h2>
        </div>
        <p className="mt-5 leading-7 text-slate-700">
          {data?.fertilizerAdvice || "No fertilizer advice returned."}
        </p>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-violet-100 p-3 text-violet-700">
            <CalendarCheck size={24} />
          </span>
          <h2 className="text-xl font-black text-slate-950">Action Plan</h2>
        </div>
        {actionPlan.length > 0 ? (
          <ul className="mt-5 space-y-3 text-slate-700">
            {actionPlan.map((step, index) => (
              <li key={index} className="flex gap-3 leading-6">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 leading-7 text-slate-600">No action plan returned.</p>
        )}
      </Card>
    </div>
  );
};

export default AdvisoryResult;
