import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Church,
  Clock3,
  CreditCard,
  Cross,
  HeartHandshake,
  Landmark,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";

const SERVICES = [
  {
    id: "moleben",
    title: "Молебен",
    description: "Прошение о здравии, помощи и благополучии близких.",
  },
  {
    id: "note",
    title: "Церковная записка",
    description: "Имена для молитвенного поминовения о здравии или упокоении.",
  },
  {
    id: "pannikhida",
    title: "Панихида",
    description: "Заупокойное богослужение и молитва об усопших.",
  },
  {
    id: "other",
    title: "Другое прошение",
    description: "Опишите просьбу — приход свяжется с вами для уточнения.",
  },
];

const formatToday = () => {
  const now = new Date();
  const dayAndMonth = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(now);
  return `${dayAndMonth} ${now.getFullYear()} года`;
};

function Ornament({ compact = false }) {
  return (
    <span className={`ornament ${compact ? "ornament--compact" : ""}`} aria-hidden="true">
      <span />
      <Cross size={compact ? 13 : 17} strokeWidth={1.4} />
      <span />
    </span>
  );
}

function SectionHeading({ eyebrow, title, children, align = "left" }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      <Ornament />
      {children && <p className="section-lead">{children}</p>}
    </div>
  );
}

function RequestModal({ open, onClose, initialService = "moleben" }) {
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
      if (event.key === "Tab") {
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
            {[1, 2, 3].map((item) => (
              <span key={item} className={item <= step ? "is-active" : ""} />
            ))}
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
            <p className="form-note">Перечень треб и условия совершения необходимо согласовать с приходом перед публикацией сайта.</p>
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
              <small>Укажите крещёные имена в родительном падеже, каждое с новой строки.</small>
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

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialService, setInitialService] = useState("moleben");

  const openRequest = (service = "moleben") => {
    setInitialService(service);
    setModalOpen(true);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Храм Святой Троицы — на главную">
          <span className="brand__mark"><Church size={43} strokeWidth={1.2} /></span>
          <span className="brand__copy">
            <strong>Храм Святой Троицы</strong>
            <small>село Усть-Ницинское</small>
          </span>
        </a>

        <nav className={`desktop-nav ${menuOpen ? "is-open" : ""}`} aria-label="Основная навигация">
          <a className="is-active" href="#top" onClick={closeMenu}>Главная</a>
          <a href="#about" onClick={closeMenu}>О храме</a>
          <a href="#history" onClick={closeMenu}>Летопись</a>
          <a href="#schedule" onClick={closeMenu}>Расписание</a>
          <button type="button" onClick={() => { closeMenu(); openRequest("note"); }}>Подать записку</button>
          <a href="#contacts" onClick={closeMenu}>Контакты</a>
        </nav>

        <div className="header-date">
          <time dateTime={new Date().toISOString().slice(0, 10)}>{formatToday()}</time>
          <Cross size={23} strokeWidth={1.25} aria-hidden="true" />
        </div>

        <button className="menu-toggle icon-button" type="button" aria-expanded={menuOpen} aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-photo" aria-hidden="true">
            <img src="/assets/ust-nitsinskoe-church.jpg" alt="" />
            <span className="hero-photo__wash" />
          </div>
          <div className="hero-card ornamental-frame">
            <Cross className="hero-cross" size={35} strokeWidth={1.2} aria-hidden="true" />
            <h1 id="hero-title">Храм Святой<br />Троицы</h1>
            <p>село Усть-Ницинское</p>
            <Ornament />
            <div className="hero-actions">
              <button className="button button--gold" type="button" onClick={() => openRequest("moleben")}>Заказать молебен</button>
              <a className="button button--outline" href="#schedule">Узнать расписание</a>
            </div>
          </div>
          <a className="hero-caption" href="#about">
            <span>Храм XVIII века</span>
            <small>Листайте, чтобы узнать историю</small>
            <ArrowRight size={16} />
          </a>
        </section>

        <section className="intro-grid section-wrap" id="about">
          <article className="intro-card ornamental-frame">
            <SectionHeading title="О храме" />
            <p className="intro-date">Храм построен в 1773–1779 годах</p>
            <p>
              Каменный двухэтажный храм во имя Святой Живоначальной Троицы возведён на пожертвования прихожан. Тёплая зимняя часть освящена в честь Успения Божией Матери, а главный летний престол — в честь Святой Троицы.
            </p>
            <a className="text-link" href="#history">Читать летопись <ArrowRight size={16} /></a>
          </article>

          <article className="rector-card ornamental-frame">
            <div className="rector-copy">
              <SectionHeading title="Настоятель" />
              <p className="rector-name">Митрофорный протоиерей<br /><strong>Фёдор Герасимов</strong></p>
              <p className="rector-summary">Священник Русской Православной Церкви. Диаконская хиротония — 1985 год, иерейская — 1986 год.</p>
              <button className="button button--navy" type="button" onClick={() => openRequest("note")}>Подать записку</button>
            </div>
            <figure className="rector-photo">
              <img src="/assets/fedor-gerasimov.jpg" alt="Митрофорный протоиерей Фёдор Герасимов" />
              <figcaption>Официальное фото Алапаевской епархии</figcaption>
            </figure>
          </article>
        </section>

        <div className="location-strip">
          <div className="section-wrap location-strip__inner">
            <span><Cross size={24} strokeWidth={1.15} aria-hidden="true" /></span>
            <a href="#contacts"><MapPin size={17} /> ул. Подгорная, 7, село Усть-Ницинское</a>
            <span className="location-strip__divider" aria-hidden="true" />
            <span>Храм открыт для всех желающих</span>
            <span className="location-strip__copyright">© Храм Святой Троицы, село Усть-Ницинское</span>
          </div>
        </div>

        <section className="services-section" id="services">
          <div className="section-wrap">
            <SectionHeading eyebrow="Поминовение онлайн" title="Передать просьбу в храм" align="center">
              Заполните имена и контакты. В рабочей версии пожертвование можно будет внести банковской картой или через СБП.
            </SectionHeading>
            <div className="service-grid">
              {SERVICES.slice(0, 3).map((item, index) => (
                <article className="service-card" key={item.id}>
                  <span className="service-number">0{index + 1}</span>
                  {index === 0 && <Cross size={25} strokeWidth={1.25} />}
                  {index === 1 && <HeartHandshake size={25} strokeWidth={1.25} />}
                  {index === 2 && <Church size={25} strokeWidth={1.25} />}
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <button type="button" className="text-link" onClick={() => openRequest(item.id)}>Оформить <ArrowRight size={16} /></button>
                </article>
              ))}
            </div>
            <div className="services-notice">
              <ShieldCheck size={20} />
              <span>Сейчас открыт демонстрационный сценарий. Перечень услуг, порядок принятия треб и платёжные реквизиты должен утвердить приход.</span>
            </div>
          </div>
        </section>

        <section className="history-section section-wrap" id="history">
          <div className="history-copy">
            <SectionHeading eyebrow="Летопись прихода" title="Храм на дороге к Ирбитской ярмарке">
              Западная арочная часть здания когда-то служила приютом для путников. Сегодня храм вновь открыт для молитвы и богослужений.
            </SectionHeading>
            <div className="timeline">
              <div><strong>1773–1779</strong><span>Строительство каменного двухэтажного храма на пожертвования прихожан.</span></div>
              <div><strong>1990-е</strong><span>Храм возвращён верующим в 1996 году; в десятилетии началось его восстановление.</span></div>
              <div><strong>2001</strong><span>Организована приходская община, богослужения стали совершаться регулярно.</span></div>
            </div>
          </div>
          <aside className="history-quote ornamental-frame">
            <Cross size={29} strokeWidth={1.2} aria-hidden="true" />
            <blockquote>«Берегём наследие предков и передаём его следующим поколениям»</blockquote>
            <p>История храма продолжается молитвой, заботой прихожан и общей памятью села.</p>
          </aside>
        </section>

        <section className="shrine-section">
          <div className="section-wrap shrine-grid">
            <div className="shrine-icon" aria-hidden="true"><Cross size={49} strokeWidth={1} /></div>
            <div>
              <p className="eyebrow">Почитаемые образы</p>
              <h2>Икона Божией Матери «Венецкая»</h2>
              <p>Публикации об уральских святынях связывают этот почитаемый образ со Свято-Троицким храмом в Усть-Ницинском. История иконы и сведения о её нынешнем нахождении уточняются у прихода перед публикацией полной страницы.</p>
            </div>
            <div className="editorial-note">
              <strong>Материал на согласовании</strong>
              <span>Перед размещением рассказа об иконе нужны подтверждение настоятеля и разрешённая фотография.</span>
            </div>
          </div>
        </section>

        <section className="visit-section section-wrap" id="schedule">
          <div className="schedule-card">
            <SectionHeading eyebrow="Богослужения" title="Расписание служб" />
            <div className="schedule-status">
              <CalendarDays size={27} strokeWidth={1.25} />
              <p><strong>Актуальное расписание уточняется</strong><span>Богослужения совершаются регулярно. Перед поездкой позвоните в приход.</span></p>
            </div>
            <a className="button button--gold" href="tel:+79126516432"><Phone size={17} /> Позвонить и уточнить</a>
          </div>

          <div className="contacts-card" id="contacts">
            <SectionHeading eyebrow="Как добраться" title="Контакты прихода" />
            <address>
              <a href="https://yandex.ru/maps/?text=%D0%A1%D0%B2%D0%B5%D1%80%D0%B4%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2C%20%D1%81.%20%D0%A3%D1%81%D1%82%D1%8C-%D0%9D%D0%B8%D1%86%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B5%2C%20%D1%83%D0%BB.%20%D0%9F%D0%BE%D0%B4%D0%B3%D0%BE%D1%80%D0%BD%D0%B0%D1%8F%2C%207" target="_blank" rel="noreferrer">
                <MapPin size={22} /><span>623943, Свердловская область,<br />с. Усть-Ницинское, ул. Подгорная, 7</span>
              </a>
              <a href="tel:+79126516432"><Phone size={22} /><span>+7 912 651-64-32</span></a>
              <a href="mailto:nicolas-tavda@mail.ru"><Mail size={22} /><span>nicolas-tavda@mail.ru</span></a>
            </address>
            <p className="contact-note"><Clock3 size={18} /> Время посещения и личной встречи с настоятелем уточняйте по телефону.</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main section-wrap">
          <div className="footer-brand">
            <Church size={39} strokeWidth={1.15} />
            <p><strong>Храм Святой Троицы</strong><span>село Усть-Ницинское</span></p>
          </div>
          <p className="footer-copy">Сайт прихода помогает узнать историю храма, уточнить богослужения и передать молитвенную просьбу.</p>
          <nav aria-label="Ссылки в подвале">
            <a href="#about">О храме</a>
            <a href="#history">Летопись</a>
            <a href="#schedule">Расписание</a>
            <button type="button" onClick={() => openRequest("note")}>Подать записку</button>
          </nav>
        </div>
        <div className="footer-bottom section-wrap">
          <span>© {new Date().getFullYear()} Храм Святой Троицы, с. Усть-Ницинское</span>
          <span>Прототип сайта · платёжный шлюз не подключён</span>
        </div>
      </footer>

      <RequestModal open={modalOpen} onClose={() => setModalOpen(false)} initialService={initialService} />
    </div>
  );
}
