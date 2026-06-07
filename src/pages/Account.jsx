import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const states = [
  "Rajasthan",
  "Madhya Pradesh",
  "Gujarat",
  "Maharashtra",
  "Delhi",
  "Uttar Pradesh",
  "Haryana",
  "Punjab",
];

function Account() {

  const updateOrderStatus = (orderId, newStatus) => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    );

    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    window.location.reload();
  };

  const cancelOrder = (order) => {
    if (order.status === "Shipped" || order.status === "Delivered") {
      alert("Order shipped hone ke baad cancel nahi ho sakta");
      return;
    }

    if (!confirm("Are you sure you want to cancel this order?")) return;

    updateOrderStatus(order.id, "Cancelled");
  };

  const requestReturn = (order) => {
    if (order.status !== "Delivered") {
      alert("Return sirf delivered order par available hai");
      return;
    }

    if (!confirm("Do you want to request return?")) return;

    updateOrderStatus(order.id, "Return Requested");
  };
  const { currentUser } = useAuth();

  const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {
    firstName: "Ashish",
    lastName: "Koted",
    gender: "",
    mobile: "",
  };

  const savedAddresses = JSON.parse(localStorage.getItem("userAddresses")) || [];

  const [profile, setProfile] = useState(savedProfile);
  const [addresses, setAddresses] = useState(savedAddresses);
  const [editProfile, setEditProfile] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [addressForm, setAddressForm] = useState({
    name: "",
    mobile: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    alternatePhone: "",
    type: "Home",
  });

  if (!currentUser) return <Navigate to="/login" />;

  const saveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setEditProfile(false);
    alert("Profile saved");
  };

  const saveAddress = () => {
    if (
      !addressForm.name ||
      !addressForm.mobile ||
      !addressForm.pincode ||
      !addressForm.locality ||
      !addressForm.address ||
      !addressForm.city ||
      !addressForm.state
    ) {
      alert("Please fill required address details");
      return;
    }

    const updated = [{ id: Date.now(), ...addressForm }, ...addresses];
    setAddresses(updated);
    localStorage.setItem("userAddresses", JSON.stringify(updated));

    setAddressForm({
      name: "",
      mobile: "",
      pincode: "",
      locality: "",
      address: "",
      city: "",
      state: "",
      landmark: "",
      alternatePhone: "",
      type: "Home",
    });

    setShowAddressForm(false);
  };

  const deleteAddress = (id) => {
    const updated = addresses.filter((item) => item.id !== id);
    setAddresses(updated);
    localStorage.setItem("userAddresses", JSON.stringify(updated));
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8">My Account</h1>

      <section className="card rounded-2xl shadow p-6 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Personal Information</h2>

          {!editProfile && (
            <button
              onClick={() => setEditProfile(true)}
              className="text-blue-600 font-bold flex items-center gap-1"
            >
              <Edit size={16} /> Edit
            </button>
          )}
        </div>

        {!editProfile ? (
          <div className="space-y-6">
            <div>
              <p className="muted text-sm">Name</p>
              <p className="font-bold text-lg">
                {profile.firstName || "Not added"} {profile.lastName}
              </p>
            </div>

            <div>
              <p className="muted text-sm">Gender</p>
              <p className="font-bold">{profile.gender || "Not added"}</p>
            </div>

            <div>
              <p className="muted text-sm">Email Address</p>
              <p className="font-bold">{currentUser.email}</p>
            </div>

            <div>
              <p className="muted text-sm">Mobile Number</p>
              <p className="font-bold">{profile.mobile || "Not added"}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                value={profile.firstName}
                placeholder="First Name"
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
                className="input"
              />

              <input
                value={profile.lastName}
                placeholder="Last Name"
                onChange={(e) =>
                  setProfile({ ...profile, lastName: e.target.value })
                }
                className="input"
              />
            </div>

            <div className="mt-5">
              <p className="font-semibold mb-3">Your Gender</p>
              <div className="flex gap-6">
                {["Male", "Female"].map((gender) => (
                  <label key={gender} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={profile.gender === gender}
                      onChange={() => setProfile({ ...profile, gender })}
                    />
                    {gender}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <input
                value={currentUser.email}
                disabled
                className="input bg-gray-100"
              />

              <input
                value={profile.mobile}
                placeholder="Mobile Number"
                onChange={(e) =>
                  setProfile({ ...profile, mobile: e.target.value })
                }
                className="input"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={saveProfile}
                className="bg-black text-white px-8 py-3 rounded-xl font-bold"
              >
                Save
              </button>

              <button
                onClick={() => setEditProfile(false)}
                className="border px-8 py-3 rounded-xl font-bold"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </section>

      <section className="card rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-5">Manage Addresses</h2>

        {!showAddressForm && (
          <button
            onClick={() => setShowAddressForm(true)}
            className="text-blue-600 font-bold mb-6"
          >
            + ADD A NEW ADDRESS
          </button>
        )}

        {showAddressForm && (
          <div className="bg-blue-50 border rounded-2xl p-5 mb-6">
            <button className="bg-blue-600 text-white px-6 py-3 rounded font-bold mb-5">
              Use my current location
            </button>

            <div className="grid md:grid-cols-2 gap-4">
              <input placeholder="Name" className="border px-4 py-3 rounded" onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} />
              <input placeholder="10-digit mobile number" className="border px-4 py-3 rounded" onChange={(e) => setAddressForm({ ...addressForm, mobile: e.target.value })} />
              <input placeholder="Pincode" className="border px-4 py-3 rounded" onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} />
              <input placeholder="Locality" className="border px-4 py-3 rounded" onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })} />
            </div>

            <textarea
              rows="4"
              placeholder="Address (Area and Street)"
              className="w-full border px-4 py-3 rounded mt-4"
              onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
            />

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <input placeholder="City/District/Town" className="border px-4 py-3 rounded" onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} />

              <select className="border px-4 py-3 rounded" onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}>
                <option value="">--Select State--</option>
                {states.map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </select>

              <input placeholder="Landmark (Optional)" className="border px-4 py-3 rounded" onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })} />
              <input placeholder="Alternate Phone (Optional)" className="border px-4 py-3 rounded" onChange={(e) => setAddressForm({ ...addressForm, alternatePhone: e.target.value })} />
            </div>

            <div className="mt-5">
              <p className="text-sm text-gray-600 mb-3">Address Type</p>
              <div className="flex gap-8">
                {["Home", "Work"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={addressForm.type === type}
                      onChange={() => setAddressForm({ ...addressForm, type })}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-6 mt-6">
              <button
                onClick={saveAddress}
                className="bg-blue-600 text-white px-14 py-3 rounded font-bold"
              >
                SAVE
              </button>

              <button
                onClick={() => setShowAddressForm(false)}
                className="text-blue-600 font-bold"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {addresses.length === 0 ? (
            <p className="muted">No saved address.</p>
          ) : (
            addresses.map((item) => (
              <div key={item.id} className="border rounded-xl p-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <div className="flex gap-3 items-center">
                      <span className="bg-gray-100 px-3 py-1 rounded text-xs font-bold">
                        {item.type}
                      </span>
                      <p className="font-bold">{item.name}</p>
                      <p className="font-bold">{item.mobile}</p>
                    </div>

                    <p className="text-gray-600 mt-3">
                      {item.address}, {item.locality}, {item.city}, {item.state} -{" "}
                      {item.pincode}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteAddress(item.id)}
                    className="text-red-600"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>


      <section className="card rounded-2xl shadow p-6 mt-8">
        <h2 className="text-2xl font-bold mb-5">Your Orders</h2>

        {(JSON.parse(localStorage.getItem("orders")) || []).length === 0 ? (
          <p className="muted">No orders yet.</p>
        ) : (
          <div className="space-y-5">
            {(JSON.parse(localStorage.getItem("orders")) || []).map((order) => (
              <div key={order.id} className="border rounded-2xl p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <div>
                    <p className="font-bold">Order ID: {order.id}</p>
                    <p className="muted text-sm">{order.date}</p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="font-bold text-orange-600">₹{order.total}</p>

                    {order.discount > 0 && (
                      <p className="text-green-600 text-sm font-semibold">
                        Saved ₹{order.discount} {order.coupon ? `with ${order.coupon}` : ""}
                      </p>
                    )}

                    <p className="text-green-600 font-semibold">{order.status}</p>

                    <p className="text-sm font-semibold">
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


                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="flex gap-4 bg-gray-50 rounded-xl p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm muted">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="text-sm">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() => (window.location.href = `/track-order/${order.id}`)}
                    className="bg-black text-white px-6 py-2 rounded-xl font-bold"
                  >
                    Track Order
                  </button>

                  {(order.status === "Order Placed" || order.status === "Packed") && (
                    <button
                      onClick={() => cancelOrder(order)}
                      className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold"
                    >
                      Cancel Order
                    </button>
                  )}

                  {order.status === "Delivered" && (
                    <button
                      onClick={() => requestReturn(order)}
                      className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold"
                    >
                      Return Order
                    </button>
                  )}

                  {order.status === "Cancelled" && (
                    <span className="px-6 py-2 rounded-xl bg-red-50 text-red-600 font-bold">
                      Order Cancelled
                    </span>
                  )}

                  {order.status === "Return Requested" && (
                    <span className="px-6 py-2 rounded-xl bg-orange-50 text-orange-600 font-bold">
                      Return Requested
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>



    </main>
  );
}

export default Account;