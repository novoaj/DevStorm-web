import ClientHome from './components/ClientHome';
//https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

export default async function Home() {

  return (
    <div className="w-full">
        <div className="animate-slideUp w-full">
          <ClientHome/>
      </div>
    </div>
  );
}
