import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { TickCircle, Danger } from "iconsax-react";

function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const discount = 20;
  const oldPrice = Math.round(product.price + (product.price * discount) / 100);
  const stock = Number(product.stock ?? 10);

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-[340px] object-cover group-hover:scale-105 transition duration-500"
          />

          <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs px-3 py-1 rounded-full font-bold">
            -{discount}%
          </span>

          {stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-5 py-2 rounded-full font-bold">
                Out Of Stock
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className="absolute top-3 right-3 bg-white w-10 h-10 rounded-full shadow flex items-center justify-center"
          >
            <Heart
              size={18}
              fill={isInWishlist(product.id) ? "currentColor" : "none"}
              className={
                isInWishlist(product.id) ? "text-red-500" : "text-gray-600"
              }
            />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-sm text-gray-500">
          {product.category}
          {product.subCategory ? ` / ${product.subCategory}` : ""}
        </p>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-lg mt-1 line-clamp-2 min-h-[56px] hover:text-orange-600">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={15} fill="#f59e0b" stroke="#f59e0b" />
          ))}
          <span className="text-sm text-gray-500 ml-1">(4.8)</span>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <span className="text-2xl font-black text-orange-600">
            ₹{product.price}
          </span>

          <span className="text-gray-400 line-through">₹{oldPrice}</span>
        </div>

        {stock <= 0 ? (
          <div className="flex items-center gap-2 mt-2 text-red-600 font-semibold">
            <Danger size="18" variant="Bold" />
            <span>Out Of Stock</span>
          </div>
        ) : stock <= 5 ? (
          <div className="flex items-center gap-2 mt-2 text-orange-600 font-semibold">
            <Danger size="18" variant="Bold" />
            <span>Only {stock} Left</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-bold mt-2">
            <TickCircle size="16" variant="Bold" />
            {stock} In Stock
          </div>
        )}

        <div className="mt-4">
          <Link
            to={`/product/${product.id}`}
            className="block w-full text-center bg-black hover:bg-orange-600 text-white py-3 rounded-2xl font-bold transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;