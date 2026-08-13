"use client";

import { useState } from "react";

import {
  LANGUAGES,
  type LanguageCode,
  type PenNameDetail,
} from "@/lib/writer-profile";

type PenNameFieldsProps = {
  details: Record<LanguageCode, PenNameDetail>;
  pinnedLanguage: LanguageCode;
};

export default function PenNameFields({
  details,
  pinnedLanguage,
}: PenNameFieldsProps) {
  const [language, setLanguage] = useState<LanguageCode>(pinnedLanguage);
  const [values, setValues] = useState(details);
  const current = values[language];

  const updateCurrent = (patch: Partial<PenNameDetail>) => {
    setValues((prev) => ({
      ...prev,
      [language]: { ...prev[language], ...patch },
    }));
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <input type="hidden" name="pinnedLanguage" value={language} />

      <div className="flex gap-1 rounded-full bg-[var(--paper-strong)] p-1">
        {LANGUAGES.map((item) => (
          <button
            key={item.code}
            type="button"
            className={`lang-tab ${language === item.code ? "is-active" : ""}`}
            onClick={() => setLanguage(item.code)}
          >
            {item.label}
          </button>
        ))}
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
            value={values[item.code].penName}
          />
          <input
            type="hidden"
            name={`bio_${item.code}`}
            value={values[item.code].bio}
          />
        </div>
      ))}
    </div>
  );
}
