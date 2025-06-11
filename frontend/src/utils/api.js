//api.js
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tu-backend-en-google-cloud.com' 
  : 'http://localhost:3000';

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
    const token = localStorage.getItem("jwt");
    return {
      "Content-Type": this.contentType,
      ...(token && {Authorization: `Bearer ${token}`})
    };
  }

  async _handleResponse(res) {
    if (!res.ok) {
      return res.json().then(err => {
        throw new Error(err.message || 'Algo salió mal');
      });
    }
    return res.json();
  }

  async signin(email, password) {
    this._updateHeaders();
    return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({ email, password })
    }).then(this._handleResponse);
  }

  async signup(email, password, name) {
    this._updateHeaders();
    return fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({ email, password, name })
    }).then(this._handleResponse);
  }

  async getUserInfo() {
    this._updateHeaders();
    return fetch(`${BASE_URL}/users/me`, {
      headers: this._headers
    }).then(this._handleResponse);
  }

  async updateUserInfo(data) {
    this._updateHeaders();
    return fetch(`${BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
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
      headers: this._headers,
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
      headers: this._headers
    }).then(this._handleResponse);
  }

  async addCard({ name, link }) {
    this._updateHeaders();
    return fetch(`${BASE_URL}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({ name, link })
    }).then(this._handleResponse);
  }

  async deleteCard(cardId) {
    this._updateHeaders();
    return fetch(`${BASE_URL}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers
    }).then(this._handleResponse);
  }

  async changeLikeCardStatus(cardId, isLiked) {
    this._updateHeaders();
    return fetch(`${BASE_URL}/cards/${cardId}/likes`, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers: this._headers
    }).then(this._handleResponse);
  }
}

const api = new Api();
export default api;