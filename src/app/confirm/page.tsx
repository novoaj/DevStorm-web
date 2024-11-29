import React from 'react';

const ConfirmPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-96px)] bg-primary-400 text-gray">
            <div className="p-6 bg-primary-300 rounded shadow-md border border-primary-200">
                <h1 className="text-2xl font-bold mb-4">Confirm Your Account</h1>
                <p>Check your email for confirmation link</p>
            </div>
        </div>
    );
};

export default ConfirmPage;