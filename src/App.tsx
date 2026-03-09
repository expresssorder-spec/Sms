import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, MessageSquare, RefreshCw, Globe, ArrowLeft, Loader2, AlertCircle, X, Server } from 'lucide-react';
import Flag from 'react-world-flags';
import { getCountryCode } from './utils/countries';

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

function Home({ numbers, loadingNumbers, numbersError, fetchNumbers }: any) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(numbers.length / itemsPerPage);
  const paginatedNumbers = numbers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      {numbersError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{numbersError}</p>
        </div>
      )}

      {loadingNumbers ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-pulse h-32"></div>
          ))}
        </div>
      ) : numbers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {paginatedNumbers.map((num: NumberData, i: number) => (
              <React.Fragment key={num.id}>
                {i > 0 && i % 5 === 0 && (
                  <div className="col-span-1 sm:col-span-2 lg:col-span-2 my-2">
                    <AdSensePlaceholder label="AdSense Ad (Slot B - Native In-Grid)" className="h-32 w-full" />
                  </div>
                )}
                <Link
                  to={`/messages?link=${encodeURIComponent(num.link)}&number=${encodeURIComponent(num.number)}&country=${encodeURIComponent(num.country)}&siteId=${encodeURIComponent(num.siteId)}`}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left group flex flex-col justify-between h-full shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                        <Flag code={getCountryCode(num.country)} className="w-4 h-3 object-cover rounded-sm shadow-sm" fallback={<Globe className="w-3.5 h-3.5" />} />
                        {num.country}
                      </span>
                      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                        <Server className="w-3 h-3" />
                        {num.source}
                      </span>
                    </div>
                    <div className="font-mono text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight">
                      {num.number}
                    </div>
                  </div>
                  <div className="mt-5 text-sm font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                    View Messages <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>
                </Link>
              </React.Fragment>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-32 bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm">
          <Phone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium text-lg">Click "Fetch Numbers" to start scraping all sources.</p>
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
  const [showRefreshAd, setShowRefreshAd] = useState(false);

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

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [link, siteId]);

  const handleRefresh = () => {
    if (cooldown > 0) return;
    
    setCooldown(3);
    setShowInterstitial(true);

    setTimeout(() => {
      setShowInterstitial(false);
      setShowRefreshAd(true);
      fetchMessages();
    }, 2000);
  };

  if (!link || !number) {
    return (
      <div className="text-center py-32 bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium text-lg">Invalid number selected.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 font-medium hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {showInterstitial && <InterstitialAd text="Refreshing Data..." />}
      
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-800">
              <Phone className="w-4 h-4 text-indigo-500" />
              <span className="font-mono font-semibold text-lg">{number}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-sm font-medium bg-slate-100 px-3 py-1 rounded-full">
              <Flag code={getCountryCode(country || '')} className="w-4 h-3 object-cover rounded-sm" fallback={<Globe className="w-3.5 h-3.5" />} />
              <span>{country}</span>
            </div>
          </div>
          
          <button 
            onClick={handleRefresh}
            disabled={loadingMessages || cooldown > 0}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 min-w-[120px] justify-center"
          >
            {loadingMessages ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : cooldown > 0 ? (
              `Wait ${cooldown}s...`
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Actualisé
              </>
            )}
          </button>
        </div>

        {showRefreshAd && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <AdSensePlaceholder label="AdSense Ad (Rewarded/Anchor Placeholder)" className="h-28 w-full" />
          </div>
        )}

        {messagesError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-100">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{messagesError}</p>
          </div>
        )}

        {loadingMessages ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
            <p className="font-medium">Fetching full message history...</p>
          </div>
        ) : messages.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Sender</th>
                    <th className="px-6 py-4 font-semibold">Time ago</th>
                    <th className="px-6 py-4 font-semibold">Message Content</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {messages.map((msg, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">{msg.sender}</td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap font-medium">{msg.time}</td>
                      <td className="px-6 py-4 text-slate-700 leading-relaxed">{msg.text}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium text-lg">No messages found for this number.</p>
          </div>
        )}
      </div>
      
      <div className="lg:w-[300px] shrink-0">
        <div className="sticky top-24">
          <AdSensePlaceholder label="AdSense Ad (Slot C - Sidebar)" className="h-[600px] w-full" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [numbers, setNumbers] = useState<NumberData[]>([]);
  const [loadingNumbers, setLoadingNumbers] = useState(false);
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

  // Initial fetch
  useEffect(() => {
    fetchNumbers();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-semibold tracking-tight">SMS Scraper Service</h1>
            </Link>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchNumbers}
                disabled={loadingNumbers}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-sm"
              >
                {loadingNumbers ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Fetch All Sources
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 pt-6">
          <AdSensePlaceholder label="AdSense Ad (Slot A - Top Banner)" className="h-24 w-full" />
        </div>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home numbers={numbers} loadingNumbers={loadingNumbers} numbersError={numbersError} fetchNumbers={fetchNumbers} />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
