# Habit Tracker

Локальный трекер привычек без бэкенда. Проект фокусируется на простом ежедневном использовании, мягком UX без давления и быстром восстановлении после перерывов.

## Суть проекта

`Habit Tracker` помогает формировать привычки с минимальным трением:
- одна привычка = одно понятное действие;
- отметка выполнения за день в 1 клик;
- прогресс и стабильность важнее «идеальной» непрерывной серии;
- приложение работает офлайн и хранит данные в браузере.

Подход: `LocalStorage-first`. Никаких API, регистраций и зависимостей от сервера.

## Ключевые возможности

- Экран `Today` с активными/архивными привычками.
- Toggle `Done / Not done` на текущую дату.
- Быстрое создание привычек из готовых пресетов (частые и полезные шаблоны).
- Создание/редактирование привычки:
  - `Name`;
  - `Schedule`: `Daily` или `Weekly` (выбранные дни);
  - `Start date`;
  - `Color`;
  - `Note`.
- Экран `Habit details`:
  - `Current streak`;
  - `Best streak`;
  - completion rate за 7 и 30 дней;
  - heatmap за 30 дней.
- `Recovery mode`: кнопка `Restart streak` без удаления истории.
- `Settings`:
  - экспорт JSON;
  - импорт JSON;
  - reset данных;
  - настройка начала недели.
- Смена темы (`Light / Dark`) через верхний переключатель.
- Горячие клавиши:
  - `1` Today
  - `2` Habit details
  - `3` Settings
  - `N` новая привычка (на экране Today)
  - `Esc` закрыть модальное окно

## Технологии

- React 19
- TypeScript
- Vite
- Tailwind CSS
- lucide-react (icons)
- Zustand
- dayjs
- Vitest

## Архитектура

- `src/domain` — чистая бизнес-логика:
  - расписание (`schedule`),
  - streak,
  - статистика,
  - heatmap.
- `src/storage` — localStorage-адаптер, versioning и миграции.
- `src/state` — Zustand store, actions, селекторы состояния.
- `src/ui` — экраны и компоненты интерфейса.
  - `src/ui/components/common/Button.tsx` — единая кнопка с вариантами (`primary`, `ghost`, `tab`).
  - `src/ui/components/common/Card.tsx` — базовая карточка с тонами (`default`, `soft`, `danger`).
  - `src/ui/components/common/Panel.tsx` — общая обёртка экранов.

## Модель данных

Основные сущности:
- `Habit`
- `Completion`
- `settings` (включая тему)

Хранение completion:
- `completions: Record<habitId, Record<date, 1>>`

Плюсы структуры:
- быстрый доступ «привычка + дата»;
- простые вычисления streak и completion rates;
- удобная отрисовка heatmap.

## Хранение и миграции

Данные сохраняются в `localStorage` с версией схемы.
Текущая схема: `v2`.

Поддерживается миграция из старого формата в актуальный при загрузке.

## Быстрый старт

```bash
npm install
npm run dev
```

Открыть в браузере адрес, который покажет Vite (обычно `http://localhost:5173`).

## Скрипты

- `npm run dev` — запуск dev-сервера
- `npm run lint` — проверка линтером
- `npm run test` — unit-тесты
- `npm run build` — typecheck + production build

## Тестирование

Покрыты ключевые доменные кейсы:
- weekly schedule;
- startDate boundary;
- streak calculations;
- restart streak logic.

Файл тестов:
- `src/domain/stats.test.ts`

## Дизайн и UX

- Светлая тема по умолчанию.
- Поддержка тёмной темы через переключатель.
- Нейтральный «anti-shame» UX: пропуски не акцентируются как «провал».
- Чистая визуальная иерархия и адаптивная верстка для desktop/mobile.

## Планы развития

- Категории пресетов и избранные шаблоны.
- Доступность (a11y) и расширенные keyboard flows.
- Дополнительные графики стабильности.
- PWA-режим с явной offline-индикацией.

---

Made by Azamat Altymyshev
