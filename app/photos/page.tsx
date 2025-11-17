"use client";

import React, { useState } from "react";
import { Camera, X } from "lucide-react";
import Image from "next/image";

export default function PhotosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");

  // Valid phrases in different languages (case-insensitive)
  const validPhrases = [
    "eu entendo", // Portuguese
    "entendo", // Portuguese (short)
    "je comprends", // French
    "j'ai compris", // French
    "je comprend", // French (alternate)
    "comprends", // French (short)
    "ich verstehe", // German
    "verstehe", // German (short)
    "verstanden", // German (understood)
    "i understand", // English
    "understand", // English (short)
  ];

  const checkInput = () => {
    const normalizedInput = inputText.trim().toLowerCase();
    return validPhrases.includes(normalizedInput);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setInputText("");
    setError("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInputText("");
    setError("");
  };

  const handleSubmit = () => {
    if (checkInput()) {
      // Redirect to pCloud link
      window.location.href =
        "https://u.pcloud.link/publink/show?code=kZzweg5ZuVrmixJ4xN8jq19KtUTwwX9vWheV";
    } else {
      setError(
        "Please type 'I understand' in Portuguese, French, German, or English"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Photos from IBJJF GENEVA OPEN 2025
          </h1>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <p className="text-gray-700 text-lg font-semibold">
              🇵🇹🇧🇷 Por favor, leia atentamente este texto <br />
              🇫🇷🇨🇭 Veuillez lire attentivement ce texte <br />
              🇬🇧 Please read carefully this text <br />
              🇩🇪🇨🇭 Bitte lesen Sie diesen Text sorgfältig durch
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 space-y-6 text-left">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-gray-800 leading-relaxed">
                <strong className="text-gray-900 block mb-2">
                  🇵🇹🇧🇷 Português:
                </strong>
                Em um link abaixo todas as fotos. O custo da foto é de{" "}
                <strong className="text-blue-600">5 CHF / 5.45 EUR</strong> por
                foto. Eu também sou faixa branca iniciante e acredito no
                respeito da comunidade. Não vou esconder fotos sob marca
                d&apos;água, então se você roubar fotos, é por sua conta!
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-gray-800 leading-relaxed">
                <strong className="text-gray-900 block mb-2">
                  🇫🇷🇨🇭 Français:
                </strong>
                Dans un lien ci-dessous toutes les photos. Le coût d&apos;une
                photo est de{" "}
                <strong className="text-blue-600">5 CHF / 5.45 EUR</strong> par
                photo. Je suis aussi une ceinture blanche débutante et je crois
                au respect de la communauté. Je ne cacherai pas les photos sous
                un filigrane, donc si vous volez des photos, c&apos;est à vos
                risques et périls !
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-gray-800 leading-relaxed">
                <strong className="text-gray-900 block mb-2">
                  🇬🇧 English:
                </strong>
                In a link below all photos. The cost of photo is{" "}
                <strong className="text-blue-600">5 CHF / 5.45 EUR</strong> per
                photo. I&apos;m also fresh white belt and I believe in respect
                of a community. I will not hide photos under watermark, so if
                you steal photos it is on you!
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-gray-800 leading-relaxed">
                <strong className="text-gray-900 block mb-2">
                  🇩🇪🇨🇭 Deutsch:
                </strong>
                In einem Link unten alle Fotos. Die Kosten pro Foto betragen{" "}
                <strong className="text-blue-600">5 CHF / 5.45 EUR</strong>. Ich
                bin auch ein frischer weißer Gürtel und glaube an den Respekt
                der Gemeinschaft. Ich werde Fotos nicht unter einem
                Wasserzeichen verstecken, also wenn Sie Fotos stehlen, liegt das
                bei Ihnen!
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            <span className="block mb-1">🇵🇹🇧🇷 Você pode me pagar por:</span>
            <span className="block mb-1">🇫🇷🇨🇭 Vous pouvez me payer par :</span>
            <span className="block mb-1">🇬🇧 You can pay me by:</span>
            <span className="block">🇩🇪🇨🇭 Sie können mich bezahlen mit:</span>
          </h2>

          <div className="space-y-4">
            {/* TWINT */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="text-center sm:text-left w-full sm:w-auto">
                <h3 className="font-bold text-lg text-gray-900 mb-2">TWINT</h3>
                <p className="text-gray-700 text-lg font-mono">0789514266</p>
              </div>
            </div>

            {/* REVOLUT */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
                <Image
                  src="/payment/revolut.PNG"
                  alt="Revolut"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  REVOLUT
                </h3>
                <a
                  href="http://revolut.me/mariiadzp1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-base break-all"
                >
                  revolut.me/mariiadzp1
                </a>
              </div>
            </div>

            {/* IBAN */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
                <Image
                  src="/payment/iban.jpg"
                  alt="IBAN"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-2">IBAN</h3>
                <p className="text-gray-700">Bank transfer details</p>
              </div>
            </div>

            {/* PayPal */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
                <Image
                  src="/payment/paypal.png"
                  alt="PayPal"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-2">PayPal</h3>
                <a
                  href="https://www.paypal.me/mariyemko"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-base"
                >
                  paypal.me/mariyemko
                </a>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenModal}
          className="inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xl sm:text-2xl font-bold rounded-lg shadow-2xl transform transition-all duration-200 hover:scale-105 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-blue-300 min-w-[300px] sm:min-w-[400px]"
        >
          <Camera className="w-8 h-8 mr-4" />
          View Photos
        </button>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal content */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
                <span className="block mb-2">
                  🇵🇹🇧🇷 Escreva &quot;eu entendo&quot;
                </span>
                <span className="block mb-2">
                  🇫🇷 Écrivez &quot;je comprends&quot;
                </span>
                <span className="block mb-2">
                  🇬🇧 Type &quot;I understand&quot;
                </span>
                <span className="block">
                  🇩🇪🇨🇭 Schreiben Sie &quot;ich verstehe&quot;
                </span>
              </h2>

              <div>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  placeholder='Type "I understand" in any language'
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    error
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 focus:bg-white"
                  }`}
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {error}
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!inputText.trim()}
                className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  inputText.trim() && checkInput()
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Photos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
