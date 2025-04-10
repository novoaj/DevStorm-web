import React from 'react';

interface InputProps {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<InputProps> = ({ id, label, type, placeholder, value, onChange }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
                {label}
            </label>
            <input
                className="shadow bg-primary-100 text-slate-100 appearance-none border border-slate-500 rounded-full w-full py-3 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:bg-primary-100 focus:text-gray-700"
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default FormInput;