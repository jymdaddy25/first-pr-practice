# first-pr-practice

첫 GitHub Pull Request를 연습하기 위한 저장소입니다.

## 폴더 구성

- `TrackA_실습데이터/insurance_data/` — 보험 데이터 실습용 CSV/JSON 파일
  - `loss_ratio_timeseries.csv` — 손해율 시계열 데이터
  - `persona_offer_map.csv` — 페르소나별 제안 매핑
  - `persona_summary.csv` — 페르소나 요약
  - `products_catalog.csv` — 상품 카탈로그
  - `target_personas.json` — 타겟 페르소나 정의
- `quiz/` — 개념미술 감상 퀴즈 (정적 웹페이지)
  - 유명 개념미술 작품을 감상한 뒤 관련 문제를 풀어보는 퀴즈입니다.
  - 참가자 이름을 입력하고 순서대로 참여하면, 결과가 브라우저에 저장되는
    순위판에 함께 기록되어 여러 사람이 모여 즐길 수 있습니다.
  - 실행 방법: `quiz/index.html`을 브라우저로 열거나, `quiz/` 폴더에서
    `python3 -m http.server`로 로컬 서버를 띄운 뒤 접속하세요.
- `photo-quiz/` — 진짜 사진 찾기 퀴즈 (정적 웹페이지)
  - 전시에서 찍은 실제 사진 5장과, 각각을 편집(좌우반전/확대·색보정/회전·채도조정)해
    만든 가짜 3장씩 총 4지선다로 진짜 사진을 맞히는 퀴즈입니다.
  - 문제당 5초의 제한 시간이 있고, 점수는 정답 개수 x 100점에 더해 빨리 맞힐수록
    최대 100점까지 붙는 시간 보너스(`(10 - 답변 시간) x 10`, 최소 0점)로 계산됩니다.
  - 순위판은 Firebase Realtime Database(`firebase-config.js`)로 공유되어, 각자 다른
    기기에서 동시에 접속해도 실시간으로 같은 순위판을 볼 수 있습니다. `firebase-config.js`의
    값은 클라이언트에 공개되는 설정값으로, 실제 접근 제어는 Firebase 콘솔의 Realtime
    Database 규칙으로 이루어집니다. Firebase CDN을 불러오지 못해도(오프라인 등) 퀴즈
    자체는 계속 플레이할 수 있고, 순위판만 안내 메시지로 대체됩니다.
  - "순위판 초기화" 버튼을 누르면 비밀번호(앱 안에 하드코딩)를 입력해야 전체 순위판이
    삭제됩니다. 이 비밀번호는 실수로 누르는 것을 막는 UI 수준의 안전장치일 뿐,
    브라우저 개발자 도구로 우회할 수 있는 수준이라 진짜 보안은 아닙니다.
  - 실행 방법: `photo-quiz/` 폴더에서 `python3 -m http.server`로 로컬 서버를
    띄운 뒤 접속하세요 (이미지 로딩을 위해 로컬 서버 실행이 필요합니다).
