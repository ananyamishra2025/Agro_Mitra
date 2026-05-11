const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
}) => {
  const styles = {
    primary:
      "bg-green-700 text-white hover:bg-green-800",
    secondary:
      "border border-green-700 text-green-700 hover:bg-green-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-5 py-2 rounded-xl font-medium transition duration-300 ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
