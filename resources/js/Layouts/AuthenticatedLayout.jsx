import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar Navigation */}
            <nav className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="flex items-center justify-center h-16">
                    <Link href="/">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                    </Link>
                </div>
                <div className="flex-grow flex flex-col justify-between p-4">
                    <div className="flex flex-col space-y-4">
                        <NavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            className={`${
                                route().current('dashboard') ? 'text-green-800' : 'text-gray-400'
                            } hover:text-green-800 px-4 py-2 rounded`}
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            href={route('notification')}
                            active={route().current('notification')}
                            className={`${
                                route().current('notification') ? 'text-green-800' : 'text-gray-400'
                            } hover:text-green-800 px-4 py-2 rounded`}
                        >
                            Notification
                        </NavLink>
                        <NavLink
                            href={route('database')}
                            active={route().current('database')}
                            className={`${
                                route().current('database') ? 'text-green-800' : 'text-gray-400'
                            } hover:text-green-800 px-4 py-2 rounded`}
                        >
                            Database
                        </NavLink>
                        <NavLink
                            href={route('feedbackForm')}
                            active={route().current('feedbackForm')}
                            className={`${
                                route().current('feedbackForm') ? 'text-green-800' : 'text-gray-400'
                            } hover:text-green-800 px-4 py-2 rounded`}
                        >
                            Feedback Form
                        </NavLink>
                        <NavLink
                            href={route('report')}
                            active={route().current('report')}
                            className={`${
                                route().current('report') ? 'text-green-800' : 'text-gray-400'
                            } hover:text-green-800 px-4 py-2 rounded`}
                        >
                            Report
                        </NavLink>
                    </div>
                    <div className="mt-auto p-4">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                    >
                                        {user.name}
                                        <svg
                                            className="-me-0.5 ms-2 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route("profile.edit")}>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link href={route("logout")} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </nav>

            <div className="flex-1">
                {header && (
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}