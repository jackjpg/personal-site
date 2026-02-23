const rows = [
  {
    goal: 'Accuracy',
    metric: 'No fabricated or inferred detail beyond what\'s visible — references specific things',
    autofail: true,
  },
  {
    goal: 'Relevancy',
    metric: 'No retrospective or summary framing',
  },
  {
    goal: 'Resonance',
    metric: 'Surfaces the primary emotional tension in the screenshot',
  },
  {
    goal: 'Language',
    metric: 'Uses casual, internet-native language',
    autofail: true,
  },
  {
    goal: 'State',
    metric: 'Classifies as first-person capture or third-party content; single label matching current context or intent',
  },
  {
    goal: 'Brevity',
    metric: 'One screenshotable line; fails if it needs more than one clause',
  },
];

export default function ScoringRubricV3() {
  return (
    <div className="pov-rubric-wrapper">
      <div className="pov-rubric">
        <div className="pov-rubric-header">
          <span className="pov-rubric-col-head">Goal</span>
          <span className="pov-rubric-col-head">Success metric</span>
        </div>
        {rows.map((row) => (
          <div key={row.goal} className="pov-rubric-row">
            <span className="pov-rubric-goal">{row.goal}</span>
            <span className={`pov-rubric-metric${row.autofail ? ' pov-rubric-metric--fail' : ''}`}>
              {row.metric}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
