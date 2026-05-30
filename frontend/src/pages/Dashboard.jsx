import {
  BookOpen,
  Bot,
  Camera,
  History,
  Mic,
  Sprout,
} from "lucide-react";
import { createElement } from "react";
import BackButton from "../components/common/BackButton";
import Card from "../components/common/Card";
import StatusBadge from "../components/common/StatusBadge";
import { navigateTo } from "../utils/navigation";

const modules = [
  {
    name: "Crop Advisory",
    path: "/advisory",
    status: "live",
    icon: Sprout,
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    description:
      "AI recommendations for crops, fertilizer, irrigation, and planning.",
  },
  {
    name: "AI Chatbot",
    path: "/chat",
    status: "live",
    icon: Bot,
    tone: "bg-sky-50 text-sky-700 ring-sky-100",
    description:
      "Get instant farming guidance using conversational AI support.",
  },
  {
    name: "Voice Assistant",
    path: "/voice",
    status: "live",
    icon: Mic,
    tone: "bg-violet-50 text-violet-700 ring-violet-100",
    description:      
      "Upload voice questions and receive intelligent farming responses.",
  },
  {
    name: "Image Detection",
    path: "/upload",
    status: "live",
    icon: Camera,
    tone: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    description:
      "Analyze crop disease images and identify plant health issues.",
  },
  {
    name: "Learning Resources",
    path: "/learning",
    status: "live",
    icon: BookOpen,
    tone: "bg-amber-50 text-amber-700 ring-amber-100",
    description:
      "Explore curated agricultural learning materials and resources.",
  },
  {
    name: "User History",
    path: "/history",
    status: "live",
    icon: History,
    tone: "bg-lime-50 text-lime-700 ring-lime-100",
    description:
      "Track previous advisory records, chatbot conversations, and activity.",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-10">
      <BackButton />

      <section className="relative overflow-hidden rounded-2xl border border-green-800 bg-green-900 p-8 text-white shadow-[0_24px_70px_rgba(20,83,45,0.28)] md:p-10">
        <div className="relative max-w-3xl">
          <p className="font-extrabold uppercase tracking-[0.24em] text-lime-200">
            Smart Agriculture Platform
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-6xl">
            Agro-Mitra Dashboard
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-green-50">
            Access AI-powered crop advisory, chatbot assistance, voice support,
            image-based disease detection, and learning resources all in one
            smart agriculture system.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-extrabold uppercase tracking-[0.22em] text-emerald-700">
              Core Modules
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
              Everything in one dashboard
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            return (
              <button
                key={module.path}
                type="button"
                onClick={() => navigateTo(module.path)}
                className="group block h-full text-left transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-emerald-200"
              >
                <Card className="h-full p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`grid h-16 w-16 place-items-center rounded-xl ring-1 transition duration-300 group-hover:scale-110 group-hover:shadow-lg ${module.tone}`}>
                      {createElement(module.icon, { size: 32 })}
                    </div>

                    <StatusBadge status={module.status} />
                  </div>

                  <h3 className="mt-7 text-2xl font-black text-slate-950">
                    {module.name}
                  </h3>

                  <p className="mt-3 text-base font-medium leading-7 text-slate-600">
                    {module.description}
                  </p>

                  <div className="mt-7">
                    <span className="inline-flex items-center rounded-xl bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800 transition-all duration-300 group-hover:bg-emerald-700 group-hover:text-white">
                      Open Module
                    </span>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;