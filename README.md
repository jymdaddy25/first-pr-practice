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
