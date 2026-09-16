
import { useEffect, useState } from "react";
import API from "../../../services/api";

function ActivityLogsTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/activity-logs");

      setLogs(response.data.logs || []);
    } catch (error) {
      console.error("Fetch activity logs error:", error);
      setError("Unable to load activity logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#c9a646]">
            Administration
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#e9dcbd]">
            Activity Logs
          </h2>

          <p className="mt-2 text-sm text-[#758197]">
            Track actions performed by Super Administrators.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="rounded-xl border border-[#c9a646]/30 px-4 py-2 text-sm text-[#d8bd68] transition hover:bg-[#c9a646]/10"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Logs */}
      <div className="overflow-x-auto rounded-2xl border border-[#c9a646]/15 bg-[#0c1322]/80">
        {loading ? (
          <div className="p-12 text-center text-sm text-[#78849a]">
            Loading activity logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl opacity-40">📜</div>

            <p className="mt-4 text-sm text-[#aab3c2]">
              No activity logs found.
            </p>

            <p className="mt-1 text-xs text-[#68748a]">
              Logs will appear after admin actions are recorded.
            </p>
          </div>
        ) : (
          <table className="min-w-full text-left">
            <thead className="border-b border-white/10 bg-white/[0.02]">
              <tr>
                <th className="px-5 py-4 text-xs uppercase tracking-wider text-[#c9a646]">
                  Date
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-wider text-[#c9a646]">
                  Admin
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-wider text-[#c9a646]">
                  Action
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-wider text-[#c9a646]">
                  Target
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-wider text-[#c9a646]">
                  Description
                </th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr
                  key={log._id}
                  className="border-b border-white/[0.05] transition hover:bg-white/[0.02]"
                >
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-[#8994a8]">
                    {formatDate(log.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-[#dce2eb]">
                      {log.adminId?.name || "Unknown"}
                    </p>

                    <p className="mt-1 text-xs text-[#68748a]">
                      {log.adminId?.email || "—"}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="rounded-full border border-[#c9a646]/20 bg-[#c9a646]/10 px-3 py-1 text-[10px] font-bold text-[#d8bd68]">
                      {log.action}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs text-[#9da8bd]">
                    {log.targetType}
                  </td>

                  <td className="min-w-[240px] px-5 py-4 text-sm text-[#aab3c2]">
                    {log.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ActivityLogsTab;