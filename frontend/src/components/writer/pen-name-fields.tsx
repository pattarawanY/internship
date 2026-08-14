"use client";

import { Fragment, useState, type CSSProperties } from "react";

import {
  LANGUAGES,
  languageIndex,
  normalizeDetails,
  type LanguageCode,
  type PenNameDetail,
} from "@/lib/writer-profile";

type PenNameFieldsProps = {
  details: Record<LanguageCode, PenNameDetail>;
  pinnedLanguage: LanguageCode;
  onChange?: (
    details: Record<LanguageCode, PenNameDetail>,
    pinnedLanguage: LanguageCode,
  ) => void;
};

export default function PenNameFields({
  details,
  pinnedLanguage,
  onChange,
}: PenNameFieldsProps) {
  const [language, setLanguage] = useState<LanguageCode>(pinnedLanguage);
  const [values, setValues] = useState(() => normalizeDetails(details));
  const current = values[language] ?? { penName: "", bio: "" };

  const updateCurrent = (patch: Partial<PenNameDetail>) => {
    setValues((prev) => {
      const next = {
        ...prev,
        [language]: {
          ...(prev[language] ?? { penName: "", bio: "" }),
          ...patch,
        },
      };
      onChange?.(next, language);
      return next;
    });
  };

  const switchLanguage = (code: LanguageCode) => {
    setLanguage(code);
    onChange?.(values, code);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <input type="hidden" name="pinnedLanguage" value={language} />

      <div
        className="lang-tabs"
        role="radiogroup"
        aria-label="Language"
        style={
          {
            "--lang-index": languageIndex(language),
          } as CSSProperties
        }
      >
        {LANGUAGES.map((item) => (
          <Fragment key={item.code}>
            <input
              type="radio"
              id={`lang-tab-${item.code}`}
              name="languageTab"
              checked={language === item.code}
              onChange={() => switchLanguage(item.code)}
            />
            <label className="lang-tab" htmlFor={`lang-tab-${item.code}`}>
              {item.code.toUpperCase()}
            </label>
          </Fragment>
        ))}
        <span className="lang-glider" aria-hidden="true" />
      </div>

      <div className="flex w-full flex-col gap-3 text-left">
        <label className="field">
          <span>Pen name ({language})</span>
          <input
            name={`penName_${language}`}
            value={current.penName}
            onChange={(event) => updateCurrent({ penName: event.target.value })}
            placeholder="Name shown on articles"
            className="input"
          />
        </label>
        <label className="field">
          <span>Bio ({language})</span>
          <textarea
            name={`bio_${language}`}
            value={current.bio}
            onChange={(event) => updateCurrent({ bio: event.target.value })}
            placeholder="Short writer biography"
            rows={4}
            className="input min-h-28 resize-y"
          />
        </label>
      </div>

      {LANGUAGES.filter((item) => item.code !== language).map((item) => (
        <div key={item.code}>
          <input
            type="hidden"
            name={`penName_${item.code}`}
            value={values[item.code]?.penName ?? ""}
          />
          <input
            type="hidden"
            name={`bio_${item.code}`}
            value={values[item.code]?.bio ?? ""}
          />
        </div>
      ))}
    </div>
  );
}
