export default function ProjectLoading() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-primary-300 rounded-full mb-4"></div>
        <div className="h-4 bg-primary-300 rounded w-48 mb-2"></div>
        <div className="h-3 bg-primary-300 rounded w-32"></div>
      </div>
    </div>
  );
}