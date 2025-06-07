'use client'
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserContext';
import { handleLoginSubmit } from './loginUtils';
import Preview from './loading';
import LoginForm from './LoginForm';

function LoginPage() {
    const [loading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const { isLoggedIn, setIsLoggedIn} = useContext(UserContext);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const{ username, password } = formData;
        setIsLoading(true);
        try {
            const loginStatus = await handleLoginSubmit(username, password, setIsLoggedIn, router);
            if (loginStatus.success) {
                router.push("/profile");
            }else {
                setIsLoading(false);
            }
            
        }catch (error){
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-96px)]">
            {loading ? 
                <Preview/> : 
                <LoginForm onSubmit={handleSubmit} formData={formData} handleChange={handleChange}/>
                }
        </div>
    );
}

export default LoginPage;