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
    console.log(`🛡️ [Identity Guard] [${startTime}] Handshake initiated for: ${identifier}`);
    
    // ⏱️ EXTENDED TIMEOUT: 30 seconds for slow/mobile connections
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Identity Vault Connection Timed Out (30s)')), 30000)
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
        console.error(`🛡️ [Identity Guard] [${endTime}] Handshake failed after ${duration}ms:`, error.message);
      } else {
        console.log(`🛡️ [Identity Guard] [${endTime}] Protocol valid. Access granted in ${duration}ms.`);
      }

      return { data, error };
    } catch (err) {
      const errorTime = Date.now();
      console.error(`🛡️ [Identity Guard] [${errorTime}] Critical Handshake Failure:`, err.message);
      return { data: null, error: { message: err.message || 'Connection Timeout' } };
    }
  }

  async terminateSession() {
    console.log('🛡️ [Identity Guard] Purging active session...');
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      return { error: err };
    }
  }

  async forgeIdentity(email, password, metadata = {}) {
    console.log('🛡️ [Identity Guard] Forging new identity node...');
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
