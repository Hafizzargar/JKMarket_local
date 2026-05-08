const { supabase } = require('../config/supabase');

exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone, role } = req.body;
    
    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // 2. Create entry in our users table
    if (authData.user) {
      const { error: dbError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email,
          full_name,
          phone,
          role: role || 'buyer'
        }]);
      
      if (dbError) throw dbError;
    }

    res.status(201).json({ message: 'User registered successfully', user: authData.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.me = async (req, res) => {
  res.json(req.user);
};

exports.logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};