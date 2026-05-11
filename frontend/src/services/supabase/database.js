import { supabase } from './client';

/**
 * Database services for BookBot
 */
export const db = {
  // --- Businesses ---
  businesses: {
    async getAll() {
      const { data, error } = await supabase.from('businesses').select('*');
      if (error) throw error;
      return data;
    },
    async getById(id) {
      const { data, error } = await supabase.from('businesses').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
  },

  // --- Services ---
  services: {
    async getAll(businessId) {
      let query = supabase.from('services').select('*');
      if (businessId) {
        query = query.eq('business_id', businessId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    async create(service) {
      const { data, error } = await supabase.from('services').insert([service]).select();
      if (error) throw error;
      return data[0];
    },
    async update(id, updates) {
      const { data, error } = await supabase.from('services').update(updates).eq('id', id).select();
      if (error) throw error;
      return data[0];
    },
    async delete(id) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
  },

  // --- Staff ---
  staff: {
    async getAll(businessId) {
      let query = supabase.from('staff').select('*');
      if (businessId) {
        query = query.eq('business_id', businessId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    async create(staff) {
      const { data, error } = await supabase.from('staff').insert([staff]).select();
      if (error) throw error;
      return data[0];
    },
    async delete(id) {
      const { error } = await supabase.from('staff').delete().eq('id', id);
      if (error) throw error;
    },
  },



  // --- Bookings ---
  bookings: {
    async getAll(businessId) {
      let query = supabase.from('bookings').select(`
        *,
        services (name),
        staff (name)
      `);
      if (businessId) {
        query = query.eq('business_id', businessId);
      }
      const { data, error } = await query.order('booking_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    async getStats(businessId) {
      const { data: total } = await supabase.from('bookings').select('id', { count: 'exact' }).eq('business_id', businessId);
      const { data: pending } = await supabase.from('bookings').select('id', { count: 'exact' }).eq('business_id', businessId).eq('status', 'pending');
      
      return {
        total: total?.length || 0,
        pending: pending?.length || 0
      };
    }
  },

  // --- Reviews ---
  reviews: {
    async getAll(businessId) {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          bookings!inner (business_id)
        `)
        .eq('bookings.business_id', businessId);
      if (error) throw error;
      return data;
    },
    async getAverageRating(businessId) {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          rating,
          bookings!inner (business_id)
        `)
        .eq('bookings.business_id', businessId);
      
      if (error || !data || data.length === 0) return 0;
      const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
      return (sum / data.length).toFixed(1);
    }
  }
};

