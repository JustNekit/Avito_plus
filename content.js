function getCurrentPageUrl() {
  return window.location.href;
}

function extractAttribute(element, attributeName) {
  return element.getAttribute(attributeName);
}

function extractText(element) {
  if (element && element.innerText) {
    return element.innerText.trim();
  }
  return '';
}

function parseData() {
  const data = {};

  // Селекторы
  const linkSelector = 'a[itemprop="url"]';
  const titleSelector = 'h3[itemprop="name"], h1[itemprop="name"]';
  const priceSelector = 'p[data-marker="item-price"]';
  const descriptionSelector = 'div[data-marker="item-view/item-description"] p.styles-module-root-_KFFt';
  const dateSelector = 'p[class="styles-module-root-_KFFt styles-module-size_s-awPvv styles-module-size_s_dense-tybDA styles-module-size_s-_P6ZA styles-module-size_dense-z56yO stylesMarginDense-module-root-lyxCd stylesMarginDense-module-paragraph-s-Okkap styles-module-noAccent-nZxz7"], p[class="styles-module-root-_KFFt styles-module-size_s-awPvv styles-module-size_s-_P6ZA stylesMarningNormal-module-root-OSCNq stylesMarningNormal-module-paragraph-s-_c6vD styles-module-noAccent-nZxz7"]';
  const addressSelector = 'span.style-item-address__string-wt61A';
  const descriptionElementSelector = 'div[data-marker="item-view/item-description"]';
  const breadcrumbsSelector = 'div[data-marker="breadcrumbs"]';
  const characteristicsSelector = 'ul.params-paramsList-zLpAu';
  const sendDataSelector = 'a[data-marker="item-send-message-link"]';
  const userLinkSelector = 'a[data-marker="seller-link/link"]';
  const internslPriceSelector = '[itemprop="price"]'; // Цена в объвлении

  // Извлечение элементов
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
  const internalPrice = document.querySelectorAll(internslPriceSelector);

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
  
  internalPrice.forEach(element => {
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
  }

  // Вывод элементов в консоль в формате ООП
  const adsArray = [];
  for (let i = 0; i < linkElements.length; i++) {
    const adObject = {
      link: extractAttribute(linkElements[i], 'href'),
      title: extractText(titleElements[i]),
      price: extractText(priceElements[i]),
      prices: extractText(internalPrice[i]),
      description: extractText(descriptionElements[i]),
      date: extractText(dateElements[i]),
      address: extractText(addressElements[i]),
    };
    adsArray.push(adObject);
  }

  // Вывод общей информации в консоль
  const newData = {
    count: adsArray.length,
    array: adsArray
  };

  const currentPageUrl = getCurrentPageUrl();
  newData.currentPageUrl = currentPageUrl;

  console.log(JSON.stringify(newData, null, 2)); // Вывод newData в консоль в виде JSON

  // Отправка данных
  chrome.runtime.sendMessage({ action: 'parseAndSendData', data: newData });
}

parseData();