import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    useEffect(() => {
        fetchNotifications(currentPage);
    }, [currentPage]);

    const fetchNotifications = async (page) => {
        try {
            const response = await axios.get(`/notifications?page=${page}`);
            setNotifications(response.data.notifications);
            setTotalPage(response.data.total_page);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (timestamp, office) => {
        try {
            await axios.post('/notifications/mark-read', { timestamp, office });
            fetchNotifications(currentPage);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Notification
                </h2>
            }
        >
            <Head title="Notification" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left">Timestamp</th>
                                        <th className="text-left">Notification</th>
                                        <th className="text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notifications.map((notification, index) => (
                                        <tr
                                            key={index}
                                            className={
                                                notification.status === 'unread' ? 'font-bold' : ''
                                            }
                                        >
                                            <td>{notification.Timestamp}</td>
                                            <td>
                                                A new feedback has been submitted for the{' '}
                                                {notification.Office}
                                            </td>
                                            <td>
                                                {notification.status === 'unread' ? (
                                                    <button
                                                        onClick={() =>
                                                            markAsRead(
                                                                notification.Timestamp,
                                                                notification.Office
                                                            )
                                                        }
                                                        className="btn btn-primary"
                                                    >
                                                        Mark as Read
                                                    </button>
                                                ) : (
                                                    <span>Read</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination flex justify-center mt-4">
                                {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        className={`btn ${
                                            page === currentPage ? 'btn-primary' : 'btn-secondary'
                                        }`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
