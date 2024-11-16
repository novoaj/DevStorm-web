import { ClientHome } from './components/ClientHome';
//https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

export default async function Home() {

  return (
    <div className="flex justify-center">
      <div className="justify-center content-center text-slate-100">
        <div className="animate-slideUp w-fit">
          <ClientHome/>
        </div>
      </div>
    </div>
  );
}
