import { useState } from "react";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      window.dispatchEvent(new Event("authChange"));
      navigate("/reservations", { replace: true });
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Błędny email lub hasło");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Logowanie</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
        )}

        <label className="block mb-4">
          <span>Email</span>
          <input
            className="w-full border p-2 mt-1 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block mb-6">
          <span>Hasło</span>
          <input
            type="password"
            className="w-full border p-2 mt-1 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className="w-full bg-[#830e21] text-white py-2 rounded hover:bg-red-900">
          Zaloguj
        </button>

        <p className="mt-4 text-center">
          Nie masz konta?{" "}
          <a href="/register" className="text-[#830e21]">
            Zarejestruj się
          </a>
        </p>
      </form>
    </div>
  );
}
