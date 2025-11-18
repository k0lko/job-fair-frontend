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

        <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2393.1578661766393!2d18.12818757697261!3d53.14326128989919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470313b103a9ea1d%3A0x2a29c87a5d2749d5!2sPolitechnika%20Bydgoska%20im.%20Jana%20i%20J%C4%99drzeja%20%C5%9Aniadeckich!5e0!3m2!1spl!2spl!4v1763081699489!5m2!1spl!2spl"
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </section>
    </main>
  );
};
