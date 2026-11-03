import { useState } from 'react';
import { useApp } from '../App';
import { generateId, canPromoteEvidenceLevel } from '../store';
import { Plus, ArrowUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Claim, EvidenceLevel } from '../types';

export default function Claims() {
  const { state, setState, user, addAuditEvent } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Claim>>({ evidenceLevel: 'E0', status: 'BORRADOR' });
  const [promotionMsg, setPromotionMsg] = useState<{claimId: string; msg: string; ok: boolean} | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const claim: Claim = {
      id: generateId(), systemId: form.systemId || '', organizationId: form.organizationId || '',
      text: form.text || '', source: form.source || '', date: form.date || new Date().toISOString().split('T')[0],
      responsible: form.responsible || '', evidenceLevel: 'E0', justification: form.justification || '',
      documents: [], controls: [], tests: [], results: '', limitations: form.limitations || '',
      status: 'BORRADOR', createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0],
      history: [],
    };
    setState(prev => ({ ...prev, claims: [...prev.claims, claim] }));
    addAuditEvent('CREATE', 'claim', claim.id, `Afirmación creada: "${claim.text.substring(0, 50)}..."`);
    setShowForm(false);
    setForm({ evidenceLevel: 'E0', status: 'BORRADOR' });
  };

  const promoteClaim = (claimId: string) => {
    const claim = state.claims.find(c => c.id === claimId);
    if (!claim || !user) return;
    const levels: EvidenceLevel[] = ['E0', 'E1', 'E2', 'E3', 'E4'];
    const currentIdx = levels.indexOf(claim.evidenceLevel);
    const nextLevel = levels[currentIdx + 1];
    if (!nextLevel) { setPromotionMsg({ claimId, msg: 'Nivel máximo alcanzado', ok: false }); return; }

    const check = canPromoteEvidenceLevel(claim.evidenceLevel, nextLevel, state);
    if (!check.allowed) {
      setPromotionMsg({ claimId, msg: check.reason, ok: false });
      return;
    }

    setState(prev => ({
      ...prev,
      claims: prev.claims.map(c => c.id === claimId ? {
        ...c, evidenceLevel: nextLevel, updatedAt: new Date().toISOString().split('T')[0],
        history: [...c.history, { date: new Date().toISOString().split('T')[0], fromLevel: c.evidenceLevel, toLevel: nextLevel, author: user.id, justification: `Promoción automática a ${nextLevel}`, evidenceIds: [] }]
      } : c)
    }));
    addAuditEvent('PROMOTE', 'claim', claimId, `Promovida de ${claim.evidenceLevel} a ${nextLevel} por ${user.name}`);
    setPromotionMsg({ claimId, msg: `Promovida a ${nextLevel}`, ok: true });
  };

  const levelColors: Record<string, string> = { E0: 'bg-red-100 text-red-700 border-red-200', E1: 'bg-orange-100 text-orange-700 border-orange-200', E2: 'bg-yellow-100 text-yellow-700 border-yellow-200', E3: 'bg-sage-100 text-sage-700 border-sage-200', E4: 'bg-lavender-100 text-lavender-700 border-lavender-200' };
  const levelDescriptions: Record<string, string> = { E0: 'Evidencia insuficiente', E1: 'Capacidad declarada', E2: 'Capacidad documentada', E3: 'Funcionamiento reproducible', E4: 'Verificación independiente' };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {['E0','E1','E2','E3','E4'].map(l => (
            <span key={l} className={`px-2 py-1 text-[10px] font-mono rounded border ${levelColors[l]}`}>{l}: {levelDescriptions[l]}</span>
          ))}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-1.5 bg-sage-600 text-white text-xs rounded-lg hover:bg-sage-700">
          <Plus className="w-3 h-3" /> Nueva afirmación
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-blue-gray-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-blue-gray-800">Registrar afirmación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select value={form.organizationId || ''} onChange={e => setForm({...form, organizationId: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" required>
              <option value="">Organización *</option>
              {state.organizations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <select value={form.systemId || ''} onChange={e => setForm({...form, systemId: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" required>
              <option value="">Sistema *</option>
              {state.systems.filter(s => !form.organizationId || s.organizationId === form.organizationId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <textarea placeholder="Texto exacto de la afirmación *" value={form.text || ''} onChange={e => setForm({...form, text: e.target.value})} className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" rows={2} required />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder="Fuente" value={form.source || ''} onChange={e => setForm({...form, source: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" />
            <input placeholder="Responsable" value={form.responsible || ''} onChange={e => setForm({...form, responsible: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" />
            <input placeholder="Limitaciones" value={form.limitations || ''} onChange={e => setForm({...form, limitations: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-sage-600 text-white text-xs rounded-lg">Registrar (E0)</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-blue-gray-100 text-blue-gray-700 text-xs rounded-lg">Cancelar</button>
          </div>
          <p className="text-[10px] text-blue-gray-500">Las afirmaciones se registran inicialmente como E0. La promoción requiere evidencias y autorizaciones progresivas.</p>
        </form>
      )}

      {promotionMsg && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${promotionMsg.ok ? 'bg-sage-50 text-sage-700 border border-sage-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {promotionMsg.ok ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{promotionMsg.msg}</span>
          <button onClick={() => setPromotionMsg(null)} className="ml-auto text-xs underline">Cerrar</button>
        </div>
      )}

      <div className="space-y-3">
        {state.claims.map(claim => {
          const sys = state.systems.find(s => s.id === claim.systemId);
          const org = state.organizations.find(o => o.id === claim.organizationId);
          return (
            <div key={claim.id} className="bg-white rounded-xl border border-blue-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded border ${levelColors[claim.evidenceLevel]}`}>{claim.evidenceLevel}</span>
                    <span className="text-xs text-blue-gray-500">{claim.status.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="text-sm text-blue-gray-800 font-medium">"{claim.text}"</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-blue-gray-500">
                    <span>Sistema: <strong>{sys?.name || '—'}</strong></span>
                    <span>Organización: <strong>{org?.name || '—'}</strong></span>
                    <span>Fuente: {claim.source || '—'}</span>
                    <span>Fecha: {claim.date}</span>
                  </div>
                  {claim.justification && <p className="text-xs text-blue-gray-600 mt-1 italic">Justificación: {claim.justification}</p>}
                  {claim.history.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {claim.history.map((h, i) => (
                        <p key={i} className="text-[10px] text-blue-gray-500">
                          {h.date}: {h.fromLevel} → {h.toLevel} por {state.users.find(u => u.id === h.author)?.name || h.author}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => promoteClaim(claim.id)} className="flex items-center gap-1 px-2 py-1 bg-lavender-50 text-lavender-700 text-xs rounded-lg hover:bg-lavender-100 border border-lavender-200">
                  <ArrowUp className="w-3 h-3" /> Promover
                </button>
              </div>
            </div>
          );
        })}
        {state.claims.length === 0 && <p className="text-center py-8 text-sm text-blue-gray-400">No hay afirmaciones registradas</p>}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <p className="text-xs text-red-700"><AlertTriangle className="w-3 h-3 inline mr-1" />Ningún operador podrá elevar automáticamente a E3 sin pruebas suficientes. Ningún operador podrá elevar a E4 sin revisión independiente real. Una IA no puede adjudicar E4.</p>
      </div>
    </div>
  );
}
