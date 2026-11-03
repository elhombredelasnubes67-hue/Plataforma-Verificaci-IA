import { useState } from 'react';
import { useApp } from '../App';
import { FileSearch, AlertTriangle, Eye, ChevronDown, ChevronUp } from 'lucide-react';

export default function Mercadona() {
  const { state } = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const levelColors: Record<string, string> = {
    E0: 'bg-red-100 text-red-700 border-red-200',
    E1: 'bg-orange-100 text-orange-700 border-orange-200',
    E2: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    E3: 'bg-sage-100 text-sage-700 border-sage-200',
    E4: 'bg-lavender-100 text-lavender-700 border-lavender-200',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-ivory-100 rounded-xl p-5 border border-orange-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-blue-gray-800 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-orange-500" />
              MERCADONA — OBSERVATORIO DE EVIDENCIAS PÚBLICAS
            </h3>
            <p className="text-xs text-blue-gray-600 mt-1">Investigación independiente, no oficial y sin afiliación empresarial.</p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-white/60 rounded-lg">
          <p className="text-[10px] text-blue-gray-700"><AlertTriangle className="w-3 h-3 inline mr-1 text-orange-500" />AVISO: Este observatorio registra información públicamente accesible. No presupone autorización ni acceso a sistemas internos. No se atribuye IA a un sistema sin evidencia de que la utiliza. No se atribuyen incumplimientos sin evidencias suficientes.</p>
        </div>
      </div>

      {/* Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.mercadonaCases.map(mc => {
          const sys = state.mercadonaSystems.find(s => s.id === mc.systemId);
          const isSelected = selectedCase === mc.id;
          return (
            <div key={mc.id} className={`bg-white rounded-xl border ${isSelected ? 'border-orange-300 shadow-md' : 'border-blue-gray-100'} p-4 cursor-pointer hover:shadow-sm transition-shadow`} onClick={() => setSelectedCase(isSelected ? null : mc.id)}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{mc.identifier}</span>
                  <h4 className="text-sm font-semibold text-blue-gray-800 mt-1">{mc.title}</h4>
                  <p className="text-xs text-blue-gray-500 mt-1">Sistema: {sys?.name || '—'} | Estado: {mc.status.replace(/_/g, ' ')}</p>
                </div>
                <Eye className="w-4 h-4 text-blue-gray-400" />
              </div>
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-blue-gray-100">
                  <p className="text-xs font-medium text-blue-gray-700 mb-2">Objetivos de investigación:</p>
                  <ul className="space-y-1">
                    {mc.objectives.map((obj, i) => (
                      <li key={i} className="text-xs text-blue-gray-600 flex items-start gap-1">
                        <span className="text-orange-400 mt-0.5">•</span> {obj}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-[10px] text-yellow-800">Expediente en fase de INVESTIGACIÓN DOCUMENTAL. No se atribuyen niveles E3 o E4 sin pruebas autorizadas y revisión independiente.</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Systems Inventory */}
      <div className="bg-white rounded-xl border border-blue-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-blue-gray-100 bg-blue-gray-50">
          <h3 className="text-sm font-semibold text-blue-gray-800">Inventario de sistemas identificados ({state.mercadonaSystems.length})</h3>
          <p className="text-[10px] text-blue-gray-500 mt-0.5">No se atribuye IA a un sistema sin evidencia de que la utiliza. isAI = null significa "por determinar".</p>
        </div>
        <div className="divide-y divide-blue-gray-100">
          {state.mercadonaSystems.map(sys => {
            const isExpanded = expanded === sys.id;
            return (
              <div key={sys.id}>
                <button onClick={() => setExpanded(isExpanded ? null : sys.id)} className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-ivory-50">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${levelColors[sys.evidenceLevel]}`}>{sys.evidenceLevel}</span>
                    <div>
                      <span className="text-sm font-medium text-blue-gray-800">{sys.name}</span>
                      <span className="text-[10px] text-blue-gray-400 ml-2">{sys.identifier}</span>
                    </div>
                    {sys.isAI === true && <span className="px-1.5 py-0.5 text-[9px] bg-lavender-100 text-lavender-700 rounded">IA declarada</span>}
                    {sys.isAI === null && <span className="px-1.5 py-0.5 text-[9px] bg-yellow-100 text-yellow-700 rounded">IA: N/D</span>}
                    {sys.isAI === false && <span className="px-1.5 py-0.5 text-[9px] bg-sage-100 text-sage-700 rounded">No IA</span>}
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-gray-400" /> : <ChevronDown className="w-4 h-4 text-blue-gray-400" />}
                </button>
                {isExpanded && (
                  <div className="px-5 py-3 bg-ivory-50 border-t border-blue-gray-100 space-y-2 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div><span className="text-blue-gray-500">Función declarada:</span><p className="text-blue-gray-700">{sys.declaredFunction}</p></div>
                      <div><span className="text-blue-gray-500">Fuente:</span><p className="text-blue-gray-700">{sys.source}</p></div>
                      <div><span className="text-blue-gray-500">Controles conocidos:</span><p className="text-blue-gray-700">{sys.knownControls}</p></div>
                      <div><span className="text-blue-gray-500">Incertidumbres:</span><p className="text-blue-gray-700">{sys.uncertainties}</p></div>
                      <div><span className="text-blue-gray-500">Normativa posiblemente aplicable:</span><p className="text-blue-gray-700">{sys.applicableRegulations}</p></div>
                      <div><span className="text-blue-gray-500">Pruebas necesarias:</span><p className="text-blue-gray-700">{sys.requiredTests}</p></div>
                    </div>
                    {sys.notes && <p className="text-blue-gray-600 italic p-2 bg-white rounded">{sys.notes}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
        <p className="text-xs text-orange-800"><AlertTriangle className="w-3 h-3 inline mr-1" />La ausencia de evidencia pública no equivale a inexistencia, deficiencia o incumplimiento. Este observatorio documenta lo que es accesible públicamente y señala lo que sería necesario solicitar para verificar.</p>
      </div>
    </div>
  );
}
