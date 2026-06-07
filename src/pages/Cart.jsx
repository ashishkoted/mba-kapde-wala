import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    cartTotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold">Your Cart is Empty</h1>
        <p className="muted mt-3">Add products to continue shopping.</p>

        <Link
          to="/products"
          className="inline-block mt-8 bg-black text-white px-8 py-3 rounded-xl"
        >
          Shop Now
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.size}-${item.color}`}
              className="card rounded-2xl shadow p-4 flex gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 object-cover rounded-xl"
              />

              <div className="flex-1">
                <h2 className="font-bold text-lg">{item.name}</h2>
                <p className="muted text-sm">
                  Size: {item.size} | Color: {item.color}
                </p>
                <p className="text-orange-600 font-bold mt-2">₹{item.price}</p>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      decreaseQty(item.id, item.size, item.color)
                    }
                    className="w-8 h-8 bg-gray-100 rounded-full"
                  >
                    -
                  </button>

                  <span className="font-bold">{item.quantity}</span>

                  <button
                    onClick={() =>
                      increaseQty(item.id, item.size, item.color)
                    }
                    className="w-8 h-8 bg-gray-100 rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() =>
                  removeFromCart(item.id, item.size, item.color)
                }
                className="text-red-500"
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="card rounded-2xl shadow p-6 h-fit">
          <h2 className="text-2xl font-bold">Order Summary</h2>

          <div className="flex justify-between mt-6">
            <span>Total</span>
            <span className="font-bold text-orange-600">₹{cartTotal}</span>
          </div>

          <Link
            to="/checkout"
            className="block text-center mt-6 bg-black text-white py-3 rounded-xl font-bold"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Cart;