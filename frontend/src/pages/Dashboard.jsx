import Card from "../components/common/Card";
import StatusBadge from "../components/common/StatusBadge";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const modules = [
    { name: "Crop Advisory", path: "/advisory", status: "live", icon: "🌾" },
    { name: "AI Chatbot", path: "/chat", status: "live", icon: "🤖" },
    { name: "Voice Assistant", path: "/voice", status: "live", icon: "🎤" },
    { name: "Image Detection", path: "/upload", status: "live", icon: "🖼️" },
    { name: "Learning Resources", path: "/learning", status: "live", icon: "📚" },
    { name: "Gardening Tips", path: "/gardening", status: "live", icon: "🌱" },
    { name: "User History", path: "/history", status: "live", icon: "📜" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-green-700">
        Agro-Mitra Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((module, index) => (
          <div
            key={index}
            onClick={() => navigate(module.path)}
            className="cursor-pointer transform transition duration-300 hover:scale-105"
          >
            <Card>
              <div className="flex justify-between items-center mb-4">
                <span className="text-3xl">{module.icon}</span>
                <StatusBadge status={module.status} />
              </div>

              <h2 className="text-xl font-semibold mb-2">
                {module.name}
              </h2>

              <p className="text-gray-600">
                Explore {module.name} module.
              </p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
