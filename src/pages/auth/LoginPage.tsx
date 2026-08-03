import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const navigate = useNavigate();

const { login } = useAuth();


    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();

        setError("");

        if (!email.trim()) {

            setError("Please enter your administrator email.");

            return;

        }

        if (!password.trim()) {

            setError("Please enter your password.");

            return;

        }

        try {

            setLoading(true);

            await login(

                email.trim(),

                password

            );

            navigate("/dashboard");

        } catch (error: any) {

            console.error(error);

            setError(

                error.message

            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="min-h-screen bg-slate-100 flex items-center justify-center">

            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">

                <h1 className="text-3xl font-bold text-slate-900">

                    Books • Bots

                </h1>

                <p className="mt-2 text-slate-500">

                    Administrator Login

                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                >

                    <input

                        type="email"

                        placeholder="Administrator Email"

                        value={email}

                        onChange={(e) => setEmail(e.target.value)}

                        className="w-full rounded-lg border p-3"

                    />

                    <input

                        type="password"

                        placeholder="Password"

                        value={password}

                        onChange={(e) => setPassword(e.target.value)}

                        className="w-full rounded-lg border p-3"

                    />


                    {error && (

                        <div className="rounded-lg bg-red-100 p-3 text-red-700 text-sm">

                            {error}

                        </div>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white disabled:opacity-50"
                    >

                        {loading ? "Signing In..." : "Sign In"}

                    </button>

                </form>

            </div>

        </div>

    );

}