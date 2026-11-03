// SAE VERITAS - Tipos de datos
export type EvidenceLevel = 'E0' | 'E1' | 'E2' | 'E3' | 'E4';
export type ClaimStatus = 'BORRADOR' | 'PENDIENTE_AUTORIZACION' | 'AUTORIZADO' | 'PRUEBAS_PREPARADAS' | 'EN_EJECUCION' | 'EVIDENCIAS_REGISTRADAS' | 'REVISION_INTERNA' | 'CORRECCIONES' | 'REVISION_EXTERNA_PENDIENTE' | 'VERIFICADO_INTERNO' | 'VERIFICADO_INDEPENDIENTE' | 'CERRADO';
export type UserRole = 'ADMINISTRADOR' | 'RESPONSABLE_ORGANIZACION' | 'INVESTIGADOR' | 'EJECUTOR' | 'REVISOR_INTERNO' | 'REVISOR_EXTERNO' | 'AUDITOR' | 'LECTOR';
export type OrgStatus = 'ACTIVO' | 'INACTIVO' | 'EN_EVALUACION' | 'SINTETICO';
export type SystemType = 'IA' | 'AUTOMATIZACION' | 'HIBRIDO' | 'POR_DETERMINAR';
export type TestType = 'DETERMINISTA' | 'MODELO_REAL' | 'MANUAL_DOCUMENTADA';
export type MaturityLevel = 'DISENADO' | 'IMPLEMENTADO' | 'PROBADO_LOCAL' | 'PROBADO_CLOUD' | 'VALIDADO_SINTETICO' | 'VALIDADO_USUARIOS' | 'VALIDADO_PILOTO' | 'REVISADO_EXTERNO' | 'DISPONIBLE_COMERCIAL';
export type AIActClassification = 'FUERA_AMBITO' | 'NO_ALTO_RIESGO' | 'TRANSPARENCIA' | 'ALTO_RIESGO' | 'PRACTICA_PROHIBIDA' | 'INFO_INSUFICIENTE' | 'REVISION_JURIDICA';
export type FindingType = 'FALLO_CONFIRMADO' | 'RIESGO_POTENCIAL' | 'OBSERVACION' | 'EVIDENCIA_INSUFICIENTE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  createdAt: string;
  lastLogin?: string;
  active: boolean;
}

export interface Organization {
  id: string;
  name: string;
  identifier: string;
  sector: string;
  country: string;
  activity: string;
  responsibleUnit: string;
  authorizedContact: string;
  contractStatus: string;
  evaluationScope: string;
  restrictions: string;
  startDate: string;
  endDate?: string;
  status: OrgStatus;
  isSynthetic: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: string;
}

export interface TechSystem {
  id: string;
  organizationId: string;
  projectId: string;
  identifier: string;
  name: string;
  version: string;
  purpose: string;
  description: string;
  responsible: string;
  affectedProcesses: string[];
  users: string;
  systemType: SystemType;
  integrations: string[];
  dataUsed: string;
  autonomousCapacity: boolean;
  permissions: string;
  humanSupervision: boolean;
  technicalRisks: string;
  legalRisks: string;
  applicableRegulations: string[];
  documentation: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Claim {
  id: string;
  systemId: string;
  organizationId: string;
  text: string;
  source: string;
  date: string;
  responsible: string;
  evidenceLevel: EvidenceLevel;
  justification: string;
  documents: string[];
  controls: string[];
  tests: string[];
  results: string;
  limitations: string;
  reviewer?: string;
  status: ClaimStatus;
  createdAt: string;
  updatedAt: string;
  history: ClaimHistoryEntry[];
}

export interface ClaimHistoryEntry {
  date: string;
  fromLevel: EvidenceLevel;
  toLevel: EvidenceLevel;
  author: string;
  justification: string;
  evidenceIds: string[];
}

export interface LegalSource {
  id: string;
  identifier: string;
  primarySource: string;
  article: string;
  version: string;
  publicationDate: string;
  effectiveDate: string;
  applicationDate: string;
  scope: string;
  obligatedSubjects: string;
  conditions: string;
  exceptions: string;
  requirements: string;
  consultedDate: string;
  isLegalObligation: boolean;
}

export interface Control {
  id: string;
  identifier: string;
  category: string;
  objective: string;
  risk: string;
  procedure: string;
  requiredData: string;
  expectedResult: string;
  acceptanceCriteria: string;
  observedResult?: string;
  evidenceIds: string[];
  responsible: string;
  version: string;
  createdAt: string;
}

export interface TestProtocol {
  id: string;
  name: string;
  description: string;
  type: TestType;
  parameters: Record<string, string>;
  environment: string;
  authorizationId?: string;
  controlIds: string[];
  createdAt: string;
}

export interface TestRun {
  id: string;
  protocolId: string;
  claimId: string;
  systemId: string;
  executedAt: string;
  executedBy: string;
  status: 'PREPARADA' | 'EN_EJECUCION' | 'COMPLETADA' | 'FALLIDA' | 'INTERRUMPIDA';
  inputs: Record<string, string>;
  outputs: Record<string, string>;
  expectedResults: string;
  observedResults: string;
  passed: boolean;
  evidenceIds: string[];
  modelInfo?: {
    model: string;
    provider: string;
    parameters: Record<string, string>;
    prompt: string;
    response: string;
    latency: number;
    tokens: number;
    version: string;
  };
  duration: number;
}

export interface Evidence {
  id: string;
  type: string;
  origin: string;
  date: string;
  author: string;
  systemId?: string;
  claimId?: string;
  testRunId?: string;
  sha256: string;
  location: string;
  confidentiality: 'PUBLICA' | 'RESTRINGIDA' | 'CONFIDENCIAL';
  version: string;
  retention: string;
  status: 'ACTIVA' | 'ARCHIVADA' | 'ELIMINADA';
  content: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress?: string;
}

export interface HumanReview {
  id: string;
  claimId: string;
  reviewerId: string;
  reviewerName: string;
  type: 'INTERNA' | 'EXTERNA';
  date: string;
  scope: string;
  conflictsDeclared: string;
  evidenceReviewed: string[];
  conclusions: string;
  findings: string[];
  status: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';
}

export interface Finding {
  id: string;
  controlId: string;
  claimId?: string;
  type: FindingType;
  result: string;
  evidence: string;
  probableCause: string;
  impact: string;
  limitations: string;
  recommendation: string;
  responsible: string;
  status: 'ABIERTO' | 'EN_CORRECCION' | 'VERIFICADO' | 'CERRADO';
  date: string;
  correctionProof?: string;
  reviewer?: string;
}

export interface Report {
  id: string;
  type: string;
  title: string;
  organizationId?: string;
  systemId?: string;
  scope: string;
  version: string;
  date: string;
  methodology: string;
  sources: string[];
  results: string;
  limitations: string;
  responsible: string;
  reviewers: string[];
  sha256: string;
  format: 'PDF' | 'JSON' | 'CSV' | 'XLSX';
  status: 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO';
}

export interface Backup {
  id: string;
  date: string;
  type: 'COMPLETA' | 'INCREMENTAL' | 'EXPORTACION';
  size: number;
  sha256: string;
  status: 'COMPLETADA' | 'VERIFICADA' | 'FALLIDA';
  restoredAt?: string;
  integrityCheck: boolean;
}

export interface MercadonaSystem {
  id: string;
  name: string;
  identifier: string;
  documentedExistence: boolean;
  declaredFunction: string;
  source: string;
  evidenceLevel: EvidenceLevel;
  knownControls: string;
  uncertainties: string;
  applicableRegulations: string;
  requiredTests: string;
  isAI: boolean | null;
  notes: string;
}

export interface MercadonaCase {
  id: string;
  identifier: string;
  title: string;
  systemId: string;
  status: 'INVESTIGACION_DOCUMENTAL' | 'EN_PROGRESO' | 'PAUSADO' | 'CERRADO';
  objectives: string[];
  findings: string[];
  evidenceIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Scenario {
  id: string;
  number: number;
  title: string;
  description: string;
  status: 'PENDIENTE' | 'EJECUTADO' | 'FALLIDO';
  expectedResult: string;
  observedResult: string;
  logs: string[];
  executedAt?: string;
  passed: boolean;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  organizations: Organization[];
  projects: Project[];
  systems: TechSystem[];
  claims: Claim[];
  legalSources: LegalSource[];
  controls: Control[];
  testProtocols: TestProtocol[];
  testRuns: TestRun[];
  evidence: Evidence[];
  auditEvents: AuditEvent[];
  humanReviews: HumanReview[];
  findings: Finding[];
  reports: Report[];
  backups: Backup[];
  mercadonaSystems: MercadonaSystem[];
  mercadonaCases: MercadonaCase[];
  scenarios: Scenario[];
  platformMaturity: MaturityLevel;
  selfAssessment: {
    version: string;
    environment: string;
    testsPassed: number;
    testsFailed: number;
    lastRecovery: string;
    lastVerification: string;
  };
}
