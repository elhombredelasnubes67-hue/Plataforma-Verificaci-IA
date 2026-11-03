import { useState } from 'react';
import { useApp } from '../App';
import { Scale, BookOpen, AlertTriangle } from 'lucide-react';
import { AIActClassification } from '../types';

export default function Regulations() {
  const { state } = useApp();
  const [showClassifier, setShowClassifier] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [classification, setClassification] = useState<{result: AIActClassification; reason: string; articles: string[]} | null>(null);

  const questions = [
    { id: 'q1', text: '¿Es un sistema de inteligencia artificial según la definición legal aplicable?' },
    { id: 'q2', text: '¿Quién es el proveedor del sistema?' },
    { id: 'q3', text: '¿Quién es el responsable del despliegue?' },
    { id: 'q4', text: '¿Cuál es su finalidad principal?' },
    { id: 'q5', text: '¿Afecta a personas físicas?' },
    { id: 'q6', text: '¿Participa en procesos de contratación laboral?' },
    { id: 'q7', text: '¿Influye en condiciones laborales (horarios, turnos, evaluación)?' },
    { id: 'q8', text: '¿Evalúa rendimiento individual de personas?' },
    { id: 'q9', text: '¿Realiza perfilado de personas?' },
    { id: 'q10', text: '¿Interviene en identificación biométrica remota?' },
    { id: 'q11', text: '¿Ejecuta acciones autónomas con efectos legales o significativos?' },
    { id: 'q12', text: '¿Resultan aplicables excepciones específicas?' },
  ];

  const classify = () => {
    if (answers.q1 === 'no') { setClassification({ result: 'FUERA_AMBITO', reason: 'El sistema no cumple la definición legal de IA', articles: ['AI Act Art. 3(1)'] }); return; }
    if (answers.q1 === 'unknown') { setClassification({ result: 'INFO_INSUFICIENTE', reason: 'No se puede determinar si es un sistema de IA', articles: ['AI Act Art. 3(1)'] }); return; }
    if (answers.q10 === 'yes') { setClassification({ result: 'PRACTICA_PROHIBIDA', reason: 'Posible práctica prohibida: identificación biométrica remota', articles: ['AI Act Art. 5'] }); return; }
    if (answers.q6 === 'yes' || answers.q7 === 'yes' || answers.q8 === 'yes') { setClassification({ result: 'ALTO_RIESGO', reason: 'Sistema que afecta a decisiones laborales: clasificación como alto riesgo (Anexo III)', articles: ['AI Act Art. 6', 'AI Act Anexo III(4)', 'ET Art. 64.4'] }); return; }
    if (answers.q9 === 'yes') { setClassification({ result: 'TRANSPARENCIA', reason: 'Sistema de perfilado: posibles obligaciones de transparencia', articles: ['AI Act Art. 50', 'RGPD Art. 22'] }); return; }
    if (answers.q5 === 'yes') { setClassification({ result: 'NO_ALTO_RIESGO', reason: 'Afecta a personas pero no en contexto de alto riesgo aparente', articles: ['AI Act Art. 6'] }); return; }
    setClassification({ result: 'REVISION_JURIDICA', reason: 'Se requiere revisión jurídica competente para clasificación definitiva', articles: ['AI Act Art. 6-7'] });
  };

  const resultLabels: Record<AIActClassification, {label: string; color: string}> = {
    FUERA_AMBITO: { label: 'FUERA DE ÁMBITO IDENTIFICADO', color: 'bg-blue-gray-100 text-blue-gray-700' },
    NO_ALTO_RIESGO: { label: 'NO ALTO RIESGO APARENTE', color: 'bg-sage-100 text-sage-700' },
    TRANSPARENCIA: { label: 'TRANSPARENCIA ESPECÍFICA POTENCIAL', color: 'bg-yellow-100 text-yellow-700' },
    ALTO_RIESGO: { label: 'ALTO RIESGO POTENCIAL', color: 'bg-orange-100 text-orange-700' },
    PRACTICA_PROHIBIDA: { label: 'POSIBLE PRÁCTICA PROHIBIDA', color: 'bg-red-100 text-red-700' },
    INFO_INSUFICIENTE: { label: 'INFORMACIÓN INSUFICIENTE', color: 'bg-gray-100 text-gray-700' },
    REVISION_JURIDICA: { label: 'REVISIÓN JURÍDICA NECESARIA', color: 'bg-lavender-100 text-lavender-700' },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-xs text-blue-gray-500">Registro versionado de fuentes normativas oficiales. Se distinguen obligaciones legales de normas técnicas voluntarias.</p>
        <button onClick={() => setShowClassifier(!showClassifier)} className="px-3 py-1.5 bg-lavender-500 text-white text-xs rounded-lg hover:bg-lavender-600">
          Clasificador AI Act
        </button>
      </div>

      {showClassifier && (
        <div className="bg-white rounded-xl border border-lavender-200 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-blue-gray-800 flex items-center gap-2">
            <Scale className="w-4 h-4 text-lavender-500" /> Clasificador del AI Act — Cuestionario técnico-jurídico
          </h3>
          <p className="text-xs text-blue-gray-500">Clasificación preliminar. Requiere revisión jurídica competente para ser vinculante.</p>
          <div className="space-y-3">
            {questions.map(q => (
              <div key={q.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xs text-blue-gray-700 flex-1">{q.text}</span>
                <div className="flex gap-1">
                  {['yes', 'no', 'unknown'].map(v => (
                    <button key={v} onClick={() => setAnswers({...answers, [q.id]: v})}
                      className={`px-2 py-1 text-[10px] rounded ${answers[q.id] === v ? 'bg-blue-gray-900 text-white' : 'bg-blue-gray-50 text-blue-gray-600 border border-blue-gray-200'}`}>
                      {v === 'yes' ? 'Sí' : v === 'no' ? 'No' : 'N/D'}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={classify} className="px-4 py-2 bg-lavender-500 text-white text-xs rounded-lg hover:bg-lavender-600">Clasificar</button>
          {classification && (
            <div className={`p-4 rounded-lg border ${resultLabels[classification.result].color}`}>
              <p className="font-bold text-sm">{resultLabels[classification.result].label}</p>
              <p className="text-xs mt-1">{classification.reason}</p>
              <p className="text-[10px] mt-2">Artículos aplicables: {classification.articles.join(', ')}</p>
              <p className="text-[10px] mt-1 italic">Esta clasificación es preliminar hasta recibir revisión jurídica competente.</p>
            </div>
          )}
        </div>
      )}

      {/* Legal Sources Table */}
      <div className="bg-white rounded-xl border border-blue-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-blue-gray-100 bg-blue-gray-50">
          <h3 className="text-sm font-semibold text-blue-gray-800 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Fuentes normativas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ivory-50 border-b border-blue-gray-100">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-semibold text-blue-gray-600">ID</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-blue-gray-600">Fuente</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-blue-gray-600">Ámbito</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-blue-gray-600">Tipo</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-blue-gray-600">Aplicación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-gray-100">
              {state.legalSources.map(ls => (
                <tr key={ls.id} className="hover:bg-ivory-50">
                  <td className="px-4 py-2 font-mono text-xs text-blue-gray-700">{ls.identifier}</td>
                  <td className="px-4 py-2 text-blue-gray-800 text-xs">{ls.primarySource.substring(0, 60)}...</td>
                  <td className="px-4 py-2 text-blue-gray-600 text-xs">{ls.scope}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full ${ls.isLegalObligation ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-sage-50 text-sage-700 border border-sage-200'}`}>
                      {ls.isLegalObligation ? 'Obligación legal' : 'Norma voluntaria'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-blue-gray-500">{ls.applicationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800"><AlertTriangle className="w-3 h-3 inline mr-1" />No se inventan artículos, obligaciones ni fechas. No se reproducen íntegramente normas protegidas sin licencia. Prioridad: EUR-Lex, Comisión Europea, BOE, AEPD y organismos oficiales.</p>
      </div>
    </div>
  );
}
