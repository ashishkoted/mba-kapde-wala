import { ShoppingCart } from "iconsax-react";

function PrimaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
    >
      <ShoppingCart size="20" variant="Bold" />
      {children}
    </button>
  );
}

export default PrimaryButton;