import React, { useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from '../../app/providers/AuthProvider';
import { Download, Copy, Check, MessageCircle } from "lucide-react";
import { WHATSAPP_LOGO } from "../../constants/images";

type QRCodePageProps = {
  businessPhone?: string | null;
  businessName?: string | null;
  welcomeMessage?: string;
};

const QRCodePage: React.FC<QRCodePageProps> = ({
  businessPhone,
  businessName,
  welcomeMessage = "Hi! I want to book an appointment.",
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  // Debug: Log user data
  console.log("QRCodePage: User data:", user);
  console.log("QRCodePage: User metadata:", user?.user_metadata);

  const resolvedBusinessPhone =
    businessPhone ?? (user?.user_metadata?.phone as string | undefined) ?? null;
  const resolvedBusinessName =
    businessName ?? (user?.user_metadata?.business_name as string | undefined) ?? null;

  // Debug: Log resolved values
  console.log("QRCodePage: Resolved phone:", resolvedBusinessPhone);
  console.log("QRCodePage: Resolved business name:", resolvedBusinessName);

  const whatsappLink = useMemo(() => {
    if (!resolvedBusinessPhone) {
      console.warn("QRCodePage: No business phone available");
      return "";
    }
    
    // Clean phone number for WhatsApp: remove all non-digits and ensure it has country code
    let cleanPhone = resolvedBusinessPhone.replace(/\D/g, '');
    
    // If phone doesn't start with country code pattern, add default
    if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
      // Assume India (+91) for 10-digit numbers
      cleanPhone = '91' + cleanPhone;
    }
    
    // Remove leading + if present (wa.me doesn't need it)
    cleanPhone = cleanPhone.replace(/^\+/, '');
    
    const message = (welcomeMessage ?? "").replace(
      /\{\{\s*business_name\s*\}\}/g,
      resolvedBusinessName ?? "your business"
    );
    
    const link = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    console.log("QRCodePage: Original phone:", resolvedBusinessPhone);
    console.log("QRCodePage: Cleaned phone:", cleanPhone);
    console.log("QRCodePage: Generated WhatsApp link:", link);
    return link;
  }, [resolvedBusinessPhone, welcomeMessage, resolvedBusinessName]);

  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const pngFile = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = "business-qr-code.png";
    downloadLink.href = pngFile;
    downloadLink.click();
  };

  const copyLink = async () => {
    if (!whatsappLink) return;
    await navigator.clipboard.writeText(whatsappLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Grow Your Business</h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Share this QR code in your shop or on social media. 
          Customers scan it to start booking on WhatsApp instantly.
        </p>

        {!resolvedBusinessPhone ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-10 text-slate-600 mb-8">
            <p className="font-bold text-slate-900 mb-1">Business phone not configured</p>
            <p className="text-sm text-slate-500">
              Add your business phone number in your profile/settings, then come back to generate the QR code.
            </p>
          </div>
        ) : (
          <div className="relative inline-block p-8 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 mb-8 group transition-all hover:border-blue-400">
            <div className="bg-white p-6 rounded-3xl shadow-xl">
              <QRCodeCanvas
                id="qr-code-canvas"
                value={whatsappLink}
                size={220}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: WHATSAPP_LOGO,
                  x: undefined,
                  y: undefined,
                  height: 44,
                  width: 44,
                  excavate: true,
                }}
              />
            </div>

            <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-3 rounded-2xl shadow-lg animate-bounce">
              <MessageCircle size={24} />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={downloadQRCode}
            disabled={!whatsappLink}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition active:scale-95"
          >
            <Download size={20} />
            Download PNG
          </button>
          
          <button
            onClick={copyLink}
            disabled={!whatsappLink}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition active:scale-95 disabled:opacity-60"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            {copied ? "Copied" : "Copy Link"}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="p-1 bg-blue-600 text-white rounded-lg text-[10px]">PRO TIP</span>
          How it works
        </h3>
        <p className="text-sm text-blue-700 leading-relaxed">
          When a customer scans this code, it opens a WhatsApp chat with your business 
          pre-filled with a greeting. Our AI bot takes over from there to handle the booking.
        </p>
      </div>
    </div>
  );
};

export default QRCodePage;

