"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { HeartHandshake } from "lucide-react";

const translations = {
  en: {
    title: "Support Our Work",
    message: "If you appreciate our work, you can donate. Every CHF counts!",
    button: "Support project",
  },
  de: {
    title: "Unterstützen Sie Unsere Arbeit",
    message:
      "Wenn Sie unsere Arbeit schätzen, können Sie spenden. Jeder Franken zählt!",
    button: "Projekt unterstützen",
  },
  fr: {
    title: "Soutenez Notre Travail",
    message:
      "Si vous appréciez notre travail, vous pouvez faire un don. Chaque franc compte !",
    button: "Soutenir le projet",
  },
  it: {
    title: "Supporta Il Nostro Lavoro",
    message:
      "Se apprezzi il nostro lavoro, puoi fare una donazione. Ogni franco conta!",
    button: "Supporta il progetto",
  },
};

export default function DonationPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const t = translations[lang as keyof typeof translations] || translations.en;

  const supportLink =
    "https://go.twint.ch/1/e/tw?tw=acq.8Se8HLqcRD2xXAosggSCW4fNjeLkaz61TLijTxqo6cVKG2e-WVD9I-bxAST4IOD9";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 60000); // Show after 1 minute

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg p-6 max-w-sm animate-fade-in">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
      <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
      <p className="text-gray-600 mb-4">{t.message}</p>
      <a
        href={supportLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full"
      >
        <button className="bg-black text-white flex items-center space-x-2 px-3 py-2 rounded-md w-full hover:bg-gray-800">
          <Image
            src="https://play-lh.googleusercontent.com/pGZsOWcRRSQLNncRTfhGQKP_Oql9-ZmtdygrFd8myq7wONKa-INO-gFSy1xp5BL2yA"
            alt="TWINT"
            width={24}
            height={24}
            className="rounded"
          />
          <span>{t.button}</span>
          <HeartHandshake className="h-4 w-4 ml-1" />
        </button>
      </a>
    </div>
  );
}
