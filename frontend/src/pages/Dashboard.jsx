import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Bot,
  Calendar,
  Camera,
  CloudSun,
  History,
  Image,
  Mic,
  RefreshCcw,
  Rocket,
  Sprout,
  TrendingUp,
  Users,
} from "lucide-react";
import Card from "../components/common/Card";
import { navigateTo } from "../utils/navigation";
import heroFarmer from "../assets/images/hero-farmer.png";

const stats = [
  { label: "Total Queries", value: "124", change: "23%", icon: Users, tone: "bg-emerald-50 text-emerald-700" },
  { label: "Crops Analyzed", value: "18", change: "18%", icon: Bot, tone: "bg-sky-50 text-sky-700" },
  { label: "Images Scanned", value: "42", change: "35%", icon: Image, tone: "bg-violet-50 text-violet-700" },
  { label: "Advice Given", value: "87", change: "25%", icon: RefreshCcw, tone: "bg-orange-50 text-orange-700" },
];

const modules = [
  { name: "Crop Advisory", path: "/advisory", icon: Sprout, text: "Get AI recommendations for your crops", tone: "bg-emerald-50 text-emerald-700" },
  { name: "AI Chatbot", path: "/chat", icon: Bot, text: "Ask anything about farming", tone: "bg-sky-50 text-sky-700" },
  { name: "Voice Assistant", path: "/voice", icon: Mic, text: "Ask farming questions using your voice", tone: "bg-violet-50 text-violet-700" },
  { name: "Image Detection", path: "/upload", icon: Camera, text: "Upload crop images and detect issues", tone: "bg-cyan-50 text-cyan-700" },
  { name: "Learning Resources", path: "/learning", icon: BookOpen, text: "Explore articles, guides and videos", tone: "bg-amber-50 text-amber-700" },
  { name: "Gardening Tips", path: "/gardening", icon: Sprout, text: "Get tips for home garden care", tone: "bg-lime-50 text-lime-700" },
  { name: "History", path: "/history", icon: History, text: "View your past queries and results", tone: "bg-yellow-50 text-yellow-700" },
  { name: "Future Scope", path: "/future", icon: Rocket, text: "Upcoming features and improvements", tone: "bg-rose-50 text-rose-700" },
];

const activities = [
  ["Crop advisory for Wheat", "2 hours ago", <Sprout size={18} />],
  ["Tomato leaf disease detected", "5 hours ago", <Sprout size={18} />],
  ["Fertilizer recommendation generated", "1 day ago", <Bot size={18} />],
  ["Voice query processed", "2 days ago", <Mic size={18} />],
];

const Dashboard = () => {
  const today = useMemo(() => {
    const now = new Date();
    return {
      date: now.toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" }),
      day: now.toLocaleDateString("en-IN", { weekday: "long" }),
    };
  }, []);

  const [weather, setWeather] = useState({
    location: "Kolkata, West Bengal",
    temperature: "28",
    condition: "Partly Cloudy",
    humidity: "65",
    wind: "12",
    rain: "10",
  });

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const placeResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
          );
          const place = await placeResponse.json();
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&timezone=auto`
          );
          const data = await response.json();
          const current = data.current;

          setWeather({
            location: [place.city || place.locality, place.principalSubdivision]
              .filter(Boolean)
              .join(", ") || "Your current location",
            temperature: Math.round(current.temperature_2m).toString(),
            condition: current.weather_code > 2 ? "Cloudy" : "Clear",
            humidity: Math.round(current.relative_humidity_2m).toString(),
            wind: Math.round(current.wind_speed_10m).toString(),
            rain: Math.round(current.precipitation || 0).toString(),
          });
        } catch (error) {
          console.error(error);
        }
      },
      () => {},
      { timeout: 5000 }
    );
  }, []);

  return (
    <div className="grid gap-7 xl:grid-cols-[1fr_360px]">
      <div className="space-y-7">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Welcome back, Ananya!</h1>
          <p className="mt-2 font-medium text-slate-500">Here is what is happening on your farm today.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="p-5">
                <div className="flex items-center gap-4">
                  <span className={`grid h-14 w-14 place-items-center rounded-xl ${item.tone}`}>
                    <Icon size={27} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-500">{item.label}</p>
                    <p className="text-3xl font-black text-slate-950">{item.value}</p>
                    <p className="mt-1 text-xs font-bold text-emerald-700">
                      <TrendingUp className="mr-1 inline" size={13} />
                      {item.change} this week
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
          <h2 className="text-2xl font-black text-slate-950">Core Modules</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.path}
                  type="button"
                  onClick={() => navigateTo(module.path)}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className={`grid h-14 w-14 place-items-center rounded-xl ${module.tone}`}>
                      <Icon size={27} />
                    </span>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600 transition group-hover:bg-green-700 group-hover:text-white">
                      →
                    </span>
                  </div>
                  <h3 className="mt-5 font-black text-slate-950">{module.name}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{module.text}</p>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <aside className="space-y-5">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-50 text-slate-700">
              <Calendar size={22} />
            </span>
            <div>
              <p className="font-black text-slate-950">{today.date}</p>
              <p className="text-sm font-medium text-slate-500">{today.day}</p>
            </div>
          </div>
        </Card>

        <div className="relative h-32 overflow-hidden rounded-2xl border border-emerald-100 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
          <img src={heroFarmer} alt="Farmer in field" className="h-full w-full object-cover" />
        </div>

        <Card className="p-5">
          <h2 className="text-lg font-black text-slate-950">Recent Activity</h2>
          <div className="mt-4 divide-y divide-slate-100">
            {activities.map(([title, time, icon]) => (
              <div key={title} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                  {icon}
                </span>
                <p className="flex-1 text-sm font-bold text-slate-700">{title}</p>
                <span className="text-xs font-medium text-slate-500">{time}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigateTo("/history")} className="mt-3 w-full text-right text-sm font-black text-green-700">View all activity →</button>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-black text-slate-950">{weather.location}</p>
              <p className="text-sm font-medium text-slate-500">{weather.condition}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-slate-950">{weather.temperature}°C</p>
              <CloudSun className="ml-auto text-amber-400" size={34} />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              ["Humidity", `${weather.humidity}%`],
              ["Wind", `${weather.wind} km/h`],
              ["Rain", `${weather.rain}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="mt-1 font-black text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
};

export default Dashboard;
