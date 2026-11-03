import { useApp } from '../App';
import { CheckSquare, Shield } from 'lucide-react';

export default function Controls() {
  const { state } = useApp();

  const categories = [...new Set(state.controls.map(c => c.category))];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-blue-gray-500">Catálogo versionado de controles. Cada control tiene identificador, objetivo, procedimiento, resultado esperado y criterios de aceptación.</p>
      </div>

      {categories.map(cat => (
        <div key={cat} className="bg-white rounded-xl border border-blue-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-blue-gray-100 bg-blue-gray-50">
            <h3 className="text-sm font-semibold text-blue-gray-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-sage-500" /> {cat}
            </h3>
          </div>
          <div className="divide-y divide-blue-gray-100">
            {state.controls.filter(c => c.category === cat).map(ctrl => (
              <div key={ctrl.id} className="px-5 py-3 hover:bg-ivory-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-sage-700 bg-sage-50 px-2 py-0.5 rounded">{ctrl.identifier}</span>
                      <span className="text-[10px] text-blue-gray-400">v{ctrl.version}</span>
                    </div>
                    <p className="text-sm text-blue-gray-800 font-medium">{ctrl.objective}</p>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div><span className="text-blue-gray-500">Riesgo:</span> <span className="text-blue-gray-700">{ctrl.risk}</span></div>
                      <div><span className="text-blue-gray-500">Procedimiento:</span> <span className="text-blue-gray-700">{ctrl.procedure}</span></div>
                      <div><span className="text-blue-gray-500">Resultado esperado:</span> <span className="text-blue-gray-700">{ctrl.expectedResult}</span></div>
                      <div><span className="text-blue-gray-500">Criterios de aceptación:</span> <span className="text-blue-gray-700">{ctrl.acceptanceCriteria}</span></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-blue-gray-400">Responsable:</span>
                    <p className="text-xs text-blue-gray-700">{ctrl.responsible}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-ivory-100 border border-ivory-200 rounded-lg p-3">
        <p className="text-xs text-blue-gray-600"><CheckSquare className="w-3 h-3 inline mr-1" />Los controles son versionados y reutilizables. Cada control incluye procedimiento de verificación, datos necesarios, resultado esperado y criterios de aceptación.</p>
      </div>
    </div>
  );
}
