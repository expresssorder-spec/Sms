import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, MessageSquare, RefreshCw, Globe, ArrowLeft, Loader2, AlertCircle, X, Server, Search, Mail, Shield, Info, ChevronRight, ChevronLeft, Calendar, User, ChevronDown, Users } from 'lucide-react';
import Flag from 'react-world-flags';
import { getCountryCode } from './utils/countries';
import { motion, AnimatePresence } from 'motion/react';

interface NumberData {
  id: string;
  number: string;
  country: string;
  link: string;
  source: string;
  siteId: string;
}

interface MessageData {
  sender: string;
  time: string;
  text: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
}

const About = () => (
  <div className="min-h-screen pt-24 pb-12">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900">About Us</h1>
        </div>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            GlobalSMS Hub is a leading provider of free virtual phone numbers for online SMS verification. Our mission is to protect your privacy by providing a secure way to receive SMS online without using your personal phone number.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Our Mission</h2>
          <p className="text-slate-600 mb-6">
            In an era where digital privacy is increasingly under threat, we believe everyone should have access to tools that protect their personal information. GlobalSMS Hub was built to provide a simple, reliable, and free solution for bypassing SMS verifications on various platforms.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Global Reach</h3>
              <p className="text-slate-600">We provide numbers from dozens of countries across the globe, ensuring you can verify accounts on almost any international service.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Privacy First</h3>
              <p className="text-slate-600">We don't store your personal data. Our service is designed to be used anonymously to keep your real identity safe.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How It Works</h2>
          <p className="text-slate-600 mb-4">
            Our platform aggregates public virtual numbers from various sources, providing you with a centralized hub to find and use them. When an SMS is sent to one of our numbers, it appears on our site in real-time, allowing you to complete your verification process instantly.
          </p>
          
          <div className="mt-12 p-8 bg-indigo-600 rounded-2xl text-white">
            <h2 className="text-2xl font-bold mb-4 text-white">Join Our Community</h2>
            <p className="text-indigo-100 mb-6">
              Stay updated with new numbers and features by following our blog or reaching out to us directly. We're constantly working to improve our service and add more numbers.
            </p>
            <Link to="/contact" className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">GlobalSMS <span className="text-indigo-600">Hub</span></h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Home</Link>
          <Link to="/blog" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Blog</Link>
          <Link to="/contact" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Contact Us</Link>
          <Link to="/privacy" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Privacy Policy</Link>
        </nav>

        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Server className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-base font-bold text-slate-900">Home</Link>
              <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="block text-base font-bold text-slate-900">Blog</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block text-base font-bold text-slate-900">Contact Us</Link>
              <Link to="/privacy" onClick={() => setIsMenuOpen(false)} className="block text-base font-bold text-slate-900">Privacy Policy</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-white border-t border-slate-200 mt-20 py-12">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <span className="text-lg font-bold">GlobalSMS Hub</span>
          </Link>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
            The world's leading platform for receiving SMS online. Protect your privacy with our free virtual numbers for OTP verification.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/" className="hover:text-indigo-600">Home</Link></li>
            <li><Link to="/countries" className="hover:text-indigo-600">Countries</Link></li>
            <li><Link to="/about" className="hover:text-indigo-600">About Us</Link></li>
            <li><Link to="/blog" className="hover:text-indigo-600">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/contact" className="hover:text-indigo-600">Contact Us</Link></li>
            <li><Link to="/privacy" className="hover:text-indigo-600">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-xs">© 2026 GlobalSMS Hub. All rights reserved.</p>
        <div className="flex gap-4 text-xs text-slate-400">
          <span>Receive SMS Online</span>
          <span>Recevoir SMS en ligne</span>
          <span>Recibir SMS online</span>
          <span>استقبال رسائل SMS</span>
        </div>
      </div>
    </div>
  </footer>
);

const SEOHead = ({ title, description, country, number }: { title?: string, description?: string, country?: string, number?: string }) => {
  useEffect(() => {
    let finalTitle = title || "GlobalSMS Hub | Receive SMS Online for Free";
    let finalDesc = description || "Free virtual numbers to receive SMS online for privacy and OTP bypass. No registration required.";

    if (country && number) {
      finalTitle = `Receive SMS for ${country} ${number} | GlobalSMS Hub`;
      finalDesc = `Receive SMS online for free with our ${country} virtual number ${number}. Use it for OTP verification, privacy, and bypassing registration requirements. Recevoir SMS en ligne. Recibir SMS online. استقبال رسائل SMS مجانا.`;
    } else if (country) {
      finalTitle = `Free Virtual Numbers for ${country} | GlobalSMS Hub`;
      finalDesc = `Get free virtual numbers for ${country}. Receive SMS online for OTP bypass and privacy. Recevoir SMS en ligne pour ${country}. Recibir SMS online.`;
    }

    document.title = finalTitle;
    
    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', finalDesc);

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', "Receive SMS online, Recevoir SMS en ligne, Recibir SMS online, استقبال رسائل SMS مجانا, Free virtual number, OTP bypass, temporary phone number");

    // Add Multilingual Meta Tags
    const languages = [
      { lang: 'en', content: 'Receive SMS online for free' },
      { lang: 'fr', content: 'Recevoir SMS en ligne gratuitement' },
      { lang: 'es', content: 'Recibir SMS online gratis' },
      { lang: 'ar', content: 'استقبال رسائل SMS مجانا' }
    ];

    languages.forEach(l => {
      let tag = document.querySelector(`meta[name="description-${l.lang}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', `description-${l.lang}`);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', l.content);
    });

  }, [title, description, country, number]);
  return null;
};

const JSONLD = () => (
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "GlobalSMS Hub",
      "operatingSystem": "Web",
      "applicationCategory": "Utility",
      "description": "Free virtual numbers to receive SMS online for privacy and OTP bypass.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    })}
  </script>
);

const AdSensePlaceholder = ({ label = "AdSense Ad", className = "" }: { label?: string, className?: string }) => (
  <div className={`bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 font-medium ${className}`}>
    {label}
  </div>
);

const InterstitialAd = ({ text, onSkip }: { text: string, onSkip?: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
    <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
      {onSkip && (
        <button onClick={onSkip} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      )}
      <div className="w-full h-48 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 font-medium mb-6">
        AdSense Vignette / Interstitial Ad
      </div>
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
      <h3 className="text-lg font-semibold text-slate-900">{text}</h3>
      <p className="text-sm text-slate-500 mt-2">Please wait while we prepare your content...</p>
    </div>
  </div>
);

function Home({ numbers, loadingNumbers, numbersError }: any) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 12;

  const filteredNumbers = numbers.filter((num: NumberData) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    // Handle prefix search (e.g. +1, +44)
    if (query.startsWith('+')) {
      return num.number.includes(query);
    }
    
    return num.country.toLowerCase().includes(query) ||
           num.number.includes(query);
  });

  const totalPages = Math.ceil(filteredNumbers.length / itemsPerPage);
  const paginatedNumbers = filteredNumbers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-8">
      <SEOHead 
        title="Receive SMS Online for Free" 
        description="Get free virtual numbers from USA, UK, Canada and more. Receive SMS online for OTP verification and privacy." 
      />
      
      <div className="text-center max-w-3xl mx-auto space-y-4 py-8">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Free Virtual Numbers for <span className="text-indigo-600">Privacy</span>
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Bypass OTP verification and keep your personal number private. Select a free number below to receive SMS instantly.
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search by country (e.g. USA, UK, France)..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {numbersError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{numbersError}</p>
        </div>
      )}

      {loadingNumbers ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-pulse h-40"></div>
          ))}
        </div>
      ) : filteredNumbers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedNumbers.map((num: NumberData, i: number) => (
              <motion.div
                key={num.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/messages?link=${encodeURIComponent(num.link)}&number=${encodeURIComponent(num.number)}&country=${encodeURIComponent(num.country)}&siteId=${encodeURIComponent(num.siteId)}`}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 transition-all text-left group flex flex-col justify-between h-full shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-12 -mt-12 group-hover:bg-indigo-100 transition-colors" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 rounded shadow-sm overflow-hidden border border-slate-100">
                          <Flag code={getCountryCode(num.country)} className="w-full h-full object-cover" fallback={<Globe className="w-full h-full p-1 text-slate-300" />} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{num.country}</span>
                      </div>
                    </div>
                    <div className="font-mono text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tighter">
                      {num.number}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between relative z-10">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-widest">Active</span>
                    <div className="text-sm font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Receive SMS <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
                {i === 5 && (
                  <div className="col-span-full my-4">
                    <AdSensePlaceholder label="AdSense Ad (Native In-Grid)" className="h-32 w-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 pb-8">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${page === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-32 bg-white rounded-3xl border border-slate-200 border-dashed shadow-sm">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No numbers found</h3>
          <p className="text-slate-500 max-w-xs mx-auto">We couldn't find any numbers matching your search. Try a different country.</p>
          <button onClick={() => setSearchQuery('')} className="mt-6 text-indigo-600 font-bold hover:underline">Clear Search</button>
        </div>
      )}
    </div>
  );
}

function Messages() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const link = searchParams.get('link');
  const number = searchParams.get('number');
  const country = searchParams.get('country');
  const siteId = searchParams.get('siteId');

  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [showInterstitial, setShowInterstitial] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const fetchMessages = async () => {
    if (!link || !siteId) return;
    setLoadingMessages(true);
    setMessagesError(null);
    try {
      const res = await fetch(`/api/messages?siteId=${siteId}&url=${encodeURIComponent(link)}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch messages');
      }
      const data = await res.json();
      setMessages(data);
    } catch (err: any) {
      setMessagesError(err.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [link, siteId]);

  const handleRefresh = () => {
    if (cooldown > 0) return;
    setCooldown(5);
    setShowInterstitial(true);
    setTimeout(() => {
      setShowInterstitial(false);
      fetchMessages();
    }, 2000);
  };

  if (!link || !number) {
    return (
      <div className="text-center py-32 bg-white rounded-3xl border border-slate-200 border-dashed shadow-sm">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium text-lg">Invalid number selected.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 font-bold hover:underline">Go Back Home</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <SEOHead 
        country={country || undefined}
        number={number || undefined}
      />
      {showInterstitial && <InterstitialAd text="Updating Inbox..." />}
      
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-200 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Flag code={getCountryCode(country || '')} className="w-5 h-3.5 object-cover rounded-sm shadow-sm" fallback={<Globe className="w-4 h-4" />} />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{country}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{number}</h2>
            </div>
          </div>
          
          <button 
            onClick={handleRefresh}
            disabled={loadingMessages || cooldown > 0}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-indigo-100 active:scale-95"
          >
            {loadingMessages ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : cooldown > 0 ? (
              <span>Wait {cooldown}s</span>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Update Inbox
              </>
            )}
          </button>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <p className="text-sm text-indigo-800 font-medium">
            Messages are updated in real-time. If you don't see your SMS, wait a few seconds and click "Update Inbox".
          </p>
        </div>

        {messagesError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-100">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{messagesError}</p>
          </div>
        )}

        {loadingMessages ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
            <p className="font-bold text-lg">Loading messages...</p>
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{msg.sender}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">Verified</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {msg.time}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium text-lg">{msg.text}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-slate-200 border-dashed shadow-sm">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Waiting for new messages...</h3>
            <p className="text-slate-500 max-w-xs mx-auto">This number is fresh. Send your SMS now and click "Update Inbox" to see it here.</p>
          </div>
        )}
      </div>
      
      <div className="lg:w-[300px] shrink-0">
        <div className="sticky top-24 space-y-6">
          <AdSensePlaceholder label="AdSense Ad (Sidebar Top)" className="h-[250px] w-full" />
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Safety Tips</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" /> Don't use for banking</li>
              <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" /> Numbers are public</li>
              <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" /> Refresh often for OTPs</li>
            </ul>
          </div>
          <AdSensePlaceholder label="AdSense Ad (Sidebar Bottom)" className="h-[250px] w-full" />
        </div>
      </div>
    </div>
  );
}

function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SEOHead title="Blog - Privacy & Security Tips" description="Read our latest articles about online privacy, virtual numbers, and how to stay safe on the web." />
      
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Privacy & <span className="text-indigo-600">Security</span> Blog</h2>
        <p className="text-lg text-slate-600">Expert advice on maintaining your digital anonymity.</p>
      </div>

      {loading ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 animate-pulse h-64"></div>
          ))}
        </div>
      ) : (
        <div className="grid gap-8">
          {posts.map((post, i) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group"
            >
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">{post.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">{post.excerpt}</p>
              <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-indigo-600 font-black hover:gap-3 transition-all">
                Read Full Article <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}

function Article() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        const found = data.find((p: BlogPost) => p.id === id);
        setPost(found || null);
      });
  }, [id]);

  if (!post) return <div className="text-center py-20">Article not found</div>;

  const currentIndex = posts.findIndex(p => p.id === id);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <SEOHead title={post.title} description={post.excerpt} />
      
      <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Blog
      </button>

      <article className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">{post.title}</h1>
        </div>

        <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed space-y-6 font-medium">
          <p className="text-xl text-slate-900 font-bold italic border-l-4 border-indigo-600 pl-6 py-2">
            {post.excerpt}
          </p>
          <p>
            In today's digital age, privacy is more than just a luxury—it's a necessity. Every time you sign up for a new service, you're asked for your phone number. This data is often sold to advertisers or leaked in data breaches.
          </p>
          <AdSensePlaceholder label="AdSense In-Article Ad" className="h-48 w-full my-8" />
          <p>
            By using a virtual number from GlobalSMS Hub, you can protect your identity. Our numbers are sourced from around the globe, providing you with a layer of anonymity that traditional mobile numbers cannot offer.
          </p>
          <h3 className="text-2xl font-black text-slate-900 pt-4">Why choose GlobalSMS Hub?</h3>
          <p>
            Our platform is designed for speed and reliability. We aggregate numbers from multiple high-quality sources to ensure you always have a working number for your OTP bypass needs. Whether it's for social media, messaging apps, or online marketplaces, we've got you covered.
          </p>
        </div>

        <div className="pt-12 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-6">
          {prevPost ? (
            <Link to={`/blog/${prevPost.id}`} className="flex-1 p-6 bg-slate-50 rounded-3xl border border-slate-200 hover:border-indigo-300 transition-all group">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Previous Article</span>
              <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{prevPost.title}</span>
            </Link>
          ) : <div className="flex-1" />}
          
          {nextPost ? (
            <Link to={`/blog/${nextPost.id}`} className="flex-1 p-6 bg-slate-50 rounded-3xl border border-slate-200 hover:border-indigo-300 transition-all group text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Next Article</span>
              <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{nextPost.title}</span>
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </article>
    </div>
  );
}

function Countries({ numbers }: { numbers: NumberData[] }) {
  const countries = Array.from(new Set(numbers.map(n => n.country))).sort();
  
  return (
    <div className="space-y-12">
      <SEOHead title="Browse by Country" description="Find free virtual numbers by country. We support USA, UK, Canada, France, Germany and many more." />
      
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Browse by <span className="text-indigo-600">Country</span></h2>
        <p className="text-lg text-slate-600">Select a country to view available virtual numbers.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {countries.map((country, i) => (
          <motion.div
            key={country}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
          >
            <Link 
              to={`/?search=${encodeURIComponent(country)}`}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col items-center gap-3 group"
            >
              <div className="w-12 h-8 rounded shadow-sm overflow-hidden border border-slate-100 group-hover:scale-110 transition-transform">
                <Flag code={getCountryCode(country)} className="w-full h-full object-cover" fallback={<Globe className="w-full h-full p-1 text-slate-300" />} />
              </div>
              <span className="text-sm font-bold text-slate-700 text-center">{country}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <SEOHead title="Contact Us | GlobalSMS Hub Support" description="Get in touch with the GlobalSMS Hub team for support, business inquiries, or to report a broken number." />
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Contact <span className="text-indigo-600">Us</span></h2>
        <p className="text-lg text-slate-600">Have questions or need a custom solution? We're here to help.</p>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        <div className="grid gap-6">
          <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-100"><Mail className="w-6 h-6 text-white" /></div>
            <div>
              <h4 className="font-bold text-slate-900">Email Support</h4>
              <p className="text-indigo-600 font-medium">support@globalsms-hub.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="bg-emerald-600 p-3 rounded-xl shadow-lg shadow-emerald-100"><Shield className="w-6 h-6 text-white" /></div>
            <div>
              <h4 className="font-bold text-slate-900">Business Inquiries</h4>
              <p className="text-emerald-600 font-medium">biz@globalsms-hub.com</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-500" />
            Before you contact us:
          </h4>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" /> Check if the number is active by sending a test SMS.</li>
            <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" /> Refresh the message page after 30-60 seconds.</li>
            <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" /> Some services (like Google/WhatsApp) may block virtual numbers.</li>
          </ul>
        </div>

        <p className="text-slate-400 text-xs text-center">
          Our team typically responds within 24-48 hours. We value your feedback!
        </p>
      </div>
    </div>
  );
}

function Privacy() {
  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <SEOHead title="Privacy Policy | GlobalSMS Hub" description="Learn how GlobalSMS Hub protects your privacy. We don't collect personal data, and our service is designed for anonymity." />
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Privacy <span className="text-indigo-600">Policy</span></h2>
        <p className="text-lg text-slate-600">Transparency and anonymity are our core values.</p>
      </div>
      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm prose prose-slate max-w-none font-medium text-slate-600">
        <section className="mb-10">
          <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" /> 1. Information We Collect
          </h3>
          <p>GlobalSMS Hub is a registration-free service. We do not collect, store, or share any personally identifiable information (PII) such as your name, email address, or IP address for the purpose of identifying you. Our goal is to provide a completely anonymous environment for OTP verification.</p>
          <p>We do not require users to create accounts, providing a layer of protection against data harvesting.</p>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-amber-500" /> 2. Public Nature of SMS
          </h3>
          <p className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900">
            <strong>Warning:</strong> All SMS messages received on our virtual numbers are <strong>publicly accessible</strong>. Anyone who knows the number can view the messages. Never use our numbers for sensitive accounts, banking, or private communication.
          </p>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <Server className="w-6 h-6 text-indigo-600" /> 3. Cookies and Advertising
          </h3>
          <p>We use essential cookies to maintain session state and improve site performance. We also use third-party services like Google AdSense and Google Analytics, which may use cookies to serve relevant ads and analyze traffic patterns. These third-party vendors use cookies to serve ads based on a user's prior visits to your website or other websites.</p>
          <p>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</p>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-indigo-600" /> 4. Data Security
          </h3>
          <p>We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. However, since we do not collect PII, the risk is minimal.</p>
        </section>

        <section>
          <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <Mail className="w-6 h-6 text-indigo-600" /> 5. Contacting Us
          </h3>
          <p>If there are any questions regarding this privacy policy, you may contact us using the information on our Contact Us page or via email at privacy@globalsms-hub.com.</p>
        </section>
      </div>
    </div>
  );
}

import { useParams } from 'react-router-dom';

export default function App() {
  const [numbers, setNumbers] = useState<NumberData[]>([]);
  const [loadingNumbers, setLoadingNumbers] = useState(true);
  const [numbersError, setNumbersError] = useState<string | null>(null);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const fetchNumbers = async () => {
    setLoadingNumbers(true);
    setNumbersError(null);
    try {
      const res = await fetch(`/api/numbers`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch numbers');
      }
      const data = await res.json();
      setNumbers(shuffleArray(data));
    } catch (err: any) {
      setNumbersError(err.message);
    } finally {
      setLoadingNumbers(false);
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <JSONLD />
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 pt-8">
          <AdSensePlaceholder label="AdSense Ad (Top Leaderboard)" className="h-24 w-full" />
        </div>

        <main className="max-w-6xl mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home numbers={numbers} loadingNumbers={loadingNumbers} numbersError={numbersError} />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<Article />} />
              <Route path="/countries" element={<Countries numbers={numbers} />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
