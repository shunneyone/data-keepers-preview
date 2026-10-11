(function (root) {
  const story = {
    steps: ['initial', 'authority', 'data', 'governance'],
    scenes: {
      initial: { title: 'The offer on the table', text: 'Warranga is a fictional regional Aboriginal community. A government department offers $500,000 over two years for youth programs. In return, it wants attendance, justice, household and health information. Funding could support activities and staff, but linking these records could expose private lives. You are helping prepare a proposal for community discussion. What is your starting position?', choices: [
        ['accept', 'Accept the offer in principle', 'Begin planning funded programs while working through safeguards.'],
        ['reject', 'Reject the current offer', 'Keep the requested records out of this arrangement and explore other support.'],
        ['negotiate', 'Negotiate the terms', 'Seek a narrower agreement, knowing funding may be delayed or withdrawn.'],
        ['consult', 'Consult first', 'Seek community direction before committing; consultation takes time.'] ] },
      authority: { title: 'Who can authorise this?', text: 'A program committee can organise activities, but that does not automatically give it authority over information about the whole community. People also have a say about information identifying them. A collective decision and individual consent answer different questions. How will your proposal handle both?', choices: [
        ['mandate', 'Seek a community mandate and separate individual consent', 'Use an agreed community process, explain uses clearly, and allow people to decline identifiable sharing without losing youth-program access.'],
        ['committee', 'Let the committee decide, then notify families', 'Move quickly with committee approval and a notice explaining what will happen. Notification does not ask for individual agreement.'] ] },
      data: { title: 'What information is necessary?', text: 'The department wants to show that programs reach young people. Named attendance linked to justice, household and health records may reveal far more than that purpose requires. It also asks whether university researchers can reuse the records. Which terms do you propose?', choices: [
        ['minimum', 'Offer grouped attendance figures for program reporting only', 'Exclude justice, household and health records. Check small groups for identification risk. Any research would need a separate community decision and appropriate individual consent.'],
        ['linked', 'Offer linked records for reporting and research', 'Allow the requested categories and future research under the same agreement. This could support wider analysis but broadens exposure and permitted uses.'] ] },
      governance: { title: 'Who holds the keys?', text: 'An agreement needs more than a promise. Someone must check access, respond to misuse, and decide when information is deleted. The department prefers to keep information for future planning. Your proposal must also explain what happens if funding or approval does not proceed.', choices: [
        ['oversight', 'Set community oversight and a two-year deletion review', 'Limit access to named reporting staff, log use, allow suspension after misuse, and review deletion at the end of the funded term. Seek an agreed deletion date and consider other youth support if talks fail.'],
        ['department', 'Use department controls and keep information for future planning', 'Reduce local administration and rely on department access rules. Accept no fixed deletion date, with longer retention and less community oversight.'] ] }
    },
    initialConsequences: {
      accept: 'Accepting in principle gets program planning moving. It creates expectations of funding before safeguards are settled; acceptance here is not permission to transfer records.',
      reject: 'The current offer remains rejected. Youth programs still need support, and these later choices shape a possible alternative proposal rather than authorising the rejected exchange.',
      negotiate: 'Negotiation leaves room to narrow access. The department may refuse the revised terms, so neither funding nor a data transfer is guaranteed.',
      consult: 'Consultation leaves the offer undecided. Community members can reshape or refuse the proposal; listening first is not automatic approval.'
    },
    consequences: {
      mandate: 'A community mandate gives collective direction, while separate consent protects each person’s choice. Both need understandable information and a way to revisit decisions. This takes time and resources.',
      committee: 'Committee approval is quicker, but its mandate may not cover community data. A notice alone does not establish individual consent. Unresolved authority and consent could undermine trust even if activities start sooner.',
      minimum: 'Grouped attendance limits exposure and stays close to the youth-program purpose. Small groups can still identify people, so reporting needs care. The department may want more detail; research permission remains a separate question.',
      linked: 'Linked records could reveal patterns, but also make people easier to identify and increase the impact of misuse. Broad research reuse goes beyond youth-program reporting; collective authority and individual consent still need to address that extra purpose.',
      oversight: 'Access logs and a power to suspend use give community oversight practical force. A two-year review is not automatic deletion: a written deletion date, responsibilities and any exceptions still need agreement.',
      department: 'Department administration reduces local workload, but the community has fewer ways to challenge use. Without a deletion date, information could outlast the programs and be used in future planning that people did not expect.'
    }
  };
  if (typeof module !== 'undefined') module.exports = story;
  else root.DataKeepersStory = story;
})(typeof globalThis !== 'undefined' ? globalThis : this);
