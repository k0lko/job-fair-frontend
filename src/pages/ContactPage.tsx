// src/pages/ContactPage.tsx
import React from "react";

export const ContactPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-50 font-saira px-4 sm:px-6 lg:px-8 py-12">
      <section className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#830e21] mb-4">
          Kontakt
        </h1>
        <p className="text-gray-700 text-base sm:text-lg mb-6">
          Masz pytania? Chcesz zarezerwować stoisko albo porozmawiać z naszym zespołem – chętnie pomożemy.
        </p>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
            <div className="flex-shrink-0 mb-2 sm:mb-0">
              <span className="text-3xl text-[#830e21]">📍</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">Adres</h2>
              <p className="text-gray-700">
                Al. Prof. S. Kaliskiego 7<br />
                85-796 Bydgoszcz<br />
                Budynek A, pok. 021
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
            <div className="flex-shrink-0 mb-2 sm:mb-0">
              <span className="text-3xl text-[#830e21]">📞</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">Telefon</h2>
              <p className="text-gray-700">+48 52 374 92 74</p>
              <p className="text-gray-700">+48 512 006 671</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
            <div className="flex-shrink-0 mb-2 sm:mb-0">
              <span className="text-3xl text-[#830e21]">✉️</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">E-mail</h2>
              <p className="text-gray-700">targipracy@pbs.edu.pl</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
            <div className="flex-shrink-0 mb-2 sm:mb-0">
              <span className="text-3xl text-[#830e21]">🕒</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">Godziny pracy</h2>
              <p className="text-gray-700">Poniedziałek–Piątek: 9:00 – 14:00</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <iframe
            title="Mapa lokalizacji"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1dXXXXXX!2dXXXXXX!3dXXXXXX!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xXXXXXXXXXXXXX%3A0xXXXXXXXXXXXXX!2sPolitechnika%20Bydgoska!5e0!3m2!1spl!2spl!4vXXXXXXXXXXXX"
            className="w-full h-64 sm:h-80 rounded-lg border-0"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

      </section>
    </main>
  );
};
