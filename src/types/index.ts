export type StreamType = 'PCM' | 'PCB' | 'Commerce with Maths' | 'Commerce' | 'Arts/Humanities' | 'Other';

export type CollegeType = 
  | 'Central Govt' 
  | 'State Govt' 
  | 'Deemed University' 
  | 'Private Tier-1' 
  | 'Private Autonomous'
  | 'Public-Private Partnership (PPP)';

export type VerificationStatus = 
  | 'Fully Verified' 
  | 'Partially Verified' 
  | 'Under Audit Review';

export type SourceType = 
  | 'NIRF MHRD Report' 
  | 'AICTE Mandatory Disclosure' 
  | 'Official Institute Prospectus' 
  | 'State Admission Authority (JAC/JoSAA/CET)' 
  | 'University Fee Regulatory Committee';

export interface OfficialSource {
  title: string;
  url: string;
  sourceType: SourceType;
  academicYear: string;
  lastVerifiedDate: string;
  confidenceScore: number; // 0 - 100
}

export interface CourseFee {
  tuitionFeePerYear: number;
  oneTimeAdmissionFee: number;
  cautionDepositRefundable: number;
  otherAcademicChargesPerYear: number;
  totalCourseFee: number; // calculated for full duration
  currency: 'INR';
  verificationStatus: 'Verified' | 'Pending 2025 Revision';
  officialDocRef: string;
  lastAuditedDate: string;
}

export interface CourseEligibility {
  min12thPercentage: number;
  mandatorySubjects: string[];
  streamRequired: StreamType[];
  categoryRelaxationNotes?: string;
  ageLimit?: string;
  verificationStatus: 'Verified' | 'Estimated';
}

export interface EntranceExamRequirement {
  examName: string; // e.g. "JEE Main", "CUET-UG", "BITSAT", "COMEDK", "MET", "Direct / Merit"
  accepted: boolean;
  isCompulsory: boolean;
  typicalCutoffRange: string; // e.g. "93 - 97.5 Percentile" or "Rank 4000 - 12000"
  counselingAuthority: string; // e.g. "JoSAA", "JAC Delhi", "COMEDK", "Institutional"
  lastYearClosingCutoff?: string;
}

export interface AdmissionDeadline {
  roundName: string;
  startDate: string;
  lastDate: string;
  counselingAuthority: string;
  status: 'Open' | 'Upcoming' | 'Closed';
  officialPortalUrl: string;
}

export interface PlacementRecord {
  academicYear: string; // e.g. "2023-2024"
  medianCtcLpa: number;
  averageCtcLpa: number;
  highestDomesticCtcLpa: number;
  placementPercentage: number;
  totalOffers: number;
  topRecruiters: string[];
  nirfReportFiled: boolean;
  sourceUrl: string;
  sourceType: string;
  verifiedDate: string;
}

export interface ScholarshipOption {
  title: string;
  criteria: string;
  benefit: string;
  type: 'Merit-based' | 'Need-based' | 'Defence/Sports';
}

export interface CollegeCourse {
  courseId: string;
  degree: 'B.Tech' | 'BBA' | 'BCA' | 'MBA' | 'B.Sc' | 'B.Des' | 'BA LLB';
  specialization: string;
  durationYears: number;
  seatsTotal: number;
  eligibility: CourseEligibility;
  fees: CourseFee;
  entranceExams: EntranceExamRequirement[];
  admissionsDeadlines: AdmissionDeadline[];
  placements: PlacementRecord;
  scholarships: ScholarshipOption[];
}

export interface HostelDetails {
  available: boolean;
  boysHostelAvailable: boolean;
  girlsHostelAvailable: boolean;
  feePerYear: number;
  messIncluded: boolean;
  occupancyOptions: string[]; // e.g. ["Single AC", "2-Sharing Non-AC", "3-Sharing"]
  curfewTime?: string;
  hygieneRating: number; // 1-5
  securityRating: number; // 1-5
  remarks: string;
  verificationStatus: 'Verified' | 'Student Reported';
}

export interface CampusLifeDetails {
  studentClubsCount: number;
  annualFests: string[];
  sportsFacilities: string[];
  attendancePolicy: string; // e.g. "Strict 75% Biometric", "Relaxed 65%", "Flexible"
  wifiCampus: boolean;
  metroConnectivityKm: number;
  campusAreaAcres: number;
}

export interface StudentExperience {
  id: string;
  studentBatch: string; // e.g. "B.Tech CSE '25"
  userType: 'Current Student' | 'Verified Alumni';
  overallRating: number; // 1 to 5
  sentiment: 'Positive' | 'Neutral' | 'Critical';
  honestPros: string[];
  honestCons: string[];
  groundRealityComment: string;
  helpfulCount: number;
  approvedByAdmin: boolean;
  dateAdded: string;
}

export interface College {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  region: 'North' | 'South' | 'West' | 'East' | 'Central';
  address: string;
  collegeType: CollegeType;
  establishedYear: number;
  nirfRankOverall?: number;
  nirfRankEngg?: number;
  nirfRankMgmt?: number;
  naacGrade?: string;
  websiteUrl: string;
  logoUrl?: string;
  heroImageUrl: string;
  tagline: string;
  verificationStatus: VerificationStatus;
  lastVerifiedDate: string;
  verifiedBy: string;
  officialSources: OfficialSource[];
  courses: CollegeCourse[];
  hostel: HostelDetails;
  campusLife: CampusLifeDetails;
  studentExperiences: StudentExperience[];
  dataDiscrepanciesReportedCount: number;
}

export interface ExamScore {
  examName: string;
  status: 'Taken' | 'Planning to take' | 'Not taking / None';
  scoreOrPercentile?: string;
  rank?: number;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email?: string;
  class10Percentage?: number;
  class12Percentage: number;
  class12Stream: StreamType;
  targetDegree: 'B.Tech' | 'BBA' | 'BCA' | 'MBA' | 'Any';
  targetSpecialization?: string;
  careerGoal: string;
  entranceExams: ExamScore[];
  preferredCities: string[]; // e.g. ["Delhi NCR", "Bengaluru", "Pune"]
  relocationPreference: 'Anywhere in India' | 'Within 500km' | 'Home State / City Only';
  totalBudgetLimit: number; // In INR for complete course (Tuition + standard Hostel)
  hostelPreference: 'Hostel mandatory' | 'Day Scholar preferred' | 'Flexible';
  placementPriority: 'Crucial (High ROI & >10 LPA)' | 'Important' | 'Balanced / Research focus';
  campusLifePriority: 'Vibrant clubs & events' | 'Moderate' | 'Strict academics preferred';
  collegeTypePreference: 'All' | 'Govt only' | 'Private Tier-1' | 'Autonomous only';
  personalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchFactorBreakdown {
  budgetFitScore: number; // 0 - 25
  budgetFitNote: string;
  placementFitScore: number; // 0 - 25
  placementFitNote: string;
  academicFitScore: number; // 0 - 20
  academicFitNote: string;
  campusLifeFitScore: number; // 0 - 15
  campusLifeFitNote: string;
  locationFitScore: number; // 0 - 15
  locationFitNote: string;
}

export interface CollegeRecommendation {
  college: College;
  matchedCourse: CollegeCourse;
  fitScore: number; // 0 - 100%
  fitCategory: 'Dream / High Reach' | 'Target / High Match' | 'Safe / Strong Match';
  hardConstraintsPassed: boolean;
  hardConstraintFailures: string[];
  breakdown: MatchFactorBreakdown;
  whyItMatches: string[];
  tradeOffs: string[];
  missingOrUnverifiedFields: string[];
  disclaimer: string;
}

export interface DataErrorReport {
  id: string;
  collegeId: string;
  collegeName: string;
  fieldFlagged: string;
  reportedValue: string;
  expectedValue: string;
  sourceProofUrl: string;
  userNotes: string;
  reportedAt: string;
  status: 'Pending Review' | 'Verified & Updated' | 'Rejected';
  adminNotes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'system';
  text: string;
  timestamp: string;
  extractedProfileUpdates?: Partial<StudentProfile>;
  suggestedQuickReplies?: string[];
}
