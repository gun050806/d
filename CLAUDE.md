# 더 로직 고등영어 홈페이지 — 작업 메모

동탄 고등부 영어학원 "더 로직 고등영어"의 홈페이지. 사용자는 주로 휴대폰으로 작업하며 한국어로 답해야 함.

## 기본 정보
- 사이트: https://gun050806.github.io/d/ (GitHub Pages, 브랜치 `claude/annyeong-herdq3`, 루트 폴더)
- 푸시하면 1~2분 뒤 자동 배포. 별도 빌드 없음 (순수 HTML/CSS/JS)
- 학원 정보 출처: 네이버 블로그 m.blog.naver.com/audtjr3956, 네이버 플레이스
  - 주소: 경기도 화성시 동탄구 동탄순환대로 127-23 우성에듀파크 5층 502호 (호수공원 건너편)
  - 상담 010-5273-8792 / 대표 0507-1398-8794 / 운영 14:00~22:00 (휴무일 미확인)
  - 대상: 고1~3, 이솔고·서연고·정현고 / 슬로건: "수능 영어의 본질을 알려드리겠습니다."
  - 2026년 1학기: 이솔고1·정현고2 영어 전교 1등 (중간·기말 포함)
- 확인되지 않은 정보(대표자명, 학원등록번호, 사업자등록번호, 휴무일)는 지어내지 말 것. 푸터에 주석으로 자리만 있음
- 이 작업 환경에서는 네이버 접속이 막혀 있음 → 사용자에게 캡처를 받아서 반영

## 디자인 원칙 (사용자 요청)
- "AI 티 나지 않게": 슬로건 남발·영문 섹션 라벨·이모지·그라데이션·장식 카드 금지. 흑백 + 빨간 강조(`--point`)
- 글꼴: 본문 Pretendard(fonts/ 직접 포함), 영문 로고 "The Logic"은 Libre Baskerville 이탤릭
- 휴대폰 하단 전화/문자 고정 바 있음

## 파일
- `index.html` / `style.css` / `script.js`: 메인 페이지
- `login.html`, `my.html`, `admin.html`, `js/fb.js`: 원생 로그인·자료실·성적, 원장 관리 페이지 (Firebase)
- `firebase-config.js`: Firebase 프로젝트 thelogic-e407d 설정값 (공개 값)
- `firestore.rules`: 보안 규칙. 바꾸면 사용자가 Firebase 콘솔 → Firestore → 규칙에 다시 붙여 넣고 게시해야 함

## Firebase 구조 (무료 Spark 플랜, Storage 미사용 — 자료는 구글 드라이브 링크)
- `users/{uid}`: name, school, grade, email, role(`pending`|`student`|`admin`), createdAt
- `materials`: title, target(전체/고1/고2/고3), url, desc, date
- `records`: uid, kind, title, score, memo, date (학생 본인 + 관리자만 읽기)
- `posts`: tag, title, url, date (공개 읽기, 홈페이지 "학원 소식"에 표시)
- 관리자 지정은 콘솔에서 users 문서의 role을 `admin`으로 직접 수정

## 진행 상황 (2026-11-12)
- 완료: 홈페이지 배포, Firebase 로그인(이메일/비밀번호)·Firestore(서울)·보안 규칙·승인 도메인
- 원장님 계정 admin 지정 및 관리 페이지 접속 확인 완료 (2026-11-12)

## 테스트
- Firebase 에뮬레이터(firebase-tools, Java 필요)로 가입·승인·권한 흐름 검증. 페이지를 `?emu`로 열면 localhost에서 에뮬레이터에 연결됨 (`js/fb.js`)
- 이 환경에서는 gstatic.com이 막혀 있어 Playwright에서 SDK 요청을 npm `firebase@10.14.1` 파일로 가로채서 테스트
