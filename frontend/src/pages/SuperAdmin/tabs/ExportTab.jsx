
import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../../services/api";

const downloadBlob = (blobData, filename) => {
  const url = window.URL.createObjectURL(blobData);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
};

const ExportTab = () => {
  const [downloading, setDownloading] = useState(null);
  const [lastExport, setLastExport] = useState(null);

  const handleExport = async (type) => {
    setDownloading(type);

    try {
      const response = await API.get(`/super-admin/export/${type}`, {
        responseType: "blob",
      });

      const filename = `${type}-export-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

      downloadBlob(response.data, filename);

      const exportName = type === "users" ? "Users" : "Teams";

      setLastExport({
        type: exportName,
        time: new Date().toLocaleTimeString(),
      });

      toast.success(`${exportName} exported successfully`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error(`Failed to export ${type}`);
    } finally {
      setDownloading(null);
    }
  };

  const exportCards = [
    {
      type: "users",
      title: "Users CSV",
      icon: "👥",
      description:
        "Export registered users including name, email, college, branch, year, role, skills, and block status.",
      filename: "users-export.csv",
    },
    {
      type: "teams",
      title: "Teams CSV",
      icon: "🛡️",
      description:
        "Export teams including event, leader, member count, domain, status, and check-in state.",
      filename: "teams-export.csv",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-[#d4af37]">
          Export Management
        </h3>

        <p className="text-sm text-gray-400 mt-1">
          Download platform data in CSV format for analysis and record keeping.
        </p>
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {exportCards.map((card) => (
          <div
            key={card.type}
            className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl p-6 hover:border-[#d4af37]/70 transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">{card.icon}</div>

              <h4 className="font-semibold text-white text-lg">
                {card.title}
              </h4>
            </div>

            <p className="text-sm text-gray-400 min-h-[72px]">
              {card.description}
            </p>

            <button
              onClick={() => handleExport(card.type)}
              disabled={downloading !== null}
              className="mt-5 px-4 py-2 bg-[#d4af37] text-black rounded-lg text-sm font-bold hover:bg-[#e8c869] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading === card.type
                ? "Exporting..."
                : `Download ${card.filename}`}
            </button>
          </div>
        ))}
      </div>

      {/* Export Status */}
      {lastExport && (
        <div className="max-w-4xl bg-green-900/20 border border-green-500/30 rounded-xl p-4">
          <p className="text-sm text-green-400">
            ✓ Last export:{" "}
            <span className="font-semibold">{lastExport.type}</span>
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Downloaded at {lastExport.time}
          </p>
        </div>
      )}

      {/* Information */}
      <div className="max-w-4xl bg-[#101522] border border-white/10 rounded-xl p-4">
        <p className="text-xs text-gray-400">
          <span className="text-[#d4af37] font-semibold">Note:</span>{" "}
          Exported files contain data returned by the backend. Make sure
          downloaded CSV files are stored securely.
        </p>
      </div>
    </div>
  );
};

export default ExportTab;