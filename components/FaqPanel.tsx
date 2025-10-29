import React, { useState } from 'react';
import type { FAQ } from '../types';
import { EditIcon, DeleteIcon } from './IconComponents';

interface FaqPanelProps {
  faqs: FAQ[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQ[]>>;
}

export const FaqPanel: React.FC<FaqPanelProps> = ({ faqs, setFaqs }) => {
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const handleAddFaq = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      setFaqs([...faqs, { id: new Date().toISOString(), question: newQuestion, answer: newAnswer }]);
      setNewQuestion('');
      setNewAnswer('');
    }
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  const handleEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
  };
  
  const handleUpdateFaq = () => {
    if (editingFaq) {
      setFaqs(faqs.map(faq => faq.id === editingFaq.id ? editingFaq : faq));
      setEditingFaq(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Add/Edit FAQ Form */}
      <div className="bg-rich-charcoal p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-platinum font-serif">{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="question" className="block mb-2 text-sm font-medium text-platinum/80">Question</label>
            <input
              type="text"
              id="question"
              value={editingFaq ? editingFaq.question : newQuestion}
              onChange={(e) => editingFaq ? setEditingFaq({...editingFaq, question: e.target.value}) : setNewQuestion(e.target.value)}
              className="bg-midnight-blue border border-gray-600 text-platinum text-sm rounded-lg focus:ring-matte-gold focus:border-matte-gold block w-full p-2.5 placeholder-gray-400"
              placeholder="e.g., What are your business hours?"
            />
          </div>
          <div>
            <label htmlFor="answer" className="block mb-2 text-sm font-medium text-platinum/80">Answer</label>
            <textarea
              id="answer"
              rows={4}
              value={editingFaq ? editingFaq.answer : newAnswer}
              onChange={(e) => editingFaq ? setEditingFaq({...editingFaq, answer: e.target.value}) : setNewAnswer(e.target.value)}
              className="block p-2.5 w-full text-sm text-platinum bg-midnight-blue rounded-lg border border-gray-600 focus:ring-matte-gold focus:border-matte-gold placeholder-gray-400"
              placeholder="e.g., We are open from 9 AM to 5 PM, Monday to Friday."
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            {editingFaq && (
                <button onClick={() => setEditingFaq(null)} className="px-4 py-2 text-sm font-medium text-platinum bg-gray-700 rounded-lg hover:bg-gray-600">
                    Cancel
                </button>
            )}
            <button onClick={editingFaq ? handleUpdateFaq : handleAddFaq} className="px-4 py-2 text-sm font-medium text-rich-charcoal bg-matte-gold rounded-lg hover:bg-opacity-90">
              {editingFaq ? 'Update FAQ' : 'Add FAQ'}
            </button>
          </div>
        </div>
      </div>

      {/* Existing FAQs List */}
      <div className="bg-rich-charcoal p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-platinum font-serif">Knowledge Base</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-4 border border-gray-700 rounded-lg">
              <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-platinum">{faq.question}</h3>
                    <p className="mt-1 text-sm text-platinum/70">{faq.answer}</p>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-4">
                    <button onClick={() => handleEditFaq(faq)} className="text-matte-gold/80 hover:text-matte-gold"><EditIcon /></button>
                    <button onClick={() => handleDeleteFaq(faq.id)} className="text-red-500/80 hover:text-red-500"><DeleteIcon /></button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};