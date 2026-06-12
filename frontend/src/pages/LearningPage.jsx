import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Database,
  FileText,
  GraduationCap,
  Library,
  Search,
  Star,
} from "lucide-react";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { getLearningResources } from "../api/learningApi";
import BackButton from "../components/common/BackButton";

const resourceTypeConfig = {
  document: {
    label: "PDF document",
    action: "Open PDF",
    icon: FileText,
    tone: "bg-rose-50 text-rose-700",
  },
  journal: {
    label: "Open-access journal",
    action: "Read journal",
    icon: BookOpen,
    tone: "bg-sky-50 text-sky-700",
  },
  repository: {
    label: "Research library",
    action: "Browse resource",
    icon: Database,
    tone: "bg-violet-50 text-violet-700",
  },
  guide: {
    label: "Knowledge portal",
    action: "Open portal",
    icon: Library,
    tone: "bg-emerald-50 text-emerald-700",
  },
  article: {
    label: "Article",
    action: "Read article",
    icon: BookOpen,
    tone: "bg-amber-50 text-amber-700",
  },
};

const getTypeConfig = (type) => resourceTypeConfig[type] || resourceTypeConfig.article;

const LearningPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await getLearningResources();
        setResources(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(resources.map((resource) => resource.category).filter(Boolean))],
    [resources],
  );

  const filteredResources = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesCategory = category === "All" || resource.category === category;
      const searchable = [
        resource.title,
        resource.description,
        resource.publisher,
        resource.category,
        ...(resource.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!needle || searchable.includes(needle));
    });
  }, [category, query, resources]);

  const featuredResources = resources.filter((resource) => resource.featured).slice(0, 4);
  const pdfCount = resources.filter((resource) => resource.type === "document").length;
  const researchCount = resources.filter((resource) =>
    ["journal", "repository"].includes(resource.type),
  ).length;

  return (
    <div className="space-y-6">
      <BackButton />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">Knowledge hub</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              Agriculture Learning Library
            </h1>
            <p className="mt-3 max-w-3xl font-medium leading-7 text-slate-600">
              Read verified publications, production guides, open-access journals, and research
              databases from ICAR, FAO, TNAU, and other trusted institutions.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 xl:min-w-[31rem]">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Resources</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{resources.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">PDFs</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{pdfCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Research</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{researchCount}</p>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <Loader />
      ) : resources.length === 0 ? (
        <EmptyState
          type="learning"
          title="No resources available"
          text="Learning content will appear here when resources are available."
        />
      ) : (
        <>
          {featuredResources.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
                  <Star size={20} />
                </span>
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Recommended starting points</h2>
                  <p className="text-sm font-medium text-slate-500">Useful for coursework and research</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {featuredResources.map((resource) => {
                  const config = getTypeConfig(resource.type);
                  const Icon = config.icon;

                  return (
                    <a
                      key={resource.link}
                      href={resource.link}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex min-h-48 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.09)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className={`grid h-11 w-11 place-items-center rounded-xl ${config.tone}`}>
                          <Icon size={22} />
                        </span>
                        <ArrowUpRight className="text-slate-300 transition group-hover:text-emerald-600" size={20} />
                      </div>
                      <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
                        {resource.category}
                      </p>
                      <h3 className="mt-2 text-lg font-black leading-6 text-slate-950">{resource.title}</h3>
                      <p className="mt-auto pt-4 text-sm font-bold text-slate-500">{resource.publisher}</p>
                    </a>
                  );
                })}
              </div>
            </section>
          )}

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
                  placeholder="Search crop production, soil science, journals, organic farming..."
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

          {filteredResources.length === 0 ? (
            <EmptyState
              type="learning"
              title="No matching resources"
              text="Try another keyword or select a different subject category."
            />
          ) : (
            <section className="grid gap-5 lg:grid-cols-2">
              {filteredResources.map((resource) => {
                const config = getTypeConfig(resource.type);
                const Icon = config.icon;

                return (
                  <article
                    key={resource.link}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-[0_18px_44px_rgba(15,23,42,0.08)] md:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${config.tone}`}>
                        <Icon size={24} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${config.tone}`}>
                            {config.label}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                            {resource.category}
                          </span>
                          {resource.year && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                              {resource.year}
                            </span>
                          )}
                        </div>
                        <h2 className="mt-3 text-xl font-black leading-7 text-slate-950">{resource.title}</h2>
                        <p className="mt-1 text-sm font-bold text-emerald-700">{resource.publisher}</p>
                      </div>
                    </div>

                    <p className="mt-4 flex-1 font-medium leading-7 text-slate-600">{resource.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(resource.tags || []).slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-500">
                        <GraduationCap size={17} />
                        {resource.format || "Online resource"}
                      </span>
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800"
                      >
                        {config.action}
                        <ArrowUpRight size={17} />
                      </a>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default LearningPage;
