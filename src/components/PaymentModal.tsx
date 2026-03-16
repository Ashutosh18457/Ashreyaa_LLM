import React, { useState } from 'react';
import { X, CreditCard, Zap, Check, ShieldCheck, ArrowRight, Loader2, CheckCircle2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { User } from 'firebase/auth';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

type PaymentStep = 'plans' | 'checkout' | 'success';

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, user }) => {
  const [step, setStep] = useState<PaymentStep>('plans');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$0',
      description: 'For personal exploration',
      features: ['Gemini 3.1 Flash', 'Standard Speed', '10 Messages/day', 'Community Support'],
      current: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$49',
      description: 'For high-performance teams',
      features: ['Gemini 3.1 Pro', 'Neural Priority', '1000 Messages/day', '24/7 Priority Support', 'Custom ML Pipelines'],
      current: false,
      popular: true
    }
  ];

  const handleUpgrade = async () => {
    if (!user) {
      setError("Please sign in to upgrade.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error("Upgrade error:", err);
      setError(err.message || "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl">
                <CreditCard size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Billing & Plans</h2>
                <p className="text-sm text-zinc-500 font-medium">Manage your subscription and usage</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan, idx) => (
              <div 
                key={idx}
                className={`relative p-8 rounded-[2rem] border transition-all ${
                  plan.popular 
                    ? 'bg-teal-500/5 border-teal-500/30 shadow-2xl shadow-teal-500/5' 
                    : 'bg-white/5 border-white/5'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-6 right-6 px-3 py-1 bg-teal-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                    Most Popular
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-xl ${plan.popular ? 'bg-teal-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                    <Zap size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-zinc-500 font-bold">/month</span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-2 font-medium">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-10">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm text-zinc-300 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {error && plan.popular && (
                  <p className="text-red-500 text-xs mb-4 font-bold uppercase tracking-widest">{error}</p>
                )}

                <button
                  onClick={() => !plan.current && handleUpgrade()}
                  disabled={isProcessing && plan.popular}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    plan.current 
                      ? 'bg-zinc-800 text-zinc-500 cursor-default' 
                      : 'bg-teal-500 hover:bg-teal-400 text-black shadow-lg shadow-teal-500/20 active:scale-[0.98]'
                  }`}
                >
                  {isProcessing && plan.popular ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      {plan.current ? 'Current Plan' : 'Upgrade Now'}
                      {!plan.current && <ArrowRight size={18} />}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="p-8 bg-zinc-950/50 border-t border-white/5">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <ShieldCheck size={20} />
              </div>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                Secure payments processed by <span className="text-white font-bold">Stripe</span>. 
                Cancel anytime. No hidden fees. Enterprise-grade security guaranteed.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
