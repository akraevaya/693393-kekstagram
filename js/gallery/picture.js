'use strict';

(function () {

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

  var shuffleArray = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
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

  var buildPicturesArr = function () {
    for (var i = 0; i < PHOTOS_COUNT; i++) {
      window.picturesArr.push(renderRandomPicture(i + 1));
    }
    shuffleArray(window.picturesArr);
  };

  var renderPhoto = function (templ, photo) {
    var pictureElement = templ.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = photo.url;
    pictureElement.querySelector('.picture__likes').textContent = photo.likes;
    pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;

    return pictureElement;
  };

  var renderPictures = function () {
    var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < window.picturesArr.length; i++) {
      var newPictureElement = renderPhoto(pictureTemplate, window.picturesArr[i]);
      fragment.appendChild(newPictureElement);
    }
    window.picturesList.appendChild(fragment);
  };

  var onPictureClick = function () {
    window.openPopup(window.bigPicture);
  };

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

  buildPicturesArr(); // Заполняет window.picturesArr случайными значениями
  renderPictures();
})();
