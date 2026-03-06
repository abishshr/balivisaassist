'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

const faqs = [
  {
    question: 'How long does visa processing take?',
    answer: 'Processing times vary by visa type. C1 visas typically take 3-5 business days, while KITAS applications take 10-14 business days. We always provide estimated timelines upfront.',
  },
  {
    question: 'Do I need to visit the immigration office?',
    answer: 'In most cases, no! We handle the majority of the process for you. You may need to visit once for biometric data collection, which we schedule and coordinate on your behalf.',
  },
  {
    question: 'What documents do I need to prepare?',
    answer: 'Required documents vary by visa type but typically include passport copies, photos, proof of accommodation, and financial statements. We provide a detailed checklist after you contact us.',
  },
];

export const FAQPreview = React.memo(function FAQPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20 relative z-10 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8"
          >
            Common Questions
          </motion.h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left bg-white rounded-xl border border-gray-200 transition-colors duration-200"
                >
                  <div className="p-4 sm:p-5 flex items-start justify-between gap-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="flex-shrink-0 mt-0.5"
                    >
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                          <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
            className="mt-6"
          >
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-[#0F4C5C] transition-colors"
            >
              View all FAQs
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
});
