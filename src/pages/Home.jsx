import { Link } from "react-router-dom";
import {
  Truck,
  ShieldCheck,
  RefreshCcw,
  Headphones,
  ArrowRight,
  Heart,
} from "lucide-react";
import { products as demoProducts } from "../data/products";

function Home() {
  const adminProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];
  const allProducts = [...adminProducts, ...demoProducts];

  const bestProducts = allProducts.slice(0, 6);

  const categories = [
    {
      name: "Men",
      img: "https://rukminim2.flixcart.com/image/1920/1920/xif0q/t-shirt/k/s/i/l-p808-technosport-original-imah5mt5zugcrkzg.jpeg?w=900",
    },
    {
      name: "Women",
      img: "https://rukminim2.flixcart.com/image/1920/1920/xif0q/shopsy-ethnic-set/g/v/y/3xl-tibra-vikshi-original-imahk7dxmaggtsqp.jpeg?w=900",
    },
    {
      name: "Kids",
      img: "https://rukminim2.flixcart.com/image/1920/1920/xif0q/kids-apparel-combo/h/6/s/5-6-years-2skcht-kachhot-original-imahjd525tyya5ev.jpeg?w=900",
    },
    {
      name: "Accessories",
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900",
    },
    {
      name: "Footwear",
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
    },
  ];

  return (
    <main className="bg-gray-50">
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-black via-gray-900 to-slate-900 text-white min-h-[430px] flex items-center">
          <div className="absolute inset-0 opacity-35 bg-[url('https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1600')] bg-cover bg-center" />

          <div className="relative z-10 grid md:grid-cols-2 gap-8 w-full px-8 md:px-16 py-16">
            <div>
              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                New Fashion. <br />
                <span className="text-orange-500">New Style.</span>
              </h1>

              <p className="mt-5 text-lg text-gray-200 max-w-lg">
                Men, Women, Kids, Winter Wear aur Footwear ke latest collection.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-3 mt-8 border border-white/40 px-7 py-3 rounded-full font-bold hover:bg-orange-600 hover:border-orange-600"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
            </div>

            <div className="flex items-center justify-center md:justify-end">
              <div className="text-center bg-black/25 backdrop-blur rounded-3xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold">Mega Fashion Sale</h2>
                <p className="text-6xl font-black text-orange-500 mt-4">
                  50% OFF
                </p>
                <p className="mt-3">Limited Time Offer</p>

                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 mt-6 border border-orange-500 text-orange-400 px-8 py-3 rounded-xl font-bold"
                >
                  Shop Sale <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: <Truck />,
              title: "Free Delivery",
              text: "On all orders above ₹999",
            },
            {
              icon: <ShieldCheck />,
              title: "Secure Payment",
              text: "100% secure & trusted",
            },
            {
              icon: <RefreshCcw />,
              title: "Easy Returns",
              text: "7 days return policy",
            },
            {
              icon: <Headphones />,
              title: "24/7 Support",
              text: "We’re here to help you",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl shadow p-5 flex items-center gap-4"
            >
              <div className="text-orange-600">{item.icon}</div>
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-3xl font-black">Shop By Category</h2>
          <Link to="/products" className="text-orange-600 font-bold">
            View All Categories →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((cat) => (
            <Link
              to="/products"
              key={cat.name}
              className="relative h-44 rounded-2xl overflow-hidden bg-white shadow group"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-white font-black text-lg">{cat.name}</h3>
                <p className="text-white text-sm font-semibold">
                  Explore Now →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-3xl font-black">Best Selling Products</h2>
          <Link to="/products" className="text-orange-600 font-bold">
            View All Products →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-5">
          {bestProducts.map((product, index) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="bg-white rounded-2xl shadow overflow-hidden relative group"
            >
              <span className="absolute top-3 left-3 z-10 bg-orange-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                -{[40, 35, 30, 25, 20, 15][index] || 20}%
              </span>

              <button className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow">
                <Heart size={17} />
              </button>

              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-44 object-cover group-hover:scale-105 transition"
              />

              <div className="p-3">
                <h3 className="font-bold text-sm line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-orange-600 font-black mt-1">
                  ₹{product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-orange-50 rounded-3xl shadow p-8 relative overflow-hidden">
            <h2 className="text-3xl font-black text-orange-600">
              Get 10% Instant Discount
            </h2>
            <p className="mt-2">
              On your first order. Use code:{" "}
              <span className="font-black">MBA10</span>
            </p>

            <Link
              to="/products"
              className="inline-block mt-5 bg-black text-white px-6 py-3 rounded-xl font-bold"
            >
              Shop Now
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow p-8">
            <h3 className="text-xl font-black">New Arrivals</h3>
            <p className="text-gray-500 mt-2">Check out latest collections.</p>
            <Link
              to="/products"
              className="inline-block mt-5 font-bold text-orange-600"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;