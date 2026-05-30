import { BookOpen, History, Sprout } from "lucide-react";
import Card from "./Card";

const illustrationIcons = {
  learning: BookOpen,
  history: History,
  gardening: Sprout,
};

const EmptyState = ({ type = "learning", title, text }) => {
  const Icon = illustrationIcons[type] || BookOpen;

  return (
    <Card className="p-10 text-center">
      <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-emerald-50 text-emerald-700 ring-8 ring-emerald-50/60">
        <Icon size={48} />
      </div>
      <div className="mx-auto mt-6 h-3 w-40 rounded-full bg-emerald-100" />
      <div className="mx-auto mt-3 h-3 w-28 rounded-full bg-slate-100" />
      <h2 className="mt-8 text-3xl font-black text-slate-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-md font-medium leading-7 text-slate-600">{text}</p>
    </Card>
  );
};

export default EmptyState;
