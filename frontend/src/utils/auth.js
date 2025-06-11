//auth.js
const Auth = {
  login(token) {
    localStorage.setItem('jwt', token);
  },

  logout() {
    localStorage.removeItem('jwt');
  },

  isLoggedIn() {
    return !!localStorage.getItem('jwt');
  },

  // Verificación simple del token
  async checkAuth() {
    const token = localStorage.getItem('jwt');
    if (!token) return false;
    
    try {
      const response = await fetch('http://localhost:3000/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
};

export default Auth;