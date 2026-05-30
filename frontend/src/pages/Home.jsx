import {
  BookOpen,
  Bot,
  Camera,
  CheckCircle2,
  GraduationCap,
  Leaf,
  Mic,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
  Users,
} from "lucide-react";
import heroFarmer from "../assets/images/hero-farmer.png";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { navigateTo } from "../utils/navigation";

const audiences = [
  {
    icon: <Users size={30} />,
    title: "Farmers",
    text: "Plan crops, fertilizer, irrigation, and next actions with guidance based on farm conditions.",
  },
  {
    icon: <Sprout size={30} />,
    title: "Gardeners",
    text: "Get seasonal tips, plant care reminders, and practical support for kitchen gardens.",
  },
  {
    icon: <GraduationCap size={30} />,
    title: "Students",
    text: "Explore agriculture concepts through curated resources and AI-powered question support.",
  },
];

const features = [
  {
    icon: <Sprout size={28} />,
    title: "Crop Advisory",
    text: "Recommendations for crops, fertilizer, irrigation, and action plans.",
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: <Bot size={28} />,
    title: "AI Chatbot",
    text: "Quick answers about soil, pests, irrigation, and crop care.",
    tone: "bg-sky-50 text-sky-700",
  },
  {
    icon: <Mic size={28} />,
    title: "Voice Assistant",
    text: "Upload voice questions in Indian language workflows.",
    tone: "bg-violet-50 text-violet-700",
  },
  {
    icon: <Camera size={28} />,
    title: "Disease Detection",
    text: "Analyze crop images and see detection output.",
    tone: "bg-cyan-50 text-cyan-700",
  },
  {
    icon: <BookOpen size={28} />,
    title: "Learning Hub",
    text: "Curated farming and gardening resources.",
    tone: "bg-amber-50 text-amber-700",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "History",
    text: "Track previous advisory and assistant activity.",
    tone: "bg-lime-50 text-lime-700",
  },
];

const trustItems = [
  ["6+", "Smart modules"],
  ["24/7", "Digital help"],
  ["3", "User groups"],
  ["AI", "Farm guidance"],
];

const aboutHighlights = [
  "Simple digital tools for everyday farming decisions",
  "AI support for advisory, disease checks, and learning",
  "Built for farmers, gardeners, students, and agriculture teams",
];

const Home = () => {
  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)] lg:grid-cols-[1fr_0.95fr] lg:p-10">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-extrabold text-emerald-800 shadow-sm">
            <Sparkles size={16} />
            Smart Agriculture Assistance System
          </div>

          <h1 className="text-4xl font-black leading-tight text-slate-950 md:text-6xl">
            Smart solutions for <span className="text-green-700">better agriculture.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-slate-700">
            Agro-Mitra helps farmers, gardeners, and learners make better
            agriculture decisions with crop advisory, voice support, image
            detection, and trusted learning resources.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => navigateTo("/dashboard")} className="text-base">
              Explore Dashboard
            </Button>
            <Button variant="secondary" onClick={() => navigateTo("/advisory")} className="text-base">
              Get Crop Advice
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {trustItems.map(([value, label]) => (
              <div key={label} className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                <p className="text-2xl font-black text-green-800">{value}</p>
                <p className="text-xs font-bold text-slate-600">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-2xl bg-emerald-50 shadow-inner">
          <img
            src={heroFarmer}
            alt="Farmer using a smartphone in a green crop field"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-green-950/55 to-transparent p-6">
            <div className="inline-flex items-center gap-3 rounded-xl bg-white/95 px-4 py-3 shadow-xl">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-lime-100 text-green-800">
                <Leaf size={22} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Suggested focus</p>
                <p className="font-black text-slate-950">Prepare a climate-aware crop plan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-10" id="about">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="font-extrabold uppercase tracking-[0.22em] text-emerald-700">About Agro-Mitra</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
              A smart agriculture companion made for practical farm support.
            </h2>
            <p className="mt-5 text-lg font-medium leading-8 text-slate-600">
              Agro-Mitra brings crop advisory, AI chat, voice assistance,
              plant disease detection, learning resources, and activity history
              into one clean platform. It is designed to help users make faster,
              clearer, and more confident agriculture decisions.
            </p>
          </div>

          <div className="grid gap-4">
            {aboutHighlights.map((item) => (
              <div key={item} className="flex items-start gap-4 rounded-xl border border-emerald-100 bg-emerald-50/70 p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-emerald-700 shadow-sm">
                  <CheckCircle2 size={22} />
                </span>
                <p className="font-black leading-7 text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 text-center">
          <p className="font-extrabold uppercase tracking-[0.22em] text-emerald-700">Built for everyone</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-4xl">Who can use Agro-Mitra?</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {audiences.map((item) => (
            <Card key={item.title} className="p-7">
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                {item.icon}
              </span>
              <h3 className="mt-5 text-2xl font-black text-slate-950">{item.title}</h3>
              <p className="mt-3 font-medium leading-7 text-slate-600">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-extrabold uppercase tracking-[0.22em] text-emerald-700">Core modules</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-4xl">Everything in one dashboard</h2>
          </div>
          <Button variant="ghost" onClick={() => navigateTo("/dashboard")}>View all modules</Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="group flex gap-4 p-6">
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl shadow-sm ring-1 ring-slate-100 transition duration-300 group-hover:scale-110 ${feature.tone}`}>
                {feature.icon}
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-950">{feature.title}</h3>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-600">{feature.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="font-extrabold uppercase tracking-[0.22em] text-emerald-700">Business ready</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">A practical agriculture platform for everyday decisions.</h2>
            <p className="mt-4 font-medium leading-7 text-slate-600">
              Agro-Mitra is designed like a real service: clear modules,
              reliable support, account access, and a professional interface
              that can grow into field operations, advisory services, and farmer outreach.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [<TrendingUp className="text-emerald-700" size={28} />, "Better planning"],
              [<ShieldCheck className="text-emerald-700" size={28} />, "Guided decisions"],
              [<Bot className="text-emerald-700" size={28} />, "AI assistance"],
              [<BookOpen className="text-emerald-700" size={28} />, "Knowledge hub"],
            ].map(([icon, label]) => (
              <div key={label} className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-5">
                {icon}
                <p className="mt-4 font-black text-slate-950">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
