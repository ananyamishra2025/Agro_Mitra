const Button = ({ children, onClick, type = "button", variant = "primary" }) => {
  const base =
    "px-5 py-2 rounded-lg font-medium transition duration-200";

  const styles = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "border border-green-600 text-green-700 hover:bg-green-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
