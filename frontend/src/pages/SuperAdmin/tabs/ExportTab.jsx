import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../../services/api";

const downloadBlob = (blobData, filename) => {
  const url = window.URL.createObjectURL(new Blob([blobData]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const ExportTab = () => {
  const [downloading, setDownloading] = useState(null);

  const handleExport = async (type) => {
    setDownloading(type);
    try {
      const res = await API.get(`/super-admin/export/${type}`, {
        responseType: "blob",
      });
      downloadBlob(res.data, `${type}-export.csv`);
      toast.success(`${type === "users" ? "Users" : "Teams"} exported`);
    } catch (err) {
      toast.error(`Failed to export ${type}`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-[#d4af37] mb-6">Export Data</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        <div className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl p-6">
          <h4 className="font-semibold text-white">Users CSV</h4>
          <p className="text-sm text-gray-400 mt-1 mb-4">
            All registered users — name, email, college, branch, year, role,
            skills, and block status.
          </p>
          <button
            onClick={() => handleExport("users")}
            disabled={downloading === "users"}
            className="px-4 py-2 bg-[#d4af37] text-black rounded-lg text-sm font-bold hover:bg-[#e8c869] transition disabled:opacity-50"
          >
            {downloading === "users" ? "Exporting…" : "Download users.csv"}
          </button>
        </div>

        <div className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl p-6">
          <h4 className="font-semibold text-white">Teams CSV</h4>
          <p className="text-sm text-gray-400 mt-1 mb-4">
            All teams — event, leader, member count, domain, status, and
            check-in state.
          </p>
          <button
            onClick={() => handleExport("teams")}
            disabled={downloading === "teams"}
            className="px-4 py-2 bg-[#d4af37] text-black rounded-lg text-sm font-bold hover:bg-[#e8c869] transition disabled:opacity-50"
          >
            {downloading === "teams" ? "Exporting…" : "Download teams.csv"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportTab;
