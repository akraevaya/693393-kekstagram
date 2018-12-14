'use strict';

(function () {

  // Закрытие полной картинки по ESC
  window.onBigPictureOverlayEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      window.closePopup(window.bigPicture);
    }
  };

  // Закрытие полной картинки по клику
  window.onBigPictureCancelClick = function () {
    window.closePopup(window.bigPicture);

    document.removeEventListener('keydown', window.onBigPictureOverlayEscPress);
  };

  // Открытие полной картинки по ENTER
  window.onPictureEnterPress = function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      window.openPopup(window.bigPicture);

      document.addEventListener('keydown', window.onBigPictureOverlayEscPress);
    }
  };

})();
