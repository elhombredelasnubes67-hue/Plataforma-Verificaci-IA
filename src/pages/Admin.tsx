import { useState } from 'react';
import { useApp } from '../App';
import { generateId } from '../store';
import { Settings, Users, Shield, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { User, UserRole } from '../types';

export default function Admin() {
  const { state, setState, user, addAuditEvent } = useApp();
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'LECTOR' as UserRole });
  const [activeTab, setActiveTab] = useState<'users' | 'audit' | 'platform' | 'maturity'>('users');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const u: User = {
      id: generateId(), name: newUser.name, email: newUser.email, role: newUser.role,
      createdAt: new Date().toISOString().split('T')[0], active: true,
    };
    setState(prev => ({ ...prev, users: [...prev.users, u] }));
    addAuditEvent('CREATE_USER', 'user', u.id, `Usuario creado: ${u.name} (${u.role})`);
    setShowUserForm(false);
    setNewUser({ name: '', email: '', role: 'LECTOR' });
  };

  const toggleUser = (userId: string) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId ? { ...u, active: !u.active } : u)
    }));
    addAuditEvent('TOGGLE_USER', 'user', userId, 'Estado de usuario modificado');
  };

  const revokeSession = (userId: string) => {
    addAuditEvent('REVOKE_SESSION', 'user', userId, 'Sesión revocada');
  };

  const maturityLevels = ['DISENADO', 'IMPLEMENTADO', 'PROBADO_LOCAL', 'PROBADO_CLOUD', 'VALIDADO_SINTETICO', 'VALIDADO_USUARIOS', 'VALIDADO_PILOTO', 'REVISADO_EXTERNO', 'DISPONIBLE_COMERCIAL'];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-blue-gray-200 pb-2">
        {(['users', 'audit', 'platform', 'maturity'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs rounded-lg ${activeTab === tab ? 'bg-blue-gray-900 text-white' : 'bg-white border border-blue-gray-200 text-blue-gray-600'}`}>
            {tab === 'users' ? 'Usuarios' : tab === 'audit' ? 'Auditoría' : tab === 'platform' ? 'Plataforma' : 'Madurez'}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-blue-gray-800 flex items-center gap-2"><Users className="w-4 h-4" /> Gestión de usuarios y roles</h3>
            <button onClick={() => setShowUserForm(!showUserForm)} className="flex items-center gap-1 px-3 py-1.5 bg-sage-600 text-white text-xs rounded-lg">
              <Plus className="w-3 h-3" /> Nuevo usuario
            </button>
          </div>

          {showUserForm && (
            <form onSubmit={handleCreateUser} className="bg-white rounded-xl border border-blue-gray-200 p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input placeholder="Nombre *" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" required />
                <input placeholder="Email *" type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" required />
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm">
                  {(['ADMINISTRADOR', 'RESPONSABLE_ORGANIZACION', 'INVESTIGADOR', 'EJECUTOR', 'REVISOR_INTERNO', 'REVISOR_EXTERNO', 'AUDITOR', 'LECTOR'] as UserRole[]).map(r => (
                    <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-sage-600 text-white text-xs rounded-lg">Crear</button>
                <button type="button" onClick={() => setShowUserForm(false)} className="px-4 py-2 bg-blue-gray-100 text-blue-gray-700 text-xs rounded-lg">Cancelar</button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-xl border border-blue-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-blue-gray-50 border-b border-blue-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-blue-gray-600">Nombre</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-blue-gray-600">Email</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-blue-gray-600">Rol</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-blue-gray-600">Estado</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-blue-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-gray-100">
                {state.users.map(u => (
                  <tr key={u.id} className="hover:bg-ivory-50">
                    <td className="px-4 py-2 font-medium text-blue-gray-800">{u.name}</td>
                    <td className="px-4 py-2 text-xs text-blue-gray-600">{u.email}</td>
                    <td className="px-4 py-2"><span className="px-2 py-0.5 text-[10px] bg-lavender-100 text-lavender-700 rounded-full">{u.role.replace(/_/g, ' ')}</span></td>
                    <td className="px-4 py-2"><span className={`px-2 py-0.5 text-[10px] rounded-full ${u.active ? 'bg-sage-100 text-sage-700' : 'bg-red-100 text-red-700'}`}>{u.active ? 'Activo' : 'Inactivo'}</span></td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1">
                        <button onClick={() => toggleUser(u.id)} className="px-2 py-0.5 text-[10px] bg-yellow-50 text-yellow-700 rounded border border-yellow-200">{u.active ? 'Desactivar' : 'Activar'}</button>
                        <button onClick={() => revokeSession(u.id)} className="px-2 py-0.5 text-[10px] bg-red-50 text-red-700 rounded border border-red-200">Revocar sesión</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-blue-gray-800 flex items-center gap-2"><Shield className="w-4 h-4" /> Registro de auditoría ({state.auditEvents.length} eventos)</h3>
          <div className="bg-white rounded-xl border border-blue-gray-100 overflow-hidden max-h-96 overflow-y-auto">
            {state.auditEvents.slice().reverse().map(ev => (
              <div key={ev.id} className="px-4 py-2 border-b border-blue-gray-50 hover:bg-ivory-50 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-blue-gray-400 font-mono">{new Date(ev.timestamp).toLocaleString('es-ES')}</span>
                  <span className="font-medium text-blue-gray-700">{ev.action}</span>
                  <span className="text-blue-gray-500">{ev.details}</span>
                  <span className="ml-auto text-[10px] text-blue-gray-400">{state.users.find(u => u.id === ev.userId)?.name || ev.userId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'platform' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-blue-gray-800">Autoevaluación de la plataforma</h3>
          <div className="bg-white rounded-xl border border-blue-gray-100 p-5 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div><span className="text-xs text-blue-gray-500">Versión</span><p className="font-mono text-sm text-blue-gray-800">{state.selfAssessment.version}</p></div>
              <div><span className="text-xs text-blue-gray-500">Entorno</span><p className="text-sm text-blue-gray-800">{state.selfAssessment.environment}</p></div>
              <div><span className="text-xs text-blue-gray-500">Madurez</span><p className="text-sm text-sage-600 font-medium">{state.platformMaturity.replace(/_/g, ' ')}</p></div>
              <div><span className="text-xs text-blue-gray-500">Última verificación</span><p className="text-sm text-blue-gray-800">{state.selfAssessment.lastVerification}</p></div>
              <div><span className="text-xs text-blue-gray-500">Última recuperación</span><p className="text-sm text-blue-gray-800">{state.selfAssessment.lastRecovery}</p></div>
              <div><span className="text-xs text-blue-gray-500">Pruebas superadas</span><p className="text-sm text-sage-600">{state.selfAssessment.testsPassed}</p></div>
            </div>
            <div className="p-3 bg-ivory-100 rounded-lg">
              <p className="text-xs text-blue-gray-600">Módulos operativos: Centro de Mando, Organizaciones, Sistemas, Afirmaciones, Normativa, Controles, Laboratorio, Evidencias, Revisiones, Informes, Recuperación, Demostración, Observatorio, Administración.</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-800"><AlertTriangle className="w-3 h-3 inline mr-1" />Limitaciones: Entorno de navegador (sin backend Cloudflare Workers). Persistencia local (sin D1). Sin conectores externos activos. Sin sellado temporal verificado.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'maturity' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-blue-gray-800">Criterios de madurez</h3>
          <div className="bg-white rounded-xl border border-blue-gray-100 p-5">
            <div className="space-y-2">
              {maturityLevels.map((level, idx) => {
                const currentIdx = maturityLevels.indexOf(state.platformMaturity);
                const isActive = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div key={level} className={`flex items-center gap-3 p-2 rounded-lg ${isCurrent ? 'bg-sage-50 border border-sage-200' : isActive ? 'bg-ivory-50' : 'opacity-50'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-sage-500 text-white' : 'bg-blue-gray-200 text-blue-gray-500'}`}>{idx + 1}</div>
                    <span className={`text-sm ${isActive ? 'text-blue-gray-800 font-medium' : 'text-blue-gray-500'}`}>{level.replace(/_/g, ' ')}</span>
                    {isCurrent && <span className="ml-auto text-[10px] bg-sage-500 text-white px-2 py-0.5 rounded-full">ACTUAL</span>}
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-blue-gray-500 mt-3">La plataforma no puede asignarse automáticamente estados superiores. Cada transición requiere verificación real.</p>
          </div>
        </div>
      )}
    </div>
  );
}
