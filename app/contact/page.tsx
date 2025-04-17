"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

function ContactPage() {
  const { translations } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">
        {translations?.contact?.title || "Let's Collaborate!"}
      </h1>

      <p className="text-lg mb-8">
        {translations?.contact?.intro ||
          "We're always looking to collaborate with members of the Swiss BJJ community! Whether you want to:"}
      </p>

      <ul className="list-disc list-inside mb-8 space-y-2">
        {translations?.contact?.bulletPoints ? (
          translations.contact.bulletPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))
        ) : (
          <>
            <li>Write blog posts about BJJ</li>
            <li>Share your podcast or start a new one</li>
            <li>
              Help build a directory of women brown & black belts in Switzerland
            </li>
            <li>List yourself as a private BJJ coach</li>
            <li>Suggest other ideas to grow the community</li>
          </>
        )}
      </ul>

      <p className="mb-8">
        {translations?.contact?.formIntro ||
          "We'd love to hear from you! Please fill out the form below and we'll get back to you soon."}
      </p>

      <p className="mb-8">
        For now, please email us at{" "}
        <a
          href="mailto:swissbjj.ch@gmail.com"
          className="text-red-500 underline"
        >
          swissbjj.ch@gmail.com
        </a>
        <br></br>
        <br></br>
        <span className="text-blue-500">
          * You can also share info and resources what you read and watch about
          BJJ with others to help other to grow the community
        </span>
      </p>

      <form
        action={`https://formsubmit.co/swissbjj.ch@gmail.com`}
        method="POST"
        className="space-y-6 opacity-50 pointer-events-none"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            {translations?.contact?.nameLabel || "Name"}
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            {translations?.contact?.emailLabel || "Email"}
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700"
          >
            {translations?.contact?.subjectLabel || "Subject"}
          </label>
          <input
            type="text"
            name="subject"
            id="subject"
            required
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            {translations?.contact?.messageLabel || "Message"}
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            required
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {translations?.contact?.submitButton || "Send Message"}
        </button>
      </form>
    </div>
  );
}

export default ContactPage;
