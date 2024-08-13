'use client'
import React, { useState } from 'react';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your registration logic here
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form className="w-1/3 p-6 bg-white rounded shadow" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6">Register</h2>
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-2 font-medium">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 font-medium">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-2 font-medium">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;