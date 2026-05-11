const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-green-700">
        {title}
      </h2>

      {subtitle && (
        <p className="text-gray-600 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
