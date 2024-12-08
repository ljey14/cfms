import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';  // Import Axios for API calls

const EditableList = ({ title, items, onAdd, onEdit, onDelete }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const dropdownRef = useRef(null);

    

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAdd = () => {
        if (inputValue.trim()) {
            onAdd(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className="mb-6">
            <label className="text-lg font-medium text-gray-700 mb-2 block">{title}</label>
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Enter ${title.toLowerCase()}`}
                    className="form-control flex-grow p-4 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 h-full"
                    >
                        View {title}
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-1">
                                {items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center px-4 py-2"
                                    >
                                        <span className="text-gray-700 text-sm">{item}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEdit(index)}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(index)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-4 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 h-full"
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default function FeedbackForm() {
    const [clientTypeItems, setClientTypeItems] = useState([]);
    const [officeItems, setOfficeItems] = useState([]);
    const [questionnaireItems, setQuestionnaireItems] = useState([]);

    // Fetch data from the backend
    const fetchData = async () => {
        try {
            const response = await axios.get('/api/fetch-data');  // Using axios to fetch data
            if (response.status === 200) {
                const data = response.data;

                // Update state
                setClientTypeItems(data.client_types || []);
                setOfficeItems(data.offices || []);
                setQuestionnaireItems(data.questionnaires || []);
                
                // Store the data in the database
                storeData(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Store data in the database
    const storeData = async (data) => {
        try {
            const response = await axios.post('/api/store-data', {
                client_types: data.client_types || [],
                offices: data.offices || [],
                questionnaires: data.questionnaires || [],
            });
            if (response.status === 200) {
                console.log('Data successfully stored in the database');
            }
        } catch (error) {
            console.error('Error storing data:', error);
        }
    };

    const addItem = async (list, setList, newItem, listType) => {
        try {
            // Send the new item to the server
            const response = await axios.post(`/api/store-${listType}`, { name: newItem });
    
            if (response.status === 200) {
                // Update frontend state only after a successful response
                setList((prev) => [...prev, response.data]);
                console.log(`${listType} successfully added to the database`);
            } else {
                console.error(`Error adding ${listType}`);
            }
        } catch (error) {
            console.error(`Error adding ${listType}:`, error);
        }
    };
    
    const editItem = async (list, setList, id, newValue, listType) => {
        try {
            const updatedList = list.map((item) =>
                item.id === id ? { ...item, name: newValue } : item
            );
            setList(updatedList); // Update the frontend state
    
            // Send the updated item to the server
            const response = await axios.put(`/api/update-${listType}/${id}`, { name: newValue });
    
            if (response.status === 200) {
                console.log(`${listType} successfully updated in the database`);
            } else {
                console.error(`Error updating ${listType}`);
            }
        } catch (error) {
            console.error(`Error updating ${listType}:`, error);
        }
    };
    
    
    const deleteItem = async (list, setList, id, listType) => {
        try {
            const updatedList = list.filter((item) => item.id !== id); // Remove the item from state
            setList(updatedList);
    
            // Send the request to delete the item from the backend
            const response = await axios.delete(`/api/delete-${listType}/${id}`);
    
            if (response.status === 200) {
                console.log(`${listType} successfully deleted from the database`);
            } else {
                console.error(`Error deleting ${listType}`);
            }
        } catch (error) {
            console.error(`Error deleting ${listType}:`, error);
        }
    };
    
    

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Modify Feedback Form Elements
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            Manage Feedback Form Elements
                        </h2>
                        <EditableList
                            title="Client Types"
                            items={clientTypeItems}
                            onAdd={(item) => addItem(clientTypeItems, setClientTypeItems, item, 'client-type')}
                            onEdit={(id) => {
                                const newValue = prompt('Edit Client Type', clientTypeItems.find(item => item.id === id)?.name);
                                if (newValue) editItem(clientTypeItems, setClientTypeItems, id, newValue, 'client-type');
                            }}
                            onDelete={(id) => deleteItem(clientTypeItems, setClientTypeItems, id, 'client-type')}
                        />

                        <EditableList
                            title="Offices"
                            items={officeItems}
                            onAdd={(item) => addItem(officeItems, setOfficeItems, item)}
                            onEdit={(index) => {
                                const newValue = prompt('Edit Office', officeItems[index]);
                                if (newValue) editItem(officeItems, setOfficeItems, index, newValue);
                            }}
                            onDelete={(index) => deleteItem(officeItems, setOfficeItems, index)}
                        />
                        <EditableList
                            title="Questionnaires"
                            items={questionnaireItems}
                            onAdd={(item) => addItem(questionnaireItems, setQuestionnaireItems, item)}
                            onEdit={(index) => {
                                const newValue = prompt(
                                    'Edit Questionnaire',
                                    questionnaireItems[index]
                                );
                                if (newValue) editItem(questionnaireItems, setQuestionnaireItems, index, newValue);
                            }}
                            onDelete={(index) => deleteItem(questionnaireItems, setQuestionnaireItems, index)}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
