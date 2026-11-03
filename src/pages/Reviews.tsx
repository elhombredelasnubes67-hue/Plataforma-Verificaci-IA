import { useState } from 'react';
import { useApp } from '../App';
import { generateId } from '../store';
import { Eye, Plus, AlertTriangle } from 'lucide-react';
import { HumanReview } from '../types';

export default function Reviews() {
  const { state, setState, user, addAuditEvent } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<HumanReview>>({ type: 'INTERNA', status: 'PENDIENTE' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Check self-review prohibition
    const claim = state.claims.find(c => c.id === form.claimId);
    if (claim) {
      const hasConflict = claim.history.some(h => h.author === user.id);
      if (hasConflict && form.type === 'EXTERNA') {
        alert('No puede revisar independientemente un expediente que haya ejecutado o respecto del que mantenga un conflicto incompatible.');
        return;
      }
    }

    const review: HumanReview = {
      id: generateId(), claimId: form.claimId || '', reviewerId: user.id,
      reviewerName: user.name, type: form.type as 'INTERNA' | 'EXTERNA',
      date: new Date().toISOString().split('T')[0], scope: form.scope || '',
      conflictsDeclared: form.conflictsDeclared || '', evidenceReviewed: [],
      conclusions: form.conclusions || '', findings: [], status: 'PENDIENTE',
    };
    setState(prev => ({ ...prev, humanReviews: [...prev.humanReviews, review] }));
    addAuditEvent('CREATE_REVIEW', 'review', review.id, `Revisión ${review.type} creada por ${user.name}`);
    setShowForm(false);
    setForm({ type: 'INTERNA', status: 'PENDIENTE' });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-blue-gray-500">Circuito de revisión con segregación de funciones. Nadie puede revisar independientemente un expediente que haya ejecutado.</p>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-1.5 bg-sage-600 text-white text-xs rounded-lg hover:bg-sage-700">
          <Plus className="w-3 h-3" /> Nueva revisión
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-blue-gray-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-blue-gray-800">Iniciar revisión</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select value={form.claimId || ''} onChange={e => setForm({...form, claimId: e.target.value})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" required>
              <option value="">Afirmación a revisar *</option>
              {state.claims.map(c => <option key={c.id} value={c.id}>{c.text.substring(0, 50)}... ({c.evidenceLevel})</option>)}
            </select>
            <select value={form.type || 'INTERNA'} onChange={e => setForm({...form, type: e.target.value as 'INTERNA' | 'EXTERNA'})} className="px-3 py-2 border border-blue-gray-200 rounded-lg text-sm">
              <option value="INTERNA">Revisión interna</option><option value="EXTERNA">Revisión externa independiente</option>
            </select>
          </div>
          <textarea placeholder="Alcance de la revisión" value={form.scope || ''} onChange={e => setForm({...form, scope: e.target.value})} className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" rows={2} />
          <textarea placeholder="Declaración de conflictos de interés" value={form.conflictsDeclared || ''} onChange={e => setForm({...form, conflictsDeclared: e.target.value})} className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" rows={2} />
          <textarea placeholder="Conclusiones" value={form.conclusions || ''} onChange={e => setForm({...form, conclusions: e.target.value})} className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg text-sm" rows={2} />
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-sage-600 text-white text-xs rounded-lg">Crear revisión</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-blue-gray-100 text-blue-gray-700 text-xs rounded-lg">Cancelar</button>
          </div>
        </form>
      )}

      {/* Claims status */}
      <div className="bg-white rounded-xl border border-blue-gray-100 p-4">
        <h4 className="text-sm font-semibold text-blue-gray-800 mb-3">Estado de expedientes</h4>
        <div className="space-y-2">
          {state.claims.map(claim => {
            const reviews = state.humanReviews.filter(r => r.claimId === claim.id);
            const sys = state.systems.find(s => s.id === claim.systemId);
            return (
              <div key={claim.id} className="flex items-center justify-between p-2 bg-ivory-50 rounded-lg">
                <div>
                  <span className="text-xs font-medium text-blue-gray-700">{sys?.name}: "{claim.text.substring(0, 40)}..."</span>
                  <span className="ml-2 text-[10px] text-blue-gray-500">[{claim.evidenceLevel}]</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-blue-gray-500">{claim.status.replace(/_/g, ' ')}</span>
                  {reviews.length > 0 && <span className="text-[10px] bg-lavender-100 text-lavender-700 px-2 py-0.5 rounded">{reviews.length} revisión(es)</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-2">
        {state.humanReviews.map(review => (
          <div key={review.id} className="bg-white rounded-lg border border-blue-gray-100 p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-lavender-500" />
                  <span className="text-sm font-medium text-blue-gray-800">Revisión {review.type}</span>
                  <span className={`px-2 py-0.5 text-[10px] rounded-full ${review.type === 'EXTERNA' ? 'bg-lavender-100 text-lavender-700' : 'bg-blue-gray-100 text-blue-gray-700'}`}>{review.status}</span>
                </div>
                <p className="text-xs text-blue-gray-600 mt-1">Revisor: {review.reviewerName} | Fecha: {review.date}</p>
                <p className="text-xs text-blue-gray-600">Alcance: {review.scope || 'No especificado'}</p>
                {review.conflictsDeclared && <p className="text-xs text-blue-gray-600">Conflictos: {review.conflictsDeclared}</p>}
                {review.conclusions && <p className="text-xs text-blue-gray-700 mt-1 italic">Conclusiones: {review.conclusions}</p>}
              </div>
            </div>
          </div>
        ))}
        {state.humanReviews.length === 0 && <p className="text-center py-4 text-sm text-blue-gray-400">No hay revisiones registradas</p>}
      </div>

      <div className="bg-lavender-50 border border-lavender-200 rounded-lg p-3">
        <p className="text-xs text-lavender-700"><AlertTriangle className="w-3 h-3 inline mr-1" />No se generan identidades humanas ficticias que aparenten revisiones reales. E4 no equivale por sí mismo a certificación normativa acreditada.</p>
      </div>
    </div>
  );
}
