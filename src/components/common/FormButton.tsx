import React from 'react';

interface ButtonProps {
    text: string;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
}

const FormButton: React.FC<ButtonProps> = ({ text, type = 'button', onClick }) => {
    return (
        <button
            className="bg-secondary-100 hover:bg-secondary-200 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full"
            type={type}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default FormButton;