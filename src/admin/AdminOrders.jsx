import { useState } from "react";

const statusOptions = [
    "Order Placed",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Return Requested",
    "Return Approved",
    "Return Rejected",
];

function AdminOrders() {

    const getStatusColor = (status) => {
        if (status === "Delivered") return "text-green-600";
        if (status === "Cancelled") return "text-red-600";
        if (status === "Return Requested") return "text-orange-600";
        if (status === "Return Approved") return "text-blue-600";
        if (status === "Return Rejected") return "text-red-600";
        return "text-yellow-700";
    };
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const [orders, setOrders] = useState(savedOrders);

    const updateStatus = (orderId, newStatus) => {
        const updatedOrders = orders.map((order) =>
            order.id === orderId
                ? { ...order, status: newStatus }
                : order
        );

        setOrders(updatedOrders);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));

        alert("Order status updated");
    };

    return (
        <section className="p-6 md:p-10">
            <h1 className="text-4xl font-bold mb-8">Orders</h1>

            <div className="bg-white rounded-2xl shadow p-6">
                {orders.length === 0 ? (
                    <p className="text-gray-500">No orders found.</p>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="border rounded-2xl p-5">
                                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                                    <div>
                                        <p className="font-bold text-lg">Order ID: {order.id}</p>
                                        <p className="text-gray-500">{order.date}</p>
                                        <p className="text-gray-600 mt-2">
                                            Customer: {order.customer?.name}
                                        </p>
                                        <p className="text-gray-600">
                                            Mobile: {order.customer?.mobile}
                                        </p>
                                    </div>

                                    <div className="md:text-right">
                                        <p className="text-orange-600 font-bold text-xl">
                                            ₹{order.total}
                                        </p>

                                        <p className="text-sm font-semibold mt-1">
                                            Payment: {order.payment}
                                        </p>

                                        <p
                                            className={`text-sm font-bold ${order.paymentStatus === "Paid"
                                                ? "text-green-600"
                                                : "text-yellow-700"
                                                }`}
                                        >
                                            {order.paymentStatus || "Pending"}
                                        </p>

                                        {order.transactionId && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                TXN: {order.transactionId}
                                            </p>
                                        )}

                                        {order.codCharge > 0 && (
                                            <p className="text-yellow-700 text-sm font-bold">
                                                COD Charge: ₹{order.codCharge}
                                            </p>
                                        )}

                                        {order.discount > 0 && (
                                            <p className="text-green-600 text-sm font-semibold">
                                                Coupon: {order.coupon} | Saved ₹{order.discount}
                                            </p>
                                        )}

                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                updateStatus(order.id, e.target.value)
                                            }
                                            className="mt-3 border rounded-xl px-4 py-2 font-semibold"
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    {order.items?.map((item) => (
                                        <div
                                            key={`${item.id}-${item.size}-${item.color}`}
                                            className="flex gap-4 bg-gray-50 rounded-xl p-3"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />

                                            <div>
                                                <h3 className="font-bold">{item.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Size: {item.size} | Color: {item.color}
                                                </p>
                                                <p className="text-sm">
                                                    Qty: {item.quantity} × ₹{item.price}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {order.customer?.address && (
                                    <div className="mt-5 bg-blue-50 rounded-xl p-4">
                                        <p className="font-bold mb-1">Delivery Address</p>
                                        <p className="text-gray-700">
                                            {order.customer.address.address},{" "}
                                            {order.customer.address.locality},{" "}
                                            {order.customer.address.city},{" "}
                                            {order.customer.address.state} -{" "}
                                            {order.customer.address.pincode}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default AdminOrders;