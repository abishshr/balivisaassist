'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, HelpCircle } from 'lucide-react';

export const FAQPreview = React.memo(function FAQPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
    {
      question: 'Can you help with urgent visa applications?',
      answer: 'Yes! We offer expedited processing for urgent cases. Contact us via WhatsApp to discuss your timeline, and we\'ll do our best to accommodate your needs.',
    },
    {
      question: 'What if my visa application is rejected?',
      answer: 'In the rare case of rejection, we review the reasons with you and help you reapply. Our expertise in Indonesian immigration law helps minimize rejection risks from the start.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500/90 via-amber-400/80 to-orange-500/90 rounded-full text-sm font-bold mb-6 shadow-xl text-white border border-white/30 backdrop-blur-xl overflow-hidden"
            >
              {/* Glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent rounded-full"></div>
              <HelpCircle className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Common Questions</span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-lg">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Quick answers to questions you may have.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.005 }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="relative w-full text-left bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl group overflow-hidden"
                >
                  {/* iOS-style glass reflections */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-3xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>
                  <div className="p-6 flex items-start justify-between gap-4 relative z-10">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors pr-2 drop-shadow-md">
                        {faq.question}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-6 h-6 text-gray-200 group-hover:text-amber-400 transition-colors" />
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
                        <div className="px-6 pb-6 pt-0">
                          <div className="pt-4 border-t border-white/20">
                            <p className="text-base text-gray-100 leading-relaxed drop-shadow-sm">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>

          {/* View All Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mt-12"
          >
            <Link
              href="/faq"
              className="relative inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-3xl text-white hover:bg-white/10 font-bold text-lg transition-all duration-300 group rounded-3xl border border-white/30 hover:border-white/50 shadow-2xl overflow-hidden"
            >
              {/* iOS-style glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>

              <span className="relative z-10">View All FAQs</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
});
