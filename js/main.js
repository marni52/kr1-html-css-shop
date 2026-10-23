// =========================================================
// 1. Общая проверка формы
// 2. Модальное окно заявки (главная страница и страница товара)
// 3. Форма на странице оформления заявки order.html
// =========================================================

// =========================================================
// 1. Общая проверка формы
// =========================================================

function validateForm(form) {
  const fields = Array.from(form.elements);

  fields.forEach((field) => {
    if (field.willValidate) {
      field.removeAttribute('aria-invalid');
    }
  });

  if (form.checkValidity()) {
    return true;
  }

  fields.forEach((field) => {
    if (field.willValidate && !field.checkValidity()) {
      field.setAttribute('aria-invalid', 'true');
    }
  });

  form.reportValidity();

  return false;
}

function showSuccess(message) {
  message.hidden = false;
  message.focus();
  message.scrollIntoView({ block: 'center' });
}

// =========================================================
// 2. Модальное окно заявки
// =========================================================

const orderDialog = document.getElementById('order-dialog');

if (orderDialog) {
  const orderButtons = document.querySelectorAll('[data-product]');
  const closeDialogButton = document.getElementById('close-order-dialog');
  const selectedProductInput = document.getElementById('selected-product');
  const dialogProductText = document.getElementById('order-dialog-product');
  const orderForm = document.getElementById('order-form');
  const successMessage = document.getElementById('success-message');

  function openOrderDialog(productName) {
    selectedProductInput.value = productName;
    dialogProductText.textContent = productName ? `Товар: ${productName}` : 'Консультация по выбору товара';
    orderDialog.showModal();
  }

  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      openOrderDialog(button.dataset.product);
    });
  });

  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });

  orderDialog.addEventListener('click', (event) => {
    if (event.target === orderDialog) {
      orderDialog.close();
    }
  });

  function openFromHash() {
    if (window.location.hash === '#order') {
      openOrderDialog('');
    }
  }

  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateForm(orderForm)) {
      return;
    }

    orderForm.reset();
    orderDialog.close();
    showSuccess(successMessage);
  });
}

// =========================================================
// 3. Форма на странице order.html
// =========================================================

const pageOrderForm = document.getElementById('page-order-form');

if (pageOrderForm) {
  const productSelect = document.getElementById('page-order-product');
  const pageSuccessMessage = document.getElementById('page-success-message');

  const params = new URLSearchParams(window.location.search);
  const productFromUrl = params.get('product');

  if (productFromUrl) {
    productSelect.value = productFromUrl;
  }

  pageOrderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateForm(pageOrderForm)) {
      return;
    }

    pageOrderForm.reset();
    showSuccess(pageSuccessMessage);
  });
}
