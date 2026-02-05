import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle, BookOpen } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

// Try to import Clerk
let useUser;
try {
  const clerk = await import('@clerk/clerk-react');
  useUser = clerk.useUser;
} catch {
  // Clerk not configured
}

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  const user = useUser?.()?.user;
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setStatus('error');
        setMessage('Invalid session');
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}/api/booking/confirm?session_id=${sessionId}&userId=${user?.id || 'guest'}`
        );
        const data = await res.json();

        if (data.success) {
          setStatus('success');
          setMessage('Your enrollment has been confirmed!');
        } else {
          setStatus('error');
          setMessage(data.message || 'Failed to confirm payment');
        }
      } catch (err) {
        console.error('Confirm error:', err);
        setStatus('error');
        setMessage('Failed to verify payment');
      }
    };

    confirmPayment();
  }, [sessionId, user?.id]);

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="section-container">
        <div className="max-w-md mx-auto text-center">
          {status === 'loading' && (
            <div className="card p-8">
              <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Confirming your payment...</h2>
              <p className="text-slate-400">Please wait while we verify your enrollment</p>
            </div>
          )}

          {status === 'success' && (
            <div className="card p-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Enrollment Successful!</h2>
              <p className="text-slate-400 mb-8">{message}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/my-courses" className="btn-primary flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Go to My Courses
                </Link>
                <Link to="/courses" className="btn-secondary">
                  Browse More Courses
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="card p-8">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
              <p className="text-slate-400 mb-8">{message}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/courses" className="btn-primary">
                  Browse Courses
                </Link>
                <Link to="/" className="btn-secondary">
                  Go Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
