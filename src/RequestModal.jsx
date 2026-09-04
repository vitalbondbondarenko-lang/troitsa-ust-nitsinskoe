import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Church,
  CreditCard,
  Landmark,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { SERVICES } from "./siteData.js";

export function RequestModal({ open, onClose, initialService = "moleben" }) {
  const [step, setStep] = useState(1);
  const [service, setService] = useState(initialService);
  const [commemoration, setCommemoration] = useState(initialService === "pannikhida" ? "repose" : "health");
  const [names, setNames] = useState([""]);
  const [note, setNote] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [donation, setDonation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [baptized, setBaptized] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setService(initialService);
    setCommemoration(initialService === "pannikhida" ? "repose" : "health");
    setStep(1);
    setNames([""]);
    setNote("");
    setContactName("");
    setPhone("");
    setEmail("");
    setDonation("");
    setBaptized(false);
    setConsent(false);
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
  const availableServices = useMemo(
    () => SERVICES.filter((item) => commemoration === "health" ? item.id !== "pannikhida" : item.id !== "moleben"),
    [commemoration],
  );
  const filledNames = names.map((name) => name.trim()).filter(Boolean);

  if (!open) return null;

  const goToPayment = (event) => {
    event.preventDefault();
    if (!filledNames.length || !contactName.trim() || !phone.trim() || !baptized || !consent) return;
    setStep(3);
  };

  const chooseCommemoration = (value) => {
    setCommemoration(value);
    if (value === "repose" && service === "moleben") setService("note");
    if (value === "health" && service === "pannikhida") setService("note");
  };

  const updateName = (index, value) => {
    setNames((current) => current.map((name, nameIndex) => nameIndex === index ? value : name));
  };

  const addName = () => {
    setNames((current) => current.length < 12 ? [...current, ""] : current);
  };

  const removeName = (index) => {
    setNames((current) => current.length === 1 ? [""] : current.filter((_, nameIndex) => nameIndex !== index));
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
            <p className="eyebrow">Шаг 1 из 3</p>
            <h2 id="request-title">Выберите поминовение</h2>
            <p className="modal-intro">Сначала укажите, за кого подаётся записка, затем выберите доступный вид поминовения.</p>
            <div className="commemoration-toggle" role="group" aria-label="О здравии или об упокоении">
              <button type="button" className={commemoration === "health" ? "is-selected" : ""} onClick={() => chooseCommemoration("health")}><strong>О здравии</strong><small>За живых</small></button>
              <button type="button" className={commemoration === "repose" ? "is-selected" : ""} onClick={() => chooseCommemoration("repose")}><strong>Об упокоении</strong><small>За усопших</small></button>
            </div>
            <div className="service-picker">
              {availableServices.map((item) => (
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
            <p className="form-note">Разовые поминовения — рабочий вариант для согласования. Сорокоуст и Неусыпаемая Псалтирь в перечень прихода не включены.</p>
          </div>
        )}

        {step === 2 && (
          <form className="modal-step" onSubmit={goToPayment}>
            <button className="back-link" type="button" onClick={() => setStep(1)}>
              <ArrowLeft size={16} /> Изменить услугу
            </button>
            <p className="eyebrow">{commemoration === "health" ? "О здравии" : "Об упокоении"} · {selectedService.title}</p>
            <h2 id="request-title">Имена и контакты</h2>

            <fieldset className="names-fieldset">
              <legend>Имена для поминовения</legend>
              <p>Укажите полные имена, данные в Крещении. Не более 12 имён в одной записке.</p>
              <div className="name-list">
                {names.map((name, index) => (
                  <div className="name-row" key={index}>
                    <span>{index + 1}</span>
                    <label><span className="sr-only">Имя {index + 1}</span><input value={name} onChange={(event) => updateName(index, event.target.value)} placeholder="Имя в Крещении" required={index === 0} /></label>
                    <button type="button" onClick={() => removeName(index)} aria-label={`Удалить имя ${index + 1}`}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              <button className="add-name" type="button" onClick={addName} disabled={names.length >= 12}><Plus size={16} /> Добавить имя <span>{names.length}/12</span></button>
            </fieldset>

            <details className="name-rules"><summary>Как правильно написать имена</summary><ul><li>Пишите церковные имена полностью, без фамилий и отчеств.</li><li>Священнослужителей указывают первыми, перед именем пишут сан.</li><li>Форма принимает записки за крещёных православных христиан.</li><li>Правило о падеже имён будет окончательно указано после согласования с настоятелем.</li></ul></details>

            <label className="field">
              <span>Пожелание или уточнение</span>
              <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Необязательно" rows={2} />
            </label>

            <div className="field-row">
              <label className="field">
                <span>Ваше имя</span>
                <input value={contactName} onChange={(event) => setContactName(event.target.value)} placeholder="Как к вам обращаться" required />
              </label>
              <label className="field">
                <span>Телефон</span>
                <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+7 900 000-00-00" required />
              </label>
            </div>
            <div className="field-row field-row--single">
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
              <input type="checkbox" checked={baptized} onChange={(event) => setBaptized(event.target.checked)} required />
              <span>Подтверждаю, что указанные имена даны в Крещении</span>
            </label>
            <label className="consent">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
              <span>Согласен на обработку данных для передачи просьбы приходу</span>
            </label>

            <button className="button button--gold button--full" type="submit" disabled={!filledNames.length || !contactName.trim() || !phone.trim() || !baptized || !consent}>
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
              <div><span>Поминовение</span><strong>{commemoration === "health" ? "О здравии" : "Об упокоении"}</strong></div>
              <div><span>Треба</span><strong>{selectedService.title}</strong></div>
              <div><span>Имена</span><strong>{filledNames.length}</strong></div>
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
            <h2 id="request-title">Заявка показана, но не отправлена</h2>
            <p>В рабочей версии ответственный сотрудник прихода подтвердит получение записки и сообщит о её передаче на ближайшее богослужение. После подключения эквайринга также появится электронный чек.</p>
            <button className="button button--navy button--full" type="button" onClick={onClose}>Вернуться на сайт</button>
          </div>
        )}
      </section>
    </div>
  );
}
