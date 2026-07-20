# 한국문화기획학교 웹사이트

정적 HTML/CSS/JS 사이트 + Decap CMS. 별도 빌드 과정 없이 GitHub → Netlify로 바로 배포됩니다. (교회/남편분 사이트와 동일한 스택입니다.)

## 폴더 구조

```
index.html            홈
about.html             사단법인 소개 (인사말·철학·발자취·조직도·사업영역)
programs.html          프로그램
news.html               소식/공지사항
support.html            후원·재무제표·기부금 내역
contact.html            오시는 길
404.html
css/style.css           전체 스타일
js/main.js               헤더/푸터 로드, 콘텐츠 로드, 스탬프 로고 렌더링
partials/header.html    공통 헤더 (nav)
partials/footer.html    공통 푸터
content/data/*.json      CMS가 관리하는 콘텐츠 (프로그램/소식/재무제표/기부금)
admin/                   Decap CMS (콘텐츠 관리 화면)
```

## 1. GitHub에 올리기

```
cd site
git init
git add .
git commit -m "한국문화기획학교 사이트 신규 제작"
git branch -M main
git remote add origin <새로 만든 GitHub 저장소 주소>
git push -u origin main
```

## 2. Netlify 연결

1. Netlify에서 **Add new site → Import an existing project** → 방금 만든 GitHub 저장소 선택
2. Build command: 비워두기 / Publish directory: `.` (루트) — 이미 `netlify.toml`에 설정되어 있어 자동 인식됩니다.
3. Deploy 클릭

## 3. Decap CMS(관리자 화면) 켜기 — 교회 사이트와 동일

1. Netlify 사이트 대시보드 → **Site configuration → Identity → Enable Identity**
2. Identity → **Registration**: `Invite only`로 설정 (아무나 가입 못 하도록)
3. Identity → **Services → Git Gateway**: Enable
4. Identity 탭에서 본인 이메일로 **Invite user** → 메일함에서 초대 수락 → 비밀번호 설정
5. 이제 `https://[사이트주소]/admin` 접속 → 로그인하면 프로그램·소식·재무제표·기부금 내역을 직접 추가/수정할 수 있습니다.

## 4. 콘텐츠 수정 방법

- `/admin`에 로그인 후 좌측 메뉴에서 **프로그램 / 소식 / 재무제표 / 기부금 내역** 선택
- 목록에서 항목 추가·수정·삭제 → **Publish** 누르면 자동으로 GitHub에 커밋되고 Netlify가 재배포합니다 (1분 내 반영)
- 재무제표는 PDF 파일을 직접 업로드하면 자동으로 링크가 연결됩니다

## 5. 직접 코드로 텍스트를 고치고 싶을 때

`content/data/` 안의 4개 JSON 파일을 직접 열어 텍스트를 바꿔도 됩니다. 형식:

```json
{
  "items": [
    { "title": "...", "status": "...", "summary": "...", "period": "...", "audience": "..." }
  ]
}
```

## 로컬에서 미리보기

```
cd site
python3 -m http.server 8000
```
브라우저에서 http://localhost:8000 접속

## 이번에 추가된 기능

- **맨 위로 이동 버튼**: 모든 페이지 우측 하단에 자동으로 나타납니다 (`js/main.js`의 `initBackToTop`).
- **프로그램 상세페이지**: `programs.html`의 카드를 클릭하면 `program-detail.html?slug=...`로 이동합니다. `/admin`에서 프로그램을 추가할 때 "고유 주소(slug)"와 "상세 내용"을 함께 입력하면 자동으로 상세페이지가 생깁니다. slug는 영문·숫자로, 등록 후에는 바꾸지 않는 게 좋아요 (링크가 깨질 수 있어요).
- **외부 링크 프로그램 (한국축제지원센터)**: 프로그램 항목에 "외부 링크"를 입력하면, slug/상세내용 없이도 카드를 눌렀을 때 바로 그 사이트로 새 탭에서 이동합니다. 지금은 한국축제지원센터(kfsc-website.vercel.app)가 이 방식으로 연결돼 있어요. 나중에 그 사이트를 새로 만들면 이 링크만 새 주소로 바꿔주면 됩니다. 소개 페이지 하단과 푸터에도 같은 링크가 있습니다.
- **사업영역 (7대 분야)**: 보내주신 자료를 바탕으로 2013~2025년 실적을 7개 분야로 정리해 소개 페이지에 반영했습니다 (대표 프로젝트, 주요 프로젝트, 발주처 포함). 이사장님 개인 이력은 인사말 서명 외에는 강조하지 않고, 학교 자체의 실적과 사업 중심으로 정리했습니다.
- **문의하기 (`inquiry.html`)**: Netlify Forms로 동작합니다. 별도 서버나 비밀번호 시스템 없이도 **문의 내용은 홈페이지 어디에도 공개되지 않고**, Netlify 사이트 대시보드의 **Forms** 탭에서만 확인됩니다. 이 탭은 로그인한 관리자(Netlify 계정 소유자·초대받은 팀원)만 볼 수 있어, 요청하신 "관리자만 확인" 조건이 그대로 충족됩니다.
  - 확인 경로: Netlify 대시보드 → 사이트 선택 → **Forms** → `inquiry`
  - 나중에 이 기능을 없애고 싶으면 `inquiry.html`, `inquiry-success.html` 두 파일을 지우고, `partials/footer.html`과 `contact.html`에서 "문의하기" 링크만 지우면 됩니다.
  - 스팸 방지용 허니팟 필드가 기본 포함되어 있습니다.
  - Netlify에서 Forms 기능이 꺼져 있다면 Site configuration → **Forms**에서 활성화해 주세요 (보통 배포 시 자동 감지됩니다).

## 카테고리 관련 제안

지금 구조(소개 / 프로그램 / 소식 / 후원·재정 / 오시는 길)면 충분히 정리돼 보입니다. 더 추가하고 싶다면:
- **갤러리**: 그동안의 활동 사진이 많으니, 소개 페이지의 "발자취" 아래 사진 아카이브로 추가하면 내비게이션을 늘리지 않고도 넣을 수 있어요.
- **회원 안내**: 회원 가입 절차·회비 안내가 별도로 필요하면 "소개" 안에 섹션으로 추가하는 걸 추천해요 (새 메뉴 대신).
- **자료실**: 워크숍 자료, 강의안 등을 공유할 계획이 있다면 그때 새 메뉴로 추가해도 늦지 않습니다.

## 남은 할 일 (직접 채워주세요)

- [ ] 후원 계좌 정보 (support.html의 "사무국 문의 시 안내" 부분)
- [ ] 재무제표 PDF 업로드 (2020~2024, /admin → 재무제표)
- [ ] 로고를 실제 로고 이미지로 교체하고 싶다면 `partials/header.html`의 `<svg class="brand-mark">` 부분을 `<img>`로 교체
- [ ] SNS 링크가 있다면 `partials/footer.html`에 추가
