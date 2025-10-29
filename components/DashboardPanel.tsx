import React from 'react';
import type { Lead, FAQ } from '../types';
import { LeadIcon, ChatIcon, FaqIcon } from './IconComponents';

interface DashboardPanelProps {
  leads: Lead[];
  faqs: FAQ[];
}

// Fix: Updated the icon prop type to be more specific, ensuring it accepts a className.
const StatCard: React.FC<{ icon: React.ReactElement<{ className?: string }>; title: string; value: string; description: string }> = ({ icon, title, value, description }) => (
  <div className="bg-rich-charcoal p-6 rounded-xl shadow-lg border border-gray-700 hover:border-matte-gold/80 transition-all duration-300">
    <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-platinum/70">{title}</h3>
        <div className="text-matte-gold">{React.cloneElement(icon, { className: "w-6 h-6" })}</div>
    </div>
    <p className="mt-2 text-3xl font-bold text-platinum">{value}</p>
    <p className="mt-1 text-xs text-platinum/50">{description}</p>
  </div>
);


export const DashboardPanel: React.FC<DashboardPanelProps> = ({ leads, faqs }) => {
  const totalLeads = leads.length;
  const totalFaqs = faqs.length;
  const recentLeads = [...leads].reverse().slice(0, 4);

  // Dummy data for presentation
  const totalConversations = 132;
  const satisfactionRate = 98;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-platinum">Dashboard Overview</h1>
        <p className="text-platinum/60 mt-1">Welcome back, here's a summary of your AI receptionist's activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            icon={<ChatIcon />} 
            title="Conversations" 
            value={totalConversations.toLocaleString()}
            description="+20% from last month"
        />
        <StatCard 
            icon={<LeadIcon />} 
            title="Leads Captured" 
            value={totalLeads.toLocaleString()}
            description="+15% from last month"
        />
        <StatCard 
            icon={<FaqIcon />} 
            title="Knowledge Base" 
            value={`${totalFaqs} FAQs`}
            description="Up to date"
        />
        <StatCard 
            icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            } 
            title="Satisfaction Rate" 
            value={`${satisfactionRate}%`}
            description="Based on user feedback"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-rich-charcoal p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold font-serif text-platinum mb-4">Recent Leads</h2>
            <div className="space-y-4">
                {recentLeads.length > 0 ? recentLeads.map(lead => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-midnight-blue rounded-lg">
                        <div>
                            <p className="font-semibold text-platinum">{lead.name}</p>
                            <p className="text-xs text-platinum/60">{lead.interest}</p>
                        </div>
                        <p className="text-sm text-matte-gold">{lead.email}</p>
                    </div>
                )) : (
                    <p className="text-center py-8 text-gray-500">No recent leads to display.</p>
                )}
            </div>
        </div>
        <div className="bg-rich-charcoal p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold font-serif text-platinum mb-4">Activity Chart</h2>
            <div className="w-full h-48 bg-midnight-blue rounded-lg flex items-center justify-center">
                <p className="text-platinum/50 text-sm">Analytics Chart Coming Soon</p>
            </div>
        </div>
      </div>
    </div>
  );
};