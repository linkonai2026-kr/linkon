"use client";

export type PasswordRule = {
  label: string;
  test: (value: string) => boolean;
};

export const DEFAULT_PASSWORD_RULES: PasswordRule[] = [
  { label: "8자 이상", test: (v) => v.length >= 8 },
  { label: "영문 포함", test: (v) => /[a-zA-Z]/.test(v) },
  { label: "숫자 포함", test: (v) => /\d/.test(v) },
];

export function isPasswordValid(value: string, rules: PasswordRule[] = DEFAULT_PASSWORD_RULES) {
  return rules.every((rule) => rule.test(value));
}

export default function PasswordChecklist({
  value,
  rules = DEFAULT_PASSWORD_RULES,
}: {
  value: string;
  rules?: PasswordRule[];
}) {
  return (
    <ul className="password-checklist" aria-live="polite">
      {rules.map((rule) => {
        const ok = rule.test(value);
        return (
          <li
            key={rule.label}
            className={ok ? "password-checklist__item is-ok" : "password-checklist__item is-pending"}
          >
            <span className="password-checklist__icon" aria-hidden="true">
              {ok ? "✓" : "○"}
            </span>
            <span className="password-checklist__label">{rule.label}</span>
            <span className="sr-only">{ok ? "조건 충족" : "미충족"}</span>
          </li>
        );
      })}
    </ul>
  );
}
