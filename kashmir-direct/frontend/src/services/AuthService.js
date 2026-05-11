import { supabase } from '../lib/supabase';

/**
 * 🛡️ IDENTITY GUARD SERVICE
 * This service abstracts the underlying authentication provider.
 */
class AuthService {
  /**
   * Performs high-fidelity authentication with timestamped logging and 30s timeout.
   */
  async executeAuthentication(identifier, secret) {
    const startTime = Date.now();
    console.log(`🛡️ [Account] [${startTime}] Login started for: ${identifier}`);
    
    // ⏱️ EXTENDED TIMEOUT: 30 seconds for slow/mobile connections
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Account Connection Timed Out (30s)')), 30000)
    );

    try {
      const authPromise = supabase.auth.signInWithPassword({
        email: identifier,
        password: secret,
      });

      const { data, error } = await Promise.race([authPromise, timeoutPromise]);
      const endTime = Date.now();
      const duration = endTime - startTime;

      if (error) {
        console.error(`🛡️ [Account] [${endTime}] Login failed after ${duration}ms:`, error.message);
      } else {
        console.log(`🛡️ [Account] [${endTime}] Login successful. Welcome.`);
      }

      return { data, error };
    } catch (err) {
      const errorTime = Date.now();
      console.error(`🛡️ [Account] [${errorTime}] Login error:`, err.message);
      return { data: null, error: { message: err.message || 'Connection Timeout' } };
    }
  }

  async terminateSession() {
    console.log('🛡️ [Account] Global session termination in progress...');
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      return { error };
    } catch (err) {
      return { error: err };
    }
  }

  async forgeIdentity(email, password, metadata = {}) {
    console.log('🛡️ [Account] Creating account...');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }
}

export const identityGuard = new AuthService();
