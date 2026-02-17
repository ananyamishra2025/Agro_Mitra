const StatusBadge = ({ status }) => {
  const styles = {
    live: "bg-green-100 text-green-700",
    preview: "bg-yellow-100 text-yellow-700",
    future: "bg-gray-200 text-gray-600",
  };

  return (
    <span className={`px-3 py-1 text-sm rounded-full ${styles[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default StatusBadge;
