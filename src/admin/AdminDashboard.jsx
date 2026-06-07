function AdminDashboard() {
    const products =
        JSON.parse(localStorage.getItem("adminProducts")) || [];

    const orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    const revenue = orders.reduce(
        (total, order) => total + Number(order.total || 0),
        0
    );

    const deliveredOrders = orders.filter(
        (order) => order.status === "Delivered"
    ).length;

    const pendingOrders = orders.filter(
        (order) => order.status !== "Delivered"
    ).length;

    const customersMap = new Map();

    orders.forEach((order) => {
        if (order.customer?.email) {
            customersMap.set(
                order.customer.email,
                order.customer
            );
        }
    });

    const totalCustomers = customersMap.size;

    const recentOrders = orders.slice(0, 5);

    const recentProducts = products.slice(0, 5);

    const productSalesMap = new Map();

    let totalItemsSold = 0;

    orders.forEach((order) => {
        order.items?.forEach((item) => {
            totalItemsSold += Number(item.quantity || 1);

            if (!productSalesMap.has(item.id)) {
                productSalesMap.set(item.id, {
                    name: item.name,
                    image: item.image,
                    quantity: 0,
                    revenue: 0,
                });
            }

            const existing = productSalesMap.get(item.id);
            existing.quantity += Number(item.quantity || 1);
            existing.revenue += Number(item.price || 0) * Number(item.quantity || 1);
        });
    });

    const topSellingProduct =
        Array.from(productSalesMap.values()).sort(
            (a, b) => b.quantity - a.quantity
        )[0] || null;

    const customerStatsMap = new Map();

    orders.forEach((order) => {
        const email = order.customer?.email;
        if (!email) return;

        if (!customerStatsMap.has(email)) {
            customerStatsMap.set(email, {
                name: order.customer?.name,
                email,
                orders: 0,
                spent: 0,
            });
        }

        const customer = customerStatsMap.get(email);
        customer.orders += 1;
        customer.spent += Number(order.total || 0);
    });

    const bestCustomer =
        Array.from(customerStatsMap.values()).sort(
            (a, b) => b.spent - a.spent
        )[0] || null;

    const lowStockProducts = products.filter(
        (product) => Number(product.stock || 0) <= 5
    );

    return (
        <section className="p-6 md:p-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold">
                    Admin Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                    Store overview, orders and product activity.
                </p>
            </div>

            {/* STATS */}

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-white rounded-2xl shadow p-6">
                    <p className="text-gray-500">
                        Total Products
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                        {products.length}
                    </h2>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <p className="text-gray-500">
                        Total Orders
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                        {orders.length}
                    </h2>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <p className="text-gray-500">
                        Customers
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                        {totalCustomers}
                    </h2>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <p className="text-gray-500">
                        Revenue
                    </p>

                    <h2 className="text-4xl font-bold mt-2 text-green-600">
                        ₹{revenue}
                    </h2>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <p className="text-gray-500">
                        Low Stock
                    </p>

                    <h2 className="text-4xl font-bold mt-2 text-red-600">
                        {lowStockProducts.length}
                    </h2>
                </div>
            </div>

            {/* ORDER STATUS */}

            <div className="grid sm:grid-cols-2 gap-6 mt-6">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                    <p className="text-green-700 font-semibold">
                        Delivered Orders
                    </p>

                    <h2 className="text-4xl font-bold mt-2 text-green-700">
                        {deliveredOrders}
                    </h2>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                    <p className="text-yellow-700 font-semibold">
                        Pending Orders
                    </p>

                    <h2 className="text-4xl font-bold mt-2 text-yellow-700">
                        {pendingOrders}
                    </h2>
                </div>
            </div>


            <div className="grid lg:grid-cols-3 gap-6 mt-6">
                <div className="bg-white rounded-2xl shadow p-6">
                    <p className="text-gray-500">Total Items Sold</p>
                    <h2 className="text-4xl font-bold mt-2">{totalItemsSold}</h2>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <p className="text-gray-500">Top Selling Product</p>

                    {topSellingProduct ? (
                        <div className="flex items-center gap-4 mt-3">
                            <img
                                src={topSellingProduct.image}
                                alt={topSellingProduct.name}
                                className="w-14 h-14 rounded-xl object-cover"
                            />

                            <div>
                                <p className="font-bold">{topSellingProduct.name}</p>
                                <p className="text-sm text-gray-500">
                                    Sold: {topSellingProduct.quantity}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-3">No sales yet.</p>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <p className="text-gray-500">Best Customer</p>

                    {bestCustomer ? (
                        <div className="mt-3">
                            <p className="font-bold">{bestCustomer.name}</p>
                            <p className="text-sm text-gray-500">{bestCustomer.email}</p>
                            <p className="text-orange-600 font-bold mt-1">
                                ₹{bestCustomer.spent}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-3">No customer yet.</p>
                    )}
                </div>
            </div>

            {/* LOW STOCK ALERT */}

            <div className="bg-white rounded-2xl shadow p-6 mt-8">
                <h2 className="text-2xl font-bold mb-5">
                    Low Stock Alert
                </h2>

                {lowStockProducts.length === 0 ? (
                    <p className="text-green-600 font-semibold">
                        All products are well stocked.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {lowStockProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex justify-between border-b pb-3"
                            >
                                <span>{product.name}</span>

                                <span className="text-red-600 font-bold">
                                    {product.stock} Left
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* RECENT DATA */}

            <div className="grid lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-2xl font-bold mb-5">
                        Recent Orders
                    </h2>

                    {recentOrders.length === 0 ? (
                        <p className="text-gray-500">
                            No orders yet.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border rounded-xl p-4 flex justify-between gap-4"
                                >
                                    <div>
                                        <p className="font-bold">
                                            {order.id}
                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            {order.customer?.name}
                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            {order.date}
                                        </p>

                                        <p className="text-sm font-semibold mt-1">
                                            {order.payment}
                                        </p>

                                        <p
                                            className={`text-sm font-bold ${order.paymentStatus ===
                                                "Paid"
                                                ? "text-green-600"
                                                : "text-yellow-700"
                                                }`}
                                        >
                                            {order.paymentStatus}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-orange-600">
                                            ₹{order.total}
                                        </p>

                                        <p className="text-sm text-green-600 font-semibold">
                                            {order.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-2xl font-bold mb-5">
                        Recent Products
                    </h2>

                    {recentProducts.length === 0 ? (
                        <p className="text-gray-500">
                            No products added yet.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {recentProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="border rounded-xl p-4 flex gap-4 items-center"
                                >
                                    <img
                                        src={product.images?.[0]}
                                        alt={product.name}
                                        className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                                    />

                                    <div className="flex-1">
                                        <p className="font-bold">
                                            {product.name}
                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            {product.category}
                                        </p>

                                        <p
                                            className={`font-bold text-sm ${Number(product.stock) <= 5
                                                ? "text-red-600"
                                                : "text-green-600"
                                                }`}
                                        >
                                            Stock: {product.stock}
                                        </p>
                                    </div>

                                    <p className="font-bold text-orange-600">
                                        ₹{product.price}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default AdminDashboard;