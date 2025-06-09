import React from 'react';

interface FormActionsProps {
    onGenerate: () => void;
    onSave: () => void;
    onReset: () => void;
    isGenerating: boolean;
    isSaving: boolean;
    hasResults: boolean;
    canGenerate: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
    onGenerate,
    onSave,
    onReset,
    isGenerating,
    isSaving,
    hasResults,
    canGenerate,
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-primary-300 border border-slate-500 rounded-lg p-6">
            <button
                onClick={onReset}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors duration-200 disabled:opacity-50"
                disabled={isGenerating || isSaving}
            >
                Reset Form
            </button>

            <div className="flex gap-3">
                {!hasResults ? (
                    <button
                        onClick={onGenerate}
                        disabled={!canGenerate || isGenerating}
                        className={`px-8 py-2 rounded-full transition-colors duration-200 font-medium ${
                            canGenerate && !isGenerating
                                ? 'bg-secondary-100 hover:bg-secondary-200 text-slate-100'
                                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        }`}
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Generating...
                            </span>
                        ) : (
                            'Generate Project'
                        )}
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={onGenerate}
                            disabled={isGenerating}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-full transition-colors duration-200"
                        >
                            Regenerate
                        </button>
                        <button
                            onClick={onSave}
                            disabled={isSaving}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-full transition-colors duration-200"
                        >
                            {isSaving ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </span>
                            ) : (
                                'Save Project'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormActions;