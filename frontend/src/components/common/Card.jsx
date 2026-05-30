const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-xl
        border border-emerald-100/80
        bg-white
        p-6
        shadow-[0_14px_40px_rgba(15,23,42,0.08)]

        transition-all duration-300
        hover:-translate-y-1.5
        hover:border-emerald-200
        hover:shadow-[0_22px_54px_rgba(15,23,42,0.14)]

        ${className}
      `}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;
