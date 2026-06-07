import { useState } from "react";
import { Trash2 } from "lucide-react";

const defaultCoupon = {
    code: "",
    discountType: "flat",
    discountValue: "",
    minOrder: "",
};

function AdminCoupons() {
    const savedCoupons = JSON.parse(localStorage.getItem("coupons")) || [];

    const [coupons, setCoupons] = useState(savedCoupons);
    const [form, setForm] = useState(defaultCoupon);

    const saveCoupons = (updatedCoupons) => {
        setCoupons(updatedCoupons);
        localStorage.setItem("coupons", JSON.stringify(updatedCoupons));
    };

    const addCoupon = (e) => {
        e.preventDefault();

        if (!form.code || !form.discountValue || !form.minOrder) {
            alert("Please fill all coupon details");
            return;
        }

        const newCoupon = {
            id: Date.now(),
            code: form.code.toUpperCase(),
            discountType: form.discountType,
            discountValue: Number(form.discountValue),
            minOrder: Number(form.minOrder),
        };

        saveCoupons([newCoupon, ...coupons]);
        setForm(defaultCoupon);
        alert("Coupon added successfully");
    };

    const deleteCoupon = (id) => {
        const updated = coupons.filter((item) => item.id !== id);
        saveCoupons(updated);
    };

    return (
        <section className="p-6 md:p-10">
            <h1 className="text-4xl font-bold mb-8">Coupons</h1>

            <form
                onSubmit={addCoupon}
                className="bg-white rounded-2xl shadow p-6 grid md:grid-cols-4 gap-4 mb-8"
            >
                <input
                    type="text"
                    placeholder="Coupon Code"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="border rounded-xl px-4 py-3"
                />

                <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="border rounded-xl px-4 py-3"
                >
                    <option value="flat">Flat ₹ Discount</option>
                    <option value="percent">Percentage % Discount</option>
                </select>

                <input
                    type="number"
                    placeholder="Discount Value"
                    value={form.discountValue}
                    onChange={(e) =>
                        setForm({ ...form, discountValue: e.target.value })
                    }
                    className="border rounded-xl px-4 py-3"
                />

                <input
                    type="number"
                    placeholder="Minimum Order"
                    value={form.minOrder}
                    onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                    className="border rounded-xl px-4 py-3"
                />

                <button className="md:col-span-4 bg-black text-white py-3 rounded-xl font-bold">
                    Add Coupon
                </button>
            </form>

            <div className="bg-white rounded-2xl shadow p-6">
                {coupons.length === 0 ? (
                    <p className="text-gray-500">No coupons added yet.</p>
                ) : (
                    <div className="space-y-4">
                        {coupons.map((coupon) => (
                            <div
                                key={coupon.id}
                                className="border rounded-xl p-4 flex items-center justify-between gap-4"
                            >
                                <div>
                                    <h2 className="text-xl font-bold">{coupon.code}</h2>
                                    <p className="text-gray-500">
                                        {coupon.discountType === "flat"
                                            ? `Flat ₹${coupon.discountValue} OFF`
                                            : `${coupon.discountValue}% OFF`}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Min Order: ₹{coupon.minOrder}
                                    </p>
                                </div>

                                <button
                                    onClick={() => deleteCoupon(coupon.id)}
                                    className="text-red-600"
                                >
                                    <Trash2 />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default AdminCoupons;