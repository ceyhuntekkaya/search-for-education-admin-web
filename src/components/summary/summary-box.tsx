'use client';

import React from 'react';


interface BankFormProps {
    title: string;
    footer: string;
    content: string;
    color?: string;
}

const SummaryBox: React.FC<BankFormProps> = ({
                                                 title,
                                                 footer = '',
                                                 content,
                                                 color = 'green'
                                             }) => {


    return (
        <div className="bg-white p-4 rounded border">
            <div className="text-sm text-gray-600">{title}</div>
            <div className={`text-xl font-bold text-${color}-600`}>
                {content}
            </div>
            <div className="text-xs text-gray-500 mt-1">
                {footer}
            </div>
        </div>
    );
};

export default SummaryBox;