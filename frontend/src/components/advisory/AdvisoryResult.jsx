import Card from "../common/Card";

const AdvisoryResult = ({ data }) => {
  return (
    <div className="mt-8 space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-3 text-green-700">
          🌾 Recommended Crops
        </h2>
        <div className="flex flex-wrap gap-2">
          {data?.recommendedCrops?.map((crop, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
            >
              {crop}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-3 text-green-700">
          🧪 Fertilizer Advice
        </h2>
        <p className="text-gray-700">{data?.fertilizerAdvice}</p>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-3 text-green-700">
          📅 Action Plan
        </h2>
        <p className="text-gray-700">{data?.actionPlan}</p>
      </Card>
    </div>
  );
};

export default AdvisoryResult;
