'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import LetterOfGuaranteeForm from "@/components/finance/letter-of-guarantee-form";
import {useLetterOfGuarantees} from "@/hooks/finance/use-letter-of-guarantee";
import {useParams} from "next/navigation";

const EditLetterOfGuarantee = () => {
    const {updateLetterOfGuarantee, fetchLetterOfGuaranteeById, selectedLetterOfGuarantee} = useLetterOfGuarantees();
    const params = useParams();
    const id = params.id as string;
    if (!id) {
        throw new Error("Credit ID is required");
    }

    useEffect(() => {
        fetchLetterOfGuaranteeById(id);
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader/>
            <LetterOfGuaranteeForm onSubmit={updateLetterOfGuarantee} selectedLetterOfGuarantee={selectedLetterOfGuarantee} />
        </div>
    );
};

export default EditLetterOfGuarantee;