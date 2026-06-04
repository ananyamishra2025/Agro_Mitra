import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  CalendarDays,
  ChevronDown,
  Clock3,
  FileText,
  Image as ImageIcon,
  MessageSquareText,
  Mic,
  Search,
  Sparkles,
  Sprout,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { getHistory } from "../api/historyApi";
import BackButton from "../components/common/BackButton";

const typeConfig = {
  all: { label: "All", icon: FileText, tone: "bg-slate-100 text-slate-700" },
  chatbot: { label: "Chatbot", icon: Bot, tone: "bg-sky-50 text-sky-700" },
  advisory: { label: "Advisory", icon: Sprout, tone: "bg-emerald-50 text-emerald-700" },
  voice: { label: "Voice", icon: Mic, tone: "bg-violet-50 text-violet-700" },
  image: { label: "Image", icon: ImageIcon, tone: "bg-amber-50 text-amber-700" },
  demo: { label: "Demo", icon: Sparkles, tone: "bg-lime-50 text-lime-700" },
};

const normalizeText = (value) =>
  String(value || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const markdownProps = (props) => {
  const cleanProps = { ...props };
  delete cleanProps.node;
  return cleanProps;
};

const formatType = (type) => typeConfig[type]?.label || "Activity";

const HistoryMarkdown = ({ text, compact }) => (
  <div
    className={`history-markdown text-sm leading-7 text-slate-600 ${
      compact ? "max-h-32 overflow-hidden" : ""
    }`}
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: (props) => <p {...markdownProps(props)} className="mb-3 last:mb-0" />,
        strong: (props) => <strong {...markdownProps(props)} className="font-black text-slate-900" />,
        ul: (props) => <ul {...markdownProps(props)} className="mb-3 ml-5 list-disc space-y-1" />,
        ol: (props) => <ol {...markdownProps(props)} className="mb-3 ml-5 list-decimal space-y-1" />,
        li: (props) => <li {...markdownProps(props)} className="pl-1" />,
        h1: (props) => <h3 {...markdownProps(props)} className="mb-2 text-lg font-black text-slate-950" />,
        h2: (props) => <h3 {...markdownProps(props)} className="mb-2 text-base font-black text-slate-950" />,
        h3: (props) => <h4 {...markdownProps(props)} className="mb-2 font-black text-slate-950" />,
        table: (props) => (
          <table {...markdownProps(props)} className="mb-3 min-w-full border-collapse text-left text-xs" />
        ),
        th: (props) => (
          <th {...markdownProps(props)} className="border border-slate-200 bg-emerald-50 px-3 py-2 font-black" />
        ),
        td: (props) => <td {...markdownProps(props)} className="border border-slate-200 px-3 py-2 align-top" />,
      }}
    >
      {normalizeText(text)}
    </ReactMarkdown>
  </div>
);

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await getHistory("demoUser");
        const historyItems = Array.isArray(response.data?.history)
          ? response.data.history
          : Array.isArray(response.data)
            ? response.data
            : [];
        setHistory(historyItems);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const typeCounts = useMemo(
    () =>
      history.reduce(
        (counts, item) => ({
          ...counts,
          [item.type || "advisory"]: (counts[item.type || "advisory"] || 0) + 1,
        }),
        { all: history.length },
      ),
    [history],
  );

  const filteredHistory = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return history.filter((item) => {
      const matchesType = activeType === "all" || item.type === activeType;
      const searchable = `${item.type || ""} ${item.input || ""} ${item.output || ""} ${item.summary || ""}`.toLowerCase();
      return matchesType && (!needle || searchable.includes(needle));
    });
  }, [activeType, history, query]);

  const latestItem = history[0];
  const filterTypes = ["all", "chatbot", "advisory", "voice", "image", "demo"];

  return (
    <div className="space-y-6">
      <BackButton />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">Activity timeline</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 md:text-5xl">History</h1>
            <p className="mt-3 max-w-2xl font-medium leading-7 text-slate-600">
              Review past questions, advisory reports, voice requests, and image checks in one organized timeline.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[34rem]">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Total</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{history.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Showing</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{filteredHistory.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Latest</p>
              <p className="mt-1 truncate text-sm font-black text-slate-950">{latestItem?.createdAt || "No activity"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by question, answer, or activity type"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 font-semibold text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filterTypes.map((type) => {
              const config = typeConfig[type];
              const Icon = config.icon;
              const isActive = activeType === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-black transition ${
                    isActive
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-900/10"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                  }`}
                >
                  <Icon size={16} />
                  {config.label}
                  <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-white/20" : "bg-slate-100"}`}>
                    {typeCounts[type] || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {loading ? (
        <Loader />
      ) : history.length === 0 ? (
        <EmptyState type="history" title="No history found" text="Your advisory and assistant activity will be listed here." />
      ) : filteredHistory.length === 0 ? (
        <EmptyState type="history" title="No matching activity" text="Try a different search term or choose another history type." />
      ) : (
        <section className="space-y-4">
          {filteredHistory.map((item, index) => {
            const itemType = item.type || "advisory";
            const config = typeConfig[itemType] || typeConfig.advisory;
            const Icon = config.icon;
            const itemKey = item.id || `${item.createdAt}-${index}`;
            const isExpanded = Boolean(expanded[itemKey]);
            const output = item.summary || item.output || JSON.stringify(item);
            const isLong = normalizeText(output).length > 420;

            return (
              <article
                key={itemKey}
                className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-[0_18px_44px_rgba(15,23,42,0.08)]"
              >
                <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${config.tone}`}>
                    <Icon size={23} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${config.tone}`}>
                            {formatType(itemType)}
                          </span>
                          {item.createdAt && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                              <CalendarDays size={13} />
                              {item.createdAt}
                            </span>
                          )}
                        </div>

                        <h2 className="mt-3 line-clamp-2 text-xl font-black leading-7 text-slate-950">
                          {item.input || `${formatType(itemType)} activity`}
                        </h2>
                      </div>

                      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                        <Clock3 size={13} />
                        Saved
                      </span>
                    </div>

                    <div className="relative mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                      <HistoryMarkdown text={output} compact={isLong && !isExpanded} />
                      {isLong && !isExpanded && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-xl bg-gradient-to-t from-slate-50 to-transparent" />
                      )}
                    </div>

                    {isLong && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpanded((current) => ({
                            ...current,
                            [itemKey]: !isExpanded,
                          }))
                        }
                        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        {isExpanded ? "Show less" : "Read full answer"}
                        <ChevronDown size={16} className={`transition ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default HistoryPage;
