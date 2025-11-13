import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setResetEmail } from "../redux/authSlice";
function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be 6+ characters", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      setError("Password must be 6+ characters");
      return;
    }

    setLoading(true);

    try {
      toast.info("Creating your account...", {
        position: "top-right",
        autoClose: 2000,
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}api/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        dispatch(setResetEmail(formData.email));

        toast.success("Account created! Redirecting to login...", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        setMessage("Account created! Redirecting to login...");
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.message || "Signup failed", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Network error. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="login-page min-h-screen flex items-center justify-center p-6 overflow-y-auto"
        style={{
          background:
            "url('https://images.unsplash.com/photo-1623479322729-28b25c16b011?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=1280')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Wrapper */}
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center">
          {/* LEFT TEXT SECTION */}
          <div className="left-section lg:w-1/2 w-full lg:pr-12 mb-10 lg:mb-0 text-center lg:text-left">
            <h1 className="font-medium text-5xl text-white heading-text">
              Join us today and start your journey!
            </h1>
            <p className="leading-relaxed mt-4 text-white sub-text">
              Create your account to explore our services and connect with
              amazing features we've built for you.
            </p>
          </div>

          {/* RIGHT FORM SECTION */}
          <div className="lg:w-1/2 w-full">
            <div className="relative py-3 sm:max-w-xl w-96 mx-auto form-container">
              <div className="absolute inset-0 bg-linear-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
              <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-10 md:p-16">
                <div className="max-w-md mx-auto">
                  <h1 className="text-2xl font-semibold text-center mb-6">
                    Sign Up
                  </h1>

                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                      {error}
                    </div>
                  )}

                  {message && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center">
                      {message}
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="divide-y divide-gray-200"
                  >
                    <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                      <div className="relative">
                        <input
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500"
                          placeholder="Full Name"
                          required
                          disabled={loading}
                        />
                        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                          Full Name *
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500"
                          placeholder="Email Address"
                          required
                          disabled={loading}
                        />
                        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                          Email Address *
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500"
                          placeholder="Password"
                          required
                          disabled={loading}
                        />
                        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                          Password *
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500"
                          placeholder="Confirm Password"
                          required
                          disabled={loading}
                        />
                        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                          Confirm Password *
                        </label>
                      </div>

                      <div className="flex justify-center pt-6">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`bg-cyan-500 hover:bg-cyan-600 text-white rounded-md px-6 py-2 font-medium transition ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {loading ? "Creating..." : "Sign Up"}
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-cyan-500 hover:underline font-medium"
                      >
                        Login
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
