'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  var renderPhoto = function (templ, photo) {
    var pictureElement = templ.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = photo.url;
    pictureElement.querySelector('.picture__likes').textContent = photo.likes;
    pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;

    return pictureElement;
  };

  var onPictureClick = function (picture) {
    return function () {
      window.renderBigPicture(picture);
      window.openPopup(window.bigPicture);
    };
  };

  var addListenersToPicture = function (element, picOjb) {
    element.addEventListener('click', onPictureClick(picOjb));
    element.addEventListener('keydown', window.onPictureEnterPress);
  };

  var renderPictures = function () {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < window.picturesArr.length; i++) {
      var newPictureElement = renderPhoto(pictureTemplate, window.picturesArr[i]);

      addListenersToPicture(newPictureElement, window.picturesArr[i]);
      fragment.appendChild(newPictureElement);
    }
    window.picturesList.appendChild(fragment);
  };

  var loadPicturesArr = function (newPicArr) {
    for (var i = 0; i < newPicArr.length; i++) {
      window.picturesArr.push(newPicArr[i]);
    }
    renderPictures();
  };

  window.backend.download(loadPicturesArr, window.onError);
})();
