import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Signup = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/register", form);
      navigate("/");
    } catch (err: any) {
      setError("Email or Mobile already exists");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">

      <div className="bg-slate-900 p-8 rounded-xl w-96 shadow-lg">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {error && (
          <p className="text-red-400 mb-4 text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 mb-4 rounded bg-slate-800"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded bg-slate-800"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Mobile"
            className="w-full p-3 mb-4 rounded bg-slate-800"
            onChange={(e) =>
              setForm({ ...form, mobile: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-6 rounded bg-slate-800"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-semibold">
            Register
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          Already have account?{" "}
          <Link to="/" className="text-blue-400">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
