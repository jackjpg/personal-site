const rows = [
  {
    goal: 'Specificity',
    metric: 'References concrete, observable signals from the screenshot (brands, prices, timestamps, names)',
  },
  {
    goal: 'Liveness',
    metric: 'Captures the moment as it unfolds',
  },
  {
    goal: 'Resonance',
    metric: 'Identifies the dominant contradiction or energy mismatch in the moment',
  },
  {
    goal: 'Cultural Fluency',
    metric: 'Uses casual, internet-native language',
  },
  {
    goal: 'State',
    metric: 'Single label matching current context or intent',
  },
  {
    goal: 'Compression',
    metric: 'Delivers maximum signal in a single, screenshotable line',
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
