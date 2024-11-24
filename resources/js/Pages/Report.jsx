import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, InputGroup, FormControl } from 'react-bootstrap';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [office, setOffice] = useState('');
    const [month, setMonth] = useState('');
    const [strengths, setStrengths] = useState([]);
    const [weaknesses, setWeaknesses] = useState([]);
    const [loadingEmail, setLoadingEmail] = useState(false);

    useEffect(() => {
        fetchClients();
    }, [page, search, month]);

    const fetchClients = async () => {
        try {
            const response = await axios.get('/clients', {
                params: { search, page, month },
            });
            setClients(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleStrengthWeaknessChange = (type, message) => {
        if (type === 'strength') {
            setStrengths((prev) =>
                prev.includes(message) ? prev.filter((msg) => msg !== message) : [...prev, message]
            );
            setWeaknesses((prev) => prev.filter((msg) => msg !== message));
        } else {
            setWeaknesses((prev) =>
                prev.includes(message) ? prev.filter((msg) => msg !== message) : [...prev, message]
            );
            setStrengths((prev) => prev.filter((msg) => msg !== message));
        }
    };

    const handleSendEmail = async () => {
        if (!office || !month) {
            alert('Please enter both office and month.');
            return;
        }

        // Check if the office exists in the filtered client list
        const officeExists = clients.some((client) => client.Office.toLowerCase() === office.toLowerCase());

        if (!officeExists) {
            alert('The specified office does not match the search results. Please adjust your input.');
            return;
        }

        setLoadingEmail(true);

        const totalStrengths = strengths.length;
        const totalWeaknesses = weaknesses.length;

        const subject = `Feedback Summary for ${office} (${month})`;
        const body = encodeURIComponent(`
            Hello,
            Here is the feedback summary for ${office} for the month of ${month}:

            Total Strength/s: ${totalStrengths}
            Total Weakness/es: ${totalWeaknesses}

            Strength/s:
            ${totalStrengths > 0 ? strengths.map((s) => `- ${s}`).join('\n') : 'None'}

            Weakness/es:
            ${totalWeaknesses > 0 ? weaknesses.map((w) => `- ${w}`).join('\n') : 'None'}

            Recommendations:
            ${
                totalWeaknesses > 0
                    ? `- Improve communication in key areas.\n- Focus on resolving customer concerns promptly.`
                    : 'Keep up the excellent work!'
            }

            Best regards,
        `);

        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
        window.location.href = mailtoLink;

        setTimeout(() => setLoadingEmail(false), 2000); // Simulate email sending
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-3xl font-bold leading-tight text-gray-800">
                    Feedback Report Distribution
                </h2>
            }
        >
            <Head title="Feedback Report" />
            <div className="py-8">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg">
                        <div className="p-6">
                            <p className="text-gray-600 mb-6 text-lg">
                                Use this tool to search for offices, classify feedback messages as
                                strengths or weaknesses, and generate a summary email.
                            </p>
                            <ul className="list-disc pl-5 mb-6 text-gray-700 text-base">
                                <li>
                                    Use the search bar to find offices and feedback messages.
                                </li>
                                <li>
                                    Mark feedback messages as strengths or weaknesses using the
                                    checkboxes.
                                </li>
                                <li>
                                    Specify the office and month for the report, then click "Send
                                    Feedback Summary."
                                </li>
                            </ul>
                            {/* Search Bar */}
                            <InputGroup className="mb-4">
                                <FormControl
                                    placeholder="Search for office and feedback message..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </InputGroup>

                            {/* Client List Table */}
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th>Office</th>
                                        <th>Feedback Message</th>
                                        <th>Strength</th>
                                        <th>Weakness</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.length > 0 ? (
                                        clients.map((client) => (
                                            <tr key={client.Client_Id}>
                                                <td>{client.Office}</td>
                                                <td>{client.Feedback_message}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={strengths.includes(client.Feedback_message)}
                                                        onChange={() =>
                                                            handleStrengthWeaknessChange(
                                                                'strength',
                                                                client.Feedback_message
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={weaknesses.includes(client.Feedback_message)}
                                                        onChange={() =>
                                                            handleStrengthWeaknessChange(
                                                                'weakness',
                                                                client.Feedback_message
                                                            )
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center text-gray-600">
                                                No clients found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>

                            {/* Pagination Controls */}
                            <div className="flex justify-center items-center mt-6">
                                <button
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                                        page === 1
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                    disabled={page === 1}
                                >
                                    Previous
                                </button>
                                <span className="mx-4 text-sm text-gray-700">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                                        page === totalPages || totalPages === 0
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                    disabled={page === totalPages || totalPages === 0}
                                >
                                    Next
                                </button>
                            </div>

                            {/* Feedback Email Section */}
                            <div className="mt-8 p-6 bg-gray-50 rounded-md shadow-md">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Email Feedback Summary
                                </h3>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <input
                                        type="text"
                                        className="form-control rounded-md border-gray-300 shadow-sm"
                                        placeholder="Office Name"
                                        value={office}
                                        onChange={(e) => setOffice(e.target.value)}
                                    />
                                    <input
                                        type="month"
                                        className="form-control rounded-md border-gray-300 shadow-sm"
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleSendEmail}
                                    className={`mt-4 px-6 py-2 rounded-lg font-medium text-white ${
                                        loadingEmail
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                    disabled={loadingEmail}
                                >
                                    {loadingEmail ? 'Sending email...' : 'Send Feedback Summary'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ClientList;
