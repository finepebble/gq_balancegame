# BalanceFun — 밸런스 게임 (GitHub Pages용)

두 가지 중 하나를 고르는 **밸런스 게임**입니다. 깔끔한 SPA로 구성되어 GitHub Pages에 **그대로 업로드하면 즉시 동작**합니다.  
기본은 **오프라인(로컬 저장소)** 집계이지만, `firebase-config.js`를 추가하면 **전 세계 합산 비율**로 실시간 집계됩니다.

## 기능
- 메인(오늘의 질문) · 질문 인터페이스 · 결과(애니메이션 바 차트) · 질문 제출 · 커뮤니티 피드 (총 5 섹션)
- 모바일 우선 반응형, 다크/라이트 테마
- 키보드 단축키 (A/B, ←/→)
- 로컬 저장소에 투표/질문/댓글/추천 저장
- 선택적으로 Firebase Realtime Database로 **글로벌 집계/제출**

## 파일 구조
```
index.html
styles.css
app.js         # 라우팅/상태 연결
ui.js          # 화면 렌더링
store.js       # 로컬 저장소 관리
net.js         # (선택) Firebase 집계
data.js        # 기본 질문
firebase-config.sample.js  # 샘플 설정 (이름을 firebase-config.js로 바꾸면 온라인 집계 활성화)
assets/
```

## 배포 (GitHub Pages)
1. 이 폴더 전체를 새 GitHub 저장소에 업로드
2. **Settings → Pages → Branch: main / root** 저장 → URL 발급
3. 접속: `https://USERNAME.github.io/REPO/`

## (선택) 온라인 집계 활성화
1. Firebase 콘솔에서 새 프로젝트 생성 → **Realtime Database** 생성(테스트 규칙 허용 또는 규칙 설정)
2. 프로젝트 설정에서 웹 앱 추가 → `apiKey`, `databaseURL` 등 복사
3. `firebase-config.sample.js`를 **firebase-config.js**로 복사 후 값 채움
4. GitHub Pages에 다시 푸시 → 전 세계 투표 합산

Realtime Database 규칙 예시(선택):

```json
{
  "rules": {
    ".read": true,
    "balance": {
      "votes": { ".write": true },
      "submissions": { ".write": true }
    }
  }
}
```

> 프로덕션에선 인증/레이트리밋 규칙을 강화하세요.

## 사용법
- 메인 → **지금 선택하기** → A/B 클릭 → 결과에서 비율 확인
- **제출**에서 새 질문을 만들고, 커뮤니티에서 추천/댓글
- 링크 공유: 결과 화면의 복사 버튼

## 라이선스
MIT. 이미지 URL은 본인 소유/무료 라이선스를 사용하세요.
