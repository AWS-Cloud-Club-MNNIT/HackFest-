import { useEffect, useState } from "react";
import API from "../services/api";

const BrowseTeammates = () => {
  const [users, setUsers] = useState([]);
  const [skill, setSkill] = useState("");
  const [branch, setBranch] = useState("");
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (skill.trim()) params.append("skill", skill.trim());
      if (branch.trim()) params.append("branch", branch.trim());
      if (college.trim()) params.append("college", college.trim());

      const response = await API.get(
        `/users/looking-for-team?${params.toString()}`
      );

      setUsers(response.data.users || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load teammates"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <section className="mt-10">

      {/* Heading */}
      <div className="mb-6">
        <p className="text-[#d4af37] text-sm tracking-widest uppercase">
          The Great Hall
        </p>

        <h2 className="text-3xl font-bold mt-2">
          Find Your Teammates
        </h2>

        <p className="text-gray-400 mt-2">
          Find fellow builders who are looking for a team.
        </p>
      </div>

      {/* Filters */}
      <form
        onSubmit={handleSearch}
        className="bg-[#101522] border border-[#d4af37]/20 rounded-2xl p-5 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Search skill..."
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none"
          />

          <input
            type="text"
            placeholder="Branch..."
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none"
          />

          <input
            type="text"
            placeholder="College..."
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none"
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-6 py-3 rounded-lg bg-[#d4af37] text-black font-semibold hover:bg-[#e6c65c] transition disabled:opacity-60"
        >
          {loading ? "Searching..." : "Find Teammates"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-center mb-6">
          {error}
        </p>
      )}

      {/* Loading */}
      {loading && users.length === 0 && (
        <p className="text-gray-400 text-center">
          Searching the Great Hall...
        </p>
      )}

      {/* Users */}
      {!loading && users.length === 0 && !error && (
        <div className="text-center py-10 bg-[#101522] rounded-2xl border border-[#d4af37]/20">
          <p className="text-gray-400">
            No wizards found looking for a team.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {users.map((user) => (
          <div
            key={user._id}
            className="bg-[#101522] border border-[#d4af37]/20 rounded-2xl p-6 hover:border-[#d4af37]/50 transition"
          >

            <h3 className="text-xl font-semibold text-[#d4af37]">
              {user.name}
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              {user.college || "College not added"}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              {user.branch || "Branch not added"}
              {user.year && ` • Year ${user.year}`}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {user.skills?.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20"
                >
                  {item}
                </span>
              ))}
            </div>

            <button
              className="w-full mt-5 py-2.5 rounded-lg border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
            >
              View Profile
            </button>

          </div>
        ))}

      </div>
    </section>
  );
};

export default BrowseTeammates;