import React from 'react';

const Input = ({ label, id, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow ${className}`}
                {...props}
            />
        </div>
    );
};

export default Input;
