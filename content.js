// Функция для извлечения текущей ссылки страницы
function getCurrentPageUrl() {
  return window.location.href;
}

// Функция для извлечения значения атрибута элемента
function extractAttribute(element, attributeName) {
  return element.getAttribute(attributeName);
}

// Функция для извлечения текстового содержимого элемента
function extractText(element) {
  return element.innerText.trim();
}

// Функция для парсинга данных с помощью указанных селекторов
function parseData() {
  const data = {};

  // Селекторы
  const linkSelector = 'a[itemprop="url"]';
  const titleSelector = 'h3[itemprop="name"], h1[itemprop="name"]';
  const priceSelector = '[itemprop="price"], p[data-marker="item-price"]';
  const descriptionSelector = 'div[data-marker="item-view/item-description"] p.styles-module-root-_KFFt';
  const dateSelector = 'p[class="styles-module-root-_KFFt styles-module-size_s-awPvv styles-module-size_s_dense-tybDA styles-module-size_s-_P6ZA styles-module-size_dense-z56yO stylesMarginDense-module-root-lyxCd stylesMarginDense-module-paragraph-s-Okkap styles-module-noAccent-nZxz7"], p[class="styles-module-root-_KFFt styles-module-size_s-awPvv styles-module-size_s-_P6ZA stylesMarningNormal-module-root-OSCNq stylesMarningNormal-module-paragraph-s-_c6vD styles-module-noAccent-nZxz7"]';
  const addressSelector = 'span.style-item-address__string-wt61A';
  const descriptionElementSelector = 'div[data-marker="item-view/item-description"]';
  const breadcrumbsSelector = 'div[data-marker="breadcrumbs"]';
  const characteristicsSelector = 'ul.params-paramsList-zLpAu';
  const sendDataSelector = 'a[data-marker="item-send-message-link"]';
  const userLinkSelector = 'a[data-marker="seller-link/link"]';

  // Извлечение данных
  const linkElements = document.querySelectorAll(linkSelector);
  const titleElements = document.querySelectorAll(titleSelector);
  const priceElements = document.querySelectorAll(priceSelector);
  const descriptionElements = document.querySelectorAll(descriptionSelector);
  const dateElements = document.querySelectorAll(dateSelector);
  const addressElements = document.querySelectorAll(addressSelector);
  const descriptionElement = document.querySelector(descriptionElementSelector);
  const breadcrumbsElement = document.querySelector(breadcrumbsSelector);
  const characteristicsElement = document.querySelector(characteristicsSelector);
  const userLinkElement = document.querySelector(userLinkSelector);

  // Применение стилей к выделенным элементам
  linkElements.forEach(element => {
    element.style.color = 'red';
  });

  titleElements.forEach(element => {
    element.style.color = 'red';
  });

  priceElements.forEach(element => {
    element.style.color = 'red';
  });

  descriptionElements.forEach(element => {
    element.style.color = 'red';
  });

  dateElements.forEach(element => {
    element.style.color = 'red';
  });

  addressElements.forEach(element => {
    element.style.color = 'red';
  });

  if (descriptionElement) {
    descriptionElement.querySelectorAll('p').forEach(p => {
      p.style.color = 'red';
    });
  }

  if (breadcrumbsElement) {
    breadcrumbsElement.querySelectorAll('a').forEach(a => {
      a.style.color = 'red';
    });
  }

  if (characteristicsElement) {
    characteristicsElement.querySelectorAll('li').forEach(li => {
      li.style.color = 'red';
    });
  }

  if (userLinkElement) {
    userLinkElement.style.color = 'red';

    const username = userLinkElement.querySelector('span').innerText;
    const userLink = userLinkElement.getAttribute('href');

    // Добавляем данные к объекту data
    data.username = username;
    data.userLink = userLink;
  }

  const sendDataElement = document.querySelector(sendDataSelector);
  if (sendDataElement) {
    sendDataElement.style.color = 'red';
    data.sendData = extractAttribute(sendDataElement, 'href');
  }

  // Сохранение данных
  data.link = Array.from(linkElements).map(linkElement => extractAttribute(linkElement, 'href'));
  data.title = Array.from(titleElements).map(titleElement => extractText(titleElement));
  data.price = Array.from(priceElements).map(priceElement => extractText(priceElement));
  data.description = Array.from(descriptionElements).map(descriptionElement => extractText(descriptionElement));
  data.date = Array.from(dateElements).map(dateElement => extractText(dateElement));
  data.address = Array.from(addressElements).map(addressElement => extractText(addressElement));

  if (descriptionElement) {
    data.descriptionFull = Array.from(descriptionElement.querySelectorAll('p')).map(p => extractText(p));
  }

  if (breadcrumbsElement) {
    data.path = Array.from(breadcrumbsElement.querySelectorAll('span span')).map(span => extractText(span));
  }

  if (characteristicsElement) {
    const characteristics = {};
    characteristicsElement.querySelectorAll('li').forEach(li => {
      const key = extractText(li.querySelector('span').nextSibling); // Извлекаем текст после span
      const value = extractText(li);
      characteristics[key] = value;
    });
    data.characteristics = characteristics;
  }

  // Извлечение текущей ссылки страницы
  const currentPageUrl = getCurrentPageUrl();
  data.currentPageUrl = currentPageUrl;

  // Отправка данных
  chrome.runtime.sendMessage({ action: 'parseAndSendData', data: JSON.stringify(data) });
}

// Вызываем функцию парсинга при загрузке страницы
parseData();
