'use strict';

(function () {
  // ---- Генерация фотографий ----- picture.js
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

  var generatePhotoUrl = function (index) {
    return 'photos/' + index + '.jpg';
  };

  var generateLikesNumber = function () {
    return window.getRandomInteger(25, 200);
  };

  var generateSingleComment = function (sentenceCount) {
    var comment = [];
    for (var i = 0; i < sentenceCount; i++) {
      comment.push(window.getRandomElement(PHOTO_COMMENTS));
    }
    return comment.join(' ');
  };

  var generateComments = function () {
    var comments = [];
    var commentsCount = window.getRandomInteger(1, 20);
    for (var i = 0; i < commentsCount; i++) {
      var sentenceCount = window.getRandomInteger(1, 2);
      comments.push(generateSingleComment(sentenceCount));
    }
    return comments;
  };

  var renderRandomPicture = function (urlIndex) {
    var randomPicture = {
      url: generatePhotoUrl(urlIndex),
      likes: generateLikesNumber(),
      comments: generateComments(),
      description: window.getRandomElement(PHOTO_DESCRIPTION)
    };
    return randomPicture;
  };

  var renderPicturesArr = function () {
    var picArr = [];

    for (var i = 0; i < PHOTOS_COUNT; i++) {
      picArr.push(renderRandomPicture(i + 1));
    }
    return window.shuffleArray(picArr);
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
    window.picturesList.appendChild(fragment);
  };

  // Открытие картинки по клику //picture.js
  var onPictureClick = function () {
    window.openPopup(window.bigPicture);
  };

  // Добавление обработчиков на все миниатюры // picture.js
  var addListenersToPictures = function () {
    var smallPicElements = window.picturesList.querySelectorAll('.picture');

    for (var i = 0; i < smallPicElements.length; i++) {
      var smallPic = smallPicElements[i];
      smallPic.addEventListener('click', onPictureClick);
      smallPic.addEventListener('keydown', window.onPictureEnterPress);
      document.addEventListener('keydown', window.onBigPictureOverlayEscPress);
    }
  };

  addListenersToPictures();

  window.picturesArr = renderPicturesArr();
  renderPictures(window.picturesArr);
})();
