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
import { PARISH_PAGES, ParishDetailPage } from "./ParishPages.jsx";

const BASE = import.meta.env.BASE_URL || "/";
const OFFICIAL_PARISH_URL = "https://alapaevsk-eparchy.ru/eparkhiya/khramy-i-monastyri/bajkalovskoe-blagochinie/147-prikhod-vo-imya-svyatoj-troitsy-s-ust-nitsinskoe-slobodo-turinskogo-rajona";
const OFFICIAL_RECTOR_URL = "https://alapaevsk-eparchy.ru/eparkhiya/personalii/g/121-gerasimov-fjodor";
const VK_COMMUNITY_URL = "https://vk.ru/ust_nice";
const ICON_HISTORY_URL = "https://kamensk-eparhiya.ru/bogoroditsa-venetskaya-molitsya-za-ust-nitsinskoe-2/";
const ICON_VISIT_URL = "https://kamensk-eparhiya.ru/chudotvornyj-obraz-bozhiej-materi-venetskaya-vstretili-v-kamenske-uralskom/";
const WIKIPEDIA_CHURCH_URL = "https://ru.wikipedia.org/wiki/Церковь_Троицы_Живоначальной_(Усть-Ницинское)";
const SPECIAL_SERVICE_END = new Date("2026-09-06T00:00:00+05:00").getTime();
const isSpecialServiceUpcoming = () => Date.now() < SPECIAL_SERVICE_END;
const ORDERED_NEWS = [...NEWS].sort((left, right) => right.isoDate.localeCompare(left.isoDate));

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
  const showSpecialService = isSpecialServiceUpcoming();
  return (
    <>
      <div className="announcement-bar"><div className="section-wrap"><Bell size={16} /><p>{showSpecialService ? <><strong>5 сентября в 08:30 — архиерейская Литургия.</strong> Богослужение возглавит епископ Сергий.</> : <><strong>Божественная литургия — каждую субботу в 09:00.</strong> Праздничные изменения уточняйте перед поездкой.</>}</p><Link to="/bogosluzheniya/raspisanie/">Подробнее</Link></div></div>

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
        <article className="dashboard-card dashboard-card--schedule"><CalendarDays size={28} /><div><p className="eyebrow">Богослужения</p><h2>Суббота · 09:00</h2><p>Божественная литургия. Исповедь совершается во время богослужения.</p></div><Link className="text-link" to="/bogosluzheniya/raspisanie/">Подробнее <ArrowRight size={16} /></Link></article>
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

      <section className="news-home"><div className="section-wrap"><div className="section-header-row"><SectionHeading eyebrow="Хроника" title="Новости прихода и служение настоятеля">Материалы разделены по источнику, чтобы события других приходов не выдавались за новости Усть-Ницинского храма.</SectionHeading><Link className="button button--navy" to="/novosti/">Все новости</Link></div><div className="news-grid">{ORDERED_NEWS.slice(0, 3).map((item, index) => <NewsCard item={item} featured={index === 0} key={item.slug} />)}</div></div></section>

      <section className="portal-section section-wrap">
        <SectionHeading eyebrow="Информационный портал" title="Разделы сайта" align="center">История, богослужения, новости, приходская жизнь, паломникам и документы собраны на отдельных страницах.</SectionHeading>
        <div className="portal-grid">
          {[
            [BookOpen, "История и архитектура", "/o-khrame/istoriya/", "Летопись храма с 1773 года"],
            [Cross, "Венецкая икона", "/o-khrame/svyatyni/", "История святыни и почитание образа"],
            [Users, "Приходская жизнь", "/prikhodskaya-zhizn/", "Школа, проекты и служение"],
            [Camera, "Фотогалерея", "/media/foto/", "Фотографии храма и событий"],
            [Waypoints, "Паломникам", "/palomnikam/", "Как добраться и подготовиться к поездке"],
            [FileText, "Документы", "/documents/", "Официальные материалы прихода"],
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
      <section className="section-wrap section-block"><article className="prose"><h2>Престольные праздники</h2><p>Приход отмечает Святую Троицу и Успение Пресвятой Богородицы. Сейчас богослужения проходят в нижнем, Успенском приделе. Время праздничных служб настоятель объявляет отдельно.</p><p>Главная святыня прихода — Венецкая икона Божией Матери, которую местные жители сохранили после закрытия храма и вернули с возобновлением церковной жизни.</p><SourceLink href={ICON_VISIT_URL}>Из истории Венецкой иконы</SourceLink></article><RelatedLinks items={[{ eyebrow: "Летопись", title: "История и архитектура", path: "/o-khrame/istoriya/" }, { eyebrow: "Персоналия", title: "Настоятель Фёдор Герасимов", path: "/o-khrame/nastoyatel/" }, { eyebrow: "Святыня прихода", title: "Венецкая икона", path: "/o-khrame/svyatyni/" }]} /></section></>
  );
}

function HistoryPage() {
  return (
    <><PageHero eyebrow="Летопись прихода" title="История и архитектура" lead="От строительства на пожертвования до возвращения церковной жизни в конце XX века." breadcrumbs={[{ label: "О храме", path: "/o-khrame/" }, { label: "История и архитектура" }]} />
      <section className="history-page section-wrap"><div className="history-page__intro"><SectionHeading title="Храм на дороге к Ирбитской ярмарке">Западная арочная часть здания когда-то служила приютом для путников. Эта редкая деталь связывает историю прихода с торговыми дорогами Урала.</SectionHeading><SourceLink href={OFFICIAL_PARISH_URL} /></div><div className="timeline timeline--large"><div><strong>1773–1779</strong><span><b>Строительство.</b> Каменный двухэтажный храм возведён на пожертвования жителей.</span></div><div><strong>До 1917</strong><span><b>Две части.</b> Зимний Успенский и летний Троицкий храмы объединены в одном здании; западный придел принимал путников.</span></div><div><strong>XX век</strong><span><b>Испытания.</b> После революции церковное здание было отобрано и использовалось не по назначению.</span></div><div><strong>1998</strong><span><b>Восстановление.</b> Работы начались при участии местных жителей и на пожертвования.</span></div><div><strong>2001</strong><span><b>Возрождение общины.</b> При храме организована православная община, возобновилась регулярная церковная жизнь.</span></div><div><strong>Сегодня</strong><span><b>Живая история.</b> Храм продолжает служить местом молитвы и требует бережного сохранения.</span></div></div></section>
      <section className="architecture-band"><div className="section-wrap architecture-grid"><div><Landmark size={34} /><h3>Два этажа</h3><p>Историческое каменное здание с разделением на сезонные части.</p></div><div><Church size={34} /><h3>Колокольня</h3><p>Вертикальная доминанта храмового комплекса.</p></div><div><Waypoints size={34} /><h3>Западный придел</h3><p>Отдельный арочный вход и память о путниках к Ирбитской ярмарке.</p></div></div></section><section className="section-wrap section-block"><article className="prose"><h2>Архитектурный облик</h2><p>В энциклопедическом описании храм относят к сибирскому барокко и отмечают более поздние черты классицизма. Здание церкви и колокольня стоят на одной оси, а западная часть выделена большой аркой.</p><SourceLink href={WIKIPEDIA_CHURCH_URL}>Статья о храме в Википедии</SourceLink><h2>Росписи и восстановление</h2><p>В 2012 году Каменская епархия опубликовала рассказ о восстановлении здания при участии Александра Аркадьевича Кручинина и о работе московских иконописцев. Сегодня сохранение росписей связано прежде всего с решением вопроса отопления.</p><SourceLink href={ICON_HISTORY_URL}>Каменская епархия о восстановлении</SourceLink><p><Link className="text-link" to="/o-khrame/vosstanovlenie/">Текущие работы в храме <ArrowRight size={16} /></Link></p></article></section></>
  );
}

function RectorPage() {
  return (
    <><PageHero eyebrow="Духовенство" title="Настоятель храма" lead="Митрофорный протоиерей Фёдор Герасимов." breadcrumbs={[{ label: "О храме", path: "/o-khrame/" }, { label: "Настоятель" }]} compact />
      <section className="rector-profile section-wrap"><figure><img src={assetHref("fedor-gerasimov.jpg")} alt="Митрофорный протоиерей Фёдор Герасимов" /><figcaption>Официальный портрет с сайта Алапаевской епархии</figcaption></figure><article className="prose"><p className="eyebrow">Митрофорный протоиерей</p><h1>Фёдор Герасимов</h1><p className="lead-paragraph">Настоятель прихода во имя Святой Троицы села Усть-Ницинское.</p><dl className="profile-facts"><div><dt>Дата рождения</dt><dd>21 февраля 1957 года</dd></div><div><dt>Диаконская хиротония</dt><dd>10 ноября 1985 года</dd></div><div><dt>Иерейская хиротония</dt><dd>25 мая 1986 года</dd></div><div><dt>Служение</dt><dd>Настоятель двух приходов, благочинный, член Епархиального совета</dd></div></dl><p>Отец Фёдор также является настоятелем прихода Всемилостивого Спаса в Туринске и благочинным Тавдинско-Туринского благочиния.</p><div className="inline-actions"><a className="button button--gold" href="tel:+79126516432"><Phone size={17} /> Позвонить</a><SourceLink href={OFFICIAL_RECTOR_URL}>Профиль на сайте епархии</SourceLink></div></article></section>
      <section className="section-wrap section-block"><article className="prose"><h2>Пастырское служение</h2><p>Отец Фёдор принял диаконский сан в ноябре 1985 года, а в мае 1986 года был рукоположен во священника. В официальной персоналии Алапаевской епархии он указан как митрофорный протоиерей, настоятель храмов в Усть-Ницинском и Туринске и благочинный Тавдинско-Туринского благочиния.</p><p>В публикации Каменской епархии 2012 года отец Фёдор рассказывает о восстановлении Усть-Ницинского храма, работе иконописцев и сохранённой сельчанами Венецкой иконе. В 2013 году епархиальная пресс-служба записала его рассказ о возвращении образа в храм.</p><div className="inline-actions"><SourceLink href={OFFICIAL_RECTOR_URL}>Даты и служение</SourceLink><SourceLink href={ICON_HISTORY_URL}>Рассказ о храме и святыне</SourceLink></div><h2>Личная беседа</h2><p>По духовным и личным вопросам можно позвонить отцу Фёдору. При необходимости он согласует время встречи; часть вопросов можно обсудить по телефону.</p><a className="button button--gold" href="tel:+79126516432"><Phone size={18} /> +7 912 651-64-32</a></article></section></>
  );
}

function ShrinesPage() {
  return (
    <><PageHero eyebrow="Главная святыня прихода" title="Венецкая икона Божией Матери" lead="Образ, сохранённый жителями села и возвращённый в храм Святой Троицы." breadcrumbs={[{ label: "О храме", path: "/o-khrame/" }, { label: "Святыни" }]} />
      <section className="section-wrap section-block"><article className="shrine-story shrine-story--illustrated ornamental-frame"><figure className="shrine-photo"><img src={assetHref("venetskaya-ikona.jpg")} alt="Венецкая икона Божией Матери из храма в Усть-Ницинском" width="401" height="600" /><figcaption><SourceLink href="https://santosepulcro.co.il/icons/venetskaya-ikona-presvyatoy-bogoroditsy/">Источник фотографии: Иерусалимская свеча</SourceLink></figcaption></figure><div><p className="eyebrow">Усть-Ницинское</p><h2>Сохранённая святыня</h2><p>Венецкая икона Божией Матери находится в храме Святой Троицы. О ней рассказывают публикации Каменской епархии 2012 и 2013 годов, основанные в том числе на словах настоятеля Феодора Герасимова.</p><p>По рассказу настоятеля, местные жители уберегли икону во время закрытия церкви. После возвращения храма верующим образ вновь занял своё место в приходе.</p><SourceLink href={ICON_VISIT_URL}>Каменская епархия, 19 апреля 2013</SourceLink></div></article>
      <article className="prose shrine-details"><h2>Что известно об образе</h2><p>Название «Венецкая» написано на самой иконе. Публикация 2012 года отмечает крупный размер образа и рельефный растительный орнамент фона. Автор, время написания и точное происхождение иконы не установлены. Версии об её иконографии остаются предположениями.</p><SourceLink href={ICON_HISTORY_URL}>Описание образа, 25 марта 2012</SourceLink><h2>Почитание за пределами села</h2><p>19 апреля 2013 года икону принесли из Усть-Ницинского в Свято-Троицкий кафедральный собор Каменска-Уральского для молитвенного поклонения. Епархиальное сообщение рассказывает о паломниках из соседних областей и свидетельствах верующих о помощи в семейных скорбях и бездетности. Это рассказы о религиозном опыте, а не обещание определённого результата.</p><SourceLink href={ICON_VISIT_URL}>Сообщение о принесении святыни</SourceLink><h2>Посетить храм</h2><p>Перед поездкой согласуйте время посещения с отцом Фёдором. Постоянная Божественная литургия совершается по субботам в 09:00.</p><div className="inline-actions"><Link className="button button--gold" to="/palomnikam/">Паломникам</Link><Link className="button button--navy" to="/bogosluzheniya/raspisanie/">Расписание</Link></div></article></section></>
  );
}

function RestorationPage() {
  return <><PageHero eyebrow="Сохранение наследия" title="Восстановление храма" lead="Подготовка к зиме, устойчивое отопление и сохранение росписей — ближайшие задачи прихода." breadcrumbs={[{ label: "О храме", path: "/o-khrame/" }, { label: "Восстановление" }]} /><section className="content-layout section-wrap"><article className="prose"><h2>Возвращение церковной жизни</h2><p>Официальная карточка прихода относит начало восстановительных работ к 1998 году. В восстановлении участвовали местные жители и благотворители.</p><p>Каменская епархия в 2012 году рассказывала об участии Александра Аркадьевича Кручинина и московских иконописцев: на первом этаже появились росписи со сценами Священного Писания и образами святых.</p><div className="inline-actions"><SourceLink href={OFFICIAL_PARISH_URL}>История прихода</SourceLink><SourceLink href={ICON_HISTORY_URL}>Хроника восстановления, 2012 год</SourceLink></div><h2>Сначала — тепло</h2><p>По сведениям представителей прихода на 4 сентября 2026 года, первоочередная задача — наладить отопление. Обсуждаются ремонт существующего котла и его замена. Окончательное техническое решение ещё не сообщено.</p><h2>Сохранить нижний храм</h2><p>Наружные стены штукатурили, чтобы защитить здание от осадков. Внутри важно сначала обеспечить постоянную температуру и просушить помещения. После этого можно планировать реставрацию росписей и внутреннюю отделку.</p><h2>Верхний придел — следующий этап</h2><p>Обустройство верхнего, исторически холодного придела рассматривается как дальнейшая перспектива. Срок открытия и решение об отоплении не определены: сейчас приоритетом остаётся сохранение нижнего храма.</p><Link className="button button--navy" to="/prikhodskaya-zhizn/volonterstvo/">Как помочь трудом</Link></article><MissingInfo title="Текущий ход работ" items={PLACEHOLDERS.restoration} /></section></>;
}

function SchedulePage() {
  const showSpecialService = isSpecialServiceUpcoming();
  return (
    <><PageHero eyebrow="Богослужения" title="Расписание служб" lead="Постоянное расписание известно. Праздничные изменения публикуются после решения настоятеля." breadcrumbs={[{ label: "Богослужения" }, { label: "Расписание" }]} />
      <section className="schedule-page section-wrap"><div className="schedule-callout ornamental-frame"><CalendarDays size={38} /><p className="eyebrow">Постоянное расписание</p><h2>Каждую субботу · 09:00</h2><p>Божественная литургия. Исповедь совершается во время богослужения, ориентировочно около 11:00. Время может изменяться примерно на 30 минут.</p><a className="button button--gold" href="tel:+79126516432"><Phone size={18} /> Уточнить по телефону</a></div>{showSpecialService ? <div className="schedule-special ornamental-frame"><p className="eyebrow">Ближайшее особое богослужение</p><h2>5 сентября · 08:30</h2><p>Архиерейская Божественная литургия. Богослужение возглавит епископ Алапаевский и Ирбитский Сергий.</p><Link className="text-link" to="/novosti/arkhiereyskaya-liturgiya-5-sentyabrya-2026/">Открыть объявление <ArrowRight size={16} /></Link></div> : <MissingInfo title="Для публикации праздничного расписания" items={PLACEHOLDERS.schedule} />}</section>
      <section className="section-wrap schedule-notes"><div className="schedule-note"><Users size={22} /><p><strong>Воскресная школа</strong><span>Занятия проходят по субботам с 09:20 до 10:30–11:00. После занятия дети идут в храм на Причастие.</span></p></div><div className="schedule-note"><Info size={22} /><p><strong>Праздничные службы</strong><span>Расписание зависит от служения отца Фёдора в Усть-Ницинском и Туринске. Обычно изменения становятся известны примерно за неделю. Перед дальней поездкой позвоните в приход.</span></p></div></section>
      <section className="section-wrap section-block"><article className="prose"><h2>Престольные праздники</h2><p>Святая Троица и Успение Пресвятой Богородицы — два престольных праздника храма. Сейчас службы проходят в Успенском приделе. Дату и время каждого праздничного богослужения настоятель объявляет отдельно.</p></article></section>
      <section className="section-wrap section-block"><RelatedLinks items={[{ eyebrow: "Онлайн", title: "Подать записку", path: "/treby-online/" }, { eyebrow: "Справка", title: "Таинства и требы", path: "/bogosluzheniya/tainstva-i-treby/" }, { eyebrow: "Поездка", title: "Информация паломникам", path: "/palomnikam/" }]} /></section></>
  );
}

function ServicesPage({ openRequest }) {
  return (
    <><PageHero eyebrow="Богослужения" title="Таинства, требы и записки" lead="Сведения о порядке обращения собраны по итогам встречи с представителями прихода. Онлайн-оплата пока отключена." breadcrumbs={[{ label: "Богослужения" }, { label: "Таинства и требы" }]} />
      <section className="section-wrap section-block">
        <div className="verification-banner verification-banner--warning"><ShieldCheck size={25} /><p><strong>Демонстрационный режим</strong><span>Форма не отправляет данные в приход и не списывает средства. Для обращения свяжитесь с настоятелем.</span></p></div>
        <div className="service-catalog">{SERVICES.map((item, index) => <article key={item.id}><span>0{index + 1}</span><h2>{item.title}</h2><p>{item.description}</p><button className="button button--navy" type="button" onClick={() => openRequest(item.id)}>Открыть демо-форму</button></article>)}</div>
        <section className="sacrament-info"><div><p className="eyebrow">По договорённости с настоятелем</p><h2>Таинства и частные требы</h2><p>Крещение совершается после огласительной беседы. Венчание, отпевание, соборование, освящение дома, автомобиля или организации согласуются с отцом Фёдором по телефону.</p><p>Соборование совершается Великим постом; остальные даты необходимо уточнять. По вопросам подготовки к таинству и личной встречи позвоните настоятелю.</p></div><a className="button button--gold" href="tel:+79126516432"><Phone size={18} /> Позвонить настоятелю</a></section>
        <div className="process-grid"><div><CheckCircle2 size={24} /><strong>1. Выберите обращение</strong><p>В демо-форме можно посмотреть виды записок.</p></div><div><FileText size={24} /><strong>2. Укажите имена</strong><p>Крещёные имена, каждое с новой строки.</p></div><div><ShieldCheck size={24} /><strong>3. Свяжитесь с приходом</strong><p>Сейчас записка из формы не отправляется. Используйте телефон настоятеля или сообщество VK.</p></div></div>
      </section></>
  );
}

function NotesGuidePage({ openRequest }) {
  return (
    <><PageHero eyebrow="Богослужения" title="Как подать записку" lead="Приход принимает разовые поминовения о здравии и об упокоении. Форма построена по знакомому принципу бумажной церковной записки." breadcrumbs={[{ label: "Богослужения" }, { label: "Как подать записку" }]} /><section className="guide-grid section-wrap"><article><span>01</span><h2>Выберите поминовение</h2><p>Отдельно укажите: «О здравии» или «Об упокоении». После этого выберите доступный вид требы.</p></article><article><span>02</span><h2>Добавьте до 12 имён</h2><p>Каждое имя вводится в отдельное поле. Указывайте полные имена, данные в Крещении.</p></article><article><span>03</span><h2>Оставьте контакт</h2><p>Телефон понадобится, чтобы ответственный сотрудник подтвердил получение записки.</p></article><article><span>04</span><h2>Получите подтверждение</h2><p>Записку планируется передавать на ближайшую субботнюю или праздничную службу.</p></article></section><section className="note-guidance section-wrap"><div><p className="eyebrow">Важно</p><h2>Онлайн-записка помогает тем, кто не может приехать лично</h2><p>Она не заменяет участие в богослужении, исповедь, Причастие и живую приходскую жизнь. Сорокоуст, длительные монастырские поминовения и Неусыпаемая Псалтирь в форму храма не включены.</p></div><div><p className="eyebrow">Правила имён</p><h2>Что ещё согласует настоятель</h2><p>Официальные сайты обителей используют разные правила падежа имён. Поэтому перед запуском отец Фёдор должен утвердить окончательную памятку именно для этого прихода.</p></div></section><section className="section-wrap vk-callout"><div><p className="eyebrow">Уже сейчас</p><h2>Написать в сообщество прихода</h2><p>В сообществе VK указано, что имена для поминовения можно передать личным сообщением группе.</p></div><SourceLink href={VK_COMMUNITY_URL}>Открыть сообщество VK</SourceLink></section><div className="center-action section-wrap"><button className="button button--gold" type="button" onClick={() => openRequest("note")}>Открыть новую демо-форму</button></div></>
  );
}

function NewsPage() {
  const categories = ["Все", "Новости прихода", "Служение настоятеля", "Жизнь благочиния"];
  const [category, setCategory] = useState("Все");
  const filtered = category === "Все" ? ORDERED_NEWS : ORDERED_NEWS.filter((item) => item.category === category);
  return (
    <><PageHero eyebrow="Хроника" title="Новости" lead="Новости самого прихода отделены от материалов о служении настоятеля в епархии и других храмах." breadcrumbs={[{ label: "Новости" }]} /><section className="section-wrap section-block"><div className="news-filters" role="group" aria-label="Фильтр новостей">{categories.map((item) => <button type="button" className={item === category ? "is-active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div><div className="news-list">{filtered.map((item, index) => <NewsCard item={item} featured={category === "Все" && index === 0} key={item.slug} />)}</div><MissingInfo title="Для регулярного обновления новостей прихода" items={["новые объявления и отчёты о событиях", "согласованные фотографии и подписи авторов", "контакт ответственного за публикации"]} /></section></>
  );
}

function NewsArticlePage({ article }) {
  if (!article) return <NotFoundPage />;
  const sourceText = article.sourceNote || "Краткий пересказ официального сообщения Алапаевской епархии. Для постоянного использования фотографий необходимо получить разрешение правообладателя.";
  return (
    <><PageHero eyebrow={article.category} title={article.title} lead={article.summary} breadcrumbs={[{ label: "Новости", path: "/novosti/" }, { label: article.title }]} compact /><article className="article-page section-wrap"><div className="article-meta"><time dateTime={article.isoDate}>{article.date}</time><span>{article.category}</span></div>{article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="article-source"><Info size={22} /><p><strong>Основание публикации</strong><span>{sourceText}</span></p></div>{article.source && <SourceLink href={article.source}>Читать оригинал на сайте епархии</SourceLink>}<div className="article-back"><Link className="button button--navy" to="/novosti/">Вернуться ко всем новостям</Link></div></article></>
  );
}

function ParishLifePage() {
  const icons = [Users, HandHeart, Church, HeartHandshake];
  return (
    <><PageHero eyebrow="Жизнь общины" title="Приходская жизнь" lead="Воскресная школа, семейные встречи, адресная помощь и общие дела прихожан." breadcrumbs={[{ label: "Приходская жизнь" }]} /><section className="project-grid section-wrap">{Object.entries(PARISH_PAGES).map(([route, page], index) => { const Icon = icons[index]; return <article key={route}><Icon size={30} strokeWidth={1.2} /><h2><Link to={route}>{page.title}</Link></h2><p>{page.description}</p><Link className="text-link" to={route}>Подробнее <ArrowRight size={16} /></Link></article>; })}</section><section className="section-wrap section-block"><RelatedLinks items={[{ eyebrow: "Гостям", title: "Приём паломников", path: "/palomnikam/" }, { eyebrow: "Помощь храму", title: "Восстановление", path: "/o-khrame/vosstanovlenie/" }, { eyebrow: "Фотоархив", title: "Фотогалерея", path: "/media/foto/" }]} /></section></>
  );
}

function GalleryPage() {
  return (
    <><PageHero eyebrow="Медиатека" title="Фотогалерея" lead="Храм, его настоятель и Венецкая икона Божией Матери. Источники указаны под фотографиями." breadcrumbs={[{ label: "Приходская жизнь", path: "/prikhodskaya-zhizn/" }, { label: "Фотогалерея" }]} />
      <section className="gallery-grid section-wrap">
        <figure className="gallery-item gallery-item--wide"><img src={assetHref("ust-nitsinskoe-church.jpg")} alt="Храм Святой Троицы в селе Усть-Ницинское" /><figcaption><strong>Храм Святой Троицы</strong><SourceLink href={OFFICIAL_PARISH_URL}>Официальная карточка прихода</SourceLink></figcaption></figure>
        <figure className="gallery-item"><img src={assetHref("fedor-gerasimov.jpg")} alt="Настоятель Фёдор Герасимов" /><figcaption><strong>Настоятель Фёдор Герасимов</strong><SourceLink href={OFFICIAL_RECTOR_URL}>Алапаевская епархия</SourceLink></figcaption></figure>
        <figure className="gallery-item gallery-item--icon"><img src={assetHref("venetskaya-ikona.jpg")} alt="Венецкая икона Божией Матери" width="401" height="600" loading="lazy" /><figcaption><strong>Венецкая икона</strong><SourceLink href="https://santosepulcro.co.il/icons/venetskaya-ikona-presvyatoy-bogoroditsy/">Открытая публикация об образе</SourceLink></figcaption></figure>
      </section><section className="section-wrap vk-callout"><div><p className="eyebrow">Фотоархив прихода</p><h2>Храм Святой Троицы в VK</h2><p>Больше фотографий богослужений и приходских событий — в сообществе храма.</p></div><SourceLink href={VK_COMMUNITY_URL}>Открыть фотоархив в VK</SourceLink></section></>
  );
}

function PilgrimsPage() {
  return (
    <><PageHero eyebrow="Гостям храма" title="Паломникам" lead="Посещение святыни, экскурсия и трапеза по предварительной договорённости с настоятелем." breadcrumbs={[{ label: "Паломникам" }]} /><section className="content-layout section-wrap"><article className="prose"><h2>Как добраться</h2><p>Адрес: 623943, Свердловская область, Слободо-Туринский район, село Усть-Ницинское, улица Подгорная, 7. Рядом с храмом достаточно места для парковки.</p><SourceLink href="https://yandex.ru/maps/?text=Усть-Ницинское%20Подгорная%207">Построить маршрут к храму</SourceLink><h2>Общественный транспорт</h2><p>В открытом расписании есть автобусное сообщение между Туринской Слободой и остановкой «Усть-Ницинское». Выберите дату поездки и проверьте прямой и обратный рейсы: время и дни движения могут меняться.</p><div className="inline-actions"><SourceLink href="https://rasp.yandex.ru/bus/turinskaya-sloboda--ust-nitsinskoe">Из Туринской Слободы</SourceLink><SourceLink href="https://rasp.yandex.ru/bus/ust-nitsinskoe--turinskaya-sloboda">Обратное направление</SourceLink></div><h2>Экскурсия и трапеза</h2><p>Отец Фёдор проводит экскурсии и рассказывает о храме и Венецкой иконе. Для группы можно заранее согласовать чай или обед в приходской трапезной. При звонке сообщите дату и количество гостей — настоятель передаст информацию тем, кто готовит трапезу.</p><h2>Доступность и отдых</h2><p>В храм и трапезную можно попасть на кресле-коляске; при входе в храм есть небольшой пандус. Если понадобится помощь, предупредите об этом перед приездом.</p><p>Ночлег не предоставляется. Отдельный приходской домик используется как резервное помещение, а не как паломническая гостиница.</p></article><aside className="fact-panel ornamental-frame"><p className="eyebrow">Перед поездкой</p><h2>Позвоните настоятелю</h2><p>Согласуйте время посещения, экскурсию и трапезу. Для группы сообщите число взрослых и детей; при необходимости обсудите помощь маломобильным гостям.</p><a className="button button--gold" href="tel:+79126516432"><Phone size={18} /> +7 912 651-64-32</a><p>Постоянная литургия — по субботам в 09:00. Посещение в другое время согласуется отдельно.</p><Link className="text-link" to="/o-khrame/svyatyni/">О Венецкой иконе <ArrowRight size={16} /></Link></aside></section></>
  );
}

function DonationsPage({ openRequest }) {
  return (
    <><PageHero eyebrow="Помощь храму" title="Пожертвовать" lead="Раздел пожертвований будет подготовлен отдельно. Сейчас приём платежей на сайте отключён." breadcrumbs={[{ label: "Пожертвовать" }]} /><section className="donation-page section-wrap"><article className="donation-card ornamental-frame"><HandHeart size={44} strokeWidth={1.1} /><p className="eyebrow">Сохранение храма</p><h2>Подготовка к зиме</h2><p>Ближайшие задачи прихода — наладить отопление и сохранить внутренние росписи. О текущих работах можно прочитать на отдельной странице.</p><Link className="button button--gold" to="/o-khrame/vosstanovlenie/">Восстановление храма</Link></article></section></>
  );
}

function ContactsPage() {
  const mapUrl = "https://yandex.ru/maps/?text=%D0%A1%D0%B2%D0%B5%D1%80%D0%B4%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2C%20%D1%81.%20%D0%A3%D1%81%D1%82%D1%8C-%D0%9D%D0%B8%D1%86%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B5%2C%20%D1%83%D0%BB.%20%D0%9F%D0%BE%D0%B4%D0%B3%D0%BE%D1%80%D0%BD%D0%B0%D1%8F%2C%207";
  return (
    <><PageHero eyebrow="Связь с приходом" title="Контакты" lead="Позвоните перед поездкой, чтобы уточнить расписание и возможность встречи." breadcrumbs={[{ label: "Контакты" }]} /><section className="contacts-page section-wrap"><div className="contact-main"><p className="eyebrow">Храм Святой Троицы</p><h2>село Усть-Ницинское</h2><address><a href={mapUrl} target="_blank" rel="noreferrer"><MapPin size={24} /><span>623943, Свердловская область,<br />с. Усть-Ницинское, ул. Подгорная, 7</span></a><a href="tel:+79126516432"><Phone size={24} /><span>+7 912 651-64-32</span></a><a href={VK_COMMUNITY_URL} target="_blank" rel="noreferrer"><ExternalLink size={24} /><span>Сообщество прихода в VK</span></a></address><p className="contact-note"><Clock3 size={18} /> Время посещения и личной встречи уточняйте по телефону. Официальная электронная почта прихода готовится.</p></div><div className="contact-map"><img src={assetHref("ust-nitsinskoe-church.jpg")} alt="Храм Святой Троицы" /><a href={mapUrl} target="_blank" rel="noreferrer">Построить маршрут <ExternalLink size={16} /></a></div></section></>
  );
}

function DocumentsPage() {
  return (
    <><PageHero eyebrow="Официальные материалы" title="Документы прихода" lead="Раздел предназначен для официальных документов, утверждённых приходом." breadcrumbs={[{ label: "Документы" }]} /><section className="section-wrap section-block"><article className="prose"><h2>Раздел готовится</h2><p>Документы будут опубликованы после отдельного согласования. До запуска соответствующих сервисов сайт не принимает платежи и не передаёт данные из демонстрационных форм.</p><Link className="button button--navy" to="/kontakty/">Связаться с приходом</Link></article></section></>
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
    <footer className="site-footer"><div className="footer-main section-wrap"><div className="footer-brand"><Church size={39} strokeWidth={1.15} /><p><strong>Храм Святой Троицы</strong><span>село Усть-Ницинское</span></p></div><div className="footer-contacts"><a href="tel:+79126516432"><Phone size={16} /> +7 912 651-64-32</a><span><MapPin size={16} /> ул. Подгорная, 7</span><a href={VK_COMMUNITY_URL} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Сообщество в VK</a></div><nav aria-label="Ссылки в подвале"><Link to="/o-khrame/">О храме</Link><Link to="/novosti/">Новости</Link><Link to="/bogosluzheniya/raspisanie/">Расписание</Link><button type="button" onClick={() => openRequest("note")}>Подать записку</button><Link to="/documents/">Документы</Link><Link to="/karta-sayta/">Карта сайта</Link></nav></div><div className="footer-bottom section-wrap"><span>© {new Date().getFullYear()} Храм Святой Троицы, с. Усть-Ницинское</span><span>Версия для согласования · формы и оплата работают в демонстрационном режиме</span></div></footer>
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
    document.title = article ? `${article.title} — Храм Святой Троицы` : PARISH_PAGES[path] ? `${PARISH_PAGES[path].title} — Храм Святой Троицы` : path === "/o-khrame/svyatyni/venetskaya-ikona/" ? "Венецкая икона Божией Матери — Храм Святой Троицы" : ROUTE_TITLES[path] || "Страница не найдена — Храм Святой Троицы";
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
    if (PARISH_PAGES[path]) return <ParishDetailPage path={path} PageHero={PageHero} Link={Link} />;
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
