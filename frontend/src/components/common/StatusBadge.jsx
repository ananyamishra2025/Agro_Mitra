const StatusBadge = ({ status }) => {
  const styles = {
    live: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    preview: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    future: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] ${styles[status] || styles.future}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
