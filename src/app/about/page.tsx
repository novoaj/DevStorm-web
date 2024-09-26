import Image from 'next/image';
import header from "../../../public/images/About-Us-Header-Dark.webp";

const About: React.FC = () => {
    return (
        <div className="min-h-screen container mx-auto text-slate-200 justify-items-center lg:w-4/5 xl:w-4/5 2xl:w-4/5 z-0">
            <div className="relative w-full h-min-content xl:w-4/5 2xl:w-4/5 mx-auto justify-self-center bg-blend-color-burn">
                <img src={header.src} alt="About Us Header Image" className="w-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-slate-200">About DevStorm</h1>
                </div>
            </div>
            <div className="animate-slideUp my-4 xl:w-4/5 2xl:w-4/5 mx-auto ">
                <h1 className="text-4xl font-bold mb-4">About DevStorm</h1>
                <p className="text-lg mb-4">
                    We are a group of new Computer Science graduates who are passionate about helping tech students come up with innovative project ideas. Our platform is designed to inspire and guide students as they explore various careers and industries.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 shadow-lg">
                        <h2 className="text-2xl font-semibold mb-2">Who We Are</h2>
                        <p>
                            We are a team of enthusiastic and driven individuals who have recently graduated with degrees in Computer Science. Our diverse backgrounds and shared passion for technology have brought us together to create this platform.
                        </p>
                    </div>
                    <div className="p-4 shadow-lg">
                        <h2 className="text-2xl font-semibold mb-2">What We Offer</h2>
                        <p>
                            Our platform offers a variety of resources and tools to help tech students brainstorm and develop project ideas. We provide guidance on exploring different careers and industries, and offer support throughout the project development process.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;