import React, { useState } from 'react';
import { ChatPanel } from './components/ChatPanel';
import { LeadsPanel } from './components/LeadsPanel';
import { FaqPanel } from './components/FaqPanel';
import { Header } from './components/Header';
import { ChatIcon, LeadIcon, FaqIcon, BillingIcon, DashboardIcon } from './components/IconComponents';
import type { Lead, FAQ } from './types';
import { BillingPanel } from './components/BillingPanel';
import { DashboardPanel } from './components/DashboardPanel';

type Tab = 'dashboard' | 'chat' | 'leads' | 'faq' | 'billing';
export type Language = 'en' | 'es' | 'fr' | 'de';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', interest: 'Web Design Package' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321', interest: 'SEO Services' },
  ]);

  const [faqs, setFaqs] = useState<FAQ[]>([
    { id: 'faq1', question: 'What services do you offer?', answer: 'We offer Web Design Packages, SEO Services, and a Social Media Management service.' },
    { id: 'faq2', question: 'What are your prices?', answer: 'Our Web Design packages start at $200. SEO services are $150/month. Social Media Management is $100/month.' },
    { id: 'faq3', question: 'Can I pay in installments?', answer: 'Absolutely — we offer 50% upfront and the rest in 2 installments for projects over $500.' },
    { id: 'faq4', question: 'What are your business hours?', answer: 'We are open Monday to Friday, from 9 AM to 6 PM.' },
  ]);

  const addLead = (lead: Omit<Lead, 'id'>) => {
    setLeads(prevLeads => [...prevLeads, { ...lead, id: new Date().toISOString() }]);
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPanel leads={leads} faqs={faqs} />;
      case 'chat':
        return <ChatPanel faqs={faqs} addLead={addLead} language={language} setLanguage={setLanguage} />;
      case 'leads':
        return <LeadsPanel leads={leads} />;
      case 'faq':
        return <FaqPanel faqs={faqs} setFaqs={setFaqs} />;
      case 'billing':
        return <BillingPanel />;
      default:
        return null;
    }
  };

  const NavItem: React.FC<{ tab: Tab; icon: React.ReactElement<{ className?: string }>; label: string }> = ({ tab, icon, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${
        activeTab === tab 
          ? 'bg-matte-gold text-rich-charcoal shadow-md' 
          : 'text-platinum hover:bg-midnight-blue'
      }`}
    >
      {React.cloneElement(icon, { className: "w-6 h-6 mr-3" })}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-midnight-blue text-platinum font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-rich-charcoal border-r border-matte-gold/20 p-4 flex flex-col">
        <div className="text-3xl font-bold text-matte-gold mb-8 font-serif">
          Zentara
        </div>
        <nav className="flex flex-col space-y-2">
          <NavItem tab="dashboard" icon={<DashboardIcon />} label="Dashboard" />
          <NavItem tab="chat" icon={<ChatIcon />} label="Conversations" />
          <NavItem tab="leads" icon={<LeadIcon />} label="Leads" />
          <NavItem tab="faq" icon={<FaqIcon />} label="Knowledge Base" />
          <NavItem tab="billing" icon={<BillingIcon />} label="Billing" />
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-midnight-blue p-4 sm:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;