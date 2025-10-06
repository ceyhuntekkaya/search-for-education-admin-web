'use client';



export default function CustomerPage() {



    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 Customer
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <h2 className="text-lg font-medium">Recent Activity</h2>
                    <div className="mt-4 space-y-4">
                        Offers
                    </div>
                </div>
            </div>


        </div>
    );
}