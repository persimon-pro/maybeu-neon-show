import { GameData } from './types';

export const gameData: GameData = {
  round1: {
    title: "Тонкий намёк",
    description: "Капитан спиной к экрану. Команда называет ассоциации. На одно слово ровно 20 секунд.",
    words: [
      "Рынок", "Стакан", "Такси", "Курутоб", "Свадьба",
      "Манты", "Плов", "Чайхана", "Халат", "Лепёшка",
      "Тандыр", "Хлопок", "Дыня", "Инжир", "Арык",
      "Горы", "Базар", "Маршрутка", "Памир", "Соседи"
    ]
  },
  round2: {
    title: "Сколько дашь?",
    description: "Угадывание возраста знаменитости по фото. Точно: +5 баллов, +/- 2 года: +1 балл.",
    items: [
      { photo: "/images/round2/arnold.webp", name: "Арнольд Шварценеггер", realAge: 78 },
      { photo: "/images/round2/shabnam.webp", name: "Шабнам Сураё", realAge: 44 },
      { photo: "/images/round2/leonardo.webp", name: "Леонардо Ди Каприо", realAge: 51 },
      { photo: "/images/round2/meladze.webp", name: "Валерий Меладзе", realAge: 60 },
      { photo: "/images/round2/angelina.webp", name: "Анджелина Джоли", realAge: 50 },
      { photo: "/images/round2/safarmuhammad.webp", name: "Сафармухаммад", realAge: 29 },
      { photo: "/images/round2/brad.webp", name: "Брэд Питт", realAge: 62 },
      { photo: "/images/round2/manizha.webp", name: "Манижа", realAge: 34 },
      { photo: "/images/round2/will.webp", name: "Уилл Смит", realAge: 57 },
      { photo: "/images/round2/egor_kreed.webp", name: "Егор Крид", realAge: 31 },
      { photo: "/images/round2/jackie.webp", name: "Джеки Чан", realAge: 72 },
      { photo: "/images/round2/kirkorov.webp", name: "Филипп Киркоров", realAge: 59 },
      { photo: "/images/round2/tom.webp", name: "Том Круз", realAge: 63 },
      { photo: "/images/round2/shahrukh.webp", name: "Шохрух Хан", realAge: 60 },
      { photo: "/images/round2/sylvester.webp", name: "Сильвестр Сталлоне", realAge: 79 },
      { photo: "/images/round2/aishwarya.webp", name: "Айшвария Рай", realAge: 52 },
      // Неиспользуемые/дополнительные:
      // { photo: "/images/round2/burak.png", name: "Бурак Озчивит", realAge: 41 }
    ]
  },
  round3: {
    title: "Пой по теме",
    description: "Команды по очереди поют песни на заданную тему за 1 минуту. +1 балл за каждую песню.",
    themes: [
      "Формы глагола «Любить»",
      "Женские имена",
      "Цветы и цвета",
      "География",
      "Погода и природа",
      "Птицы и животные",
      "Мужские имена",
      "Зимние песни",
      "Детская музыка",
      "Алкогольные напитки",
      "Психические заболевания"
    ]
  },
  round4: {
    title: "Неведомая штуковина",
    description: "Фотовикторина (предметы из СССР/90-х). Что это на самом деле?",
    items: [
      { photo: "/images/round4/walkman.webp", description: "Плеер" },
      { photo: "/images/round4/camera.webp", description: "Пленка для фотоаппарата" },
      { photo: "/images/round4/phone.webp", description: "Дисковый телефон" },
      { photo: "/images/round4/grinder.webp", description: "Ручная мясорубка" },
      { photo: "/images/round4/vacuum.webp", description: "Старинный пылесос" },
      { photo: "/images/round4/clipper.webp", description: "Машинка для стрижки" },
      { photo: "/images/round4/grace_disc.webp", description: "Гимнастический круг" },
      { photo: "/images/round4/washboard.webp", description: "Стиральная доска" },
      { photo: "/images/round4/pedometer.webp", description: "Шагомер" },
      { photo: "/images/round4/dumpling_maker.webp", description: "Пистолет для лепки пельменей" }
    ]
  },
  round5: {
    title: "Нереальные кадры",
    description: "Угадайте два фильма (обычно отечественный и зарубежный), которые перемешались в одном кадре.",
    items: [
      { photo: "/images/round5/14.webp", title: "Великолепный век + Игра престолов" },
      { photo: "/images/round5/18.webp", title: "Бриллиантовая рука + Матрица" },
      { photo: "/images/round5/19.webp", title: "Барби + Терминатор 2" },
      { photo: "/images/round5/0.webp", title: "Любой фильм с Джеки Чаном + Титаник" },
      { photo: "/images/round5/15.webp", title: "Ирония судьбы + Аватар" },
      { photo: "/images/round5/1.webp", title: "Чебурашка + Парк Юрского периода" },
      { photo: "/images/round5/2.webp", title: "Джентльмены удачи + Клан Сопрано" },
      { photo: "/images/round5/3.webp", title: "Белое солнце пустыни + Дюна" },
      { photo: "/images/round5/4.webp", title: "Джентльмены удачи + Игра в кальмара" },
      { photo: "/images/round5/5.webp", title: "Любой фильм с Шахрухом Ханом + Джокер" },
      { photo: "/images/round5/6.webp", title: "Бременские музыканты + Ходячие Мертвецы" },
      { photo: "/images/round5/7.webp", title: "Крестный отец + Бригада" },
      { photo: "/images/round5/8.webp", title: "Звездные войны + Форсаж" },
      { photo: "/images/round5/9.webp", title: "Криминальное чтиво + Гарри Поттер" },
      { photo: "/images/round5/10.webp", title: "Служебный роман + Сияние" },
      { photo: "/images/round5/11.webp", title: "Кавказская пленница + Парк Юрского Периода" },
      { photo: "/images/round5/12.webp", title: "Крестный отец + Наруто" },
      { photo: "/images/round5/13.webp", title: "Пираты Карибского моря + Гарри Поттер" }
    ]
  },
  round6: {
    title: "Мастера QWERTY",
    description: "Слово написано в неверной английской раскладке. Кто быстрее расшифрует?",
    themes: [
      {
        theme: "Супергерои",
        words: [
          { encoded: "HJ,JRJG", decoded: "РОБОКОП" },
          { encoded: ",’nvty", decoded: "БЭТМЕН" },
          { encoded: "Xtkjdtr-gfjr", decoded: "ЧЕЛОВЕК-ПАУК" },
          { encoded: "Cegthvty", decoded: "СУПЕРМЕН" },
          { encoded: "Frdfvty", decoded: "АКВАМЕН" },
          { encoded: "Dtlcgek", decoded: "ДЭДПУЛ" }
        ]
      },
      {
        theme: "Животные",
        words: [
          { encoded: "Ckjy", decoded: "СЛОН" },
          { encoded: "Vtldtlm", decoded: "МЕДВЕДЬ" },
          { encoded: "Kbcbrf", decoded: "ЛИСИЧКА" },
          { encoded: "Tyjnb", decoded: "ЕНОТИК" },
          { encoded: "Sbhfa", decoded: "ЖИРАФ" },
          { encoded: "Djkj", decoded: "ВОЛК" }
        ]
      }
    ]
  }
};
