'use strict';

(function () {

  window.util = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13
  };

  window.DEFAULT_EFFECT_LEVEL = 1;

  window.picturesList = document.querySelector('.pictures');

  window.bigPicture = document.querySelector('.big-picture');

  // Работа со случайными значениями // data.js
  window.getRandomElement = function (arr) {
    var randomIndex = Math.floor(Math.random() * (arr.length - 1));
    return arr[randomIndex];
  };

  window.getRandomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Перемешивает массив // data.js
  window.shuffleArray = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
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

})();

