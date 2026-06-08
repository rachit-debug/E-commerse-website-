import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/auth";
import { AuthLayout } from "./AuthLayout";
import {
  authCardClass,
  dangerTextClass,
  inputClass,
  labelClass,
  linkClass,
  primaryButtonClass,
} from "./theme";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    localStorage.setItem("userEmail", form.email);

    try {
      await registerUser(form.name, form.email, form.password);
      navigate("/verify-otp");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <AuthLayout>
      <div className={authCardClass}>
        <p className="text-sm font-medium uppercase tracking-widest text-indigo-600">
          Join Shop.
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          A few details and you&apos;re ready to browse and buy.
        </p>

        <form onSubmit={submitHandler} className="mt-8 space-y-5">
          <div>
            <label htmlFor="register-name" className={labelClass}>
              Name
            </label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="register-email" className={labelClass}>
              Email
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="register-password" className={labelClass}>
              Password
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className={inputClass}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            {error ? <p className={dangerTextClass}>{error}</p> : null}
          </div>

          <button
            type="submit"
            className={`${primaryButtonClass} inline-flex items-center justify-center`}
          >
            Continue
          </button>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className={linkClass}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Register;
