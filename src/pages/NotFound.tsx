import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-black text-gray-100 mb-4">404</p>
        <h2 className="text-2xl font-black text-navy mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          to="/"
          className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-full font-bold transition-colors no-underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
