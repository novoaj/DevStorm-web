import { ClientHome } from './components/ClientHome';
// https://fkhadra.github.io/react-toastify/introduction/

//https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

export default async function Home() {
  // Fetch function with no-store caching
  // const csrfToken = await fetchCSRFToken();
  // console.log("parent component: ", csrfToken);
  // helper method to determine if a jwt token is expired/invalid

  return (
    <div className="flex justify-center min-h-screen">
      <div className="content-center mx-auto px-4 text-slate-100 sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-8/12">
        <h1 className="text-4xl font-bold mt-10">Welcome to our Brainstorming App!</h1>
        <p className="mt-4">Your guide to exploring tech careers as a student.</p>
        <ClientHome/>
      </div>
    </div>
  );
}
