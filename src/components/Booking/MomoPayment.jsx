import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';

const MomoPayment = ({ amount, onComplete }) => {
  const [step, setStep] = useState('phone'); // phone, ussd, processing, success, failed
  const [phoneNumber, setPhoneNumber] = useState('');
  const [redirectSecs, setRedirectSecs] = useState(3);
  const [errorMsg, setErrorMsg] = useState('');

  const initiatePayment = (e) => {
    e.preventDefault();
    const phoneRegex = /^07[89]\d{7}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      setErrorMsg('Please enter a valid MTN Rwanda number (e.g. 078XXXXXXX).');
      return;
    }
    setErrorMsg('');
    setStep('ussd');
    
    setTimeout(() => {
      setStep('processing');
      setTimeout(() => {
        if (Math.random() < 0.2) {
          setStep('failed');
          return;
        }
        setStep('success');
        let count = 3;
        setRedirectSecs(count);
        const timer = setInterval(() => {
          count -= 1;
          setRedirectSecs(count);
          if (count === 0) {
            clearInterval(timer);
            onComplete({ phone: phoneNumber, status: 'Completed' });
          }
        }, 1000);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {step === 'phone' && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-[#FFCC00] rounded-2xl flex items-center justify-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/9/93/MTN_Logo.svg" 
                  alt="MTN" 
                  className="w-8 h-8"
                />
              </div>
              <div>
                <h4 className="font-bold">MTN MoMo</h4>
                <p className="text-sm text-gray-400">Secure Payment for Rwanda</p>
              </div>
            </div>

            <form onSubmit={initiatePayment}>
              <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
              <div className="relative mb-6">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  required
                  type="tel"
                  placeholder="078 XXX XXXX"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setErrorMsg('');
                  }}
                  className={`w-full bg-white/5 border ${errorMsg ? 'border-red-500' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 outline-none focus:border-event-gold`}
                />
              </div>
              
              {errorMsg && <p className="text-red-500 text-xs mb-4 text-center">{errorMsg}</p>}
              
              <div className="bg-event-gold/10 p-4 rounded-xl mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Total Amount</span>
                  <span className="font-bold text-event-gold text-lg">{amount}</span>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center space-x-2">
                <ShieldCheck className="w-5 h-5" />
                <span>Pay with MTN MoMo</span>
              </button>
            </form>
          </motion.div>
        )}

        {step === 'ussd' && (
          <motion.div
            key="ussd"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border-4 border-event-gold border-t-transparent animate-spin" />
            <h4 className="text-xl font-bold mb-2">USSD Prompt Sent</h4>
            <p className="text-gray-400 px-6">
              Please check your phone and enter your 
              <span className="text-event-gold font-bold"> MoMo PIN</span> to authorize the transaction.
            </p>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <Loader2 className="w-16 h-16 text-event-gold animate-spin mb-6" />
            <h4 className="text-xl font-bold mb-2">Verifying Payment</h4>
            <p className="text-gray-400">Contacting MTN servers...</p>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h4 className="text-2xl font-bold mb-2">Payment Confirmed!</h4>
            <p className="text-gray-400 mb-6">Redirecting to your dashboard in {redirectSecs}...</p>
          </motion.div>
        )}

        {step === 'failed' && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
              <span className="text-4xl text-red-500">!</span>
            </div>
            <h4 className="text-xl font-bold mb-2 text-red-500">Payment failed.</h4>
            <p className="text-gray-400 mb-6 px-6">We could not process your transaction. Please try again.</p>
            <button onClick={() => setStep('phone')} className="btn-primary px-8">Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MomoPayment;
