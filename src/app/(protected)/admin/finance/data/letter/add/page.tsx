'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import LetterOfGuaranteeForm from "@/components/finance/letter-of-guarantee-form";
import {useLetterOfGuarantees} from "@/hooks/finance/use-letter-of-guarantee";


const CreateLetterOfGuarantee = () => {
    const {createLetterOfGuarantee} = useLetterOfGuarantees();
    return (
        <div className="space-y-6">
            <PageHeader/>
            <LetterOfGuaranteeForm onSubmit={createLetterOfGuarantee} />
        </div>
    );
};

export default CreateLetterOfGuarantee;