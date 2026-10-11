import { createSession, start, choose, view, restart } from './engine.js';
import { intro } from './story.js';
let session = createSession();
const scene = document.getElementById('scene');
const progress = document.getElementById('progress');
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function button(label, action, detail) {
  const control = element('button', '', detail ? 'choice' : 'primary');
  control.type = 'button';
  control.append(element('span', label, 'button-label'));
  if (detail) control.append(element('span', detail, 'button-detail'));
  control.addEventListener('click', () => { session = action(); render(true); });
  return control;
}
function render(moveFocus = false) {
  const current = view(session);
  scene.replaceChildren();
  const title = element('h1', current.phase === 'intro' ? intro.title : current.phase === 'decision' ? current.round.title : current.title);
  title.id = 'scene-title';
  title.tabIndex = -1;
  progress.textContent = current.phase === 'intro' ? 'Introduction' : current.phase === 'debrief' ? 'Reflection · 4 decisions made' : `Decision ${current.number} of 4`;
  document.getElementById('track-fill').style.width = `${session.history.length * 25}%`;
  scene.append(element('p', current.phase === 'intro' ? 'Your community. Your questions.' : current.phase === 'decision' ? current.round.topic : 'Your learning debrief', 'eyebrow'), title);
  if (current.phase === 'intro') {
    intro.paragraphs.forEach(text => scene.append(element('p', text, 'intro-copy')));
    scene.append(element('aside', 'The question to carry with you: who has authority to say yes, and who can still say no?', 'callout'));
    scene.append(button('Begin the story', () => start(session)));
  } else if (current.phase === 'decision') {
    const consequence = element('aside', '', 'callout');
    consequence.append(element('h2', session.history.length ? 'Where your decisions have led' : 'Before you decide'), element('p', current.context));
    scene.append(consequence, element('p', current.round.prompt, 'prompt'));
    const choices = element('div', '', 'choices');
    current.round.choices.forEach(choice => choices.append(button(choice.label, () => choose(session, choice.id), choice.detail)));
    scene.append(choices);
  } else {
    scene.append(element('p', current.summary, 'intro-copy'));
    current.sections.forEach(section => {
      const block = element('section', '', 'reflection');
      block.append(element('h2', section.title), element('p', section.text));
      scene.append(block);
    });
    scene.append(element('aside', 'Discuss: which conditions would you need to resolve before recommending any agreement? A playthrough does not give permission to use community data.', 'callout'));
    scene.append(button('Restart the story', () => restart()));
  }
  if (moveFocus) { title.focus(); window.scrollTo(0, 0); }
}
render();
