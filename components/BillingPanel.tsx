import React from 'react';

const plans = [
  {
    name: 'Small Business',
    price: '$49',
    features: [
      'Up to 1,000 chats/month',
      '1 WhatsApp Account',
      'Basic FAQ Handling',
      'Lead Collection',
      'Email Support',
    ],
    cta: 'Choose Plan',
    popular: false,
  },
  {
    name: 'Medium Business',
    price: '$149',
    features: [
      'Up to 5,000 chats/month',
      '3 WhatsApp Accounts',
      'Multi-language Support',
      'Advanced Analytics',
      'Priority Support',
    ],
    cta: 'Choose Plan',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$499+',
    features: [
      'Unlimited Chats',
      'Unlimited Accounts',
      'Voice AI (Add-on)',
      'CRM Integration',
      'Dedicated Account Manager',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export const BillingPanel: React.FC = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-serif text-platinum">Subscription Plans</h1>
        <p className="text-lg text-platinum/70 mt-2">Choose the plan that's right for your business.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-rich-charcoal rounded-xl shadow-lg p-8 flex flex-col border ${
              plan.popular ? 'border-matte-gold' : 'border-gray-700'
            } relative overflow-hidden`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-matte-gold text-rich-charcoal text-xs font-bold px-4 py-1 rounded-bl-lg">
                Most Popular
              </div>
            )}
            <h2 className="text-2xl font-bold font-serif text-matte-gold">{plan.name}</h2>
            <p className="mt-4 text-4xl font-bold text-platinum">
              {plan.price}
              {plan.name !== 'Enterprise' && <span className="text-lg font-medium text-platinum/70">/month</span>}
            </p>
            <ul className="mt-8 space-y-4 text-platinum/90 flex-grow">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <svg className="w-5 h-5 text-matte-gold mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className={`mt-8 w-full py-3 px-6 rounded-lg font-semibold transition-transform duration-200 ${
                plan.popular
                  ? 'bg-matte-gold text-rich-charcoal hover:bg-opacity-90 transform hover:scale-105'
                  : 'bg-midnight-blue border border-matte-gold text-matte-gold hover:bg-matte-gold hover:text-rich-charcoal'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};