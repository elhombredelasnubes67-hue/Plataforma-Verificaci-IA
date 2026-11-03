import { useState } from 'react';
import { useApp } from '../App';
import { generateId, computeHash } from '../store';
import { FileSearch, Shield, AlertTriangle, Plus } from 'lucide-react';
import { Evidence as EvidenceType } from '../types';

export default function Evidence() {
  const { state, setState, user, addAuditEvent } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'DOCUMENTO', content: '', confidentiality: 'RESTRINGIDA' as EvidenceType['confidentiality'] });
  const [integrityCheck, setIntegrityCheck] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const hash = computeHash(form.content);
    const ev: EvidenceType = {
      id: generateId(), type: form.type, origin: 'MANUAL', date: new Date().toISOString().split('T')[0],
      author: user.id, sha256: hash, location: 'local-storage', confidentiality: form.confidentiality,
      version: '1.0', retention: '7 años', status: 'ACTIVA', content: form.content,
    };
    setState(prev => ({ ...prev, evidence: [...prev.evidence, ev] }));
    addAuditEvent('CREATE', 'evidence', ev.id, `Evidencia creada: ${form.type}`);
    setShowForm(false);
    setForm({ type: 'DOCUMENTO', content: '', confidentiality: 'RESTRINGIDA' });
  };

  const verifyIntegrity = (evId: string) => {
    const ev = state.evidence.find(e => e.id === evId);
    if (!ev) return;
    const currentHash = computeHash(ev.content);
    if (currentHash === ev.sha256) {
      setIntegrityCheck(`✓ Integridad verificada para ${ev.id.substring(0, 8)}... Hash coincidente.`);
    } else {
      setIntegrityCheck(`✗ ALTERACIÓN DETECTADA en ${ev.id.substring(0, 8)}... Hash esperado: ${ev.sha256}, Hash actual: ${currentHash}`);
    }
  };

  const tamperEvidence = (evId: string) => {
    setState(prev => ({
      ...prev,
      evidence: prev.evidence.map(e => e.id === evId ? { ...e, content: e.content + ' [ALTERADO]' } : e)
    }));
    addAuditEvent('TAMPER', 'evidence', evId, 'Evidencia alterada manualmente (prueba de integridad)');
    setIntegrityCheck('Evidencia alterada. Verifique integridad para detectar el cambio.');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-blue-gray-500">Gestor de evidencias con integridad criptográfica. Cada evidencia conserva hash SHA-256 para detección de alteraciones.</p>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-1.5 bg-sage-600 text-white text-xs rounded-lg hover:bg-sage-700">
          <Plus className="w-3 h-3" /> Nueva evidencia
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-blue-gray-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-blue-gray-800">Registrar evidencia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm">
              <option>DOCUMENTO</option><option>CAPTURA</option><option>REGISTRO</option><option>RESPUESTA_IA</option><option>AUTORIZACION</option><option>RESULTADO_PRUEBA</option>
            </select>
            <select value={form.confidentiality} onChange={e => setForm({...form, confidentiality: e.target.value as EvidenceType['confidentiality']})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm">
              <option value="PUBLICA">Pública</option><option value="RESTRINGIDA">Restringida</option><option value="CONFIDENCIAL">Confidencial</option>
            </select>
          </div>
          <textarea placeholder="Contenido de la evidencia *" value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg text-sm font-mono" rows={4} required />
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-sage-600 text-white text-xs rounded-lg">Registrar con hash</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-blue-gray-100 text-blue-gray-700 text-xs rounded-lg">Cancelar</button>
          </div>
        </form>
      )}

      {integrityCheck && (
        <div className={`p-3 rounded-lg text-sm ${integrityCheck.startsWith('✓') ? 'bg-sage-50 text-sage-700 border border-sage-200' : integrityCheck.startsWith('✗') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
          {integrityCheck}
          <button onClick={() => setIntegrityCheck(null)} className="ml-2 text-xs underline">Cerrar</button>
        </div>
      )}

      <div className="space-y-2">
        {state.evidence.map(ev => (
          <div key={ev.id} className="bg-white rounded-lg border border-blue-gray-100 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FileSearch className="w-4 h-4 text-sage-500" />
                  <span className="text-sm font-medium text-blue-gray-800">{ev.type}</span>
                  <span className={`px-2 py-0.5 text-[10px] rounded-full ${ev.confidentiality === 'CONFIDENCIAL' ? 'bg-red-100 text-red-700' : ev.confidentiality === 'RESTRINGIDA' ? 'bg-yellow-100 text-yellow-700' : 'bg-sage-100 text-sage-700'}`}>{ev.confidentiality}</span>
                </div>
                <p className="text-xs text-blue-gray-600 font-mono bg-ivory-50 p-2 rounded mt-1 max-h-20 overflow-y-auto">{ev.content}</p>
                <div className="flex gap-4 mt-2 text-[10px] text-blue-gray-500">
                  <span>Hash: <code className="font-mono">{ev.sha256}</code></span>
                  <span>Fecha: {ev.date}</span>
                  <span>Autor: {state.users.find(u => u.id === ev.author)?.name || ev.author}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => verifyIntegrity(ev.id)} className="px-2 py-1 bg-sage-50 text-sage-700 text-[10px] rounded border border-sage-200 hover:bg-sage-100">Verificar</button>
                <button onClick={() => tamperEvidence(ev.id)} className="px-2 py-1 bg-red-50 text-red-700 text-[10px] rounded border border-red-200 hover:bg-red-100">Alterar (test)</button>
              </div>
            </div>
          </div>
        ))}
        {state.evidence.length === 0 && <p className="text-center py-8 text-sm text-blue-gray-400">No hay evidencias registradas. Ejecute pruebas en el Laboratorio para generar evidencias automáticamente.</p>}
      </div>

      <div className="bg-blue-gray-50 border border-blue-gray-200 rounded-lg p-3">
        <p className="text-xs text-blue-gray-600"><Shield className="w-3 h-3 inline mr-1" />No se declara inmutabilidad absoluta si el almacenamiento y las huellas están bajo una misma autoridad. Se prepara la posibilidad de sellado temporal o anclaje externo.</p>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <p className="text-xs text-red-700"><AlertTriangle className="w-3 h-3 inline mr-1" />Pruebe a alterar una evidencia y luego verifique su integridad para comprobar la detección de alteraciones.</p>
      </div>
    </div>
  );
}
