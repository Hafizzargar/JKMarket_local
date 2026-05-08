const { supabase } = require('../config/supabase');

exports.getAllSellers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sellers')
      .select('*, users(full_name, avatar_url)')
      .eq('is_verified', true);
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSellerById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('sellers')
      .select('*, users(full_name, avatar_url)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: 'Seller not found' });
  }
};

exports.createSellerProfile = async (req, res) => {
  try {
    const { shop_name, description, location, whatsapp_number } = req.body;
    const { data, error } = await supabase
      .from('sellers')
      .insert([{
        user_id: req.user.id,
        shop_name,
        description,
        location,
        whatsapp_number
      }])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSellerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Ensure the user is the owner
    const { data: seller } = await supabase
      .from('sellers')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (!seller || seller.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to update this profile' });
    }

    const { data, error } = await supabase
      .from('sellers')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};