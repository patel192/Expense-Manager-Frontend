import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiTwitter,
  FiGithub,
  FiLinkedin,
  FiArrowUpRight,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Integrations", href: "#integrations" },
      { label: "FAQ", href: "#faq" },
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "Security", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "System Status", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: <FiTwitter />, href: "#", label: "Twitter" },
    { icon: <FiGithub />, href: "#", label: "GitHub" },
    { icon: <FiLinkedin />, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="relative mt-20 pt-20 pb-10 border-t border-[var(--border)] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-[var(--text)]"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 9v1M5.05 5.05A9 9 0 1118.95 18.95"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                FinTrack
              </span>
            </div>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-sm">
              The high-performance dashboard for engineers of their own finances. 
              Track, analyze, and optimize your wealth with technical precision.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-cyan-500 hover:border-cyan-500/50 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links Sections */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">
              Product
            </h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-[var(--text-secondary)] hover:text-cyan-500 transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <FiArrowUpRight className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">
              Resources
            </h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-[var(--text-secondary)] hover:text-cyan-500 transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <FiArrowUpRight className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">
              Company
            </h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-[var(--text-secondary)] hover:text-cyan-500 transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <FiArrowUpRight className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-[var(--text-muted)] font-mono">
            &copy; {currentYear} FinTrack Labs Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
            <span className="hidden sm:block">v2.4.0-stable</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
