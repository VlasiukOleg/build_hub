'use client';

import { Breadcrumbs, BreadcrumbItem } from '@heroui/react';

import { Pages } from '@/@types';

interface IAboutProps {}

const About: React.FC<IAboutProps> = () => {
  return (
    <section className="py-5 md:py-10 w-full">
      <div className="container">
        <Breadcrumbs className="mb-4">
          <BreadcrumbItem href="/">Головна</BreadcrumbItem>
          <BreadcrumbItem href={`${Pages.CATALOG}`}>Каталог</BreadcrumbItem>
          <BreadcrumbItem href={`${Pages.ABOUT}`}>Про проект</BreadcrumbItem>
        </Breadcrumbs>
        <h1 className="text-accent md:text-lg xl:text-xl font-bold text-center mb-2">
          ПРО ПРОЕКТ
        </h1>
        <h2 className="text-center font-bold text-sm md:text-base xl:text-lg mb-2">
          Структурована навігація за видами робіт
        </h2>
        <p className="text-xs md:text-sm xl:text-base mb-2">
          Ми створили концепцію вибору будівельних матеріалів не просто за типом
          товару, а за напрямком виконання робіт. Це означає, що клієнт починає
          не з переліку тисяч позицій, а з конкретного розділу, який відповідає
          його задачі. Наприклад:
          <ul className="pl-2 my-2">
            <li>
              1. Штукатурні роботи — всередині: машинна штукатурка, ручна,
              цементна, маяки, профілі, сітка тощо.;
            </li>
            <li>
              2. Гіпсокартонні системи — листи ГКЛ, профілі, підвіси, дюбелі,
              саморізи тощо.;
            </li>
            <li>
              3. Утеплення — мінеральна вата, пінопласт, клей, армуюча сітка,
              декоративная штукатурка, фарба тощо.;
            </li>
          </ul>
          Матеріали, які потрібні для конкретного виду робіт, зібрано в одному
          місці. Вам не потрібно &quot;бігати&quot; по різних сторінках в
          пошуках супутніх товарів — все вже згруповано логічно й зручно. Це
          дозволяє зекономити час та отримати повний набір матеріалів для
          конкретного етапу будівництва.
        </p>
        <h2 className="text-center font-bold text-sm md:text-base xl:text-lg mb-2">
          Доставка та розвантаження
        </h2>
        <p className="text-xs md:text-sm xl:text-base mb-2">
          Коли Ви додаєте матеріал або змінюєте його кількіть — ми миттєво
          розраховуємо вартість доставки та розвантаження на основі ваги
          замовленого матеріалу. Також в розділі розвантаження є багато
          налаштувань (відстань заносу матеріалу, тип ліфта, тип будинку, тощо).
        </p>
        <p className="text-xs md:text-sm xl:text-base mb-2">
          Також доступна карта складів — ви можете самостійно обрати найближчий
          до вас склад, де є потрібний товар у наявності. Це дає змогу отримати
          матеріали максимально швидко та без зайвих витрат.
        </p>
        <h2 className="text-center font-bold text-sm md:text-base xl:text-lg mb-2">
          Пошук серед 5000+ позицій
        </h2>
        <p className="text-xs md:text-sm xl:text-base mb-2">
          Ми свідомо обмежили кожну категорію лише найпопулярнішими та
          найчастіше використовуваними матеріалами — це робить вибір швидшим і
          простішим. Але якщо Ви не знайшли потрібний товар — не проблема.
          Потужний пошук по базі з понад 5000 товарів дозволяє легко знайти
          будь-який будматеріал за назвою.
        </p>
        <p className="text-accent md:text-lg xl:text-xl font-bold text-center mb-2">
          LUM — зручно, швидко, а головне по оптовим цінам зі складу!
        </p>
      </div>
    </section>
  );
};

export default About;
