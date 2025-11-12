import React, { useState } from 'react';
import type { Booth, ReservationFormData } from '../types';
import { useBoothStore } from '../store/boothStore';
import { AlertCircle } from 'lucide-react';

export const ReservationModal: React.FC<{
  booth: Booth;
  onClose: () => void;
  onSubmit: (data: ReservationFormData) => void;
}> = ({ booth, onClose, onSubmit }) => {
  const { services } = useBoothStore();

  const [formData, setFormData] = useState<ReservationFormData>({
    companyName: '',
    industry: '',
    website: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    invoiceAddress: {
      companyName: '',
      street: '',
      postalCode: '',
      city: '',
      country: '',
      nip: '',
    },
    services: [],
    agreedToTerms: false,
    agreedToParticipation: false,
    agreedToConditions: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const safeInvoice = formData.invoiceAddress ?? {
    companyName: '',
    address: '',
    nip: '',
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim())
      newErrors.companyName = 'Nazwa firmy jest wymagana';
    if (!formData.contactName.trim())
      newErrors.contactName = 'Imię i nazwisko są wymagane';
    if (!formData.contactEmail.trim())
      newErrors.contactEmail = 'Email jest wymagany';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail))
      newErrors.contactEmail = 'Niepoprawny adres email';
    if (!formData.contactPhone.trim())
      newErrors.contactPhone = 'Numer telefonu jest wymagany';

    if (!safeInvoice.companyName!.trim())
      newErrors.invoiceCompanyName = 'Nazwa firmy na fakturze jest wymagana';
    if (!safeInvoice.street!.trim())
      newErrors.invoiceStreet = 'Adres na fakturze jest wymagany';
    if (!safeInvoice.nip!.trim())
      newErrors.invoiceNip = 'NIP jest wymagany';

    if (
      !formData.agreedToTerms ||
      !formData.agreedToParticipation ||
      !formData.agreedToConditions
    ) {
      newErrors.agreements = 'Musisz zaakceptować wszystkie zgody';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof ReservationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInvoiceChange = (
    field: keyof ReservationFormData['invoiceAddress'],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      invoiceAddress: { ...prev.invoiceAddress, [field]: value },
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const calculateTotal = () => {
    const servicesTotal = formData.services.reduce((total, id) => {
      const service = services.find((s) => s.id === id);
      return total + (service?.price || 0);
    }, 0);
    return booth.price + servicesTotal;
  };

  const getBoothSizeLabel = (size: Booth['size']) => {
    switch (size) {
      case '2x1':
        return 'Typ B (2x1m) – 1600 zł + 23% VAT';
      case '1x1':
      default:
        return 'Typ A (1x1m) – 1300 zł + 23% VAT';
    }
  };

  const FieldWrapper = ({
    children,
    error,
  }: {
    children: React.ReactNode;
    error?: string;
  }) => (
    <div className="relative w-full">
      {children}
      {error && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center text-red-600 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span className="bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
            {error}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2 sm:px-4 font-[Saira]">
      <div
        className="bg-white rounded-xl w-full max-w-4xl shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-[#830e21] scrollbar-track-gray-200"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#830e21 #e5e7eb',
          maxHeight: '90vh',
        }}
      >
        {/* Nagłówek */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#830e21]">
              Rezerwacja Stoiska {booth.number}
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {getBoothSizeLabel(booth.size)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#830e21] transition-colors text-2xl sm:text-3xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {/* Dane firmy */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Dane Firmy
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="Nazwa firmy *"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="border rounded-md px-3 py-2 w-full text-sm sm:text-base"
              />
              <input
                type="text"
                placeholder="Branża"
                value={formData.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                className="border rounded-md px-3 py-2 w-full text-sm sm:text-base"
              />
              <input
                type="url"
                placeholder="Strona WWW"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="border rounded-md px-3 py-2 w-full sm:col-span-2 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Dane kontaktowe */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#830e21] mb-3">
              Dane Kontaktowe
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { key: 'contactName', placeholder: 'Imię i nazwisko *' },
                { key: 'contactEmail', placeholder: 'E-mail *' },
                { key: 'contactPhone', placeholder: 'Telefon *' },
              ].map(({ key, placeholder }) => (
                <FieldWrapper key={key} error={errors[key]}>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={formData[key as keyof ReservationFormData] as string}
                    onChange={(e) =>
                      handleChange(key as keyof ReservationFormData, e.target.value)
                    }
                    className="border rounded-md px-3 py-2 w-full text-sm sm:text-base border-gray-300"
                  />
                </FieldWrapper>
              ))}
            </div>
          </div>

          {/* Dane do Faktury */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Dane do Faktury
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { key: 'companyName', label: 'Nazwa firmy *' },
                { key: 'nip', label: 'NIP *' },
                { key: 'street', label: 'Ulica i numer *' },
                { key: 'postalCode', label: 'Kod pocztowy *' },
                { key: 'city', label: 'Miasto *' },
                { key: 'country', label: 'Kraj' },
              ].map(({ key, label }) => (
                <input
                  key={key}
                  type="text"
                  placeholder={label}
                  value={formData.invoiceAddress[key as keyof typeof formData.invoiceAddress] ?? ''}
                  onChange={(e) =>
                    handleInvoiceChange(
                      key as keyof ReservationFormData['invoiceAddress'],
                      e.target.value
                    )
                  }
                  className="border rounded-md px-3 py-2 w-full text-sm sm:text-base"
                />
              ))}
            </div>
          </div>

          {/* Dodatkowe Usługi */}
          {services.length > 0 && (
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Dodatkowe Usługi
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded text-sm sm:text-base"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        className="accent-[#830e21]"
                      />
                      <span className="font-medium text-gray-800">{service.name}</span>
                    </div>
                    <span className="text-gray-600">
                      {service.description} —{' '}
                      <span className="text-[#830e21] font-semibold">
                        {service.price} zł
                      </span>{' '}
                      + {service.vat}% VAT
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Zgody */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#830e21] mb-3 sm:mb-4">
              Zgody
            </h3>
            <div className="space-y-2 text-sm sm:text-base">
              {[
                { key: 'agreedToTerms', label: 'Akceptuję warunki uczestnictwa' },
                { key: 'agreedToParticipation', label: 'Zobowiązuję się do udziału w targach' },
                { key: 'agreedToConditions', label: 'Zapoznałem/am się z polityką danych' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={formData[key as keyof ReservationFormData] as boolean}
                    onChange={(e) =>
                      handleChange(key as keyof ReservationFormData, e.target.checked)
                    }
                    className="mt-1 accent-[#830e21]"
                  />
                  <span>{label}</span>
                </label>
              ))}
              {errors.agreements && (
                <p className="text-red-600 text-sm mt-2">{errors.agreements}</p>
              )}
            </div>
          </div>

          {/* Cena */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
            <div className="flex justify-between font-medium">
              <span>Stoisko {booth.number}</span>
              <span>{booth.price} zł</span>
            </div>
            <div className="flex justify-between font-bold text-[#830e21] mt-2">
              <span>Łącznie</span>
              <span>{calculateTotal()} zł</span>
            </div>
          </div>

          {/* Przyciski */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm sm:text-base"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-[#830e21] text-white rounded-md hover:bg-red-800 transition-colors text-sm sm:text-base"
            >
              Złóż Rezerwację
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
