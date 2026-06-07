import { useState } from "react";
import { useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { QrCode, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const COD_CHARGE = 50;

function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { currentUser } = useAuth();
  const { cartItems, clearCart } = useCart();

  const isBuyNow = searchParams.get("type") === "buy-now";
  const buyNowItem = JSON.parse(localStorage.getItem("buyNowItem"));

  const checkoutItems = isBuyNow && buyNowItem ? [buyNowItem] : cartItems;

  const checkoutTotal = checkoutItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const savedAddresses = JSON.parse(localStorage.getItem("userAddresses")) || [];
  const coupons = JSON.parse(localStorage.getItem("coupons")) || [];

  const [selectedAddress, setSelectedAddress] = useState("");
  const [payment, setPayment] = useState("COD");
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [successOrder, setSuccessOrder] = useState(null);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  if (!currentUser) return <Navigate to="/login" />;
  if (checkoutItems.length === 0 && !successOrder) {
    return <Navigate to="/cart" />;
  }

  const codCharge = payment === "COD" ? COD_CHARGE : 0;
  const finalTotal = checkoutTotal - discount + codCharge;

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();

    if (!code) return alert("Coupon code enter karo");

    const coupon = coupons.find((item) => item.code === code);
    if (!coupon) return alert("Invalid coupon");

    if (checkoutTotal < coupon.minOrder) {
      return alert(`Minimum order ₹${coupon.minOrder} required`);
    }

    let discountAmount =
      coupon.discountType === "flat"
        ? coupon.discountValue
        : Math.round((checkoutTotal * coupon.discountValue) / 100);

    if (discountAmount > checkoutTotal) {
      discountAmount = checkoutTotal;
    }

    setAppliedCoupon(coupon);
    setDiscount(discountAmount);
    alert("Coupon applied successfully");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode("");
  };

  const verifyOnlinePayment = () => {
    if (payment === "COD") return;

    if (!transactionId.trim()) {
      alert("Transaction ID / UPI Ref No. enter karo");
      return;
    }

    setPaymentVerified(true);
    alert("Payment verified successfully");
  };

  const reduceProductStock = (orderedItems) => {
    const adminProducts =
      JSON.parse(localStorage.getItem("adminProducts")) || [];

    const updatedProducts = adminProducts.map((product) => {
      const orderedProduct = orderedItems.find(
        (item) => String(item.id) === String(product.id)
      );

      if (!orderedProduct) return product;

      return {
        ...product,
        stock: Math.max(
          0,
          Number(product.stock || 0) - Number(orderedProduct.quantity || 1)
        ),
      };
    });

    localStorage.setItem("adminProducts", JSON.stringify(updatedProducts));
  };

  const sendWhatsAppOrder = (order) => {
    if (!order) return alert("Order details not found");

    const productsText = order.items
      .map(
        (item) =>
          `${item.name} | Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity
          } | ₹${item.price * item.quantity}`
      )
      .join("\n");

    const address = order.customer.address;

    const message =
      `New Order - MBA Kapde Wala\n\n` +
      `Order ID: ${order.id}\n\n` +
      `Customer:\n${order.customer.name}\nMobile: ${order.customer.mobile}\nEmail: ${order.customer.email}\n\n` +
      `Products:\n${productsText}\n\n` +
      `Address:\n${address.address}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}\n\n` +
      `Payment: ${order.payment}\n` +
      `Payment Status: ${order.paymentStatus}\n` +
      `Transaction ID: ${order.transactionId || "N/A"}\n` +
      `Subtotal: ₹${order.subtotal}\n` +
      `Discount: ₹${order.discount}\n` +
      `COD Charge: ₹${order.codCharge}\n` +
      `Total: ₹${order.total}\n` +
      `Status: ${order.status}`;

    window.open(
      `https://wa.me/919023603169?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const placeOrder = (e) => {
    e.preventDefault();

    const address = savedAddresses.find(
      (item) => String(item.id) === selectedAddress
    );

    if (!address) return alert("Please select delivery address");

    if (payment !== "COD" && !paymentVerified) {
      alert("Please verify online payment first");
      return;
    }

    const order = {
      id: "MBA" + Date.now(),
      customer: {
        email: currentUser.email,
        name: address.name,
        mobile: address.mobile,
        address,
      },
      items: checkoutItems,
      subtotal: checkoutTotal,
      discount,
      codCharge,
      total: finalTotal,
      coupon: appliedCoupon ? appliedCoupon.code : "",
      payment,
      paymentStatus: payment === "COD" ? "Pending - Cash On Delivery" : "Paid",
      transactionId: payment === "COD" ? "" : transactionId,
      status: "Order Placed",
      date: new Date().toLocaleString(),
    };

    const oldOrders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([order, ...oldOrders]));

    reduceProductStock(checkoutItems);
    setSuccessOrder(order);

    if (isBuyNow) {
      localStorage.removeItem("buyNowItem");
    } else {
      clearCart();
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <form onSubmit={placeOrder} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="card rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-5">Select Delivery Address</h2>

            {savedAddresses.length === 0 ? (
              <div className="border rounded-xl p-5">
                <p className="text-gray-600">No saved address found.</p>

                <button
                  type="button"
                  onClick={() => navigate("/account")}
                  className="mt-4 bg-black text-white px-6 py-3 rounded-xl font-bold"
                >
                  Add Address
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedAddresses.map((item) => (
                  <label
                    key={item.id}
                    className={`block border rounded-xl p-4 cursor-pointer ${selectedAddress === String(item.id)
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200"
                      }`}
                  >
                    <div className="flex gap-3">
                      <input
                        type="radio"
                        name="address"
                        value={item.id}
                        checked={selectedAddress === String(item.id)}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                      />

                      <div>
                        <div className="flex gap-3 items-center flex-wrap">
                          <span className="bg-gray-100 px-3 py-1 rounded text-xs font-bold">
                            {item.type}
                          </span>
                          <p className="font-bold">{item.name}</p>
                          <p className="font-bold">{item.mobile}</p>
                        </div>

                        <p className="text-gray-600 mt-2">
                          {item.address}, {item.locality}, {item.city},{" "}
                          {item.state} - {item.pincode}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </section>

          <section className="card rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-5">Payment Method</h2>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { key: "COD", title: "Cash On Delivery", icon: <ShieldCheck /> },
                { key: "UPI", title: "UPI Payment", icon: <QrCode /> },
              ].map((method) => (
                <button
                  key={method.key}
                  type="button"
                  onClick={() => {
                    setPayment(method.key);
                    setPaymentVerified(false);
                    setTransactionId("");
                  }}
                  className={`border rounded-2xl p-4 text-left font-bold ${payment === method.key
                    ? "border-orange-600 bg-orange-50 text-orange-700"
                    : "border-gray-200"
                    }`}
                >
                  <div className="mb-2">{method.icon}</div>
                  {method.title}
                </button>
              ))}
            </div>

            {payment === "COD" && (
              <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                <p className="font-bold text-yellow-700">
                  COD selected: ₹{COD_CHARGE} extra charge लगेगा.
                </p>
              </div>
            )}

            {payment !== "COD" && (
              <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <h3 className="font-bold text-lg mb-3">
                  {payment === "UPI"
                    ? "Pay using UPI / QR"
                    : "Pay using Debit Card"}
                </h3>

                {payment === "UPI" && (
                  <div className="bg-white border rounded-2xl p-5 mb-4 text-center">

                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=kotedashish890-3@okicici&pn=MBA%20Kapde%20Wala`}
                      alt="UPI QR"
                      className="w-52 h-52 mx-auto"
                    />

                    <p className="font-bold mt-3">
                      UPI ID: kotedashish890-3@okicici
                    </p>

                    <p className="text-gray-500 text-sm">
                      Payment karne ke baad Transaction ID enter karo.
                    </p>

                  </div>
                )}



                <input
                  type="text"
                  placeholder="Transaction ID / UPI Ref No."
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="input w-full"
                />

                <button
                  type="button"
                  onClick={verifyOnlinePayment}
                  className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Verify Payment
                </button>

                {paymentVerified && (
                  <p className="mt-3 text-green-700 font-bold">
                    Payment Verified
                  </p>
                )}
              </div>
            )}
          </section>
        </div>

        <div className="card rounded-2xl shadow p-6 h-fit">
          <h2 className="text-2xl font-bold">Order Summary</h2>

          {checkoutItems.map((item) => (
            <div
              key={`${item.id}-${item.size}-${item.color}`}
              className="flex justify-between mt-4 text-sm gap-4"
            >
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <div className="border-t mt-5 pt-5 space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">₹{checkoutTotal}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-green-600 font-bold">
                <span>Coupon ({appliedCoupon.code})</span>
                <span>-₹{discount}</span>
              </div>
            )}

            {codCharge > 0 && (
              <div className="flex justify-between text-yellow-700 font-bold">
                <span>COD Charge</span>
                <span>₹{codCharge}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span className="text-orange-600">₹{finalTotal}</span>
            </div>
          </div>

          <div className="mt-6">
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border rounded-xl px-3 py-2"
                />

                <button
                  type="button"
                  onClick={applyCoupon}
                  className="bg-orange-600 text-white px-4 rounded-xl font-bold"
                >
                  Apply
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={removeCoupon}
                className="text-red-600 font-bold"
              >
                Remove Coupon
              </button>
            )}
          </div>

          <button className="w-full mt-6 bg-black text-white py-3 rounded-xl font-bold">
            {payment === "COD" ? "Place COD Order" : "Place Paid Order"}
          </button>
        </div>
      </form>

      {successOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="card rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl">
              ✓
            </div>

            <h2 className="text-3xl font-bold mt-5">Order Placed!</h2>

            <div className="bg-gray-50 rounded-2xl p-4 mt-6 text-left space-y-2">
              <p>
                <b>Order ID:</b> {successOrder.id}
              </p>
              <p>
                <b>Payment:</b> {successOrder.payment}
              </p>
              <p>
                <b>Payment Status:</b> {successOrder.paymentStatus}
              </p>
              <p>
                <b>Total:</b> ₹{successOrder.total}
              </p>
              <p>
                <b>Status:</b> {successOrder.status}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/track-order/${successOrder.id}`)}
              className="w-full mt-6 bg-black text-white py-3 rounded-xl font-bold"
            >
              Track Order
            </button>

            <button
              type="button"
              onClick={() => sendWhatsAppOrder(successOrder)}
              className="w-full mt-3 bg-green-600 text-white py-3 rounded-xl font-bold"
            >
              Send Order on WhatsApp
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="w-full mt-3 border py-3 rounded-xl font-bold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Checkout;