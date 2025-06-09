"use client";
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export interface UserSelections {
    roles: Array<{ value: string; label: string }>;
    tech: Array<{ value: string; label: string }>;
    industries: Array<{ value: string; label: string }>;
}

interface ResultsType {
    project_title: string;
    description: string;
    steps: Array<string>;
}

export const useProjectForm = () => {
    const [selections, setSelections] = useState<UserSelections>({
        roles: [],
        tech: [],
        industries: [],
    });
    
    const [results, setResults] = useState<ResultsType>({
        project_title: "",
        description: "",
        steps: [],
    });
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasResults, setHasResults] = useState(false);
    
    const router = useRouter();

    const updateSelection = (category: keyof UserSelections, choices: Array<{ value: string; label: string }>) => {
        setSelections(prev => ({
            ...prev,
            [category]: choices,
        }));
    };

    const validateForm = (): boolean => {
        if (selections.roles.length === 0) {
            toast.error('Please select at least one role');
            return false;
        }
        if (selections.tech.length === 0) {
            toast.error('Please select at least one technology');
            return false;
        }
        if (selections.industries.length !== 1) {
            toast.error('Please select exactly one industry');
            return false;
        }
        return true;
    };

    const generateProject = async () => {
        if (!validateForm()) return;
        
        setIsGenerating(true);
        
        try {
            const response = await fetch('/api/api/prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    role: selections.roles.map(role => role.value),
                    technology: selections.tech.map(tech => tech.value),
                    industries: selections.industries.map(industry => industry.value),
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const obj = JSON.parse(data.response);
                setResults(obj);
                setHasResults(true);
                toast.success('Project generated successfully!');
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.message || 'Error generating project. Please try again.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error generating project. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const saveProject = async () => {
        if (!hasResults) return;
        
        setIsSaving(true);
        
        try {
            const response = await fetch('/api/project/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    title: results.project_title,
                    summary: results.description,
                    steps: results.steps,
                    languages: selections.tech.map(technology => technology.value)
                }),
            });

            if (response.ok) {
                toast.success('Project saved successfully!');
                router.push("/profile");
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.message || 'Error saving project. Please try again.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error saving project. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const resetForm = () => {
        setSelections({
            roles: [],
            tech: [],
            industries: [],
        });
        setResults({
            project_title: "",
            description: "",
            steps: [],
        });
        setHasResults(false);
    };

    return {
        selections,
        results,
        isGenerating,
        isSaving,
        hasResults,
        updateSelection,
        generateProject,
        saveProject,
        resetForm,
    };
};