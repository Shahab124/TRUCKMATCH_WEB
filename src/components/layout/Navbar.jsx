import { Link, useNavigate } from "react-router-dom";
import { Truck, Plus, LogOut } from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link to="/loads" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <Truck className="w-6 h-6 text-emerald-600" />
          <span className="text-lg font-bold tracking-tight text-slate-900">TruckMatch</span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-2 mr-1">
              <span className="text-sm font-semibold text-slate-700">{user.name}</span>
              <Badge text={user.role} color="slate" />
            </div>
          )}

          <Link to="/loads/new">
            <Button>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Post a Load</span>
            </Button>
          </Link>

          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </nav>
  );
}