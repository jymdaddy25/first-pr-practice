// 개념미술 감상 퀴즈 데이터 및 로직
// 참고: artwork.visual 은 실제 작품 이미지가 아닌, 감상 힌트를 주는
// 간단한 그래픽 재구성입니다 (저작권 있는 원본 이미지를 사용하지 않습니다).

const ARTWORKS = [
  {
    title: "샘 (Fountain)",
    meta: "마르셀 뒤샹 · 1917",
    gradient: "linear-gradient(160deg, #3a3a42, #17171b)",
    symbol: "🚰",
    question: "이 작품을 통해 뒤샹이 던진 질문은 무엇이었을까요?",
    options: [
      "기성품(레디메이드)도 예술이 될 수 있는가",
      "조각은 대리석으로만 만들어야 하는가",
      "그림은 액자가 있어야 완성되는가",
      "미술관 입장료는 얼마가 적당한가",
    ],
    answer: 0,
    explanation:
      "뒤샹은 평범한 남성용 소변기에 'R. Mutt'라고 서명해 전시함으로써, 예술을 결정하는 것이 손의 기술이 아니라 '작가의 선택과 개념'일 수 있음을 보여주었습니다. 이는 개념미술의 출발점으로 평가받습니다.",
  },
  {
    title: "하나이면서 셋인 의자 (One and Three Chairs)",
    meta: "조셉 코수스 · 1965",
    gradient: "linear-gradient(160deg, #34404a, #14181c)",
    symbol: "🪑",
    question: "이 작품이 나란히 제시한 세 가지는 무엇이었을까요?",
    options: [
      "의자의 색, 무게, 가격표",
      "실제 의자, 의자 사진, '의자'의 사전적 정의",
      "과거·현재·미래의 의자",
      "나무, 플라스틱, 금속 의자 세 종류",
    ],
    answer: 1,
    explanation:
      "코수스는 실물 의자, 그 의자를 찍은 사진, 사전에서 발췌한 '의자'라는 단어의 정의를 함께 전시했습니다. 이를 통해 사물·이미지·언어가 각기 다른 방식으로 '실재'를 재현한다는 점을 탐구했습니다.",
  },
  {
    title: "월 드로잉 연작 (Wall Drawings)",
    meta: "솔 르윗 · 1968년부터",
    gradient: "linear-gradient(160deg, #443a4a, #1b161f)",
    symbol: "📐",
    question: "솔 르윗이 남긴 개념미술 선언의 핵심 문장은 무엇일까요?",
    options: [
      "\"색채가 형태보다 중요하다\"",
      "\"아이디어 자체가 예술을 만드는 기계가 된다\"",
      "\"자연을 있는 그대로 모방해야 한다\"",
      "\"완성작만이 예술로 인정받는다\"",
    ],
    answer: 1,
    explanation:
      "르윗은 1967년 글 'Paragraphs on Conceptual Art'에서 \"개념미술에서는 아이디어나 콘셉트가 작품의 가장 중요한 측면이다\"라고 선언했습니다. 그의 월 드로잉은 작가 본인이 아닌 다른 사람이 지시서(instruction)에 따라 그려도 원작으로 인정됩니다.",
  },
  {
    title: "컷 피스 (Cut Piece)",
    meta: "오노 요코 · 1964",
    gradient: "linear-gradient(160deg, #4a3434, #1f1414)",
    symbol: "✂️",
    question: "이 퍼포먼스에서 관객에게 주어진 역할은 무엇이었나요?",
    options: [
      "무대 위 작가에게 질문을 던진다",
      "가위로 작가가 입은 옷을 직접 잘라간다",
      "함께 노래를 부른다",
      "작가 대신 즉흥 연설을 한다",
    ],
    answer: 1,
    explanation:
      "오노 요코는 무대 위에 정좌한 채, 관객이 가위를 들고 나와 자신의 옷을 원하는 만큼 잘라가도록 했습니다. 작품의 완성은 작가 혼자가 아니라 관객의 참여로 매번 다르게 이루어졌습니다.",
  },
  {
    title: "오늘 연작 (Today Series)",
    meta: "온 가와라 · 1966년부터",
    gradient: "linear-gradient(160deg, #2c2c34, #101012)",
    symbol: "📅",
    question: "이 연작의 독특한 제작 규칙은 무엇이었을까요?",
    options: [
      "매일 다른 색으로 캔버스를 칠한다",
      "그날 자정까지 완성하지 못하면 그 그림은 폐기한다",
      "관객이 직접 날짜를 손으로 적는다",
      "1년에 한 작품만 제작한다",
    ],
    answer: 1,
    explanation:
      "온 가와라는 캔버스에 그날의 날짜만을 정해진 서체로 그렸고, 자정까지 완성하지 못하면 그 작품을 폐기하는 엄격한 규칙을 따랐습니다. 시간과 존재를 기록하는 행위 자체가 작품의 핵심 개념이었습니다.",
  },
  {
    title: "무제 (로스의 초상)",
    meta: "펠릭스 곤잘레스-토레스 · 1991",
    gradient: "linear-gradient(160deg, #4a4034, #1f1a14)",
    symbol: "🍬",
    question: "이 작품에서 관객에게 허용된 특별한 행동은 무엇이었나요?",
    options: [
      "사탕 더미에서 사탕을 가져가도 된다",
      "사탕 더미를 만지면 안 된다",
      "사진 촬영이 전면 금지된다",
      "사탕을 새로 채워 넣어야 한다",
    ],
    answer: 0,
    explanation:
      "이상적인 총 무게(연인 로스의 건강한 체중, 약 79kg)만큼 쌓인 사탕 더미를 관객이 가져갈 수 있도록 했습니다. 더미는 점점 줄어들다 다시 채워지는데, 이는 에이즈로 세상을 떠난 연인의 생명이 소진되고도 기억으로 다시 채워지는 과정을 은유합니다.",
  },
  {
    title: "허공으로의 도약 (Leap into the Void)",
    meta: "이브 클랭 · 1960",
    gradient: "linear-gradient(160deg, #2a3a4a, #10161f)",
    symbol: "🕴️",
    question: "이 유명한 이미지는 실제로 어떻게 만들어졌을까요?",
    options: [
      "실제로 건물에서 뛰어내리는 순간을 그대로 촬영했다",
      "여러 장의 사진을 합성한 포토몽타주였다",
      "유화 물감으로 그린 그림이다",
      "석고로 만든 조각이다",
    ],
    answer: 1,
    explanation:
      "클랭이 그물망 위로 뛰어내리는 사진과, 그물망을 지운 거리 사진을 합성해 만든 포토몽타주입니다. '보이는 것이 곧 사실은 아니다'라는 점에서 이 작품 자체가 개념적 트릭이자 예술가의 신화 만들기로 해석됩니다.",
  },
  {
    title: "이미지의 배반 (이것은 파이프가 아니다)",
    meta: "르네 마그리트 · 1929",
    gradient: "linear-gradient(160deg, #3a3428, #16130e)",
    symbol: "🚬",
    question: "파이프 그림 아래 적힌 문구 \"Ceci n'est pas une pipe\"의 의미는?",
    options: [
      "그림 속 파이프는 진짜 파이프가 아니라 '이미지'일 뿐이다",
      "작가가 담배를 싫어한다는 뜻이다",
      "그림이 잘못 그려졌다는 사과문이다",
      "파이프 제조사의 광고 문구다",
    ],
    answer: 0,
    explanation:
      "아무리 사실적으로 그려도 캔버스 위의 파이프는 실제로 담배를 채워 피울 수 없는 '이미지'일 뿐입니다. 마그리트는 이 문구로 사물과 그 재현(이미지·언어) 사이의 간극을 짚으며, 이후 개념미술 작가들에게 큰 영향을 주었습니다.",
  },
];

const LEADERBOARD_KEY = "concept-art-quiz-leaderboard";

const state = {
  playerName: "",
  index: 0,
  score: 0,
  order: [],
};

const screens = {
  start: document.getElementById("screen-start"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result"),
};

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.remove("active"));
  screens[name].classList.add("active");
}

function loadLeaderboard() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLeaderboard(entries) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

function renderLeaderboard(listEl) {
  const entries = loadLeaderboard()
    .slice()
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 10);

  listEl.innerHTML = "";

  if (entries.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "아직 참가자가 없습니다. 첫 번째 참가자가 되어보세요!";
    listEl.appendChild(li);
    return;
  }

  for (const entry of entries) {
    const li = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = entry.name;
    const score = document.createElement("span");
    score.textContent = `${entry.score} / ${ARTWORKS.length}`;
    li.append(name, score);
    listEl.appendChild(li);
  }
}

function renderAllLeaderboards() {
  renderLeaderboard(document.getElementById("leaderboard-list"));
  renderLeaderboard(document.getElementById("leaderboard-list-result"));
}

function shuffledIndices() {
  const idx = ARTWORKS.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

function startQuiz() {
  const input = document.getElementById("player-name");
  const name = input.value.trim();
  const errorEl = document.getElementById("start-error");

  if (!name) {
    errorEl.hidden = false;
    input.focus();
    return;
  }
  errorEl.hidden = true;

  state.playerName = name;
  state.index = 0;
  state.score = 0;
  state.order = shuffledIndices();

  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  const artwork = ARTWORKS[state.order[state.index]];

  document.getElementById("quiz-player").textContent = `참가자: ${state.playerName}`;
  document.getElementById("quiz-progress").textContent =
    `${state.index + 1} / ${ARTWORKS.length}`;
  document.getElementById("quiz-score").textContent = `점수: ${state.score}`;

  const visual = document.getElementById("artwork-visual");
  visual.style.background = artwork.gradient;
  visual.innerHTML = `<span style="font-size:3.4rem;filter:drop-shadow(0 2px 6px rgba(0,0,0,.4))">${artwork.symbol}</span>`;

  document.getElementById("artwork-title").textContent = artwork.title;
  document.getElementById("artwork-meta").textContent = artwork.meta;
  document.getElementById("question-text").textContent = artwork.question;

  const optionsEl = document.getElementById("options");
  optionsEl.innerHTML = "";
  artwork.options.forEach((optionText, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = optionText;
    btn.addEventListener("click", () => selectAnswer(i));
    optionsEl.appendChild(btn);
  });

  document.getElementById("explanation").hidden = true;
  document.getElementById("btn-next").hidden = true;
}

function selectAnswer(choiceIndex) {
  const artwork = ARTWORKS[state.order[state.index]];
  const optionButtons = document.querySelectorAll("#options .option");

  optionButtons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === artwork.answer) btn.classList.add("correct");
    else if (i === choiceIndex) btn.classList.add("wrong");
  });

  if (choiceIndex === artwork.answer) {
    state.score += 1;
    document.getElementById("quiz-score").textContent = `점수: ${state.score}`;
  }

  const explanationEl = document.getElementById("explanation");
  explanationEl.textContent = artwork.explanation;
  explanationEl.hidden = false;

  const nextBtn = document.getElementById("btn-next");
  nextBtn.hidden = false;
  nextBtn.textContent =
    state.index === ARTWORKS.length - 1 ? "결과 보기" : "다음 작품";
}

function goNext() {
  state.index += 1;
  if (state.index >= ARTWORKS.length) {
    finishQuiz();
  } else {
    renderQuestion();
  }
}

function finishQuiz() {
  const entries = loadLeaderboard();
  entries.push({ name: state.playerName, score: state.score, at: Date.now() });
  saveLeaderboard(entries);

  document.getElementById("result-headline").textContent =
    `${state.playerName}님, ${ARTWORKS.length}문제 중 ${state.score}문제 정답!`;
  document.getElementById("result-detail").textContent =
    state.score === ARTWORKS.length
      ? "완벽해요! 개념미술 감상 고수네요."
      : "수고하셨어요! 다음 참가자에게 자리를 넘겨주세요.";

  renderAllLeaderboards();
  showScreen("result");
}

function resetLeaderboard() {
  if (!confirm("참가자 순위판을 초기화할까요?")) return;
  saveLeaderboard([]);
  renderAllLeaderboards();
}

document.getElementById("btn-start").addEventListener("click", startQuiz);
document.getElementById("player-name").addEventListener("keydown", (e) => {
  if (e.key === "Enter") startQuiz();
});
document.getElementById("btn-next").addEventListener("click", goNext);
document.getElementById("btn-again").addEventListener("click", () => {
  document.getElementById("player-name").value = "";
  showScreen("start");
  renderAllLeaderboards();
  document.getElementById("player-name").focus();
});
document
  .getElementById("btn-reset-leaderboard")
  .addEventListener("click", resetLeaderboard);

renderAllLeaderboards();
