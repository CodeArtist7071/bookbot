// App.jsx

import { Link } from "react-router-dom";
import { CTASection } from "../../components/landing/CTA";
import { FeaturesSection } from "../../components/landing/Features";
import { HeroSection } from "../../components/landing/Hero";
import { DatabaseIcon, MessageCircle, QrCode } from "lucide-react";



const workflow = [
  {
    title: "qr_code_scanner",
    icon:<QrCode size={24} /> ,
    description:
      "Customers scan your QR code from your store or social media.",
  },
  {
    title:"chat" ,
    icon: <MessageCircle size={24} />,
    description:
      "The AI bot handles appointments and reminders automatically.",
  },
  {
    title: "dashboard",
    icon: <DatabaseIcon size={24} />,
    description:
      "Manage appointments and customer data from one place.",
  },
];

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-blue-600 text-3xl">🤖</div>
          <h1 className="text-2xl font-extrabold">BookBot</h1>
        </div>

        <nav className="hidden md:flex gap-8 text-gray-600 font-medium">
          <a href="#features">Features</a>
          <a href="#workflow">How it works</a>
          <a href="#pricing">Pricing</a>
        </nav>

        <div className="flex gap-4">
          <Link to="/auth/login" className="hidden sm:block font-semibold text-blue-600 flex items-center">
            Login
          </Link>

          <Link to="/auth/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            Start Free Trial
          </Link>
        </div>
      </div>
    </header>
  );
}



function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">
            A seamless experience
          </h2>

          <p className="text-gray-600 text-lg">
            Your customers get an amazing interface, and you get a simple dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {workflow.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border shadow-sm text-center hover:shadow-xl transition"
            >
              <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl text-blue-600">
                  {item.icon}
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>

              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function TestimonialSection() {
  return (
    <section className="py-24 bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="text-yellow-300 text-3xl mb-6">★★★★★</div>

        <blockquote className="text-3xl font-black leading-relaxed mb-10">
          “BookBot transformed how we handle appointments. Our reviews tripled
          in two months.”
        </blockquote>

        <div className="flex items-center justify-center gap-4">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNteJX4jAjstGs2a6sZhiDvYodl-uQ0Bebpq52kXnntJz6qefESsbKn1JC8Jpcg6Lk-t1iFJv3ODx8yp0hUfDda4jT4ZSGvv5XfozzB6GiyPLSAgMNyhGEIwzUDmFwibGF3k-WRjgdd6TCAICbfF3ujrMOHK_4M2RElGM8E4eBQYUszB6JSYZNMGt83Gk52ierTPoU8SQvB80c6Aqag9Rm2_FRCj1w_8Xig5qa1bNJdWGEMb8VEojRd870gUBVxXGRNcAztiJMCfM"
            alt="Sarah"
            className="w-14 h-14 rounded-full object-cover"
          />

          <div className="text-left">
            <p className="font-bold">Sarah Jenkins</p>
            <p className="text-sm text-blue-200">
              Owner, Glow Hair Studio
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}



function Footer() {
  return (
    <footer className="border-t py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-black mb-4">BookBot</h3>

            <p className="text-gray-600">
              Automating local businesses since 2021.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>

            <ul className="space-y-3 text-gray-600">
              <li>Features</li>
              <li>Pricing</li>
              <li>Integrations</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>

            <ul className="space-y-3 text-gray-600">
              <li>About</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>

            <ul className="space-y-3 text-gray-600">
              <li>Help Center</li>
              <li>API Docs</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-14 pt-8 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-4">
          <p>© 2026 BookBot AI Technologies Inc.</p>

          <div className="flex gap-6">
            <a href="/">Privacy</a>
            <a href="/">Terms</a>
            <a href="/">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Landingpage() {
  return (
    <div className="font-sans text-gray-900 bg-white">
      <Header />
      <HeroSection />
      <WorkflowSection />
      <FeaturesSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}