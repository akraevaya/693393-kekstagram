'use strict';

(function () {

  var bigPictureCancel = window.bigPicture.querySelector('.big-picture__cancel');

  var createCommentElement = function (tmpl, comment) {
    var commentElement = tmpl.cloneNode(true);
    commentElement.querySelector('.social__picture').src = comment.avatar;
    commentElement.querySelector('.social__text').textContent = comment.message;

    return commentElement;
  };

  var renderCommentsList = function (comments) {
    var commentTempl = window.bigPicture.querySelector('.social__comment');
    var commentsList = window.bigPicture.querySelector('.social__comments');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < comments.length; i++) {
      var newCommentElement = createCommentElement(commentTempl, comments[i]);
      fragment.appendChild(newCommentElement);
    }

    while (commentsList.firstChild) {
      commentsList.removeChild(commentsList.firstChild);
    }

    commentsList.appendChild(fragment);
  };

  var changeBigPicture = function (picture) {
    window.bigPicture.querySelector('.big-picture__img img').src = picture.url;
    window.bigPicture.querySelector('.likes-count').textContent = picture.likes;
    window.bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
    window.bigPicture.querySelector('.social__caption').textContent = picture.description;
  };

  var hideCommentLoader = function () {
    window.bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  };

  var hideCommentCount = function () {
    window.bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');
  };

  window.renderBigPicture = function (picture) {
    changeBigPicture(picture);
    renderCommentsList(picture.comments);
    hideCommentLoader();
    hideCommentCount();
  };

  bigPictureCancel.addEventListener('click', window.onBigPictureCancelClick);
  document.addEventListener('keydown', window.onBigPictureOverlayEscPress);
})();
