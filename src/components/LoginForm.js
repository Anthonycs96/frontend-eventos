'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ErrorModal from "@/components/ErrorModal";
import Label from "@/components/ui/label";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
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
        <div className="bg-transparent min-h-screen flex flex-col items-center justify-center bg-[var(--background)] dark:bg-[var(--background-secondary)] p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-[420px] space-y-6">
                {/* Logo o Imagen */}

                <div className="bg-[var(--background)] dark:bg-[var(--background-secondary)] p-6 sm:p-8 rounded-2xl shadow-lg ">
                    <div className="text-center mb-6 sm:mb-8">
                        <Heading
                            level="h2"
                            className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3"
                        >
                            ¡Bienvenido!
                        </Heading>
                        <p className="text-sm sm:text-base text-[var(--foreground)] transition-colors duration-300">
                            Ingresa a tu cuenta para continuar
                        </p>
                    </div>

                    <form className="space-y-5 sm:space-y-6" onSubmit={onSubmit}>
                        <div className="space-y-4 sm:space-y-5">
                            {/* País */}
                            <div>
                                <Label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    País
                                </Label>
                                <select
                                    id="countryCode"
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                    className="w-full p-2.5 sm:p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                                >
                                    {countries.map((country) => (
                                        <option key={`${country.code}-${country.name}`} value={country.code}>
                                            {country.name} ({country.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Teléfono */}
                            <div>
                                <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Número de Teléfono
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">
                                        {countryCode}
                                    </span>
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="text"
                                        required
                                        className="block w-full pl-[4.5rem] pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                                        placeholder="987654321"
                                    />
                                </div>
                            </div>

                            {/* Contraseña */}
                            <div>
                                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Contraseña
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-2 space-y-4">
                            <Button
                                type="submit"
                                className="w-full"
                            >
                                Iniciar sesión
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">o</span>
                                </div>
                            </div>

                            <Link href="/register" className="block w-full">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                >
                                    Crear cuenta nueva
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600 mt-4">
                        ¿Necesitas ayuda? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Contáctanos</a>
                    </p>
                </div>
            </div>
            <ErrorModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} errors={validationErrors} />
        </div>
    );
}
