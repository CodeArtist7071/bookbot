import { CalendarRange, CheckCircle, Pen, PlusCircle, View, X, Image as ImageIcon, Loader2, Trash2, AlertTriangle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { db } from "../../services/supabase/database";
import { useAuth } from "../../app/providers/AuthProvider";

const StaffCard = ({ member, onEdit, onDelete }) => {
  const skills = Array.isArray(member.skills) ? member.skills : [];
  
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200 hover:border-blue-300 transition-all group">
      <div className="flex items-center gap-4">
        <div
          className="h-16 w-16 rounded-2xl bg-slate-100 bg-cover bg-center border border-slate-100 shrink-0"
          style={{ backgroundImage: member.image_url ? `url(${member.image_url})` : 'none' }}
        >
          {!member.image_url && <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={24}/></div>}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {member.name}
          </h3>

          <p className="text-sm text-slate-500 font-medium">
            {member.role || 'Staff Member'} • {member.rating || '5.0'} ★
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(member)}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition"
          >
            <Pen size={18}/>
          </button>
          <button 
            onClick={() => onDelete(member)}
            className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
          >
            <Trash2 size={18}/>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? skills.map((skill, index) => (
          <span
            key={index}
            className="rounded-lg px-3 py-1 text-xs font-bold bg-slate-100 text-slate-600"
          >
            {skill}
          </span>
        )) : (
          <span className="text-xs text-slate-400 italic">No skills listed</span>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button className="flex-1 h-11 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition active:scale-95">
          <CalendarRange size={18}/>
          Availability
        </button>

        <button className="flex-1 h-11 rounded-xl bg-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-100">
          <CheckCircle size={18}/>
          Shifts
        </button>
      </div>
    </div>
  );
};

const StaffManagement = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    skills: "",
    image_url: ""
  });

  const fetchStaff = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await db.staff.getAll(user.id);
      setStaff(data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setSubmitting(true);
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== "");
      
      await db.staff.create({
        business_id: user.id,
        name: formData.name,
        role: formData.role,
        skills: skillsArray,
        image_url: formData.image_url,
        rating: 5.0,
        is_active: true
      });
      
      setShowModal(false);
      setFormData({ name: "", role: "", skills: "", image_url: "" });
      fetchStaff();
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Failed to add staff member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) return;
    try {
      setSubmitting(true);
      await db.staff.delete(selectedMember.id);
      setShowDeleteModal(false);
      setSelectedMember(null);
      fetchStaff();
    } catch (err) {
      console.error("Error deleting staff:", err);
      alert("Failed to delete staff member. They might be linked to existing bookings.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Staff Management</h1>
          <p className="text-slate-500 mt-1">Manage your team and their schedules</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition active:scale-95"
          >
            <PlusCircle size={20}/>
            Add New Member
          </button>
        </div>
      </div>

      {/* Staff Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-medium">Loading your team...</p>
        </div>
      ) : staff.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-16 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400">
            <PlusCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No staff members yet</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start by adding your first team member to manage their bookings and availability.</p>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition"
          >
            Add First Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <StaffCard 
              key={member.id} 
              member={member} 
              onEdit={() => {}} 
              onDelete={(m) => {
                setSelectedMember(m);
                setShowDeleteModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Add Staff Member</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Role / Title</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Senior Stylist"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Skills (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Haircut, Balayage, Treatment"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Profile Image URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition"
                  />
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
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : "Save Member"}
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
                You are about to remove <span className="font-bold text-slate-900">"{selectedMember?.name}"</span> from your team. This action cannot be undone.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  disabled={submitting}
                  onClick={handleDelete}
                  className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-100 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : "Yes, Remove Member"}
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
};

export default StaffManagement;

