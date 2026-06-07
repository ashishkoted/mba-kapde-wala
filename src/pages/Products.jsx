import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { products as demoProducts } from "../data/products";

const categoryData = {
  All: ["All"],
  Men: ["All", "Shirts", "T-Shirts", "Jeans", "Jacket", "Kurta Set", "TrackSuits"],
  Women: ["All", "Kurtis", "Lehengas", "Topwear", "Bottomwear", "Winterwear", "Sarees"],
  Kids: ["All", "Boys", "Girls", "Babies", "Teens"],
  Accessories: ["All", "Watches Boys", "Watches Girls", "Bag", "Sunglasses", "Wallets"],
  Footwear: ["All", "Men Footwear", "Women Footwear", "Boys Footwear", "Babies Footwear"],
};

function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [subCategory, setSubCategory] = useState("All");
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const adminProducts =
      JSON.parse(localStorage.getItem("adminProducts")) || [];

    const fixedDemoProducts = demoProducts.map((product) => ({
      ...product,
      category:
        product.category === "Winter Wear" ? "Accessories" : product.category,
      subCategory: product.subCategory || "All",
    }));

    setAllProducts([...adminProducts, ...fixedDemoProducts]);
  }, []);

  const categories = ["All", "Men", "Women", "Kids", "Accessories", "Footwear"];

  const filteredProducts = allProducts.filter((product) => {
    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      category === "All" || product.category === category;

    const subCategoryMatch =
      subCategory === "All" ||
      !product.subCategory ||
      product.subCategory === subCategory;

    return searchMatch && categoryMatch && subCategoryMatch;
  });

  const handleCategory = (item) => {
    setCategory(item);
    setSubCategory("All");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-5xl font-black">All Products</h1>
          <p className="text-gray-500 mt-2">
            Latest fashion collection for Men, Women, Kids and more.
          </p>
        </div>

        <div className="relative w-full lg:w-[420px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search shirts, shoes, jeans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-2xl pl-12 pr-4 py-4 outline-none bg-white shadow-sm focus:border-orange-500"
          />
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 mb-4">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => handleCategory(item)}
            className={`px-6 py-3 rounded-full whitespace-nowrap font-bold border ${category === item
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 hover:border-orange-500"
              }`}
          >
            {item}
          </button>
        ))}
      </div>

      {category !== "All" && (
        <div className="bg-white rounded-2xl shadow p-4 mb-8">
          <div className="flex items-center gap-2 mb-3 font-bold">
            <SlidersHorizontal size={20} />
            Select {category} Type
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {categoryData[category].map((item) => (
              <button
                key={item}
                onClick={() => setSubCategory(item)}
                className={`px-5 py-2 rounded-full whitespace-nowrap font-semibold border ${subCategory === item
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-gray-50 text-gray-700"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h2 className="text-2xl font-bold">No Products Found</h2>
          <p className="text-gray-500 mt-2">Try another category or search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Products;