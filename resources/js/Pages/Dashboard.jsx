import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ratings');

    useEffect(() => {
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
    }, []);

    // Prepare the chart data
    const chartData = {
        labels: data.map(item => item.office),  // Labels for X-axis
        datasets: [
            {
                label: 'Average Rating',
                data: data.map(item => item.averageRating), // Y-axis data
                backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Bar color
                borderColor: 'rgba(75, 192, 192, 1)',        // Border color
                borderWidth: 1,
            },
        ],
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
    
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            <div className="mb-4">
                                <button 
                                    className={`px-4 py-2 ${activeTab === 'ratings' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`} 
                                    onClick={() => setActiveTab('ratings')}
                                >
                                    Office Ratings
                                </button>

                                <button 
                                    className={`px-4 py-2 ${activeTab === 'feedback' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`} 
                                    onClick={() => setActiveTab('feedback')}
                                >
                                    Feedback
                                </button>
                            </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
    
                           
                            {activeTab === 'ratings' && (
                                <div>
                                    {loading ? (
                                        <p>Loading...</p>
                                    ) : (
                                        <ul>
                                            {data.map((item, index) => (
                                                <li key={index}>
                                                    {item.id} - {item.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
    
                                    <h3 className="mt-8 text-xl font-semibold">Office Ratings</h3>
                                    <div>
                                        {/* Render Bar chart here */}
                                        <Bar data={chartData} />
                                    </div>
    
                                    {/* Display data list as a fallback */}
                                    {!loading && data.length === 0 && <p>No data available.</p>}
                                </div>
                            )}
    
                            {activeTab === 'feedback' && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-semibold">Feedback</h3>
                                    <div className="flex space-x-4 mt-4">
                                        <div className="w-1/3 p-4 border-2 border-gray-300 rounded-lg">
                                            <h4 className="font-semibold text-lg">Positive Feedback</h4>
                                            <p>No data yet</p> {/* Replace with actual data if available */}
                                        </div>
                                        <div className="w-1/3 p-4 border-2 border-gray-300 rounded-lg">
                                            <h4 className="font-semibold text-lg">Negative Feedback</h4>
                                            <p>No data yet</p> {/* Replace with actual data if available */}
                                        </div>
                                        <div className="w-1/3 p-4 border-2 border-gray-300 rounded-lg">
                                            <h4 className="font-semibold text-lg">Overall Feedback</h4>
                                            <p>No data yet</p> {/* Replace with actual data if available */}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
