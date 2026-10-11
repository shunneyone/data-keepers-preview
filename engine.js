(function (root) {
  const story = typeof module !== 'undefined' ? require('./story.js') : root.DataKeepersStory;
  function createState() { return { history: [] }; }
  function validate(state) {
    if (!state || !Array.isArray(state.history) || state.history.length > 4) throw new Error('Invalid story state');
    state.history.forEach((id, i) => {
      if (!story.scenes[story.steps[i]].choices.some(c => c[0] === id)) throw new Error('Invalid story history');
    });
  }
  function choose(state, id) {
    validate(state);
    const scene = story.scenes[story.steps[state.history.length]];
    if (!scene || !scene.choices.some(c => c[0] === id)) throw new Error('Choice unavailable');
    return { history: [...state.history, id] };
  }
  function view(state) {
    validate(state);
    const [initial, authority, data, governance] = state.history;
    const context = state.history.map((id, i) => i === 0 ? story.initialConsequences[id] : story.consequences[id]);
    if (state.history.length < 4) return { ...story.scenes[story.steps[state.history.length]], context, step: state.history.length + 1 };
    return { title: 'Learning debrief', context, topics: [
      ['Community authority', story.initialConsequences[initial] + ' ' + story.consequences[authority]],
      ['Consent', authority === 'mandate' ? 'Separate individual consent is part of your proposal. People need clear purposes, choices and a way to withdraw where possible. Community approval does not replace their consent.' : 'Your proposal relies on notification. Seek appropriate individual consent before identifiable sharing; committee approval does not resolve this gap.'],
      ['Access and purpose', story.consequences[data] + ' ' + (governance === 'oversight' ? 'Named staff access and logs make the reporting boundary easier to check.' : 'Department controls will determine who can see information, with less local visibility.')],
      ['Retention', story.consequences[governance]],
      ['Benefit', (initial === 'reject' ? 'The $500,000 offer is not taken up; other youth support must be explored.' : initial === 'accept' ? 'Planning can start, but funding and record access still depend on a valid agreement.' : 'Youth funding remains uncertain while the proposal is discussed.') + ' Ask who receives the benefits, who carries the risks, and how the community will check whether programs help. There is no single winning answer.']
    ], choices: [] };
  }
  const engine = { createState, choose, view, restart: createState };
  if (typeof module !== 'undefined') module.exports = engine;
  else root.DataKeepersEngine = engine;
})(typeof globalThis !== 'undefined' ? globalThis : this);
