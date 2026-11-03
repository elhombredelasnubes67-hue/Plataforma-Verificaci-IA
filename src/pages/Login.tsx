import { useState } from 'react';
import { useApp } from '../App';
import { Shield, AlertTriangle } from 'lucide-react';

export default function Login() {
  const { login, state } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!login(email)) {
      setError('Credenciales no válidas. Verifique su correo electrónico.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-gray-50 via-ivory-50 to-lavender-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-gray-900 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-sage-400" />
          </div>
          <h1 className="text-2xl font-bold text-blue-gray-900">SAE VERITAS</h1>
          <p className="text-sm text-blue-gray-600 mt-1">Plataforma de Verificación Independiente</p>
          <p className="text-xs text-blue-gray-500 mt-1">Prof. Manuel Gago Fernández — Noviembre 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-blue-gray-100 p-6">
          <h2 className="text-lg font-semibold text-blue-gray-800 mb-4">Acceso al sistema</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-gray-700 mb-1">Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg focus:ring-2 focus:ring-sage-400 focus:border-sage-400 text-sm"
              placeholder="usuario@saeveritas.org" required />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button type="submit" className="w-full py-2.5 bg-blue-gray-900 text-white rounded-lg font-medium text-sm hover:bg-blue-gray-800 transition-colors">
            Iniciar sesión
          </button>

          <div className="mt-4 p-3 bg-lavender-50 border border-lavender-200 rounded-lg">
            <p className="text-xs font-medium text-lavender-500 mb-1">Cuentas de demostración:</p>
            <div className="space-y-0.5">
              {state.users.map(u => (
                <button key={u.id} type="button" onClick={() => setEmail(u.email)}
                  className="block w-full text-left text-xs text-blue-gray-600 hover:text-sage-600 py-0.5">
                  {u.email} <span className="text-blue-gray-400">({u.role})</span>
                </button>
              ))}
            </div>
          </div>
        </form>

        <p className="text-center text-[10px] text-blue-gray-400 mt-4">
          La credibilidad de SAE Veritas depende exclusivamente de aquello que sea capaz de demostrar.
        </p>
      </div>
    </div>
  );
}
