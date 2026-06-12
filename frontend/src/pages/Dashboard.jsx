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
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import Card from "../components/common/Card";
import { getDashboardOverview } from "../api/dashboardApi";
import { navigateTo } from "../utils/navigation";
import heroFarmer from "../assets/images/hero-farmer.png";

const statConfig = [
  { key: "totalQueries", label: "Total Queries", icon: Users, tone: "bg-emerald-50 text-emerald-700" },
  { key: "cropsAnalyzed", label: "Crops Analyzed", icon: Bot, tone: "bg-sky-50 text-sky-700" },
  { key: "imagesScanned", label: "Images Scanned", icon: Image, tone: "bg-violet-50 text-violet-700" },
  { key: "adviceGiven", label: "Advice Given", icon: RefreshCcw, tone: "bg-orange-50 text-orange-700" },
];

const modules = [
  { name: "Crop Advisory", path: "/advisory", icon: Sprout, text: "Get AI recommendations for your crops", tone: "bg-emerald-50 text-emerald-700" },
  { name: "AI Chatbot", path: "/chat", icon: Bot, text: "Ask anything about farming", tone: "bg-sky-50 text-sky-700" },
  { name: "Voice Assistant", path: "/voice", icon: Mic, text: "Ask farming questions using your voice", tone: "bg-violet-50 text-violet-700" },
  { name: "Image Detection", path: "/upload", icon: Camera, text: "Upload crop images and detect issues", tone: "bg-cyan-50 text-cyan-700" },
  { name: "Learning Resources", path: "/learning", icon: BookOpen, text: "Explore verified guides and research", tone: "bg-amber-50 text-amber-700" },
  { name: "Gardening Tips", path: "/gardening", icon: Sprout, text: "Follow daily garden care tasks", tone: "bg-lime-50 text-lime-700" },
  { name: "History", path: "/history", icon: History, text: "View your past queries and results", tone: "bg-yellow-50 text-yellow-700" },
  { name: "Future Scope", path: "/future", icon: Rocket, text: "Upcoming features and improvements", tone: "bg-rose-50 text-rose-700" },
];

const activityIcons = {
  advisory: Sprout,
  chatbot: Bot,
  voice: Mic,
  image: Camera,
  activity: History,
};

const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Heavy thunderstorm",
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("agroMitraUser") || "null");
  } catch {
    return null;
  }
};

const relativeTime = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "Recently";

  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const ranges = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  for (const [unit, duration] of ranges) {
    if (Math.abs(seconds) >= duration) {
      return formatter.format(Math.round(seconds / duration), unit);
    }
  }

  return "Just now";
};

const fetchWeatherAt = async ({ latitude, longitude, location }) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&timezone=auto`,
  );
  if (!response.ok) throw new Error("Weather service unavailable");

  const data = await response.json();
  const current = data.current;

  return {
    location,
    temperature: Math.round(current.temperature_2m),
    condition: weatherDescriptions[current.weather_code] || "Current conditions",
    humidity: Math.round(current.relative_humidity_2m),
    wind: Math.round(current.wind_speed_10m),
    rainfall: Number(current.precipitation || 0).toFixed(1),
    updatedAt: current.time,
  };
};

const fetchWeatherForLocation = async (location) => {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
  );
  const data = await response.json();
  const place = data.results?.[0];
  if (!place) throw new Error("Location not found");

  return fetchWeatherAt({
    latitude: place.latitude,
    longitude: place.longitude,
    location: [place.name, place.admin1].filter(Boolean).join(", "),
  });
};

const Dashboard = () => {
  const storedUser = getStoredUser();
  const today = useMemo(() => {
    const now = new Date();
    return {
      date: now.toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" }),
      day: now.toLocaleDateString("en-IN", { weekday: "long" }),
    };
  }, []);

  const [overview, setOverview] = useState({
    stats: {
      totalQueries: 0,
      cropsAnalyzed: 0,
      imagesScanned: 0,
      adviceGiven: 0,
      weeklyChange: {},
    },
    activities: [],
  });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState("Loading current weather...");

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const response = await getDashboardOverview();
        setOverview(response.data || overview);
      } catch (error) {
        console.error(error);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadOverview();
  }, []);

  useEffect(() => {
    let active = true;
    const fallbackLocation = storedUser?.profile?.location || "Kolkata, West Bengal";

    const setResult = (result) => {
      if (!active) return;
      setWeather(result);
      setWeatherStatus("");
    };

    const loadFallback = async () => {
      try {
        setResult(await fetchWeatherForLocation(fallbackLocation));
      } catch (error) {
        console.error(error);
        if (active) setWeatherStatus("Weather is temporarily unavailable");
      }
    };

    if (!navigator.geolocation) {
      loadFallback();
      return () => {
        active = false;
      };
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          let location = "Your current location";
          try {
            const placeResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`,
            );
            const place = await placeResponse.json();
            location =
              [place.city || place.locality, place.principalSubdivision].filter(Boolean).join(", ") ||
              location;
          } catch {
            // Coordinates still provide accurate weather if reverse geocoding fails.
          }

          setResult(
            await fetchWeatherAt({
              latitude: coords.latitude,
              longitude: coords.longitude,
              location,
            }),
          );
        } catch {
          loadFallback();
        }
      },
      loadFallback,
      { timeout: 7000, maximumAge: 15 * 60 * 1000 },
    );

    return () => {
      active = false;
    };
  }, []);

  const stats = overview.stats || {};
  const weeklyChange = stats.weeklyChange || {};
  const userName = storedUser?.name || overview.user?.name || "Ananya";

  return (
    <div className="grid gap-7 xl:grid-cols-[1fr_360px]">
      <div className="space-y-7">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Welcome back, {userName.split(" ")[0]}!</h1>
          <p className="mt-2 font-medium text-slate-500">Here is your latest Agro-Mitra activity.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statConfig.map((item) => {
            const Icon = item.icon;
            const change = Number(weeklyChange[item.key] || 0);
            const ChangeIcon = change < 0 ? TrendingDown : TrendingUp;

            return (
              <Card key={item.key} className="p-5">
                <div className="flex items-center gap-4">
                  <span className={`grid h-14 w-14 place-items-center rounded-xl ${item.tone}`}>
                    <Icon size={27} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-500">{item.label}</p>
                    <p className="text-3xl font-black text-slate-950">
                      {dashboardLoading ? "..." : stats[item.key] || 0}
                    </p>
                    <p className={`mt-1 text-xs font-bold ${change < 0 ? "text-rose-600" : "text-emerald-700"}`}>
                      <ChangeIcon className="mr-1 inline" size={13} />
                      {Math.abs(change)}% this week
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
                      &#8594;
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
          {overview.activities?.length ? (
            <div className="mt-4 divide-y divide-slate-100">
              {overview.activities.map((activity) => {
                const Icon = activityIcons[activity.type] || History;
                return (
                  <div key={activity.id || `${activity.title}-${activity.createdAt}`} className="flex items-center gap-3 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                      <Icon size={18} />
                    </span>
                    <p className="min-w-0 flex-1 text-sm font-bold leading-5 text-slate-700">{activity.title}</p>
                    <span className="shrink-0 text-xs font-medium text-slate-500">
                      {relativeTime(activity.createdAt)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm font-medium leading-6 text-slate-500">
              No activity yet. Use a core module and your latest work will appear here.
            </div>
          )}
          <button
            type="button"
            onClick={() => navigateTo("/history")}
            className="mt-3 w-full text-right text-sm font-black text-green-700"
          >
            View all activity &#8594;
          </button>
        </Card>

        <Card className="p-5">
          {weather ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-black leading-6 text-slate-950">{weather.location}</p>
                  <p className="text-sm font-medium text-slate-500">{weather.condition}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-3xl font-black text-slate-950">{weather.temperature}&deg;C</p>
                  <CloudSun className="ml-auto text-amber-400" size={34} />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["Humidity", `${weather.humidity}%`],
                  ["Wind", `${weather.wind} km/h`],
                  ["Rainfall", `${weather.rainfall} mm`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">{label}</p>
                    <p className="mt-1 font-black text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs font-medium text-slate-400">Live data from Open-Meteo</p>
            </>
          ) : (
            <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
              <CloudSun className="text-amber-400" size={28} />
              {weatherStatus}
            </div>
          )}
        </Card>
      </aside>
    </div>
  );
};

export default Dashboard;
