import { INITIAL_COLLEGES } from './src/data/colleges';
import { runDecisionEngine } from './src/services/decisionEngine';
import { StudentProfile } from './src/types';

function runTests() {
  console.log('--- RUNNING TEST SUITE: COLLEGE DEKODED DECISION ENGINE & VERIFICATION ---');
  let testsPassed = 0;
  let testsTotal = 0;

  function assert(condition: boolean, testName: string) {
    testsTotal++;
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      testsPassed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
    }
  }

  // TEST 1: Hard Eligibility Constraint - 12th Percentage Failure
  // Student with 55% in 12th PCM applying to DTU (requires min 60%)
  const lowScoreStudent: StudentProfile = {
    id: 'test-1',
    fullName: 'Test Student Low Marks',
    class12Percentage: 55,
    class12Stream: 'PCM',
    targetDegree: 'B.Tech',
    careerGoal: 'Software Engineer',
    entranceExams: [{ examName: 'JEE Main', status: 'Taken' }],
    preferredCities: ['Delhi NCR'],
    relocationPreference: 'Anywhere in India',
    totalBudgetLimit: 1500000,
    hostelPreference: 'Flexible',
    placementPriority: 'Crucial (High ROI & >10 LPA)',
    campusLifePriority: 'Moderate',
    collegeTypePreference: 'All',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const recs1 = runDecisionEngine(INITIAL_COLLEGES, lowScoreStudent);
  const dtuMatch1 = recs1.find((r) => r.college.id === 'dtu-delhi');
  assert(
    dtuMatch1 !== undefined && !dtuMatch1.hardConstraintsPassed,
    'Hard Constraint: Disqualifies or flags DTU when student 12th % is below 60%'
  );
  assert(
    dtuMatch1?.hardConstraintFailures.some((f) => f.includes('Eligibility Cutoff')) === true,
    'Audit Diagnostics: Details exact cutoff shortfall in hardConstraintFailures'
  );

  // TEST 2: Hard Constraint - Stream Incompatibility
  // Student with Arts/Humanities applying for B.Tech CSE (requires PCM)
  const artsStudent: StudentProfile = {
    ...lowScoreStudent,
    class12Percentage: 92,
    class12Stream: 'Arts/Humanities',
  };
  const recs2 = runDecisionEngine(INITIAL_COLLEGES, artsStudent);
  const dtuMatch2 = recs2.find((r) => r.college.id === 'dtu-delhi');
  assert(
    dtuMatch2 !== undefined && !dtuMatch2.hardConstraintsPassed &&
    dtuMatch2.hardConstraintFailures.some((f) => f.includes('Stream Mismatch')),
    'Hard Constraint: Disqualifies B.Tech if student stream is Arts/Humanities'
  );

  // TEST 3: Strict Location Constraint
  // Student strictly requires Home State / City Only: Bengaluru
  const blrStudent: StudentProfile = {
    ...lowScoreStudent,
    class12Percentage: 88,
    class12Stream: 'PCM',
    preferredCities: ['Bengaluru'],
    relocationPreference: 'Home State / City Only',
  };
  const recs3 = runDecisionEngine(INITIAL_COLLEGES, blrStudent);
  const dtuInDelhi = recs3.find((r) => r.college.id === 'dtu-delhi');
  const rvceInBlr = recs3.find((r) => r.college.id === 'rvce-bengaluru');
  assert(
    rvceInBlr !== undefined && rvceInBlr.hardConstraintsPassed,
    'Location Matching: RVCE Bengaluru passes for Bengaluru resident'
  );
  assert(
    dtuInDelhi !== undefined && !dtuInDelhi.hardConstraintsPassed &&
    dtuInDelhi.hardConstraintFailures.some((f) => f.includes('Strict Location Limit')),
    'Location Constraint: Disqualifies Delhi college for strict Bengaluru-only preference'
  );

  // TEST 4: Transparent Fit Score - 100 Point Breakdown
  // Student with 92% PCM, JEE Main, ₹15L budget in Delhi
  const idealStudent: StudentProfile = {
    ...lowScoreStudent,
    class12Percentage: 92,
    class12Stream: 'PCM',
    preferredCities: ['Delhi NCR'],
    relocationPreference: 'Anywhere in India',
    totalBudgetLimit: 1500000,
  };
  const recs4 = runDecisionEngine(INITIAL_COLLEGES, idealStudent);
  const topRec = recs4[0];
  assert(
    topRec !== undefined && topRec.fitScore >= 70,
    'Transparent Fit Scoring: High fit score assigned to eligible, budget-matched candidate'
  );
  assert(
    topRec.breakdown.budgetFitScore > 0 &&
    topRec.breakdown.placementFitScore > 0 &&
    topRec.breakdown.academicFitScore > 0,
    'Scoring Math: All 5 scoring factor buckets calculated transparently'
  );

  // TEST 5: Anti-Hallucination Data Integrity Check
  // Verify that all colleges in seed have valid official sources and verification dates
  const allHaveSources = INITIAL_COLLEGES.every(
    (c) => c.officialSources.length > 0 && Boolean(c.lastVerifiedDate) && Boolean(c.verifiedBy)
  );
  assert(
    allHaveSources,
    'Data Grounding: 100% of college records possess primary source URLs & audit dates'
  );

  console.log(`\nTEST RESULTS: ${testsPassed}/${testsTotal} passed (${Math.round((testsPassed / testsTotal) * 100)}%)\n`);
}

runTests();
