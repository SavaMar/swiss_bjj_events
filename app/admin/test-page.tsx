"use client";

export default function TestAdminPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Test Page</h1>
        <p className="text-gray-600">This is a test page to verify the admin route is working.</p>
        <div className="mt-4">
          <button 
            onClick={() => console.log("Test button clicked")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
}

