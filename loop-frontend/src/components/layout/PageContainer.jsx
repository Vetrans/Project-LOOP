export default function PageContainer({ title, subtitle, children }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-gray-400">{subtitle}</p>
        )}
      </div>

      {children}
    </div>
  );
}