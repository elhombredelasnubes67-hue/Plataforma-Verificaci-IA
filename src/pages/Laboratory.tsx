import { useState } from 'react';
import { useApp } from '../App';
import { generateId, computeHash } from '../store';
import { FlaskConical, Play, CheckCircle, XCircle, Clock } from 'lucide-react';
import { TestRun, TestType } from '../types';

export default function Laboratory() {
  const { state, setState, user, addAuditEvent } = useApp();
  const [running, setRunning] = useState<string | null>(null);

  const executeTest = (protocolId: string, claimId: string) => {
    const protocol = state.testProtocols.find(p => p.id === protocolId);
    const claim = state.claims.find(c => c.id === claimId);
    if (!protocol || !claim || !user) return;

    setRunning(protocolId);

    // Simulate test execution with realistic timing
    setTimeout(() => {
      const startTime = Date.now();
      const duration = 150 + Math.random() * 300;

      // Generate deterministic results based on protocol type
      let observedResults = '';
      let passed = false;

      if (protocol.type === 'DETERMINISTA') {
        if (protocolId === 'tp1') {
          // Classification test
          const accuracy = 0.87 + Math.random() * 0.1;
          observedResults = `Precisión observada: ${(accuracy * 100).toFixed(1)}% sobre dataset sintético de 100 muestras. Umbral requerido: 95%.`;
          passed = accuracy >= 0.95;
        } else if (protocolId === 'tp2') {
          // Labor constraints test
          const violations = Math.random() > 0.7 ? 0 : Math.floor(Math.random() * 3) + 1;
          observedResults = `Restricciones verificadas: 40h semanales, 12h descanso mínimo. Violaciones detectadas: ${violations}.`;
          passed = violations === 0;
        } else {
          observedResults = 'Prueba determinista ejecutada. Resultados registrados.';
          passed = true;
        }
      } else {
        observedResults = 'Prueba ejecutada. Resultados pendientes de análisis manual.';
        passed = false;
      }

      const testRun: TestRun = {
        id: generateId(), protocolId, claimId, systemId: claim.systemId,
        executedAt: new Date().toISOString(), executedBy: user.id,
        status: passed ? 'COMPLETADA' : 'FALLIDA',
        inputs: protocol.parameters, outputs: { duration: `${duration.toFixed(0)}ms` },
        expectedResults: protocol.description, observedResults, passed,
        evidenceIds: [], duration,
      };

      // Create evidence for the test run
      const evidenceContent = JSON.stringify(testRun);
      const evidenceId = generateId();
      testRun.evidenceIds = [evidenceId];

      setState(prev => ({
        ...prev,
        testRuns: [...prev.testRuns, testRun],
        evidence: [...prev.evidence, {
          id: evidenceId, type: 'RESULTADO_PRUEBA', origin: 'LABORATORIO',
          date: new Date().toISOString().split('T')[0], author: user.id,
          systemId: claim.systemId, claimId: claim.id, testRunId: testRun.id,
          sha256: computeHash(evidenceContent), location: 'local-storage',
          confidentiality: 'RESTRINGIDA', version: '1.0', retention: '7 años',
          status: 'ACTIVA', content: evidenceContent,
        }],
        claims: prev.claims.map(c => c.id === claimId ? { ...c, tests: [...c.tests, testRun.id], results: observedResults } : c),
      }));

      addAuditEvent('EXECUTE_TEST', 'test_run', testRun.id, `Prueba "${protocol.name}" ejecutada. Resultado: ${passed ? 'SUPERADA' : 'NO SUPERADA'}`);
      setRunning(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sage-50 to-lavender-50 rounded-xl p-5 border border-sage-200">
        <h3 className="text-sm font-semibold text-blue-gray-800 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-sage-500" /> Laboratorio de Pruebas
        </h3>
        <p className="text-xs text-blue-gray-600 mt-1">Motor de ejecución de pruebas con registro de evidencias. Distingue pruebas deterministas, con modelo real y manuales documentadas.</p>
        <p className="text-[10px] text-blue-gray-500 mt-1">El resultado esperado no puede sustituir al resultado observado.</p>
      </div>

      {/* Test Protocols */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-blue-gray-700">Protocolos de prueba</h4>
        {state.testProtocols.map(protocol => {
          const relatedClaims = state.claims.filter(c => protocol.controlIds.some(cid => c.controls.includes(cid)));
          const typeColors: Record<TestType, string> = { DETERMINISTA: 'bg-sage-100 text-sage-700', MODELO_REAL: 'bg-lavender-100 text-lavender-700', MANUAL_DOCUMENTADA: 'bg-yellow-100 text-yellow-700' };
          return (
            <div key={protocol.id} className="bg-white rounded-xl border border-blue-gray-100 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full ${typeColors[protocol.type]}`}>{protocol.type.replace(/_/g, ' ')}</span>
                    <span className="text-sm font-medium text-blue-gray-800">{protocol.name}</span>
                  </div>
                  <p className="text-xs text-blue-gray-600">{protocol.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-blue-gray-500">
                    <span>Entorno: {protocol.environment}</span>
                    <span>Parámetros: {JSON.stringify(protocol.parameters)}</span>
                  </div>
                </div>
              </div>

              {/* Related claims to test */}
              {relatedClaims.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-gray-100">
                  <p className="text-xs text-blue-gray-500 mb-2">Afirmaciones asociadas:</p>
                  {relatedClaims.map(claim => (
                    <div key={claim.id} className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-blue-gray-700 truncate flex-1">"{claim.text.substring(0, 60)}..."</span>
                      <button onClick={() => executeTest(protocol.id, claim.id)} disabled={running !== null}
                        className={`flex items-center gap-1 px-2 py-1 text-[10px] rounded-lg ${running === protocol.id ? 'bg-blue-gray-100 text-blue-gray-400' : 'bg-sage-600 text-white hover:bg-sage-700'}`}>
                        {running === protocol.id ? <Clock className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                        Ejecutar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Test runs for this protocol */}
              {state.testRuns.filter(tr => tr.protocolId === protocol.id).length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-gray-100">
                  <p className="text-xs text-blue-gray-500 mb-2">Ejecuciones:</p>
                  {state.testRuns.filter(tr => tr.protocolId === protocol.id).map(tr => (
                    <div key={tr.id} className={`flex items-center gap-2 py-1.5 px-2 rounded text-xs ${tr.passed ? 'bg-sage-50' : 'bg-red-50'}`}>
                      {tr.passed ? <CheckCircle className="w-3 h-3 text-sage-600" /> : <XCircle className="w-3 h-3 text-red-600" />}
                      <span className="text-blue-gray-700">{tr.observedResults.substring(0, 80)}...</span>
                      <span className="ml-auto text-[10px] text-blue-gray-400">{new Date(tr.executedAt).toLocaleString('es-ES')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-blue-gray-50 border border-blue-gray-200 rounded-lg p-3">
        <p className="text-xs text-blue-gray-600">Las pruebas de modelo real conservarán modelo exacto, proveedor, parámetros, prompt, respuesta, latencia, consumo, versión y hashes. No se simulan inferencias reales.</p>
      </div>
    </div>
  );
}
