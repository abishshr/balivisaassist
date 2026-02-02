'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Shield, CheckCircle } from 'lucide-react';

export function ComplianceDisclaimer() {
  return (
    <section className="py-20 sm:py-28 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
            <div className="p-8 sm:p-10 md:p-12">
              {/* Header */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow-lg">
                    Important Legal Notice
                  </h3>
                  <p className="text-base text-gray-200 drop-shadow-md">
                    Please read this carefully before proceeding
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <p className="text-base text-white leading-relaxed drop-shadow-md">
                    BaliVisaAssist is <strong className="text-amber-300">not affiliated with, endorsed by, or part of</strong> the
                    Indonesian government or any government immigration agency. We are a <strong className="text-amber-300">private visa
                    assistance and sponsorship service</strong> operated by PT CIPTA SOLUSI GLOBAL.
                  </p>
                </div>

                {/* Key Points */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <Shield className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white leading-relaxed drop-shadow-sm">
                        <strong className="text-amber-300">We provide:</strong> Legal visa sponsorship and professional assistance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white leading-relaxed drop-shadow-sm">
                        <strong className="text-amber-300">Final approval:</strong> Decided solely by Indonesian immigration authorities
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <p className="text-sm text-gray-200 leading-relaxed drop-shadow-sm">
                  All visa applications are subject to approval by Indonesian immigration authorities.
                  While we maintain a high success rate, we cannot guarantee visa approval as final
                  decisions are made by the government.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
