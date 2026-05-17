const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-[2rem]
        border border-emerald-100
        bg-white
        p-6
        shadow-lg

        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-2xl

        ${className}
      `}
    >

      {/* Soft Glow */}
      <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-emerald-100/40 blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

    </div>
  );
};

export default Card;
