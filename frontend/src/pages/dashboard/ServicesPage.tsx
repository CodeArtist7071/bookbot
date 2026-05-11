import React, { useEffect, useState } from "react";
import {
  Search,
  DollarSign,
  Clock3,
  Edit3,
  Plus,
  Loader2,
  X,
  AlignLeft,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { db } from "../../services/supabase/database";
import { useAuth } from "../../app/providers/AuthProvider";

function ServiceCard({ service, onEdit, onDelete }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex justify-between items-start transition hover:border-blue-200 ${
        !service.is_active ? "opacity-70 grayscale bg-gray-50" : ""
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <h3 className="text-slate-900 text-lg font-bold">
            {service.name}
          </h3>

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              service.is_active
                ? "bg-green-100 text-green-700"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {service.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed mb-4 max-w-md">
          {service.description}
        </p>

        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-900">
            <DollarSign size={16} className="text-blue-600" />
            <span className="text-base font-bold">
              ${service.price}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock3 size={16} />
            <span className="text-sm font-medium">{service.duration_mins} mins</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onEdit(service)}
          className="p-2 rounded-lg hover:bg-slate-100 transition text-slate-400 hover:text-blue-600"
        >
          <Edit3 size={18} />
        </button>
        <button 
          onClick={() => onDelete(service)}
          className="p-2 rounded-lg hover:bg-red-50 transition text-slate-400 hover:text-red-600"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default function ServiceManagement() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration_mins: "30",
  });

  const fetchServices = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await db.services.getAll(user.id);
      setServices(data || []);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);
      await db.services.create({
        business_id: user.id,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration_mins: parseInt(formData.duration_mins),
        is_active: true
      });

      setShowModal(false);
      setFormData({ name: "", description: "", price: "", duration_mins: "30" });
      fetchServices();
    } catch (err) {
      console.error("Error adding service:", err);
      alert("Failed to add service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    try {
      setSubmitting(true);
      await db.services.delete(selectedService.id);
      setShowDeleteModal(false);
      setSelectedService(null);
      fetchServices();
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("Failed to delete service. It might be linked to existing bookings.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeCount = services.filter(s => s.is_active).length;
  const inactiveCount = services.length - activeCount;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Service Management</h1>
          <p className="text-slate-500">Configure the services you offer on WhatsApp</p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition w-fit"
        >
          <Plus size={20} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Stats Summary */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">
            Active
          </p>
          <h2 className="text-3xl font-black text-slate-900">{activeCount}</h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">
            Inactive
          </p>
          <h2 className="text-3xl font-black text-slate-400">{inactiveCount}</h2>
        </div>
      </section>

      {/* Search */}
      <section>
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search services..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition"
          />
        </div>
      </section>

      {/* Service List */}
      <section className="grid grid-cols-1 gap-4 pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p className="font-medium">Loading your services...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600">
            <p className="font-medium">{error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-500">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Plus size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">No services yet</h3>
            <p className="mb-6">Add your first service to start accepting bookings on WhatsApp.</p>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition"
            >
              Add Service
            </button>
          </div>
        ) : (
          services.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onEdit={() => {}} 
              onDelete={(s) => {
                setSelectedService(s);
                setShowDeleteModal(true);
              }} 
            />
          ))
        )}
      </section>

      {/* Add Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900">New Service</h2>
                <p className="text-slate-500 text-sm">Add a service to your WhatsApp menu</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white rounded-xl text-slate-400 transition shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Plus size={14} className="text-blue-600" /> Service Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Premium Haircut"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <AlignLeft size={14} className="text-blue-600" /> Description
                  </label>
                  <textarea
                    placeholder="Briefly describe the service for your customers..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition min-h-[100px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <DollarSign size={14} className="text-blue-600" /> Price ($)
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Clock3 size={14} className="text-blue-600" /> Duration (mins)
                    </label>
                    <select
                      value={formData.duration_mins}
                      onChange={(e) => setFormData({ ...formData, duration_mins: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition"
                    >
                      <option value="15">15 mins</option>
                      <option value="30">30 mins</option>
                      <option value="45">45 mins</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  disabled={submitting}
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Are you sure?</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                You are about to delete <span className="font-bold text-slate-900">"{selectedService?.name}"</span>. This action cannot be undone.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  disabled={submitting}
                  onClick={handleDelete}
                  className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-100 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : "Yes, Delete Service"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



