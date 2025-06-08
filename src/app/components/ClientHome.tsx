import Image from "next/image";
import dynamic from 'next/dynamic';
import ClientHomeActions from "./ClientHomeActions";
import generateImg from "../../../public/images/home/generate_project_sequence.webp";
import guidanceImg from "../../../public/images/home/developer_brainstorm_4x3.webp";
import projectManagementImg from "../../../public/images/home/manage_workflow_board_clean_4x3.webp";

// lazy load contact form
const ContactForm = dynamic(() => import('./ContactForm').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse h-64 bg-primary-200 rounded"></div>
});

export const ClientHome: React.FC = () => {
    return (
        <div id="wrapper" className="w-full overflow-x-hidden">
            <div id="section-intro" className="text-center min-h-[calc(100vh-96px)] content-center">
                <div id="intro-content" className="w-full min-w-min md:px-64 px-12 text-left">
                    <h1 className="text-5xl text-slate-100 font-bold mb-4">Code, Learn, and Grow with AI-Guided Projects</h1>
                    <p className="text-lg text-slate-300 mb-8">Join now to start exploring tech careers through project-based learning.</p>
                    <ClientHomeActions />
                </div>
            </div>

            <div id="section-one" className="flex flex-col w-full">
                <section className="flex flex-col md:flex-row bg-primary-200">
                    <div className="relative w-full md:w-96 min-w-0 aspect-[4/3]">
                        <Image 
                            src={generateImg} 
                            alt="AI-generated project ideas interface" 
                            fill
                            quality={75}
                            priority={true}
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 384px"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rr"
                        />
                    </div>
                    <div className="px-12 py-8 md:p-8 flex-1 min-w-0 content-center">
                        <h2 className="text-4xl pb-4 text-slate-100">Project ideas that will stand out</h2>
                        <p className="text-sm md:text-base text-slate-200">Our generated project ideas focus on leading technologies and languages used in the industries that interest users the most.</p>
                    </div>
                </section>

                <section className="flex flex-col md:flex-row bg-primary-100">
                    <div className="relative w-full md:w-96 min-w-0 aspect-[4/3]">
                        <Image 
                            src={guidanceImg} 
                            alt="Step-by-step coding guidance visualization" 
                            fill
                            quality={70}
                            loading="lazy"
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 384px"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rr"
                       
                        />
                    </div>
                    <div className="px-12 py-8 md:p-8 flex-1 min-w-0 content-center">
                        <h2 className="text-4xl pb-2 text-slate-100">Guidance Through Your Coding Journey</h2>
                        <p className="text-sm md:text-base text-slate-300">Our platform provides step-by-step instructions and resources to help you navigate the programming process.</p>
                    </div>
                </section>

                <section className="flex flex-col md:flex-row bg-primary-300">
                    <div className="relative w-full md:w-96 min-w-0 aspect-[4/3]">
                        <Image 
                            src={projectManagementImg} 
                            alt="Team collaboration and project management tools" 
                            fill
                            quality={70}
                            loading="lazy"
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 384px"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rr"
                        />
                    </div>
                    <div className="px-12 py-8 md:p-8 flex-1 min-w-0 content-center">
                        <h2 className="text-4xl pb-2 text-slate-300">Collaborate and Grow Together</h2>
                        <p className="text-sm md:text-base text-slate-300">Our platform fosters collaboration by connecting you with like-minded individuals.</p>
                    </div>
                </section>
            </div>

            <div id="section-two" className="flex flex-col w-full">
                <div className="flex flex-col bg-primary-100 py-12 px-8">
                    <div id="section-two-header" className="pt-8"> 
                        <h2 className="text-4xl pb-2 text-slate-50">Building Projects with Devstorm</h2>
                        <p className="text-slate-300">Our product is a platform that allows users to generate project ideas, follow step-by-step instructions to complete their projects, and collaborate with others.</p>
                    </div>
                    <div id="section-two-features">
                        <section className="my-12 grid grid-cols-1 md:grid-cols-2 gap-0"> 
                            <div className="border border-primary-200 p-5">
                                <h3 className="text-2xl pb-2 text-slate-50">Personalized Project Generation</h3>
                                <p className="text-slate-300">Tell us about your career goals and interests, and we’ll help you create projects that align with your path.</p>
                            </div>
                            <div className="border border-primary-200 p-5">
                                <h3 className="text-2xl pb-2 text-slate-50">Step-by-Step Guidance</h3>
                                <p className="text-slate-300">Never feel lost in your project journey. Each project comes with AI-generated, detailed instructions.</p>
                            </div>
                            <div className="border border-primary-200 p-5">
                                <h3 className="text-2xl pb-2 text-slate-50">Progress Tracking</h3>
                                <p className="text-slate-300">Stay motivated with our intuitive progress tracking system.</p>
                            </div>
                            <div className="border border-primary-200 p-5">
                                <h3 className="text-2xl pb-2 text-slate-50">Project Portfolio</h3> 
                                <p className="text-slate-300">Build a compelling portfolio of projects that demonstrates your skills.</p>
                            </div>
                        </section>
                        <ClientHomeActions />
                    </div>
                </div>
            </div>

            {/* Contact Section - Lazy loaded */}
            <div id="section-footer" className="flex flex-col w-full bg-primary-300 py-12 px-12">
                <h2 className="text-4xl pb-4 text-slate-50">Contact Us</h2>
                <p className="text-slate-300 mb-6">We’d love to hear your feedback!</p>
                <ContactForm />
            </div>
        </div>
    );
};

export default ClientHome;
