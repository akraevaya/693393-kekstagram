'use strict';

var PHOTOS_COUNT = 25;

var PHOTO_COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var PHOTO_DESCRIPTION = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var DEFAULT_EFFECT_LEVEL = 1;

var bigPicture = document.querySelector('.big-picture');

// Работа с миниатюрами
var picturesList = document.querySelector('.pictures');

// Работа с загрузкой изображения
var uploadForm = picturesList.querySelector('#upload-file');
var uploadOverlay = picturesList.querySelector('.img-upload__overlay');
var uploadCancel = picturesList.querySelector('.img-upload__cancel');
var uploadEffects = picturesList.querySelector('.img-upload__effects');
var uploadPreview = picturesList.querySelector('.img-upload__preview');
var uploadPreviewImg = picturesList.querySelector('.img-upload__preview img');

// Работа с эффектами
var effectFielset = picturesList.querySelector('.effect-level');
var effectLevelLine = picturesList.querySelector('.effect-level__line');
var effectLevelPin = picturesList.querySelector('.effect-level__pin');
var effectLevelValue = picturesList.querySelector('.effect-level__value');
var effectLevelDepth = picturesList.querySelector('.effect-level__depth');
var startCoords = {};
var dragged = false;

// Работа с большим изображением
var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

// Работа с полем ввода для хэштегов
var hashInput = picturesList.querySelector('.text__hashtags');

// Работа со случайными значениями
var getRandomElement = function (arr) {
  var randomIndex = Math.floor(Math.random() * (arr.length - 1));
  return arr[randomIndex];
};

var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Перемешивает массив
var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// ---- Генерация фотографий -----

var generatePhotoUrl = function (index) {
  return 'photos/' + index + '.jpg';
};

var generateLikesNumber = function () {
  return getRandomInteger(25, 200);
};

var generateSingleComment = function (sentenceCount) {
  var comment = [];
  for (var i = 0; i < sentenceCount; i++) {
    comment.push(getRandomElement(PHOTO_COMMENTS));
  }
  return comment.join(' ');
};

var generateComments = function () {
  var comments = [];
  var commentsCount = getRandomInteger(1, 20);
  for (var i = 0; i < commentsCount; i++) {
    var sentenceCount = getRandomInteger(1, 2);
    comments.push(generateSingleComment(sentenceCount));
  }
  return comments;
};

var renderRandomPicture = function (urlIndex) {
  var randomPicture = {
    url: generatePhotoUrl(urlIndex),
    likes: generateLikesNumber(),
    comments: generateComments(),
    description: getRandomElement(PHOTO_DESCRIPTION)
  };
  return randomPicture;
};

var renderPicturesArr = function () {
  var picArr = [];

  for (var i = 0; i < PHOTOS_COUNT; i++) {
    picArr.push(renderRandomPicture(i + 1));
  }
  return shuffleArray(picArr);
};

var renderPhoto = function (templ, photo) {
  var pictureElement = templ.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = photo.url;
  pictureElement.querySelector('.picture__likes').textContent = photo.likes;
  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;

  return pictureElement;
};

var renderPictures = function (pictures) {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pictures.length; i++) {
    var newPictureElement = renderPhoto(pictureTemplate, pictures[i]);
    fragment.appendChild(newPictureElement);
  }
  picturesList.appendChild(fragment);
};

// ---- Генерация комментариев -----

var getAvatarUrl = function () {
  return 'img/avatar-' + getRandomInteger(1, 6) + '.svg';
};

var renderComment = function (templ, comment) {
  var commentElement = templ.cloneNode(true);
  commentElement.querySelector('.social__picture').src = getAvatarUrl();
  commentElement.querySelector('.social__text').textContent = comment;

  return commentElement;
};

var renderCommentsList = function (commentsArr) {
  var socialComment = bigPicture.querySelector('.social__comment');
  var commentsList = bigPicture.querySelector('.social__comments');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < commentsArr.length; i++) {
    var newCommentElement = renderComment(socialComment, commentsArr[i]);
    fragment.appendChild(newCommentElement);
  }

  while (commentsList.firstChild) {
    commentsList.removeChild(commentsList.firstChild);
  }

  commentsList.appendChild(fragment);
};

var changeBigPicture = function (picture) {
  bigPicture.classList.remove('hidden');
  bigPicture.querySelector('.big-picture__img img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  bigPicture.querySelector('.social__caption').textContent = picture.description;
};

var hideCommentLoader = function () {
  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
};

var hideCommentCount = function () {
  bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');
};

var renderBigPicture = function (picture) {
  changeBigPicture(picture);
  renderCommentsList(picture.comments);
  hideCommentLoader();
  hideCommentCount();
};

// -------------- События -----------------
// ----- Открытие и закрытие попапов ------

var openPopup = function (target) {
  target.classList.remove('hidden');
};

var closePopup = function (target) {
  target.classList.add('hidden');
};

// ---- Работа с миниатюрами ------

// Закрытие полной картинки по ESC
var onBigPictureOverlayEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup(bigPicture);
  }
};

// Закрытие полной картинки по клику
var onBigPictureCancelClick = function () {
  closePopup(bigPicture);

  document.removeEventListener('keydown', onBigPictureOverlayEscPress);
};

// Открытие полной картинки по ENTER
var onPictureEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openPopup(bigPicture);

    document.addEventListener('keydown', onBigPictureOverlayEscPress);
  }
};

// Открытие картинки по клику
var onPictureClick = function () {
  openPopup(bigPicture);
};

// Добавление обработчиков на все миниатюры
var addListenersToPictures = function () {
  var smallPicElements = picturesList.querySelectorAll('.picture');

  for (var i = 0; i < smallPicElements.length; i++) {
    var smallPic = smallPicElements[i];
    smallPic.addEventListener('click', onPictureClick);
    smallPic.addEventListener('keydown', onPictureEnterPress);
    document.addEventListener('keydown', onBigPictureOverlayEscPress);
  }
};

// ---- Работа с формой загрузки ---
// Работа с эффектами

var changeEffectLevel = function (level) {
  effectLevelPin.style.left = level * 100 + '%';
  effectLevelDepth.style.width = level * 100 + '%';
  effectLevelValue.value = level * 100;
  effectsDepth(level);
};

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

// Обработка закрытия формы загрузки по ESC
var onUploadOverlayEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup(uploadOverlay);
    changeEffectLevel(DEFAULT_EFFECT_LEVEL);
  }
};

// Обработка открытия формы загрузки при изменении формы
var onChangeUploadForm = function () {
  openPopup(uploadOverlay);
  document.addEventListener('keydown', onUploadOverlayEscPress);
};

// Обработка закрытия формы загрузки по нажатию на крестик
var onUploadCancelClick = function () {
  closePopup(uploadOverlay);
  uploadForm.value = '';
  document.removeEventListener('keydown', onUploadOverlayEscPress);
  changeEffectLevel(DEFAULT_EFFECT_LEVEL);
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
    changeEffectLevel(DEFAULT_EFFECT_LEVEL);
  };
};

// Добавление обработчиков на эффекты
var addEffectsListeners = function () {
  var effects = uploadEffects.querySelectorAll('.effects__item input');

  for (var i = 0; i < effects.length; i++) {
    effects[i].addEventListener('click', onEffectClick(effects[i]));
  }
};

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

var calcX = function (clientX) {
  var newX;

  var rect = effectLevelLine.getBoundingClientRect();
  if (clientX <= rect.left) {
    newX = rect.left;
  } else if (clientX >= rect.right) {
    newX = rect.right;
  } else {
    newX = clientX;
  }

  return newX;
};

var onMouseMove = function (moveEvt) {
  moveEvt.preventDefault();
  dragged = true;
  var newX = calcX(moveEvt.clientX);
  var shift = {
    x: startCoords.x - newX
  };
  setStartCoords(newX);

  var level = effectLevelCalculate(effectLevelPin.offsetLeft - shift.x);
  changeEffectLevel(level);
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
  setStartCoords(evt);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

effectLevelPin.addEventListener('mousedown', onMouseDownDialog);

// --------- Валидация формы ----------

// Массив, состояший только из уникальных элементов (исключает повторяющиеся элементы)
var uniqArray = function (arr) {
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
var searchSymbolCountInString = function (str, symb) {
  var count = 0;
  for (var i = 0; i < str.length; i++) {
    if (str[i] === symb) {
      count++;
    }
  }

  return count;
};

// Ошибки валидации в массиве хэштегов
var arrayErrors = function (hashArray) {
  if (hashArray.length > 5) {
    hashInput.setCustomValidity('нельзя указать больше пяти хэштегов');
  } else if (uniqArray(hashArray).length !== hashArray.length) {
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
    } else if (searchSymbolCountInString(hashTag, '#') > 1) {
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

// -------Сбор изображений и отрисовка --------

var picturesArr = renderPicturesArr();
renderPictures(picturesArr);
renderBigPicture(picturesArr[0]);

// Добавление обработчиков для эффектов
addEffectsListeners();

// Добавление обработчиков для формы загрузки
uploadForm.addEventListener('change', onChangeUploadForm);
uploadCancel.addEventListener('click', onUploadCancelClick);

// Добавление обработчиков миниатюр
addListenersToPictures();

// Добавление обработчика большой картинки
bigPictureCancel.addEventListener('click', onBigPictureCancelClick);
document.addEventListener('keydown', onBigPictureOverlayEscPress);

// Добавление обработчика валидации
hashInput.addEventListener('input', hashValidation);
hashInput.addEventListener('focus', function () {
  document.removeEventListener('keydown', onUploadOverlayEscPress);
});
hashInput.addEventListener('blur', function () {
  document.addEventListener('keydown', onUploadOverlayEscPress);
});
