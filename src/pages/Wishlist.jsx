import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

function Wishlist() {
  const { wishlistItems, toggleWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold">Your Wishlist is Empty</h1>
        <p className="muted mt-3">
          Favorite products save karne ke liye heart icon dabao.
        </p>

        <Link
          to="/products"
          className="inline-block mt-8 bg-black text-white px-8 py-3 rounded-xl font-bold"
        >
          Explore Products
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <div
            key={product.id}
            className="card rounded-2xl shadow overflow-hidden"
          >
            <Link to={`/product/${product.id}`}>
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-56 object-cover"
              />
            </Link>

            <div className="p-4">
              <p className="text-sm muted">{product.category}</p>
              <h2 className="font-bold text-lg mt-1">{product.name}</h2>
              <p className="text-orange-600 font-bold text-xl mt-2">
                ₹{product.price}
              </p>

              <div className="flex gap-3 mt-4">
                <Link
                  to={`/product/${product.id}`}
                  className="flex-1 bg-black text-white py-2 rounded-xl text-center font-bold"
                >
                  View
                </Link>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="px-4 border rounded-xl text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Wishlist;