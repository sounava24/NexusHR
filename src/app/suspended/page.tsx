import { AlertTriangle } from 'lucide-react';

export default function SuspendedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-4 font-sans">
      <AlertTriangle size={64} className="text-red-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4 text-center">Service Temporarily Unavailable</h1>
      <p className="text-gray-500 max-w-md text-center">
        This website has been temporarily suspended due to a configuration or billing issue. 
        If you are the owner, please contact your administrator to restore access.
      </p>
    </div>
  );
}
