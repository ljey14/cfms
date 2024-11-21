import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchNotifications(currentPage);
    }, [currentPage]);

    const fetchNotifications = async (page) => {
        try {
            const response = await axios.get(`/notifications?page=${page}`);
            setNotifications(response.data.notifications);
            setTotalPages(response.data.total_pages);
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
                <h2 className="text-2xl font-semibold leading-tight text-gray-800">
                    Notifications
                </h2>
            }
        >
            <Head title="Notifications" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <div className="p-6">
                            {/* Notification Table */}
                            <table className="w-full table-auto border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-left border-b">
                                        <th className="px-4 py-3 text-center font-medium text-gray-600">
                                            Timestamp
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium text-gray-600">
                                            Notification
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium text-gray-600">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notifications.length > 0 ? (
                                        notifications.map((notification, index) => (
                                            <tr
                                                key={index}
                                                className={`border-b ${
                                                    notification.status === 'unread'
                                                        ? 'bg-yellow-50 font-semibold'
                                                        : ''
                                                }`}
                                            >
                                                <td className="px-4 py-3 text-center text-gray-500">
                                                    {notification.Timestamp}
                                                </td>
                                                <td className="px-4 py-3 text-center text-gray-500">
                                                    A new feedback has been submitted for the{' '}
                                                    <span className="font-medium">
                                                        {notification.Office}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {notification.status === 'unread' ? (
                                                        <button
                                                            onClick={() =>
                                                                markAsRead(
                                                                    notification.Timestamp,
                                                                    notification.Office
                                                                )
                                                            }
                                                            className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                                                        >
                                                            Mark as Read
                                                        </button>
                                                    ) : (
                                                        <span className="text-green-600 text-center]">Read</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="px-4 py-6 text-center text-gray-500"
                                            >
                                                No notifications found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="mt-6 flex justify-center items-center space-x-2">
                                <button
                                    onClick={() =>
                                        currentPage > 1 && setCurrentPage(currentPage - 1)
                                    }
                                    className={`px-4 py-2 text-sm font-medium rounded ${
                                        currentPage === 1
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <div className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <button
                                    onClick={() =>
                                        currentPage < totalPages && setCurrentPage(currentPage + 1)
                                    }
                                    className={`px-4 py-2 text-sm font-medium rounded ${
                                        currentPage === totalPages
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
