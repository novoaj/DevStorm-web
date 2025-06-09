"use client";
import React from 'react';
import { useProjectForm } from '../hooks/useProjectForm';
import RoleSection from './RoleSection';
import TechSection from './TechSection';
import IndustrySection from './IndustrySection';
import FormActions from './FormActions';
import Results from './Results';

const CreateProjectForm: React.FC = () => {
    const {
        selections,
        results,
        isGenerating,
        isSaving,
        hasResults,
        updateSelection,
        generateProject,
        saveProject,
        resetForm,
    } = useProjectForm();

    return (
        <div className="space-y-8">
            {/* Form Sections */}
            <div className="bg-primary-300 border border-slate-500 rounded-lg p-6 space-y-8">
                <RoleSection 
                    selectedRoles={selections.roles}
                    onChange={(choices) => updateSelection('roles', choices)}
                />
                
                <div className="border-t border-slate-500 pt-6">
                    <TechSection 
                        selectedTech={selections.tech}
                        onChange={(choices) => updateSelection('tech', choices)}
                    />
                </div>
                
                <div className="border-t border-slate-500 pt-6">
                    <IndustrySection 
                        selectedIndustry={selections.industries}
                        onChange={(choices) => updateSelection('industries', choices)}
                    />
                </div>
            </div>

            {/* Results Section */}
            {hasResults && (
                <div className="bg-primary-300 border border-slate-500 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-slate-200 mb-4">Generated Project</h3>
                    <Results results={results} />
                </div>
            )}

            {/* Form Actions */}
            <FormActions 
                onGenerate={generateProject}
                onSave={saveProject}
                onReset={resetForm}
                isGenerating={isGenerating}
                isSaving={isSaving}
                hasResults={hasResults}
                canGenerate={
                    selections.roles.length > 0 && 
                    selections.tech.length > 0 && 
                    selections.industries.length === 1
                }
            />
        </div>
    );
};

export default CreateProjectForm;