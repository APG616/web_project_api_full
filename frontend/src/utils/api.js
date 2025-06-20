//api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
if (!BASE_URL) {
  console.error('BASE_URL no está definido correctamente');
}

class Api {
    constructor() {
    this._headers = {
      'Content-Type': 'application/json'
    };
  }

  _updateHeaders() {
    const token = localStorage.getItem('jwt');
    this._headers = {
      ...this._headers,
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

   _getHeaders() {
    const token = localStorage.getItem('jwt');
    return {
      ...this._headers,
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }
    async _handleResponse(res) {
    const text = await res.text();
    if (!res.ok) {
      let errorMsg = 'Error en la solicitud';
      try {
        const data = text ? JSON.parse(text) : {};
        errorMsg = data.message || errorMsg;
      } catch {
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }
    return text ? JSON.parse(text) : {};
  }


async signin(email, password) {
  try {
    const url = `${BASE_URL}/signin`;
    console.log('Attempting to sign in to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include', // Necesario para CORS con credenciales
      body: JSON.stringify({ email, password })
    });
    console.log('Response status:', response.status);

    // Verificación adicional de la respuesta
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(errorText || `Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('login successful, received data:', data);
    
    // Verificación del token
    if (!data.token) {
      throw new Error('La respuesta no incluyó un token de autenticación');
    }
    
    return data;
  } catch (error) {
    console.error('Error en signin:', {
      error: error.message,
      stack: error.stack,
      type: error.name
    });
    throw new Error(error.message || 'Error de conexión. Verifica:');
  }
}

async signup(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include', // Necesario para CORS con credenciales
      body: JSON.stringify({
        email,
        password,
        name: 'New User',
        about: 'Explorer',
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Error en signup:', errorData);
      // Manejo específico para email existente
      if (errorData.message.includes('ya existe')) {
        throw new Error('Este email ya está registrado');
      }
      throw new Error(errorData.message || 'Error en el registro');
    }
    const data = await response.json();
    console.log('Signup exitoso, datos recibidos:', data);
    return data;
  } catch (error) {
    console.error('Signup fallido:', error);
    throw error;
  }
}

  async getUserInfo() {
    this._updateHeaders();
    return fetch(`${BASE_URL}/users/me`, {
      headers: this._getHeaders()
    }).then(this._handleResponse);
  }

  async updateUserInfo(data) {
    this._updateHeaders();
    return fetch(`${BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify(data)
    }).then(this._handleResponse);
  }

  async setUserInfo(data) {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify(data)
    });
    return this._handleResponse(response);
  }

  async updateUserAvatar(avatar) {
    this._updateHeaders();
    return fetch(`${BASE_URL}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._getHeaders,
      body: JSON.stringify({ avatar })
    }).then(this._handleResponse);
  }

async setUserAvatar(avatar) {
  const response = await fetch(`${BASE_URL}/users/me/avatar`, {
    method: "PATCH",
    headers: this._getHeaders(),
    body: JSON.stringify({ avatar })
  });
  return this._handleResponse(response);
}

  async getCardList() {
    this._updateHeaders();
    return fetch(`${BASE_URL}/cards`, {
      headers: this._getHeaders()
    }).then(this._handleResponse);
  }

  async addCard({ name, link }) {
    this._updateHeaders();
    return fetch(`${BASE_URL}/cards`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify({ name, link })
    }).then(this._handleResponse);
  }

  async deleteCard(cardId) {
    this._updateHeaders();
    return fetch(`${BASE_URL}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._getHeaders()
    }).then(this._handleResponse);
  }

  async changeLikeCardStatus(cardId, isLiked) {
    this._updateHeaders();
    return fetch(`${BASE_URL}/cards/${cardId}/likes`, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers: this._getHeaders()
    }).then(this._handleResponse);
  }
}

const api = new Api();
export default api;