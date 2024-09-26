
const About: React.FC = () => {
    return (
        <div className="min-h-screen container mx-auto my-8 p-4 text-slate-200">
            <div className="animate-slideUp my-4">
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