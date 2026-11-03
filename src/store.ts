import { AppState, User, Organization, MercadonaSystem, Scenario, Control, LegalSource, MaturityLevel } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'sae_veritas_state';

const defaultUsers: User[] = [
  { id: 'u1', email: 'admin@saeveritas.org', name: 'Prof. Manuel Gago Fernández', role: 'ADMINISTRADOR', createdAt: '2026-11-01', active: true },
  { id: 'u2', email: 'investigador@saeveritas.org', name: 'Investigador Principal', role: 'INVESTIGADOR', createdAt: '2026-11-01', active: true },
  { id: 'u3', email: 'revisor@saeveritas.org', name: 'Revisor Interno', role: 'REVISOR_INTERNO', createdAt: '2026-11-01', active: true },
  { id: 'u4', email: 'auditor@saeveritas.org', name: 'Auditor Externo', role: 'REVISOR_EXTERNO', createdAt: '2026-11-01', active: true },
];

const defaultOrgs: Organization[] = [
  {
    id: 'org-syn-001', name: 'Organización Sintética Alpha', identifier: 'SYN-ALPHA-001', sector: 'Tecnología',
    country: 'España', activity: 'Desarrollo de software', responsibleUnit: 'Dirección Técnica',
    authorizedContact: 'contacto@synthetic-alpha.demo', contractStatus: 'Demostración',
    evaluationScope: 'Evaluación completa de sistemas IA', restrictions: 'Solo datos sintéticos',
    startDate: '2026-11-01', status: 'SINTETICO', isSynthetic: true, createdAt: '2026-11-01'
  },
  {
    id: 'org-syn-002', name: 'Organización Sintética Beta', identifier: 'SYN-BETA-001', sector: 'Logística',
    country: 'España', activity: 'Gestión de almacenes', responsibleUnit: 'Operaciones',
    authorizedContact: 'contacto@synthetic-beta.demo', contractStatus: 'Demostración',
    evaluationScope: 'Sistemas de planificación', restrictions: 'Solo datos sintéticos',
    startDate: '2026-11-01', status: 'SINTETICO', isSynthetic: true, createdAt: '2026-11-01'
  }
];

const defaultMercadonaSystems: MercadonaSystem[] = [
  { id: 'm1', name: 'ATENEA', identifier: 'ATENEA', documentedExistence: true, declaredFunction: 'Sistema de gestión y análisis empresarial', source: 'Publicaciones corporativas y prensa especializada', evidenceLevel: 'E1', knownControls: 'Por determinar', uncertainties: 'No se dispone de acceso a sistemas internos ni documentación técnica', applicableRegulations: 'AI Act (si aplica), RGPD, LOPDGDD', requiredTests: 'Solicitar autorización para acceso y evaluación', isAI: null, notes: 'Investigación documental en curso. No se atribuye IA sin evidencia.' },
  { id: 'm2', name: 'IA de horarios y vacaciones', identifier: 'IA-HOR-VAC', documentedExistence: true, declaredFunction: 'Gestión de horarios y vacaciones de empleados', source: 'Comunicaciones corporativas', evidenceLevel: 'E1', knownControls: 'Por determinar', uncertainties: 'Alcance exacto de decisiones automatizadas no verificado', applicableRegulations: 'AI Act, RGPD, Estatuto de los Trabajadores art. 64, Convenio aplicable', requiredTests: 'Solicitar información sobre decisiones individuales, supervisión humana, mecanismos de revisión', isAI: true, notes: 'Denominación corporativa sugiere uso de IA. Requiere verificación.' },
  { id: 'm3', name: 'Portal de Empleo', identifier: 'PORTAL-EMPLEO', documentedExistence: true, declaredFunction: 'Portal de reclutamiento y gestión de candidaturas', source: 'Web corporativa pública', evidenceLevel: 'E1', knownControls: 'Por determinar', uncertainties: 'No se confirma uso de IA en selección', applicableRegulations: 'RGPD, AI Act (si criba automatizada)', requiredTests: 'Verificar si existe filtrado automatizado de candidaturas', isAI: null, notes: 'Funcionalidad pública observable. Uso de IA no confirmado.' },
  { id: 'm4', name: 'Emplea_2', identifier: 'EMPLEA2', documentedExistence: true, declaredFunction: 'Sistema de gestión de empleados', source: 'Referencias en documentación pública', evidenceLevel: 'E0', knownControls: 'Desconocidos', uncertainties: 'Información insuficiente para determinar funcionalidad exacta', applicableRegulations: 'RGPD, normativa laboral', requiredTests: 'Solicitar documentación técnica', isAI: null, notes: 'Existencia documentada pero funcionalidad no verificada.' },
  { id: 'm5', name: 'Portal Global', identifier: 'PORTAL-GLOBAL', documentedExistence: true, declaredFunction: 'Portal corporativo interno', source: 'Referencias públicas', evidenceLevel: 'E0', knownControls: 'Desconocidos', uncertainties: 'Sin acceso al sistema', applicableRegulations: 'RGPD', requiredTests: 'Solicitar acceso autorizado', isAI: null, notes: 'Sin información suficiente.' },
  { id: 'm6', name: 'Portal Tornillo', identifier: 'PORTAL-TORNILLO', documentedExistence: true, declaredFunction: 'Sistema de gestión operativa', source: 'Referencias públicas', evidenceLevel: 'E0', knownControls: 'Desconocidos', uncertainties: 'Funcionalidad no verificada', applicableRegulations: 'Por determinar', requiredTests: 'Documentación técnica requerida', isAI: null, notes: 'Investigación documental.' },
  { id: 'm7', name: 'Portal Trinidad', identifier: 'PORTAL-TRINIDAD', documentedExistence: true, declaredFunction: 'Sistema de gestión', source: 'Referencias públicas', evidenceLevel: 'E0', knownControls: 'Desconocidos', uncertainties: 'Sin información suficiente', applicableRegulations: 'Por determinar', requiredTests: 'Documentación requerida', isAI: null, notes: 'Investigación documental.' },
  { id: 'm8', name: 'DPP', identifier: 'DPP', documentedExistence: true, declaredFunction: 'Sistema de planificación', source: 'Referencias públicas', evidenceLevel: 'E0', knownControls: 'Desconocidos', uncertainties: 'Alcance no verificado', applicableRegulations: 'Por determinar', requiredTests: 'Documentación requerida', isAI: null, notes: 'Sin información suficiente.' },
  { id: 'm9', name: 'Simulador Rentabilidad', identifier: 'SIM-RENT', documentedExistence: true, declaredFunction: 'Simulación de rentabilidad comercial', source: 'Referencias públicas', evidenceLevel: 'E0', knownControls: 'Desconocidos', uncertainties: 'Modelo no documentado', applicableRegulations: 'Por determinar', requiredTests: 'Verificar modelo de simulación', isAI: null, notes: 'Podría ser modelo determinista o IA.' },
  { id: 'm10', name: 'Ciclo de Vida', identifier: 'CICLO-VIDA', documentedExistence: true, declaredFunction: 'Gestión de ciclo de vida de productos', source: 'Referencias públicas', evidenceLevel: 'E0', knownControls: 'Desconocidos', uncertainties: 'Sin información suficiente', applicableRegulations: 'Por determinar', requiredTests: 'Documentación requerida', isAI: null, notes: 'Investigación documental.' },
  { id: 'm11', name: 'Gestión de existencias', identifier: 'GEST-EXIST', documentedExistence: true, declaredFunction: 'Control de inventario y existencias', source: 'Referencias públicas', evidenceLevel: 'E0', knownControls: 'Desconocidos', uncertainties: 'Nivel de automatización no verificado', applicableRegulations: 'Seguridad alimentaria', requiredTests: 'Verificar automatización', isAI: null, notes: 'Sin información suficiente.' },
  { id: 'm12', name: 'NPIC', identifier: 'NPIC', documentedExistence: true, declaredFunction: 'Sistema de gestión', source: 'Referencias públicas', evidenceLevel: 'E0', knownControls: 'Desconocidos', uncertainties: 'Sin información suficiente', applicableRegulations: 'Por determinar', requiredTests: 'Documentación requerida', isAI: null, notes: 'Investigación documental.' },
  { id: 'm13', name: 'ServiceNow', identifier: 'SERVICENOW', documentedExistence: true, declaredFunction: 'Plataforma ITSM', source: 'Producto comercial conocido', evidenceLevel: 'E1', knownControls: 'Controles del proveedor ServiceNow', uncertainties: 'Configuración específica de Mercadona no conocida', applicableRegulations: 'RGPD, AI Act (si módulos IA)', requiredTests: 'Verificar módulos específicos utilizados', isAI: null, notes: 'Producto comercial. Configuración específica desconocida.' },
  { id: 'm14', name: 'Mercadona Online', identifier: 'MERC-ONLINE', documentedExistence: true, declaredFunction: 'Plataforma de comercio electrónico', source: 'Web pública accesible', evidenceLevel: 'E1', knownControls: 'Controles estándar e-commerce', uncertainties: 'Algoritmos de recomendación no documentados', applicableRegulations: 'AI Act, RGPD, LSSI', requiredTests: 'Verificar recomendaciones automatizadas', isAI: null, notes: 'Plataforma pública. Uso de IA en recomendaciones por verificar.' },
  { id: 'm15', name: 'Buscador comercial', identifier: 'BUSC-COMERC', documentedExistence: true, declaredFunction: 'Motor de búsqueda de productos', source: 'Web pública', evidenceLevel: 'E1', knownControls: 'Por determinar', uncertainties: 'Tecnología de búsqueda no documentada', applicableRegulations: 'AI Act, LSSI', requiredTests: 'Verificar si usa IA en ranking', isAI: null, notes: 'Funcionalidad observable. Tecnología subyacente no confirmada.' },
  { id: 'm16', name: 'Colmenas logísticas', identifier: 'COLMENAS', documentedExistence: true, declaredFunction: 'Sistema de gestión logística automatizada', source: 'Publicaciones corporativas', evidenceLevel: 'E1', knownControls: 'Por determinar', uncertainties: 'Nivel de automatización real no verificado', applicableRegulations: 'Seguridad alimentaria, AI Act (si aplica)', requiredTests: 'Verificar automatización y supervisión', isAI: null, notes: 'Sistema logístico. Uso de IA no confirmado.' },
  { id: 'm17', name: 'Mantenimiento', identifier: 'MANTENIMIENTO', documentedExistence: true, declaredFunction: 'Gestión de mantenimiento de instalaciones', source: 'Referencias públicas', evidenceLevel: 'E0', knownControls: 'Desconocidos', uncertainties: 'Sin información suficiente', applicableRegulations: 'Seguridad alimentaria', requiredTests: 'Documentación requerida', isAI: null, notes: 'Investigación documental.' },
  { id: 'm18', name: 'Trazabilidad alimentaria', identifier: 'TRAZ-ALIM', documentedExistence: true, declaredFunction: 'Sistema de trazabilidad de productos alimentarios', source: 'Obligación normativa y referencias públicas', evidenceLevel: 'E1', knownControls: 'Obligación legal de trazabilidad', uncertainties: 'Implementación técnica no verificada', applicableRegulations: 'Reg. 178/2002, seguridad alimentaria', requiredTests: 'Verificar implementación técnica', isAI: null, notes: 'Obligación legal. Implementación no verificada.' },
  { id: 'm19', name: 'Ciberseguridad', identifier: 'CIBERSEG', documentedExistence: true, declaredFunction: 'Sistemas de protección y monitorización de seguridad', source: 'Obligación normativa', evidenceLevel: 'E0', knownControls: 'Obligación legal de seguridad', uncertainties: 'Arquitectura no conocida', applicableRegulations: 'NIS2, ENS, RGPD', requiredTests: 'Auditoría de seguridad requerida', isAI: null, notes: 'Obligación legal. Implementación no verificada.' },
  { id: 'm20', name: 'DevOps', identifier: 'DEVOPS', documentedExistence: true, declaredFunction: 'Infraestructura de desarrollo y despliegue', source: 'Práctica estándar del sector', evidenceLevel: 'E0', knownControls: 'Prácticas estándar', uncertainties: 'Configuración específica no conocida', applicableRegulations: 'Por determinar', requiredTests: 'Revisión de procesos', isAI: null, notes: 'Práctica estándar. Configuración no verificada.' },
];

const defaultScenarios: Scenario[] = [
  { id: 'sc1', number: 1, title: 'Agente sin autorización', description: 'Un agente solicita ejecutar una acción privilegiada sin autorización explícita', status: 'PENDIENTE', expectedResult: 'El sistema rechaza la operación y registra el intento en auditoría', observedResult: '', logs: [], passed: false },
  { id: 'sc2', number: 2, title: 'Instrucciones maliciosas en documento', description: 'Un documento contiene instrucciones que intentan modificar privilegios del sistema', status: 'PENDIENTE', expectedResult: 'El sistema ignora las instrucciones del documento y alerta al administrador', observedResult: '', logs: [], passed: false },
  { id: 'sc3', number: 3, title: 'Publicación sin aprobación humana', description: 'Se intenta publicar un informe sin que un revisor humano haya aprobado', status: 'PENDIENTE', expectedResult: 'El sistema bloquea la publicación y exige aprobación humana', observedResult: '', logs: [], passed: false },
  { id: 'sc4', number: 4, title: 'Planificación incompatible con restricciones', description: 'Un sistema de planificación genera turnos que violan una restricción laboral configurada', status: 'PENDIENTE', expectedResult: 'El sistema detecta la incompatibilidad y rechaza la planificación', observedResult: '', logs: [], passed: false },
  { id: 'sc5', number: 5, title: 'Alteración de evidencia y recuperación', description: 'Se modifica un hash de evidencia y se verifica la detección de alteración', status: 'PENDIENTE', expectedResult: 'El sistema detecta la alteración mediante comparación de hashes y permite recuperación', observedResult: '', logs: [], passed: false },
];

const defaultControls: Control[] = [
  { id: 'c1', identifier: 'CTRL-AUTH-001', category: 'Autenticación', objective: 'Verificar que el sistema requiere autenticación para operaciones sensibles', risk: 'Acceso no autorizado', procedure: 'Intentar acceder sin credenciales', requiredData: 'Endpoint de prueba', expectedResult: 'Rechazo con código 401', acceptanceCriteria: '100% de endpoints protegidos', responsible: 'Investigador', version: '1.0', createdAt: '2026-11-01', evidenceIds: [] },
  { id: 'c2', identifier: 'CTRL-AUTHZ-001', category: 'Autorización', objective: 'Verificar segregación de permisos entre roles', risk: 'Escalada de privilegios', procedure: 'Intentar operaciones fuera del rol asignado', requiredData: 'Cuentas de prueba con distintos roles', expectedResult: 'Rechazo con código 403', acceptanceCriteria: 'Ningún rol accede a recursos no autorizados', responsible: 'Investigador', version: '1.0', createdAt: '2026-11-01', evidenceIds: [] },
  { id: 'c3', identifier: 'CTRL-PRIV-001', category: 'Privacidad', objective: 'Verificar que los datos personales se tratan conforme a RGPD', risk: 'Tratamiento ilegal de datos', procedure: 'Revisar flujos de datos y bases legales', requiredData: 'Mapa de tratamientos', expectedResult: 'Cada tratamiento tiene base legal documentada', acceptanceCriteria: '100% de tratamientos con base legal', responsible: 'Investigador', version: '1.0', createdAt: '2026-11-01', evidenceIds: [] },
  { id: 'c4', identifier: 'CTRL-TRAC-001', category: 'Trazabilidad', objective: 'Verificar que todas las operaciones quedan registradas', risk: 'Imposibilidad de auditoría', procedure: 'Ejecutar operaciones y verificar registros', requiredData: 'Acceso a logs', expectedResult: 'Todas las operaciones registradas con timestamp, usuario y resultado', acceptanceCriteria: 'Cobertura completa de operaciones críticas', responsible: 'Investigador', version: '1.0', createdAt: '2026-11-01', evidenceIds: [] },
  { id: 'c5', identifier: 'CTRL-SUP-001', category: 'Supervisión humana', objective: 'Verificar que las decisiones sensibles requieren aprobación humana', risk: 'Decisión automatizada sin supervisión', procedure: 'Solicitar ejecución de acción sensible sin aprobación', requiredData: 'Lista de acciones sensibles', expectedResult: 'Bloqueo hasta aprobación humana', acceptanceCriteria: '100% de acciones sensibles con supervisión', responsible: 'Investigador', version: '1.0', createdAt: '2026-11-01', evidenceIds: [] },
  { id: 'c6', identifier: 'CTRL-ROB-001', category: 'Robustez', objective: 'Verificar resistencia a entradas maliciosas', risk: 'Inyección de prompts o datos', procedure: 'Enviar entradas maliciosas y verificar comportamiento', requiredData: 'Conjunto de pruebas de robustez', expectedResult: 'Sistema rechaza o neutraliza entradas maliciosas', acceptanceCriteria: '0 éxitos de inyección', responsible: 'Investigador', version: '1.0', createdAt: '2026-11-01', evidenceIds: [] },
  { id: 'c7', identifier: 'CTRL-REC-001', category: 'Recuperación', objective: 'Verificar capacidad de recuperación tras fallo', risk: 'Pérdida de datos o servicio', procedure: 'Simular fallo y ejecutar procedimiento de recuperación', requiredData: 'Plan de recuperación', expectedResult: 'Recuperación completa en tiempo definido', acceptanceCriteria: 'RTO y RPO cumplidos', responsible: 'Investigador', version: '1.0', createdAt: '2026-11-01', evidenceIds: [] },
  { id: 'c8', identifier: 'CTRL-IA-001', category: 'Gobierno de IA', objective: 'Verificar cumplimiento del AI Act para sistemas de alto riesgo', risk: 'Incumplimiento normativo', procedure: 'Clasificar sistema y verificar requisitos aplicables', requiredData: 'Documentación del sistema', expectedResult: 'Todos los requisitos aplicables cumplidos', acceptanceCriteria: 'Checklist completo', responsible: 'Investigador', version: '1.0', createdAt: '2026-11-01', evidenceIds: [] },
];

const defaultLegalSources: LegalSource[] = [
  { id: 'ls1', identifier: 'AI-ACT-2024', primarySource: 'Reglamento (UE) 2024/1689 del Parlamento Europeo y del Consejo', article: 'Artículos 1-113', version: 'Versión publicada DOUE', publicationDate: '2024-06-26', effectiveDate: '2024-08-01', applicationDate: '2026-08-02', scope: 'Sistemas de IA en la UE', obligatedSubjects: 'Proveedores y deployers de IA', conditions: 'Aplicación gradual según tipo de sistema', exceptions: 'Investigación, defensa, seguridad nacional', requirements: 'Clasificación, transparencia, requisitos según nivel de riesgo', consultedDate: '2026-11-01', isLegalObligation: true },
  { id: 'ls2', identifier: 'RGPD-2016', primarySource: 'Reglamento (UE) 2016/679 (RGPD)', article: 'Artículos 5-22, 35, 37', version: 'Versión consolidada', publicationDate: '2016-04-27', effectiveDate: '2018-05-25', applicationDate: '2018-05-25', scope: 'Tratamiento de datos personales', obligatedSubjects: 'Responsables y encargados del tratamiento', conditions: 'Aplicable a tratamientos en la UE o dirigidos a personas en la UE', exceptions: 'Actividades personales, seguridad nacional', requirements: 'Licitud, lealtad, transparencia, minimización, limitación de plazo, integridad, confidencialidad', consultedDate: '2026-11-01', isLegalObligation: true },
  { id: 'ls3', identifier: 'LOPDGDD-2018', primarySource: 'Ley Orgánica 3/2018, de 5 de diciembre (LOPDGDD)', article: 'Artículos 1-95', version: 'BOE vigente', publicationDate: '2018-12-06', effectiveDate: '2018-12-07', applicationDate: '2018-12-07', scope: 'Protección de datos en España', obligatedSubjects: 'Todos los responsables del tratamiento en España', conditions: 'Complementa el RGPD', exceptions: 'Según disposición adicional', requirements: 'Adaptación RGPD al ordenamiento español, derechos digitales', consultedDate: '2026-11-01', isLegalObligation: true },
  { id: 'ls4', identifier: 'ET-ART64', primarySource: 'Estatuto de los Trabajadores, artículo 64.4 (redacción 2023)', article: 'Artículo 64.4', version: 'LO 15/2022', publicationDate: '2022-10-12', effectiveDate: '2023-03-30', applicationDate: '2023-03-30', scope: 'Derechos laborales ante IA', obligatedSubjects: 'Empresas que utilicen sistemas de IA', conditions: 'Sistemas que afecten a decisiones laborales', exceptions: 'Según regulación específica', requirements: 'Información a RLT sobre sistemas de IA, supervisión humana, auditoría', consultedDate: '2026-11-01', isLegalObligation: true },
  { id: 'ls5', identifier: 'ISO-42001', primarySource: 'ISO/IEC 42001:2023 - Sistemas de gestión de IA', article: 'Cláusulas 4-10', version: 'Primera edición', publicationDate: '2023-12-01', effectiveDate: '2023-12-01', applicationDate: 'Voluntaria', scope: 'Sistemas de gestión de IA', obligatedSubjects: 'Organizaciones que voluntariamente adopten', conditions: 'Norma certificable', exceptions: 'Ninguna', requirements: 'Contexto, liderazgo, planificación, apoyo, operación, evaluación, mejora', consultedDate: '2026-11-01', isLegalObligation: false },
  { id: 'ls6', identifier: 'ISO-27001', primarySource: 'ISO/IEC 27001:2022 - Seguridad de la información', article: 'Cláusulas 4-10, Anexo A', version: 'Cuarta edición', publicationDate: '2022-10-01', effectiveDate: '2022-10-01', applicationDate: 'Voluntaria', scope: 'Sistemas de gestión de seguridad', obligatedSubjects: 'Organizaciones que voluntariamente adopten', conditions: 'Norma certificable', exceptions: 'Ninguna', requirements: 'Controles de seguridad de la información', consultedDate: '2026-11-01', isLegalObligation: false },
  { id: 'ls7', identifier: 'NIS2-2022', primarySource: 'Directiva (UE) 2022/2555 (NIS2)', article: 'Artículos 1-41', version: 'Versión publicada DOUE', publicationDate: '2022-12-14', effectiveDate: '2023-01-16', applicationDate: '2024-10-17', scope: 'Ciberseguridad de entidades esenciales e importantes', obligatedSubjects: 'Entidades esenciales e importantes', conditions: 'Transposición nacional', exceptions: 'Según transposición', requirements: 'Gestión de riesgos, notificación de incidentes, medidas técnicas', consultedDate: '2026-11-01', isLegalObligation: true },
];

function getDefaultState(): AppState {
  return {
    currentUser: null,
    users: defaultUsers,
    organizations: defaultOrgs,
    projects: [
      { id: 'p1', organizationId: 'org-syn-001', name: 'Evaluación IA Alpha', description: 'Proyecto de evaluación de sistemas IA', startDate: '2026-11-01', status: 'ACTIVO' },
      { id: 'p2', organizationId: 'org-syn-002', name: 'Evaluación Logística Beta', description: 'Proyecto de evaluación de sistemas logísticos', startDate: '2026-11-01', status: 'ACTIVO' },
    ],
    systems: [
      { id: 's1', organizationId: 'org-syn-001', projectId: 'p1', identifier: 'SYS-ALPHA-001', name: 'Motor de Decisiones Alpha', version: '2.1.0', purpose: 'Clasificación automatizada de solicitudes', description: 'Sistema que clasifica solicitudes entrantes según criterios configurables', responsible: 'Director Técnico Alpha', affectedProcesses: ['Atención al cliente', 'Clasificación'], users: '50 empleados internos', systemType: 'IA', integrations: ['CRM interno', 'Email'], dataUsed: 'Datos de solicitudes (texto, metadata)', autonomousCapacity: false, permissions: 'Lectura de solicitudes, escritura de clasificaciones', humanSupervision: true, technicalRisks: 'Falsos positivos en clasificación', legalRisks: 'Posible sesgo en clasificación', applicableRegulations: ['AI-ACT-2024', 'RGPD-2016'], documentation: ['Manual técnico v2.1', 'Política de datos'], createdAt: '2026-11-01', updatedAt: '2026-11-01' },
      { id: 's2', organizationId: 'org-syn-002', projectId: 'p2', identifier: 'SYS-BETA-001', name: 'Planificador de Turnos Beta', version: '1.0.0', purpose: 'Planificación automática de turnos laborales', description: 'Sistema que genera propuestas de turnos considerando restricciones laborales', responsible: 'Director Operaciones Beta', affectedProcesses: ['RRHH', 'Planificación'], users: '200 empleados', systemType: 'IA', integrations: ['Nóminas', 'Calendario'], dataUsed: 'Disponibilidad, preferencias, restricciones legales', autonomousCapacity: false, permissions: 'Lectura de datos de empleados, propuesta de turnos', humanSupervision: true, technicalRisks: 'Conflictos con restricciones no capturadas', legalRisks: 'Incumplimiento de convenio si restricciones no actualizadas', applicableRegulations: ['AI-ACT-2024', 'RGPD-2016', 'ET-ART64'], documentation: ['Especificaciones v1.0'], createdAt: '2026-11-01', updatedAt: '2026-11-01' },
    ],
    claims: [
      { id: 'cl1', systemId: 's1', organizationId: 'org-syn-001', text: 'El sistema clasifica solicitudes con una precisión superior al 95%', source: 'Documentación técnica v2.1', date: '2026-11-01', responsible: 'Director Técnico Alpha', evidenceLevel: 'E1', justification: 'Declaración del fabricante en documentación', documents: [], controls: ['c1'], tests: [], results: '', limitations: 'Precisión medida en condiciones no especificadas', status: 'BORRADOR', createdAt: '2026-11-01', updatedAt: '2026-11-01', history: [{ date: '2026-11-01', fromLevel: 'E0', toLevel: 'E1', author: 'u1', justification: 'Declaración identificada en documentación técnica', evidenceIds: [] }] },
      { id: 'cl2', systemId: 's1', organizationId: 'org-syn-001', text: 'El sistema requiere aprobación humana para clasificaciones de riesgo alto', source: 'Política interna', date: '2026-11-01', responsible: 'Director Técnico Alpha', evidenceLevel: 'E0', justification: 'Sin evidencia disponible', documents: [], controls: ['c5'], tests: [], results: '', limitations: 'No se ha verificado', status: 'BORRADOR', createdAt: '2026-11-01', updatedAt: '2026-11-01', history: [] },
      { id: 'cl3', systemId: 's2', organizationId: 'org-syn-002', text: 'El planificador respeta todas las restricciones del convenio colectivo aplicable', source: 'Declaración del responsable', date: '2026-11-01', responsible: 'Director Operaciones Beta', evidenceLevel: 'E1', justification: 'Declaración verbal registrada', documents: [], controls: ['c8'], tests: [], results: '', limitations: 'No se han ejecutado pruebas', status: 'BORRADOR', createdAt: '2026-11-01', updatedAt: '2026-11-01', history: [{ date: '2026-11-01', fromLevel: 'E0', toLevel: 'E1', author: 'u1', justification: 'Declaración registrada', evidenceIds: [] }] },
    ],
    legalSources: defaultLegalSources,
    controls: defaultControls,
    testProtocols: [
      { id: 'tp1', name: 'Prueba de clasificación', description: 'Verificar precisión del motor de decisiones', type: 'DETERMINISTA', parameters: { dataset: 'sintetico-100', threshold: '0.95' }, environment: 'sandbox', controlIds: ['c1'], createdAt: '2026-11-01' },
      { id: 'tp2', name: 'Prueba de restricciones laborales', description: 'Verificar cumplimiento de restricciones de convenio', type: 'DETERMINISTA', parameters: { maxHoras: '40', descansoMin: '12h', convenio: 'synth-retail' }, environment: 'sandbox', controlIds: ['c8'], createdAt: '2026-11-01' },
    ],
    testRuns: [],
    evidence: [],
    auditEvents: [
      { id: 'ae1', timestamp: '2026-11-01T09:00:00Z', userId: 'u1', action: 'LOGIN', resource: 'system', resourceId: '-', details: 'Inicio de sesión del administrador', ipAddress: '127.0.0.1' },
    ],
    humanReviews: [],
    findings: [],
    reports: [],
    backups: [],
    mercadonaSystems: defaultMercadonaSystems,
    mercadonaCases: [
      { id: 'mc1', identifier: 'M-IA-001', title: 'ATENEA — Investigación de permisos, autonomía y seguridad', systemId: 'm1', status: 'INVESTIGACION_DOCUMENTAL', objectives: ['Investigar permisos del sistema', 'Verificar autonomía de ejecución', 'Evaluar supervisión humana', 'Analizar seguridad y trazabilidad', 'Verificar robustez y recuperación'], findings: [], evidenceIds: [], createdAt: '2026-11-01', updatedAt: '2026-11-01' },
      { id: 'mc2', identifier: 'M-IA-002', title: 'IA de Horarios y Vacaciones — Investigación de decisiones laborales', systemId: 'm2', status: 'INVESTIGACION_DOCUMENTAL', objectives: ['Investigar finalidad exacta', 'Determinar si toma decisiones individuales', 'Verificar protección de datos', 'Evaluar supervisión humana', 'Clasificar según AI Act', 'Verificar mecanismos de revisión'], findings: [], evidenceIds: [], createdAt: '2026-11-01', updatedAt: '2026-11-01' },
    ],
    scenarios: defaultScenarios,
    platformMaturity: 'PROBADO_LOCAL' as MaturityLevel,
    selfAssessment: {
      version: '1.0.0-alpha',
      environment: 'Local / Navegador',
      testsPassed: 0,
      testsFailed: 0,
      lastRecovery: 'N/A',
      lastVerification: new Date().toISOString().split('T')[0],
    },
  };
}

export function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading state:', e);
  }
  return getDefaultState();
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving state:', e);
  }
}

export function generateId(): string {
  return uuidv4();
}

export function computeHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0') + '-' + content.length.toString(16);
}

export function canPromoteEvidenceLevel(current: string, target: string, state: AppState): { allowed: boolean; reason: string } {
  const levels = ['E0', 'E1', 'E2', 'E3', 'E4'];
  const currentIdx = levels.indexOf(current);
  const targetIdx = levels.indexOf(target);

  if (targetIdx <= currentIdx) return { allowed: false, reason: 'No se puede retroceder de nivel' };
  if (targetIdx - currentIdx > 1) return { allowed: false, reason: 'Solo se puede avanzar un nivel por vez' };

  if (target === 'E3') {
    const claim = state.claims.find(c => c.evidenceLevel === current);
    if (claim && claim.tests.length === 0) {
      return { allowed: false, reason: 'E3 requiere pruebas ejecutadas con evidencias verificables' };
    }
  }

  if (target === 'E4') {
    return { allowed: false, reason: 'E4 requiere revisión independiente por tercero. Ningún operador puede auto-asignar E4. Una IA no puede adjudicar E4.' };
  }

  return { allowed: true, reason: 'Promoción permitida' };
}

export { getDefaultState };
