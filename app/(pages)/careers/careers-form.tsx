"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ApplicationError,
  submitApplication,
  type ApplicantStatus,
  type ApplicationPosition,
  type WorkRight,
} from "@/lib/api";
import { renderTemplate } from "@/lib/i18n-template";
import { useTranslations } from "../../i18n/context";
import { CareersIntroCopy, CareersPanel } from "./careers-panel";

type State = "idle" | "sending" | "success" | "error";

/** -1 is the introduction, 0..n-1 the questions, n the review-and-send step. */
const INTRO = -1;

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidUrl(v: string) {
  try {
    const u = new URL(v.trim());
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function Arrow({ className, back = false }: { className?: string; back?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden style={back ? { transform: "scaleX(-1)" } : undefined}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

const inputClass = (bad: boolean) =>
  `block min-h-[52px] w-full bg-transparent border-0 border-b-2 px-0 py-3 text-lg text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary ${
    bad ? "border-red-300" : "border-border"
  }`;

/** A sub-label inside a question that carries more than one input. */
function Sub({ label, optional, children }: { label: string; optional?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-baseline gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        {optional ? (
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-faint-foreground">{optional}</span>
        ) : null}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Select({
  value,
  onChange,
  bad,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  bad: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass(bad)} appearance-none pr-8`}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function Choice({
  name,
  value,
  current,
  label,
  onPick,
}: {
  name: string;
  value: string;
  current: string;
  label: string;
  onPick: (v: string) => void;
}) {
  const active = current === value;
  return (
    <label
      className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border px-5 transition-colors ${
        active ? "border-primary bg-primary/[0.06]" : "border-border bg-card hover:bg-surface-alt"
      }`}
    >
      <input type="radio" name={name} value={value} checked={active} onChange={() => onPick(value)} className="h-4 w-4 accent-[var(--primary-strong)]" />
      <span className="text-base text-foreground">{label}</span>
    </label>
  );
}

export function CareersForm() {
  const t = useTranslations("careers");

  const [step, setStep] = useState<number>(INTRO);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [workRight, setWorkRight] = useState("");
  const [status, setStatus] = useState("");
  const [institution, setInstitution] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [position, setPosition] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [projectBody, setProjectBody] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [availability, setAvailability] = useState("");
  const [heardFrom, setHeardFrom] = useState("");
  const [consent, setConsent] = useState(false);

  const [showErrors, setShowErrors] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const req = (v: string) => (v.trim() ? null : t("errRequired"));
  const reqUrl = (v: string) => (!v.trim() ? t("errRequired") : isValidUrl(v) ? null : t("errUrl"));
  const optUrl = (v: string) => (!v.trim() || isValidUrl(v) ? null : t("errUrl"));

  /* One entry per question. `error` is what blocks Next; `summary` is what the
     review step prints back. Keeping both next to the field means a new
     question cannot be added without deciding how it validates and reads. */
  const questions: {
    title: string;
    help?: string;
    error: string | null;
    summary: string;
    node: ReactNode;
  }[] = [
    {
      title: t("nameLabel"),
      error: req(fullName),
      summary: fullName,
      node: <input autoFocus value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" className={inputClass(showErrors && !fullName.trim())} />,
    },
    {
      title: t("emailLabel"),
      error: !email.trim() ? t("errRequired") : isValidEmail(email) ? null : t("errEmail"),
      summary: email,
      node: <input autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputClass(showErrors && !isValidEmail(email))} />,
    },
    {
      title: t("phoneLabel"),
      error: req(phone),
      summary: phone,
      node: <input autoFocus type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputClass(showErrors && !phone.trim())} />,
    },
    {
      title: t("cityLabel"),
      error: req(city),
      summary: city,
      node: <input autoFocus value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" className={inputClass(showErrors && !city.trim())} />,
    },
    {
      title: t("workRightLabel"),
      error: req(workRight),
      summary:
        workRight === "CITIZEN" ? t("workRightCitizen") : workRight === "PERMIT" ? t("workRightPermit") : workRight === "NEITHER" ? t("workRightNeither") : "",
      node: (
        <div className="space-y-3">
          <Choice name="workRight" value="CITIZEN" current={workRight} label={t("workRightCitizen")} onPick={setWorkRight} />
          <Choice name="workRight" value="PERMIT" current={workRight} label={t("workRightPermit")} onPick={setWorkRight} />
          <Choice name="workRight" value="NEITHER" current={workRight} label={t("workRightNeither")} onPick={setWorkRight} />
        </div>
      ),
    },
    {
      title: t("statusLabel"),
      error: req(status),
      summary: [
        status === "STUDENT" ? t("statusStudent") : status === "GRADUATE" ? t("statusGraduate") : status === "EMPLOYED" ? t("statusEmployed") : "",
        institution,
        graduationYear,
      ].filter(Boolean).join(" · "),
      node: (
        <div className="space-y-6">
          <div className="space-y-3">
            <Choice name="status" value="STUDENT" current={status} label={t("statusStudent")} onPick={setStatus} />
            <Choice name="status" value="GRADUATE" current={status} label={t("statusGraduate")} onPick={setStatus} />
            <Choice name="status" value="EMPLOYED" current={status} label={t("statusEmployed")} onPick={setStatus} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <Sub label={t("institutionLabel")} optional={t("optional")}>
              <input value={institution} onChange={(e) => setInstitution(e.target.value)} className={inputClass(false)} />
            </Sub>
            <Sub label={t("graduationLabel")} optional={t("optional")}>
              <input value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} inputMode="numeric" className={inputClass(false)} />
            </Sub>
          </div>
        </div>
      ),
    },
    {
      title: t("positionLabel"),
      error: req(position),
      summary:
        position === "FULL_STACK" ? t("roleFullStack") : position === "BACKEND" ? t("roleBackend") : position === "FRONTEND" ? t("roleFrontend") : position === "DEVOPS" ? t("roleDevOps") : position === "GAME" ? t("roleGame") : "",
      node: (
        <div className="space-y-3">
          <Choice name="position" value="FULL_STACK" current={position} label={t("roleFullStack")} onPick={setPosition} />
          <Choice name="position" value="BACKEND" current={position} label={t("roleBackend")} onPick={setPosition} />
          <Choice name="position" value="FRONTEND" current={position} label={t("roleFrontend")} onPick={setPosition} />
          <Choice name="position" value="DEVOPS" current={position} label={t("roleDevOps")} onPick={setPosition} />
          <Choice name="position" value="GAME" current={position} label={t("roleGame")} onPick={setPosition} />
        </div>
      ),
    },
    {
      title: t("techLabel"),
      error: req(technologies),
      summary: technologies,
      node: <textarea autoFocus rows={4} value={technologies} onChange={(e) => setTechnologies(e.target.value)} className={`${inputClass(showErrors && !technologies.trim())} resize-none`} />,
    },
    {
      title: t("projectUrlLabel"),
      help: t("projectBodyLabel"),
      error: reqUrl(projectUrl) ?? req(projectBody),
      summary: [projectUrl, projectBody].filter(Boolean).join(" — "),
      node: (
        <div className="space-y-6">
          <input autoFocus type="url" inputMode="url" placeholder="https://" value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} className={inputClass(Boolean(showErrors && reqUrl(projectUrl)))} />
          <Sub label={t("projectBodyLabel")}>
            <textarea rows={4} value={projectBody} onChange={(e) => setProjectBody(e.target.value)} className={`${inputClass(showErrors && !projectBody.trim())} resize-none`} />
          </Sub>
        </div>
      ),
    },
    {
      title: t("githubLabel"),
      error: reqUrl(githubUrl),
      summary: githubUrl,
      node: <input autoFocus type="url" inputMode="url" placeholder="https://github.com/" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className={inputClass(Boolean(showErrors && reqUrl(githubUrl)))} />,
    },
    {
      title: t("linkedinLabel"),
      error: optUrl(linkedinUrl),
      summary: linkedinUrl,
      node: <input autoFocus type="url" inputMode="url" placeholder="https://linkedin.com/in/" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className={inputClass(Boolean(showErrors && optUrl(linkedinUrl)))} />,
    },
    {
      title: t("portfolioLabel"),
      error: optUrl(portfolioUrl) ?? optUrl(cvUrl),
      summary: [portfolioUrl, cvUrl].filter(Boolean).join(" · "),
      node: (
        <div className="space-y-6">
          <input autoFocus type="url" inputMode="url" placeholder="https://" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className={inputClass(Boolean(showErrors && optUrl(portfolioUrl)))} />
          <Sub label={t("cvLabel")} optional={t("optional")}>
            <input type="url" inputMode="url" placeholder="https://" value={cvUrl} onChange={(e) => setCvUrl(e.target.value)} className={inputClass(Boolean(showErrors && optUrl(cvUrl)))} />
          </Sub>
        </div>
      ),
    },
    {
      title: t("availabilityLabel"),
      help: t("availabilityHelp"),
      error: req(availability),
      summary: availability === "YES" ? t("availYes") : availability === "NO" ? t("availNo") : "",
      node: (
        <div className="space-y-3">
          <Choice name="availability" value="YES" current={availability} label={t("availYes")} onPick={setAvailability} />
          <Choice name="availability" value="NO" current={availability} label={t("availNo")} onPick={setAvailability} />
        </div>
      ),
    },
    {
      title: t("sourceLabel"),
      error: null,
      summary: heardFrom
        ? { FACEBOOK: t("sourceFacebook"), INSTAGRAM: t("sourceInstagram"), LINKEDIN: t("sourceLinkedin"), UNIVERSITY: t("sourceUniversity"), FRIEND: t("sourceFriend"), OTHER: t("sourceOther") }[heardFrom] ?? heardFrom
        : "",
      node: (
        <Select value={heardFrom} onChange={setHeardFrom} bad={false}>
          <option value="">{t("sourceSelect")}</option>
          <option value="FACEBOOK">{t("sourceFacebook")}</option>
          <option value="INSTAGRAM">{t("sourceInstagram")}</option>
          <option value="LINKEDIN">{t("sourceLinkedin")}</option>
          <option value="UNIVERSITY">{t("sourceUniversity")}</option>
          <option value="FRIEND">{t("sourceFriend")}</option>
          <option value="OTHER">{t("sourceOther")}</option>
        </Select>
      ),
    },
  ];

  const total = questions.length;
  const REVIEW = total;
  const onReview = step === REVIEW;
  const current = step >= 0 && step < total ? questions[step] : null;

  const headingRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    // Move the reader to the top of the new question — without this a screen
    // reader stays where the Next button was and never hears the new one.
    if (step > INTRO) headingRef.current?.focus();
    setShowErrors(false);
  }, [step]);

  function goNext() {
    if (current?.error) {
      setShowErrors(true);
      return;
    }
    setStep((s) => Math.min(s + 1, REVIEW));
  }

  function resetForm() {
    setFullName(""); setEmail(""); setPhone(""); setCity("");
    setWorkRight(""); setStatus(""); setInstitution(""); setGraduationYear("");
    setPosition(""); setTechnologies(""); setProjectUrl(""); setProjectBody("");
    setGithubUrl(""); setLinkedinUrl(""); setPortfolioUrl(""); setCvUrl("");
    setAvailability(""); setHeardFrom(""); setConsent(false);
    setShowErrors(false); setErrorMessage(null); setState("idle"); setStep(INTRO);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!onReview) {
      goNext();
      return;
    }
    if (!consent) {
      setShowErrors(true);
      return;
    }
    setState("sending");
    setErrorMessage(null);
    try {
      await submitApplication({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        work_right: workRight as WorkRight,
        status: status as ApplicantStatus,
        institution: institution.trim() || undefined,
        graduation_year: graduationYear.trim() || undefined,
        position: position as ApplicationPosition,
        technologies: technologies.trim(),
        project_url: projectUrl.trim(),
        project_body: projectBody.trim(),
        github_url: githubUrl.trim(),
        linkedin_url: linkedinUrl.trim() || undefined,
        portfolio_url: portfolioUrl.trim() || undefined,
        cv_url: cvUrl.trim() || undefined,
        available_from_start: availability === "YES",
        heard_from: heardFrom || undefined,
        consent,
        source: "careers-page",
      });
      setState("success");
    } catch (err) {
      const notOpen = err instanceof ApplicationError && err.status === 404;
      setErrorMessage(notOpen ? t("errNotOpen") : t("errGeneric"));
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-3xl border border-primary/30 bg-primary/[0.04] p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-strong text-primary-foreground shadow-lg shadow-primary/40">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="type-card-title mt-5">{t("successTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {renderTemplate(t("successBody"), {
            name: fullName.split(" ")[0],
            email: <span className="font-semibold text-foreground">{email}</span>,
          })}
        </p>
        <button type="button" onClick={resetForm} className="mt-6 inline-flex h-11 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-surface-alt">
          {t("applyAnother")}
        </button>
      </div>
    );
  }

  const started = step > INTRO;
  const shownStep = onReview ? total : Math.max(step + 1, 1);
  const pct = started ? (shownStep / (total + 1)) * 100 : 0;
  const progressLabel = onReview
    ? t("reviewTitle")
    : renderTemplate(t("stepOf"), { current: String(shownStep), total: String(total) });

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
      {/* Panel first in the DOM so it reads before the questions, and so it
          lands above them when the columns stack. */}
      <div className="lg:col-span-5">
        <CareersPanel
          started={started}
          shownStep={shownStep}
          total={total}
          pct={pct}
          label={progressLabel}
        />
      </div>

      <div className="lg:col-span-7">
        {step === INTRO ? (
          <div className="lg:py-4">
            <CareersIntroCopy />
            <button
              type="button"
              onClick={() => setStep(0)}
              className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-primary-strong px-7 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              {t("startApplication")}
              <Arrow className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <FormBody />
        )}
      </div>
    </div>
  );

  function FormBody() {
    return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="sr-only">{t("heading")}</h1>

      <div className="min-h-[21rem]">
        {onReview ? (
          <div>
            <p ref={headingRef} tabIndex={-1} className="text-2xl font-bold leading-[1.15] tracking-[-0.02em] text-heading outline-none sm:text-3xl">
              {t("reviewTitle")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{t("reviewIntro")}</p>
            <dl className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
              {questions.map((q, i) => (
                <div key={q.title} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{q.title}</dt>
                  <dd className="flex items-center gap-3 text-sm text-foreground">
                    <span className={q.summary ? "" : "text-faint-foreground"}>
                      {q.summary || t("notAnswered")}
                    </span>
                    <button type="button" onClick={() => setStep(i)} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-text underline underline-offset-2">
                      {t("back")}
                    </button>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary-strong)]" />
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {t("consentLabel")}{" "}
                  <Link href="/privacy" className="font-medium text-primary-text underline underline-offset-2">
                    {t("consentLink")}
                  </Link>
                </span>
              </label>
              {showErrors && !consent ? (
                <p role="alert" className="mt-2 text-[11px] font-medium text-red-600">{t("errConsent")}</p>
              ) : null}
            </div>
          </div>
        ) : current ? (
          <div>
            <p ref={headingRef} tabIndex={-1} className="text-balance text-2xl font-bold leading-[1.15] tracking-[-0.02em] text-heading outline-none sm:text-3xl">
              {current.title}
            </p>
            {current.help ? <p className="mt-2 text-sm text-muted-foreground">{current.help}</p> : null}
            <div className="mt-6">{current.node}</div>
            {showErrors && current.error ? (
              <p role="alert" className="mt-2 text-[11px] font-medium text-red-600">{current.error}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-10 flex items-center gap-3 border-t border-border pt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={step === 0}
          className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Arrow className="h-4 w-4" back />
          {t("back")}
        </button>

        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary-strong px-7 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
        >
          {state === "sending" ? (
            <>
              <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
              {t("sending")}
            </>
          ) : onReview ? (
            t("submit")
          ) : (
            <>
              {t("next")}
              <Arrow className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {state === "error" ? (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          {errorMessage ?? t("errGeneric")}
        </p>
      ) : null}
    </form>
    );
  }
}
