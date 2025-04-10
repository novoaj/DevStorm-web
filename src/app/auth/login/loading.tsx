interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => (
    <div aria-live="polite" aria-busy="true" className={className}>
      <span className={`inline-flex py-3 w-full animate-pulse select-none rounded-md bg-primary-400 leading-none ${className}`}>
      </span>
      <br />
    </div>
  )

  const LoadingSkeleton = () => (
    <>
      <form className="max-w-md w-full bg-primary-300 border border-slate-500 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div>
          <h3 className="flex justify-center items-center mb-5">
            <Skeleton className="w-1/3 max-w-full" />
          </h3>
        </div>
        <div className="mb-4">
          <label className="block mb-2 rounded-md space-y-6">
            <Skeleton className="w-1/3 max-w-full" />
          </label>
          <div className="border rounded-full border-slate-500 w-full py-3 px-5 leading-tight focus:shadow-outline">
            <Skeleton className="w-[152px] max-w-full" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            <Skeleton className="w-1/3 max-w-full" />
          </label>
          <div className="border rounded-full border-slate-500 w-full py-3 px-5 leading-tight focus:shadow-outline">
            <Skeleton className="w-[152px] max-w-full" />
          </div>
        </div>
        <div className="flex items-end justify-end mt-10">
          <div className="py-2 px-4 focus:shadow-outline w-1/2">
            <Skeleton className="w-full max-w-full rounded-full" />
          </div>
        </div>
        <div className="flex items-center mt-8">
          <Skeleton className="w-[280px] max-w-full" />
          <Skeleton className="w-[64px] max-w-full" />
        </div>
      </form>
    </>
  );
  
  const Preview = () => (
    <div className="flex justify-center items-center min-h-[calc(100vh-96px)]">
      <LoadingSkeleton />
    </div>
  );
  
export default Preview;