# Super Extension

Тестовое задание.

## Требования

1. ✓ Расширение загружает список сайтов по адресу
   http://www.softomate.net/ext/employees/list.json
2. ✓ Список сайтов обновляется расширением 1 раз в час, но не чаще,
   чем 1 раз в час
3. ✓ При посещении пользователем страницы из списка сайтов (поле
   «domain») – показывать сообщение на загруженной странице (поле
   «message»)
4. ✓ Сообщение должно быть инъекцией HTML-кода в страницу
5. ✓ Пользователь должен иметь возможность закрыть сообщение
6. ✓ Если пользователь закрыл сообщение - при следующей загрузке сайта
   сообщение не должно быть показано
7. ✓ Если пользователь не закрыл сообщение - при следующей загрузке
   сайта сообщение должно быть показано вновь, но не более 3-х раз за
   сессию браузера
8. ✓ Добавить кнопку расширения на панель инструментов браузера
9. ✓ По клику на кнопку вызывать popup-окно
10. ✓ В popup-окне отобразить список загруженных сайтов с возможностью
    перехода по сайтам

## Задание повышенной сложности

На сайтах google.[com|ru], bing.com в поисковой выдаче отметить
иконкой расширения сайты из загруженного списка. Никаких
дополнительных действий по нажатию на эту иконку не требуется.

## Сборка

Для сборки запустить скрипт `./build.sh`.

Если Bash под рукой нет, перейти в каталог `reactpopup/`, набрать `>
npm run build`, скопировать куда-нибудь содержимое `reactpopup/build/`
и туда же все файлы из `src/` и `public/`.
