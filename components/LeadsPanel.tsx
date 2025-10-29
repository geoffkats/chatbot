import React from 'react';
import type { Lead } from '../types';

interface LeadsPanelProps {
  leads: Lead[];
}

export const LeadsPanel: React.FC<LeadsPanelProps> = ({ leads }) => {
  return (
    <div className="bg-rich-charcoal p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-platinum font-serif">Collected Leads</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-platinum/70 uppercase bg-midnight-blue">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Phone</th>
              <th scope="col" className="px-6 py-3">Interest</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="bg-rich-charcoal border-b border-gray-700 hover:bg-midnight-blue">
                <td className="px-6 py-4 font-medium text-platinum whitespace-nowrap">{lead.name}</td>
                <td className="px-6 py-4">{lead.email}</td>
                <td className="px-6 py-4">{lead.phone}</td>
                <td className="px-6 py-4">{lead.interest}</td>
              </tr>
            ))}
             {leads.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">No leads collected yet.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};