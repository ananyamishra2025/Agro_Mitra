import Card from "../components/common/Card";
import StatusBadge from "../components/common/StatusBadge";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const modules = [
    { name: "Crop Advisory", path: "/advisory", status: "live" },
    { name: "AI Chatbot", path: "/chat", status: "live" },
    { name: "Voice Assistant", path: "/voice", status: "live" },
    { name: "Image Detection", path: "/upload", status: "live" },
    { name: "Learning Resources", path: "/learning", status: "live" },
    { name: "Gardening Tips", path: "/gardening", status: "live" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <div key={index} onClick={() => navigate(module.path)}>
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{module.name}</h2>
                <StatusBadge status={module.status} />
              </div>
              <p className="text-gray-600">
                Click to explore {module.name}.
              </p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
