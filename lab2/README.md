# Команды для запуска из терминала

### `npm run parallel`

Запустить одновременно "прокси-сервер" и клиент на HTTPS

*Генерация ssl-сертификатов написана ниже* 

*Рекомендуется перед запуском приложения через данную команду помимо `npm i` писать также `npm i npm-run-all`*

### `npm run start-https`

Запустить только клиент на HTTPS

### `npm run start`

Запустить только клиент на HTTP

### `npm run start-server`

Запустить только "прокси-сервер"

# Для стабильной работы приложения необходим API ключ

После успешной генерации необходимо указать его в файле `.env` в формате:

`REACT_APP_API_KEY="ваш ключ"`

# Генерация ssl-сертификатов:

1. `npm i mkcert`
2. Создать папку `.cert` рядом с `src`
3. `mkcert --install`
4. `mkcert -key-file ./.cert/key.pem -cert-file ./.cert/cert.pem "localhost"`
5. Создать файл `.env` рядом с `src`
6. В файле `.env` добавить:

`SSL_CRT_FILE=./.cert/cert.pem`
`SSL_KEY_FILE=./.cert/key.pem`
