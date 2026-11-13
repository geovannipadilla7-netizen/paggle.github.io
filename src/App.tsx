import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Send,
  X,
  ArrowLeft,
  RotateCw,
  ExternalLink,
  Maximize2,
  Minimize2,
  Info,
  CheckCircle2,
  Globe,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  Monitor
} from 'lucide-react';

interface NotificationState {
  title: string;
  message: string;
  timestamp: string;
  referenceId: string;
  generatedCode?: string;
}

type EmbeddedMode = 'default' | 'win11' | 'google';

interface EmbeddedSession {
  mode: EmbeddedMode;
  displayUrl: string;
  iframeSrc: string;
  title: string;
  generatedCode?: string;
  statusMessage?: string;
}

export default function App() {
  const [embeddedSession, setEmbeddedSession] = useState<EmbeddedSession | null>(null);
  const [showWin11Banner, setShowWin11Banner] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reasonText, setReasonText] = useState('');
  const [studentEmail, setStudentEmail] = useState('student@district402.k12.org');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [showPolicyDetails, setShowPolicyDetails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const targetBlockedUrl = 'http://Advocacylgbtq.b-cdn.net';
  // Use https for iframe if the parent page is https to prevent browser mixed-content blockage
  const safeAdvocacyUrl =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? 'https://Advocacylgbtq.b-cdn.net'
      : 'http://Advocacylgbtq.b-cdn.net';

  const modalInputRef = useRef<HTMLTextAreaElement>(null);
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        modalInputRef.current?.focus();
      }, 100);
    }
  }, [isModalOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const generateWin11Code = () => {
    const segment = Math.random().toString(36).substring(2, 6).toUpperCase();
    const digits = Math.floor(1000 + Math.random() * 9000);
    return `WIN11-${segment}-${digits}`;
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonText.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const normalizedReason = reasonText.trim();
      const lowerReason = normalizedReason.toLowerCase();

      if (lowerReason === 'i got blocked') {
        setIsModalOpen(false);
        setReasonText('');
        setIframeLoading(true);
        setIframeKey((prev) => prev + 1);
        setEmbeddedSession({
          mode: 'default',
          displayUrl: targetBlockedUrl,
          iframeSrc: safeAdvocacyUrl,
          title: 'Advocacylgbtq.b-cdn.net'
        });
        setNotification({
          title: 'Access Override Granted',
          message: 'The requested link has been unlocked and opened directly in the page.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          referenceId: 'OVR-' + Math.floor(100000 + Math.random() * 900000)
        });
      } else if (lowerReason === 'i love pizza') {
        const runtimeCode = generateWin11Code();
        setIsModalOpen(false);
        setReasonText('');
        setIframeLoading(true);
        setShowWin11Banner(true);
        setIframeKey((prev) => prev + 1);
        setEmbeddedSession({
          mode: 'win11',
          displayUrl: 'https://win11.blueedge.me/',
          iframeSrc: 'https://win11.blueedge.me/',
          title: 'Windows 11 Desktop',
          generatedCode: runtimeCode,
          statusMessage: 'Windows 11 is running'
        });
        setNotification({
          title: 'Windows 11 is running',
          message: `Runtime environment initialized. Generated access code: ${runtimeCode}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          referenceId: runtimeCode,
          generatedCode: runtimeCode
        });
      } else if (lowerReason === 'get out') {
        setIsModalOpen(false);
        setReasonText('');
        setIframeLoading(true);
        setIframeKey((prev) => prev + 1);
        setEmbeddedSession({
          mode: 'google',
          displayUrl: 'https://www.google.com/',
          iframeSrc: 'https://www.google.com/webhp?igu=1',
          title: 'Google'
        });
        setNotification({
          title: 'Access Override Granted',
          message: 'Google Search has been unlocked and opened directly inside Paggle.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          referenceId: 'GGL-' + Math.floor(100000 + Math.random() * 900000)
        });
      } else {
        // Display standard notification indicating request has been submitted
        setIsModalOpen(false);
        const refId = 'REQ-' + Math.floor(100000 + Math.random() * 900000);
        setNotification({
          title: 'Request Submitted',
          message: 'Your access request has been submitted to your network administrator for review. You will be notified once a determination has been made.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          referenceId: refId
        });
        setReasonText('');
      }
    }, 400);
  };

  const handleCopyUrl = () => {
    const urlToCopy = embeddedSession?.displayUrl ?? targetBlockedUrl;
    navigator.clipboard?.writeText(urlToCopy);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const getProtocolAndHost = (url: string) => {
    if (url.startsWith('https://')) {
      return { protocol: 'https://', rest: url.slice('https://'.length) };
    }
    if (url.startsWith('http://')) {
      return { protocol: 'http://', rest: url.slice('http://'.length) };
    }
    return { protocol: '', rest: url };
  };

  // -------------------------------------------------------------------------
  // EMBEDDED PAGE VIEW (Unlocked state)
  // -------------------------------------------------------------------------
  if (embeddedSession) {
    const { protocol, rest } = getProtocolAndHost(embeddedSession.displayUrl);

    return (
      <div
        ref={viewerContainerRef}
        className="flex flex-col h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden font-sans"
      >
        {/* Browser Chrome Navigation Header */}
        <header className="h-14 bg-slate-800 border-b border-slate-700/80 px-4 flex items-center justify-between gap-3 shrink-0 select-none shadow-md">
          {/* Left: Back to restriction screen */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setEmbeddedSession(null);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
              title="Return to Access Restriction screen"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Block Screen</span>
            </button>
            <button
              onClick={() => {
                setIframeLoading(true);
                setIframeKey((prev) => prev + 1);
              }}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
              title="Reload embedded page"
            >
              <RotateCw className={`w-3.5 h-3.5 ${iframeLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>

          {/* Center: Address Bar Display */}
          <div className="flex-1 max-w-2xl mx-auto flex items-center bg-slate-950/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs gap-2 text-slate-300 shadow-inner min-w-0">
            <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            {protocol && (
              <span className="font-mono text-emerald-400 font-medium shrink-0">{protocol}</span>
            )}
            <span className="font-mono truncate text-slate-200 selection:bg-blue-600">
              {rest}
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-300 font-sans shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Paggle Embedded</span>
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyUrl}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
              title="Copy URL"
            >
              {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <a
              href={embeddedSession.displayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
              title="Open externally in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Windows 11 Generated Code & Runtime Status Banner */}
        {embeddedSession.mode === 'win11' && embeddedSession.generatedCode && showWin11Banner && (
          <div className="bg-blue-950/95 border-b border-blue-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0">
                <Monitor className="w-4 h-4" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-white">Windows 11 is running</span>
                <span className="text-blue-400" aria-hidden="true">·</span>
                <span className="text-blue-200">Generated Code:</span>
                <code className="font-mono font-semibold text-emerald-300 bg-slate-950/80 border border-blue-700/60 px-2.5 py-0.5 rounded select-all">
                  {embeddedSession.generatedCode}
                </code>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyCode(embeddedSession.generatedCode!)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-100 bg-blue-800/60 hover:bg-blue-700/80 border border-blue-600/50 rounded transition-colors cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowWin11Banner(false)}
                className="p-1 text-blue-300 hover:text-white hover:bg-blue-800/50 rounded transition-colors cursor-pointer"
                title="Hide status bar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Embedded Iframe Container */}
        <div className="relative flex-1 w-full bg-slate-950">
          {iframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 z-10 text-slate-300 gap-3">
              <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-mono">
                Loading {embeddedSession.displayUrl}...
              </p>
            </div>
          )}

          <iframe
            key={`${embeddedSession.mode}-${iframeKey}`}
            src={embeddedSession.iframeSrc}
            title={embeddedSession.title}
            className="w-full h-full border-0 bg-white"
            onLoad={() => setIframeLoading(false)}
            allow="accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          />
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // GOGUARDIAN ACCESS RESTRICTION INTERFACE
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100/90 flex flex-col justify-between text-slate-800 antialiased font-sans">
      {/* Top Organization Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          {/* GoGuardian Inspired Shield Mark */}
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base">GoGuardian</span>
              <span className="text-[11px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-500">Paggle SafeGuard Web Filtering</p>
          </div>
        </div>

        {/* Center / Right: Session & Policy Information */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium text-slate-700">District Policy Active</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Device ID: <span className="font-mono text-slate-700 font-medium">CB-402-99</span></span>
        </div>
      </header>

      {/* Main Block Notification Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-200">
          {/* Decorative colored top header bar */}
          <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700" />

          <div className="p-6 sm:p-8">
            {/* Primary Shield Icon & Status */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 mb-5 shadow-xs">
                <ShieldAlert className="w-9 h-9 stroke-[2.2]" />
              </div>

              {/* Exact required text: "The site has been blocked by Paggle." */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                The site has been blocked by Paggle.
              </h1>

              <p className="text-sm text-slate-600 max-w-md leading-relaxed mb-6">
                Your school or network administrator has restricted access to this webpage in accordance with your organization's acceptable internet use policy.
              </p>
            </div>

            {/* Blocked URL Details Card */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 text-xs">
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                  Restricted Target
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                  Policy Restricted
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-7 h-7 rounded-lg bg-slate-200/70 flex items-center justify-center text-slate-600 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs sm:text-sm text-slate-900 font-medium truncate select-all">
                    {targetBlockedUrl}
                  </span>
                </div>
                <button
                  onClick={handleCopyUrl}
                  className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded transition-colors cursor-pointer shrink-0"
                  title="Copy blocked URL"
                >
                  {copiedUrl ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Category</span>
                  <span className="font-medium text-slate-700">Custom Restriction</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Rule Trigger</span>
                  <span className="font-mono text-slate-700">PAG-FILTER-08</span>
                </div>
              </div>
            </div>

            {/* Notification Banner (when standard request has been submitted) */}
            {notification && (
              <div
                className={`mb-6 p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  notification.title === 'Request Submitted'
                    ? 'bg-blue-50/80 border-blue-200 text-blue-900'
                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="mt-0.5">
                  {notification.title === 'Request Submitted' ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                </div>
                <div className="flex-1 text-xs leading-relaxed">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">{notification.title}</h3>
                    <span className="font-mono text-[11px] text-slate-500">
                      Ref: {notification.referenceId}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-600">{notification.message}</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Logged at {notification.timestamp} · Request forwarded to network admin
                  </p>
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title="Dismiss notice"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Primary Action Button: "Request Access" */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  setNotification(null);
                  setIsModalOpen(true);
                }}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl transition-all shadow-xs hover:shadow cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Request Access</span>
              </button>

              <button
                onClick={() => window.history.back()}
                className="w-full sm:w-auto py-3 px-5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-300 rounded-xl transition-colors cursor-pointer"
              >
                Go Back
              </button>
            </div>

            {/* Policy Toggle */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center">
              <button
                onClick={() => setShowPolicyDetails(!showPolicyDetails)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{showPolicyDetails ? 'Hide Policy Details' : 'Why is this site blocked?'}</span>
              </button>

              {showPolicyDetails && (
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-2 w-full text-left animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Paggle SafeGuard Filtering Policy</span>
                  </div>
                  <p>
                    This workstation is bound to district-wide educational filtering rules. Access to external content delivery endpoints and categorized sites must be authorized by an IT administrator or curriculum director.
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    If you require this resource for coursework or classroom presentation, click <strong>"Request Access"</strong> above to submit a review ticket with your justification.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="py-4 px-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>Protected by <strong>GoGuardian Admin</strong> &amp; <strong>Paggle</strong></span>
          <span className="text-slate-300">·</span>
          <span>Version 4.2.1-SEC</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Education Safety Compliance</span>
          <span>Privacy Policy</span>
        </div>
      </footer>

      {/* ------------------------------------------------------------------- */}
      {/* REQUEST ACCESS MODAL WINDOW */}
      {/* ------------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn">
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="modal-headline" className="font-bold text-base text-slate-900">
                    Request Site Access
                  </h3>
                  <p className="text-xs text-slate-500">Submit an exemption request to your administrator</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitRequest}>
              <div className="p-6 space-y-4">
                {/* Blocked URL info display */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Requested Resource
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-700">
                    <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{targetBlockedUrl}</span>
                  </div>
                </div>

                {/* Submitter Identity */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your School / Organization Email
                  </label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Description or Reason Input (Prompts user for description or reason) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="request-reason"
                      className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                    >
                      Description or Reason <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Required</span>
                  </div>
                  <textarea
                    id="request-reason"
                    ref={modalInputRef}
                    rows={4}
                    value={reasonText}
                    onChange={(e) => setReasonText(e.target.value)}
                    placeholder="Provide a description or reason explaining why you need access to this website..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none leading-relaxed"
                    required
                  />
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Explain how this site supports educational or organizational objectives.</span>
                  </div>
                </div>

                {/* Administrative Note */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-lg flex items-start gap-2.5 text-xs text-amber-800">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    All access requests are logged under your account ID and reviewed according to Paggle filtering guidelines.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !reasonText.trim()}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
