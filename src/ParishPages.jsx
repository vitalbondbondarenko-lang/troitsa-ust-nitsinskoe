import { ArrowRight, ExternalLink, Phone } from "lucide-react";
import "./parish-pages.css";

const PARISH_PHONE = "+79126516432";
const PARISH_PHONE_LABEL = "+7 912 651-64-32";
const PARISH_COMMUNITY = "https://vk.ru/ust_nice";

export const PARISH_PAGES = {
  "/prikhodskaya-zhizn/voskresnaya-shkola/": {
    key: "school",
    title: "Воскресная школа",
    description: "Занятия воскресной школы при храме Святой Троицы проходят по субботам. Расписание и связь с настоятелем.",
    lead: "Субботние занятия для детей, участие в богослужении и помощь прихожан.",
  },
  "/prikhodskaya-zhizn/sotsialnaya-pomoshch/": {
    key: "help",
    title: "Адресная помощь",
    description: "Как обратиться за помощью в приход Святой Троицы или предложить помощь конкретному человеку и семье.",
    lead: "Помощь конкретным людям и семьям — по их нуждам и по предварительной договорённости.",
  },
  "/prikhodskaya-zhizn/volonterstvo/": {
    key: "volunteers",
    title: "Волонтёрство",
    description: "Помощь прихожан храму Святой Троицы: территория, уборка, хозяйственные работы и приготовление еды для воскресной школы.",
    lead: "Общие дела, в которых можно помочь храму своим временем и трудом.",
  },
  "/prikhodskaya-zhizn/semya-i-prazdniki/": {
    key: "family",
    title: "Семья и праздники",
    description: "Праздничные встречи прихода Святой Троицы: Троицкий фестиваль, Рождество, Пасха и дни рождения общины.",
    lead: "Праздники и встречи, которые объединяют детей, родителей и всю приходскую общину.",
  },
};

function ContactActions({ phoneOnly = false }) {
  return (
    <div className="inline-actions parish-detail__actions">
      {!phoneOnly && (
        <a className="button button--navy" href={PARISH_COMMUNITY} target="_blank" rel="noreferrer">
          Написать в сообщество <ExternalLink size={16} aria-hidden="true" />
        </a>
      )}
      <a className={`button ${phoneOnly ? "button--navy" : "parish-detail__phone-button"}`} href={`tel:${PARISH_PHONE}`}>
        <Phone size={16} aria-hidden="true" /> Позвонить
      </a>
    </div>
  );
}

function ContactPanel({ title, children, phoneOnly = false }) {
  return (
    <aside className="fact-panel ornamental-frame parish-detail__contact">
      <p className="eyebrow">Связаться с приходом</p>
      <h2>{title}</h2>
      <p>{children}</p>
      <p className="parish-detail__contact-name">Настоятель — отец Фёдор Герасимов</p>
      <a className="parish-detail__phone" href={`tel:${PARISH_PHONE}`}>{PARISH_PHONE_LABEL}</a>
      <ContactActions phoneOnly={phoneOnly} />
    </aside>
  );
}

function SchoolContent() {
  return (
    <>
      <article className="prose">
        <h2>Встречаемся по субботам</h2>
        <p>Воскресная школа при храме работает по субботам. Занятия начинаются в 09:20 и завершаются примерно в 10:30–11:00. После занятий дети идут на Причастие.</p>
        <dl className="parish-detail__schedule">
          <div><dt>День занятий</dt><dd>Суббота</dd></div>
          <div><dt>Начало</dt><dd>09:20</dd></div>
          <div><dt>Завершение</dt><dd>Около 10:30–11:00</dd></div>
        </dl>
        <h2>Как записаться</h2>
        <p>Если вы хотите привести ребёнка, свяжитесь с отцом Фёдором. У него можно уточнить условия участия, содержание занятий и подготовку к первому посещению.</p>
        <h2>Помощь школе</h2>
        <p>По субботам прихожане помогают готовить еду для детей. Если вы готовы присоединиться, заранее договоритесь с приходом о том, что приготовить и когда нужна помощь.</p>
      </article>
      <ContactPanel title="Первое посещение" phoneOnly>
        Перед поездкой уточните у настоятеля ближайшее занятие и расскажите, что хотите присоединиться к школе.
      </ContactPanel>
    </>
  );
}

function HelpContent() {
  return (
    <>
      <article className="prose">
        <h2>Помощь по конкретной нужде</h2>
        <p>Приход помогает отдельным людям и семьям. Сначала важно понять, какая помощь нужна, а затем договориться о её передаче.</p>
        <p>Пожалуйста, не привозите вещи без предварительного согласования. Уточните, нужны ли они сейчас и кому их можно передать.</p>
        <div className="parish-detail__help-options">
          <section className="parish-detail__help-option">
            <h2>Мне нужна помощь</h2>
            <p>Кратко опишите, в чём состоит нужда, и укажите, как с вами связаться. Подробности можно обсудить с приходом лично.</p>
            <p className="parish-detail__message-example">«Мне нужна помощь: … Со мной можно связаться: …»</p>
          </section>
          <section className="parish-detail__help-option">
            <h2>Я могу помочь</h2>
            <p>Расскажите, чем вы готовы помочь, и оставьте контакт для обратной связи. Перед передачей вещей или другой помощью дождитесь договорённости с приходом.</p>
            <p className="parish-detail__message-example">«Могу помочь: … Со мной можно связаться: …»</p>
          </section>
        </div>
      </article>
      <ContactPanel title="Обсудить помощь">
        Позвоните настоятелю или откройте сообщество прихода во «ВКонтакте», чтобы связаться с его представителями.
      </ContactPanel>
    </>
  );
}

function VolunteersContent() {
  return (
    <>
      <article className="prose">
        <h2>Помочь своим трудом</h2>
        <p>В приходе помогают сами прихожане: заботятся о территории, помещениях и повседневных нуждах храма. К этим общим делам можно присоединиться по договорённости.</p>
        <h2>В каких делах нужна помощь</h2>
        <ul className="parish-detail__list">
          <li>Покос травы на территории храма.</li>
          <li>Полив и прополка.</li>
          <li>Уборка помещений и мытьё окон.</li>
          <li>Работа с дровами и другие хозяйственные дела.</li>
          <li>Приготовление еды для воскресной школы по субботам.</li>
        </ul>
        <h2>Как присоединиться</h2>
        <p>Расскажите, чем можете помочь и когда вам удобно приехать. Представители прихода подскажут, какие работы нужны сейчас. Заранее согласуйте время, объём работы и то, что следует взять с собой.</p>
      </article>
      <ContactPanel title="Договориться об участии">
        Напишите в сообщество или позвоните. Даже для привычной хозяйственной работы лучше заранее уточнить время приезда.
      </ContactPanel>
    </>
  );
}

function FamilyContent() {
  return (
    <>
      <article className="prose">
        <h2>Троицкий фестиваль</h2>
        <p>В приходской жизни есть Троицкий фестиваль. Его проводят после праздника святых апостолов Петра и Павла — после 12 июля. Постоянной календарной даты у фестиваля нет: день проведения уточняют отдельно.</p>
        <h2>Праздники вместе</h2>
        <p>Прихожане собираются на рождественские и пасхальные встречи, отмечают дни рождения членов общины. Это возможность побыть вместе с детьми и близкими, пообщаться и разделить радость праздника.</p>
        <h2>Узнать о ближайшей встрече</h2>
        <p>Следите за сообщениями в сообществе прихода. Перед поездкой уточните дату, время и условия участия у представителей храма.</p>
      </article>
      <ContactPanel title="Присоединиться всей семьёй">
        Узнайте о ближайшем празднике или предложите свою помощь в подготовке встречи.
      </ContactPanel>
    </>
  );
}

const PAGE_CONTENT = {
  school: SchoolContent,
  help: HelpContent,
  volunteers: VolunteersContent,
  family: FamilyContent,
};

export function ParishDetailPage({ path, PageHero, Link }) {
  const page = PARISH_PAGES[path];
  if (!page) return null;
  const Content = PAGE_CONTENT[page.key];

  return (
    <>
      <PageHero
        eyebrow="Приходская жизнь"
        title={page.title}
        lead={page.lead}
        breadcrumbs={[{ label: "Приходская жизнь", path: "/prikhodskaya-zhizn/" }, { label: page.title }]}
        compact
      />
      <section className="content-layout section-wrap parish-detail"><Content /></section>
      <div className="section-wrap parish-detail__footer">
        <p className="parish-detail__source">Сведения предоставлены представителями прихода в сентябре 2026 года.</p>
        <nav className="related-links" aria-label="Другие разделы приходской жизни">
          {Object.entries(PARISH_PAGES).filter(([route]) => route !== path).map(([route, item]) => (
            <Link className="related-link" to={route} key={route}>
              <span>Приходская жизнь</span><strong>{item.title}</strong><ArrowRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
