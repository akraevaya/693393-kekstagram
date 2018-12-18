'use strict';

(function () {
  var mainElement = document.querySelector('main');
  var errorTmpl = document.querySelector('#error').content.querySelector('.error');

  window.util = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13
  };

  window.DEFAULT_EFFECT_LEVEL = 1;

  window.picturesList = document.querySelector('.pictures');

  window.bigPicture = document.querySelector('.big-picture');

  // Массив объектов изображений (комментарии, описание, url)
  // Заполняется в picture.js
  window.picturesArr = [];

  // Работа со случайными значениями // data.js
  window.getRandomElement = function (arr) {
    var randomIndex = Math.floor(Math.random() * (arr.length - 1));
    return arr[randomIndex];
  };

  window.getRandomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // ----- Открытие и закрытие попапов ------

  window.openPopup = function (target) {
    target.classList.remove('hidden');
  };

  window.closePopup = function (target) {
    target.classList.add('hidden');
  };

  // Массив, состояший только из уникальных элементов (исключает повторяющиеся элементы)
  window.uniqArray = function (arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      var uniq = true;
      var currentEl = arr[i].toLowerCase();

      for (var j = 0; j < newArr.length; j++) {
        uniq = !(newArr[j] === currentEl);
        if (!uniq) {
          break;
        }
      }

      if (uniq) {
        newArr.push(currentEl);
      }
    }
    return newArr;
  };

  // Поиск одинаковых символов в строке (например, решёток)
  window.searchSymbolCountInString = function (str, symb) {
    var count = 0;
    for (var i = 0; i < str.length; i++) {
      if (str[i] === symb) {
        count++;
      }
    }

    return count;
  };

  var onClickErrorBtn = function () {
    removeError();
  };

  var onErrorEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      removeError();
    }
  };

  var onClickOutsideError = function (evt) {
    if (evt.target.classList.contains('error')) {
      removeError();
    }
  };

  var addError = function (message) {
    var fragment = document.createDocumentFragment();
    errorTmpl.querySelector('.error__title').textContent = message;
    fragment.appendChild(errorTmpl);

    return fragment;
  };

  var removeError = function () {
    var errorElement = document.querySelector('.error');
    mainElement.removeChild(errorElement);
    document.removeEventListener('keydown', onErrorEscPress);
    document.removeEventListener('click', onClickOutsideError);
  };

  window.onError = function (message) {
    var errorElement = addError(message);
    mainElement.appendChild(errorElement);

    var buttons = document.querySelectorAll('.error__button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', onClickErrorBtn);
    }

    document.addEventListener('keydown', onErrorEscPress);
    document.addEventListener('click', onClickOutsideError);
  };

})();

