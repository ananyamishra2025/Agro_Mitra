import { Bell, BookOpen, CloudSun, MessageSquare, Sprout } from "lucide-react";
import Card from "../components/common/Card";

const notifications = [
  {
    icon: <Sprout size={24} />,
    title: "Crop advisory report is ready",
    text: "Your latest crop advisory can be reviewed from the dashboard history.",
    time: "Just now",
  },
  {
    icon: <CloudSun size={24} />,
    title: "Weather changed in your area",
    text: "Cloudy conditions may affect irrigation planning today.",
    time: "30 minutes ago",
  },
  {
    icon: <BookOpen size={24} />,
    title: "New learning resource added",
    text: "A new soil health guide is available in Learning Resources.",
    time: "2 hours ago",
  },
  {
    icon: <MessageSquare size={24} />,
    title: "Support enquiry received",
    text: "Your help request has been recorded by Agro-Mitra support.",
    time: "Yesterday",
  },
];

const NotificationsPage = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <p className="font-extrabold uppercase tracking-[0.22em] text-emerald-700">Notification center</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">Updates and alerts</h1>
        <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-slate-600">
          View advisory updates, weather alerts, support replies, and learning
          notifications in one place.
        </p>
      </section>

      <Card className="p-0">
        <div className="border-b border-slate-100 p-6">
          <h2 className="flex items-center gap-3 text-2xl font-black text-slate-950">
            <Bell className="text-emerald-700" />
            Recent Notifications
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {notifications.map((item) => (
            <div key={item.title} className="flex gap-4 p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                {item.icon}
              </span>
              <div className="flex-1">
                <h3 className="font-black text-slate-950">{item.title}</h3>
                <p className="mt-1 font-medium leading-7 text-slate-600">{item.text}</p>
              </div>
              <span className="text-sm font-bold text-slate-400">{item.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default NotificationsPage;
