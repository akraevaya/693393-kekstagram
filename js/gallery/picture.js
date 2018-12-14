'use strict';

(function () {
  // ---- Генерация фотографий ----- picture.js

  var generatePhotoUrl = function (index) {
    return 'photos/' + index + '.jpg';
  };

  var generateLikesNumber = function () {
    return window.getRandomInteger(25, 200);
  };

  var generateSingleComment = function (sentenceCount) {
    var comment = [];
    for (var i = 0; i < sentenceCount; i++) {
      comment.push(window.getRandomElement(window.PHOTO_COMMENTS));
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
      description: window.getRandomElement(window.PHOTO_DESCRIPTION)
    };
    return randomPicture;
  };

  var renderPicturesArr = function () {
    var picArr = [];

    for (var i = 0; i < window.PHOTOS_COUNT; i++) {
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
