import { Link, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <main className="max-w-3xl mx-auto px-4 py-20 text-center">
      <CheckCircle className="mx-auto text-green-600" size={90} />

      <h1 className="text-4xl font-bold mt-6">Order Placed Successfully!</h1>

      <p className="text-gray-600 mt-4">
        Your Order ID is:
      </p>

      <p className="text-2xl font-bold text-orange-600 mt-2">
        {orderId}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <Link
          to={`/track-order/${orderId}`}
          className="bg-black text-white px-8 py-3 rounded-xl font-bold"
        >
          Track Order
        </Link>

        <Link
          to="/products"
          className="border px-8 py-3 rounded-xl font-bold"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}

export default OrderSuccess;