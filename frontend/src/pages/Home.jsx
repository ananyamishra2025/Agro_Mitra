import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { navigateTo } from "../utils/navigation";

const audiences = [
  {
    icon: "👨‍🌾",
    title: "Farmers",
    text: "Plan crops, fertilizer, and next actions with simple guidance based on farm conditions.",
  },
  {
    icon: "🌱",
    title: "Gardeners",
    text: "Get care reminders, seasonal tips, and practical plant health suggestions.",
  },
  {
    icon: "🎓",
    title: "Students",
    text: "Explore agricultural concepts through guided resources and AI-powered Q&A.",
  },
];

const features = [
  ["🌾", "Crop Advisory", "Recommendations for crops, fertilizer, and action plans."],
  ["🤖", "AI Chatbot", "Quick answers about soil, pests, irrigation, and crop care."],
  ["🎤", "Voice Assistant", "Upload voice questions in Indian language workflows."],
  ["🖼️", "Disease Detection", "Analyze crop images and see detection output."],
  ["📚", "Learning Hub", "Curated farming and gardening resources."],
  ["📜", "History", "Track previous advisory and assistant activity."],
];

const Home = () => {
  return (
    <div className="space-y-20">
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-extrabold text-emerald-700 shadow-sm">
            ✨ Smart Agriculture Assistance System
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-7xl">
            Grow better with a beautiful, simple farm companion.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Agro-Mitra brings AI crop advisory, voice support, image detection,
            learning resources, and practical gardening tips into one clean dashboard.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => navigateTo("/dashboard")} className="text-base">
              Explore Dashboard →
            </Button>
            <Button variant="secondary" onClick={() => navigateTo("/advisory")} className="text-base">
              Get Crop Advice
            </Button>
          </div>
        </div>

        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-900 to-lime-700 p-8 text-white">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-lime-300/20" />
          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-lime-100">
              Today on farm
            </p>
            <div className="mt-8 grid gap-4">
              {["Check soil moisture", "Review fertilizer needs", "Scan leaf symptoms"].map((item, index) => (
                <div key={item} className="flex items-center gap-4 rounded-3xl bg-white/12 p-4 backdrop-blur">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl text-emerald-700">
                    {index + 1}
                  </span>
                  <span className="font-bold">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-3xl bg-white p-5 text-slate-900 shadow-2xl">
              <p className="text-sm font-bold text-slate-500">Suggested focus</p>
              <p className="mt-1 text-2xl font-black">Prepare a climate-aware crop plan 🌦️</p>
            </div>
          </div>
        </Card>
      </section>

      <section>
        <div className="mb-8 text-center">
          <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">Built for everyone</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-4xl">Who can use Agro-Mitra?</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {audiences.map((item) => (
            <Card key={item.title}>
              <span className="text-4xl">{item.icon}</span>
              <h3 className="mt-5 text-2xl font-black text-slate-900">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">Core modules</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-4xl">Everything in one dashboard</h2>
          </div>
          <Button variant="ghost" onClick={() => navigateTo("/dashboard")}>View all modules</Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([icon, title, text]) => (
            <Card key={title} className="flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-2xl">
                {icon}
              </span>
              <div>
                <h3 className="font-black text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;