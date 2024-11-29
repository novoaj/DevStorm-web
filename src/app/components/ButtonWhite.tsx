
import React from 'react';

interface ButtonWhiteProps {
    value: string;
    onClick?: () => void;
}

const ButtonWhite: React.FC<ButtonWhiteProps> = ({ value, onClick }) => {
    return (
        <button
            className="w-fit py-2 px-4 ml-2 bg-gray hover:bg-secondary-200 text-primary-100 hover:text-slate-100 rounded-full transition duration-300"
            onClick={onClick}
        >
            {value}
        </button>
    );
};

export default ButtonWhite;