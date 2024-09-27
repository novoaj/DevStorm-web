import { ClientHome } from './components/ClientHome';
//https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

export default async function Home() {

  return (
    <div className="flex justify-center min-h-screen">
      <div className="justify-center content-center mx-auto px-4 text-slate-100 sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-8/12">
        <div className="animate-slideUp w-fit mx-auto">
          <h1 className="text-4xl font-bold">Welcome to DevStorm!</h1>
          <p className="mt-4">Your guide to exploring tech careers through project-based learning.</p>
          <ClientHome/>
        </div>
      </div>
    </div>
  );
}
