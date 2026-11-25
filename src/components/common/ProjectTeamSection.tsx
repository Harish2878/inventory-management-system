import React, { useState } from 'react';
import { PROJECT_TEAM_MEMBERS, TeamMember } from '../../data/teamData';
import {
  Users,
  Award,
  Crown,
  IdCard,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

export const ProjectTeamSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)] shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white m-0">
                Project Team Members
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 whitespace-nowrap shrink-0">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Core Contributors</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              Academic development and architecture team for the AuraStock Inventory Platform
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium hidden md:block whitespace-nowrap shrink-0">
          3 Verified Contributors
        </div>
      </div>

      {/* Responsive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {PROJECT_TEAM_MEMBERS.map((member: TeamMember) => {
          const isCopied = copiedId === member.studentId;

          return (
            <div
              key={member.studentId}
              className="p-5 sm:p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between group hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden shadow-xl"
            >
              <div>
                {/* Top Role Badge & Status */}
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border whitespace-nowrap ${member.badgeStyle}`}
                  >
                    {member.isLead ? (
                      <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <Award className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                    <span>{member.role}</span>
                  </span>

                  <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
                    {member.tag}
                  </span>
                </div>

                {/* Profile Avatar & Member Info */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="relative shrink-0">
                    <div
                      className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${member.gradient} p-[2px] shadow-[0_0_20px_rgba(99,102,241,0.35)] group-hover:scale-105 transition-transform`}
                    >
                      <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center">
                        <span className="font-black text-sm sm:text-base tracking-wider bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                          {member.avatarInitials}
                        </span>
                      </div>
                    </div>
                    {member.isLead && (
                      <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                        <Crown className="w-2.5 h-2.5 fill-slate-950" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug group-hover:text-indigo-300 transition-colors truncate">
                      {member.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                      {member.isLead ? 'Project Leadership' : 'Engineering Lead'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Student ID Card Block */}
              <div className="mt-4 pt-3.5 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <IdCard className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Student ID Number</span>
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">Reg Number</span>
                </div>

                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 group-hover:border-indigo-500/30 transition-all">
                  <span className="font-mono font-bold text-xs sm:text-sm text-indigo-200 tracking-wider">
                    {member.studentId}
                  </span>

                  <button
                    onClick={() => handleCopy(member.studentId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 text-[11px] shrink-0"
                    title="Copy Student ID"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-slate-400">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Accent colored bottom glow bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${member.gradient} opacity-80`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
