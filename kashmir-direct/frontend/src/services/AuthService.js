import { supabase } from '../lib/supabase';

/**
 * 🛡️ IDENTITY GUARD SERVICE
 * This service abstracts the underlying authentication provider.
 * It provides a "Black Box" for login/logout logic, making it 
 * difficult for external observers to map the UI to specific DB calls.
 */
class AuthService {
  /**
   * Performs high-fidelity authentication.
   * @param {string} identifier - The user's credential (email)
   * @param {string} secret - The user's password
   */
  async executeAuthentication(identifier, secret) {
    console.log('🛡️ [Identity Guard] Commencing secure handshake...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password: secret,
    });

    if (error) {
      console.error('🛡️ [Identity Guard] Handshake failed:', error.message);
    } else {
      console.log('🛡️ [Identity Guard] Protocol valid. Access granted.');
    }

    return { data, error };
  }

  /**
   * Terminates the active secure session.
   */
  async terminateSession() {
    console.log('🛡️ [Identity Guard] Purging active session...');
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  /**
   * Generates a secure registration node.
   */
  async forgeIdentity(email, password, metadata = {}) {
    console.log('🛡️ [Identity Guard] Forging new identity node...');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    return { data, error };
  }
}

export const identityGuard = new AuthService();
