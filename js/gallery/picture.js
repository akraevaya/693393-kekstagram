'use strict';

(function () {

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

  var loadPicturesArr = function (newPicArr) {
    for (var i = 0; i < newPicArr.length; i++) {
      window.picturesArr.push(newPicArr[i]);
    }
    renderPictures();
    addListenersToPictures();
    window.renderBigPicture(window.picturesArr[0]);
  };

  window.backend.download(loadPicturesArr, window.onError);
})();
