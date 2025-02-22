'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import ErrorModal from "@/components/ErrorModal";
import API from "@/utils/api";
import Link from "next/link";

export default function Login() {
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [countries, setCountries] = useState([]);
    const [countryCode, setCountryCode] = useState('+51');  // Default to Peru
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            router.push("/dashboard");
        } else {
            setIsLoading(false); // Stop loading if no token is found
        }

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
                    if (a.code === "+51") return -1; // Peru first
                    if (b.code === "+51") return 1;
                    return a.name.localeCompare(b.name);
                });

                setCountries(sortedCountries);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        fetchCountries();
    }, [router]);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const data = {
                phoneNumber: countryCode + formData.get("phoneNumber"),  // Concatenate country code with phone number
                password: formData.get("password"),
            };

            const response = await API.post("/auth/login", data);
            console.log(response.data)
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.userId);
                router.push(`/dashboard?userId=${response.data.userId}`);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error desconocido al iniciar sesión";
            setValidationErrors([errorMessage]);
            setShowErrorModal(true);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido</h2>
                    <p className="text-gray-600">Inicia sesión para continuar</p>
                </div>
                <form className="mt-6 space-y-6" onSubmit={onSubmit}>
                    <div className="space-y-4">
                        {/* Código de país y número de teléfono */}
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700">Código de País</label>
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
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Número de Teléfono</label>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="text"
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="987654321"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold w-full">
                            Iniciar sesión
                        </Button>
                        <Link href="/register">
                            <Button type="button" variant="outline" className="border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-4 rounded-lg font-semibold w-full">
                                Registrarse
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
            <ErrorModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} errors={validationErrors} />
        </div>
    );
}
