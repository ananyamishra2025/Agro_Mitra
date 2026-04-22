const Card = ({ children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 transition duration-300 hover:shadow-xl">
      {children}
    </div>
  );
};

export default Card;
