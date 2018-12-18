'use strict';

(function () {

  var bigPictureCancel = window.bigPicture.querySelector('.big-picture__cancel');

  var getAvatarUrl = function () {
    return 'img/avatar-' + window.getRandomInteger(1, 6) + '.svg';
  };

  var renderComment = function (templ, comment) {
    var commentElement = templ.cloneNode(true);
    commentElement.querySelector('.social__picture').src = getAvatarUrl();
    commentElement.querySelector('.social__text').textContent = comment;

    return commentElement;
  };

  var renderCommentsList = function (commentsArr) {
    var socialComment = window.bigPicture.querySelector('.social__comment');
    var commentsList = window.bigPicture.querySelector('.social__comments');
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
    window.bigPicture.classList.remove('hidden');
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

  var renderBigPicture = function () {
    var picture = window.picturesArr[0];
    changeBigPicture(picture);
    renderCommentsList(picture.comments);
    hideCommentLoader();
    hideCommentCount();
  };

  renderBigPicture();

  bigPictureCancel.addEventListener('click', window.onBigPictureCancelClick);
  document.addEventListener('keydown', window.onBigPictureOverlayEscPress);

})();
