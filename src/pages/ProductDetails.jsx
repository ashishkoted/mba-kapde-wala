import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Star1, TickCircle, Danger } from "iconsax-react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const allProducts = useMemo(() => {
    const adminProducts =
      JSON.parse(localStorage.getItem("adminProducts")) || [];
    return [...adminProducts, ...products];
  }, []);

  const product = allProducts.find((item) => String(item.id) === String(id));

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [reviews, setReviews] = useState([]);


  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  const [sizeData, setSizeData] = useState({
    height: "",
    weight: "",
  });

  const [recommendedSize, setRecommendedSize] = useState("");

  useEffect(() => {
    if (!product) return;

    setMainImage(product.images?.[0] || "");

    const savedReviews =
      JSON.parse(localStorage.getItem(`reviews_${product.id}`)) || [];

    setReviews(savedReviews);
  }, [product]);

  if (!product) {
    return (
      <main className="relative z-0 max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Product Not Found</h1>

        <Link
          to="/products"
          className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-xl"
        >
          Back to Products
        </Link>
      </main>
    );
  }

  const productImages =
    product.images && product.images.length > 0 ? product.images : [];

  const currentImageIndex = productImages.findIndex((img) => img === mainImage);
  const stock = Number(product.stock ?? 10);

  const showPrevImage = () => {
    if (productImages.length <= 1) return;

    const prevIndex =
      currentImageIndex <= 0 ? productImages.length - 1 : currentImageIndex - 1;

    setMainImage(productImages[prevIndex]);
  };

  const showNextImage = () => {
    if (productImages.length <= 1) return;

    const nextIndex =
      currentImageIndex >= productImages.length - 1 ? 0 : currentImageIndex + 1;

    setMainImage(productImages[nextIndex]);
  };

  const handleBuyNow = () => {
    if (stock <= 0) {
      alert("This product is out of stock");
      return;
    }

    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }

    const buyNowProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    };

    localStorage.setItem("buyNowItem", JSON.stringify(buyNowProduct));
    navigate("/checkout?type=buy-now");
  };

  const handleAddToCart = () => {
    if (stock <= 0) {
      alert("This product is out of stock");
      return;
    }

    addToCart(product, selectedSize, selectedColor);
  };

  const recommendSize = () => {
    const height = Number(sizeData.height);
    const weight = Number(sizeData.weight);

    if (!height || !weight) {
      alert("Height aur weight enter karo");
      return;
    }

    let size = "M";

    if (height < 160 && weight < 55) {
      size = "S";
    } else if (height <= 170 && weight <= 70) {
      size = "M";
    } else if (height <= 180 && weight <= 85) {
      size = "L";
    } else {
      size = "XL";
    }

    setRecommendedSize(size);
    setSelectedSize(size);
  };

  const submitReview = (e) => {
    e.preventDefault();

    if (!reviewForm.name || !reviewForm.comment) {
      alert("Please fill review details");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: reviewForm.name,
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment,
      date: new Date().toLocaleDateString(),
    };

    const updatedReviews = [newReview, ...reviews];

    setReviews(updatedReviews);
    localStorage.setItem(
      `reviews_${product.id}`,
      JSON.stringify(updatedReviews)
    );

    setReviewForm({
      name: "",
      rating: 5,
      comment: "",
    });
  };

  const averageRating =
    reviews.length === 0
      ? 0
      : (
        reviews.reduce((total, item) => total + Number(item.rating), 0) /
        reviews.length
      ).toFixed(1);

  return (
    <main className="relative z-0 max-w-7xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="card rounded-3xl shadow p-4">
            <div className="relative bg-gray-50 rounded-2xl overflow-hidden h-[460px] flex items-center justify-center">
              <img
                src={mainImage || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-contain p-3"
              />

              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow w-11 h-11 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    type="button"
                    onClick={showNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow w-11 h-11 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}


            </div>
          </div>

          <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
            {productImages.map((img, index) => (
              <button
                type="button"
                key={`${img}-${index}`}
                onClick={() => setMainImage(img)}
                className={`w-24 h-24 rounded-xl overflow-hidden border-2 shrink-0 bg-gray-100 ${mainImage === img ? "border-orange-600" : "border-transparent"
                  }`}
              >
                <img
                  src={img}
                  alt="product"
                  className="w-full h-full object-contain p-1"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="card rounded-3xl shadow p-6 md:p-8">
          <p className="text-orange-600 font-semibold">
            {product.category}
            {product.subCategory ? ` / ${product.subCategory}` : ""}
          </p>

          <h1 className="text-4xl font-bold mt-2">{product.name}</h1>

          <div className="flex items-center gap-3 mt-3">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              {averageRating || "0"} ★
            </span>
            <span className="muted">{reviews.length} Reviews</span>
          </div>

          <p className="text-3xl font-bold text-orange-600 mt-5">
            ₹{product.price}
          </p>

          <div className="mt-4">
            {stock <= 0 ? (
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full font-bold">
                <Danger size="18" variant="Bold" />
                Out Of Stock
              </div>
            ) : stock <= 5 ? (
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-bold">
                <Danger size="18" variant="Bold" />
                Only {stock} Left
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-bold mt-2">
                <TickCircle size="16" variant="Bold" />
                {stock} In Stock
              </div>
            )}
          </div>

          <p className="text-gray-600 mt-5 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-7">
            <h3 className="font-bold mb-3">Select Size</h3>

            <div className="flex gap-3 flex-wrap">
              {product.sizes?.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2 rounded-xl border font-semibold ${selectedSize === size
                    ? "bg-black text-white"
                    : "card text-gray-700"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 bg-orange-50 border border-orange-200 rounded-2xl p-5">
            <h3 className="font-bold text-lg">AI Size Recommendation</h3>
            <p className="text-gray-600 text-sm mt-1">
              Height aur weight dalo, hum best size suggest karenge.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <input
                type="number"
                placeholder="Height in cm"
                value={sizeData.height}
                onChange={(e) =>
                  setSizeData({ ...sizeData, height: e.target.value })
                }
                className="input"
              />

              <input
                type="number"
                placeholder="Weight in kg"
                value={sizeData.weight}
                onChange={(e) =>
                  setSizeData({ ...sizeData, weight: e.target.value })
                }
                className="input"
              />
            </div>

            <button
              type="button"
              onClick={recommendSize}
              className="mt-4 bg-black text-white px-6 py-3 rounded-xl font-bold"
            >
              Suggest My Size
            </button>

            {recommendedSize && (
              <p className="mt-4 font-bold text-orange-700">
                Recommended Size: {recommendedSize}
              </p>
            )}
          </div>

          <div className="mt-7">
            <h3 className="font-bold mb-3">Select Color</h3>

            <div className="flex gap-3 flex-wrap">
              {product.colors?.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-5 py-2 rounded-xl border font-semibold ${selectedColor === color
                    ? "bg-orange-600 text-white"
                    : "card text-gray-700"
                    }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              type="button"
              disabled={stock <= 0}
              onClick={handleBuyNow}
              className={`flex-1 py-3 rounded-xl font-bold text-white ${stock <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
                }`}
            >
              {stock <= 0 ? "Unavailable" : "Buy Now"}
            </button>

            <button
              type="button"
              disabled={stock <= 0}
              onClick={handleAddToCart}
              className={`flex-1 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${stock <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-orange-600"
                }`}
            >
              <ShoppingCart size={20} />
              {stock <= 0 ? "Out Of Stock" : "Add To Cart"}
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`flex-1 border py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${isInWishlist(product.id)
                ? "bg-red-50 text-red-600 border-red-300"
                : "hover:bg-red-50"
                }`}
            >
              <Heart
                size={20}
                fill={isInWishlist(product.id) ? "currentColor" : "none"}
              />
              {isInWishlist(product.id) ? "Wishlisted" : "Wishlist"}
            </button>
          </div>
        </div>
      </div>

      <section className="mt-12 card rounded-3xl shadow p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold">Ratings and Reviews</h2>
            <p className="muted mt-1">
              {reviews.length} customer reviews for this product
            </p>
          </div>

          <div className="bg-green-600 text-white px-5 py-3 rounded-2xl font-bold">
            {averageRating || "0"} ★
          </div>
        </div>

        <form
          onSubmit={submitReview}
          className="grid md:grid-cols-3 gap-4 mb-8 items-center"
        >
          <input
            type="text"
            placeholder="Your Name"
            value={reviewForm.name}
            onChange={(e) =>
              setReviewForm({ ...reviewForm, name: e.target.value })
            }
            className="input"
          />

          <div className="input flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
              >
                <Star1
                  size="28"
                  variant={star <= reviewForm.rating ? "Bold" : "Linear"}
                  color={star <= reviewForm.rating ? "#f59e0b" : "#9ca3af"}
                />
              </button>
            ))}
          </div>

          <button className="bg-black text-white rounded-xl font-bold py-3">
            Submit Review
          </button>

          <textarea
            placeholder="Write your review..."
            value={reviewForm.comment}
            onChange={(e) =>
              setReviewForm({ ...reviewForm, comment: e.target.value })
            }
            className="md:col-span-3 input"
            rows="4"
          />
        </form>

        {reviews.length === 0 ? (
          <div className="border rounded-2xl p-6 text-center">
            <p className="muted">No reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-2xl p-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-bold">{review.name}</h3>
                    <p className="text-yellow-500">
                      {"★".repeat(review.rating)}
                      <span className="text-gray-300">
                        {"★".repeat(5 - review.rating)}
                      </span>
                    </p>
                  </div>

                  <p className="text-gray-400 text-sm">{review.date}</p>
                </div>

                <p className="text-gray-600 mt-3">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>


    </main>
  );
}

export default ProductDetails;