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
var DEFAULT_EFFECT_LEVEL = 20;

var bigPicture = document.querySelector('.big-picture');

// Работа с миниатюрами
var picturesList = document.querySelector('.pictures');

// Работа с загрузкой изображения
var uploadForm = document.querySelector('#upload-file');
var uploadOverlay = document.querySelector('.img-upload__overlay');
var uploadCancel = document.querySelector('.img-upload__cancel');
var uploadEffects = document.querySelector('.img-upload__effects');
var uploadPreview = document.querySelector('.img-upload__preview');

// Работа с эффектами
var effectLevelPin = document.querySelector('.effect-level__pin');
var effectLevelValue = document.querySelector('.effect-level__value');

// Работа с большим изображением
var bigPictureCancel = document.querySelector('.big-picture__cancel');

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

  document.removeEventListener(
      'keydown',
      onBigPictureOverlayEscPress
  );
};

// Открытие полной картинки по ENTER
var onPictureEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openPopup(bigPicture);

    document.addEventListener(
        'keydown',
        onBigPictureOverlayEscPress
    );
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

// Обработка закрытия формы загрузки по ESC
var onUploadOverlayEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup(uploadOverlay);
  }
};

// Обработка открытия формы загрузки при изменении формы
var onChangeUploadForm = function () {
  openPopup(uploadOverlay);
  document.addEventListener(
      'keydown',
      onUploadOverlayEscPress
  );
};

// Обработка закрытия формы загрузки по нажатию на крестик
var onUploadCancelClick = function () {
  closePopup(uploadOverlay);
  document.querySelector('#upload-file').value = '';
  document.removeEventListener('keydown', onUploadOverlayEscPress);
};

// ---- Работа с эффектами -----

var changeEffectLevel = function (level) {
  effectLevelValue.value = level;
};

// Обработка действий по нажатию на ползунок
var onMouseupEffectLevelPin = function () {
  var fullWidth = effectLevelPin.parentElement.offsetWidth;
  var level = Math.floor(effectLevelPin.offsetLeft / (fullWidth / 100));

  changeEffectLevel(level);
};

// Обработка действий по клику на эффект
var onEffectClick = function (effectField) {
  return function () {
    changeEffectLevel(DEFAULT_EFFECT_LEVEL);
    uploadPreview.querySelector('img').className = '';
    uploadPreview.querySelector('img').classList.add('effects__preview--' + effectField.value);
  };
};

// Добавление обработчиков на эффекты
var addEffectsListeners = function () {
  var effects = uploadEffects.querySelectorAll('.effects__item input');

  for (var i = 0; i < effects.length; i++) {
    effects[i].addEventListener('click', onEffectClick(effects[i]));
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
effectLevelPin.addEventListener('mouseup', onMouseupEffectLevelPin);

// Добавление обработчика большой картинки
bigPictureCancel.addEventListener('click', onBigPictureCancelClick);
document.addEventListener('keydown', onBigPictureOverlayEscPress);
