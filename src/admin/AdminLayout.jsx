import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { TicketPercent } from "lucide-react";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    LogOut,
} from "lucide-react";

function AdminLayout() {
    const navigate = useNavigate();

    const logoutAdmin = () => {
        localStorage.removeItem("isAdmin");
        navigate("/admin/login");
    };

    const links = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: <LayoutDashboard size={20} />,
        },
        {
            name: "Products",
            path: "/admin/products",
            icon: <Package size={20} />,
        },
        {
            name: "Orders",
            path: "/admin/orders",
            icon: <ShoppingBag size={20} />,
        },
        {
            name: "Customers",
            path: "/admin/customers",
            icon: <Users size={20} />,
        },

        {
            name: "Coupons",
            path: "/admin/coupons",
            icon: <TicketPercent size={20} />,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <aside className="w-64 bg-black text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-2xl font-black">
                        MBA <span className="text-orange-500">Admin</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold ${isActive
                                    ? "bg-orange-600 text-white"
                                    : "text-gray-300 hover:bg-white/10"
                                }`
                            }
                        >
                            {link.icon}
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                <button
                    onClick={logoutAdmin}
                    className="m-4 flex items-center gap-3 px-4 py-3 rounded-xl font-semibold bg-red-600"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </aside>

            <main className="flex-1">
                <div className="bg-white border-b px-4 py-4 md:hidden">
                    <h1 className="text-xl font-black">MBA Admin</h1>
                </div>

                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;