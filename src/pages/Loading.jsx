import { ShoppingBag, Shop } from "iconsax-react";

function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag size="38" variant="Bold" color="#ea580c" />
                    </div>
                </div>

                <h1 className="text-3xl font-black mt-6">
                    MBA <span className="text-orange-600">Kapde Wala</span>
                </h1>

                <p className="text-gray-500 mt-2">
                    Fashion store loading...
                </p>
            </div>
        </div>
    );
}

export default Loading;