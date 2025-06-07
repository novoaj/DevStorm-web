export default function ProfileLoading() {
  return (
    <div className="flex p-5 min-h-screen">
      <div className="animate-pulse flex justify-center flex-col md:flex-row w-full">
        <div className='mx-2 md:w-2/5 lg:w-2/5 xl:w-2/6 2xl:w-2/6'>
          <div className="h-96 mt-5 w-full bg-primary-300 border border-primary-200 rounded-md p-5">
            <div className="w-24 h-24 bg-primary-400 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-primary-400 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-3 bg-primary-400 rounded w-3/4 mx-auto mb-4"></div>
          </div>
        </div>
        <div className='mx-2 md:w-3/5 lg:w-3/5 xl:w-4/6 2xl:w-4/6'>
          <div className="h-96 mt-5 bg-primary-300 w-full border border-primary-200 p-5 rounded-md">
            <div className="h-6 bg-primary-400 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-primary-400 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}