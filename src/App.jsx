import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronDown,
  Church,
  Clock3,
  Cross,
  ExternalLink,
  FileText,
  HandHeart,
  HeartHandshake,
  Info,
  Landmark,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Users,
  Waypoints,
  X,
} from "lucide-react";
import { NAV_GROUPS, NEWS, PLACEHOLDERS, SERVICES } from "./siteData.js";
import { RequestModal } from "./RequestModal.jsx";

const BASE = import.meta.env.BASE_URL || "/";
const OFFICIAL_PARISH_URL = "https://alapaevsk-eparchy.ru/eparkhiya/khramy-i-monastyri/bajkalovskoe-blagochinie/147-prikhod-vo-imya-svyatoj-troitsy-s-ust-nitsinskoe-slobodo-turinskogo-rajona";
const OFFICIAL_RECTOR_URL = "https://alapaevsk-eparchy.ru/eparkhiya/personalii/g/121-gerasimov-fjodor";

const siteHref = (path = "/") => {
  const clean = path.replace(/^\/+/, "");
  return clean ? `${BASE}${clean}` : BASE;
};

const assetHref = (name) => `${BASE}assets/${name}`;

const getCurrentPath = () => {
  let path = window.location.pathname || "/";
  const baseWithoutSlash = BASE === "/" ? "" : BASE.replace(/\/$/, "");
  if (baseWithoutSlash && path.startsWith(baseWithoutSlash)) {
    path = path.slice(baseWithoutSlash.length) || "/";
  }
  if (!path.startsWith("/")) path = `/${path}`;
  if (path !== "/" && !path.endsWith("/")) path = `${path}/`;
  return path;
};

const formatToday = () => {
  const now = new Date();
  const dayAndMonth = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(now);
  return `${dayAndMonth} ${now.getFullYear()} года`;
};

function Link({ to, children, className, onClick, ...props }) {
  return <a href={siteHref(to)} className={className} onClick={onClick} {...props}>{children}</a>;
}

function Ornament({ compact = false }) {
  return (
    <span className={`ornament ${compact ? "ornament--compact" : ""}`} aria-hidden="true">
      <span /><Cross size={compact ? 13 : 17} strokeWidth={1.4} /><span />
    </span>
  );
}

function SectionHeading({ eyebrow, title, children, align = "left" }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2><Ornament />
      {children && <p className="section-lead">{children}</p>}
    </div>
  );
}

function SourceLink({ href, children = "Официальный источник" }) {
  return <a className="source-link" href={href} target="_blank" rel="noreferrer">{children} <ExternalLink size={15} /></a>;
}

function MissingInfo({ title = "Раздел готов к наполнению", items, note }) {
  return (
    <aside className="missing-info" aria-label="Необходимые материалы">
      <div className="missing-info__icon"><Info size={25} strokeWidth={1.35} /></div>
      <div>
        <p className="eyebrow">Необходимо предоставить информацию</p>
        <h3>{title}</h3>
        {note && <p>{note}</p>}
        <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </aside>
  );
}

function Breadcrumbs({ items = [] }) {
  return (
    <nav className="breadcrumbs section-wrap" aria-label="Хлебные крошки">
      <Link to="/">Главная</Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}><span aria-hidden="true">/</span>{item.path ? <Link to={item.path}>{item.label}</Link> : <b>{item.label}</b>}</span>
      ))}
    </nav>
  );
}

function PageHero({ eyebrow, title, lead, breadcrumbs = [], compact = false }) {
  return (
    <>
      <section className={`page-hero ${compact ? "page-hero--compact" : ""}`}>
        <div className="page-hero__image" aria-hidden="true"><img src={assetHref("ust-nitsinskoe-church.jpg")} alt="" /></div>
        <div className="section-wrap page-hero__content">
          <p className="eyebrow">{eyebrow}</p><h1>{title}</h1><Ornament />{lead && <p>{lead}</p>}
        </div>
      </section>
      <Breadcrumbs items={breadcrumbs} />
    </>
  );
}

function NewsCard({ item, featured = false }) {
  return (
    <article className={`news-card ${featured ? "news-card--featured" : ""}`}>
      <div className="news-card__meta"><time dateTime={item.isoDate}>{item.date}</time><span>{item.category}</span></div>
      <h3><Link to={`/novosti/${item.slug}/`}>{item.title}</Link></h3>
      <p>{item.summary}</p>
      <Link className="text-link" to={`/novosti/${item.slug}/`}>Читать материал <ArrowRight size={16} /></Link>
    </article>
  );
}

function RelatedLinks({ items }) {
  return (
    <div className="related-links">
      {items.map((item) => (
        <Link className="related-link" to={item.path} key={item.path}>
          <span>{item.eyebrow}</span><strong>{item.title}</strong><ArrowRight size={18} />
        </Link>
      ))}
    </div>
  );
}

function HomePage({ openRequest }) {
  return (
    <>
      <div className="announcement-bar"><div className="section-wrap"><Bell size={16} /><p><strong>Перед поездкой уточните время богослужения.</strong> Актуальное расписание пока не опубликовано.</p><a href="tel:+79126516432">Позвонить</a></div></div>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-photo" aria-hidden="true"><img src={assetHref("ust-nitsinskoe-church.jpg")} alt="" /><span className="hero-photo__wash" /></div>
        <div className="hero-card ornamental-frame">
          <Cross className="hero-cross" size={35} strokeWidth={1.2} aria-hidden="true" />
          <h1 id="hero-title">Храм Святой<br />Троицы</h1><p>село Усть-Ницинское</p><Ornament />
          <div className="hero-actions"><button className="button button--gold" type="button" onClick={() => openRequest("moleben")}>Заказать молебен</button><Link className="button button--outline" to="/bogosluzheniya/raspisanie/">Узнать расписание</Link></div>
        </div>
        <Link className="hero-caption" to="/o-khrame/istoriya/"><span>Храм XVIII века</span><small>Узнать историю</small><ArrowRight size={16} /></Link>
      </section>

      <section className="home-dashboard section-wrap" aria-label="Быстрые разделы">
        <article className="dashboard-card dashboard-card--schedule"><CalendarDays size={28} /><div><p className="eyebrow">Богослужения</p><h2>Расписание уточняется</h2><p>Позвоните в приход перед поездкой.</p></div><Link className="text-link" to="/bogosluzheniya/raspisanie/">Подробнее <ArrowRight size={16} /></Link></article>
        <article className="dashboard-card"><BookOpen size={28} /><div><p className="eyebrow">История</p><h2>1773–1779 годы</h2><p>Храм построен на пожертвования жителей.</p></div><Link className="text-link" to="/o-khrame/istoriya/">Читать летопись <ArrowRight size={16} /></Link></article>
        <article className="dashboard-card"><HeartHandshake size={28} /><div><p className="eyebrow">Поминовение</p><h2>Передать имена</h2><p>Доступен демонстрационный сценарий подачи записки.</p></div><button className="text-link" type="button" onClick={() => openRequest("note")}>Открыть форму <ArrowRight size={16} /></button></article>
      </section>

      <section className="intro-grid section-wrap">
        <article className="intro-card ornamental-frame"><SectionHeading title="О храме" /><p className="intro-date">Каменный двухэтажный храм XVIII века</p><p>Тёплая зимняя часть освящена в честь Успения Божией Матери, а главный летний престол — в честь Святой Троицы. Западная арочная часть когда-то принимала путников на пути к Ирбитской ярмарке.</p><Link className="text-link" to="/o-khrame/">О храме и архитектуре <ArrowRight size={16} /></Link></article>
        <article className="rector-card ornamental-frame">
          <div className="rector-copy"><SectionHeading title="Настоятель" /><p className="rector-name">Митрофорный протоиерей<br /><strong>Фёдор Герасимов</strong></p><p className="rector-summary">Настоятель прихода Святой Троицы, благочинный и член Епархиального совета.</p><Link className="button button--navy" to="/o-khrame/nastoyatel/">Подробнее</Link></div>
          <figure className="rector-photo"><img src={assetHref("fedor-gerasimov.jpg")} alt="Митрофорный протоиерей Фёдор Герасимов" /><figcaption>Фото с официальной страницы Алапаевской епархии</figcaption></figure>
        </article>
      </section>

      <section className="news-home"><div className="section-wrap"><div className="section-header-row"><SectionHeading eyebrow="Хроника" title="Новости прихода и служение настоятеля">Материалы разделены по источнику, чтобы события других приходов не выдавались за новости Усть-Ницинского храма.</SectionHeading><Link className="button button--navy" to="/novosti/">Все новости</Link></div><div className="news-grid">{NEWS.slice(0, 3).map((item, index) => <NewsCard item={item} featured={index === 0} key={item.slug} />)}</div></div></section>

      <section className="portal-section section-wrap">
        <SectionHeading eyebrow="Информационный портал" title="Разделы сайта" align="center">История, богослужения, новости, приходская жизнь, паломникам и документы собраны на отдельных страницах.</SectionHeading>
        <div className="portal-grid">
          {[
            [BookOpen, "История и архитектура", "/o-khrame/istoriya/", "Летопись храма с 1773 года"],
            [Cross, "Святыни", "/o-khrame/svyatyni/", "Проверенные сведения и материалы на согласовании"],
            [Users, "Приходская жизнь", "/prikhodskaya-zhizn/", "Школа, проекты и служение"],
            [Camera, "Фотогалерея", "/media/foto/", "Фотографии храма и событий"],
            [Waypoints, "Паломникам", "/palomnikam/", "Как добраться и подготовиться к поездке"],
            [FileText, "Документы", "/documents/", "Реквизиты и правовые материалы"],
          ].map(([Icon, title, route, text]) => <Link className="portal-card" to={route} key={route}><Icon size={28} strokeWidth={1.25} /><h3>{title}</h3><p>{text}</p><span>Открыть <ArrowRight size={15} /></span></Link>)}
        </div>
      </section>

      <section className="services-section"><div className="section-wrap"><SectionHeading eyebrow="Поминовение онлайн" title="Передать просьбу в храм" align="center">Интерфейс готов для согласования. Реальная отправка и оплата будут подключены после утверждения прихода.</SectionHeading><div className="service-grid">{SERVICES.slice(0, 3).map((item, index) => <article className="service-card" key={item.id}><span className="service-number">0{index + 1}</span>{index === 0 ? <Cross size={25} /> : index === 1 ? <HeartHandshake size={25} /> : <Church size={25} />}<h3>{item.title}</h3><p>{item.description}</p><button type="button" className="text-link" onClick={() => openRequest(item.id)}>Оформить <ArrowRight size={16} /></button></article>)}</div><div className="services-notice"><ShieldCheck size={20} /><span>Демонстрационный режим: платёжный шлюз не подключён, средства не списываются.</span></div></div></section>
      <ContactBand />
    </>
  );
}

function AboutPage() {
  return (
    <><PageHero eyebrow="Приход Святой Троицы" title="О храме" lead="Каменный храм XVIII века в селе Усть-Ницинское — памятник веры, истории и труда нескольких поколений." breadcrumbs={[{ label: "О храме" }]} />
      <section className="content-layout section-wrap"><article className="prose"><p className="lead-paragraph">Приход во имя Святой Троицы находится в селе Усть-Ницинское Слободо-Туринского района Свердловской области.</p><h2>Два храма под одной кровлей</h2><p>Каменное здание возведено в 1773–1779 годах на пожертвования. Внутренний объём был разделён на тёплую зимнюю часть, освящённую в честь Успения Божией Матери, и холодную летнюю часть с главным престолом во имя Святой Троицы.</p><p>Храм построен в два этажа, имеет колокольню и западный придел. Отдельный арочный вход в западной части в прошлом вёл в приют для путников, следовавших по торговым дорогам к Ирбитской ярмарке.</p><h2>Живой приход</h2><p>После использования здания не по назначению в советское время восстановительные работы начались в 1998 году при участии местных жителей и на пожертвования. В 2001 году была организована православная община. Официальная карточка епархии сообщает, что богослужения совершаются регулярно.</p><SourceLink href={OFFICIAL_PARISH_URL} /></article><aside className="fact-panel ornamental-frame"><p className="eyebrow">Кратко</p><dl><div><dt>Годы строительства</dt><dd>1773–1779</dd></div><div><dt>Главный престол</dt><dd>Святой Троицы</dd></div><div><dt>Зимний храм</dt><dd>Успения Божией Матери</dd></div><div><dt>Адрес</dt><dd>с. Усть-Ницинское, ул. Подгорная, 7</dd></div></dl></aside></section>
      <section className="section-wrap section-block"><RelatedLinks items={[{ eyebrow: "Летопись", title: "История и архитектура", path: "/o-khrame/istoriya/" }, { eyebrow: "Персоналия", title: "Настоятель Фёдор Герасимов", path: "/o-khrame/nastoyatel/" }, { eyebrow: "На согласовании", title: "Святыни храма", path: "/o-khrame/svyatyni/" }]} /></section></>
  );
}

function HistoryPage() {
  return (
    <><PageHero eyebrow="Летопись прихода" title="История и архитектура" lead="От строительства на пожертвования до возвращения церковной жизни в конце XX века." breadcrumbs={[{ label: "О храме", path: "/o-khrame/" }, { label: "История и архитектура" }]} />
      <section className="history-page section-wrap"><div className="history-page__intro"><SectionHeading title="Храм на дороге к Ирбитской ярмарке">Западная арочная часть здания когда-то служила приютом для путников. Эта редкая деталь связывает историю прихода с торговыми дорогами Урала.</SectionHeading><SourceLink href={OFFICIAL_PARISH_URL} /></div><div className="timeline timeline--large"><div><strong>1773–1779</strong><span><b>Строительство.</b> Каменный двухэтажный храм возведён на пожертвования жителей.</span></div><div><strong>До 1917</strong><span><b>Две части.</b> Зимний Успенский и летний Троицкий храмы объединены в одном здании; западный придел принимал путников.</span></div><div><strong>XX век</strong><span><b>Испытания.</b> После революции церковное здание было отобрано и использовалось не по назначению.</span></div><div><strong>1998</strong><span><b>Восстановление.</b> Работы начались при участии местных жителей и на пожертвования.</span></div><div><strong>2001</strong><span><b>Возрождение общины.</b> При храме организована православная община, возобновилась регулярная церковная жизнь.</span></div><div><strong>Сегодня</strong><span><b>Живая история.</b> Храм продолжает служить местом молитвы и требует бережного сохранения.</span></div></div></section>
      <section className="architecture-band"><div className="section-wrap architecture-grid"><div><Landmark size={34} /><h3>Два этажа</h3><p>Историческое каменное здание с разделением на сезонные части.</p></div><div><Church size={34} /><h3>Колокольня</h3><p>Вертикальная доминанта храмового комплекса.</p></div><div><Waypoints size={34} /><h3>Западный придел</h3><p>Отдельный арочный вход и память о путниках к Ирбитской ярмарке.</p></div></div></section></>
  );
}

function RectorPage() {
  return (
    <><PageHero eyebrow="Духовенство" title="Настоятель храма" lead="Митрофорный протоиерей Фёдор Герасимов." breadcrumbs={[{ label: "О храме", path: "/o-khrame/" }, { label: "Настоятель" }]} compact />
      <section className="rector-profile section-wrap"><figure><img src={assetHref("fedor-gerasimov.jpg")} alt="Митрофорный протоиерей Фёдор Герасимов" /><figcaption>Официальный портрет с сайта Алапаевской епархии</figcaption></figure><article className="prose"><p className="eyebrow">Митрофорный протоиерей</p><h1>Фёдор Герасимов</h1><p className="lead-paragraph">Настоятель прихода во имя Святой Троицы села Усть-Ницинское.</p><dl className="profile-facts"><div><dt>Дата рождения</dt><dd>21 февраля 1957 года</dd></div><div><dt>Диаконская хиротония</dt><dd>10 ноября 1985 года</dd></div><div><dt>Иерейская хиротония</dt><dd>25 мая 1986 года</dd></div><div><dt>Служение</dt><dd>Настоятель двух приходов, благочинный, член Епархиального совета</dd></div></dl><p>Отец Фёдор также является настоятелем прихода Всемилостивого Спаса в Туринске и благочинным Тавдинско-Туринского благочиния.</p><div className="inline-actions"><a className="button button--gold" href="tel:+79126516432"><Phone size={17} /> Позвонить</a><SourceLink href={OFFICIAL_RECTOR_URL}>Профиль на сайте епархии</SourceLink></div></article></section>
      <section className="section-wrap section-block"><MissingInfo title="Полная биография и обращение настоятеля пока не опубликованы" items={["расширенную биографию и этапы служения", "обращение отца Фёдора к прихожанам и гостям сайта", "согласование постоянного использования портрета"]} /></section></>
  );
}

function ShrinesPage() {
  return (
    <><PageHero eyebrow="О храме" title="Святыни и почитаемые образы" lead="Раздел создан, но сведения о святынях публикуются только после подтверждения настоятеля." breadcrumbs={[{ label: "О храме", path: "/o-khrame/" }, { label: "Святыни" }]} />
      <section className="section-wrap section-block"><div className="verification-banner"><ShieldCheck size={25} /><p><strong>Проверка источников</strong><span>Официальная карточка прихода не содержит перечня святынь. Поэтому неподтверждённые сведения не представлены как установленный факт.</span></p></div><article className="shrine-story ornamental-frame"><div className="shrine-story__mark"><Cross size={48} strokeWidth={1} /></div><div><p className="eyebrow">Материал на согласовании</p><h2>Венецкая икона Божией Матери</h2><p>Церковная публикация другого московского храма связывает один из образов с Троицкой церковью села Усть-Ницинское. Однако официальный источник прихода не подтверждает нынешнее нахождение, статус или историю этой иконы.</p><p>До получения сведений от настоятеля мы не публикуем рассказы о чудотворности, мироточении или помощи в частных прошениях.</p><SourceLink href="https://ordynka.com/ikona-bogorodiczy-veneczkaya/">Внешнее церковное упоминание</SourceLink></div></article><MissingInfo title="Чтобы открыть полную страницу Венецкой иконы" items={PLACEHOLDERS.shrine} /></section></>
  );
}

function RestorationPage() {
  return <><PageHero eyebrow="Сохранение наследия" title="Восстановление храма" lead="Известные факты отделены от информации, которую необходимо получить у прихода." breadcrumbs={[{ label: "О храме", path: "/o-khrame/" }, { label: "Восстановление" }]} /><section className="content-layout section-wrap"><article className="prose"><h2>Возвращение церковной жизни</h2><p>По данным официальной карточки прихода, восстановительные работы начались в 1998 году. В них участвовали местные жители, а средства собирались из пожертвований.</p><p>Контроль за реставрационными и строительными работами осуществлялся профильным научно-производственным центром по охране памятников истории и культуры.</p><SourceLink href={OFFICIAL_PARISH_URL} /></article><MissingInfo title="Текущий статус работ требует обновления" items={PLACEHOLDERS.restoration} /></section></>;
}

function SchedulePage() {
  return (
    <><PageHero eyebrow="Богослужения" title="Расписание служб" lead="Перед поездкой обязательно уточните время богослужения по телефону прихода." breadcrumbs={[{ label: "Богослужения" }, { label: "Расписание" }]} />
      <section className="schedule-page section-wrap"><div className="schedule-callout ornamental-frame"><CalendarDays size={38} /><p className="eyebrow">Актуальное расписание</p><h2>Не опубликовано</h2><p>Официальный источник сообщает, что богослужения совершаются регулярно, но расписание на конкретные дни отсутствует.</p><a className="button button--gold" href="tel:+79126516432"><Phone size={18} /> +7 912 651-64-32</a></div><MissingInfo title="Для публикации недельного расписания" items={PLACEHOLDERS.schedule} /></section>
      <section className="section-wrap section-block"><RelatedLinks items={[{ eyebrow: "Онлайн", title: "Подать записку", path: "/treby-online/" }, { eyebrow: "Справка", title: "Таинства и требы", path: "/bogosluzheniya/tainstva-i-treby/" }, { eyebrow: "Поездка", title: "Информация паломникам", path: "/palomnikam/" }]} /></section></>
  );
}

function ServicesPage({ openRequest }) {
  return (
    <><PageHero eyebrow="Богослужения" title="Таинства, требы и записки" lead="Сценарий заказа готов для согласования. Реальная передача данных и оплата пока отключены." breadcrumbs={[{ label: "Богослужения" }, { label: "Таинства и требы" }]} />
      <section className="section-wrap section-block"><div className="verification-banner verification-banner--warning"><ShieldCheck size={25} /><p><strong>Демонстрационный режим</strong><span>Форма не отправляет данные в приход и не списывает средства. Она показывает будущий путь пользователя после юридического и технического подключения.</span></p></div><div className="service-catalog">{SERVICES.map((item, index) => <article key={item.id}><span>0{index + 1}</span><h2>{item.title}</h2><p>{item.description}</p><button className="button button--navy" type="button" onClick={() => openRequest(item.id)}>Открыть демо-форму</button></article>)}</div><div className="process-grid"><div><CheckCircle2 size={24} /><strong>1. Выберите требу</strong><p>Будущий перечень утверждает приход.</p></div><div><FileText size={24} /><strong>2. Укажите имена</strong><p>Форма поможет проверить обязательные поля.</p></div><div><ShieldCheck size={24} /><strong>3. Внесите пожертвование</strong><p>После подключения эквайринга и документов.</p></div></div><MissingInfo title="Что нужно для запуска реальной оплаты" items={PLACEHOLDERS.payment} /></section></>
  );
}

function NotesGuidePage({ openRequest }) {
  return (
    <><PageHero eyebrow="Богослужения" title="Как подать записку" lead="Краткая инструкция к будущему онлайн-сервису." breadcrumbs={[{ label: "Богослужения" }, { label: "Как подать записку" }]} /><section className="guide-grid section-wrap"><article><span>01</span><h2>Выберите вид поминовения</h2><p>О здравии, об упокоении или иное прошение — точный перечень утвердит приход.</p></article><article><span>02</span><h2>Укажите крещёные имена</h2><p>Каждое имя — с новой строки. Если есть сомнения, задайте вопрос по телефону.</p></article><article><span>03</span><h2>Оставьте контакты</h2><p>Телефон понадобится, если сотруднику прихода потребуется уточнить просьбу.</p></article><article><span>04</span><h2>Проверьте заявку</h2><p>До запуска эквайринга форма работает только как демонстрация и ничего не отправляет.</p></article></section><div className="center-action section-wrap"><button className="button button--gold" type="button" onClick={() => openRequest("note")}>Открыть демо-форму</button></div></>
  );
}

function NewsPage() {
  const categories = ["Все", "Новости прихода", "Служение настоятеля", "Жизнь благочиния"];
  const [category, setCategory] = useState("Все");
  const filtered = category === "Все" ? NEWS : NEWS.filter((item) => item.category === category);
  return (
    <><PageHero eyebrow="Хроника" title="Новости" lead="Новости самого прихода отделены от материалов о служении настоятеля в епархии и других храмах." breadcrumbs={[{ label: "Новости" }]} /><section className="section-wrap section-block"><div className="news-filters" role="group" aria-label="Фильтр новостей">{categories.map((item) => <button type="button" className={item === category ? "is-active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div><div className="news-list">{filtered.map((item, index) => <NewsCard item={item} featured={category === "Все" && index === 0} key={item.slug} />)}</div><MissingInfo title="Для регулярного обновления новостей прихода" items={["тексты и даты приходских событий после июня 2025 года", "согласованные фотографии и подписи авторов", "контакт ответственного за публикации"]} /></section></>
  );
}

function NewsArticlePage({ article }) {
  if (!article) return <NotFoundPage />;
  return (
    <><PageHero eyebrow={article.category} title={article.title} lead={article.summary} breadcrumbs={[{ label: "Новости", path: "/novosti/" }, { label: article.title }]} compact /><article className="article-page section-wrap"><div className="article-meta"><time dateTime={article.isoDate}>{article.date}</time><span>{article.category}</span></div>{article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="article-source"><Info size={22} /><p><strong>Основание публикации</strong><span>Краткий пересказ официального сообщения Алапаевской епархии. Для постоянного использования фотографий необходимо получить разрешение правообладателя.</span></p></div><SourceLink href={article.source}>Читать оригинал на сайте епархии</SourceLink><div className="article-back"><Link className="button button--navy" to="/novosti/">Вернуться ко всем новостям</Link></div></article></>
  );
}

function ParishLifePage() {
  const projects = [[Users, "Воскресная школа", "Занятия с детьми и семейные встречи"], [HandHeart, "Социальное служение", "Помощь нуждающимся и благотворительные проекты"], [HeartHandshake, "Молодёжь и семья", "Встречи и совместные приходские события"], [Waypoints, "Паломнические поездки", "Организованные поездки к святыням"], [Church, "Волонтёрство", "Помощь храму и участие в восстановлении"]];
  return (
    <><PageHero eyebrow="Жизнь общины" title="Приходская жизнь" lead="Структура раздела готова по примеру полноценных приходских сайтов. Содержимое ожидает материалов от прихода." breadcrumbs={[{ label: "Приходская жизнь" }]} /><section className="project-grid section-wrap">{projects.map(([Icon, title, text]) => <article key={title}><Icon size={30} strokeWidth={1.2} /><h2>{title}</h2><p>{text}</p><span>Необходимо предоставить информацию</span></article>)}</section><section className="section-wrap section-block"><MissingInfo title="Единый набор материалов для каждого проекта" items={PLACEHOLDERS.parishLife} /></section></>
  );
}

function GalleryPage() {
  return (
    <><PageHero eyebrow="Медиатека" title="Фотогалерея" lead="Сейчас на сайте размещены только официальные изображения храма и настоятеля." breadcrumbs={[{ label: "Приходская жизнь", path: "/prikhodskaya-zhizn/" }, { label: "Фотогалерея" }]} /><section className="gallery-grid section-wrap"><figure className="gallery-item gallery-item--wide"><img src={assetHref("ust-nitsinskoe-church.jpg")} alt="Храм Святой Троицы в селе Усть-Ницинское" /><figcaption><strong>Храм Святой Троицы</strong><span>Фото с официальной карточки прихода</span></figcaption></figure><figure className="gallery-item"><img src={assetHref("fedor-gerasimov.jpg")} alt="Настоятель Фёдор Герасимов" /><figcaption><strong>Настоятель Фёдор Герасимов</strong><span>Официальный портрет Алапаевской епархии</span></figcaption></figure></section><section className="section-wrap section-block"><MissingInfo title="Чтобы создать полноценные фотоальбомы" items={PLACEHOLDERS.gallery} /></section></>
  );
}

function PilgrimsPage() {
  return (
    <><PageHero eyebrow="Гостям храма" title="Паломникам" lead="Адрес и контакт подтверждены. Детали поездки и правила посещения необходимо согласовать с приходом." breadcrumbs={[{ label: "Паломникам" }]} /><section className="content-layout section-wrap"><article className="prose"><h2>Как добраться</h2><p>Храм расположен по адресу: 623943, Свердловская область, Слободо-Туринский район, село Усть-Ницинское, улица Подгорная, 7.</p><a className="button button--gold" href="https://yandex.ru/maps/?text=%D0%A1%D0%B2%D0%B5%D1%80%D0%B4%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2C%20%D1%81.%20%D0%A3%D1%81%D1%82%D1%8C-%D0%9D%D0%B8%D1%86%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B5%2C%20%D1%83%D0%BB.%20%D0%9F%D0%BE%D0%B4%D0%B3%D0%BE%D1%80%D0%BD%D0%B0%D1%8F%2C%207" target="_blank" rel="noreferrer"><MapPin size={18} /> Открыть на карте</a><h2>Перед поездкой</h2><p>Позвоните по номеру +7 912 651-64-32 и уточните время службы, возможность посещения и личной встречи с настоятелем.</p></article><MissingInfo title="Практическая информация для паломников" items={["маршруты общественного транспорта и парковка", "часы посещения и правила для групп", "доступность для маломобильных посетителей", "контакт для предварительного согласования поездки"]} /></section></>
  );
}

function DonationsPage({ openRequest }) {
  return (
    <><PageHero eyebrow="Помощь храму" title="Пожертвовать" lead="Страница подготовлена, но принимать платежи до утверждения реквизитов и документов нельзя." breadcrumbs={[{ label: "Пожертвовать" }]} /><section className="donation-page section-wrap"><article className="donation-card ornamental-frame"><HandHeart size={44} strokeWidth={1.1} /><h2>Поддержать храм</h2><p>После согласования здесь появятся цели сбора, банковские реквизиты и безопасная форма пожертвования.</p><button className="button button--gold" type="button" onClick={() => openRequest("other")}>Посмотреть демо оплаты</button></article><MissingInfo title="Для запуска пожертвований" items={PLACEHOLDERS.payment} /></section></>
  );
}

function ContactsPage() {
  const mapUrl = "https://yandex.ru/maps/?text=%D0%A1%D0%B2%D0%B5%D1%80%D0%B4%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2C%20%D1%81.%20%D0%A3%D1%81%D1%82%D1%8C-%D0%9D%D0%B8%D1%86%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B5%2C%20%D1%83%D0%BB.%20%D0%9F%D0%BE%D0%B4%D0%B3%D0%BE%D1%80%D0%BD%D0%B0%D1%8F%2C%207";
  return (
    <><PageHero eyebrow="Связь с приходом" title="Контакты" lead="Позвоните перед поездкой, чтобы уточнить расписание и возможность встречи." breadcrumbs={[{ label: "Контакты" }]} /><section className="contacts-page section-wrap"><div className="contact-main"><p className="eyebrow">Храм Святой Троицы</p><h2>село Усть-Ницинское</h2><address><a href={mapUrl} target="_blank" rel="noreferrer"><MapPin size={24} /><span>623943, Свердловская область,<br />с. Усть-Ницинское, ул. Подгорная, 7</span></a><a href="tel:+79126516432"><Phone size={24} /><span>+7 912 651-64-32</span></a><a href="mailto:nicolas-tavda@mail.ru"><Mail size={24} /><span>nicolas-tavda@mail.ru</span></a></address><p className="contact-note"><Clock3 size={18} /> Время посещения и личной встречи уточняйте по телефону.</p></div><div className="contact-map"><img src={assetHref("ust-nitsinskoe-church.jpg")} alt="Храм Святой Троицы" /><a href={mapUrl} target="_blank" rel="noreferrer">Построить маршрут <ExternalLink size={16} /></a></div></section></>
  );
}

function DocumentsPage() {
  const docs = ["Политика обработки персональных данных", "Согласие на обработку персональных данных", "Условия подачи записок и исполнения треб", "Оферта о добровольном пожертвовании", "Порядок оплаты, отмены и возврата", "Официальные реквизиты прихода"];
  return (
    <><PageHero eyebrow="Служебная информация" title="Документы и реквизиты" lead="Страницы предусмотрены в структуре, но юридические тексты должен утвердить приход." breadcrumbs={[{ label: "Документы" }]} /><section className="documents-grid section-wrap">{docs.map((title) => <article key={title}><FileText size={27} /><div><h2>{title}</h2><p>Необходимо предоставить утверждённый документ.</p></div></article>)}</section><section className="section-wrap section-block"><MissingInfo title="Реальные формы и оплата останутся отключёнными до публикации документов" items={PLACEHOLDERS.payment} /></section></>
  );
}

function SitemapPage() {
  const links = NAV_GROUPS.flatMap((group) => [{ label: group.label, path: group.path }, ...(group.children || [])]);
  return (
    <><PageHero eyebrow="Навигация" title="Карта сайта" lead="Все основные разделы многостраничного сайта." breadcrumbs={[{ label: "Карта сайта" }]} compact /><section className="sitemap-grid section-wrap">{links.map((item) => <Link to={item.path} key={`${item.path}-${item.label}`}><span>{item.label}</span><ArrowRight size={17} /></Link>)}<Link to="/treby-online/"><span>Требы онлайн</span><ArrowRight size={17} /></Link><Link to="/pozhertvovat/"><span>Пожертвовать</span><ArrowRight size={17} /></Link><Link to="/documents/"><span>Документы</span><ArrowRight size={17} /></Link></section></>
  );
}

function NotFoundPage() {
  return <section className="not-found section-wrap"><Cross size={48} strokeWidth={1} /><p className="eyebrow">Ошибка 404</p><h1>Страница не найдена</h1><p>Возможно, адрес изменился. Перейдите на главную или откройте карту сайта.</p><div className="inline-actions"><Link className="button button--gold" to="/">На главную</Link><Link className="button button--navy" to="/karta-sayta/">Карта сайта</Link></div></section>;
}

function ContactBand() {
  return <section className="contact-band"><div className="section-wrap"><div><p className="eyebrow">Как добраться</p><h2>с. Усть-Ницинское, ул. Подгорная, 7</h2></div><a href="tel:+79126516432"><Phone size={20} /><span><small>Телефон прихода</small>+7 912 651-64-32</span></a><Link className="button button--gold" to="/kontakty/">Контакты и маршрут</Link></div></section>;
}

function Header({ path, menuOpen, setMenuOpen, openRequest }) {
  const closeMenu = () => setMenuOpen(false);
  const groupActive = (group) => {
    if (group.path === "/novosti/") return path.startsWith("/novosti/");
    if (group.path === "/o-khrame/") return path.startsWith("/o-khrame/");
    if (group.path.startsWith("/bogosluzheniya/")) return path.startsWith("/bogosluzheniya/") || path.startsWith("/treby-online/");
    if (group.path === "/prikhodskaya-zhizn/") return path.startsWith("/prikhodskaya-zhizn/") || path.startsWith("/media/") || path.startsWith("/palomnikam/");
    return path === group.path;
  };
  return (
    <><a className="skip-link" href="#main">Перейти к содержанию</a><div className="utility-bar"><div className="section-wrap"><span><MapPin size={14} /> с. Усть-Ницинское, ул. Подгорная, 7</span><span><Phone size={14} /> <a href="tel:+79126516432">+7 912 651-64-32</a></span><time dateTime={new Date().toISOString().slice(0, 10)}>{formatToday()}</time></div></div>
      <header className="site-header"><Link className="brand" to="/" aria-label="Храм Святой Троицы — на главную" onClick={closeMenu}><span className="brand__mark"><Church size={43} strokeWidth={1.2} /></span><span className="brand__copy"><strong>Храм Святой Троицы</strong><small>село Усть-Ницинское</small></span></Link>
        <nav className={`desktop-nav ${menuOpen ? "is-open" : ""}`} aria-label="Основная навигация"><Link className={path === "/" ? "is-active" : ""} to="/" onClick={closeMenu}>Главная</Link>{NAV_GROUPS.map((group) => <div className={`nav-group ${groupActive(group) ? "is-active" : ""}`} key={group.label}><Link to={group.path} onClick={closeMenu}>{group.label}{group.children && <ChevronDown size={14} />}</Link>{group.children && <div className="nav-dropdown">{group.children.map((item) => <Link to={item.path} onClick={closeMenu} key={item.path}>{item.label}</Link>)}</div>}</div>)}<div className="mobile-nav-actions"><button className="button button--gold" type="button" onClick={() => { closeMenu(); openRequest("note"); }}>Подать записку</button><Link className="button button--outline" to="/pozhertvovat/" onClick={closeMenu}>Пожертвовать</Link></div></nav>
        <div className="header-actions"><button className="header-cta" type="button" onClick={() => openRequest("note")}>Подать записку</button><Link className="header-donate" to="/pozhertvovat/">Пожертвовать</Link></div><button className="menu-toggle icon-button" type="button" aria-expanded={menuOpen} aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X /> : <Menu />}</button></header></>
  );
}

function Footer({ openRequest }) {
  return (
    <footer className="site-footer"><div className="footer-main section-wrap"><div className="footer-brand"><Church size={39} strokeWidth={1.15} /><p><strong>Храм Святой Троицы</strong><span>село Усть-Ницинское</span></p></div><div className="footer-contacts"><a href="tel:+79126516432"><Phone size={16} /> +7 912 651-64-32</a><span><MapPin size={16} /> ул. Подгорная, 7</span><a href="mailto:nicolas-tavda@mail.ru"><Mail size={16} /> nicolas-tavda@mail.ru</a></div><nav aria-label="Ссылки в подвале"><Link to="/o-khrame/">О храме</Link><Link to="/novosti/">Новости</Link><Link to="/bogosluzheniya/raspisanie/">Расписание</Link><button type="button" onClick={() => openRequest("note")}>Подать записку</button><Link to="/documents/">Документы</Link><Link to="/karta-sayta/">Карта сайта</Link></nav></div><div className="footer-bottom section-wrap"><span>© {new Date().getFullYear()} Храм Святой Троицы, с. Усть-Ницинское</span><span>Версия для согласования · формы и оплата работают в демонстрационном режиме</span></div></footer>
  );
}

const ROUTE_TITLES = {
  "/": "Храм Святой Троицы — село Усть-Ницинское", "/o-khrame/": "О храме — Храм Святой Троицы", "/o-khrame/istoriya/": "История и архитектура — Храм Святой Троицы", "/o-khrame/nastoyatel/": "Настоятель Фёдор Герасимов — Храм Святой Троицы", "/o-khrame/svyatyni/": "Святыни — Храм Святой Троицы", "/o-khrame/vosstanovlenie/": "Восстановление — Храм Святой Троицы", "/bogosluzheniya/raspisanie/": "Расписание богослужений — Храм Святой Троицы", "/bogosluzheniya/tainstva-i-treby/": "Таинства и требы — Храм Святой Троицы", "/bogosluzheniya/kak-podat-zapisku/": "Как подать записку — Храм Святой Троицы", "/treby-online/": "Требы онлайн — Храм Святой Троицы", "/novosti/": "Новости — Храм Святой Троицы", "/prikhodskaya-zhizn/": "Приходская жизнь — Храм Святой Троицы", "/media/foto/": "Фотогалерея — Храм Святой Троицы", "/palomnikam/": "Паломникам — Храм Святой Троицы", "/pozhertvovat/": "Пожертвовать — Храм Святой Троицы", "/kontakty/": "Контакты — Храм Святой Троицы", "/documents/": "Документы — Храм Святой Троицы", "/karta-sayta/": "Карта сайта — Храм Святой Троицы",
};

export function App() {
  const path = useMemo(getCurrentPath, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialService, setInitialService] = useState("moleben");
  const openRequest = (service = "moleben") => { setInitialService(service); setModalOpen(true); };

  useEffect(() => {
    const slug = path.match(/^\/novosti\/([^/]+)\/$/)?.[1];
    const article = slug ? NEWS.find((item) => item.slug === slug) : null;
    document.title = article ? `${article.title} — Храм Святой Троицы` : ROUTE_TITLES[path] || "Страница не найдена — Храм Святой Троицы";
  }, [path]);

  const renderPage = () => {
    if (path === "/") return <HomePage openRequest={openRequest} />;
    if (path === "/o-khrame/") return <AboutPage />;
    if (path === "/o-khrame/istoriya/") return <HistoryPage />;
    if (path === "/o-khrame/nastoyatel/") return <RectorPage />;
    if (path === "/o-khrame/svyatyni/" || path === "/o-khrame/svyatyni/venetskaya-ikona/") return <ShrinesPage />;
    if (path === "/o-khrame/vosstanovlenie/") return <RestorationPage />;
    if (path === "/bogosluzheniya/raspisanie/") return <SchedulePage />;
    if (path === "/bogosluzheniya/tainstva-i-treby/" || path === "/treby-online/") return <ServicesPage openRequest={openRequest} />;
    if (path === "/bogosluzheniya/kak-podat-zapisku/") return <NotesGuidePage openRequest={openRequest} />;
    if (path === "/novosti/") return <NewsPage />;
    const newsSlug = path.match(/^\/novosti\/([^/]+)\/$/)?.[1];
    if (newsSlug) return <NewsArticlePage article={NEWS.find((item) => item.slug === newsSlug)} />;
    if (path === "/prikhodskaya-zhizn/") return <ParishLifePage />;
    if (path === "/media/foto/") return <GalleryPage />;
    if (path === "/palomnikam/") return <PilgrimsPage />;
    if (path === "/pozhertvovat/") return <DonationsPage openRequest={openRequest} />;
    if (path === "/kontakty/") return <ContactsPage />;
    if (path === "/documents/") return <DocumentsPage />;
    if (path === "/karta-sayta/") return <SitemapPage />;
    return <NotFoundPage />;
  };

  return <div className="site-shell"><Header path={path} menuOpen={menuOpen} setMenuOpen={setMenuOpen} openRequest={openRequest} /><main id="main">{renderPage()}</main><Footer openRequest={openRequest} /><RequestModal open={modalOpen} onClose={() => setModalOpen(false)} initialService={initialService} /></div>;
}
