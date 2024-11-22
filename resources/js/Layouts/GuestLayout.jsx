import { Link } from '@inertiajs/react';
export default function GuestLayout({ children }) {
    return (
        <div
            className="relative flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0"
            style={{
                backgroundImage: "url('/minsu.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
          
            <div className="absolute top-0 left-0 w-full h-full wind-effect"></div>

            <div className="flex w-full justify-center items-center px-6 sm:px-0 gap-6">
                <div className="flex flex-col w-full max-w-md overflow-hidden bg-white px-20 py-20 shadow-md sm:rounded-lg">
                    <h1 className="mb-4 text-xl font-bold text-gray-600 text-center">
                        For Feedback, please click the button below
                    </h1>
                    <div className="flex justify-center">
                        <button
                            type="button"
                            className="rounded-md bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={() => window.location.href = '/feedback'}

                        >
                            Feedback
                        </button>
                    </div>
                </div>

                <div className="flex flex-col w-full max-w-md overflow-hidden bg-white px-7 py-4 shadow-md sm:rounded-lg">
                    {children}
                </div>
            </div>
        </div>
    );
}
