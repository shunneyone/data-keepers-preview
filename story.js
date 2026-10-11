export const intro = {
  title: 'Who decides how data is used?',
  paragraphs: [
    'Warranga is a fictional regional Aboriginal community. A government department offers $500,000 over two years for youth programs. In return, it wants access to attendance, justice, household and health information.',
    'You are helping prepare a recommendation for community discussion. You cannot give consent on behalf of everyone. Consider who should decide, what information is needed and how the community could benefit.',
    'Make four decisions, then reflect on the consequences. Allow about five minutes, or take as long as you need. There is no score and no single answer that removes every tradeoff.'
  ]
};

export const rounds = [
  { title: 'Respond to the offer', topic: 'Funding and community authority', prompt: 'Youth programs need support, but the proposed access is broad. What should the community do first?', choices: [
    { id: 'accept', label: 'Accept the offer in principle', detail: 'Keep funding talks moving; work through data conditions next.' },
    { id: 'reject', label: 'Reject this offer', detail: 'Decline these terms and develop conditions for future proposals.' },
    { id: 'negotiate', label: 'Negotiate the terms', detail: 'Seek a narrower agreement before committing.' },
    { id: 'consult', label: 'Consult the community first', detail: 'Make space for discussion before giving the department an answer.' }
  ]},
  { title: 'Who has a say?', topic: 'Community authority and individual consent', prompt: 'A community decision and a person’s permission answer different questions. How should the process work?', choices: [
    { id: 'shared', label: 'Community-led discussion and separate individual consent', detail: 'Agree who has authority, explain proposed uses, and allow people to decline without losing program access.' },
    { id: 'delegated', label: 'Ask a small working group to draft the terms first', detail: 'Move faster with a draft; bring it back for community authorisation and separate individual consent before any identifiable data is shared.' }
  ]},
  { title: 'How much information?', topic: 'Minimisation and purpose limitation', prompt: 'The department wants to measure youth program benefit. What data terms should the recommendation propose?', choices: [
    { id: 'minimal', label: 'Start with grouped attendance totals only', detail: 'Use data only to evaluate the youth program. Exclude justice, household and health records; check small groups for identification risk.' },
    { id: 'linked', label: 'Consider limited linked information for evaluation', detail: 'Explore attendance with selected health and household information, only if necessity, authority and consent can be established. Exclude justice records and other uses.' }
  ]},
  { title: 'Who holds the keys?', topic: 'Research sharing, access and retention', prompt: 'A researcher asks to reuse the information. The department also needs an access and retention plan. What arrangement should be proposed?', choices: [
    { id: 'controlled', label: 'Community-controlled access and a fixed review date', detail: 'Named users, access logs, a review after 12 months and deletion at the end of two years. Any research needs a new community decision and appropriate individual consent.' },
    { id: 'partner', label: 'Joint oversight with a separate research proposal', detail: 'Share oversight with the department. Consider research separately, with community approval and appropriate individual consent; review retention annually and agree a deletion date before access.' }
  ]}
];

const openings = {
  accept: 'Accepting in principle keeps the funding discussion moving, but the department may assume broad access is settled. Your recommendation must make clear that data access is not yet authorised.',
  reject: 'Rejecting these terms avoids the immediate broad-access proposal. The $500,000 is not secured, and youth programs still need support. The next decisions set conditions for a future offer; they do not reverse this rejection.',
  negotiate: 'Negotiation creates room to narrow access and define benefit. It may delay support, and the department could decline revised terms. Nothing is agreed yet.',
  consult: 'Consultation gives people a chance to question the offer and identify who can speak for the community. It takes time and may miss the department’s preferred timetable. Participation alone does not establish agreement.'
};

export function context(history) {
  if (history.length === 0) return 'The offer is a starting point, not permission to release information.';
  const first = history[0];
  let text = openings[first];
  if (history.length >= 2) text += history[1] === 'shared'
    ? ' Community-led discussion can expose different views, but needs time and accessible explanations. An individual can still refuse identifiable sharing even if the community supports a proposal.'
    : ' A working group can make the questions concrete sooner. Its draft is not community authorisation or individual consent; less-heard voices may need additional opportunities to shape it.';
  if (history.length >= 3) text += history[2] === 'minimal'
    ? ' Grouped attendance limits exposure but may tell less about why a program helps. Small totals can still identify people, so grouping needs review before release.'
    : ' Linking selected information may help explore program benefit, but makes people easier to identify and increases misuse risk. If necessity or consent cannot be established, the linked proposal must stop.';
  return text;
}

export function ending(history) {
  const [first, authority, scope, governance] = history;
  return {
    title: first === 'reject' ? 'A boundary now, conditions for the future' : 'A recommendation, not a final agreement',
    summary: first === 'reject'
      ? 'This offer remains declined. You have prepared a governance position for future proposals. Youth funding needs another path, and no data transfer follows from this playthrough.'
      : 'Your recommendation is ready for discussion. Funding and data access remain unsettled until the community, individuals and department work through the conditions. No outcome is guaranteed.',
    sections: [
      { title: 'Community authority', text: openings[first] + (authority === 'shared' ? ' Your discussion process invites community direction; confirm who is authorised to decide and how disagreement is heard.' : ' Your working group has a draft, not a mandate. Community authorisation is still required.') },
      { title: 'Consent', text: 'Community authority does not replace individual consent. Explain uses, risks and withdrawal limits in plain language. People must be able to decline identifiable sharing without losing access to youth programs.' },
      { title: 'Access and purpose', text: scope === 'minimal' ? 'Your proposal uses grouped attendance for youth program evaluation only. Justice, household and health records are excluded. Review small groups for identification risk, restrict access and refuse unrelated reuse.' : 'Your proposal explores limited attendance, health and household links for youth program evaluation only, excluding justice records. Confirm necessity and permission before any access; otherwise stop. Linking increases identification risk even when names are removed.' },
      { title: 'Retention and research', text: governance === 'controlled' ? 'You propose named users, access logs, a review after 12 months and deletion at two years. Agree how deletion, copies and breaches are checked. Research requires a new community decision and appropriate individual consent; the funding offer is not research permission.' : 'Joint oversight may bring expertise but makes accountability more complex. Annual retention review is not permission to keep information indefinitely: agree a deletion date before access. A separate research proposal still needs community approval and appropriate individual consent.' },
      { title: 'Benefit and unresolved questions', text: (first === 'reject' ? 'Declining protects a boundary but leaves a funding gap.' : first === 'accept' ? 'Moving quickly may help funding talks but can create pressure to release data.' : first === 'negotiate' ? 'Narrower terms may improve control but the department may not agree.' : 'Consultation can strengthen the decision but may delay funding.') + ' Who defines success, who receives results, and who can pause access if promises are broken? Agree how benefit returns to the community, rather than assuming collection creates benefit.' }
    ]
  };
}
