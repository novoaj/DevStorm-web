"use client";
import { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // TODO: Implement form submission
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        console.log('Form submitted:', formData);
        
        setIsSubmitting(false);
        setFormData({ name: '', email: '', message: '' }); // Reset form
    };

    return (
        <form className="max-w-2xl" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        autoComplete="name"
                        className="w-full p-2 rounded-md bg-primary-200 border border-primary-300 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary-100 transition-colors"
                    />
                </div>
                <div className="flex-1">
                    <input 
                        type="email"
                        placeholder="Email" 
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        autoComplete="email"
                        className="w-full p-2 rounded-md bg-primary-200 border border-primary-300 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary-100 transition-colors"
                    />
                </div>
            </div>

            <div className="mb-4">
                <textarea 
                    placeholder="Your message" 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full p-2 rounded-md bg-primary-200 border border-primary-300 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary-100 transition-colors"
                />
            </div>
            
            <button 
                type="submit"
                disabled={isSubmitting}
                className={`text-sm font-bold py-2 px-4 rounded-full transition duration-300 ${
                    isSubmitting 
                        ? 'bg-primary-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-primary-200 border border-primary-300 hover:bg-primary-100 text-slate-200'
                }`}
            >
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
};

export default ContactForm;