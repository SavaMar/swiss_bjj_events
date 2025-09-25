"use client";

import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Mail, Users, Lightbulb, Heart, Send } from "lucide-react";

function ContactPage() {
  const { translations } = useLanguage();
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const validateForm = (formData: FormData) => {
    const errors: { [key: string]: string } = {};
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || name.length < 3) {
      errors.name =
        translations?.contact?.validation?.nameTooShort ||
        "Name must be at least 3 characters long";
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email =
        translations?.contact?.validation?.invalidEmail ||
        "Please enter a valid email address";
    }

    if (!message || message.length < 30) {
      errors.message =
        translations?.contact?.validation?.messageTooShort ||
        "Message must be at least 30 characters long";
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // If validation passes, submit the form
    e.currentTarget.submit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {translations?.contact?.title || "Let's Collaborate!"}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {translations?.contact?.intro ||
              "We're always looking to collaborate with members of the Swiss BJJ community! Whether you want to:"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Collaboration Opportunities */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Users className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Collaboration Opportunities
                </h2>
              </div>

              <div className="space-y-4">
                {translations?.contact?.bulletPoints ? (
                  translations.contact.bulletPoints.map(
                    (point: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <Heart className="w-3 h-3 text-blue-600" />
                        </div>
                        <p className="text-gray-700">{point}</p>
                      </div>
                    )
                  )
                ) : (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <Heart className="w-3 h-3 text-blue-600" />
                      </div>
                      <p className="text-gray-700">
                        Write blog posts about BJJ
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <Heart className="w-3 h-3 text-blue-600" />
                      </div>
                      <p className="text-gray-700">
                        Share your podcast or start a new one
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <Heart className="w-3 h-3 text-blue-600" />
                      </div>
                      <p className="text-gray-700">
                        Help build a directory of women brown & black belts in
                        Switzerland
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <Heart className="w-3 h-3 text-blue-600" />
                      </div>
                      <p className="text-gray-700">
                        List yourself as a private BJJ coach
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <Lightbulb className="w-3 h-3 text-yellow-600" />
                      </div>
                      <p className="text-gray-700">
                        Suggest other ideas to grow the community
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Send className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Get In Touch
              </h2>
            </div>

            <p className="text-gray-600 mb-8">
              {translations?.contact?.formIntro ||
                "We'd love to hear from you! Please fill out the form below and we'll get back to you soon."}
            </p>

            <form
              action={`https://formsubmit.co/swissbjj.ch@gmail.com`}
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {translations?.contact?.nameLabel || "Name"}
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  minLength={3}
                  placeholder="Your full name"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.name
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 focus:bg-white"
                  }`}
                />
                {validationErrors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-4 h-4 mr-1">⚠️</span>
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {translations?.contact?.emailLabel || "Email"}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 focus:bg-white"
                  }`}
                />
                {validationErrors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-4 h-4 mr-1">⚠️</span>
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {translations?.contact?.messageLabel || "Message"}
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={5}
                  required
                  minLength={30}
                  placeholder="Tell us about your collaboration idea or how you'd like to contribute to the Swiss BJJ community..."
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                    validationErrors.message
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 focus:bg-white"
                  }`}
                />
                {validationErrors.message && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-4 h-4 mr-1">⚠️</span>
                    {validationErrors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                <div className="flex items-center justify-center">
                  <Send className="w-5 h-5 mr-2" />
                  {translations?.contact?.submitButton || "Send Message"}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
