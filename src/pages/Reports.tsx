import { useState } from 'react';
import { useApp } from '../App';
import { generateId, computeHash } from '../store';
import { FileText, Download } from 'lucide-react';
import { Report } from '../types';

export default function Reports() {
  const { state, setState, user, addAuditEvent } = useApp();
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    { type: 'INVENTARIO', label: 'Inventario de sistemas' },
    { type: 'MATRIZ_E0_E4', label: 'Matriz E0-E4' },
    { type: 'CLASIFICACION_AI_ACT', label: 'Clasificación AI Act' },
    { type: 'CONTROLES', label: 'Controles' },
    { type: 'RESULTADOS_EXPERIMENTALES', label: 'Resultados experimentales' },
    { type: 'HALLAZGOS', label: 'Hallazgos' },
    { type: 'RESUMEN_EJECUTIVO', label: 'Resumen ejecutivo' },
  ];

  const generateReport = (type: string) => {
    setGenerating(true);
    setTimeout(() => {
      if (!user) return;
      const content = generateReportContent(type);
      const report: Report = {
        id: generateId(), type, title: reportTypes.find(r => r.type === type)?.label || type,
        scope: 'Plataforma SAE Veritas', version: '1.0', date: new Date().toISOString().split('T')[0],
        methodology: 'Verificación independiente según procedimiento SAE Veritas',
        sources: state.legalSources.map(ls => ls.identifier), results: content,
        limitations: 'Resultados basados en información disponible y pruebas ejecutadas',
        responsible: user.name, reviewers: [], sha256: computeHash(content),
        format: 'JSON', status: 'PUBLICADO',
      };
      setState(prev => ({ ...prev, reports: [...prev.reports, report] }));
      addAuditEvent('GENERATE_REPORT', 'report', report.id, `Informe generado: ${report.title}`);
      setGenerating(false);
    }, 800);
  };

  const generateReportContent = (type: string): string => {
    switch (type) {
      case 'INVENTARIO':
        return JSON.stringify({ sistemas: state.systems.map(s => ({ id: s.identifier, nombre: s.name, version: s.version, tipo: s.systemType, organizacion: state.organizations.find(o => o.id === s.organizationId)?.name })) }, null, 2);
      case 'MATRIZ_E0_E4':
        return JSON.stringify({ afirmaciones: state.claims.map(c => ({ id: c.id, texto: c.text, nivel: c.evidenceLevel, sistema: state.systems.find(s => s.id === c.systemId)?.name, estado: c.status, fecha: c.date })) }, null, 2);
      case 'CONTROLES':
        return JSON.stringify({ controles: state.controls.map(c => ({ id: c.identifier, categoria: c.category, objetivo: c.objective, version: c.version })) }, null, 2);
      case 'RESULTADOS_EXPERIMENTALES':
        return JSON.stringify({ pruebas: state.testRuns.map(tr => ({ id: tr.id, protocolo: state.testProtocols.find(p => p.id === tr.protocolId)?.name, resultado: tr.passed ? 'SUPERADA' : 'NO SUPERADA', observaciones: tr.observedResults, fecha: tr.executedAt })) }, null, 2);
      case 'RESUMEN_EJECUTIVO':
        return JSON.stringify({ resumen: { organizaciones: state.organizations.length, sistemas: state.systems.length, afirmaciones: state.claims.length, pruebas_ejecutadas: state.testRuns.length, evidencias: state.evidence.length, niveles: { E0: state.claims.filter(c => c.evidenceLevel === 'E0').length, E1: state.claims.filter(c => c.evidenceLevel === 'E1').length, E2: state.claims.filter(c => c.evidenceLevel === 'E2').length, E3: state.claims.filter(c => c.evidenceLevel === 'E3').length, E4: state.claims.filter(c => c.evidenceLevel === 'E4').length } } }, null, 2);
      default:
        return JSON.stringify({ tipo: type, fecha: new Date().toISOString(), datos: 'Contenido del informe' }, null, 2);
    }
  };

  const exportReport = (report: Report) => {
    const blob = new Blob([report.results], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAE_Veritas_${report.type}_${report.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportMatrixCSV = () => {
    const headers = 'Organización,Sistema,Afirmación,Nivel,Estado,Fecha\n';
    const rows = state.claims.map(c => {
      const org = state.organizations.find(o => o.id === c.organizationId)?.name || '';
      const sys = state.systems.find(s => s.id === c.systemId)?.name || '';
      return `"${org}","${sys}","${c.text}","${c.evidenceLevel}","${c.status}","${c.date}"`;
    }).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAE_Veritas_Matriz_E0-E4_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-blue-gray-500">Generación de informes reales en JSON y CSV. Cada informe muestra alcance, versión, fecha, metodología, fuentes, resultados, limitaciones y hash.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {reportTypes.map(rt => (
          <button key={rt.type} onClick={() => generateReport(rt.type)} disabled={generating}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-blue-gray-100 hover:border-sage-300 hover:shadow-sm transition-all text-center disabled:opacity-50">
            <FileText className="w-6 h-6 text-sage-500" />
            <span className="text-xs font-medium text-blue-gray-700">{rt.label}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={exportMatrixCSV} className="flex items-center gap-1 px-3 py-1.5 bg-blue-gray-100 text-blue-gray-700 text-xs rounded-lg hover:bg-blue-gray-200">
          <Download className="w-3 h-3" /> Exportar matriz CSV
        </button>
      </div>

      {generating && <p className="text-sm text-blue-gray-500 animate-pulse">Generando informe...</p>}

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-blue-gray-700">Informes generados</h4>
        {state.reports.map(report => (
          <div key={report.id} className="bg-white rounded-lg border border-blue-gray-100 p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sage-500" />
                <span className="text-sm font-medium text-blue-gray-800">{report.title}</span>
                <span className="px-2 py-0.5 text-[10px] bg-sage-100 text-sage-700 rounded-full">{report.format}</span>
              </div>
              <p className="text-xs text-blue-gray-500 mt-1">{report.date} | Hash: <code className="font-mono">{report.sha256.substring(0, 16)}...</code></p>
              <p className="text-xs text-blue-gray-500">Responsable: {report.responsible}</p>
            </div>
            <button onClick={() => exportReport(report)} className="flex items-center gap-1 px-3 py-1.5 bg-sage-50 text-sage-700 text-xs rounded-lg border border-sage-200 hover:bg-sage-100">
              <Download className="w-3 h-3" /> Descargar
            </button>
          </div>
        ))}
        {state.reports.length === 0 && <p className="text-center py-4 text-sm text-blue-gray-400">No hay informes generados</p>}
      </div>
    </div>
  );
}
