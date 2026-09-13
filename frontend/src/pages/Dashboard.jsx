import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import BrowseTeammates from "../components/BrowseTeammates";
import DashboardNavbar from "../components/DashboardNavbar";
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await API.get("/auth/me");
        const fetchedUser = response.data.user;
        setUser(fetchedUser);

        if (fetchedUser?.role === "super_admin") {
          navigate("/super_admin");
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    getUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080b16] text-[#d4af37] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b16] text-[#e8d7b5]">

      <DashboardNavbar user={user} />

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-12">

        <div className="mb-10">
          <p className="text-[#d4af37] text-sm tracking-widest uppercase">
            Welcome, Wizard
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {user.name}
          </h2>

          <p className="text-gray-400 mt-2">
            Your HackFest journey begins here.
          </p>
        </div>

        {/* Profile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="md:col-span-2 bg-[#101522] border border-[#d4af37]/20 rounded-2xl p-6">

            <h3 className="text-xl font-semibold text-[#d4af37] mb-6">
              Your Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div>
                <p className="text-gray-500 text-sm">
                  Name
                </p>
                <p className="mt-1">
                  {user.name}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Email
                </p>
                <p className="mt-1">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  College
                </p>
                <p className="mt-1">
                  {user.college || "Not added"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Branch
                </p>
                <p className="mt-1">
                  {user.branch || "Not added"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Year
                </p>
                <p className="mt-1">
                  {user.year ? `Year ${user.year}` : "Not added"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Team Status
                </p>
                <p className="mt-1 text-[#d4af37]">
                  {user.teamId
                    ? "Team Assigned"
                    : "Looking for Team"}
                </p>
              </div>

            </div>

          </div>

          {/* Role */}
          <div className="bg-[#101522] border border-[#d4af37]/20 rounded-2xl p-6">

            <h3 className="text-xl font-semibold text-[#d4af37]">
              Your Status
            </h3>

            <div className="mt-8">

              <p className="text-gray-500 text-sm">
                Account Type
              </p>

              <p className="text-lg mt-2 capitalize">
                {user.role === "super_admin"
                  ? "Super Admin"
                  : "Participant"}
              </p>

            </div>

            <div className="mt-8">

              <p className="text-gray-500 text-sm">
                Team
              </p>

              <p className="text-lg mt-2">
                {user.teamId
                  ? "Team Assigned"
                  : "No Team Yet"}
              </p>

            </div>

          </div>

        </div>

        {/* Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">

          <button
            onClick={() => {
              const el = document.getElementById("browse-teammates");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              else navigate("/browse-teammates");
            }}
            className="bg-[#101522] border border-[#d4af37]/20 rounded-xl p-5 text-left hover:border-[#d4af37]/60 transition cursor-pointer"
          >
            <h3 className="text-[#d4af37] font-semibold">
              Find Teammates
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              Browse participants looking for a team.
            </p>
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="bg-[#101522] border border-[#d4af37]/20 rounded-xl p-5 text-left hover:border-[#d4af37]/60 transition"
          >
            <h3 className="text-[#d4af37] font-semibold">
              Edit Profile
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              Update your details and skills.
            </p>
          </button>

          <button
            onClick={() => navigate("/team/my-team")}
            className="bg-[#101522] border border-[#d4af37]/20 rounded-xl p-5 text-left hover:border-[#d4af37]/60 transition"
          >
            <h3 className="text-[#d4af37] font-semibold">
              {user.teamId ? "My Team" : "Create / Join Team"}
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              {user.teamId ? "Manage your team and view QR Pass." : "Form your guild and enter the HackFest."}
            </p>
          </button>

        </div>

        {/* Teammates Section */}
        <div id="browse-teammates" className="mt-12 border-t border-[#d4af37]/20 pt-8">
          <BrowseTeammates />
        </div>

      </main>
    </div>
  );
};

export default Dashboard;