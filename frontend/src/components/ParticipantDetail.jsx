import { format } from "date-fns";

export default function ParticipantDetail({ participant, actions }) {
  if (!participant) {
    return <p className="text-gray-400 text-center py-4">Participant details unavailable.</p>;
  }

  const isLookingForTeam = participant.lookingForTeam;
  const isAssigned = !!participant.teamId;

  return (
    <div className="space-y-6 text-[#e8d7b5]">
      {/* Header Info */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-[#10182b] border border-[#d4af37]/40 flex items-center justify-center font-bold text-[#d4af37] text-2xl flex-shrink-0">
          {participant.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{participant.name}</h2>
          <p className="text-[#d4af37] text-sm uppercase tracking-wider mb-2">
            {participant.college || "No College Listed"}
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
             <span className={`px-2 py-1 rounded-md border font-semibold ${
               isAssigned 
                 ? "bg-green-900/30 text-green-400 border-green-500/30"
                 : isLookingForTeam 
                   ? "bg-blue-900/30 text-blue-400 border-blue-500/30" 
                   : "bg-gray-800 text-gray-400 border-gray-600"
             }`}>
               {isAssigned ? "Assigned to a Team" : isLookingForTeam ? "Looking for Teammates" : "Not Looking"}
             </span>
             {participant.branch && (
                <span className="px-2 py-1 bg-[#10182b] border border-gray-700 text-gray-300 rounded-md">
                  Branch: {participant.branch}
                </span>
             )}
             {participant.year && (
                <span className="px-2 py-1 bg-[#10182b] border border-gray-700 text-gray-300 rounded-md">
                  Year {participant.year}
                </span>
             )}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-[#05070f] rounded-xl p-5 border border-[#d4af37]/10">
        <h4 className="text-sm uppercase tracking-widest text-gray-400 mb-3 font-semibold">Skills</h4>
        {participant.skills && participant.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {participant.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 text-sm bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm">No skills added yet.</p>
        )}
      </div>

      {/* Additional Stats */}
      <div className="bg-[#05070f] rounded-xl p-5 border border-[#d4af37]/10 grid grid-cols-2 gap-4 text-sm">
         <div>
            <p className="text-gray-500 uppercase tracking-wider text-xs mb-1">Joined Platform</p>
            <p className="text-gray-300">{participant.createdAt ? format(new Date(participant.createdAt), 'dd MMM yyyy') : 'Unknown'}</p>
         </div>
      </div>

      {/* Actions (if any) */}
      {actions && (
        <div className="mt-8 pt-4 border-t border-[#d4af37]/20 flex justify-end gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
