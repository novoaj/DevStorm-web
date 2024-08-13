
import React from 'react';

const Navbar: React.FC = () => {
    return (
        <header className="flex flex-row justify-between max-w-5xl mx-auto px-4 py-3 sm:px-6">
            <a href="/">Home</a> {/* This will be on the left */}
            <div > {/* This will be on the right */}
                <a className="sm:px-3 md:px-5" href="/login">Login</a>
                <a className="sm:px-3 md:px-5" href="/register">Signup</a>
                <a className="sm:px-3 md:px-5" href="/about">About</a>
            </div>
        </header>
    );
};

export default Navbar;