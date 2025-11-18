import { useState } from "react";
import { register } from "../services/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, name);
      window.location.href = "/login";
    } catch {
      setError("Nie udało się utworzyć konta — email może być zajęty.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-6 text-center">Rejestracja</h1>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}

        <label className="block mb-4">
          <span>Nazwa firmy</span>
          <input className="w-full border p-2 mt-1 rounded" value={name}
                 onChange={(e) => setName(e.target.value)} />
        </label>

        <label className="block mb-4">
          <span>Email</span>
          <input type="email" className="w-full border p-2 mt-1 rounded" value={email}
                 onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label className="block mb-6">
          <span>Hasło</span>
          <input type="password" className="w-full border p-2 mt-1 rounded" value={password}
                 onChange={(e) => setPassword(e.target.value)} />
        </label>

        <button className="w-full bg-[#830e21] text-white py-2 rounded hover:bg-red-900">
          Zarejestruj
        </button>

        <p className="mt-4 text-center">
          Masz już konto? <a href="/login" className="text-[#830e21]">Zaloguj się</a>
        </p>
      </form>
    </div>
  );
}
