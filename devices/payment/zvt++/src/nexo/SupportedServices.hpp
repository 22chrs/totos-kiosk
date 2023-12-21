//
// Created by André Heine on 09.09.22.
//

#ifndef ZVT_SUPPORTEDSERVICES_HPP
#define ZVT_SUPPORTEDSERVICES_HPP

#include <bitset>

namespace Nexo
{
/**
 * Byte    b8  b7  b6  b5  b4  b3  b2  b1  Meaning
 * 1       1   -   -   -   -   -   -   -   Payment Service
 *         -   1   -   -   -   -   -   -   Refund Service
 *         -   -   1   -   -   -   -   -   Cancellation Service
 *         -   -   -   1   -   -   -   -   Pre-Authorisation Service
 *         -   -   -   -   1   -   -   -   Update Pre-Authorisation Service
 *         -   -   -   -   -   1   -   -   Payment Completion Service
 *         -   -   -   -   -   -   1   -   Cash Advance Service
 *         -   -   -   -   -   -   -   1   Deferred Payment Service
 *
 * 2       1   -   -   -   -   -   -   -   Deferred Payment Completion
 *         -   1   -   -   -   -   -   -   Cardholder Detection
 *         -   -   1   -   -   -   -   -   Card Validity Check
 *         -   -   -   1   -   -   -   -   No-Show
 *         -   -   -   -   1   -   -   -   Voice Authorisation
 *         -   -   -   -   -   1   -   -   Original Credit
 *         -   -   -   -   -   -   1   -   Quasi Cash
 *         -   -   -   -   -   -   -   1   Instalment Payment Service
 */
typedef enum
{
    PaymentService = 15,
    RefundService = 14,
    CancellationService = 13,
    PreAuthorisationService = 12,
    UpdatePreAuthorisationService = 11,
    PaymentCompletionService = 10,
    CashAdvanceService = 9,
    DeferredPaymentService = 8,
    DeferredPaymentCompletion = 7,
    CardholderDetection = 6,
    CardValidityCheck = 5,
    NoShow = 4,
    VoiceAuthorisation = 3,
    OriginalCredit = 2,
    QuasiCash = 1,
    InstalmentPaymentService = 0,
} Service;

class SupportedServices
{
private:
    std::bitset<16> _services;

public:
    SupportedServices();
    SupportedServices(unsigned char byte1, unsigned char byte2);
    void bytes(unsigned char byte1, unsigned char byte2);
    std::bitset<8> byte1() const;
    std::bitset<8> byte2() const;
    const std::bitset<16> &services() const;
    void services(const std::bitset<16> &services);

    inline bool paymentService()
    { return _services.test(PaymentService); }

    inline bool refund()
    { return _services.test(RefundService); }

    inline bool cancellation()
    { return _services.test(CancellationService); }

    inline bool preAuthorisation()
    { return _services.test(PreAuthorisationService); }

    inline bool updatePreAuthorisation()
    { return _services.test(UpdatePreAuthorisationService); }

    inline bool paymentCompletion()
    { return _services.test(PaymentCompletionService); }

    inline bool cashAdvance()
    { return _services.test(CashAdvanceService); }

    inline bool deferredPayment()
    { return _services.test(DeferredPaymentService); }

    inline bool deferredPaymentCompletion()
    { return _services.test(DeferredPaymentCompletion); }

    inline bool cardholderDetection()
    { return _services.test(CardholderDetection); }

    inline bool cardValidityCheck()
    { return _services.test(CardValidityCheck); }

    inline bool noShow()
    { return _services.test(NoShow); }

    inline bool voiceAuthorisation()
    { return _services.test(VoiceAuthorisation); }

    inline bool originalCredit()
    { return _services.test(OriginalCredit); }

    inline bool quasiCash()
    { return _services.test(QuasiCash); }

    inline bool instalmentPayment()
    { return _services.test(InstalmentPaymentService); }

    inline void paymentService(bool active)
    { _services.set(PaymentService, active); }

    inline void refund(bool active)
    { _services.set(RefundService, active); }

    inline void cancellation(bool active)
    { _services.set(CancellationService, active); }

    inline void preAuthorisation(bool active)
    { _services.set(PreAuthorisationService, active); }

    inline void updatePreAuthorisation(bool active)
    { _services.set(UpdatePreAuthorisationService, active); }

    inline void paymentCompletion(bool active)
    { _services.set(PaymentCompletionService, active); }

    inline void cashAdvance(bool active)
    { _services.set(CashAdvanceService, active); }

    inline void deferredPayment(bool active)
    { _services.set(DeferredPaymentService, active); }

    inline void deferredPaymentCompletion(bool active)
    { _services.set(DeferredPaymentCompletion, active); }

    inline void cardholderDetection(bool active)
    { _services.set(CardholderDetection, active); }

    inline void cardValidityCheck(bool active)
    { _services.set(CardValidityCheck, active); }

    inline void noShow(bool active)
    { _services.set(NoShow, active); }

    inline void voiceAuthorisation(bool active)
    { _services.set(VoiceAuthorisation, active); }

    inline void originalCredit(bool active)
    { _services.set(OriginalCredit, active); }

    inline void quasiCash(bool active)
    { _services.set(QuasiCash, active); }

    inline void instalmentPayment(bool active)
    { _services.set(InstalmentPaymentService, active); }

    inline void set(Service service)
    { _services.set(service); }

    inline bool is(Service service)
    { return _services.test(service); }

};

}

#endif //ZVT_SUPPORTEDSERVICES_HPP
