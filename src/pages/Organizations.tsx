import { useState } from 'react';
import { useApp } from '../App';
import { generateId } from '../store';
import { Plus, Building2, AlertCircle } from 'lucide-react';
import { Organization } from '../types';

export default function Organizations() {
  const { state, setState, addAuditEvent } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'REAL' | 'SYNTHETIC'>('ALL');
  const [form, setForm] = useState<Partial<Organization>>({ status: 'ACTIVO', isSynthetic: false, country: 'España' });

  const filtered = state.organizations.filter(o => {
    if (filter === 'REAL') return !o.isSynthetic;
    if (filter === 'SYNTHETIC') return o.isSynthetic;
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const org: Organization = {
      id: generateId(), name: form.name || '', identifier: form.identifier || '', sector: form.sector || '',
      country: form.country || '', activity: form.activity || '', responsibleUnit: form.responsibleUnit || '',
      authorizedContact: form.authorizedContact || '', contractStatus: form.contractStatus || '',
      evaluationScope: form.evaluationScope || '', restrictions: form.restrictions || '',
      startDate: form.startDate || new Date().toISOString().split('T')[0], endDate: form.endDate,
      status: form.status as Organization['status'] || 'ACTIVO', isSynthetic: form.isSynthetic || false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setState(prev => ({ ...prev, organizations: [...prev.organizations, org] }));
    addAuditEvent('CREATE', 'organization', org.id, `Organización creada: ${org.name}`);
    setShowForm(false);
    setForm({ status: 'ACTIVO', isSynthetic: false, country: 'España' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(['ALL', 'REAL', 'SYNTHETIC'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${filter === f ? 'bg-blue-gray-900 text-white' : 'bg-white border border-blue-gray-200 text-blue-gray-600 hover:bg-blue-gray-50'}`}>
              {f === 'ALL' ? 'Todas' : f === 'REAL' ? 'Reales' : 'Sintéticas'}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-1.5 bg-sage-600 text-white text-xs rounded-lg hover:bg-sage-700">
          <Plus className="w-3 h-3" /> Nueva organización
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-blue-gray-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-blue-gray-800">Nueva organización</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Nombre *" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" required />
            <input placeholder="Identificador *" value={form.identifier || ''} onChange={e => setForm({...form, identifier: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" required />
            <input placeholder="Sector" value={form.sector || ''} onChange={e => setForm({...form, sector: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" />
            <input placeholder="País" value={form.country || ''} onChange={e => setForm({...form, country: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" />
            <input placeholder="Actividad" value={form.activity || ''} onChange={e => setForm({...form, activity: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" />
            <input placeholder="Contacto autorizado" value={form.authorizedContact || ''} onChange={e => setForm({...form, authorizedContact: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" />
            <select value={form.status || 'ACTIVO'} onChange={e => setForm({...form, status: e.target.value as Organization['status']})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm">
              <option value="ACTIVO">Activo</option><option value="INACTIVO">Inactivo</option><option value="EN_EVALUACION">En evaluación</option><option value="SINTETICO">Sintético</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-blue-gray-700">
              <input type="checkbox" checked={form.isSynthetic || false} onChange={e => setForm({...form, isSynthetic: e.target.checked})} className="rounded" />
              Organización sintética (demostración)
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-sage-600 text-white text-xs rounded-lg hover:bg-sage-700">Crear</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-blue-gray-100 text-blue-gray-700 text-xs rounded-lg">Cancelar</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-blue-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-gray-50 border-b border-blue-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-blue-gray-600">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-blue-gray-600">Identificador</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-blue-gray-600">Sector</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-blue-gray-600">País</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-blue-gray-600">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-blue-gray-600">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-gray-100">
              {filtered.map(org => (
                <tr key={org.id} className="hover:bg-ivory-50">
                  <td className="px-4 py-3 font-medium text-blue-gray-800">{org.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-blue-gray-600">{org.identifier}</td>
                  <td className="px-4 py-3 text-blue-gray-600">{org.sector}</td>
                  <td className="px-4 py-3 text-blue-gray-600">{org.country}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs rounded-full ${org.status === 'ACTIVO' ? 'bg-sage-100 text-sage-700' : org.status === 'SINTETICO' ? 'bg-lavender-100 text-lavender-700' : 'bg-blue-gray-100 text-blue-gray-600'}`}>{org.status}</span></td>
                  <td className="px-4 py-3">{org.isSynthetic ? <span className="flex items-center gap-1 text-xs text-lavender-600"><AlertCircle className="w-3 h-3" /> Sintética</span> : <span className="text-xs text-sage-600">Real</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center py-8 text-sm text-blue-gray-400">No hay organizaciones registradas</p>}
      </div>

      <div className="bg-ivory-100 border border-ivory-200 rounded-lg p-3">
        <p className="text-xs text-blue-gray-600"><Building2 className="w-3 h-3 inline mr-1" />Se distinguen expresamente organizaciones reales de organizaciones sintéticas de demostración. No se presentan empresas investigadas como clientes efectivos sin colaboración autorizada.</p>
      </div>
    </div>
  );
}
