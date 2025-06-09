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

interface RoleSectionProps {
    selectedRoles: { value: string; label: string }[];
    onChange: (choices: { value: string; label: string }[]) => void;
}

const RoleSection: React.FC<RoleSectionProps> = ({ selectedRoles, onChange }) => {
    const options = [
        { value: "Frontend Engineer", label: "Frontend Engineer" },
        { value: "Mobile Developer", label: "Mobile Developer" },
        { value: "Web Developer", label: "Web Developer" },
        { value: "Backend Engineer", label: "Backend Engineer" },
        { value: "Game Developer", label: "Game Developer" },
        { value: "Data Scientist", label: "Data Scientist" },
        { value: "Data Analyst", label: "Data Analyst" },
        { value: "AI/ML Engineer", label: "AI/ML Engineer" },
        { value: "Cybersecurity", label: "Cybersecurity" },
        { value: "DevOps Engineer", label: "DevOps Engineer" },
        { value: "Cloud Engineer", label: "Cloud Engineer" },
        { value: "Network Engineer", label: "Network Engineer" },
        { value: "Cybersecurity Engineer", label: "Cybersecurity Engineer" },
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
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Select Your Desired Role(s)</h3>
                <p className="text-sm text-slate-300 mb-3">Choose up to 3 roles that interest you</p>
            </div>
            <Select
                value={selectedRoles}
                onChange={(newValue) => onChange(newValue as { value: string; label: string }[])}
                options={options}
                isMulti
                closeMenuOnSelect={false}
                styles={customStyles}
                isOptionDisabled={() => selectedRoles.length >= 3}
                placeholder="Select roles..."
                className="text-slate-900"
                instanceId="role-select"
            />
        </div>
    );
};

export default RoleSection;