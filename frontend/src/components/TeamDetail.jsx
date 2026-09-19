import { format } from "date-fns";

export default function TeamDetail({ team, actions }) {
  if (!team) {
    return <p className="text-gray-400 text-center py-4">Team details unavailable.</p>;
  }

  const isLookingForTeammates = team.lookingForTeammates;
  const isComplete = team.status === "complete";
  const memberCount = team.members?.length || 1;
  const maxMembers = team.eventId?.teamSizeMax || 4; // default to 4 if not populated

  const leader = team.leaderId?.name ? team.leaderId : null;

  return (
    <div className="space-y-6 text-[#e8d7b5]">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-white mb-2">{team.name}</h2>
          <div className="flex flex-wrap gap-2">
             {team.domain && (
                <span className="px-2 py-1 bg-purple-900/30 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase rounded">
                  Domain: {team.domain}
                </span>
             )}
             <span className={`px-2 py-1 border text-xs font-bold uppercase tracking-wide rounded ${
               isComplete 
                 ? "bg-green-900/30 text-green-400 border-green-500/30" 
                 : "bg-blue-900/30 text-blue-400 border-blue-500/30"
             }`}>
               {team.status === 'forming' ? 'Forming' : team.status === 'complete' ? 'Complete' : 'Locked'}
             </span>
             {isLookingForTeammates && !isComplete && (
                <span className="px-2 py-1 bg-yellow-900/30 border border-yellow-600/30 text-yellow-500 text-xs font-bold uppercase rounded">
                  Looking for Teammates
                </span>
             )}
          </div>
        </div>
        <div className="text-right bg-[#05070f] px-4 py-2 rounded-lg border border-[#d4af37]/20">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Members</p>
          <p className="text-xl font-bold text-white">{memberCount} / <span className="text-gray-500">{maxMembers}</span></p>
        </div>
      </div>

      {/* Team Roster */}
      <div className="bg-[#05070f] rounded-xl p-5 border border-[#d4af37]/10">
        <h4 className="text-sm uppercase tracking-widest text-[#d4af37] mb-4 font-semibold border-b border-[#d4af37]/20 pb-2">Roster</h4>
        
        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
           {/* If populated members exist */}
           {team.members && team.members.length > 0 && typeof team.members[0] === 'object' ? (
             team.members.map(member => {
               const isLeader = leader && (leader._id === member._id || leader === member._id);
               return (
                 <div key={member._id} className="flex justify-between items-center p-3 bg-[#101522] rounded-lg border border-gray-800">
                    <div>
                       <p className="font-semibold text-white flex items-center gap-2">
                         {member.name}
                         {isLeader && <span className="text-[10px] bg-[#d4af37]/20 text-[#d4af37] px-1.5 py-0.5 rounded uppercase font-bold">Leader</span>}
                       </p>
                       {(member.college || member.branch) && (
                         <p className="text-xs text-gray-500 mt-1">
                            {member.college} {member.college && member.branch && '•'} {member.branch}
                         </p>
                       )}
                    </div>
                 </div>
               )
             })
           ) : (
             <p className="text-sm text-gray-400 italic">Member details not fully populated.</p>
           )}
        </div>
      </div>

      {/* Meta Data */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-[#05070f] p-4 rounded-xl border border-[#d4af37]/10">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Created On</p>
            <p className="text-gray-300 text-sm">{team.createdAt ? format(new Date(team.createdAt), 'dd MMM yyyy') : 'Unknown'}</p>
         </div>
         {team.eventId && typeof team.eventId === 'object' && (
           <div className="bg-[#05070f] p-4 rounded-xl border border-[#d4af37]/10">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Event</p>
              <p className="text-gray-300 text-sm truncate">{team.eventId.name || 'Unknown Event'}</p>
           </div>
         )}
      </div>

      {/* Actions */}
      {actions && (
        <div className="mt-8 pt-4 border-t border-[#d4af37]/20 flex justify-end gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
