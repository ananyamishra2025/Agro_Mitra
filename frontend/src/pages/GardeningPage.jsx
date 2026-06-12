import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Leaf,
  Search,
  Sparkles,
  Sprout,
  Users,
} from "lucide-react";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { getGardeningTips } from "../api/gardeningApi";
import BackButton from "../components/common/BackButton";

const categoryTones = {
  "Daily Care": "bg-emerald-50 text-emerald-700",
  Watering: "bg-sky-50 text-sky-700",
  "Soil & Compost": "bg-amber-50 text-amber-700",
  "Pest Management": "bg-rose-50 text-rose-700",
  Education: "bg-violet-50 text-violet-700",
  "Organic Gardening": "bg-lime-50 text-lime-700",
};

const getCategoryTone = (category) =>
  categoryTones[category] || "bg-slate-100 text-slate-700";

const getDayNumber = () => {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  return Math.floor((today - start) / 86400000);
};

const getDailyTips = (tips, count = 3) => {
  if (!tips.length) return [];
  const startIndex = getDayNumber() % tips.length;

  return Array.from({ length: Math.min(count, tips.length) }, (_, index) => {
    const offset = index * 5;
    return tips[(startIndex + offset) % tips.length];
  });
};

const GardeningPage = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoading(true);
        const response = await getGardeningTips();
        setTips(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(tips.map((tip) => tip.category).filter(Boolean))],
    [tips],
  );

  const dailyTips = useMemo(() => getDailyTips(tips), [tips]);

  const filteredTips = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return tips.filter((tip) => {
      const matchesCategory = category === "All" || tip.category === category;
      const searchable = [
        tip.title,
        tip.description,
        tip.category,
        tip.source,
        ...(tip.audience || []),
        ...(tip.tasks || []),
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!needle || searchable.includes(needle));
    });
  }, [category, query, tips]);

  const todayLabel = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const documentCount = tips.filter((tip) =>
    String(tip.format || "").toLowerCase().includes("pdf"),
  ).length;

  return (
    <div className="space-y-6">
      <BackButton />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">
              Garden knowledge centre
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              Daily Gardening Guide
            </h1>
            <p className="mt-3 max-w-3xl font-medium leading-7 text-slate-600">
              Follow practical daily tasks and read trusted gardening manuals for home gardens,
              farms, student projects, and agricultural research.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 xl:min-w-[31rem]">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Topics</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{tips.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Documents</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{documentCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Daily tasks</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{dailyTips.length}</p>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <Loader />
      ) : tips.length === 0 ? (
        <EmptyState
          type="gardening"
          title="No tips available"
          text="Gardening tips will appear when the API responds."
        />
      ) : (
        <>
          <section>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                  <CalendarDays size={22} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                    Today&apos;s garden plan
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">{todayLabel}</h2>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-lime-50 px-4 py-2 text-sm font-black text-lime-700">
                <Sparkles size={16} />
                New tasks rotate every day
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {dailyTips.map((tip, index) => (
                <article
                  key={tip.id}
                  className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                      {index === 0 ? <Leaf size={22} /> : <Sprout size={22} />}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                      Task {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-black leading-7 text-slate-950">{tip.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{tip.description}</p>
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      <CheckCircle2 size={15} />
                      Do this today
                    </p>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                      {tip.tasks?.[getDayNumber() % tip.tasks.length]}
                    </p>
                  </div>
                  <a
                    href={tip.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-black text-emerald-700 hover:text-emerald-900"
                  >
                    Read full guide
                    <ArrowUpRight size={16} />
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search watering, compost, pests, kitchen garden, organic farming..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 font-semibold text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-black transition ${
                      category === item
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {filteredTips.length === 0 ? (
            <EmptyState
              type="gardening"
              title="No matching gardening guide"
              text="Try another search term or choose a different category."
            />
          ) : (
            <section className="grid gap-5 lg:grid-cols-2">
              {filteredTips.map((tip) => (
                <article
                  key={tip.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-[0_18px_44px_rgba(15,23,42,0.08)] md:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-lime-50 text-lime-700">
                      <Sprout size={24} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${getCategoryTone(tip.category)}`}
                        >
                          {tip.category}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                          <Clock3 size={12} />
                          {tip.duration}
                        </span>
                      </div>
                      <h2 className="mt-3 text-xl font-black leading-7 text-slate-950">{tip.title}</h2>
                      <p className="mt-1 text-sm font-bold text-emerald-700">{tip.source}</p>
                    </div>
                  </div>

                  <p className="mt-4 font-medium leading-7 text-slate-600">{tip.description}</p>

                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.15em] text-slate-400">
                      Practical steps
                    </p>
                    <ul className="space-y-2.5">
                      {(tip.tasks || []).map((task) => (
                        <li key={task} className="flex gap-3 text-sm font-medium leading-6 text-slate-600">
                          <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={17} />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(tip.audience || []).map((audience) => (
                      <span
                        key={audience}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-500"
                      >
                        <Users size={12} />
                        {audience}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-500">
                      {String(tip.format).includes("PDF") ? <FileText size={17} /> : <BookOpen size={17} />}
                      {tip.format}
                    </span>
                    <a
                      href={tip.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800"
                    >
                      <GraduationCap size={17} />
                      {String(tip.format).includes("PDF") ? "Open document" : "Read guide"}
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default GardeningPage;
