import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios'; // Make sure Axios is installed

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ratings');
    const [officeData, setOfficeData] = useState(null);

    // Fetch general data for all offices
    const fetchAllOfficesData = () => {
        setLoading(true);
        axios.get('/data')
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    // Fetch data for a specific office
    const fetchOfficeData = (office) => {
        setLoading(true);
        axios.get(`/data/${office === 'sas' ? 'sas' : office}`) // Adjust endpoint for SAS office
            .then(response => {
                setOfficeData(response.data); // Set fetched office data
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching office data:', error);
                setLoading(false);
            });
    };

    // Chart data for all offices
    const chartData = {
        labels: data.map(item => item.Office),
        datasets: [
            {
                label: 'Feedback Count',
                data: data.map(item => item.feedback_count),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    useEffect(() => {
        fetchAllOfficesData(); // Load all office data on component mount
    }, []);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-end space-x-4">
                        <button
                            className={`px-4 py-2 ${activeTab === 'ratings' ? 'bg-green-800 text-white' : 'bg-gray-200'} rounded`}
                            onClick={() => {
                                setActiveTab('ratings');
                                fetchAllOfficesData();
                            }}
                        >
                            All Offices
                        </button>

                        <button
                            className={`px-4 py-2 ${activeTab === 'sas' ? 'bg-green-800 text-white' : 'bg-gray-200'} rounded`}
                            onClick={() => {
                                setActiveTab('sas');
                                fetchOfficeData('sas'); // Fetch data for SAS office
                            }}
                        >
                            SAS Office
                        </button>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {activeTab === 'ratings' && (
                                <div>
                                    {loading ? (
                                        <p>Loading...</p>
                                    ) : (
                                        <div>
                                            <h3 className="text-xl font-semibold">Office Feedback</h3>
                                            <Bar data={chartData} />
                                            {!loading && data.length === 0 && <p>No data available.</p>}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'sas' && (
                                <div>
                                    {loading ? (
                                        <p>Loading...</p>
                                    ) : officeData ? (
                                        <div>
                                            <h3 className="text-xl font-semibold">SAS Office Feedback</h3>
                                            <p>Feedback Count: {officeData[0]?.feedback_count || 0}</p>
                                        </div>
                                    ) : (
                                        <p>No data available for SAS.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
