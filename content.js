window.onload = function () {
  var debug = !true;

  var host = "https://api.sadykoff.ru";

  if (debug) {
    host = "http://localhost:8084";
  }

  var advertisements = getAdvertisements();

  function getAdvertisements() {
    //поиск объявлений на странице поиска
    var searchPageAdv = document.querySelectorAll("[data-marker=item]");
    //поиск объявлений на странице рекомендаций, так как в эти объявления малоинформативны - они не учитываются
    var recommendationsPageAdv = document.querySelectorAll(
      "[data-marker=bx-recommendations-block-item]"
    );
    // объединения объявлений  (массив массивов) если [searchPageAdv, recommendationsPageAdv];
    // объединения объявлений  (массив объявлений) если [...searchPageAdv, ...recommendationsPageAdv];
    var advertisements = [...searchPageAdv, ...recommendationsPageAdv];
    advertisements = [...searchPageAdv];
    return advertisements;
  }

  function getCategory() {
    var category = [];
    var listCategory = document.querySelectorAll(
      '[itemtype="http://schema.org/ListItem"]'
    );

    listCategory.forEach((categoryItem) => {
      var categoryItemName =
        categoryItem.querySelector('[itemprop="name"]').textContent;
      if (!category.includes(categoryItemName))
        category.push(categoryItemName.trim());
    });

    return category;
  }

  function getName(adv) {
    var data = adv.querySelector("h3[itemprop=name]");
    return data.textContent;
  }

  function getPriceValue(adv) {
    var data = adv.querySelector("[itemprop=price]");

    var attr = data.getAttribute("content");
    var content = data.content;

    if (content === undefined) {
      return Number.parseInt(attr.trim());
    }

    return Number.parseInt(content.trim());
  }

  function getPlace(adv) {
    // на странице объявления указывается полностью адрес

    // var data = adv.querySelector('div[itemprop=address]');
    // var place = data.querySelector('span').textContent;
    // place = place.split(",")
    // var filterPlace = []
    // for (var i = 0; i < place.length; i++) {
    //   var p = place[i].trim();
    //   if (p.length > 1)
    //     filterPlace.push(p)
    // }

    // на странице поиска объявлений указывается только город
    var simolePlace = adv
      .querySelector("[class*=geo-root]")
      .querySelector("span").textContent;
    return [simolePlace];
  }

  // характеристики товара есть только на странице объявления
  function getSpecifications() {
    var bar = document.querySelector(
      'div[data-marker="item-view/item-params"]'
    );
    var li = bar.querySelectorAll("li");
    var specifications = [];
    for (var i = 0; i < li.length; i++) specifications.push(li[i].textContent);
    return specifications;
  }

  //в основном описание будет не полным, так как на странице поиска оно неполное
  function getDescription(adv) {
    var data = adv.querySelector("[itemprop=description]");
    return data == null ? data : data.content;
  }

  //нельзя получить в удобном формате (дд.мм.гг) и поэтому дата представлена ввиде (N часов/дней назад)
  function getDate(adv) {
    var data = adv.querySelector("[data-marker=item-date]");
    return data == null ? data : data.textContent.trim();
  }

  function getUrl(adv) {
    //так как url это id в бд, то нужно убрать все параметры в url (все после знака ?)
    var url = adv.querySelector("a[itemprop=url]").href;
    var queryIndex = url.indexOf("?");
    queryIndex = queryIndex === -1 ? url.length : queryIndex;
    url = url.substring(0, queryIndex);
    return url;
  }

  function getPriceCurrency(adv) {
    return adv.querySelector("[itemprop=priceCurrency]").content;
  }

  var advertisementsData = [];
  // console.log(advertisements)
  advertisements.forEach((adv) => {
    let data = {
      category: getCategory(),
      name: getName(adv),
      description: getDescription(adv),
      price: {
        value: getPriceValue(adv),
        currency: getPriceCurrency(adv),
      },
      url: getUrl(adv),
      date: getDate(adv),
      place: getPlace(adv),
    };
    advertisementsData.push(data);
  });

  function getDataFromServer(
    url,
    newDiv,
    priceContainer,
    greenArrows,
    redArrows,
    priceee
  ) {
    fetch(host + "/api/v1/info?link=" + url, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          var meanPriceInt = Number.parseInt(res.data.mean.toFixed(0));
          var meanPrice = new Intl.NumberFormat("ru-RU").format(meanPriceInt);
          newDiv.textContent = "Средняя цена = " + meanPrice;
          newDiv.innerHTML =
            "</b> Средняя цена = " +
            meanPrice +
            ' </b> <a href="' +
            host +
            "/api/v1/why?link=" +
            url +
            '">?</a>';

          var keywords = res.data.keyWords;
          var keyWordsElement = addKeyWordsInfo(
            keywords,
            greenArrows,
            redArrows,
            meanPriceInt,
            priceee
          );
          priceContainer.appendChild(keyWordsElement);
        }
      });
  }

  function addKeyWordsInfo(
    keywords,
    greenArrows,
    redArrows,
    meanPriceInt,
    priceee
  ) {
    var keyWordsElement = document.createElement("div");
    keyWordsElement.className = "keyWords";
    keyWordsElement.style.display = "flex";

    if (meanPriceInt < priceee) keyWordsElement.appendChild(redArrows);
    else keyWordsElement.appendChild(greenArrows);

    keywords.forEach((word) => {
      var keyWordDiv = document.createElement("div");

      keyWordDiv.innerHTML = word;
      keyWordDiv.classList.add("keyword-item");

      keyWordsElement.appendChild(keyWordDiv);
    });

    return keyWordsElement;
  }

  function addInfo(adv) {
    var body = adv.querySelector('div[class^="iva-item-body"]');
    var priceContainer = adv.querySelector("span[class^=price-root]");

    var infoBlock = body.querySelector('div[class^="avito-info"]');
    if (infoBlock == null) {
      var url = getUrl(adv);

      var newDiv = document.createElement("div");
      newDiv.className = "avito-info";
      // newDiv.textContent = 'no data';
      newDiv.style.position = "relative"; // Set the container position to relative
      newDiv.style.display = "flex"; // Use flex to align images horizontally
      newDiv.style.justifyContent = "flex-end"; // Align images to the end (right side)

      var starSVG = document.createElement("img");
      starSVG.style.paddingRight = "8px";
      starSVG.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'%3E%3Cpath d='M20.1523 9.82948L16.2765 13.212L17.4376 18.2479C17.499 18.5112 17.4815 18.7867 17.3872 19.0401C17.2929 19.2934 17.126 19.5134 16.9073 19.6724C16.6887 19.8314 16.4281 19.9224 16.158 19.9341C15.8879 19.9458 15.6204 19.8776 15.3888 19.7381L10.9965 17.074L6.61373 19.7381C6.38219 19.8776 6.11465 19.9458 5.84457 19.9341C5.57448 19.9224 5.31384 19.8314 5.09521 19.6724C4.87659 19.5134 4.70969 19.2934 4.61538 19.0401C4.52108 18.7867 4.50354 18.5112 4.56498 18.2479L5.72428 13.2171L1.84764 9.82948C1.6426 9.65264 1.49433 9.4192 1.42144 9.15844C1.34854 8.89767 1.35425 8.62118 1.43786 8.36365C1.52148 8.10612 1.67926 7.87901 1.89143 7.71079C2.1036 7.54258 2.36072 7.44075 2.63053 7.41808L7.74037 6.9755L9.73498 2.218C9.83914 1.96836 10.0148 1.75513 10.2399 1.60514C10.465 1.45515 10.7295 1.37512 11 1.37512C11.2705 1.37512 11.5349 1.45515 11.76 1.60514C11.9851 1.75513 12.1608 1.96836 12.265 2.218L14.2656 6.9755L19.3737 7.41808C19.6435 7.44075 19.9007 7.54258 20.1128 7.71079C20.325 7.87901 20.4828 8.10612 20.5664 8.36365C20.65 8.62118 20.6557 8.89767 20.5828 9.15844C20.5099 9.4192 20.3617 9.65264 20.1566 9.82948H20.1523Z' fill='%239960E4'/%3E%3C/svg%3E";
      starSVG.alt = "Advertisement Image";

      var greenArrows = document.createElement("img");
      greenArrows.style.paddingRight = "8px";
      greenArrows.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'%3E%3Cpath d='M14.7537 18.9613C15.1525 19.3463 15.785 19.3463 16.1837 18.9613L19.965 15.3175C20.0672 15.2248 20.1498 15.1125 20.2078 14.9873C20.2658 14.862 20.2981 14.7264 20.3028 14.5885C20.3075 14.4506 20.2844 14.3131 20.2349 14.1842C20.1855 14.0554 20.1107 13.9378 20.015 13.8384C19.9192 13.7389 19.8045 13.6598 19.6776 13.6055C19.5507 13.5512 19.4142 13.523 19.2762 13.5224C19.1382 13.5219 19.0015 13.549 18.8742 13.6023C18.7468 13.6556 18.6315 13.7338 18.535 13.8325L16.5 15.7933V3.78125C16.5 3.50775 16.3913 3.24544 16.1979 3.05205C16.0045 2.85865 15.7422 2.75 15.4687 2.75C15.1952 2.75 14.9329 2.85865 14.7395 3.05205C14.5461 3.24544 14.4375 3.50775 14.4375 3.78125V15.7933L12.4025 13.8325C12.306 13.7338 12.1906 13.6556 12.0633 13.6023C11.936 13.549 11.7993 13.5219 11.6613 13.5224C11.5233 13.523 11.3868 13.5512 11.2599 13.6055C11.133 13.6598 11.0182 13.7389 10.9225 13.8384C10.8268 13.9378 10.752 14.0554 10.7025 14.1842C10.6531 14.3131 10.63 14.4506 10.6347 14.5885C10.6393 14.7264 10.6716 14.862 10.7297 14.9873C10.7877 15.1125 10.8703 15.2248 10.9725 15.3175L14.7537 18.9613Z' fill='%2302D15C'/%3E%3Cpath d='M7.71554 3.60158C7.52218 3.40846 7.26007 3.29999 6.98679 3.29999C6.71351 3.29999 6.4514 3.40846 6.25804 3.60158L2.47679 7.38283C2.29463 7.57832 2.19546 7.83688 2.20017 8.10405C2.20489 8.37121 2.31312 8.62612 2.50206 8.81506C2.691 9.004 2.94591 9.11223 3.21307 9.11695C3.48023 9.12166 3.7388 9.02249 3.93429 8.84033L5.95554 6.81908V18.7678C5.95554 19.0413 6.06419 19.3036 6.25759 19.497C6.45098 19.6904 6.71328 19.7991 6.98679 19.7991C7.26029 19.7991 7.5226 19.6904 7.71599 19.497C7.90939 19.3036 8.01804 19.0413 8.01804 18.7678V6.81908L10.0393 8.84033C10.2348 9.02249 10.4933 9.12166 10.7605 9.11695C11.0277 9.11223 11.2826 9.004 11.4715 8.81506C11.6605 8.62612 11.7687 8.37121 11.7734 8.10405C11.7781 7.83688 11.6789 7.57832 11.4968 7.38283L7.71554 3.60158Z' fill='%23B4B4B4'/%3E%3C/svg%3E";
      greenArrows.alt = "Second Image";

      var redArrows = document.createElement("img");
      redArrows.style.paddingRight = "8px";
      redArrows.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'%3E%3Cpath d='M14.7537 18.9613C15.1525 19.3463 15.785 19.3463 16.1837 18.9613L19.965 15.3175C20.0672 15.2248 20.1498 15.1125 20.2078 14.9873C20.2658 14.862 20.2981 14.7264 20.3028 14.5885C20.3075 14.4506 20.2844 14.3131 20.2349 14.1842C20.1855 14.0554 20.1107 13.9378 20.015 13.8384C19.9192 13.7389 19.8045 13.6598 19.6776 13.6055C19.5507 13.5512 19.4142 13.523 19.2762 13.5224C19.1382 13.5219 19.0015 13.549 18.8742 13.6023C18.7468 13.6556 18.6315 13.7338 18.535 13.8325L16.5 15.7933V3.78125C16.5 3.50775 16.3913 3.24544 16.1979 3.05205C16.0045 2.85865 15.7422 2.75 15.4687 2.75C15.1952 2.75 14.9329 2.85865 14.7395 3.05205C14.5461 3.24544 14.4375 3.50775 14.4375 3.78125V15.7933L12.4025 13.8325C12.306 13.7338 12.1906 13.6556 12.0633 13.6023C11.936 13.549 11.7993 13.5219 11.6613 13.5224C11.5233 13.523 11.3868 13.5512 11.2599 13.6055C11.133 13.6598 11.0182 13.7389 10.9225 13.8384C10.8268 13.9378 10.752 14.0554 10.7025 14.1842C10.6531 14.3131 10.63 14.4506 10.6347 14.5885C10.6393 14.7264 10.6716 14.862 10.7297 14.9873C10.7877 15.1125 10.8703 15.2248 10.9725 15.3175L14.7537 18.9613Z' fill='%23B4B4B4'/%3E%3Cpath d='M7.71554 3.60164C7.52218 3.40852 7.26007 3.30005 6.98679 3.30005C6.71351 3.30005 6.4514 3.40852 6.25804 3.60164L2.47679 7.38289C2.29463 7.57838 2.19546 7.83695 2.20017 8.10411C2.20489 8.37127 2.31312 8.62618 2.50206 8.81512C2.691 9.00406 2.94591 9.11229 3.21307 9.11701C3.48023 9.12172 3.7388 9.02255 3.93429 8.84039L5.95554 6.81914V18.7679C5.95554 19.0414 6.06419 19.3037 6.25759 19.4971C6.45098 19.6905 6.71328 19.7991 6.98679 19.7991C7.26029 19.7991 7.5226 19.6905 7.71599 19.4971C7.90939 19.3037 8.01804 19.0414 8.01804 18.7679V6.81914L10.0393 8.84039C10.2348 9.02255 10.4933 9.12172 10.7605 9.11701C11.0277 9.11229 11.2826 9.00406 11.4715 8.81512C11.6605 8.62618 11.7687 8.37127 11.7734 8.10411C11.7781 7.83695 11.6789 7.57838 11.4968 7.38289L7.71554 3.60164Z' fill='%23FB4256'/%3E%3C/svg%3E";
      redArrows.alt = "Third Image";

      var noData = document.createElement("img");
      noData.style.paddingRight = "8px";
      noData.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='19' viewBox='0 0 20 19' fill='none'%3E%3Cpath d='M19.5899 15.36L12.0069 1.424C11.5149 0.511 10.7789 0 9.98885 0C9.19885 0 8.47385 0.521 7.97285 1.434L0.408853 15.361C-0.0811465 16.262 -0.135147 17.186 0.270853 17.891C0.675853 18.598 1.48685 19 2.48985 19H17.5099C18.5129 19 19.3239 18.598 19.7299 17.892C20.1349 17.186 20.0809 16.273 19.5899 15.361V15.36ZM9.99985 4.357C10.3949 4.357 10.7149 4.683 10.7149 5.085V11.668C10.7149 12.07 10.3949 12.396 9.99985 12.396C9.90508 12.3952 9.8114 12.3758 9.72416 12.3387C9.63692 12.3017 9.55783 12.2479 9.49142 12.1802C9.42502 12.1126 9.37259 12.0326 9.33714 11.9447C9.3017 11.8568 9.28393 11.7628 9.28485 11.668V5.084C9.28485 4.693 9.60485 4.357 9.99985 4.357ZM9.99985 15.981C9.38085 15.981 8.88985 15.471 8.88985 14.841C8.88985 14.211 9.39185 13.7 9.99985 13.7C10.6189 13.7 11.1099 14.21 11.1099 14.84C11.1099 15.47 10.6079 15.981 9.99985 15.981Z' fill='%23FB4256'/%3E%3C/svg%3E";
      noData.alt = "Fifth Image";

      getDataFromServer(
        url,
        newDiv,
        priceContainer,
        greenArrows,
        redArrows,
        getPriceValue(adv)
      );

      // body.appendChild(starSVG)
      // body.appendChild(greenArrows)
      // body.appendChild(redArrows)
      // body.appendChild(noData)
      body.appendChild(newDiv);
    }
  }

  setInterval(() => {
    getAdvertisements().forEach((adv) => {
      addInfo(adv);
    });
  }, 1500);

  const jsonData = {
    count: advertisementsData.length,
    advertisements: advertisementsData,
  };

  fetch(host + "/api/v1/add", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((res) => res.json())
    .then((res) => console.log(res));

  // advertisementsData.forEach((adv) => {
  //     var url = adv.url
  //     fetch(host + '/api/v1/info?link=' + url, {
  //         method: 'GET',
  //         headers: {
  //             'Accept': 'application/json, text/plain, */*',
  //             'Content-Type': 'application/json'
  //         }
  //     })
  //         .then(res => res.json())
  //         .then(res => {
  //             if (res.status === 200) {
  //                 console.log(res.data)
  //             } else {
  //                 console.log('no data')
  //             }
  //         });
  // })

  // Function to add an SVG image below the favorites-add marker
  function addImageBelowFavorites(adv) {
    var favoritesMarker = adv.querySelector('[data-marker="favorites-add"]');
    if (favoritesMarker) {
      // Set background-position: right; and remove width for favorites-add
      favoritesMarker.style.backgroundPosition = "right";
      favoritesMarker.style.width = "auto";

      // Create a container for images
      var imageContainer = document.createElement("div");
      imageContainer.style.position = "relative"; // Set the container position to relative
      imageContainer.style.display = "flex"; // Use flex to align images horizontally
      imageContainer.style.justifyContent = "flex-end"; // Align images to the end (right side)

      // Create an image element for SVG
      var svgImage = document.createElement("img");
      svgImage.style.paddingRight = "8px";
      svgImage.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'%3E%3Cpath d='M20.1523 9.82948L16.2765 13.212L17.4376 18.2479C17.499 18.5112 17.4815 18.7867 17.3872 19.0401C17.2929 19.2934 17.126 19.5134 16.9073 19.6724C16.6887 19.8314 16.4281 19.9224 16.158 19.9341C15.8879 19.9458 15.6204 19.8776 15.3888 19.7381L10.9965 17.074L6.61373 19.7381C6.38219 19.8776 6.11465 19.9458 5.84457 19.9341C5.57448 19.9224 5.31384 19.8314 5.09521 19.6724C4.87659 19.5134 4.70969 19.2934 4.61538 19.0401C4.52108 18.7867 4.50354 18.5112 4.56498 18.2479L5.72428 13.2171L1.84764 9.82948C1.6426 9.65264 1.49433 9.4192 1.42144 9.15844C1.34854 8.89767 1.35425 8.62118 1.43786 8.36365C1.52148 8.10612 1.67926 7.87901 1.89143 7.71079C2.1036 7.54258 2.36072 7.44075 2.63053 7.41808L7.74037 6.9755L9.73498 2.218C9.83914 1.96836 10.0148 1.75513 10.2399 1.60514C10.465 1.45515 10.7295 1.37512 11 1.37512C11.2705 1.37512 11.5349 1.45515 11.76 1.60514C11.9851 1.75513 12.1608 1.96836 12.265 2.218L14.2656 6.9755L19.3737 7.41808C19.6435 7.44075 19.9007 7.54258 20.1128 7.71079C20.325 7.87901 20.4828 8.10612 20.5664 8.36365C20.65 8.62118 20.6557 8.89767 20.5828 9.15844C20.5099 9.4192 20.3617 9.65264 20.1566 9.82948H20.1523Z' fill='%239960E4'/%3E%3C/svg%3E";
      svgImage.alt = "Advertisement Image";
      // Append the SVG image to the container
      // imageContainer.appendChild(svgImage);

      // Insert the container below the favorites-add marker
      favoritesMarker.parentNode.insertBefore(
        imageContainer,
        favoritesMarker.nextSibling
      );

      // Insert code for additional images below this comment
      // ...

      // Example for the second image (replace with actual code)
      var image2 = document.createElement("img");
      image2.style.paddingRight = "8px";
      image2.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'%3E%3Cpath d='M14.7537 18.9613C15.1525 19.3463 15.785 19.3463 16.1837 18.9613L19.965 15.3175C20.0672 15.2248 20.1498 15.1125 20.2078 14.9873C20.2658 14.862 20.2981 14.7264 20.3028 14.5885C20.3075 14.4506 20.2844 14.3131 20.2349 14.1842C20.1855 14.0554 20.1107 13.9378 20.015 13.8384C19.9192 13.7389 19.8045 13.6598 19.6776 13.6055C19.5507 13.5512 19.4142 13.523 19.2762 13.5224C19.1382 13.5219 19.0015 13.549 18.8742 13.6023C18.7468 13.6556 18.6315 13.7338 18.535 13.8325L16.5 15.7933V3.78125C16.5 3.50775 16.3913 3.24544 16.1979 3.05205C16.0045 2.85865 15.7422 2.75 15.4687 2.75C15.1952 2.75 14.9329 2.85865 14.7395 3.05205C14.5461 3.24544 14.4375 3.50775 14.4375 3.78125V15.7933L12.4025 13.8325C12.306 13.7338 12.1906 13.6556 12.0633 13.6023C11.936 13.549 11.7993 13.5219 11.6613 13.5224C11.5233 13.523 11.3868 13.5512 11.2599 13.6055C11.133 13.6598 11.0182 13.7389 10.9225 13.8384C10.8268 13.9378 10.752 14.0554 10.7025 14.1842C10.6531 14.3131 10.63 14.4506 10.6347 14.5885C10.6393 14.7264 10.6716 14.862 10.7297 14.9873C10.7877 15.1125 10.8703 15.2248 10.9725 15.3175L14.7537 18.9613Z' fill='%2302D15C'/%3E%3Cpath d='M7.71554 3.60158C7.52218 3.40846 7.26007 3.29999 6.98679 3.29999C6.71351 3.29999 6.4514 3.40846 6.25804 3.60158L2.47679 7.38283C2.29463 7.57832 2.19546 7.83688 2.20017 8.10405C2.20489 8.37121 2.31312 8.62612 2.50206 8.81506C2.691 9.004 2.94591 9.11223 3.21307 9.11695C3.48023 9.12166 3.7388 9.02249 3.93429 8.84033L5.95554 6.81908V18.7678C5.95554 19.0413 6.06419 19.3036 6.25759 19.497C6.45098 19.6904 6.71328 19.7991 6.98679 19.7991C7.26029 19.7991 7.5226 19.6904 7.71599 19.497C7.90939 19.3036 8.01804 19.0413 8.01804 18.7678V6.81908L10.0393 8.84033C10.2348 9.02249 10.4933 9.12166 10.7605 9.11695C11.0277 9.11223 11.2826 9.004 11.4715 8.81506C11.6605 8.62612 11.7687 8.37121 11.7734 8.10405C11.7781 7.83688 11.6789 7.57832 11.4968 7.38283L7.71554 3.60158Z' fill='%23B4B4B4'/%3E%3C/svg%3E";
      image2.alt = "Second Image";
      // imageContainer.appendChild(image2);

      // Example for the third image (replace with actual code)
      var image3 = document.createElement("img");
      image3.style.paddingRight = "8px";
      image3.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'%3E%3Cpath d='M14.7537 18.9613C15.1525 19.3463 15.785 19.3463 16.1837 18.9613L19.965 15.3175C20.0672 15.2248 20.1498 15.1125 20.2078 14.9873C20.2658 14.862 20.2981 14.7264 20.3028 14.5885C20.3075 14.4506 20.2844 14.3131 20.2349 14.1842C20.1855 14.0554 20.1107 13.9378 20.015 13.8384C19.9192 13.7389 19.8045 13.6598 19.6776 13.6055C19.5507 13.5512 19.4142 13.523 19.2762 13.5224C19.1382 13.5219 19.0015 13.549 18.8742 13.6023C18.7468 13.6556 18.6315 13.7338 18.535 13.8325L16.5 15.7933V3.78125C16.5 3.50775 16.3913 3.24544 16.1979 3.05205C16.0045 2.85865 15.7422 2.75 15.4687 2.75C15.1952 2.75 14.9329 2.85865 14.7395 3.05205C14.5461 3.24544 14.4375 3.50775 14.4375 3.78125V15.7933L12.4025 13.8325C12.306 13.7338 12.1906 13.6556 12.0633 13.6023C11.936 13.549 11.7993 13.5219 11.6613 13.5224C11.5233 13.523 11.3868 13.5512 11.2599 13.6055C11.133 13.6598 11.0182 13.7389 10.9225 13.8384C10.8268 13.9378 10.752 14.0554 10.7025 14.1842C10.6531 14.3131 10.63 14.4506 10.6347 14.5885C10.6393 14.7264 10.6716 14.862 10.7297 14.9873C10.7877 15.1125 10.8703 15.2248 10.9725 15.3175L14.7537 18.9613Z' fill='%23B4B4B4'/%3E%3Cpath d='M7.71554 3.60164C7.52218 3.40852 7.26007 3.30005 6.98679 3.30005C6.71351 3.30005 6.4514 3.40852 6.25804 3.60164L2.47679 7.38289C2.29463 7.57838 2.19546 7.83695 2.20017 8.10411C2.20489 8.37127 2.31312 8.62618 2.50206 8.81512C2.691 9.00406 2.94591 9.11229 3.21307 9.11701C3.48023 9.12172 3.7388 9.02255 3.93429 8.84039L5.95554 6.81914V18.7679C5.95554 19.0414 6.06419 19.3037 6.25759 19.4971C6.45098 19.6905 6.71328 19.7991 6.98679 19.7991C7.26029 19.7991 7.5226 19.6905 7.71599 19.4971C7.90939 19.3037 8.01804 19.0414 8.01804 18.7679V6.81914L10.0393 8.84039C10.2348 9.02255 10.4933 9.12172 10.7605 9.11701C11.0277 9.11229 11.2826 9.00406 11.4715 8.81512C11.6605 8.62618 11.7687 8.37127 11.7734 8.10411C11.7781 7.83695 11.6789 7.57838 11.4968 7.38289L7.71554 3.60164Z' fill='%23FB4256'/%3E%3C/svg%3E";
      image3.alt = "Third Image";
      // imageContainer.appendChild(image3);

      // Example for the fourth image (replace with actual code)
      var image4 = document.createElement("img");
      image4.style.paddingRight = "8px";
      image4.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='19' viewBox='0 0 20 19' fill='none'%3E%3Cpath d='M19.5899 15.36L12.0069 1.424C11.5149 0.511 10.7789 0 9.98885 0C9.19885 0 8.47385 0.521 7.97285 1.434L0.408853 15.361C-0.0811465 16.262 -0.135147 17.186 0.270853 17.891C0.675853 18.598 1.48685 19 2.48985 19H17.5099C18.5129 19 19.3239 18.598 19.7299 17.892C20.1349 17.186 20.0809 16.273 19.5899 15.361V15.36ZM9.99985 4.357C10.3949 4.357 10.7149 4.683 10.7149 5.085V11.668C10.7149 12.07 10.3949 12.396 9.99985 12.396C9.90508 12.3952 9.8114 12.3758 9.72416 12.3387C9.63692 12.3017 9.55783 12.2479 9.49142 12.1802C9.42502 12.1126 9.37259 12.0326 9.33714 11.9447C9.3017 11.8568 9.28393 11.7628 9.28485 11.668V5.084C9.28485 4.693 9.60485 4.357 9.99985 4.357ZM9.99985 15.981C9.38085 15.981 8.88985 15.471 8.88985 14.841C8.88985 14.211 9.39185 13.7 9.99985 13.7C10.6189 13.7 11.1099 14.21 11.1099 14.84C11.1099 15.47 10.6079 15.981 9.99985 15.981Z' fill='%23FB4256'/%3E%3C/svg%3E";
      image4.alt = "Fifth Image";

      // Example for the fourth image (replace with actual code)

      var keyWords = document.createElement("div");
      keyWords.innerHTML = "Скол";
      keyWords.style.backgroundColor = "black";
      keyWords.style.borderRadius = "50px";
      keyWords.style.paddingLeft = "8px";
      keyWords.style.paddingRight = "8px";
      keyWords.style.fontSize = "12px";
      keyWords.style.fontFamily = "Montserrat";
      keyWords.style.display = "flex";
      keyWords.style.alignItems = "center";
      keyWords.style.color = "white";
      // imageContainer.appendChild(keyWords);

      var info = document.createElement("div");
      var url = adv.querySelector("a[itemprop=url]").href;
      var price = adv.querySelector("[itemprop=price]").content;
      var urlIndex = url.indexOf("?");
      urlIndex = urlIndex === -1 ? url.length : urlIndex;

      url = url.substring(0, urlIndex);

      fetch(host + "/api/v1/info?link=" + url, {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            price = Number.parseInt(price);
            var avgPrice = res.data.mean.toFixed(0);
            info.textContent = "Средняя цена = " + avgPrice;
            var ppp = adv.querySelector("[itemprop=price]");
            var pppContainer = document.createElement("div");
            pppContainer.style.position = "relative"; // Set the container position to relative
            pppContainer.style.display = "flex"; // Use flex to align images horizontally
            pppContainer.style.justifyContent = "flex-end"; // Align images to the end (right side)
            ppp.parentNode.insertBefore(pppContainer, ppp.nextSibling);

            if (avgPrice < price) pppContainer.appendChild(image3);
            else pppContainer.appendChild(image2);

            var createA = document.createElement("a");
            var createAText = document.createTextNode("Похожие объявления");
            createA.setAttribute("href", host + "/api/v1/info?link=" + url);
            createA.appendChild(createAText);
            imageContainer.appendChild(createA);
          }
        });

      imageContainer.appendChild(info);
    }
  }
};

if (document.querySelector("#Close") !== null) {
  document.querySelector("#Close").onclick = function () {
    window.close();
  };
}

var switches = document.querySelectorAll(".switch");

switches.forEach(function (switchElement) {
  var checkbox = switchElement.querySelector(".checkbox");
  var slider = switchElement.querySelector(".slider");

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      switchElement.classList.add("checked");
      console.log(checkbox.id);
    } else {
      switchElement.classList.remove("checked");
    }
  });
});

var switches1 = document.querySelectorAll(".switch1");

switches1.forEach(function (switch1Element) {
  var checkbox1 = switch1Element.querySelector(".checkbox1");

  checkbox1.addEventListener("click", async function () {
    if (checkbox1.checked) {
      switch1Element.classList.add("checked1");
    } else {
      switch1Element.classList.remove("checked1");
    }
  });
});
