import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  FileText,
  Layers3,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getSystemReviewCopy, ReviewChoice } from '../src/systemReviewCopy';

type ReviewFormData = {
  name: string;
  businessName: string;
  email: string;
  website: string;
  businessType: string;
  businessTypeOther: string;
  workflow: string[];
  workflowNotes: string;
  mainProblem: string;
  systemIncludes: string[];
  systemOther: string;
  customerExperience: string[];
  adminNeeds: string[];
  sensitiveData: string;
  sensitiveNotes: string;
  budget: string;
  timeline: string;
  finalNotes: string;
  consent: boolean;
};

const initialFormData: ReviewFormData = {
  name: '',
  businessName: '',
  email: '',
  website: '',
  businessType: '',
  businessTypeOther: '',
  workflow: [],
  workflowNotes: '',
  mainProblem: '',
  systemIncludes: [],
  systemOther: '',
  customerExperience: [],
  adminNeeds: [],
  sensitiveData: '',
  sensitiveNotes: '',
  budget: '',
  timeline: '',
  finalNotes: '',
  consent: false,
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const localizeNumber = (value: number, language: string) => {
  const normalized = String(language || '').split('-')[0].toLowerCase();
  if (!['fa', 'ar', 'ur'].includes(normalized)) return String(value);

  const digits = normalized === 'fa'
    ? ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
    : ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  return String(value).replace(/\d/g, (digit) => digits[Number(digit)]);
};

export const AuditView: React.FC = () => {
  const { i18n } = useTranslation();
  const copy = React.useMemo(() => getSystemReviewCopy(i18n.language), [i18n.language]);
  const isRtl = copy.direction === 'rtl';
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<ReviewFormData>(initialFormData);
  const [attempted, setAttempted] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');
  const [ticketNumber] = React.useState(() => `SKH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);

  const totalSteps = copy.steps.length;
  const currentStepCopy = copy.steps[step - 1];
  const progress = (step / totalSteps) * 100;

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, submitted]);

  const update = <K extends keyof ReviewFormData>(key: K, value: ReviewFormData[K]) => {
    setSubmitError('');
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleValue = (key: 'workflow' | 'systemIncludes' | 'customerExperience' | 'adminNeeds', value: string) => {
    setSubmitError('');
    setFormData((prev) => {
      const current = prev[key];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const choiceLabel = (choices: ReviewChoice[], value: string) =>
    choices.find((choice) => choice.value === value)?.label || value;

  const choiceLabels = (choices: ReviewChoice[], values: string[]) =>
    values.map((value) => choiceLabel(choices, value)).join(', ');

  const requiresSensitiveNotes = ['private-files', 'medical'].includes(formData.sensitiveData);

  const getStepError = () => {
    if (step === 1) {
      if (!formData.name.trim() || !formData.businessName.trim() || !formData.email.trim()) return copy.validationRequired;
      if (!isValidEmail(formData.email)) return copy.validationEmail;
      return '';
    }
    if (step === 2) {
      if (!formData.businessType) return copy.validationRequired;
      if (formData.businessType === 'other' && !formData.businessTypeOther.trim()) return copy.validationOther;
      return '';
    }
    if (step === 3) return formData.workflow.length ? '' : copy.validationRequired;
    if (step === 4) return formData.mainProblem.trim() ? '' : copy.validationRequired;
    if (step === 5) {
      if (!formData.systemIncludes.length) return copy.validationRequired;
      if (formData.systemIncludes.includes('other') && !formData.systemOther.trim()) return copy.validationOther;
      return '';
    }
    if (step === 6) return formData.customerExperience.length ? '' : copy.validationRequired;
    if (step === 7) return formData.adminNeeds.length ? '' : copy.validationRequired;
    if (step === 8) return formData.sensitiveData ? '' : copy.validationRequired;
    if (step === 9) return formData.budget && formData.timeline ? '' : copy.validationRequired;
    if (step === 10) return formData.consent ? '' : copy.validationConsent;
    return '';
  };

  const stepError = getStepError();
  const canContinue = !stepError;

  const goNext = () => {
    setAttempted(true);
    if (!canContinue) return;
    setAttempted(false);
    setStep((current) => Math.min(current + 1, totalSteps));
  };

  const goPrevious = () => {
    setAttempted(false);
    setSubmitError('');
    setStep((current) => Math.max(current - 1, 1));
  };

  const buildPayload = () => {
    const businessTypeLabel = formData.businessType === 'other'
      ? formData.businessTypeOther
      : choiceLabel(copy.businessTypes, formData.businessType);

    const reviewSummary = {
      name: formData.name,
      businessName: formData.businessName,
      email: formData.email,
      website: formData.website,
      businessType: businessTypeLabel,
      currentWorkflow: choiceLabels(copy.workflowOptions, formData.workflow),
      currentWorkflowNotes: formData.workflowNotes,
      mainProblem: formData.mainProblem,
      systemIncludes: `${choiceLabels(copy.systemOptions, formData.systemIncludes)}${formData.systemOther ? `, ${formData.systemOther}` : ''}`,
      customerExperience: choiceLabels(copy.customerOptions, formData.customerExperience),
      adminNeeds: choiceLabels(copy.adminOptions, formData.adminNeeds),
      sensitiveData: choiceLabel(copy.sensitiveOptions, formData.sensitiveData),
      sensitiveNotes: formData.sensitiveNotes,
      budget: choiceLabel(copy.budgetOptions, formData.budget),
      timeline: choiceLabel(copy.timelineOptions, formData.timeline),
      finalNotes: formData.finalNotes,
    };

    return {
      name: formData.name,
      businessName: formData.businessName,
      email: formData.email,
      phone: '',
      instagram: formData.website,
      businessType: formData.businessType,
      businessTypeLabel,
      channels: formData.workflow.join(', '),
      channelsLabel: reviewSummary.currentWorkflow,
      painPoint: formData.mainProblem,
      painPointLabel: formData.mainProblem,
      volume: `${reviewSummary.budget} / ${reviewSummary.timeline}`,
      volumeLabel: `${reviewSummary.budget} / ${reviewSummary.timeline}`,
      ticketNumber,
      currentLanguage: i18n.language,
      review: formData,
      reviewSummary,
    };
  };

  const handleSubmit = async () => {
    setAttempted(true);
    if (!canContinue) return;

    setLoading(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      setSubmitted(true);
    } catch (error) {
      console.error('System review submission error:', error);
      setSubmitError(copy.submitError);
    } finally {
      setLoading(false);
    }
  };

  const progressText = copy.progressText
    .replace('{{step}}', localizeNumber(step, i18n.language))
    .replace('{{total}}', localizeNumber(totalSteps, i18n.language));

  const cardBase = "rounded-[1.35rem] border p-4 text-sm font-bold transition-all duration-300 md:p-5";

  const renderChoiceCard = (
    choice: ReviewChoice,
    selected: boolean,
    onClick: () => void,
    mode: 'checkbox' | 'radio' = 'checkbox',
  ) => (
    <button
      key={choice.value}
      type="button"
      onClick={onClick}
      className={`${cardBase} ${isRtl ? 'text-right' : 'text-left'} ${
        selected
          ? 'border-cyan-300/55 bg-gradient-to-br from-[#7C3AED]/22 via-[#2563EB]/14 to-[#38D8FF]/10 text-white shadow-[0_0_34px_rgba(56,216,255,0.16)]'
          : 'border-white/10 bg-[#101827]/60 text-slate-400 hover:border-cyan-300/30 hover:text-white'
      }`}
    >
      <span className="flex items-center justify-between gap-4">
        <span>{choice.label}</span>
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          selected ? 'border-cyan-200 bg-cyan-200 text-[#050713]' : 'border-white/15 text-transparent'
        }`}>
          {selected && (mode === 'radio' ? <span className="h-2 w-2 rounded-full bg-[#050713]" /> : <Check size={14} strokeWidth={4} />)}
        </span>
      </span>
    </button>
  );

  const inputClass = `w-full rounded-2xl border border-white/10 bg-[#050713]/80 px-5 py-4 text-base text-white outline-none transition-all placeholder:text-slate-700 focus:border-cyan-300/45 focus:shadow-[0_0_0_4px_rgba(56,216,255,0.08)] ${isRtl ? 'text-right' : 'text-left'}`;
  const labelClass = `mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 ${isRtl ? 'text-right' : 'text-left'}`;

  const renderStep = () => {
    if (step === 1) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <span className={labelClass}>{copy.fields.name}</span>
            <input className={inputClass} value={formData.name} onChange={(event) => update('name', event.target.value)} placeholder={copy.placeholders.name} />
          </label>
          <label>
            <span className={labelClass}>{copy.fields.businessName}</span>
            <input className={inputClass} value={formData.businessName} onChange={(event) => update('businessName', event.target.value)} placeholder={copy.placeholders.businessName} />
          </label>
          <label>
            <span className={labelClass}>{copy.fields.email}</span>
            <input className={inputClass} type="email" value={formData.email} onChange={(event) => update('email', event.target.value)} placeholder={copy.placeholders.email} />
          </label>
          <label>
            <span className={labelClass}>{copy.fields.website} <span className="text-slate-700">({copy.optional})</span></span>
            <input className={inputClass} value={formData.website} onChange={(event) => update('website', event.target.value)} placeholder={copy.placeholders.website} />
          </label>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {copy.businessTypes.map((choice) => renderChoiceCard(
              choice,
              formData.businessType === choice.value,
              () => update('businessType', choice.value),
              'radio',
            ))}
          </div>
          {formData.businessType === 'other' && (
            <label className="block">
              <span className={labelClass}>{copy.fields.other}</span>
              <input className={inputClass} value={formData.businessTypeOther} onChange={(event) => update('businessTypeOther', event.target.value)} placeholder={copy.placeholders.businessOther} />
            </label>
          )}
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {copy.workflowOptions.map((choice) => renderChoiceCard(
              choice,
              formData.workflow.includes(choice.value),
              () => toggleValue('workflow', choice.value),
            ))}
          </div>
          <label className="block">
            <span className={labelClass}>{copy.fields.workflowNotes} <span className="text-slate-700">({copy.optional})</span></span>
            <textarea className={`${inputClass} min-h-28 resize-none`} value={formData.workflowNotes} onChange={(event) => update('workflowNotes', event.target.value)} placeholder={copy.placeholders.workflowNotes} />
          </label>
        </div>
      );
    }

    if (step === 4) {
      return (
        <label className="block">
          <span className={labelClass}>{copy.fields.mainProblem}</span>
          <textarea className={`${inputClass} min-h-56 resize-none text-lg leading-relaxed`} value={formData.mainProblem} onChange={(event) => update('mainProblem', event.target.value)} placeholder={copy.placeholders.mainProblem} />
        </label>
      );
    }

    if (step === 5) {
      return (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {copy.systemOptions.map((choice) => renderChoiceCard(
              choice,
              formData.systemIncludes.includes(choice.value),
              () => toggleValue('systemIncludes', choice.value),
            ))}
          </div>
          {formData.systemIncludes.includes('other') && (
            <label className="block">
              <span className={labelClass}>{copy.fields.other}</span>
              <input className={inputClass} value={formData.systemOther} onChange={(event) => update('systemOther', event.target.value)} placeholder={copy.placeholders.systemOther} />
            </label>
          )}
        </div>
      );
    }

    if (step === 6) {
      return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {copy.customerOptions.map((choice) => renderChoiceCard(
            choice,
            formData.customerExperience.includes(choice.value),
            () => toggleValue('customerExperience', choice.value),
          ))}
        </div>
      );
    }

    if (step === 7) {
      return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {copy.adminOptions.map((choice) => renderChoiceCard(
            choice,
            formData.adminNeeds.includes(choice.value),
            () => toggleValue('adminNeeds', choice.value),
          ))}
        </div>
      );
    }

    if (step === 8) {
      return (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {copy.sensitiveOptions.map((choice) => renderChoiceCard(
              choice,
              formData.sensitiveData === choice.value,
              () => update('sensitiveData', choice.value),
              'radio',
            ))}
          </div>
          {requiresSensitiveNotes && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-cyan-300/18 bg-cyan-300/[0.055] p-5">
              <div className={`mb-4 flex gap-3 text-sm leading-relaxed text-cyan-100 ${isRtl ? 'text-right' : 'text-left'}`}>
                <ShieldCheck className="mt-1 shrink-0 text-cyan-200" size={18} />
                <p>{copy.sensitiveHelper}</p>
              </div>
              <label className="block">
                <span className={labelClass}>{copy.fields.sensitiveNotes} <span className="text-slate-700">({copy.optional})</span></span>
                <textarea className={`${inputClass} min-h-28 resize-none`} value={formData.sensitiveNotes} onChange={(event) => update('sensitiveNotes', event.target.value)} placeholder={copy.placeholders.sensitiveNotes} />
              </label>
            </motion.div>
          )}
        </div>
      );
    }

    if (step === 9) {
      return (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <span className={labelClass}>{copy.fields.budget}</span>
            <div className="grid gap-3">
              {copy.budgetOptions.map((choice) => renderChoiceCard(
                choice,
                formData.budget === choice.value,
                () => update('budget', choice.value),
                'radio',
              ))}
            </div>
          </div>
          <div>
            <span className={labelClass}>{copy.fields.timeline}</span>
            <div className="grid gap-3">
              {copy.timelineOptions.map((choice) => renderChoiceCard(
                choice,
                formData.timeline === choice.value,
                () => update('timeline', choice.value),
                'radio',
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <label className="block">
          <span className={labelClass}>{copy.fields.finalNotes} <span className="text-slate-700">({copy.optional})</span></span>
          <textarea className={`${inputClass} min-h-44 resize-none`} value={formData.finalNotes} onChange={(event) => update('finalNotes', event.target.value)} placeholder={copy.placeholders.finalNotes} />
        </label>
        <button
          type="button"
          onClick={() => update('consent', !formData.consent)}
          className={`flex w-full items-start gap-4 rounded-2xl border p-5 transition-all ${isRtl ? 'text-right' : 'text-left'} ${
            formData.consent
              ? 'border-cyan-300/45 bg-cyan-300/[0.055] text-white'
              : 'border-white/10 bg-[#101827]/60 text-slate-400 hover:border-cyan-300/25'
          }`}
        >
          <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${formData.consent ? 'border-cyan-200 bg-cyan-200 text-[#050713]' : 'border-white/15'}`}>
            {formData.consent && <Check size={15} strokeWidth={4} />}
          </span>
          <span className="text-sm leading-relaxed">{copy.consent}</span>
        </button>
      </div>
    );
  };

  if (submitted) {
    return (
      <main dir={copy.direction} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050713] px-4 py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.18),transparent_36%),radial-gradient(circle_at_80%_70%,rgba(56,216,255,0.10),transparent_34%)]" />
        <motion.section
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[2.4rem] border border-cyan-300/18 bg-[#101827]/78 p-8 text-center shadow-[0_30px_120px_rgba(5,7,19,0.65)] backdrop-blur-2xl md:p-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,216,255,0.10),transparent_44%)]" />
          <div className="relative z-10">
            <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] text-white shadow-[0_20px_70px_rgba(37,99,235,0.34)]">
              <CheckCircle2 size={38} />
            </div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-cyan-200">{copy.brandSignature}</p>
            <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">{copy.successTitle}</h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-400">{copy.successBody}</p>
            <div className="mt-8 inline-flex rounded-2xl border border-white/10 bg-[#050713]/70 px-5 py-3 text-sm font-bold text-cyan-200">
              {ticketNumber}
            </div>
            <button
              type="button"
              onClick={() => { window.location.hash = '#/'; }}
              className="mx-auto mt-8 flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] px-8 py-4 text-sm font-black text-white shadow-[0_18px_52px_rgba(37,99,235,0.28)] transition-all hover:-translate-y-1"
            >
              {copy.backHome}
              <ArrowRight className={isRtl ? 'rotate-180' : ''} size={18} />
            </button>
          </div>
        </motion.section>
      </main>
    );
  }

  return (
    <main dir={copy.direction} className="relative min-h-screen overflow-hidden bg-[#050713] px-4 pb-16 pt-28 md:pt-32">
      <div className="fixed left-0 right-0 top-0 z-[60] h-1 bg-[#101827]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#38D8FF] shadow-[0_0_20px_rgba(56,216,255,0.45)]"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.16),transparent_36%),radial-gradient(circle_at_85%_40%,rgba(56,216,255,0.09),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-[520px] max-w-[920px] rounded-full bg-gradient-to-br from-[#7C3AED]/10 via-[#2563EB]/7 to-[#38D8FF]/8 blur-[90px]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <header className={`mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-white/[0.03] px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles size={14} />
              {copy.pageBadge}
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              {copy.pageTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
              {copy.pageSubtitle}
            </p>
          </div>

          <div className="min-w-[190px] rounded-2xl border border-white/10 bg-[#101827]/60 p-4 backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">{progressText}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#050713]">
              <motion.div
                animate={{ width: `${progress}%` }}
                className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#38D8FF]"
              />
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[2.4rem] border border-violet-400/14 bg-[#101827]/70 p-5 shadow-[0_30px_120px_rgba(5,7,19,0.62)] backdrop-blur-2xl md:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(124,58,237,0.14),transparent_36%),radial-gradient(circle_at_100%_20%,rgba(56,216,255,0.10),transparent_34%)]" />
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: isRtl ? -24 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? 24 : -24 }}
                transition={{ duration: 0.26, ease: 'easeOut' }}
              >
                <div className={`mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/14 bg-[#050713]/80 text-cyan-200">
                    {step === 1 ? <FileText size={24} /> : step === 10 ? <Send size={23} /> : <Layers3 size={24} />}
                  </div>
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-violet-200">{progressText}</p>
                  <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">{currentStepCopy.title}</h2>
                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-400 md:text-lg">{currentStepCopy.helper}</p>
                  {currentStepCopy.question && <p className="mt-3 text-sm font-semibold text-cyan-100/80">{currentStepCopy.question}</p>}
                </div>

                {renderStep()}

                {(attempted && stepError) || submitError ? (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-5 rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm font-semibold text-red-100 ${isRtl ? 'text-right' : 'text-left'}`}
                  >
                    {submitError || stepError}
                  </motion.p>
                ) : null}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={goPrevious}
                disabled={step === 1 || loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-4 text-sm font-black text-white transition-all hover:border-cyan-300/25 hover:bg-white/[0.06] disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className={isRtl ? 'rotate-180' : ''} size={18} />
                {copy.previous}
              </button>

              <div className={`flex items-center gap-3 text-xs font-medium text-slate-500 ${isRtl ? 'text-right' : 'text-left'}`}>
                <ShieldCheck className="shrink-0 text-cyan-300" size={16} />
                <span>{copy.privacyNote}</span>
              </div>

              <button
                type="button"
                onClick={step === totalSteps ? handleSubmit : goNext}
                disabled={!canContinue || loading}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] px-7 py-4 text-sm font-black text-white shadow-[0_18px_52px_rgba(37,99,235,0.28)] transition-all hover:-translate-y-1 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:grayscale"
              >
                {loading ? copy.sending : step === totalSteps ? copy.submit : copy.next}
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
                ) : step === totalSteps ? (
                  <Send size={18} />
                ) : (
                  <ArrowRight className={isRtl ? 'rotate-180' : ''} size={18} />
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
