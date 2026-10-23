// =========================================================
// Скрипт сайта ShopProject
// 1. Общая проверка формы
// 2. Модальное окно заявки (главная страница и страница товара)
// 3. Форма на странице оформления заявки order.html
// =========================================================

// =========================================================
// 1. Общая проверка формы
// =========================================================

// Функция проверяет форму и подсвечивает поля с ошибками.
// Возвращает true, если все поля заполнены правильно.
function validateForm(form) {
  // form.elements - все поля формы, Array.from превращает их в обычный массив
  const fields = Array.from(form.elements);

  // Убираем старые отметки об ошибках со всех полей
  fields.forEach((field) => {
    // willValidate = true у полей, которые участвуют в проверке
    if (field.willValidate) {
      // удаляем атрибут aria-invalid, из-за него поле красное
      field.removeAttribute('aria-invalid');
    }
  });

  // checkValidity() проверяет required, type="email", pattern и т.д.
  if (form.checkValidity()) {
    // ошибок нет - форма правильная
    return true;
  }

  // Если есть ошибки - отмечаем каждое неправильное поле
  fields.forEach((field) => {
    // поле участвует в проверке и заполнено неправильно
    if (field.willValidate && !field.checkValidity()) {
      // aria-invalid="true" - поле с ошибкой (CSS делает его красным)
      field.setAttribute('aria-invalid', 'true');
    }
  });

  // reportValidity() показывает стандартную подсказку браузера у первого ошибочного поля
  form.reportValidity();

  // возвращаем false - отправлять форму нельзя
  return false;
}

// Функция показывает сообщение об успешной отправке
function showSuccess(message) {
  // показываем элемент (убираем атрибут hidden)
  message.hidden = false;
  // переводим фокус на сообщение, чтобы его прочитал экранный диктор
  message.focus();
  // прокручиваем страницу так, чтобы сообщение было по центру экрана
  message.scrollIntoView({ block: 'center' });
}

// =========================================================
// 2. Модальное окно заявки
// =========================================================

// Находим модальное окно по id
const orderDialog = document.getElementById('order-dialog');

// Код ниже выполняется только на страницах, где есть модальное окно
if (orderDialog) {
  // Все кнопки «Заказать» с атрибутом data-product
  const orderButtons = document.querySelectorAll('[data-product]');
  // Кнопка «Закрыть» внутри окна
  const closeDialogButton = document.getElementById('close-order-dialog');
  // Скрытое поле, куда записывается выбранный товар
  const selectedProductInput = document.getElementById('selected-product');
  // Строка в окне, где показывается название товара
  const dialogProductText = document.getElementById('order-dialog-product');
  // Форма заявки внутри окна
  const orderForm = document.getElementById('order-form');
  // Сообщение «Форма успешно отправлена!»
  const successMessage = document.getElementById('success-message');

  // Функция открывает окно для выбранного товара
  function openOrderDialog(productName) {
    // записываем товар в скрытое поле формы
    selectedProductInput.value = productName;
    // показываем название товара в окне или общий текст, если товар не выбран
    dialogProductText.textContent = productName ? `Товар: ${productName}` : 'Консультация по выбору товара';
    // showModal() открывает dialog поверх страницы с затемнением фона
    orderDialog.showModal();
  }

  // Перебираем все кнопки «Заказать»
  orderButtons.forEach((button) => {
    // по клику на кнопку
    button.addEventListener('click', () => {
      // dataset.product - значение атрибута data-product
      openOrderDialog(button.dataset.product);
    });
  });

  // По кнопке «Закрыть» закрываем окно
  closeDialogButton.addEventListener('click', () => {
    // close() закрывает dialog
    orderDialog.close();
  });

  // Клик по затемнённому фону тоже закрывает окно
  orderDialog.addEventListener('click', (event) => {
    // event.target === orderDialog, если кликнули мимо содержимого окна
    if (event.target === orderDialog) {
      // закрываем окно
      orderDialog.close();
    }
  });

  // Если перешли по ссылке с #order (например, со страницы контактов) - сразу открываем окно
  function openFromHash() {
    // location.hash - часть адреса после #
    if (window.location.hash === '#order') {
      // открываем окно без конкретного товара
      openOrderDialog('');
    }
  }

  // проверяем адрес при загрузке страницы
  openFromHash();
  // и каждый раз, когда меняется часть адреса после #
  window.addEventListener('hashchange', openFromHash);

  // Отправка формы в окне
  orderForm.addEventListener('submit', (event) => {
    // отменяем стандартную отправку и перезагрузку страницы (сервера пока нет)
    event.preventDefault();

    // если форма заполнена неправильно - выходим, окно остаётся открытым
    if (!validateForm(orderForm)) {
      return;
    }

    // очищаем все поля формы
    orderForm.reset();
    // закрываем модальное окно
    orderDialog.close();
    // показываем сообщение об успешной отправке
    showSuccess(successMessage);
  });
}

// =========================================================
// 3. Форма на странице order.html
// =========================================================

// Находим форму оформления заявки
const pageOrderForm = document.getElementById('page-order-form');

// Код выполняется только на странице order.html
if (pageOrderForm) {
  // Выпадающий список товаров
  const productSelect = document.getElementById('page-order-product');
  // Сообщение об успешной отправке на этой странице
  const pageSuccessMessage = document.getElementById('page-success-message');

  // URLSearchParams разбирает параметры адреса: order.html?product=headphones
  const params = new URLSearchParams(window.location.search);
  // берём значение параметра product
  const productFromUrl = params.get('product');

  // если товар передан в адресе - выбираем его в списке
  if (productFromUrl) {
    // value списка = value нужного option
    productSelect.value = productFromUrl;
  }

  // Отправка формы
  pageOrderForm.addEventListener('submit', (event) => {
    // отменяем стандартную отправку формы
    event.preventDefault();

    // если есть ошибки - не продолжаем
    if (!validateForm(pageOrderForm)) {
      return;
    }

    // очищаем форму
    pageOrderForm.reset();
    // показываем сообщение об успехе
    showSuccess(pageSuccessMessage);
  });
}
