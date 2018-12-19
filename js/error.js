'use strict';
(function () {
  var errorTmpl = document.querySelector('#error').content.querySelector('.error');
  var mainElement = document.querySelector('main');

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
