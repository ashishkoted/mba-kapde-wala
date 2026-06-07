import { Link } from "react-router-dom";
import { Danger, Shop, ArrowLeft } from "iconsax-react";

function ErrorPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-red-50 flex items-center justify-center">
                    <Danger size="48" variant="Bold" color="#dc2626" />
                </div>

                <h1 className="text-6xl font-black mt-6">404</h1>

                <h2 className="text-3xl font-bold mt-2">
                    Page Not Found
                </h2>

                <p className="text-gray-500 mt-4">
                    Bhai ye page available nahi hai. Home page par wapas jao.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Link
                        to="/"
                        className="flex-1 bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size="20" variant="Bold" />
                        Go Home
                    </Link>

                    <Link
                        to="/products"
                        className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                        <Shop size="20" variant="Bold" />
                        Shop Now
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default ErrorPage;