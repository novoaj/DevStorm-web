import header from "../../../public/images/about_header_clipart.webp";
import img1 from "../../../public/images/about_content_1.webp";
import img2 from "../../../public/images/about_content_2.webp";
import img3 from "../../../public/images/about_content_3.webp";
import Card from "./Card";
import Image from "next/image";

interface Image {
    src: string;
    title: string;
}

const images: Image[] = [
    { src: img2.src, title: 'Plan' },
    { src: img1.src, title: 'Build' },
    { src: img3.src, title: 'Deploy' }
];
const About: React.FC = () => {
    return (
        <div className="min-h-screen container mx-auto text-slate-200 justify-items-center lg:w-4/5 xl:w-4/5 2xl:w-4/5 z-0">
            <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:w-4/5 2xl:w-4/5 mx-auto justify-self-center">
                <Image 
                    src={header} 
                    alt="About Us Header Image" 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 75vw"
                    className="object-cover"
                    priority
                    />
                <div className="absolute inset-0 bg-black bg-opacity-65 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-slate-200">About DevStorm</h1>
                </div>
            </div>
            <div className="animate-slideUp my-4 xl:w-4/5 2xl:w-4/5 mx-auto ">
                <div className="border border-slate-500 bg-primary-400 rounded p-3">
                    <p className="text-lg mb-4 text-slate-300">
                        We are a group of Computer Science Graduates who are passionate about helping tech students come up with innovative project ideas. Our platform is designed to inspire and guide students as they explore various careers and industries.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                    <div className="shadow-lg bg-primary-400 border border-slate-500 rounded p-3">
                        <h2 className="text-2xl font-semibold mb-2 text-slate-200">Who We Are</h2>
                        <p className="text-slate-300">
                            We are a team of enthusiastic and driven individuals who have recently graduated with degrees in Computer Science. Our diverse backgrounds and shared passion for technology have brought us together to create this platform.
                        </p>
                    </div>
                    <div className="shadow-lg  bg-primary-400 border border-slate-500 rounded p-3">
                        <h2 className="text-2xl font-semibold mb-2 text-slate-200">What We Offer</h2>
                        <p className="text-slate-300">
                            Our platform offers a variety of resources and tools to help tech students brainstorm and develop project ideas. We provide guidance on exploring different careers and industries, and offer support throughout the project development process.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-row items-center align-center grid-cols-1 md:grid-cols-3 gap-4 mt-12 xl:w-4/5 2xl:w-4/5 mx-auto">
                {images.map((img, index) => (
                    <Card key={index} imgSrc={img.src} title={img.title} />
                ))}
            </div>
            <div className="h-16"></div>
        </div>
    );
};

export default About;