# LinkON Supabase Auth Email Templates

Supabase Auth에서 발송되는 인증 메일을 LinkON 브랜드 톤으로 통일하기 위한 템플릿입니다.

## 적용 위치

Supabase Dashboard에서 다음 경로로 이동합니다.

1. `Authentication`
2. `Email Templates`
3. 아래 템플릿별 Subject와 HTML을 붙여 넣기

## 템플릿 매핑

| Supabase template | Subject | HTML file |
| --- | --- | --- |
| Confirm signup | `LinkON 이메일 인증을 완료해 주세요` | `confirmation.html` |
| Reset password | `LinkON 비밀번호 재설정 안내` | `recovery.html` |
| Magic link | `LinkON 로그인 링크가 도착했습니다` | `magic-link.html` |
| Invite user | `LinkON 초대가 도착했습니다` | `invite.html` |
| Change email address | `LinkON 이메일 변경을 확인해 주세요` | `email-change.html` |
| Reauthentication | `LinkON 보안 확인 코드 안내` | `reauthentication.html` |

## Management API 적용

Supabase access token과 project ref가 준비되어 있으면 다음 명령으로 적용할 수 있습니다.

```powershell
$env:SUPABASE_ACCESS_TOKEN="your-access-token"
$env:SUPABASE_PROJECT_REF="your-project-ref"
node scripts/apply-supabase-auth-emails.mjs
```

먼저 실제 적용 없이 payload만 확인하려면 다음처럼 실행합니다.

```powershell
$env:DRY_RUN="1"
node scripts/apply-supabase-auth-emails.mjs
```

## 발신자 이름

메일 본문만으로도 LinkON 브랜드처럼 보이게 만들었지만, 실제 받은편지함에서 `LinkON`이 발신자로 보이려면 Supabase의 SMTP 설정도 함께 맞추는 것이 좋습니다.

권장값:

- Sender name: `LinkON`
- Sender email: `no-reply@사용중인도메인`
- Reply-to: 운영팀 또는 고객지원 메일

도메인 메일을 사용하려면 SMTP 제공업체에서 SPF, DKIM, DMARC 설정까지 완료해야 합니다.
