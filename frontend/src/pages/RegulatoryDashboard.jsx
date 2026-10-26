import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EnterpriseLayout from '../components/EnterpriseLayout';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell 
} from 'recharts';
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  UserCheck, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Eye, 
  Filter,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Building2
} from 'lucide-react';

export default function RegulatoryDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pipelinePeriod, setPipelinePeriod] = useState('Last 6 Months');
  const [compliancePeriod, setCompliancePeriod] = useState('This Year');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, aRes] = await Promise.all([
        api.getDashboardMetrics().catch(() => null),
        api.getApplications().catch(() => ({ data: [] }))
      ]);
      if (mRes && mRes.data) {
        setMetrics(mRes.data);
      }
      if (aRes && aRes.data) {
        setApplications(aRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Pipeline Bar Chart data in Glassmorphism (Soft Lime accent)
  const pipelineData = [
    { name: 'Submitted', count: 420 },
    { name: 'Validation', count: 280 },
    { name: 'Scrutiny', count: 186 },
    { name: 'Clarification', count: 120 },
    { name: 'EVC', count: 75 },
    { name: 'Decision', count: 167 },
  ];

  // Compliance Health Donut Chart data (Soft Lime, Cool Silver, Charcoal, Soft Alert)
  const complianceData = [
    { name: 'Verified', value: 612, color: '#B9F56B' },
    { name: 'Pending', value: 210, color: '#C8CBD2' },
    { name: 'Overdue', value: 96, color: '#FB7185' },
    { name: 'Rejected', value: 36, color: '#64748B' },
  ];

  // Priority Queue rows
  const priorityQueue = [
    {
      id: 'APP2025-001',
      institution: 'ABC Engineering College',
      stage: 'Scrutiny',
      officer: 'R. Sharma',
      daysPending: 12,
      deadline: '15 Aug 2025',
      status: 'Pending',
      statusBadge: 'bg-white/[0.06] text-[#C8CBD2] border-white/20'
    },
    {
      id: 'APP2025-002',
      institution: 'XYZ Institute of Technology',
      stage: 'Clarification',
      officer: 'P. Verma',
      daysPending: 18,
      deadline: '10 Aug 2025',
      status: 'Overdue',
      statusBadge: 'bg-[#FB7185]/15 text-[#FB7185] border-[#FB7185]/30'
    },
    {
      id: 'APP2025-003',
      institution: 'Global Tech University',
      stage: 'EVC',
      officer: 'S. Khan',
      daysPending: 5,
      deadline: '22 Aug 2025',
      status: 'In Progress',
      statusBadge: 'bg-[#B9F56B]/15 text-[#B9F56B] border-[#B9F56B]/30'
    },
    {
      id: 'APP2025-004',
      institution: 'Sunrise Engineering',
      stage: 'Validation',
      officer: 'A. Mehta',
      daysPending: 3,
      deadline: '25 Aug 2025',
      status: 'Pending',
      statusBadge: 'bg-white/[0.06] text-[#C8CBD2] border-white/20'
    }
  ];

  // Recent Activity matching Panel 4
  const recentActivities = [
    {
      title: 'New application submitted',
      institution: 'ABC Engineering College',
      time: '2 min ago',
      color: '#B9F56B'
    },
    {
      title: 'Clarification submitted',
      institution: 'XYZ Institute of Technology',
      time: '18 min ago',
      color: '#C8CBD2'
    },
    {
      title: 'EVC scheduled',
      institution: 'Global Tech University',
      time: '1 hour ago',
      color: '#B9F56B'
    },
    {
      title: 'Compliance verified',
      institution: 'Sunrise Engineering',
      time: '2 hours ago',
      color: '#C8CBD2'
    }
  ];

  return (
    <EnterpriseLayout activeSection="dashboard">
      <div className="space-y-6">
        
        {/* KPI Cards Row (6 Floating Translucent Glass Panels) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          
          {/* Card 1: Total Applications */}
          <div className="p-4 rounded-3xl glass-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A5A5AD]">Total Applications</span>
              <FileText className="w-4 h-4 text-[#B9F56B]" />
            </div>
            <div className="text-2xl font-bold text-[#F5F5F5] font-mono">1,248</div>
            <div className="flex items-center gap-1 text-[11px] text-[#B9F56B]">
              <TrendingUp className="w-3 h-3" />
              <span>+12% from last month</span>
            </div>
          </div>

          {/* Card 2: Pending */}
          <div className="p-4 rounded-3xl glass-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A5A5AD]">Pending</span>
              <Clock className="w-4 h-4 text-[#C8CBD2]" />
            </div>
            <div className="text-2xl font-bold text-[#F5F5F5] font-mono">342</div>
            <div className="flex items-center gap-1 text-[11px] text-[#A5A5AD]">
              <TrendingDown className="w-3 h-3" />
              <span>-8% from last month</span>
            </div>
          </div>

          {/* Card 3: Under Scrutiny */}
          <div className="p-4 rounded-3xl glass-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A5A5AD]">Under Scrutiny</span>
              <UserCheck className="w-4 h-4 text-[#B9F56B]" />
            </div>
            <div className="text-2xl font-bold text-[#F5F5F5] font-mono">186</div>
            <div className="flex items-center gap-1 text-[11px] text-[#B9F56B]">
              <TrendingUp className="w-3 h-3" />
              <span>+5% from last month</span>
            </div>
          </div>

          {/* Card 4: Awaiting EVC */}
          <div className="p-4 rounded-3xl glass-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A5A5AD]">Awaiting EVC</span>
              <Calendar className="w-4 h-4 text-[#C8CBD2]" />
            </div>
            <div className="text-2xl font-bold text-[#F5F5F5] font-mono">75</div>
            <div className="flex items-center gap-1 text-[11px] text-[#B9F56B]">
              <TrendingUp className="w-3 h-3" />
              <span>+3% from last month</span>
            </div>
          </div>

          {/* Card 5: Compliance Overdue */}
          <div className="p-4 rounded-3xl glass-card space-y-2 border-[#FB7185]/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A5A5AD]">Compliance Overdue</span>
              <AlertTriangle className="w-4 h-4 text-[#FB7185]" />
            </div>
            <div className="text-2xl font-bold text-[#FB7185] font-mono">96</div>
            <div className="flex items-center gap-1 text-[11px] text-[#FB7185]">
              <TrendingUp className="w-3 h-3" />
              <span>+18% from last month</span>
            </div>
          </div>

          {/* Card 6: Approaching Deadlines */}
          <div className="p-4 rounded-3xl glass-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A5A5AD]">Approaching Deadlines</span>
              <Clock className="w-4 h-4 text-[#C8CBD2]" />
            </div>
            <div className="text-2xl font-bold text-[#F5F5F5] font-mono">210</div>
            <div className="flex items-center gap-1 text-[11px] text-[#C8CBD2]">
              <TrendingUp className="w-3 h-3" />
              <span>+10% from last month</span>
            </div>
          </div>

        </div>

        {/* Charts Row (Application Pipeline & Compliance Health) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Application Pipeline (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl glass-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#F5F5F5]">Application Pipeline</h3>
              <select
                value={pipelinePeriod}
                onChange={(e) => setPipelinePeriod(e.target.value)}
                className="bg-white/[0.05] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-[#C8CBD2] focus:outline-none"
              >
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="This Year">This Year</option>
                <option value="All Time">All Time</option>
              </select>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} barSize={34}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111215', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '14px', fontSize: '11px', color: '#F5F5F5' }}
                    itemStyle={{ color: '#B9F56B' }}
                  />
                  <Bar dataKey="count" fill="#B9F56B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance Health Donut Chart (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl glass-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#F5F5F5]">Compliance Health</h3>
              <select
                value={compliancePeriod}
                onChange={(e) => setCompliancePeriod(e.target.value)}
                className="bg-white/[0.05] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-[#C8CBD2] focus:outline-none"
              >
                <option value="This Year">This Year</option>
                <option value="Last Year">Last Year</option>
              </select>
            </div>

            <div className="flex items-center justify-between gap-4 mt-2">
              {/* Donut with center total */}
              <div className="relative w-44 h-44 shrink-0 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complianceData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                    >
                      {complianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111215', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-[#A5A5AD] uppercase font-mono">Total</span>
                  <span className="text-base font-bold text-[#F5F5F5] font-mono">1,024</span>
                </div>
              </div>

              {/* Legend stats */}
              <div className="space-y-2.5 text-xs flex-1">
                {complianceData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-[#A5A5AD]">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-[#F5F5F5]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Row: Priority Queue & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Priority Queue (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-3xl glass-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-[#F5F5F5]">Priority Queue</h3>
              <Link to="/applications/APP2025-001" className="text-xs text-[#B9F56B] hover:underline font-medium">
                View All
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#A5A5AD] uppercase text-[10px] font-mono tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-3">Application ID</th>
                    <th className="py-2.5 px-3">Institution</th>
                    <th className="py-2.5 px-3">Stage</th>
                    <th className="py-2.5 px-3">Assigned Officer</th>
                    <th className="py-2.5 px-3">Days Pending</th>
                    <th className="py-2.5 px-3">Deadline</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {priorityQueue.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => navigate(`/applications/${item.id}`)}
                      className="hover:bg-white/[0.04] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3 font-mono font-semibold text-[#B9F56B]">
                        {item.id}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#F5F5F5]">
                        {item.institution}
                      </td>
                      <td className="py-3 px-3 text-[#A5A5AD]">
                        {item.stage}
                      </td>
                      <td className="py-3 px-3 text-[#F5F5F5]">
                        {item.officer}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#F5F5F5]">
                        {item.daysPending}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#A5A5AD]">
                        {item.deadline}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${item.statusBadge}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity Feed (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-3xl glass-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-[#F5F5F5]">Recent Activity</h3>
              <Link to="/audit-trail" className="text-xs text-[#B9F56B] hover:underline font-medium">
                View All
              </Link>
            </div>

            <div className="space-y-3.5">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div 
                    className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" 
                    style={{ backgroundColor: act.color }}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-[#F5F5F5]">{act.title}</div>
                    <div className="text-[11px] text-[#A5A5AD]">{act.institution}</div>
                  </div>
                  <span className="text-[10px] text-[#A5A5AD] font-mono whitespace-nowrap">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </EnterpriseLayout>
  );
}
