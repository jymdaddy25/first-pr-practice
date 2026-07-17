// 진짜 사진 찾기 퀴즈
// 각 라운드: 실제 전시 사진 1장 + 편집(좌우반전/확대·색보정/회전·彩度조정)된 3장 중
// 진짜를 5초 안에 고르는 게임. 점수 = 정답 개수 x 100 + 라운드별 시간 보너스.
// 시간 보너스 = max(0, (10 - 답변까지 걸린 초) x 10), 정답을 맞혔을 때만 적용.
// 순위판은 Firebase Realtime Database로 공유되어, 각자 다른 기기에서 동시에
// 참여해도 모두의 화면에 실시간으로 반영됩니다.

const TIME_LIMIT = 5; // seconds per round
const NEXT_DELAY = 1700; // ms pause after each answer before advancing

const ROUNDS = [
  {
    title: "라운드 1",
    meta: "원 그리기 퍼포먼스 4컷",
    original: "assets/round1-original.jpg",
    decoys: ["assets/round1-decoy1.jpg", "assets/round1-decoy2.jpg", "assets/round1-decoy3.jpg"],
  },
  {
    title: "라운드 2",
    meta: "얼굴·드로잉 3연작",
    original: "assets/round2-original.jpg",
    decoys: ["assets/round2-decoy1.jpg", "assets/round2-decoy2.jpg", "assets/round2-decoy3.jpg"],
  },
  {
    title: "라운드 3",
    meta: "Traum · Leben 설치",
    original: "assets/round3-original.jpg",
    decoys: ["assets/round3-decoy1.jpg", "assets/round3-decoy2.jpg", "assets/round3-decoy3.jpg"],
  },
  {
    title: "라운드 4",
    meta: "자본=창의력 걸개",
    original: "assets/round4-original.jpg",
    decoys: ["assets/round4-decoy1.jpg", "assets/round4-decoy2.jpg", "assets/round4-decoy3.jpg"],
  },
  {
    title: "라운드 5",
    meta: "벽시계 네 대",
    original: "assets/round5-original.jpg",
    decoys: ["assets/round5-decoy1.jpg", "assets/round5-decoy2.jpg", "assets/round5-decoy3.jpg"],
  },
];

const state = {
  playerName: "",
  index: 0,
  score: 0,
  correctCount: 0,
  order: [],
  roundOptions: null,
  answered: false,
  startTime: 0,
  timeoutHandle: null,
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

// 순위판은 Firebase Realtime Database와 REST API(fetch)로 공유됩니다. 처음엔
// Firebase JS SDK(onValue 실시간 구독)를 썼는데, 규칙과 데이터가 모두 정상인데도
// 특정 기기에서 실제 저장된 값 중 일부만 보이는 현상이 있었습니다 - SDK가 내부적으로
// 들고 있는 연결/캐시 상태가 꼬였을 가능성이 높아 보여, 매번 새 HTTP 요청으로
// 끝나는 REST API 방식으로 바꿨습니다. 요청 하나하나가 독립적이라 이전 상태가
// 남아 화면이 안 바뀌는 문제 자체가 생기기 어렵습니다.
const RESET_PASSWORD = "2528";

let dbBaseUrl = null;
let liveStream = null;

function entriesFromRestData(data) {
  if (!data) return [];
  const entries = Object.values(data);
  entries.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return entries;
}

async function initLeaderboard() {
  try {
    const { firebaseConfig } = await import("./firebase-config-v3.js");
    dbBaseUrl = firebaseConfig.databaseURL.replace(/\/$/, "");
    await refreshLeaderboard();
    startLiveStream();
  } catch (err) {
    console.error("순위판 기능을 초기화하지 못했습니다 (퀴즈는 계속 플레이할 수 있습니다)", err);
    showLeaderboardError(err);
  }
}

// 서버가 보낸 이벤트(다른 사람의 제출 등)가 오면 그때마다 다시 새로 받아옵니다.
// 이 스트림 연결 자체가 막힌 환경이어도 새로고침 버튼/자동 갱신 지점들이
// 여전히 동작하므로 실패해도 조용히 무시합니다.
function startLiveStream() {
  try {
    if (liveStream) liveStream.close();
    liveStream = new EventSource(`${dbBaseUrl}/photoQuizScores.json`);
    liveStream.addEventListener("put", () => refreshLeaderboard());
    liveStream.addEventListener("patch", () => refreshLeaderboard());
    liveStream.onerror = () => {
      /* 무시: 수동/자동 새로고침 경로가 대체 수단으로 남아있음 */
    };
  } catch (err) {
    console.error("실시간 스트림을 시작하지 못했습니다", err);
  }
}

async function pushScoreRest(entry) {
  const res = await fetch(`${dbBaseUrl}/photoQuizScores.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function removeAllScores() {
  const res = await fetch(`${dbBaseUrl}/photoQuizScores.json`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

async function refreshLeaderboard() {
  if (!dbBaseUrl) {
    showLeaderboardError({ message: "초기화되지 않음" });
    return;
  }
  try {
    const res = await fetch(`${dbBaseUrl}/photoQuizScores.json?ts=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderAllLeaderboards(entriesFromRestData(data));
  } catch (err) {
    console.error("순위판을 불러오지 못했습니다", err);
    showLeaderboardError(err);
  }
}

function showLeaderboardError(err) {
  const reason = err && (err.code || err.message) ? ` (${err.code || err.message})` : "";
  for (const id of ["leaderboard-list", "leaderboard-list-result"]) {
    const listEl = document.getElementById(id);
    listEl.innerHTML = "";
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = `순위판을 불러올 수 없습니다${reason}. 인터넷 연결을 확인해주세요.`;
    listEl.appendChild(li);
  }
}

function submitScore(entry) {
  const statusEl = document.getElementById("submit-status");
  statusEl.hidden = true;
  if (!dbBaseUrl) {
    statusEl.textContent = "순위판에 연결되지 않아 이번 점수는 공유되지 않았습니다.";
    statusEl.hidden = false;
    return;
  }
  pushScoreRest(entry)
    .then(() => refreshLeaderboard())
    .catch((err) => {
      console.error("점수를 순위판에 기록하지 못했습니다", err);
      statusEl.textContent = `점수를 순위판에 기록하지 못했습니다 (${err.message}).`;
      statusEl.hidden = false;
    });
}

function resetLeaderboard() {
  if (!dbBaseUrl) {
    alert("순위판을 아직 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    return;
  }
  const input = prompt("순위판을 초기화하려면 비밀번호를 입력하세요.");
  if (input === null) return;
  if (input !== RESET_PASSWORD) {
    alert("비밀번호가 틀렸습니다.");
    return;
  }
  removeAllScores()
    .then(() => refreshLeaderboard())
    .catch((err) => {
      console.error("순위판을 초기화하지 못했습니다", err);
      alert("순위판을 초기화하지 못했습니다.");
    });
}

function renderLeaderboardList(listEl, entries) {
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
    score.textContent = `${entry.score}점`;
    li.append(name, score);
    listEl.appendChild(li);
  }
}

function renderAllLeaderboards(entries) {
  renderLeaderboardList(document.getElementById("leaderboard-list"), entries);
  renderLeaderboardList(document.getElementById("leaderboard-list-result"), entries);
  document.querySelectorAll(".live-label").forEach((el) => {
    el.textContent = `실시간 · ${entries.length}명 수신`;
  });
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
  state.correctCount = 0;
  state.order = ROUNDS.map((_, i) => i);
  showScreen("quiz");
  renderRound();
}

function renderRound() {
  const round = ROUNDS[state.order[state.index]];
  state.roundOptions = shuffle([
    { src: round.original, isOriginal: true },
    { src: round.decoys[0], isOriginal: false },
    { src: round.decoys[1], isOriginal: false },
    { src: round.decoys[2], isOriginal: false },
  ]);
  state.answered = false;

  document.getElementById("quiz-player").textContent = `참가자 ${state.playerName}`;
  document.getElementById("quiz-progress").textContent = `${state.index + 1} / ${ROUNDS.length}`;
  document.getElementById("quiz-score").textContent = `점수 ${state.score}`;
  document.getElementById("question-text").textContent = `${round.title} · 진짜 사진은 어느 것일까요?`;
  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "feedback";

  const grid = document.getElementById("photo-grid");
  grid.innerHTML = "";
  const labels = ["A", "B", "C", "D"];
  state.roundOptions.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "photo-tile";
    btn.innerHTML = `<span class="tag">${labels[i]}</span><img src="${opt.src}" alt="선택지 ${labels[i]}" />`;
    btn.addEventListener("click", () => selectAnswer(i));
    grid.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  const fill = document.getElementById("timer-fill");
  fill.classList.remove("running", "low");
  fill.style.transition = "none";
  fill.style.width = "100%";
  // force reflow so the next width change animates
  void fill.offsetWidth;

  state.startTime = performance.now();
  requestAnimationFrame(() => {
    fill.classList.add("running");
    fill.style.transition = `width ${TIME_LIMIT}s linear`;
    fill.style.width = "0%";
  });

  setTimeout(() => fill.classList.add("low"), (TIME_LIMIT - 1.5) * 1000);

  state.timeoutHandle = setTimeout(() => {
    if (!state.answered) selectAnswer(-1);
  }, TIME_LIMIT * 1000);
}

function selectAnswer(choiceIndex) {
  if (state.answered) return;
  state.answered = true;
  clearTimeout(state.timeoutHandle);

  const elapsed = Math.min(TIME_LIMIT, Math.max(0, (performance.now() - state.startTime) / 1000));
  const correctIndex = state.roundOptions.findIndex((o) => o.isOriginal);
  const isCorrect = choiceIndex === correctIndex;

  const tiles = document.querySelectorAll("#photo-grid .photo-tile");
  tiles.forEach((tile, i) => {
    tile.disabled = true;
    if (i === correctIndex) tile.classList.add("correct");
    else if (i === choiceIndex) tile.classList.add("wrong");
    else tile.classList.add("dim");
  });

  const feedbackEl = document.getElementById("feedback");
  let roundScore = 0;

  if (isCorrect) {
    const bonus = Math.max(0, Math.round((10 - elapsed) * 10));
    roundScore = 100 + bonus;
    state.correctCount += 1;
    feedbackEl.className = "feedback correct";
    feedbackEl.innerHTML = `정답입니다!<span class="points">기본 100점 + 시간 보너스 ${bonus}점 = +${roundScore}점</span>`;
  } else {
    roundScore = 0;
    feedbackEl.className = "feedback wrong";
    feedbackEl.innerHTML =
      choiceIndex === -1
        ? `시간 초과! 진짜 사진은 초록 테두리입니다<span class="points">+0점</span>`
        : `아쉬워요, 편집된 사진이었어요<span class="points">+0점</span>`;
  }

  state.score += roundScore;
  document.getElementById("quiz-score").textContent = `점수 ${state.score}`;

  setTimeout(goNext, NEXT_DELAY);
}

function goNext() {
  state.index += 1;
  if (state.index >= ROUNDS.length) finishQuiz();
  else renderRound();
}

function finishQuiz() {
  submitScore({
    name: state.playerName,
    score: state.score,
    correct: state.correctCount,
    at: Date.now(),
  });

  document.getElementById("result-headline").textContent = `${state.playerName}님, 수고하셨어요!`;
  document.getElementById("result-score").textContent = `${state.score}점`;
  document.getElementById("result-detail").textContent =
    state.correctCount === ROUNDS.length
      ? `${ROUNDS.length}문제를 모두 맞혔어요! 진짜 사진 감별사네요.`
      : `${ROUNDS.length}문제 중 ${state.correctCount}문제 정답. 다음 참가자에게 자리를 넘겨주세요.`;

  showScreen("result");
}

document.getElementById("btn-start").addEventListener("click", startQuiz);
document.getElementById("player-name").addEventListener("keydown", (e) => {
  if (e.key === "Enter") startQuiz();
});
document.getElementById("btn-again").addEventListener("click", () => {
  document.getElementById("player-name").value = "";
  showScreen("start");
  document.getElementById("player-name").focus();
  refreshLeaderboard();
});
document.getElementById("btn-reset-leaderboard").addEventListener("click", resetLeaderboard);
document.querySelectorAll(".btn-refresh-leaderboard").forEach((btn) => {
  btn.addEventListener("click", refreshLeaderboard);
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") refreshLeaderboard();
});

initLeaderboard();
