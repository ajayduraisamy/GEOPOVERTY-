import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Login = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    login: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/login", form);

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");

    } catch (err: any) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">

      <div className="bg-slate-900 p-8 rounded-xl w-96 shadow-lg">

        <h2 className="text-2xl font-bold mb-6 text-center">
          GEOPOVERTY Login
        </h2>

        {error && (
          <p className="text-red-400 mb-4 text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Email or Mobile"
            className="w-full p-3 mb-4 rounded bg-slate-800"
            onChange={(e) =>
              setForm({ ...form, login: e.target.value })
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

          <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold">
            Login
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          No account?{" "}
          <Link to="/signup" className="text-blue-400">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
