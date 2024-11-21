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
    const [officeData, setOfficeData] = useState(null); // State to hold data for selected office

    useEffect(() => {
        fetchAllOfficesData(); // Fetch all offices data on initial load
    }, []);

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

    const fetchOfficeData = (office) => {
        setLoading(true);
        axios.get(`/data/${office}`) // Adjust the endpoint as necessary
            .then(response => {
                setOfficeData(response.data); // Set the data for the selected office
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching office data:', error);
                setLoading(false);
            });
    };

    // Prepare the chart data for all offices
    const chartData = {
        labels: data.map(item => item.office),
        datasets: [
            {
                label: 'Average Rating',
                data: data.map(item => item.averageRating),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
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
                    <div className="mb-4 flex justify-end space-x-4">
                        <button 
                            className={`px-4 py-2 ${activeTab === 'ratings' ? 'bg-green-800 text-white' : 'bg-gray-200'} rounded`} 
                            onClick={() => {
                                setActiveTab('ratings');
                                fetchAllOfficesData(); // Fetch all offices data
                            }}
                        >
                            All Offices
                        </button>

                        <button 
                            className={`px-4 py-2 ${activeTab === 'Office 1' ? 'bg-green-800 text-white' : 'bg-gray-200'} rounded`} 
                            onClick={() => {
                                setActiveTab('Office 1');
                                fetchOfficeData('SAS'); // Fetch data for Office 1
                            }}
                        >
                            Office 1
                        </button>
                        <button 
                            className={`px-4 py-2 ${activeTab === 'Office 2' ? 'bg-green-800 text-white' : 'bg-gray-200'} rounded`} 
                            onClick={() => {
                                setActiveTab('Office 2');
                                fetchOfficeData('Office 2'); // Fetch data for Office 2
                            }}
                        >
                            Office 2
                        </button>
                        <button 
                            className={`px-4 py-2 ${activeTab === 'Office 3' ? 'bg-green-800 text-white' : 'bg-gray-200'} rounded`} 
                            onClick={() => {
                                setActiveTab('Office 3');
                                fetchOfficeData('Office 3'); // Fetch data for Office 3
                            }}
                        >
                            Office 3
                        </button>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div class ="p-6 text-gray-900">

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
                                        <Bar data={chartData} />
                                    </div>

                                    {!loading && data.length === 0 && <p>No data available.</p>}
                                </div>
                            )}

                            {activeTab !== 'ratings' && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-semibold">{activeTab} Feedback</h3>
                                    {loading ? (
                                        <p>Loading...</p>
                                    ) : officeData ? (
                                        <div>
                                            <p>Average Rating: {officeData.averageRating}</p>
                                            <p>Feedback: {officeData.feedback}</p>
                                        </div>
                                    ) : (
                                        <p>No data available for {activeTab}.</p>
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