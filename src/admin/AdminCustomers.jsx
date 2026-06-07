function AdminCustomers() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const customersMap = new Map();

    orders.forEach((order) => {
        const customer = order.customer;

        if (!customer?.email) return;

        if (!customersMap.has(customer.email)) {
            customersMap.set(customer.email, {
                name: customer.name,
                email: customer.email,
                mobile: customer.mobile,
                totalOrders: 0,
                totalSpent: 0,
                addresses: [],
            });
        }

        const existingCustomer = customersMap.get(customer.email);

        existingCustomer.totalOrders += 1;
        existingCustomer.totalSpent += Number(order.total || 0);

        if (customer.address) {
            existingCustomer.addresses.push(customer.address);
        }
    });

    const customers = Array.from(customersMap.values());

    return (
        <section className="p-6 md:p-10">
            <h1 className="text-4xl font-bold mb-8">Customers</h1>

            <div className="bg-white rounded-2xl shadow p-6">
                {customers.length === 0 ? (
                    <p className="text-gray-500">No customers found.</p>
                ) : (
                    <div className="space-y-5">
                        {customers.map((customer) => (
                            <div key={customer.email} className="border rounded-2xl p-5">
                                <div className="grid md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-gray-500 text-sm">Name</p>
                                        <h2 className="font-bold text-lg">{customer.name}</h2>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">Email</p>
                                        <p className="font-semibold">{customer.email}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">Mobile</p>
                                        <p className="font-semibold">{customer.mobile}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">Total Spent</p>
                                        <p className="font-bold text-orange-600">
                                            ₹{customer.totalSpent}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 mt-5">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-gray-500 text-sm">Total Orders</p>
                                        <p className="text-2xl font-bold">
                                            {customer.totalOrders}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-gray-500 text-sm">Saved Addresses Used</p>
                                        <p className="text-2xl font-bold">
                                            {customer.addresses.length}
                                        </p>
                                    </div>
                                </div>

                                {customer.addresses.length > 0 && (
                                    <div className="mt-5">
                                        <p className="font-bold mb-3">Recent Address</p>

                                        <div className="bg-blue-50 rounded-xl p-4 text-gray-700">
                                            {customer.addresses[0].address},{" "}
                                            {customer.addresses[0].locality},{" "}
                                            {customer.addresses[0].city},{" "}
                                            {customer.addresses[0].state} -{" "}
                                            {customer.addresses[0].pincode}
                                        </div>
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

export default AdminCustomers;