# 🔍 Keyword Replacer (키워드 변환기)

> **사내 AI 활용 보안 가이드라인 준수를 위한 민감 정보 마스킹 도구**

사내에서 외부 LLM(ChatGPT, Claude 등) 및 AI 툴을 사용할 때 발생할 수 있는 대외비 유출 등 보안 이슈를 예방하기 위한 웹 서비스입니다. 현재 AI 거버넌스나 그라운드룰이 확립되기 전 단계에서, 사용자가 주요 키워드를 수동으로 마스킹하거나 치환하여 안전하게 AI를 활용할 수 있도록 돕습니다.

---

## 📺 프로젝트 시연
> **Note:** 아래는 실제 동작 화면입니다.
![Keyword Replacer Demo](https://via.placeholder.com/800x450.png?text=Keyword+Replacer+Demo+Screenshot)

---

## 🛡️ 프로젝트 배경 및 목적

*   **보안 이슈 예방:** 외부 AI 모델에 사내 민감 정보나 프로젝트 대외비가 포함된 프롬프트가 전송되는 것을 차단합니다.
*   **키워드 마스킹:** 인명, 프로젝트명, 서버 IP, 내부 자산 코드 등을 고유 식별자(AAAA, BBBB...)로 치환하여 데이터의 맥락은 유지하되 정보 노출은 방지합니다.
*   **거버넌스 대응:** 정식 AI 보안 솔루션 도입 전, 임직원들이 즉각적으로 실천할 수 있는 보안 그라운드룰을 지원합니다.

---

## ✨ 주요 기능

- **실시간 텍스트 변환:** 입력 즉시 마스킹 결과 확인 가능.
- **자동 키워드 생성:** 바꿀 키워드 입력 시 `AAAA`, `BBBB` 등 순차적 식별자 자동 부여.
- **글자수 측정 및 강조:** 10,000자 초과 시 테두리 및 글자 색상 **빨간색** 변경으로 시각적 경고 제공.
- **스왑(Swap) 기능:** 마스킹 전/후 키워드를 한 번의 클릭으로 반전.
- **원클릭 복사:** 변환된 내용을 즉시 클립보드에 복사.

---

## 🚀 배포 환경

이 프로젝트는 최신 CI/CD 환경에서 운영됩니다.

- **Infrastructure:** [Cloudflare Pages](https://pages.cloudflare.com/)
- **Deployment:** `main` 브랜치에 코드 Push 시 Cloudflare를 통해 자동으로 빌드 및 글로벌 에지 네트워크에 배포됩니다.

---

## 🛠 기술 스택

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Deployment:** Cloudflare Pages, GitHub Actions (optional)
- **Icons/Fonts:** Material Icons, Apple SD Gothic Neo

---

## 📄 라이선스
이 프로젝트는 MIT 라이선스 하에 배포됩니다.
