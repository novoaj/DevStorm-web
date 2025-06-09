"use client";
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Select to prevent SSR
const Select = dynamic(() => import('react-select'), {
    ssr: false,
    loading: () => (
        <div className="bg-white border border-gray-300 rounded px-3 py-2 text-slate-400">
            Loading options...
        </div>
    )
});

interface IndustrySectionProps {
    selectedIndustry: { value: string; label: string }[];
    onChange: (choices: { value: string; label: string }[]) => void;
}

const IndustrySection: React.FC<IndustrySectionProps> = ({ selectedIndustry, onChange }) => {
    const options = [
        { value: "Technology", label: "Technology" },
        { value: "Finance", label: "Finance" },
        { value: "Fitness", label: "Fitness" },
        { value: "Environment", label: "Environment" },
        { value: "Entertainment", label: "Entertainment" },
        { value: "Social Media", label: "Social Media" },
        { value: "Food", label: "Food" },
        { value: "Gaming", label: "Gaming" },
        { value: "Healthcare", label: "Healthcare" },
        { value: "Education", label: "Education" },
        { value: "E-commerce", label: "E-commerce" },
        { value: "Travel", label: "Travel" },
    ];

    const handleChange = (choice: any) => {
        // Industry selection is single-select, so wrap in array
        onChange(choice ? [choice] : []);
    };

    const customStyles = {
        option: (styles: any, { isSelected }: any) => ({
            ...styles,
            backgroundColor: isSelected ? '#171d22' : '#f8fafc', // text-slate-200
            color: isSelected ? 'white' : '#171d22',
            '&:hover': {
                backgroundColor: '#171d22',
                color: 'white'
            }
        }),
        singleValue: (styles: any) => ({
            ...styles,
            color: '#171d22',
        }),
        control: (styles: any) => ({
            ...styles,
            backgroundColor: '#f8fafc',
            borderColor: '#cbd5e1',
        }),
        menu: (styles: any) => ({
            ...styles,
            backgroundColor: '#f8fafc',
        }),
    };

    return (
        <div className="space-y-3">
            <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Select Industry</h3>
                <p className="text-sm text-slate-300 mb-3">Choose exactly one industry for your project</p>
            </div>
            <Select
                value={selectedIndustry[0] || null}
                onChange={handleChange}
                options={options}
                isClearable
                closeMenuOnSelect={true}
                styles={customStyles}
                placeholder="Select an industry..."
                className="text-slate-900"
                instanceId="industry-select"
            />
        </div>
    );
};

export default IndustrySection;