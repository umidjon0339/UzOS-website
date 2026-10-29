import type { Locale } from "@/i18n/config";

// The 12 managements of UzOS, in the order a student meets them.
// "planned" ones are not written yet; the site shows them so the
// whole map of an operating system is visible from day one.

type Text = Record<Locale, string>;

export type OsModule = {
  id: string;
  folder: string; // folder in the UzOS repo, under modules/
  status: "ready" | "planned";
  icon: string; // SVG path, 24x24, drawn with a stroke
  commands: string[]; // a few commands to try (empty when planned)
  name: Text;
  text: Text;
};

export const osModules: OsModule[] = [
  {
    id: "process",
    folder: "process_management",
    status: "ready",
    icon: "M4 6h7v5H4zM13 13h7v5h-7zM7.5 11v4.5H13M16.5 13V8.5H11",
    commands: ["ps", "exec", "kill"],
    name: { en: "Process management", uz: "Jarayonlarni boshqarish", ru: "Управление процессами" },
    text: {
      en: "Starts, runs and ends programs: the process table, switching between programs, loading ELF files, signals.",
      uz: "Dasturlarni ishga tushiradi va tugatadi: jarayonlar jadvali, dasturlar orasida almashish, ELF fayllarni yuklash, signallar.",
      ru: "Запускает и завершает программы: таблица процессов, переключение между ними, загрузка ELF, сигналы.",
    },
  },
  {
    id: "memory",
    folder: "memory_management",
    status: "ready",
    icon: "M4 7h16v10H4zM8 7V4M12 7V4M16 7V4M8 20v-3M12 20v-3M16 20v-3",
    commands: ["meminfo", "pagewalk", "memtest"],
    name: { en: "Memory management", uz: "Xotirani boshqarish", ru: "Управление памятью" },
    text: {
      en: "Shares out the RAM: 4 KB frames, paging, the kernel heap, and sbrk / mmap for programs.",
      uz: "Operativ xotirani taqsimlaydi: 4 KB li bloklar, sahifalash (paging), yadro xotirasi, dasturlar uchun sbrk / mmap.",
      ru: "Распределяет оперативную память: кадры по 4 КБ, страничная адресация, куча ядра, sbrk / mmap для программ.",
    },
  },
  {
    id: "cpu",
    folder: "cpu_management",
    status: "ready",
    icon: "M7 7h10v10H7zM10 10h4v4h-4zM10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3",
    commands: ["top", "nice", "perf"],
    name: { en: "CPU management", uz: "Protsessorni boshqarish", ru: "Управление процессором" },
    text: {
      en: "Chooses which program runs next: priorities, FIFO / RR, fairness for programs that wait long, load average.",
      uz: "Keyingi navbatda qaysi dastur ishlashini tanlaydi: ustuvorlik, FIFO / RR, uzoq kutgan dasturlarga navbat berish, yuklama.",
      ru: "Выбирает, какая программа работает следующей: приоритеты, FIFO / RR, справедливость к долго ждущим, средняя загрузка.",
    },
  },
  {
    id: "device",
    folder: "device_management",
    status: "ready",
    icon: "M3 7h18v10H3zM6.5 10.5h1M10 10.5h1M13.5 10.5h1M17 10.5h.5M7 14h10",
    commands: ["devices", "date", "mode"],
    name: { en: "Device management", uz: "Qurilmalarni boshqarish", ru: "Управление устройствами" },
    text: {
      en: "Talks to the hardware: timer, keyboard, mouse, clock, screen, graphics card and speaker.",
      uz: "Qurilmalar bilan ishlaydi: taymer, klaviatura, sichqoncha, soat, ekran, videokarta va dinamik.",
      ru: "Работает с оборудованием: таймер, клавиатура, мышь, часы, экран, видеокарта и динамик.",
    },
  },
  {
    id: "io",
    folder: "io_management",
    status: "ready",
    icon: "M4 8h12M12 4l4 4-4 4M20 16H8M12 12l-4 4 4 4",
    commands: ["ioinfo"],
    name: { en: "I/O management", uz: "Kiritish-chiqarishni boshqarish", ru: "Управление вводом-выводом" },
    text: {
      en: "Gives programs file descriptors, small numbers for open files: open, read, write, close, seek.",
      uz: "Dasturlarga fayl deskriptorlarini beradi — ochiq fayllar uchun kichik raqamlar: open, read, write, close, seek.",
      ru: "Выдаёт программам файловые дескрипторы — номера открытых файлов: open, read, write, close, seek.",
    },
  },
  {
    id: "filesystem",
    folder: "filesystem_management",
    status: "ready",
    icon: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    commands: ["ls", "cat", "grep"],
    name: { en: "Filesystem management", uz: "Fayl tizimini boshqarish", ru: "Управление файловой системой" },
    text: {
      en: "Keeps files and folders: the directory tree, a RAM disk, and /proc files written by the kernel.",
      uz: "Fayl va papkalarni saqlaydi: papkalar daraxti, RAM disk va yadro yozadigan /proc fayllari.",
      ru: "Хранит файлы и папки: дерево каталогов, RAM-диск и файлы /proc, которые пишет ядро.",
    },
  },
  {
    id: "user",
    folder: "user_management",
    status: "ready",
    icon: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M21 20a6 6 0 0 0-4-5.6",
    commands: ["su", "passwd", "chmod"],
    name: { en: "User management", uz: "Foydalanuvchilarni boshqarish", ru: "Управление пользователями" },
    text: {
      en: "Knows who you are: accounts, passwords stored as SHA-256 hashes, login, file owners and permissions.",
      uz: "Kim ekaningizni biladi: hisoblar, SHA-256 xesh koʻrinishida saqlanadigan parollar, tizimga kirish, fayl egalari va ruxsatlar.",
      ru: "Знает, кто вы: учётные записи, пароли в виде хешей SHA-256, вход в систему, владельцы файлов и права.",
    },
  },
  {
    id: "security",
    folder: "security_management",
    status: "ready",
    icon: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6zM9 12l2 2 4-4",
    commands: ["seclab", "audit", "caps"],
    name: { en: "Security management", uz: "Xavfsizlikni boshqarish", ru: "Управление безопасностью" },
    text: {
      en: "Decides who may do what: privileges, an audit log nobody can erase, a check that the kernel was not changed.",
      uz: "Kim nima qila olishini belgilaydi: imtiyozlar, hech kim oʻchira olmaydigan audit jurnali, yadro oʻzgarmaganini tekshirish.",
      ru: "Решает, кому что можно: привилегии, журнал аудита, который нельзя стереть, проверка, что ядро не изменено.",
    },
  },
  {
    id: "shell",
    folder: "shell",
    status: "ready",
    icon: "M4 5h16v14H4zM8 10l3 2-3 2M13 15h3",
    commands: ["help", "history", "calc"],
    name: { en: "Shell", uz: "Buyruq qatori (shell)", ru: "Командная оболочка" },
    text: {
      en: "Reads what you type: commands, history, Tab completion, and colours that show if a command exists.",
      uz: "Siz yozgan buyruqlarni oʻqiydi: buyruqlar tarixi, Tab bilan toʻldirish, buyruq bor-yoʻqligini rang bilan koʻrsatish.",
      ru: "Читает, что вы вводите: история команд, дополнение по Tab, подсветка, есть ли такая команда.",
    },
  },
  {
    id: "ui",
    folder: "ui",
    status: "ready",
    icon: "M3 5h18v14H3zM3 9h18M9 9v10",
    commands: ["uzfetch", "statusbar"],
    name: { en: "User interface", uz: "Foydalanuvchi interfeysi", ru: "Интерфейс пользователя" },
    text: {
      en: "Makes output easy to read: colours by meaning, tables, progress bars, the status bar and the boot log.",
      uz: "Natijani oʻqishga qulay qiladi: maʼnosiga qarab ranglar, jadvallar, chiziqli koʻrsatkichlar, holat paneli va yuklanish jurnali.",
      ru: "Делает вывод понятным: цвета по смыслу, таблицы, индикаторы, строка состояния и журнал загрузки.",
    },
  },
  {
    id: "network",
    folder: "network_management",
    status: "planned",
    icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9M12 3c-2.5 2.5-3.5 5.5-3.5 9s1 6.5 3.5 9",
    commands: [],
    name: { en: "Network management", uz: "Tarmoqni boshqarish", ru: "Управление сетью" },
    text: {
      en: "Will connect UzOS to other computers: a network card driver, IP, TCP / UDP and sockets.",
      uz: "UzOS’ni boshqa kompyuterlar bilan bogʻlaydi: tarmoq kartasi drayveri, IP, TCP / UDP va soketlar.",
      ru: "Соединит UzOS с другими компьютерами: драйвер сетевой карты, IP, TCP / UDP и сокеты.",
    },
  },
  {
    id: "storage",
    folder: "storage_management",
    status: "planned",
    icon: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
    commands: [],
    name: { en: "Storage management", uz: "Disklarni boshqarish", ru: "Управление накопителями" },
    text: {
      en: "Will keep files after the power goes off: a disk driver and a file system stored on the disk.",
      uz: "Kompyuter oʻchgandan keyin ham fayllarni saqlab qoladi: disk drayveri va diskdagi fayl tizimi.",
      ru: "Сохранит файлы после выключения питания: драйвер диска и файловая система на диске.",
    },
  },
];
