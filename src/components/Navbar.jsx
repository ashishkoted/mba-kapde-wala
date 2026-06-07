import { Link, NavLink } from "react-router-dom";
import { Heart, ShoppingCart, User, LogOut, Menu } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { wishlistItems } = useWishlist();
  const { cartItems } = useCart();
  const { currentUser, logoutUser } = useAuth();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    await logoutUser();
    alert("Logout successful");
  };

  return (
    <nav className="sticky top-0 z-[9999] card/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="relative z-[9999] text-2xl font-black tracking-tight">
          MBA <span className="text-orange-600">Kapde Wala</span>
        </Link>

        <div className="hidden md:flex items-center gap-7 font-semibold">
          {[
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: "Track Order", path: "/track-order" },
          ].map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "text-orange-600" : "hover:text-orange-600"
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/wishlist" className="relative hidden sm:block hover:text-orange-600">
            <Heart />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative hover:text-orange-600">
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {currentUser ? (
            <>
              <Link to="/account" className="hover:text-orange-600">
                <User />
              </Link>

              <button onClick={handleLogout} className="hover:text-red-600">
                <LogOut />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-black text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-orange-600"
            >
              Login
            </Link>
          )}

          <button className="md:hidden">
            <Menu />
          </button>
          <button
            onClick={toggleTheme}
            className="hover:text-orange-600"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;