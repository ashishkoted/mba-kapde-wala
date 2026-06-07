import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const statusSteps = ["Order Placed", "Packed", "Shipped", "Delivered"];

function OrderTracking() {
  const { id } = useParams();

  const [orderId, setOrderId] = useState(id || "");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const findOrder = (searchId) => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    return orders.find((item) => item.id === searchId.trim());
  };

  useEffect(() => {
    if (id) {
      const found = findOrder(id);

      if (found) {
        setOrder(found);
        setError("");
      } else {
        setError("Order not found");
      }
    }
  }, [id]);

  const trackOrder = (e) => {
    e.preventDefault();

    const found = findOrder(orderId);

    if (!found) {
      setOrder(null);
      setError("Order not found");
      return;
    }

    setOrder(found);
    setError("");
  };

  const currentStep = order ? statusSteps.indexOf(order.status) : 0;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8">Track Your Order</h1>

      <form
        onSubmit={trackOrder}
        className="card rounded-2xl shadow p-6 flex flex-col sm:flex-row gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 input"
        />

        <button className="bg-black text-white px-8 py-3 rounded-xl font-bold">
          Track
        </button>
      </form>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {order && (
        <div className="space-y-8">
          <section className="card rounded-2xl shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold">Order ID: {order.id}</h2>
                <p className="muted mt-1">{order.date}</p>
              </div>

              <span
                className={`px-5 py-2 rounded-full font-bold ${order.status === "Cancelled"
                    ? "bg-red-100 text-red-600"
                    : order.status === "Return Requested"
                      ? "bg-orange-100 text-orange-600"
                      : order.status === "Return Approved"
                        ? "bg-blue-100 text-blue-600"
                        : order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {order.status}
              </span>
            </div>

            <div className="grid md:grid-cols-4 gap-5">
              {statusSteps.map((step, index) => (
                <div key={step} className="relative">
                  <div
                    className={`rounded-2xl p-5 text-center border ${index <= currentStep
                      ? "bg-green-50 border-green-500"
                      : "bg-gray-50 border-gray-200"
                      }`}
                  >
                    <div
                      className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold ${index <= currentStep
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-600"
                        }`}
                    >
                      {index + 1}
                    </div>

                    <p
                      className={`font-bold mt-3 ${index <= currentStep
                        ? "text-green-700"
                        : "muted"
                        }`}
                    >
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold mb-5">Ordered Products</h2>

              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex gap-4 border rounded-xl p-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-xl object-cover bg-gray-100"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.name}</h3>

                      <p className="text-sm muted mt-1">
                        Size: {item.size} | Color: {item.color}
                      </p>

                      <p className="text-sm muted">
                        Quantity: {item.quantity}
                      </p>

                      <p className="text-orange-600 font-bold mt-2">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="card rounded-2xl shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Customer Details</h2>

                <p className="font-bold">{order.customer?.name}</p>
                <p className="text-gray-600 mt-1">{order.customer?.email}</p>
                <p className="text-gray-600">{order.customer?.mobile}</p>
              </div>

              {order.customer?.address && (
                <div className="card rounded-2xl shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>

                  <p className="font-bold">
                    {order.customer.address.type || "Home"}
                  </p>

                  <p className="text-gray-600 mt-2">
                    {order.customer.address.address},{" "}
                    {order.customer.address.locality},{" "}
                    {order.customer.address.city},{" "}
                    {order.customer.address.state} -{" "}
                    {order.customer.address.pincode}
                  </p>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>

                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-bold">{order.payment}</span>
                </div>

                <div className="flex justify-between mt-3">
                  <span>Payment Status</span>
                  <span
                    className={`font-bold ${order.paymentStatus === "Paid"
                      ? "text-green-600"
                      : "text-yellow-700"
                      }`}
                  >
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>

                {order.transactionId && (
                  <div className="flex justify-between mt-3 gap-4">
                    <span>Transaction ID</span>
                    <span className="font-bold text-right">{order.transactionId}</span>
                  </div>
                )}

                <div className="border-t mt-4 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{order.subtotal || order.total}</span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Coupon {order.coupon ? `(${order.coupon})` : ""}</span>
                      <span>-₹{order.discount}</span>
                    </div>
                  )}

                  {order.codCharge > 0 && (
                    <div className="flex justify-between text-yellow-700 font-bold">
                      <span>COD Charge</span>
                      <span>₹{order.codCharge}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xl">
                    <span>Total Amount</span>
                    <span className="font-bold text-orange-600">₹{order.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default OrderTracking;