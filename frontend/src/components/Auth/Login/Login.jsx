//Login.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "../../../../pages/index.css";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((_prev) => ({ ...formData, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  
  if (!formData.email || !formData.email.includes('@')) {
    setError("Email inválido");
    return;
  }
  if (!formData.password) {
    setError("Ingresa tu contraseña");
    return;
  }

  try {
    await onLogin(formData.email, formData.password);
  } catch (err) {
    setError(err.message.includes('fetch') 
      ? "Error de conexión con el servidor"
      : err.message);
  }
};

  return (
    <div className="auth">
      <h2 className="auth__title">Iniciar sesión</h2>
      {/* eslint-disable-next-line no-undef */}
      {error && <p className="auth__error">{error}</p>}
      <form className="auth__form" onSubmit={handleSubmit} autoComplete="on" data-lpignore="true" data-form-type="login">
  <input
    className="auth__input"
    type="email"
    name="email"
    id="login-email"
    value={formData.email}
    onChange={handleChange}
    placeholder="Correo electrónico"
    autoComplete="username email"
    required
    aria-label="Correo electrónico"
    data-lpignore="true"
  />
  <input
    className="auth__input"
    type="password"
    name="password"
    id="login-password"
    value={formData.password}
    onChange={handleChange}
    placeholder="Contraseña"
    required
    minLength="8"
    autoComplete="current-password"
    aria-label="Contraseña"
    data-lpignore="true"
  />
  <button className="auth__button" type="submit">
    Iniciar sesión
  </button>
</form>
      <p className="auth__link">
        ¿Aún no eres miembro?
        <Link className="auth__link-text" to="/signup">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
