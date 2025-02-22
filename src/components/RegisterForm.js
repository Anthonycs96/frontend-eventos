'use client';
import API from "@/utils/api";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+51'); // Default to Peru (+51)
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [countries, setCountries] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryList = data
          .map((country) => ({
            name: country.name.common,
            code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ""),
          }))
          .filter((country) => country.code);

        const sortedCountries = countryList.sort((a, b) => {
          if (a.code === "+51") return -1;
          if (b.code === "+51") return 1;
          return a.name.localeCompare(b.name);
        });

        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await API.post('/auth/register', { name, phoneNumber: countryCode + phoneNumber, password });

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setError(response.data.message || 'Error al registrar el usuario');
      }
    } catch (err) {
      setError(err.message || 'Error de red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 bg-gray-50 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Registro</h2>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4 text-center">¡Registro exitoso! Redirigiendo...</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2">Nombre</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre completo"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Código de país y teléfono */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label htmlFor="countryCode" className="text-sm font-medium text-gray-700 mb-2">Código de país</label>
            <select
              id="countryCode"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {countries.map((country) => (
                <option key={`${country.code}-${country.name}`} value={country.code}>
                  {country.code} - {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 mb-2">Número de Teléfono</label>
            <input
              id="phoneNumber"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Número de teléfono"
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Contraseña */}
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="************"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Botón de envío */}
        <div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>
      </form>
    </div>
  );
}
