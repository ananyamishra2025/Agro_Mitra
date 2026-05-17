import Card from "../components/common/Card";
import StatusBadge from "../components/common/StatusBadge";
import { navigateTo } from "../utils/navigation";
import BackButton from "../components/common/BackButton";

const modules = [
  {
    name: "Crop Advisory",
    path: "/advisory",
    status: "live",
    icon: "🌾",
    description:
      "AI recommendations for crops, fertilizer, irrigation, and planning.",
  },

  {
    name: "AI Chatbot",
    path: "/chat",
    status: "live",
    icon: "🤖",
    description:
      "Get instant farming guidance using conversational AI support.",
  },

  {
    name: "Voice Assistant",
    path: "/voice",
    status: "live",
    icon: "🎤",
    description:
      "Upload voice questions and receive intelligent farming responses.",
  },

  {
    name: "Image Detection",
    path: "/upload",
    status: "live",
    icon: "🖼️",
    description:
      "Analyze crop disease images and identify plant health issues.",
  },

  {
    name: "Learning Resources",
    path: "/learning",
    status: "live",
    icon: "📚",
    description:
      "Explore curated agricultural learning materials and resources.",
  },

  {
    name: "User History",
    path: "/history",
    status: "live",
    icon: "📜",
    description:
      "Track previous advisory records, chatbot conversations, and activity.",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-10">
      <BackButton />
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-green-900 via-emerald-800 to-lime-700 p-10 text-white shadow-2xl">

        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

        <p className="font-extrabold uppercase tracking-[0.3em] text-lime-100">
          Smart Agriculture Platform
        </p>

        <h1 className="mt-4 text-5xl font-black leading-tight md:text-6xl">
          Agro-Mitra Dashboard
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-emerald-50">
          Access AI-powered crop advisory, chatbot assistance,
          voice support, image-based disease detection, and
          learning resources — all in one smart agriculture system.
        </p>

      </section>

      {/* DASHBOARD GRID */}
      <section>

        <div className="mb-8 flex items-center justify-between">

          <div>
            <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">
              Core Modules
            </p>

            <h2 className="mt-2 text-4xl font-black text-slate-900">
              Everything in one dashboard
            </h2>
          </div>

        </div>

        {/* GRID */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {modules.map((module) => (
            <button
              key={module.path}
              type="button"
              onClick={() => navigateTo(module.path)}
              className="group text-left transition-all duration-300"
            >

              <Card className="h-full rounded-[2rem] border border-emerald-100 bg-white p-8 hover:border-emerald-300">

                {/* TOP */}
                <div className="flex items-start justify-between">

                  <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-emerald-100 to-lime-100 text-4xl transition-transform duration-300 group-hover:scale-110">
                    {module.icon}
                  </div>

                  <StatusBadge status={module.status} />

                </div>

                {/* TITLE */}
                <h3 className="mt-8 text-3xl font-black text-slate-900">
                  {module.name}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-4 text-lg leading-8 text-slate-600">
                  {module.description}
                </p>

                {/* BUTTON */}
                <div className="mt-8">

                  <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-5 py-3 font-bold text-emerald-700 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                    Open Module →
                  </span>

                </div>

              </Card>

            </button>
          ))}

        </div>

      </section>

    </div>
  );
};

export default Dashboard;
