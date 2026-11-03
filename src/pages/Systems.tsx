import { useState } from 'react';
import { useApp } from '../App';
import { generateId } from '../store';
import { Plus, Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import { TechSystem, SystemType } from '../types';

export default function Systems() {
  const { state, setState, addAuditEvent } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<TechSystem>>({ systemType: 'POR_DETERMINAR', autonomousCapacity: false, humanSupervision: true });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const sys: TechSystem = {
      id: generateId(), organizationId: form.organizationId || '', projectId: form.projectId || '',
      identifier: form.identifier || '', name: form.name || '', version: form.version || '1.0.0',
      purpose: form.purpose || '', description: form.description || '', responsible: form.responsible || '',
      affectedProcesses: (form.affectedProcesses || []).filter(Boolean), users: form.users || '',
      systemType: form.systemType as SystemType || 'POR_DETERMINAR', integrations: (form.integrations || []).filter(Boolean),
      dataUsed: form.dataUsed || '', autonomousCapacity: form.autonomousCapacity || false,
      permissions: form.permissions || '', humanSupervision: form.humanSupervision ?? true,
      technicalRisks: form.technicalRisks || '', legalRisks: form.legalRisks || '',
      applicableRegulations: (form.applicableRegulations || []).filter(Boolean),
      documentation: (form.documentation || []).filter(Boolean),
      createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0],
    };
    setState(prev => ({ ...prev, systems: [...prev.systems, sys] }));
    addAuditEvent('CREATE', 'system', sys.id, `Sistema creado: ${sys.name}`);
    setShowForm(false);
    setForm({ systemType: 'POR_DETERMINAR', autonomousCapacity: false, humanSupervision: true });
  };

  const getTypeColor = (t: SystemType) => {
    switch(t) { case 'IA': return 'bg-lavender-100 text-lavender-700'; case 'AUTOMATIZACION': return 'bg-sage-100 text-sage-700'; case 'HIBRIDO': return 'bg-blue-gray-100 text-blue-gray-700'; default: return 'bg-yellow-100 text-yellow-700'; }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-blue-gray-500">No se presupone que cualquier aplicación automatizada sea inteligencia artificial. Se incluye procedimiento para determinar si cumple la definición legal aplicable.</p>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-1.5 bg-sage-600 text-white text-xs rounded-lg hover:bg-sage-700">
          <Plus className="w-3 h-3" /> Nuevo sistema
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-blue-gray-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-blue-gray-800">Registrar sistema tecnológico</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select value={form.organizationId || ''} onChange={e => setForm({...form, organizationId: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" required>
              <option value="">Organización *</option>
              {state.organizations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <input placeholder="Identificador *" value={form.identifier || ''} onChange={e => setForm({...form, identifier: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" required />
            <input placeholder="Nombre *" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" required />
            <input placeholder="Versión" value={form.version || ''} onChange={e => setForm({...form, version: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" />
            <select value={form.systemType || 'POR_DETERMINAR'} onChange={e => setForm({...form, systemType: e.target.value as SystemType})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm">
              <option value="POR_DETERMINAR">Por determinar</option><option value="IA">Inteligencia Artificial</option><option value="AUTOMATIZACION">Automatización</option><option value="HIBRIDO">Híbrido</option>
            </select>
            <input placeholder="Responsable" value={form.responsible || ''} onChange={e => setForm({...form, responsible: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" />
          </div>
          <textarea placeholder="Finalidad" value={form.purpose || ''} onChange={e => setForm({...form, purpose: e.target.value})} className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" rows={2} />
          <textarea placeholder="Descripción" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" rows={2} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.autonomousCapacity || false} onChange={e => setForm({...form, autonomousCapacity: e.target.checked})} /> Capacidad de actuación autónoma</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.humanSupervision ?? true} onChange={e => setForm({...form, humanSupervision: e.target.checked})} /> Supervisión humana</label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-sage-600 text-white text-xs rounded-lg">Registrar</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-blue-gray-100 text-blue-gray-700 text-xs rounded-lg">Cancelar</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {state.systems.map(sys => {
          const org = state.organizations.find(o => o.id === sys.organizationId);
          const isExpanded = expanded === sys.id;
          return (
            <div key={sys.id} className="bg-white rounded-xl border border-blue-gray-100 overflow-hidden">
              <button onClick={() => setExpanded(isExpanded ? null : sys.id)} className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-ivory-50">
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-sage-500" />
                  <div>
                    <span className="font-medium text-blue-gray-800">{sys.name}</span>
                    <span className="text-xs text-blue-gray-500 ml-2">v{sys.version}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(sys.systemType)}`}>{sys.systemType.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-gray-400">{org?.name}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              {isExpanded && (
                <div className="px-5 py-4 border-t border-blue-gray-100 bg-ivory-50 space-y-2 text-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div><span className="text-xs text-blue-gray-500">Finalidad:</span><p className="text-blue-gray-800">{sys.purpose}</p></div>
                    <div><span className="text-xs text-blue-gray-500">Responsable:</span><p className="text-blue-gray-800">{sys.responsible}</p></div>
                    <div><span className="text-xs text-blue-gray-500">Usuarios:</span><p className="text-blue-gray-800">{sys.users}</p></div>
                    <div><span className="text-xs text-blue-gray-500">Autonomía:</span><p className="text-blue-gray-800">{sys.autonomousCapacity ? 'Sí' : 'No'}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><span className="text-xs text-blue-gray-500">Riesgos técnicos:</span><p className="text-blue-gray-700">{sys.technicalRisks || 'No especificados'}</p></div>
                    <div><span className="text-xs text-blue-gray-500">Riesgos jurídicos:</span><p className="text-blue-gray-700">{sys.legalRisks || 'No especificados'}</p></div>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <span className="text-blue-gray-500">Supervisión humana: <strong className={sys.humanSupervision ? 'text-sage-600' : 'text-red-600'}>{sys.humanSupervision ? 'Sí' : 'No'}</strong></span>
                    <span className="text-blue-gray-500">Normativa: {sys.applicableRegulations.join(', ') || 'No asignada'}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {state.systems.length === 0 && <p className="text-center py-8 text-sm text-blue-gray-400">No hay sistemas registrados</p>}
      </div>
    </div>
  );
}
