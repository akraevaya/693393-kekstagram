'use strict';
(function () {
  var URL_GET = 'https://js.dump.academy/kekstagram/data';
  var URL_POST = 'https://js.dump.academy/kekstagram';

  var Code = {
    OK: 200,
    MOVED_PERMANENTLY: 301,
    MOVED_TEMPORARILY: 302,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  };

  var getXhr = function (xhr, onLoad, onError) {
    xhr.responseType = 'json';
    xhr.timeout = '10000';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case Code.OK:
          onLoad(xhr.response);
          break;
        case Code.MOVED_PERMANENTLY:
          error = 'Сервер переехал навсегда';
          break;
        case Code.MOVED_TEMPORARILY:
          error = 'Сервер временно переехал';
          break;
        case Code.BAD_REQUEST:
          error = 'Неверный запрос';
          break;
        case Code.UNAUTHORIZED:
          error = 'У вас недостаточно прав для выполнения этого действия';
          break;
        case Code.NOT_FOUND:
          error = 'Ничего не найдено';
          break;
        case Code.SERVER_ERROR:
          error = 'На сервере что-то пошло не так';
          break;
        default:
          error = 'Статус ответа: ' + xhr.status + '' + xhr.statusText;
      }
      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('timeout', function () {
      onError('Превышен лимит ожидания ' + xhr.timeout);
    });
  };

  var upload = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    getXhr(xhr, onLoad, onError);
    xhr.open('POST', URL_POST);
    xhr.send(data);
  };

  var download = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    getXhr(xhr, onLoad, onError);
    xhr.open('GET', URL_GET);
    xhr.send();
  };

  window.backend = {
    upload: upload,
    download: download
  };
})();
