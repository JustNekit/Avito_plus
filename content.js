window.onload = function(){



  var announcements = document.querySelectorAll('[data-marker=bx-recommendations-block-item]')
  if(announcements==null || announcements.length==0)
    announcements = document.querySelectorAll('[data-marker=item]')
  
    function getCategory(){
    var category = []
    var listCategory = document.querySelectorAll('[itemtype="http://schema.org/ListItem"]')
    
    listCategory.forEach((categoryItem) => {
      var categoryItemName = categoryItem.querySelector('[itemprop="name"]').textContent;
      if(!category.includes(categoryItemName))
        category.push(categoryItemName)
    })
    
    console.log(category)
    return category
  }
  
  var ads = []
  
  
  announcements.forEach((announcement) => {
    var name = announcement.querySelector("[itemprop=name]").textContent;
  
    var priceCurrency = announcement.querySelector("[itemprop=priceCurrency]").content
    var price = announcement.querySelector("[itemprop=price]").content
    var url = announcement.querySelector("a[itemprop=url]").href
    var place = announcement.querySelector("[class*=geo-root]").querySelector("span").textContent
  
    var xx = announcement.querySelector("[itemprop=description]");
    var desc = xx===null ? "empty" : xx.content;
    
    var yy = announcement.querySelector("[data-marker=item-date]")
    if(yy === null){
     // yy = announcement.querySelectorAll("p")[2]
     // console.log(yy)
    }
    
    var itemDate = yy === null ? "01.01.1970" : yy.textContent
  
  
  
  
    var urlIndex = url.indexOf("?")
    urlIndex = urlIndex == -1 ? url.length : urlIndex
  
    url = url.substring(0,urlIndex)
  
    let output = {
      category: getCategory(),
      name: name,
      description: desc,
      priceCurrency: priceCurrency,
      price: price,
      url: url,
      date: itemDate,
      place: place
    };
  
    ads.push(output)
  
  //	console.log(JSON.stringify(output,null,2))
  });
  
  //----------------------------------------------
  //----------------------------------------------
  //----------------------------------------------
  if(announcements.length==0){
    var name = document.querySelector("h1[itemprop=name]").textContent;
  
    var priceCurrency = document.querySelector("[itemprop=priceCurrency]").content
    var price = document.querySelector('span[itemprop="price"]').textContent
    var url = window.location.href
    var place = document.querySelector('span[class="style-item-address__string-wt61A"]').textContent
    var specifications = document.querySelector('ul[class="params-paramsList-zLpAu"]').textContent
  
    var xx = document.querySelector('[data-marker="item-view/item-description"]');
   
    var desc = xx===null ?  "empty" : xx.textContent ;
   
    
  
    var yy = document.querySelector("[data-marker=item-date]")
    if(yy === null){
     // yy = announcement.querySelectorAll("p")[2]
     // console.log(yy)
    }
    
    var itemDate = yy === null ? "01.01.1970" : yy.textContent
  
  
  
  
    var urlIndex = url.indexOf("?")
    urlIndex = urlIndex == -1 ? url.length : urlIndex
  
    url = url.substring(0,urlIndex)
  
    let output = {
      category: getCategory(),
      specifications:specifications,
      name: name,
      description: desc,
      priceCurrency: priceCurrency,
      price: price,
      url: url,
      date: itemDate,
      place: place
    };
  
    ads.push(output)
  }
  
  
  
  const newData = {
    count: ads.length,
    advertisements: ads
  };
  
  console.log(JSON.stringify(newData, null, 2));
  
  
  
  var host = 'https://api.sadykoff.ru'
  // host = 'http://localhost:8080'/
  
  fetch(host+'/api/v1/add', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newData)
  }).then(res => res.json())
    .then(res => console.log(res));
  
  
  }

// Слайдеры функций
  var switches = document.querySelectorAll('.switch');
  
    switches.forEach(function (switchElement) {
      var checkbox = switchElement.querySelector('.checkbox');
      var slider = switchElement.querySelector('.slider');
  
      checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
          switchElement.classList.add('checked');
        } else {
          switchElement.classList.remove('checked');
        }
      });
    });

// Пример: вставка текста в элемент с id "price-info" на странице Avito
// var priceInfo = document.getElementById("itemprop=price");
// priceInfo.innerHTML = "Цена соответствует рыночной";
// console.log("Текст вставлен");


// Ваш код для внедрения на страницу Avito
// Например, добавление надписи "проверено"
// document.body.insertAdjacentHTML('beforeend', '<h1 style="position: fixed; top: 1000px; left: 0; background: green; color: white; padding: 5px;">Проверено</h1>');

// Поиск всех элементов с itemprop=price
const priceElements = document.querySelectorAll('[itemprop="price"]');

// Создание элемента с надписью "проверено"
const createVerifiedLabel = () => {
  const verifiedLabel = document.createElement('div');
  verifiedLabel.textContent = '+';
  verifiedLabel.style.position = 'relative';  // Используем относительное позиционирование
  verifiedLabel.style.left = '50px';  // Отступ справа от цены
  verifiedLabel.style.background = 'green';
  verifiedLabel.style.color = 'white';
  verifiedLabel.style.padding = '5px';
  return verifiedLabel;
};

// Добавление надписи справа от каждого элемента с itemprop=price
priceElements.forEach((priceElement) => {
  const verifiedLabel = createVerifiedLabel();
  
  // Обертываем элемент с ценой и надписью в блок, чтобы можно было задать отступ
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.appendChild(priceElement.cloneNode(true));
  wrapper.appendChild(verifiedLabel);

  priceElement.replaceWith(wrapper);
});
















// Слайдеры вкл/выкл (Починить)
var switches1 = document.querySelectorAll('.switch1');
  
switches1.forEach(function (switch1Element) {
  var checkbox1 = switch1Element.querySelector('.checkbox1');
  var slider1 = switch1Element.querySelector('.slider1');

  checkbox1.addEventListener('change1', function () {
    if (checkbox1.checked) {
      switch1Element.classList.add('checked1');
    } else {
      switch1Element.classList.remove('checked1');
    }
  });
});