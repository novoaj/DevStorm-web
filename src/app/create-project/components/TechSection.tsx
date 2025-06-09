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

interface TechSectionProps {
    selectedTech: { value: string; label: string }[];
    onChange: (choices: { value: string; label: string }[]) => void;
}

const TechSection: React.FC<TechSectionProps> = ({ selectedTech, onChange }) => {
    const options = [
        { value: "Java", label: "Java" },
        { value: "Python", label: "Python" },
        { value: "JavaScript", label: "JavaScript" },
        { value: "C", label: "C" },
        { value: "C++", label: "C++" },
        { value: "C#", label: "C#" },
        { value: "GoLang", label: "GoLang" },
        { value: "Rust", label: "Rust" },
        { value: "R", label: "R" },
        { value: "SQL", label: "SQL" },
        { value: "Swift", label: "Swift" },
        { value: "Kotlin", label: "Kotlin" },
        { value: "TypeScript", label: "TypeScript" },
        { value: "PHP", label: "PHP" },
        { value: "Ruby", label: "Ruby" },
        { value: "Dart", label: "Dart" },
    ];

    const customStyles = {
        option: (styles: any, { isSelected }: any) => ({
            ...styles,
            backgroundColor: isSelected ? '#171d22' : '#f8fafc',
            color: isSelected ? 'white' : '#171d22',
            '&:hover': {
                backgroundColor: '#171d22',
                color: 'white'
            }
        }),
        multiValue: (styles: any) => ({
            ...styles,
            backgroundColor: '#171d22',
        }),
        multiValueLabel: (styles: any) => ({
            ...styles,
            color: 'white',
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
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Select Technologies</h3>
                <p className="text-sm text-slate-300 mb-3">Choose up to 3 technologies you want to work with</p>
            </div>
            <Select
                value={selectedTech}
                onChange={(newValue) => onChange(newValue as { value: string; label: string }[])}
                options={options}
                isMulti
                closeMenuOnSelect={false}
                styles={customStyles}
                isOptionDisabled={() => selectedTech.length >= 3}
                placeholder="Select technologies..."
                className="text-slate-900"
                instanceId="tech-select" 
            />
        </div>
    );
};

export default TechSection;