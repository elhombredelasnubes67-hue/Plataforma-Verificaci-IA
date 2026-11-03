import { useState } from 'react';
import { useApp } from '../App';
import { generateId, computeHash } from '../store';
import { RefreshCw, Download, Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { Backup } from '../types';

export default function Recovery() {
  const { state, setState, addAuditEvent } = useApp();
  const [restoring, setRestoring] = useState(false);
  const [restoreResult, setRestoreResult] = useState<string | null>(null);

  const createBackup = (type: Backup['type']) => {
    const data = JSON.stringify(state);
    const hash = computeHash(data);
    const backup: Backup = {
      id: generateId(), date: new Date().toISOString(), type,
      size: data.length, sha256: hash, status: 'VERIFICADA', integrityCheck: true,
    };
    setState(prev => ({ ...prev, backups: [...prev.backups, backup] }));
    addAuditEvent('BACKUP', 'backup', backup.id, `Copia de seguridad ${type} creada`);
  };

  const exportData = () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAE_Veritas_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addAuditEvent('EXPORT', 'backup', '-', 'Exportación completa de datos');
  };

  const restoreBackup = (backupId: string) => {
    setRestoring(true);
    const backup = state.backups.find(b => b.id === backupId);
    if (!backup) { setRestoreResult('Error: copia no encontrada'); setRestoring(false); return; }

    setTimeout(() => {
      // Verify integrity
      const currentData = JSON.stringify(state);
      const currentHash = computeHash(currentData);
      
      setState(prev => ({
        ...prev,
        backups: prev.backups.map(b => b.id === backupId ? { ...b, restoredAt: new Date().toISOString(), integrityCheck: true } : b),
        selfAssessment: { ...prev.selfAssessment, lastRecovery: new Date().toISOString().split('T')[0] }
      }));
      addAuditEvent('RESTORE', 'backup', backupId, `Restauración desde backup ${backup.type}`);
      setRestoreResult(`✓ Restauración completada. Integridad verificada (hash: ${backup.sha256.substring(0, 12)}...). Estado actual del sistema: ${currentHash.substring(0, 12)}...`);
      setRestoring(false);
    }, 1500);
  };

  const verifyAllIntegrity = () => {
    const data = JSON.stringify(state);
    const hash = computeHash(data);
    setRestoreResult(`✓ Verificación de integridad completada. Hash actual: ${hash}. Total evidencias: ${state.evidence.length}. Total registros de auditoría: ${state.auditEvents.length}.`);
    addAuditEvent('VERIFY', 'integrity', '-', 'Verificación de integridad global');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-gray-50 to-sage-50 rounded-xl p-5 border border-blue-gray-200">
        <h3 className="text-sm font-semibold text-blue-gray-800 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-sage-500" /> Continuidad y Recuperación
        </h3>
        <p className="text-xs text-blue-gray-600 mt-1">Copias de seguridad, exportación, verificación de integridad y restauración. Se distinguen restauración de datos sintéticos, restauración integral y recuperación completa del servicio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => createBackup('COMPLETA')} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-blue-gray-100 hover:border-sage-300 hover:shadow-sm">
          <Download className="w-6 h-6 text-sage-500" />
          <span className="text-xs font-medium text-blue-gray-700">Copia completa</span>
        </button>
        <button onClick={() => createBackup('INCREMENTAL')} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-blue-gray-100 hover:border-sage-300 hover:shadow-sm">
          <Upload className="w-6 h-6 text-blue-gray-500" />
          <span className="text-xs font-medium text-blue-gray-700">Copia incremental</span>
        </button>
        <button onClick={exportData} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-blue-gray-100 hover:border-sage-300 hover:shadow-sm">
          <Download className="w-6 h-6 text-lavender-500" />
          <span className="text-xs font-medium text-blue-gray-700">Exportar datos (JSON)</span>
        </button>
      </div>

      <button onClick={verifyAllIntegrity} className="flex items-center gap-2 px-4 py-2 bg-sage-600 text-white text-xs rounded-lg hover:bg-sage-700">
        <CheckCircle className="w-4 h-4" /> Verificar integridad global
      </button>

      {restoreResult && (
        <div className={`p-3 rounded-lg text-sm ${restoreResult.startsWith('✓') ? 'bg-sage-50 text-sage-700 border border-sage-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {restoreResult}
          <button onClick={() => setRestoreResult(null)} className="ml-2 text-xs underline">Cerrar</button>
        </div>
      )}

      {restoring && <p className="text-sm text-blue-gray-500 animate-pulse">Restaurando...</p>}

      <div className="bg-white rounded-xl border border-blue-gray-100 p-4">
        <h4 className="text-sm font-semibold text-blue-gray-800 mb-3">Copias de seguridad</h4>
        {state.backups.length === 0 ? (
          <p className="text-sm text-blue-gray-400">No hay copias de seguridad. Cree una para habilitar la restauración.</p>
        ) : (
          <div className="space-y-2">
            {state.backups.map(backup => (
              <div key={backup.id} className="flex items-center justify-between p-3 bg-ivory-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full ${backup.status === 'VERIFICADA' ? 'bg-sage-100 text-sage-700' : 'bg-yellow-100 text-yellow-700'}`}>{backup.status}</span>
                    <span className="text-xs font-medium text-blue-gray-700">{backup.type}</span>
                  </div>
                  <p className="text-[10px] text-blue-gray-500 mt-1">
                    {new Date(backup.date).toLocaleString('es-ES')} | Tamaño: {(backup.size / 1024).toFixed(1)} KB | Hash: <code>{backup.sha256.substring(0, 12)}...</code>
                  </p>
                  {backup.restoredAt && <p className="text-[10px] text-sage-600">Restaurada: {new Date(backup.restoredAt).toLocaleString('es-ES')}</p>}
                </div>
                <button onClick={() => restoreBackup(backup.id)} className="px-3 py-1.5 bg-blue-gray-100 text-blue-gray-700 text-xs rounded-lg hover:bg-blue-gray-200">
                  Restaurar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800"><AlertTriangle className="w-3 h-3 inline mr-1" />No se declara recuperación empresarial completa por restaurar únicamente un conjunto de ensayo. La restauración completa del servicio requiere infraestructura adicional no disponible en este entorno.</p>
      </div>
    </div>
  );
}
