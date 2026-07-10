// Lead intent scoring engine.
//
// Produces a deterministic 0-100 score from signals that ACTUALLY exist in the
// system (pipeline stage, how much the lead has been worked, real call logs,
// recency of the last touch, and profile completeness). Every point is traceable
// via the returned `factors` array, so the UI can explain exactly why a lead has
// the score it does.

const STATUS_POINTS = {
  new: 10,
  contacted: 25,
  hot: 40,
  enrolled: 40,
  lost: 0,
};

const daysSince = (date) =>
  Math.floor((Date.now() - new Date(date).getTime()) / 86400000);

const computeLeadScore = (lead, activities = [], callCount = 0) => {
  const factors = [];
  let score = 0;

  // 1. Pipeline stage (0-40) — how far along the funnel the lead is.
  const statusPts = STATUS_POINTS[lead.status] ?? 10;
  score += statusPts;
  factors.push({ label: `Pipeline stage "${lead.status}"`, points: statusPts });

  // 2. Progression (0-20) — number of status updates = how much the lead is worked.
  const progressions = activities.filter((a) => a.type === "status_change").length;
  const progPts = Math.min(progressions * 7, 20);
  if (progPts > 0) {
    score += progPts;
    factors.push({ label: `${progressions} status update(s)`, points: progPts });
  }

  // 3. Call attempts (0-15) — real CallLog rows linked to this lead.
  const callPts = Math.min(callCount * 8, 15);
  if (callPts > 0) {
    score += callPts;
    factors.push({ label: `${callCount} call attempt(s)`, points: callPts });
  }

  // 4. Recency (-10 to +20) — recent activity signals live intent, stale = cold.
  const lastTouch =
    activities.reduce(
      (latest, a) =>
        !latest || new Date(a.created_at) > new Date(latest) ? a.created_at : latest,
      null
    ) || lead.created_at;
  const days = daysSince(lastTouch);
  const recencyPts = days <= 2 ? 20 : days <= 7 ? 10 : days <= 14 ? 0 : -10;
  score += recencyPts;
  factors.push({ label: `Last touch ${days}d ago`, points: recencyPts });

  // 5. Profile completeness (0-15) — a fully-filled lead is more qualified.
  let profilePts = 0;
  if (lead.email) profilePts += 6;
  if (lead.course) profilePts += 5;
  if (lead.city) profilePts += 4;
  if (profilePts > 0) {
    score += profilePts;
    factors.push({ label: "Profile completeness", points: profilePts });
  }

  // Clamp to 0-100, and never let a lost lead read as warm/hot.
  score = Math.max(0, Math.min(100, Math.round(score)));
  if (lead.status === "lost") {
    score = Math.min(score, 15);
  }

  return { score, factors };
};

module.exports = { computeLeadScore };
