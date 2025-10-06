'use client';

import { FileText, Users, ShoppingCart, Terminal, ClipboardList } from 'lucide-react';
import DropdownButton from "@/components/ui/dropdown-button";
import {DropdownItem} from "@/types/dropdown";


export default function ReportsPage() {


        const dropdownItems:DropdownItem[] = [
            {
                icon: <FileText className="text-gray-400" />,
                label: 'Products',
                href: '/products'
            },
            {
                icon: <Users className="text-gray-400" />,
                label: 'Customers',
                href: '/customers'
            },
            {
                icon: <ShoppingCart className="text-gray-400" />,
                label: 'Orders',
                onClick: () => console.log('Orders clicked')
            },
            {
                icon: <Terminal className="text-gray-400" />,
                label: 'Console',
                href: '/console',
                variant: 'warning'
            },
            {
                type: 'divider',
                label: ''
            },
            {
                icon: <ClipboardList className="text-gray-800" />,
                label: 'All Reports',
                href: '/reports'
            }
        ];


    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <DropdownButton
                    label="Reports"
                    icon={<FileText />}
                    items={dropdownItems}
                    variant="primary"
                    size="md"
                />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <h2 className="text-lg font-medium">Recent Activity</h2>
                    <div className="mt-4 space-y-4">
                        Reports
                    </div>
                </div>
            </div>


        </div>
    );
}