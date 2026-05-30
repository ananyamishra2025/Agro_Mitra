const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) => {

  const styles = {
    primary:
      "bg-green-700 hover:bg-green-800 text-white shadow-green-900/20",

    secondary:
      "border border-green-700 bg-white text-green-800 hover:bg-green-50",

    ghost:
      "bg-white text-green-800 hover:bg-green-50 border border-green-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        rounded-xl px-6 py-3
        font-bold
        transition duration-300
        shadow-md hover:-translate-y-0.5 hover:shadow-lg
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
