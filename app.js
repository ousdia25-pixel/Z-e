const STORAGE_KEY = 'lingua-learning-v1';

const initialState = {
  xp: 0,
  completed: [],
  grammarDone: [],
  roleplayDone: [],
  writings: {},
  videoUrl: '',
  videoAnswers: {},
  gameBest: 0,
  dailyDate: '',
  dailyActivities: []
};

function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { ...initialState, ...saved };
  } catch (error) {
    console.error('Impossible de lire la progression enregistrée.', error);
    return { ...initialState };
  }
}

const state = readState();
const pages = {
  home: "Aujourd'hui",
  grammar: 'Grammaire',
  writing: 'Écriture',
  roleplay: 'Jeux de rôle',
  videos: 'Vidéos',
  games: 'Mini-jeux'
};

const lessons = [
  {
    id: 'present',
    title: 'Les temps du présent',
    level: 'A2 · 5 min',
    intro: 'En anglais, le present simple parle surtout des habitudes et des faits. Le present continuous décrit une action en cours ou une situation temporaire.',
    examples: ['I usually <em>walk</em> to work. (habitude)', 'I <em>am walking</em> home right now. (en ce moment)'],
    question: 'Complète : “She ___ a book right now.”',
    options: ['reads', 'is reading', 'read', 'reading'],
    answer: 1,
    explanation: '“Right now” indique une action en cours : is reading.'
  },
  {
    id: 'past',
    title: 'Le prétérit',
    level: 'A2 · 5 min',
    intro: 'Le past simple (prétérit) sert à parler d’une action terminée dans le passé. Les verbes réguliers prennent généralement -ed ; les verbes irréguliers ont leur propre forme.',
    examples: ['We <em>visited</em> London last year. (régulier)', 'He <em>went</em> home at six. (irrégulier)'],
    question: 'Complète : “They ___ a film yesterday.”',
    options: ['watch', 'are watching', 'watched', 'watches'],
    answer: 2,
    explanation: '“Yesterday” situe l’action dans le passé : watched.'
  },
  {
    id: 'future',
    title: 'Parler du futur',
    level: 'B1 · 6 min',
    intro: 'Utilise “will” pour une décision spontanée ou une prédiction. Utilise souvent “going to” pour une intention ou un projet déjà décidé.',
    examples: ['I think it <em>will rain</em> tomorrow. (prédiction)', 'We are <em>going to visit</em> Dad this weekend. (projet)'],
    question: 'Tu as déjà acheté les billets. “We ___ to Rome next week.”',
    options: ['will fly', 'are going to fly', 'flew', 'fly'],
    answer: 1,
    explanation: 'Les billets sont déjà achetés : c’est un projet prévu, donc are going to fly.'
  },
  {
    id: 'connectors',
    title: 'Mots de liaison',
    level: 'B1 · 6 min',
    intro: 'Les connecteurs rendent tes idées plus claires. “Although” introduit une opposition, “because” une raison et “therefore” une conséquence.',
    examples: ['<em>Although</em> it was late, we kept talking. (opposition)', 'I was tired; <em>therefore</em>, I went home. (conséquence)'],
    question: 'Complète : “___ it was raining, we went for a walk.”',
    options: ['Because', 'Although', 'Therefore', 'So'],
    answer: 1,
    explanation: '“Although” exprime le contraste entre la pluie et la promenade.'
  },
  {
    id: 'conditionals',
    title: 'Les conditionnels',
    level: 'B1–B2 · 7 min',
    intro: 'Le first conditional parle d’une possibilité réelle : “if” + présent, puis “will” + verbe. Le second imagine une situation hypothétique : “if” + prétérit, puis “would”.',
    examples: ['If I <em>have</em> time, I <em>will call</em> you. (possible)', 'If I <em>had</em> more time, I <em>would travel</em>. (imaginaire)'],
    question: 'Complète : “If she studied more, she ___ the exam.”',
    options: ['passes', 'will pass', 'would pass', 'passed'],
    answer: 2,
    explanation: 'C’est une situation hypothétique (second conditional) : would pass.'
  }
];

const prompts = [
  { id: 'routine', title: 'My ideal day', level: 'B1 · Quotidien', description: 'Describe your ideal day. What would you do in the morning, afternoon and evening? Explain why it would make you happy.' },
  { id: 'opinion', title: 'A city worth visiting', level: 'B1 · Voyage', description: 'Recommend a city you know. What can visitors see and do there? Explain what makes it special.' },
  { id: 'future', title: 'Technology and the future', level: 'B2 · Société', description: 'How will technology change the way we work in the next ten years? Give your opinion and at least two reasons.' }
];

const scenarios = [
  { id: 'cafe', icon: '☕', title: 'Au café', person: 'Alex, le barista', context: 'Coffee shop · Conversation', opening: 'Hi there! Welcome in. What can I get for you today?', replies: ['Of course! Would you like that hot or iced?', 'Great choice. Would you like anything to eat with your coffee?', 'That comes to £5.50. How would you like to pay?'], finish: 'Thanks! Enjoy your coffee, and have a lovely day!' },
  { id: 'travel', icon: '🚉', title: 'À la gare', person: 'Sam, au guichet', context: 'Train station · Travel', opening: 'Hello! Where would you like to travel to today?', replies: ['Sure. Would you like a single or a return ticket?', 'The next train leaves at 10:30 from platform 4. Does that work for you?', 'That will be £24. Would you like a window seat?'], finish: 'Here is your ticket. Have a pleasant journey!' },
  { id: 'introduce', icon: '👋', title: 'Faire connaissance', person: 'Jordan, un nouveau collègue', context: 'At work · Small talk', opening: 'Hi! I’m Jordan, I just joined the team. What do you do here?', replies: ['That sounds interesting! How long have you been doing that?', 'Nice! What do you like most about working here?', 'That’s great to know. What do you enjoy doing outside work?'], finish: 'It was really nice talking with you. See you around!' }
];

const gameQuestions = [
  { prompt: 'Although', answer: 'Bien que / même si', options: ['Parce que', 'Bien que / même si', 'Par conséquent', 'En plus'] },
  { prompt: 'To figure out', answer: 'Comprendre / trouver', options: ['Oublier', 'S’éloigner', 'Comprendre / trouver', 'Se dépêcher'] },
  { prompt: 'I am looking forward to it', answer: 'J’ai hâte', options: ['Je le cherche', 'J’ai hâte', 'Je m’en souviens', 'Je m’en occupe'] },
  { prompt: 'However', answer: 'Cependant', options: ['Par conséquent', 'Par exemple', 'Cependant', 'En attendant'] },
  { prompt: 'Reliable', answer: 'Fiable', options: ['Disponible', 'Fiable', 'Confortable', 'Curieux'] }
];

let currentLesson = lessons[0].id;
let currentPrompt = prompts[0].id;
let currentScenario = scenarios[0].id;
let scenarioStep = 0;
let gameIndex = 0;
let gameScore = 0;
let gameLocked = false;
let toastTimer;

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Impossible d’enregistrer la progression.', error);
    showToast('La progression n’a pas pu être enregistrée.');
  }
}

function awardXP(amount, activityId) {
  if (!state.completed.includes(activityId)) {
    state.completed.push(activityId);
    state.xp += amount;
    saveState();
    renderStats();
    showToast(`Bravo ! +${amount} XP`);
  }
}

function renderStats() {
  document.querySelector('#xp-count').textContent = state.xp;
  const done = Math.min(todayActivities().length, 3);
  const percent = Math.round(done / 3 * 100);
  document.querySelector('#daily-progress').textContent = `${percent}%`;
  document.querySelector('#daily-label').textContent = `${done} sur 3 activités`;
  document.querySelector('#daily-ring').style.setProperty('--progress', `${percent}%`);
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function todayActivities() {
  return state.dailyDate === todayKey() ? state.dailyActivities : [];
}

function markDailyActivity(activity) {
  if (state.dailyDate !== todayKey()) {
    state.dailyDate = todayKey();
    state.dailyActivities = [];
  }
  if (!state.dailyActivities.includes(activity)) {
    state.dailyActivities.push(activity);
    saveState();
    renderStats();
  }
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2400);
}

function navigate(page) {
  if (!pages[page]) return;
  document.querySelectorAll('.page').forEach(section => section.classList.toggle('active', section.id === `page-${page}`));
  document.querySelectorAll('.nav-link').forEach(button => button.classList.toggle('active', button.dataset.page === page));
  document.querySelector('#page-title').textContent = pages[page];
  if (page === 'grammar') renderLesson();
  if (page === 'writing') renderPrompt();
  if (page === 'videos') renderVideoPractice();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', event => {
  const pageButton = event.target.closest('[data-page]');
  if (pageButton) {
    event.preventDefault();
    navigate(pageButton.dataset.page);
    return;
  }
  const lessonButton = event.target.closest('[data-lesson]');
  if (lessonButton) {
    currentLesson = lessonButton.dataset.lesson;
    renderLesson();
    return;
  }
  const promptButton = event.target.closest('[data-prompt]');
  if (promptButton) {
    currentPrompt = promptButton.dataset.prompt;
    renderPrompt();
    return;
  }
  const scenarioButton = event.target.closest('[data-scenario]');
  if (scenarioButton) {
    currentScenario = scenarioButton.dataset.scenario;
    scenarioStep = 0;
    renderScenario();
    return;
  }
  const quizOption = event.target.closest('[data-quiz-option]');
  if (quizOption) {
    answerGrammar(Number(quizOption.dataset.quizOption));
    return;
  }
  const gameOption = event.target.closest('[data-game-option]');
  if (gameOption) {
    answerGame(Number(gameOption.dataset.gameOption));
    return;
  }
  if (event.target.closest('[data-game-next]')) {
    nextGameQuestion();
  }
  const searchVideo = event.target.closest('[data-video-search]');
  if (searchVideo) {
    event.preventDefault();
    window.open(searchVideo.href, '_blank', 'noopener,noreferrer');
  }
});

function renderLesson() {
  const list = document.querySelector('#lesson-list');
  list.innerHTML = lessons.map((lesson, index) => `
    <button class="lesson-item ${lesson.id === currentLesson ? 'selected' : ''}" data-lesson="${lesson.id}">
      <span class="lesson-number">${state.grammarDone.includes(lesson.id) ? '✓' : String(index + 1).padStart(2, '0')}</span>
      <span><strong>${lesson.title}</strong><small>${lesson.level}</small></span>
    </button>`).join('');
  const lesson = lessons.find(item => item.id === currentLesson);
  document.querySelector('#lesson-content').innerHTML = `
    <p class="eyebrow">LEÇON ${String(lessons.indexOf(lesson) + 1).padStart(2, '0')} · ${lesson.level.toUpperCase()}</p>
    <h2>${lesson.title}</h2><p>${lesson.intro}</p>
    <div class="example-box"><span>EN CONTEXTE</span>${lesson.examples.map(example => `<p>${example}</p>`).join('')}</div>
    <div class="quiz-block"><h3>À toi de jouer</h3><p>${lesson.question}</p>
      <div class="quiz-options">${lesson.options.map((option, index) => `<button class="quiz-option" data-quiz-option="${index}">${option}</button>`).join('')}</div>
      <p class="feedback" id="grammar-feedback" aria-live="polite"></p></div>`;
}

function answerGrammar(index) {
  const lesson = lessons.find(item => item.id === currentLesson);
  const options = [...document.querySelectorAll('[data-quiz-option]')];
  if (options.some(button => button.disabled)) return;
  options.forEach((button, optionIndex) => {
    button.disabled = true;
    if (optionIndex === lesson.answer) button.classList.add('correct');
    else if (optionIndex === index) button.classList.add('incorrect');
  });
  const correct = index === lesson.answer;
  document.querySelector('#grammar-feedback').textContent = correct ? `Exactement ! ${lesson.explanation}` : `Pas tout à fait. ${lesson.explanation}`;
  if (correct) {
    if (!state.grammarDone.includes(lesson.id)) state.grammarDone.push(lesson.id);
    markDailyActivity('grammar');
    awardXP(10, `grammar-${lesson.id}`);
    saveState();
  }
  renderLessonListOnly();
}

function renderLessonListOnly() {
  const list = document.querySelector('#lesson-list');
  list.innerHTML = lessons.map((lesson, index) => `
    <button class="lesson-item ${lesson.id === currentLesson ? 'selected' : ''}" data-lesson="${lesson.id}">
      <span class="lesson-number">${state.grammarDone.includes(lesson.id) ? '✓' : String(index + 1).padStart(2, '0')}</span>
      <span><strong>${lesson.title}</strong><small>${lesson.level}</small></span>
    </button>`).join('');
}

function renderPrompt() {
  document.querySelector('#prompt-list').innerHTML = prompts.map(prompt => `
    <button class="prompt-choice ${prompt.id === currentPrompt ? 'selected' : ''}" data-prompt="${prompt.id}">
      <strong>${prompt.title}</strong><small>${prompt.level}</small>
    </button>`).join('');
  const prompt = prompts.find(item => item.id === currentPrompt);
  document.querySelector('#prompt-title').textContent = prompt.title;
  document.querySelector('#prompt-description').textContent = prompt.description;
  const textarea = document.querySelector('#writing-text');
  textarea.value = state.writings[currentPrompt] || '';
  updateWordCount();
}

function updateWordCount() {
  const words = document.querySelector('#writing-text').value.trim().split(/\s+/).filter(Boolean).length;
  document.querySelector('#word-count').textContent = `${words} mot${words > 1 ? 's' : ''}`;
}

document.querySelector('#writing-text').addEventListener('input', event => {
  state.writings[currentPrompt] = event.target.value;
  saveState();
  updateWordCount();
  if (event.target.value.trim().length > 40) {
    markDailyActivity('writing');
    awardXP(5, `writing-${currentPrompt}`);
  }
});

function renderScenario() {
  document.querySelector('#scenario-list').innerHTML = scenarios.map(scenario => `
    <button class="scenario-choice ${scenario.id === currentScenario ? 'selected' : ''}" data-scenario="${scenario.id}">
      <span class="scenario-emoji">${scenario.icon}</span>
      <span><strong>${scenario.title}</strong><small>${state.roleplayDone.includes(scenario.id) ? '✓ Terminé' : 'Conversation guidée'}</small></span>
    </button>`).join('');
  const scenario = scenarios.find(item => item.id === currentScenario);
  document.querySelector('#chat-avatar').textContent = scenario.icon;
  document.querySelector('#chat-name').textContent = scenario.person;
  document.querySelector('#chat-context').textContent = scenario.context;
  document.querySelector('#chat-messages').innerHTML = `<div class="chat-bubble">${scenario.opening}<small>${scenario.person.split(',')[0]}</small></div>`;
  document.querySelector('#chat-input').disabled = false;
  document.querySelector('#chat-input').placeholder = 'Écris ta réponse en anglais…';
  document.querySelector('#chat-form').querySelector('button').disabled = false;
  document.querySelector('#chat-hint').textContent = 'Écris une réponse pour continuer la conversation.';
  scenarioStep = 0;
}

document.querySelector('#chat-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('#chat-input');
  const message = input.value.trim();
  if (!message) return;
  const scenario = scenarios.find(item => item.id === currentScenario);
  const messages = document.querySelector('#chat-messages');
  messages.insertAdjacentHTML('beforeend', `<div class="chat-bubble you">${escapeHTML(message)}<small>Toi</small></div>`);
  input.value = '';
  if (scenarioStep < scenario.replies.length) {
    messages.insertAdjacentHTML('beforeend', `<div class="chat-bubble">${scenario.replies[scenarioStep]}<small>${scenario.person.split(',')[0]}</small></div>`);
    scenarioStep += 1;
  } else {
    messages.insertAdjacentHTML('beforeend', `<div class="chat-bubble">${scenario.finish}<small>${scenario.person.split(',')[0]}</small></div>`);
    input.disabled = true;
    document.querySelector('#chat-form').querySelector('button').disabled = true;
    document.querySelector('#chat-hint').textContent = 'Scénario terminé. Choisis-en un autre pour continuer à pratiquer.';
    if (!state.roleplayDone.includes(scenario.id)) state.roleplayDone.push(scenario.id);
    markDailyActivity('roleplay');
    awardXP(15, `roleplay-${scenario.id}`);
    renderScenarioListOnly();
  }
  messages.scrollTop = messages.scrollHeight;
});

function renderScenarioListOnly() {
  document.querySelector('#scenario-list').innerHTML = scenarios.map(scenario => `
    <button class="scenario-choice ${scenario.id === currentScenario ? 'selected' : ''}" data-scenario="${scenario.id}">
      <span class="scenario-emoji">${scenario.icon}</span>
      <span><strong>${scenario.title}</strong><small>${state.roleplayDone.includes(scenario.id) ? '✓ Terminé' : 'Conversation guidée'}</small></span>
    </button>`).join('');
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function renderGame() {
  const panel = document.querySelector('#game-panel');
  if (gameIndex >= gameQuestions.length) {
    panel.innerHTML = `<div class="game-result"><div class="result-mark">${gameScore >= 4 ? '🏆' : '✨'}</div><p class="eyebrow">DÉFI TERMINÉ</p><h2>${gameScore} / ${gameQuestions.length} bonnes réponses</h2><p>${gameScore >= 4 ? 'Excellent ! Ton vocabulaire s’étoffe.' : 'Bien joué ! Rejoue pour mémoriser encore plus de mots.'}</p><button class="game-next" data-game-next>Rejouer</button></div>`;
    return;
  }
  const question = gameQuestions[gameIndex];
  panel.innerHTML = `
    <div class="game-top"><span>QUESTION ${gameIndex + 1} / ${gameQuestions.length}</span><div class="game-progress"><span style="width:${(gameIndex / gameQuestions.length) * 100}%"></span></div><span>✦ ${gameScore}</span></div>
    <p class="game-kicker">CHOISIS LA BONNE TRADUCTION</p><h2 class="game-question">${question.prompt}</h2>
    <p class="game-subtitle">Que signifie ce mot ou cette expression ?</p>
    <div class="game-options">${question.options.map((option, index) => `<button class="game-option" data-game-option="${index}">${option}</button>`).join('')}</div>
    <p class="game-feedback" id="game-feedback" aria-live="polite"></p>
    <button class="game-next" data-game-next hidden>${gameIndex === gameQuestions.length - 1 ? 'Voir mon résultat' : 'Suivant →'}</button>`;
  gameLocked = false;
}

function answerGame(index) {
  if (gameLocked) return;
  gameLocked = true;
  const question = gameQuestions[gameIndex];
  const chosen = question.options[index];
  const correct = chosen === question.answer;
  if (correct) gameScore += 1;
  document.querySelectorAll('[data-game-option]').forEach((button, optionIndex) => {
    button.disabled = true;
    if (question.options[optionIndex] === question.answer) button.classList.add('correct');
    else if (optionIndex === index) button.classList.add('incorrect');
  });
  document.querySelector('#game-feedback').textContent = correct ? 'Bravo, c’est la bonne réponse !' : `La bonne réponse était : ${question.answer}`;
  document.querySelector('[data-game-next]').hidden = false;
}

function nextGameQuestion() {
  if (gameIndex >= gameQuestions.length) {
    gameIndex = 0;
    gameScore = 0;
    gameLocked = false;
    renderGame();
    return;
  }
  gameIndex += 1;
  if (gameIndex === gameQuestions.length) {
    if (gameScore > state.gameBest) {
      state.gameBest = gameScore;
      saveState();
    }
    markDailyActivity('game');
    awardXP(gameScore >= 3 ? 15 : 8, `game-${new Date().toISOString().slice(0, 10)}`);
  }
  renderGame();
}

const videoQuestions = [
  { id: 'main', english: 'What is the video mainly about?', french: 'De quoi parle principalement la vidéo ?' },
  { id: 'detail', english: 'What is one detail or new fact you learned?', french: 'Quel détail ou fait nouveau as-tu appris ?' },
  { id: 'words', english: 'Write down one new English word or phrase. What does it mean?', french: 'Note un mot ou une expression en anglais que tu as appris. Que signifie-t-il ?' }
];

function renderVideoPractice() {
  const answers = state.videoAnswers[state.videoUrl] || {};
  const questions = document.querySelector('#video-questions');
  questions.innerHTML = videoQuestions.map((question, index) => `
    <label class="video-question" for="video-answer-${question.id}">
      <span class="question-number">0${index + 1}</span>
      <span class="question-text"><strong>${question.english}</strong><small>${question.french}</small></span>
      <textarea id="video-answer-${question.id}" data-video-answer="${question.id}" rows="${question.id === 'detail' ? 3 : 2}" placeholder="${index === 2 ? 'Example: “wildlife” = les animaux sauvages' : 'Write your answer here…'}">${escapeHTML(answers[question.id] || '')}</textarea>
    </label>`).join('');
  questions.querySelectorAll('[data-video-answer]').forEach(textarea => {
    textarea.addEventListener('input', () => saveVideoAnswer(textarea.dataset.videoAnswer, textarea.value));
  });
  document.querySelector('#video-url').value = state.videoUrl || '';
  document.querySelector('#video-url-error').textContent = '';
  renderVideoFrame();
  updateVideoAnswerCount();
}

function videoIdFromURL(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  if (host === 'youtu.be') {
    const id = url.pathname.split('/').filter(Boolean)[0];
    return /^[\w-]{11}$/.test(id || '') ? id : null;
  }
  if (!['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)) return null;
  const id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([\w-]{11})(?:\/|$)/)?.[1];
  return /^[\w-]{11}$/.test(id || '') ? id : null;
}

function renderVideoFrame() {
  const frame = document.querySelector('#video-frame');
  const id = videoIdFromURL(state.videoUrl);
  if (!id) {
    frame.innerHTML = '<div class="video-placeholder"><span>▷</span><strong>Ta vidéo apparaîtra ici</strong><small>Choisis une vidéo éducative en anglais avec des sous-titres, puis colle son lien ci-dessus.</small></div>';
    return;
  }
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
  iframe.title = 'Vidéo d’apprentissage de l’anglais';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allowFullscreen = true;
  frame.replaceChildren(iframe);
}

document.querySelector('#video-url-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('#video-url');
  const id = videoIdFromURL(input.value.trim());
  if (!id) {
    document.querySelector('#video-url-error').textContent = 'Lien non reconnu. Utilise un lien de vidéo YouTube valide (youtube.com ou youtu.be).';
    return;
  }
  state.videoUrl = `https://www.youtube.com/watch?v=${id}`;
  saveState();
  renderVideoPractice();
});

function saveVideoAnswer(questionId, value) {
  if (!state.videoAnswers[state.videoUrl]) state.videoAnswers[state.videoUrl] = {};
  state.videoAnswers[state.videoUrl][questionId] = value;
  saveState();
  updateVideoAnswerCount();
}

function updateVideoAnswerCount() {
  const answers = state.videoAnswers[state.videoUrl] || {};
  const answered = videoQuestions.filter(question => (answers[question.id] || '').trim().length > 0).length;
  document.querySelector('#video-answer-count').textContent = `${answered} / 3 réponses`;
  const complete = answered === videoQuestions.length;
  document.querySelector('#video-completion-note').textContent = complete
    ? 'Très bien ! Tu as terminé cette activité de compréhension.'
    : 'Réponds aux trois questions pour terminer l’activité et gagner des XP.';
  if (complete && videoIdFromURL(state.videoUrl)) {
    markDailyActivity('video');
    awardXP(10, `video-${videoIdFromURL(state.videoUrl)}`);
  }
}

renderStats();
renderLesson();
renderPrompt();
renderScenario();
renderGame();
renderVideoPractice();
