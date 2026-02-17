import Card from "../common/Card";

const AdvisoryResult = ({ data }) => {
  return (
    <div className="mt-6">
      <Card>
        <h2 className="text-xl font-semibold mb-3">
          Recommended Crops
        </h2>
        <p>{data?.recommendedCrops?.join(", ")}</p>
      </Card>

      <Card className="mt-4">
        <h2 className="text-xl font-semibold mb-3">
          Fertilizer Advice
        </h2>
        <p>{data?.fertilizerAdvice}</p>
      </Card>

      <Card className="mt-4">
        <h2 className="text-xl font-semibold mb-3">
          Action Plan
        </h2>
        <p>{data?.actionPlan}</p>
      </Card>
    </div>
  );
};

export default AdvisoryResult;
