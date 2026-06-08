import { memo, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { resendOtp, verifyOtp } from '../../api/auth';
import { getToken, parseJwtPayload } from '../../utils/auth';
import { AuthLayout } from './AuthLayout';
import {
  authCardClass,
  dangerTextClass,
  linkClass,
  otpDigitClass,
  primaryButtonClass,
  spinnerClass,
} from './theme';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendBusy, setResendBusy] = useState(false);

  const email = localStorage.getItem('userEmail');

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (element, index) => {
    if (Number.isNaN(Number(element.value)) && element.value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        if (e.target.previousSibling) {
          e.target.previousSibling.focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const otpValue = otp.join('');
      const emailStored = localStorage.getItem('userEmail');
      const data = await verifyOtp(emailStored, otpValue);
      localStorage.setItem('token', JSON.stringify(data.token));
      const payload = parseJwtPayload(getToken());
      const from = location.state?.from;
      const fallback =
        payload?.role === 'admin' ? '/admin/orders' : '/';
      navigate(from || fallback);
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResendBusy(true);
    try {
      await resendOtp(email);
    } catch (err) {
      setError(err.message || 'Could not resend code');
    } finally {
      setResendBusy(false);
    }
  };

  return (
    <AuthLayout>
      <div className={authCardClass}>
        <p className="text-sm font-medium uppercase tracking-widest text-indigo-600">
          Verify your email
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Enter the code we sent you
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {email ? (
            <>
              We emailed a 6-digit code to{' '}
              <span className="font-medium text-slate-800">{email}</span>
            </>
          ) : (
            'Check your email for the verification code.'
          )}
        </p>

        <form onSubmit={handleVerify} className="mt-8 space-y-6">
          <div>
            <span className="mb-3 block text-sm font-medium text-slate-700">
              One-time code
            </span>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-between sm:gap-0">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={otpDigitClass}
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>
            {error ? <p className={dangerTextClass}>{error}</p> : null}
          </div>

          <button
            type="submit"
            className={`${primaryButtonClass} inline-flex items-center justify-center`}
            disabled={loading}
          >
            {loading ? (
              <span className={spinnerClass} aria-hidden />
            ) : (
              'Verify and continue'
            )}
          </button>

          <p className="text-center text-sm text-slate-600">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendBusy || !email}
              className={`${linkClass} disabled:opacity-50`}
            >
              {resendBusy ? 'Sending…' : 'Resend'}
            </button>
          </p>

          <p className="text-center text-sm text-slate-600">
            Wrong email?{' '}
            <Link to="/register" className={linkClass}>
              Start over
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default memo(VerifyOtp);
