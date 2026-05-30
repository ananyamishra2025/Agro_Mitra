import {
  BadgeIndianRupee,
  CloudSun,
  Landmark,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import Card from "../components/common/Card";

const futureScopes = [
  {
    icon: <BadgeIndianRupee size={28} />,
    title: "Market Price Prediction",
    text: "AI based market price forecasting for crops and local mandis.",
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: <CloudSun size={28} />,
    title: "Weather Prediction",
    text: "Accurate weather updates, alerts, and farm activity suggestions.",
    tone: "bg-sky-50 text-sky-700",
  },
  {
    icon: <Users size={28} />,
    title: "Community Forum",
    text: "Connect with other farmers, gardeners, students, and experts.",
    tone: "bg-violet-50 text-violet-700",
  },
  {
    icon: <Landmark size={28} />,
    title: "Government Schemes",
    text: "Information about farmer schemes, benefits, and eligibility.",
    tone: "bg-amber-50 text-amber-700",
  },
];

const FutureScopePage = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-extrabold uppercase tracking-[0.22em] text-emerald-700">Future scope</p>
            <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">
              Upcoming features in Agro-Mitra
            </h1>
            <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-slate-600">
              These planned additions will make Agro-Mitra more useful for real
              farm decisions, market planning, weather awareness, and community support.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-black text-sky-700 ring-1 ring-sky-200">
            <Sparkles size={17} />
            Coming Soon
          </span>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Future Scope</h2>
              <p className="mt-1 font-medium text-slate-600">Upcoming features in Agro-Mitra</p>
            </div>
            <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-black text-sky-700">
              Coming Soon
            </span>
          </div>

          <div className="mt-6 divide-y divide-emerald-100 rounded-xl border border-emerald-100 bg-white">
            {futureScopes.map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-5">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${item.tone}`}>
                  {item.icon}
                </span>
                <div>
                  <h3 className="font-black text-slate-950">{item.title}</h3>
                  <p className="mt-1 font-medium leading-6 text-slate-600">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          {futureScopes.map((item) => (
            <Card key={item.title} className="p-6">
              <span className={`grid h-14 w-14 place-items-center rounded-xl ${item.tone}`}>
                {item.icon}
              </span>
              <h3 className="mt-5 text-xl font-black text-slate-950">{item.title}</h3>
              <p className="mt-2 font-medium leading-7 text-slate-600">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-100 bg-green-900 p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        <h2 className="text-3xl font-black">Why these features matter</h2>
        <p className="mt-4 max-w-4xl text-lg font-medium leading-8 text-green-50">
          Agro-Mitra can grow from a smart assistant into a complete agriculture
          platform by combining crop advice, price awareness, weather alerts,
          community learning, and scheme information in one place.
        </p>
      </section>
    </div>
  );
};

export default FutureScopePage;
