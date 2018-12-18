'use strict';

(function () {

  // Работа с загрузкой изображения
  var uploadForm = window.picturesList.querySelector('#upload-file');
  var uploadOverlay = window.picturesList.querySelector('.img-upload__overlay');
  var uploadCancel = window.picturesList.querySelector('.img-upload__cancel');
  var uploadEffects = window.picturesList.querySelector('.img-upload__effects');
  var uploadPreview = window.picturesList.querySelector('.img-upload__preview');
  var uploadPreviewImg = window.picturesList.querySelector('.img-upload__preview img');

  var form = window.picturesList.querySelector('.img-upload__form');

  // Работа с эффектами
  var effectFielset = window.picturesList.querySelector('.effect-level');
  var effectLevelLine = window.picturesList.querySelector('.effect-level__line');
  var effectLevelPin = window.picturesList.querySelector('.effect-level__pin');
  var effectLevelValue = window.picturesList.querySelector('.effect-level__value');
  var effectLevelDepth = window.picturesList.querySelector('.effect-level__depth');
  var startCoords = {};
  var dragged = false;

  // Работа с масштабом изображения
  var scaleControlValue = window.picturesList.querySelector('.scale__control--value');
  var scaleControlSmaller = window.picturesList.querySelector('.scale__control--smaller');
  var scaleControlBigger = window.picturesList.querySelector('.scale__control--bigger');

  // Работа с полем ввода для хэштегов
  var hashInput = window.picturesList.querySelector('.text__hashtags');

  // Поле ввода комментария //
  var commentTextarea = window.picturesList.querySelector('.text__description');

  // Работа с эффектами

  var effectsDepth = function (level) {
    uploadPreviewImg.style.filter = '';

    if (uploadPreviewImg.classList.contains('effects__preview--chrome')) {
      uploadPreviewImg.style.filter = 'grayscale(' + level + ')';
    } else if (uploadPreviewImg.classList.contains('effects__preview--sepia')) {
      uploadPreviewImg.style.filter = 'sepia(' + level + ')';
    } else if (uploadPreviewImg.classList.contains('effects__preview--marvin')) {
      uploadPreviewImg.style.filter = 'invert(' + 100 * level + '%)';
    } else if (uploadPreviewImg.classList.contains('effects__preview--phobos')) {
      uploadPreviewImg.style.filter = 'blur(' + 3 * level + 'px)';
    } else if (uploadPreviewImg.classList.contains('effects__preview--heat')) {
      uploadPreviewImg.style.filter = 'brightness(' + ((2 * level) + 1) + ')';
    }
  };

  var changeEffectLevel = function (level) {
    effectLevelPin.style.left = level * 100 + '%';
    effectLevelDepth.style.width = level * 100 + '%';
    effectLevelValue.setAttribute('value', level * 100);
    effectsDepth(level);
  };

  // Обработка закрытия формы загрузки по ESC
  var onUploadOverlayEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      window.closePopup(uploadOverlay);
      changeEffectLevel(window.DEFAULT_EFFECT_LEVEL);
      uploadForm.setAttribute('value', '');
    }
  };

  // Обработка открытия формы загрузки при изменении формы
  var onChangeUploadForm = function () {
    window.openPopup(uploadOverlay);
    scaleControlValue.value = '100%';
    onScaleTransform(100);
    document.addEventListener('keydown', onUploadOverlayEscPress);
  };

  // Обработка закрытия формы загрузки по нажатию на крестик
  var onUploadCancelClick = function () {
    window.closePopup(uploadOverlay);
    document.removeEventListener('keydown', onUploadOverlayEscPress);
    changeEffectLevel(window.DEFAULT_EFFECT_LEVEL);
    uploadForm.setAttribute('value', '');
  };

  // Обработка действий по клику на эффект
  var onEffectClick = function (effectField) {
    var hideFielset = false;

    if (effectField.id === 'effect-none') {
      hideFielset = true;
    }

    return function () {
      uploadPreview.querySelector('img').className = '';
      uploadPreview.querySelector('img').classList.add('effects__preview--' + effectField.value);
      if (hideFielset) {
        effectFielset.classList.add('hidden');
      } else {
        effectFielset.classList.remove('hidden');
      }
      changeEffectLevel(window.DEFAULT_EFFECT_LEVEL);
    };
  };

  // Добавление обработчиков на эффекты
  var addEffectsListeners = function () {
    var effects = uploadEffects.querySelectorAll('.effects__item input');

    for (var i = 0; i < effects.length; i++) {
      effects[i].addEventListener('click', onEffectClick(effects[i]));
    }
  };

  addEffectsListeners();

  // Изменение глубины эффекта фильтра

  var effectLevelCalculate = function (shift) {
    return shift / effectLevelLine.offsetWidth;
  };

  // DRAG-n-DROP для ползунка
  var setStartCoords = function (x) {
    startCoords = {
      x: x
    };
  };

  var calcX = function (clientX, size) {
    var newX;

    var rect = effectLevelLine.getBoundingClientRect();
    if (clientX <= rect.left + size) {
      newX = rect.left;
    } else if (clientX >= rect.right - size) {
      newX = rect.right;
    } else {
      newX = clientX;
    }

    return newX;
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    dragged = true;
    var newX = calcX(moveEvt.clientX, effectLevelPin.offsetWidth);
    var shift = {
      x: startCoords.x - newX
    };

    var level = effectLevelCalculate(effectLevelPin.offsetLeft - shift.x);
    changeEffectLevel(level);

    setStartCoords(newX);
  };

  var onClickPreventDefault = function (draggedEvt) {
    draggedEvt.preventDefault();
    effectLevelPin.removeEventListener('click', onClickPreventDefault);
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    if (dragged) {
      effectLevelPin.addEventListener('click', onClickPreventDefault);
    }
  };

  var onMouseDownDialog = function (evt) {
    dragged = false;
    var newX = calcX(evt.clientX, effectLevelPin.offsetWidth);
    setStartCoords(newX);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  effectLevelPin.addEventListener('mousedown', onMouseDownDialog);

  // Изменение масштаба фотографии

  var onScaleTransform = function (value) {
    uploadPreview.style.transform = 'scale(' + parseInt(value, 10) / 100 + ')';
  };

  var onClickScaleControl = function (evt) {
    var scaleValue = scaleControlValue.value;
    var scaleValueInt = parseInt(scaleValue, 10);

    if (evt.target === scaleControlSmaller && scaleValueInt > 25) {
      scaleValueInt -= 25;
    } else if (evt.target === scaleControlBigger && scaleValueInt < 100) {
      scaleValueInt += 25;
    }

    scaleControlValue.value = scaleValueInt + '%';
    onScaleTransform(scaleValueInt);
  };

  scaleControlSmaller.addEventListener('click', onClickScaleControl);
  scaleControlBigger.addEventListener('click', onClickScaleControl);

  // --------- Валидация формы ----------

  // Ошибки валидации в массиве хэштегов
  var arrayErrors = function (hashArray) {
    if (hashArray.length > 5) {
      hashInput.setCustomValidity('нельзя указать больше пяти хэштегов');
    } else if (window.uniqArray(hashArray).length !== hashArray.length) {
      hashInput.setCustomValidity('один и тот же хэштег не может быть использован дважды');
    } else {
      hashInput.setCustomValidity('');
    }
  };

  // Ошибки валидации в отдельных хэштегах
  var hashTagErrors = function (hashArray) {
    for (var i = 0; i < hashArray.length; i++) {
      var hashTag = hashArray[i];
      if (hashTag[0] !== '#') {
        hashInput.setCustomValidity('хэштег начинается с символа #');
      } else if (hashTag.length === 1) {
        hashInput.setCustomValidity('хэштег не может состоять только из одной решётки');
      } else if (window.searchSymbolCountInString(hashTag, '#') > 1) {
        hashInput.setCustomValidity('хэштеги разделяются пробелами');
      } else if (hashTag.length >= 20) {
        hashInput.setCustomValidity('максимальная длина одного хэштега 20 символов, включая решётку');
      } else {
        hashInput.setCustomValidity('');
      }
    }
  };

  // Валидация формы
  var hashValidation = function () {
    var hashArray = hashInput.value.split(' ');
    arrayErrors(hashArray);
    if (!hashInput.validity.customError) {
      hashTagErrors(hashArray);
    }
  };

  uploadForm.addEventListener('change', onChangeUploadForm);
  uploadCancel.addEventListener('click', onUploadCancelClick);

  // Добавление обработчика валидации
  hashInput.addEventListener('input', hashValidation);
  hashInput.addEventListener('focus', function () {
    document.removeEventListener('keydown', onUploadOverlayEscPress);
  });
  hashInput.addEventListener('blur', function () {
    document.addEventListener('keydown', onUploadOverlayEscPress);
  });

  // Чтобы поле комментария не закрывалось по ESC
  commentTextarea.addEventListener('focus', function () {
    document.removeEventListener('keydown', onUploadOverlayEscPress);
  });
  commentTextarea.addEventListener('blur', function () {
    document.addEventListener('keydown', onUploadOverlayEscPress);
  });

  // Отправка формы
  var onUploadForm = function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(form), function () {
      uploadOverlay.classList.add('hidden');
    }, window.onError);
  };

  form.addEventListener('submit', onUploadForm);

})();
