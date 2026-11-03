import { useApp } from '../App';
import { Shield, Building2, Cpu, MessageSquare, FlaskConical, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { state } = useApp();

  const stats = [
    { label: 'Organizaciones', value: state.organizations.length, icon: Building2, color: 'bg-blue-gray-100 text-blue-gray-700' },
    { label: 'Sistemas', value: state.systems.length, icon: Cpu, color: 'bg-sage-100 text-sage-700' },
    { label: 'Afirmaciones', value: state.claims.length, icon: MessageSquare, color: 'bg-lavender-100 text-lavender-700' },
    { label: 'Controles', value: state.controls.length, icon: CheckCircle, color: 'bg-ivory-200 text-blue-gray-700' },
    { label: 'Pruebas ejecutadas', value: state.testRuns.length, icon: FlaskConical, color: 'bg-sage-100 text-sage-700' },
    { label: 'Evidencias', value: state.evidence.length, icon: Shield, color: 'bg-blue-gray-100 text-blue-gray-700' },
  ];

  const evidenceDistribution = {
    E0: state.claims.filter(c => c.evidenceLevel === 'E0').length,
    E1: state.claims.filter(c => c.evidenceLevel === 'E1').length,
    E2: state.claims.filter(c => c.evidenceLevel === 'E2').length,
    E3: state.claims.filter(c => c.evidenceLevel === 'E3').length,
    E4: state.claims.filter(c => c.evidenceLevel === 'E4').length,
  };

  const recentEvents = state.auditEvents.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-gray-900 to-blue-gray-700 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">Centro de Mando</h2>
            <p className="text-blue-gray-200 text-sm mt-1">Plataforma de verificación independiente de sistemas tecnológicos e inteligencia artificial</p>
            <p className="text-xs text-blue-gray-300 mt-2">AFIRMACIÓN → REQUISITO → CONTROL → PRUEBA → RESULTADO → EVIDENCIA → REVISIÓN → CONCLUSIÓN</p>
          </div>
          <Shield className="w-12 h-12 text-sage-400 opacity-50" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-lg border border-blue-gray-100 p-3 shadow-sm">
            <div className={`inline-flex p-2 rounded-lg ${s.color} mb-2`}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-blue-gray-900">{s.value}</p>
            <p className="text-xs text-blue-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evidence Level Distribution */}
        <div className="bg-white rounded-xl border border-blue-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-blue-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sage-500" />
            Distribución de niveles de evidencia (E0-E4)
          </h3>
          <div className="space-y-3">
            {Object.entries(evidenceDistribution).map(([level, count]) => {
              const total = state.claims.length || 1;
              const pct = (count / total) * 100;
              const colors: Record<string, string> = { E0: 'bg-red-200', E1: 'bg-orange-200', E2: 'bg-yellow-200', E3: 'bg-sage-200', E4: 'bg-lavender-300' };
              return (
                <div key={level} className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-blue-gray-700 w-6">{level}</span>
                  <div className="flex-1 bg-blue-gray-50 rounded-full h-5 overflow-hidden">
                    <div className={`h-full ${colors[level]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-blue-gray-600 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-blue-gray-400 mt-3">La escala mide respaldo probatorio, no madurez empresarial universal.</p>
        </div>

        {/* Platform Status */}
        <div className="bg-white rounded-xl border border-blue-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-blue-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-gray-500" />
            Estado de la plataforma
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-gray-600">Versión</span>
              <span className="font-mono text-blue-gray-800">{state.selfAssessment.version}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-gray-600">Entorno</span>
              <span className="text-blue-gray-800">{state.selfAssessment.environment}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-gray-600">Madurez</span>
              <span className="text-sage-600 font-medium">{state.platformMaturity.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-gray-600">Última verificación</span>
              <span className="text-blue-gray-800">{state.selfAssessment.lastVerification}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-gray-600">Pruebas superadas</span>
              <span className="text-sage-600">{state.selfAssessment.testsPassed}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-gray-600">Pruebas fallidas</span>
              <span className="text-red-600">{state.selfAssessment.testsFailed}</span>
            </div>
          </div>
          <div className="mt-3 p-2 bg-ivory-100 rounded-lg">
            <p className="text-[10px] text-blue-gray-500">No se ocultarán resultados desfavorables. La plataforma se evalúa a sí misma con los mismos criterios que aplica a terceros.</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-blue-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-blue-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-blue-gray-500" />
          Actividad reciente de auditoría
        </h3>
        {recentEvents.length === 0 ? (
          <p className="text-sm text-blue-gray-400 italic">Sin eventos registrados</p>
        ) : (
          <div className="space-y-2">
            {recentEvents.map(ev => (
              <div key={ev.id} className="flex items-center gap-3 text-sm p-2 bg-ivory-50 rounded-lg">
                <span className="text-[10px] text-blue-gray-400 font-mono">{new Date(ev.timestamp).toLocaleString('es-ES')}</span>
                <span className="font-medium text-blue-gray-700">{ev.action}</span>
                <span className="text-blue-gray-500">{ev.details}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Principles */}
      <div className="bg-lavender-50 border border-lavender-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-lavender-500 mb-2">Principio Fundacional</h3>
        <p className="text-xs text-blue-gray-700 leading-relaxed">
          La excelencia tecnológica no se mide únicamente por los sistemas desarrollados, sino por la posibilidad de demostrar que funcionan dentro de límites definidos, producen resultados fiables, respetan los derechos de las personas y admiten verificación independiente.
        </p>
        <p className="text-xs text-blue-gray-600 mt-2 italic">
          La ausencia de evidencia pública no equivale a inexistencia, deficiencia o incumplimiento.
        </p>
      </div>
    </div>
  );
}
