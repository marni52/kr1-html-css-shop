// Форма на странице оформления заявки.
const pageOrderForm = document.getElementById('page-order-form');

// Сообщение об успешной отправке.
const pageSuccessMessage = document.getElementById('page-success-message');

// Событие submit срабатывает только тогда, когда браузер проверил поля
// (required, type="email", pattern) и ошибок не нашёл.
pageOrderForm.addEventListener('submit', (event) => {
  // Отменяем отправку на сервер, потому что backend пока не подключён.
  event.preventDefault();

  // Показываем сообщение и очищаем форму.
  pageSuccessMessage.hidden = false;
  pageOrderForm.reset();
});
