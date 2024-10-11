"use client"
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

const ConfirmEmailPage: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [confirmationStatus, setConfirmationStatus] = useState<string | null>(null);
    const token = pathname.split('/').pop();
    
    useEffect(() => {
        if (token) {
            // Simulate an API call to confirm the email
            const confirmEmail = async () => {
                try {
                    // Replace with your actual API call
                    const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + `/confirm/${token}`);
                    if (response) {
                        setConfirmationStatus('Email confirmed successfully!');
                        toast.success("Email confirmed, redirecting to home");
                        router.push("/");
                        // redirect
                    } else {
                        setConfirmationStatus('Failed to confirm email.');
                    }
                } catch (error) {
                    setConfirmationStatus('An error occurred while confirming email.');
                }
            };

            confirmEmail();
        }
    }, [token]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary-400 text-gray">
            <div className="p-6 bg-primary-300 rounded shadow-md border border-primary-200">
            <h1 className="text-2xl font-bold mb-4">Confirm Email</h1>
            {confirmationStatus ? (
                <p>{confirmationStatus}</p>
            ) : (
                <p>Confirming your email and redirecting...</p>
            )}
            </div>
        </div>
    );
};

export default ConfirmEmailPage;