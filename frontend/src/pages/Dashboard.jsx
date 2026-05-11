import Card from "../components/common/Card";
import StatusBadge from "../components/common/StatusBadge";
import { navigateTo } from "../utils/navigation";

const modules = [
  { name: "Crop Advisory", path: "/advisory", status: "live", icon: "🌾", description: "Crop, fertilizer, and field action recommendations." },
  { name: "AI Chatbot", path: "/chat", status: "live", icon: "🤖", description: "Ask natural-language farming questions anytime." },
  { name: "Voice Assistant", path: "/voice", status: "live", icon: "🎤", description: "Submit voice questions for accessible support." },
  { name: "Image Detection", path: "/upload", status: "live", icon: "🖼️", description: "Upload crop images for disease insight." },
  { name: "Learning Resources", path: "/learning", status: "live", icon: "📚", description: "Browse agriculture learning material." },
  { name: "Gardening Tips", path: "/gardening", status: "live", icon: "🌱", description: "Practical plant care and garden guidance." },
  { name: "User History", path: "/history", status: "live", icon: "📜", description: "Review previous activity and recommendations." },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-gradient-to-r from-emerald-900 via-emerald-800 to-lime-700 p-8 text-white shadow-2xl shadow-emerald-900/15 md:p-10">
        <p className="text-sm font-extrabold uppercase tracking-[0.25em] text-lime-100">Command center</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Agro-Mitra Dashboard</h1>
        <p className="mt-4 max-w-2xl text-emerald-50">
          Choose a module below to get quick, polished access to crop planning, AI assistance, learning, and farm records.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <button
            key={module.path}
            type="button"
            onClick={() => navigateTo(module.path)}
            className="group text-left"
          >
            <Card className="h-full overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-emerald-100 to-lime-100 text-3xl transition group-hover:scale-110">
                  {module.icon}
                </span>
                <StatusBadge status={module.status} />
              </div>
              <h2 className="mt-6 text-2xl font-black text-slate-950">{module.name}</h2>
              <p className="mt-2 leading-7 text-slate-600">{module.description}</p>
              <p className="mt-5 font-extrabold text-emerald-700 transition group-hover:translate-x-1">
                Open module →
              </p>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
