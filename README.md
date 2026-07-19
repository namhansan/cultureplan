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

## 남은 할 일 (직접 채워주세요)

- [ ] 후원 계좌 정보 (support.html의 "사무국 문의 시 안내" 부분)
- [ ] 재무제표 PDF 업로드 (2020~2024, /admin → 재무제표)
- [ ] 로고를 실제 로고 이미지로 교체하고 싶다면 `partials/header.html`의 `<svg class="brand-mark">` 부분을 `<img>`로 교체
- [ ] SNS 링크가 있다면 `partials/footer.html`에 추가
