import { PlayCircle, CheckCircle2, Circle, AlertCircle, ExternalLink, Copy, Check, Loader2, QrCode as QrIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import QRCode from "react-qr-code";
import { useAuth } from "../../app/providers/AuthProvider";

const steps = [
  { title: "Initialize Session", status: "Ready", type: "active" },
  { title: "Scan QR Code", status: "Pending", type: "pending" },
  { title: "Authentication", status: "Pending", type: "pending" },
  { title: "Ready to Go", status: "Pending", type: "pending" },
];

export default function WhatsAppQRSetup() {
  const { user } = useAuth();
  const [qr, setQr] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'initializing' | 'waiting' | 'connected' | 'error'>('idle');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const newSocket = io("https://codeartist7071.github.io/bookbot/"); // Update with your backend URL
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected");
      newSocket.emit("join", user.id);
      newSocket.emit("whatsapp.checkStatus", user.id);
    });


    newSocket.on("whatsapp.qr", (qrCode: string) => {
      console.log("QR Received");
      setQr(qrCode);
      setStatus('waiting');
    });

    newSocket.on("whatsapp.status", (newStatus: string) => {
      if (newStatus === 'connected') {
        setStatus('connected');
        setQr(null);
      }
    });

    newSocket.on("whatsapp.error", (err: string) => {
      console.error(err);
      setStatus('error');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const startSetup = () => {
    if (!socket || !user) return;
    setStatus('initializing');
    socket.emit('whatsapp.init', user.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <nav className="flex mb-8 text-sm font-medium text-slate-500">
          <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">WhatsApp QR Setup</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Connection Status</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {status === 'connected' ? (
                      <CheckCircle2 className="text-green-500" size={20} />
                    ) : status === 'initializing' || status === 'waiting' ? (
                      <Loader2 className="text-blue-600 animate-spin" size={20} />
                    ) : (
                      <Circle className="text-slate-300" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {status === 'connected' ? 'Connected' : status === 'waiting' ? 'Scanning...' : status === 'initializing' ? 'Initializing...' : 'Disconnected'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {status === 'connected' ? 'Your WhatsApp is active' : 'Waiting for user action'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
              <PlayCircle className="mb-4" size={32} />
              <h4 className="font-bold mb-2">How to Scan?</h4>
              <p className="text-blue-100 text-sm mb-4">Open WhatsApp on your phone → Settings → Linked Devices → Link a Device.</p>
              <a 
                href="https://faq.whatsapp.com/1317564962315842" 
                target="_blank" 
                className="inline-flex bg-white/20 hover:bg-white/30 transition py-2 px-4 rounded-xl text-sm font-bold items-center gap-2"
              >
                Learn More <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* QR Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-slate-200 shadow-sm text-center">
              <h1 className="text-3xl font-black text-slate-900 mb-4">Connect WhatsApp</h1>
              <p className="text-slate-500 mb-10 leading-relaxed max-w-md mx-auto">
                Scan the QR code below with your phone to link your business WhatsApp account to BookBot.
              </p>


              <div className="flex flex-col items-center justify-center space-y-8">
                <div className="relative p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 min-h-[300px] min-w-[300px] flex items-center justify-center">
                  {status === 'connected' ? (
                    <div className="text-center animate-in zoom-in duration-500">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={40} />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">Connected!</h2>
                      <p className="text-slate-500 mb-6">WhatsApp is active and handling bookings.</p>
                      
                      <button 
                        onClick={() => {
                          if (socket && user) {
                            socket.emit('whatsapp.logout', user.id);
                            setStatus('idle');
                            setQr(null);
                          }
                        }}
                        className="text-red-600 font-bold text-sm hover:underline flex items-center gap-2 mx-auto"
                      >
                        <AlertCircle size={16} /> Disconnect WhatsApp
                      </button>
                    </div>
                  ) : qr ? (

                    <div className="bg-white p-4 rounded-2xl shadow-xl animate-in fade-in duration-300">
                      <QRCode value={qr} size={250} level="H" />
                    </div>
                  ) : (
                    <div className="text-slate-400 space-y-4">
                      {status === 'initializing' ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="animate-spin mb-2" size={40} />
                          <p className="font-medium">Requesting QR Code...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <QrIcon className="mb-2 opacity-20" size={64} />
                          <p className="font-medium">QR will appear here</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {status === 'idle' || status === 'error' ? (
                  <button 
                    onClick={startSetup}
                    className="w-full max-w-xs bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    Generate QR Code
                  </button>
                ) : status === 'waiting' ? (
                  <div className="flex items-center gap-2 text-blue-600 font-bold animate-pulse">
                    <Loader2 className="animate-spin" size={20} />
                    Waiting for scan...
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-8 bg-amber-50 border border-amber-100 rounded-3xl p-8 flex items-start gap-4">
              <AlertCircle className="text-amber-500 shrink-0 mt-1" size={24} />
              <div>
                <h5 className="font-bold text-amber-900 mb-1">Security Note</h5>
                <p className="text-amber-700 text-sm leading-relaxed">
                  BookBot does not store your messages. We only use this connection to automate your booking flow. You can disconnect at any time from your phone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}