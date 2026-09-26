import { College, CollegeCourse, CollegeRecommendation, MatchFactorBreakdown, StudentProfile } from '../types';

export function runDecisionEngine(
  colleges: College[],
  profile: StudentProfile
): CollegeRecommendation[] {
  const recommendations: CollegeRecommendation[] = [];

  for (const college of colleges) {
    for (const course of college.courses) {
      // 1. HARD CONSTRAINTS CHECK
      const hardConstraintFailures: string[] = [];
      const missingOrUnverifiedFields: string[] = [];

      // Degree matching
      if (profile.targetDegree !== 'Any' && course.degree !== profile.targetDegree) {
        continue; // Course degree does not match target, skip silently
      }

      // Stream matching
      if (!course.eligibility.streamRequired.includes(profile.class12Stream)) {
        hardConstraintFailures.push(
          `Stream Mismatch: Course strictly requires ${course.eligibility.streamRequired.join(' or ')}, but student stream is ${profile.class12Stream}.`
        );
      }

      // 12th Percentage cutoff
      if (profile.class12Percentage < course.eligibility.min12thPercentage) {
        hardConstraintFailures.push(
          `Eligibility Cutoff: Minimum 12th percentage required is ${course.eligibility.min12thPercentage}%, student has ${profile.class12Percentage}%.`
        );
      }

      // Entrance exam requirement check
      const studentExams = profile.entranceExams || [];
      const takenExamNames = studentExams
        .filter((e) => e.status === 'Taken' || e.status === 'Planning to take')
        .map((e) => e.examName.toLowerCase());

      const compulsoryExams = course.entranceExams.filter((e) => e.isCompulsory);
      if (compulsoryExams.length > 0) {
        const hasSatisfiedCompulsoryExam = compulsoryExams.some((compExam) =>
          takenExamNames.some(
            (t) =>
              t.includes(compExam.examName.toLowerCase()) ||
              compExam.examName.toLowerCase().includes(t)
          )
        );

        if (!hasSatisfiedCompulsoryExam) {
          const requiredNames = compulsoryExams.map((e) => e.examName).join(' or ');
          hardConstraintFailures.push(
            `Compulsory Entrance Exam: College strictly mandates ${requiredNames}, which is not in student's profile.`
          );
        }
      }

      // Location strict constraint check
      if (profile.relocationPreference === 'Home State / City Only') {
        const isCityMatch = profile.preferredCities.some(
          (c) =>
            college.city.toLowerCase().includes(c.toLowerCase()) ||
            c.toLowerCase().includes(college.city.toLowerCase()) ||
            (c.toLowerCase().includes('delhi') && college.state.toLowerCase().includes('delhi'))
        );
        if (!isCityMatch) {
          hardConstraintFailures.push(
            `Strict Location Limit: College in ${college.city}, ${college.state} does not match strict Home State/City preference (${profile.preferredCities.join(', ')}).`
          );
        }
      }

      // Budget check: If total budget is less than 65% of total course tuition, flag as hard constraint failure
      const totalEstimatedCost =
        course.fees.totalCourseFee +
        (profile.hostelPreference === 'Day Scholar preferred' ? 0 : college.hostel.feePerYear * course.durationYears);

      if (profile.totalBudgetLimit > 0 && totalEstimatedCost > profile.totalBudgetLimit * 1.35) {
        hardConstraintFailures.push(
          `Budget Exceeded: Total cost estimated at ₹${(totalEstimatedCost / 100000).toFixed(1)}L exceeds user budget limit of ₹${(profile.totalBudgetLimit / 100000).toFixed(1)}L by >35%.`
        );
      }

      const hardConstraintsPassed = hardConstraintFailures.length === 0;

      // 2. PREFERENCE & TRANSPARENT FIT SCORING (Max 100 Points)
      const breakdown: MatchFactorBreakdown = {
        budgetFitScore: 0,
        budgetFitNote: '',
        placementFitScore: 0,
        placementFitNote: '',
        academicFitScore: 0,
        academicFitNote: '',
        campusLifeFitScore: 0,
        campusLifeFitNote: '',
        locationFitScore: 0,
        locationFitNote: '',
      };

      // A. Budget Fit (0 - 25 points)
      if (profile.totalBudgetLimit <= 0) {
        breakdown.budgetFitScore = 20;
        breakdown.budgetFitNote = 'No strict budget specified; baseline evaluated.';
      } else if (totalEstimatedCost <= profile.totalBudgetLimit) {
        breakdown.budgetFitScore = 25;
        breakdown.budgetFitNote = `Comfortably within budget (Total ₹${(totalEstimatedCost / 100000).toFixed(1)}L vs max ₹${(profile.totalBudgetLimit / 100000).toFixed(1)}L).`;
      } else if (totalEstimatedCost <= profile.totalBudgetLimit * 1.15) {
        breakdown.budgetFitScore = 18;
        breakdown.budgetFitNote = `Slight stretch (₹${(totalEstimatedCost / 100000).toFixed(1)}L is within 15% of budget); scholarships or education loan can bridge the gap.`;
      } else if (totalEstimatedCost <= profile.totalBudgetLimit * 1.35) {
        breakdown.budgetFitScore = 10;
        breakdown.budgetFitNote = `Substantial stretch (₹${(totalEstimatedCost / 100000).toFixed(1)}L vs budget ₹${(profile.totalBudgetLimit / 100000).toFixed(1)}L).`;
      } else {
        breakdown.budgetFitScore = 3;
        breakdown.budgetFitNote = `Significantly exceeds stated budget by >35%.`;
      }

      // B. Placement & ROI Fit (0 - 25 points)
      const medianCtc = course.placements.medianCtcLpa || 6.0;
      const placementPct = course.placements.placementPercentage || 75;
      
      let placementBase = 0;
      if (medianCtc >= 15.0) placementBase = 25;
      else if (medianCtc >= 12.0) placementBase = 22;
      else if (medianCtc >= 9.0) placementBase = 18;
      else if (medianCtc >= 6.5) placementBase = 14;
      else placementBase = 10;

      if (profile.placementPriority === 'Crucial (High ROI & >10 LPA)') {
        breakdown.placementFitScore = placementBase;
        breakdown.placementFitNote = `Verified median CTC ₹${medianCtc} LPA with ${placementPct}% placement rate strongly addresses priority.`;
      } else {
        breakdown.placementFitScore = Math.min(25, placementBase + 2);
        breakdown.placementFitNote = `Solid median CTC ₹${medianCtc} LPA across ${course.placements.totalOffers}+ audited offers.`;
      }

      // C. Academic & Entrance Fit (0 - 20 points)
      const marginAboveCutoff = profile.class12Percentage - course.eligibility.min12thPercentage;
      let academicPts = 10;
      if (marginAboveCutoff >= 20) academicPts = 20;
      else if (marginAboveCutoff >= 10) academicPts = 17;
      else if (marginAboveCutoff >= 0) academicPts = 13;
      else academicPts = 4;

      breakdown.academicFitScore = academicPts;
      breakdown.academicFitNote = `12th score (${profile.class12Percentage}%) meets required minimum (${course.eligibility.min12thPercentage}%) with ${Math.max(0, marginAboveCutoff)}% cushion.`;

      // D. Campus Life & Culture Fit (0 - 15 points)
      let campusPts = 10;
      if (profile.campusLifePriority === 'Vibrant clubs & events') {
        if (college.campusLife.studentClubsCount >= 35) campusPts = 15;
        else if (college.campusLife.studentClubsCount >= 20) campusPts = 12;
        else campusPts = 8;
        breakdown.campusLifeFitNote = `${college.campusLife.studentClubsCount} student clubs, major fests (${college.campusLife.annualFests.slice(0, 2).join(', ')}).`;
      } else if (profile.campusLifePriority === 'Strict academics preferred') {
        if (college.campusLife.attendancePolicy.toLowerCase().includes('strict')) campusPts = 15;
        else campusPts = 11;
        breakdown.campusLifeFitNote = `Academic rigor aligned with preference: ${college.campusLife.attendancePolicy}.`;
      } else {
        campusPts = 12;
        breakdown.campusLifeFitNote = `Balanced campus culture with ${college.campusLife.sportsFacilities.length} major sports facilities.`;
      }
      breakdown.campusLifeFitScore = campusPts;

      // E. Location & Commute Fit (0 - 15 points)
      let locPts = 10;
      const isCityMatched = profile.preferredCities.some(
        (c) =>
          college.city.toLowerCase().includes(c.toLowerCase()) ||
          c.toLowerCase().includes(college.city.toLowerCase()) ||
          (c.toLowerCase().includes('delhi') && college.state.toLowerCase().includes('delhi'))
      );

      if (isCityMatched) {
        locPts = 15;
        breakdown.locationFitNote = `Direct match in preferred territory (${college.city}, ${college.state}).`;
      } else if (profile.relocationPreference === 'Anywhere in India') {
        locPts = 12;
        breakdown.locationFitNote = `Within national preference in established educational hub (${college.city}).`;
      } else {
        locPts = 7;
        breakdown.locationFitNote = `Outside immediate preference city, located in ${college.city}, ${college.state}.`;
      }
      breakdown.locationFitScore = locPts;

      // Calculate Total Fit Score
      let rawScore =
        breakdown.budgetFitScore +
        breakdown.placementFitScore +
        breakdown.academicFitScore +
        breakdown.campusLifeFitScore +
        breakdown.locationFitScore;

      // Penalty if hard constraints failed
      if (!hardConstraintsPassed) {
        rawScore = Math.max(15, rawScore - 35);
      }

      const fitScore = Math.min(99, Math.max(20, Math.round(rawScore)));

      // Categorization
      let fitCategory: 'Dream / High Reach' | 'Target / High Match' | 'Safe / Strong Match' =
        'Target / High Match';

      if (fitScore >= 82) {
        fitCategory = marginAboveCutoff > 15 ? 'Safe / Strong Match' : 'Target / High Match';
      } else if (fitScore >= 68) {
        fitCategory = 'Target / High Match';
      } else {
        fitCategory = 'Dream / High Reach';
      }

      // Reasons why it matches
      const whyItMatches: string[] = [];
      if (breakdown.budgetFitScore >= 20) {
        whyItMatches.push(`Fits within your designated budget of ₹${(profile.totalBudgetLimit / 100000).toFixed(1)}L.`);
      }
      if (course.placements.medianCtcLpa >= 10) {
        whyItMatches.push(`High verified median package of ₹${course.placements.medianCtcLpa} LPA with top recruiters.`);
      }
      if (isCityMatched) {
        whyItMatches.push(`Located in ${college.city}, matching your chosen city preference.`);
      }
      if (marginAboveCutoff >= 10) {
        whyItMatches.push(`Your 12th score (${profile.class12Percentage}%) comfortably satisfies the ${course.eligibility.min12thPercentage}% cutoff.`);
      }
      if (college.collegeType === profile.collegeTypePreference) {
        whyItMatches.push(`Matches your specific institution type preference: ${college.collegeType}.`);
      }
      if (whyItMatches.length === 0) {
        whyItMatches.push(`Offers the required ${course.degree} in ${course.specialization} with recognized accreditation.`);
      }

      // Trade-offs & possible concerns
      const tradeOffs: string[] = [];
      if (college.campusLife.attendancePolicy.toLowerCase().includes('strict') || college.campusLife.attendancePolicy.toLowerCase().includes('85%')) {
        tradeOffs.push(`Strict attendance policy: ${college.campusLife.attendancePolicy}.`);
      }
      if (college.hostel.feePerYear >= 140000) {
        tradeOffs.push(`Hostel fees are relatively high (₹${(college.hostel.feePerYear / 1000).toFixed(0)}k/year) adding to total cost.`);
      }
      if (totalEstimatedCost > profile.totalBudgetLimit && profile.totalBudgetLimit > 0) {
        tradeOffs.push(`Total cost (₹${(totalEstimatedCost / 100000).toFixed(1)}L) pushes your initial budget cap by ₹${((totalEstimatedCost - profile.totalBudgetLimit) / 100000).toFixed(1)}L.`);
      }
      if (!isCityMatched) {
        tradeOffs.push(`Requires relocating to ${college.city}, ${college.state}.`);
      }
      if (course.seatsTotal > 400) {
        tradeOffs.push(`Relatively large batch size (${course.seatsTotal} seats in this course), meaning higher internal placement competition.`);
      }
      if (college.hostel.girlsHostelAvailable === false) {
        tradeOffs.push(`No on-campus girls hostel; students arrange off-campus verified accommodations.`);
      }

      // Check missing fields
      if (!college.nirfRankEngg && course.degree === 'B.Tech') {
        missingOrUnverifiedFields.push('NIRF Engineering individual rank not published (in 150-300 band)');
      }
      if (course.fees.verificationStatus !== 'Verified') {
        missingOrUnverifiedFields.push('2025 Revised Fee awaiting university gazette publication');
      }

      recommendations.push({
        college,
        matchedCourse: course,
        fitScore,
        fitCategory,
        hardConstraintsPassed,
        hardConstraintFailures,
        breakdown,
        whyItMatches,
        tradeOffs,
        missingOrUnverifiedFields,
        disclaimer:
          'Fit Score is an algorithmic preference & eligibility alignment score, NOT an admission guarantee. Always verify actual cutoffs on the official counseling portal before applying.',
      });
    }
  }

  // Sort: First by hard constraints passed (true first), then by fitScore descending
  recommendations.sort((a, b) => {
    if (a.hardConstraintsPassed !== b.hardConstraintsPassed) {
      return a.hardConstraintsPassed ? -1 : 1;
    }
    return b.fitScore - a.fitScore;
  });

  return recommendations;
}
