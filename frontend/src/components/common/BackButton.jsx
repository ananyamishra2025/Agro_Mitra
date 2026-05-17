import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="
        inline-flex items-center gap-2
        rounded-2xl
        border border-emerald-200
        bg-white
        px-5 py-3
        font-bold
        text-emerald-700
        shadow-sm
        transition-all duration-300
        hover:-translate-x-1
        hover:border-emerald-500
        hover:bg-emerald-50
        hover:shadow-md
      "
    >
      ← {label}
    </button>
  );
};

export default BackButton;