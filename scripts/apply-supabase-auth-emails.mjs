import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const templateDir = resolve(root, "supabase", "email-templates");

const templates = {
  mailer_subjects_confirmation: "LinkON 이메일 인증을 완료해 주세요",
  mailer_templates_confirmation_content: "confirmation.html",
  mailer_subjects_recovery: "LinkON 비밀번호 재설정 안내",
  mailer_templates_recovery_content: "recovery.html",
  mailer_subjects_magic_link: "LinkON 로그인 링크가 도착했습니다",
  mailer_templates_magic_link_content: "magic-link.html",
  mailer_subjects_invite: "LinkON 초대가 도착했습니다",
  mailer_templates_invite_content: "invite.html",
  mailer_subjects_email_change: "LinkON 이메일 변경을 확인해 주세요",
  mailer_templates_email_change_content: "email-change.html",
  mailer_subjects_reauthentication: "LinkON 보안 확인 코드 안내",
  mailer_templates_reauthentication_content: "reauthentication.html",
};

const payload = {};

for (const [key, value] of Object.entries(templates)) {
  payload[key] = value.endsWith(".html")
    ? await readFile(resolve(templateDir, value), "utf8")
    : value;
}

if (process.env.DRY_RUN === "1") {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = process.env.SUPABASE_PROJECT_REF || process.env.PROJECT_REF;

if (!accessToken || !projectRef) {
  console.error(
    "Missing SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF. Set them or run with DRY_RUN=1.",
  );
  process.exit(1);
}

const response = await fetch(
  `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
  {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  },
);

if (!response.ok) {
  const text = await response.text();
  console.error(`Failed to update Supabase Auth email templates: ${response.status}`);
  console.error(text);
  process.exit(1);
}

console.log("Supabase Auth email templates updated.");
