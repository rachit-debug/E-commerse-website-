import { useState } from "react";
import { loginUser, resendOtp } from "../../api/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getToken, parseJwtPayload } from "../../utils/auth";
import { AuthLayout } from "./AuthLayout";
import {
  authCardClass,
  dangerTextClass,
  inputClass,
  labelClass,
  linkClass,
  primaryButtonClass,
  spinnerClass,
} from "./theme";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    localStorage.setItem("userEmail", email);

    try {
      const result = await loginUser(email, password);
      localStorage.setItem("token", JSON.stringify(result.token));

      if (!result.isVerified) {
        await resendOtp(email);
        navigate("/verify-otp", { state: { from: location.state?.from } });
        return;
      }

      const payload = parseJwtPayload(getToken());
      const from = location.state?.from;
      const fallback =
        payload?.role === "admin" ? "/admin/orders" : "/";
      navigate(from || fallback);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={authCardClass}>
        <p className="text-sm font-medium uppercase tracking-widest text-indigo-600">
          Welcome back
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Sign in to Shop.
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your email and password to continue.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label htmlFor="login-email" className={labelClass}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="login-password" className={labelClass}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error ? <p className={dangerTextClass}>{error}</p> : null}
          </div>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className={`${linkClass} text-sm`}
          >
            Forgot password?
          </button>

          <button
            type="submit"
            className={`${primaryButtonClass} inline-flex items-center justify-center`}
            disabled={loading}
          >
            {loading ? (
              <span className={spinnerClass} aria-hidden />
            ) : (
              "Sign in"
            )}
          </button>

          <p className="text-center text-sm text-slate-600">
            New here?{" "}
            <Link to="/register" className={linkClass}>
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
