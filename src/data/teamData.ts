export interface TeamMember {
  role: string;
  name: string;
  studentId: string;
  avatarInitials: string;
  tag: string;
  isLead?: boolean;
  gradient: string;
  badgeStyle: string;
}

export const PROJECT_TEAM_MEMBERS: TeamMember[] = [
  {
    role: 'Team Lead',
    name: 'MUNAMA HARIESH',
    studentId: '2500090010',
    avatarInitials: 'MH',
    tag: 'Lead Architect',
    isLead: true,
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    badgeStyle: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  },
  {
    role: 'Team Member 1',
    name: 'PENTAPATI JATIN',
    studentId: '2500090006',
    avatarInitials: 'PJ',
    tag: 'Core Developer',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  {
    role: 'Team Member 2',
    name: 'CHANDRAPATI TULASI RAM',
    studentId: '2500090300',
    avatarInitials: 'CT',
    tag: 'Systems Engineer',
    gradient: 'from-sky-500 via-blue-500 to-indigo-500',
    badgeStyle: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  },
];
