const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
}) => {

  const styles = {
    primary:
      "bg-green-700 hover:bg-green-800 text-white",

    secondary:
      "border border-green-700 text-green-700 hover:bg-green-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-6 py-3 rounded-2xl
        font-semibold
        transition duration-300
        shadow-sm hover:shadow-md
        ${styles[variant]}
      `}
    >
      {children}
    </button>
  );
};

export default Button;