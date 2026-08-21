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
      { photo: "/images/round2/arnold.jpg", name: "Арнольд Шварценеггер", realAge: 78 },
      { photo: "/images/round2/shabnam.png", name: "Шабнам Сураё", realAge: 44 },
      { photo: "/images/round2/leonardo.jpg", name: "Леонардо Ди Каприо", realAge: 51 },
      { photo: "/images/round2/meladze.png", name: "Валерий Меладзе", realAge: 60 },
      { photo: "/images/round2/angelina.jpg", name: "Анджелина Джоли", realAge: 50 },
      { photo: "/images/round2/safarmuhammad.png", name: "Сафармухаммад", realAge: 29 },
      { photo: "/images/round2/brad.jpg", name: "Брэд Питт", realAge: 62 },
      { photo: "/images/round2/manizha.png", name: "Манижа", realAge: 34 },
      { photo: "/images/round2/will.jpg", name: "Уилл Смит", realAge: 57 },
      { photo: "/images/round2/egor_kreed.png", name: "Егор Крид", realAge: 31 },
      { photo: "/images/round2/jackie.jpg", name: "Джеки Чан", realAge: 72 },
      { photo: "/images/round2/kirkorov.png", name: "Филипп Киркоров", realAge: 59 },
      { photo: "/images/round2/tom.jpg", name: "Том Круз", realAge: 63 },
      { photo: "/images/round2/shahrukh.jpg", name: "Шохрух Хан", realAge: 60 },
      { photo: "/images/round2/sylvester.jpg", name: "Сильвестр Сталлоне", realAge: 79 },
      { photo: "/images/round2/aishwarya.png", name: "Айшвария Рай", realAge: 52 },
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
      { photo: "/images/round4/walkman.jpg", description: "Плеер" },
      { photo: "/images/round4/camera.png", description: "Пленка для фотоаппарата" },
      { photo: "/images/round4/phone.jpg", description: "Дисковый телефон" },
      { photo: "/images/round4/grinder.jpg", description: "Ручная мясорубка" },
      { photo: "/images/round4/vacuum.png", description: "Старинный пылесос" },
      { photo: "/images/round4/clipper.jpg", description: "Машинка для стрижки" },
      { photo: "/images/round4/grace_disc.jpg", description: "Гимнастический круг" },
      { photo: "/images/round4/washboard.jpg", description: "Стиральная доска" },
      { photo: "/images/round4/pedometer.jpg", description: "Шагомер" },
      { photo: "/images/round4/dumpling_maker.jpg", description: "Пистолет для лепки пельменей" }
    ]
  },
  round5: {
    title: "Нереальные кадры",
    description: "Угадайте два фильма (обычно отечественный и зарубежный), которые перемешались в одном кадре.",
    items: [
      { photo: "/images/round5/14.jpg", title: "Великолепный век + Игра престолов" },
      { photo: "/images/round5/18.jpg", title: "Бриллиантовая рука + Матрица" },
      { photo: "/images/round5/19.jpg", title: "Барби + Терминатор 2" },
      { photo: "/images/round5/0.jpg", title: "Любой фильм с Джеки Чаном + Титаник" },
      { photo: "/images/round5/15.jpg", title: "Ирония судьбы + Аватар" },
      { photo: "/images/round5/1.jpg", title: "Чебурашка + Парк Юрского периода" },
      { photo: "/images/round5/2.jpg", title: "Джентльмены удачи + Клан Сопрано" },
      { photo: "/images/round5/3.jpg", title: "Белое солнце пустыни + Дюна" },
      { photo: "/images/round5/4.jpg", title: "Джентльмены удачи + Игра в кальмара" },
      { photo: "/images/round5/5.jpg", title: "Любой фильм с Шахрухом Ханом + Джокер" },
      { photo: "/images/round5/6.jpg", title: "Бременские музыканты + Ходячие Мертвецы" },
      { photo: "/images/round5/7.jpg", title: "Крестный отец + Бригада" },
      { photo: "/images/round5/8.jpg", title: "Звездные войны + Форсаж" },
      { photo: "/images/round5/9.jpg", title: "Криминальное чтиво + Гарри Поттер" },
      { photo: "/images/round5/10.jpg", title: "Служебный роман + Сияние" },
      { photo: "/images/round5/11.jpg", title: "Кавказская пленница + Парк Юрского Периода" },
      { photo: "/images/round5/12.jpg", title: "Крестный отец + Наруто" },
      { photo: "/images/round5/13.jpg", title: "Пираты Карибского моря + Гарри Поттер" }
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
