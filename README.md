# REST API on NODE.js

REST API сервер использующий Node.js, Express.js, Mongoose для работы с MongoDB.
Для авторизации через vk.com используется OAuth 2.0



## Запуск проекта

Для запуска проекта необходимы быть установлены Node.js и MongoDB

### Установка модулей

Для установки модулей откройте консоль в корне этого проекта и выполните следующую команду:
```
npm install
```



### Запуск сервера

Для запуска сервера вам необходимо запустить mongo.exe и mongod.exe.
После этого запустите команду
```
npm start
```

### Отправка запросов

Это приложение позволяет отправлять запросы через клиентскую часть

Для авторизации пользователя пройдите по ниже данному адресу и нажмите на кнопку "Go":
```
localhost:1337
```

После этого вас отправит на страницу отправки запросов.
Например, если вы хотите добавить новую запись в БД вы заполняете данные, cоответствущие кнопке POST, это отправит на сервер POST запрос
 
и вернет ответ в JSON виде:
```
{"message":"Photo created","photo":{"__v":0,"name":"NAME","path":"PATH","description":"DESCRIPTION","vkID":vkID,"_id":"RECORDID"}}
```
При нажатии на GET вы получаете список ваших записей, заполнив поле ID вы получите только одну запись, ID записи которой соответствует набранному вами
При запросе на множество записей вы так же можете ограничивать их число с помощью параметров limit и page, введенных в адресную строку,например,если у вас есть 20 записей и вы хотите получить 5-10 запись то на странице просмотра записей введите:
```
GET localhost:1337/api/photos/?limit5&page=1
```
Будут возвращены 5 записей такого типа:
```
{"_id":"ID","name":"NAME","path":"PATH","description":"DESCRIPTION","vkID":vkID,"__v":0
```
При нажатии на PUT вы посылаете PUT запрос на  обновление записи c указанным ID данными, указанными в поле:

Будет возвращено
```
{"message":"Photo updated","photo":{"_id":"ID","name":"NEWNAME","path":"NEWPATH","description":"NEWDESCRIPTION","vkID":vkID,"__v":0}}
```
При нажатии на DELETE вы посылаете DELETE запрос на  удаление записи с указанным ID

Будет возвращено
```
{"message":"Photo removed"}
```
Для просмотра имени текущего пользователя:
```
localhost:1337/user
```
Для деавторизации
```
localhost:1337/logout
```


