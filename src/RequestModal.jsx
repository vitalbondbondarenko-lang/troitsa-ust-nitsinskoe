import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Church,
  CreditCard,
  Landmark,
  ShieldCheck,
  X,
} from "lucide-react";
import { SERVICES } from "./siteData.js";

export function RequestModal({ open, onClose, initialService = "moleben" }) {
  const [step, setStep] = useState(1);
  const [service, setService] = useState(initialService);
  const [names, setNames] = useState("");
  const [note, setNote] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [donation, setDonation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setService(initialService);
    setStep(1);
    setSubmitting(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...(dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])',
      ) || [])].filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => closeButtonRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, initialService, onClose]);

  const selectedService = useMemo(
    () => SERVICES.find((item) => item.id === service) || SERVICES[0],
    [service],
  );

  if (!open) return null;

  const goToPayment = (event) => {
    event.preventDefault();
    if (!names.trim() || !phone.trim() || !consent) return;
    setStep(3);
  };

  const finishDemoPayment = () => {
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setStep(4);
    }, 650);
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="request-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close icon-button" type="button" onClick={onClose} ref={closeButtonRef} aria-label="Закрыть">
          <X size={22} />
        </button>

        <div className="modal-brand" aria-hidden="true">
          <Church size={25} strokeWidth={1.35} />
        </div>

        {step < 4 && (
          <div className="stepper" aria-label={`Шаг ${step} из 3`}>
            {[1, 2, 3].map((item) => <span key={item} className={item <= step ? "is-active" : ""} />)}
          </div>
        )}

        {step === 1 && (
          <div className="modal-step">
            <p className="eyebrow">Онлайн-просьба</p>
            <h2 id="request-title">Что вы хотите заказать?</h2>
            <p className="modal-intro">Выберите вид церковного поминовения. Детали можно уточнить на следующем шаге.</p>
            <div className="service-picker">
              {SERVICES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`service-option ${service === item.id ? "is-selected" : ""}`}
                  onClick={() => setService(item.id)}
                >
                  <span className="service-option__check">{service === item.id && <Check size={15} />}</span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>
                </button>
              ))}
            </div>
            <button className="button button--gold button--full" type="button" onClick={() => setStep(2)}>
              Продолжить <ArrowRight size={18} />
            </button>
            <p className="form-note">Демонстрация интерфейса. Перечень треб и условия должен утвердить приход.</p>
          </div>
        )}

        {step === 2 && (
          <form className="modal-step" onSubmit={goToPayment}>
            <button className="back-link" type="button" onClick={() => setStep(1)}>
              <ArrowLeft size={16} /> Изменить услугу
            </button>
            <p className="eyebrow">{selectedService.title}</p>
            <h2 id="request-title">Имена и контакты</h2>

            <label className="field">
              <span>Имена для поминовения</span>
              <textarea
                value={names}
                onChange={(event) => setNames(event.target.value)}
                placeholder="Например: Александра, Марии, Николая"
                rows={3}
                required
              />
              <small>Укажите крещёные имена, каждое с новой строки.</small>
            </label>

            <label className="field">
              <span>Пожелание или уточнение</span>
              <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Необязательно" rows={2} />
            </label>

            <div className="field-row">
              <label className="field">
                <span>Телефон</span>
                <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+7 900 000-00-00" required />
              </label>
              <label className="field">
                <span>Электронная почта</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="mail@example.ru" />
              </label>
            </div>

            <label className="field">
              <span>Добровольное пожертвование, ₽</span>
              <input
                inputMode="numeric"
                value={donation}
                onChange={(event) => setDonation(event.target.value.replace(/\D/g, ""))}
                placeholder="Сумма по желанию"
              />
            </label>

            <label className="consent">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
              <span>Согласен на обработку данных для передачи просьбы приходу</span>
            </label>

            <button className="button button--gold button--full" type="submit" disabled={!names.trim() || !phone.trim() || !consent}>
              Перейти к оплате <ArrowRight size={18} />
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="modal-step">
            <button className="back-link" type="button" onClick={() => setStep(2)}>
              <ArrowLeft size={16} /> Вернуться к данным
            </button>
            <p className="eyebrow">Проверка и оплата</p>
            <h2 id="request-title">Всё ли верно?</h2>

            <div className="order-summary">
              <div><span>Треба</span><strong>{selectedService.title}</strong></div>
              <div><span>Имена</span><strong>{names.split("\n").filter(Boolean).length || 1}</strong></div>
              <div><span>Пожертвование</span><strong>{donation ? `${donation} ₽` : "Без суммы"}</strong></div>
            </div>

            <fieldset className="payment-methods">
              <legend>Способ оплаты</legend>
              <button type="button" className={paymentMethod === "card" ? "is-selected" : ""} onClick={() => setPaymentMethod("card")}>
                <CreditCard size={20} /> Банковская карта
              </button>
              <button type="button" className={paymentMethod === "sbp" ? "is-selected" : ""} onClick={() => setPaymentMethod("sbp")}>
                <Landmark size={20} /> СБП
              </button>
            </fieldset>

            <div className="demo-notice">
              <ShieldCheck size={22} />
              <p><strong>Демонстрационный режим</strong><span>Платёжный шлюз ещё не подключён — средства не списываются.</span></p>
            </div>

            <button className="button button--gold button--full" type="button" onClick={finishDemoPayment} disabled={submitting}>
              {submitting ? "Формируем заявку…" : donation ? `Оплатить ${donation} ₽` : "Отправить без пожертвования"}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="modal-step modal-step--success">
            <CheckCircle2 size={58} strokeWidth={1.25} />
            <p className="eyebrow">Демонстрация завершена</p>
            <h2 id="request-title">Заявка сформирована</h2>
            <p>В рабочей версии здесь появится подтверждение заказа и электронный чек после подключения эквайринга и реквизитов прихода.</p>
            <button className="button button--navy button--full" type="button" onClick={onClose}>Вернуться на сайт</button>
          </div>
        )}
      </section>
    </div>
  );
}
