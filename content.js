window.onload = function () {
  var announcements = document.querySelectorAll('[data-marker=bx-recommendations-block-item]');
  if (announcements == null || announcements.length == 0)
    announcements = document.querySelectorAll('[data-marker=item]');

  function getCategory() {
    var category = [];
    var listCategory = document.querySelectorAll('[itemtype="http://schema.org/ListItem"]');

    listCategory.forEach((categoryItem) => {
      var categoryItemName = categoryItem.querySelector('[itemprop="name"]').textContent;
      if (!category.includes(categoryItemName))
        category.push(categoryItemName);
    });

    console.log(category);
    return category;
  }

// Function to add an SVG image below the favorites-add marker
function addImageBelowFavorites(announcement) {
  var favoritesMarker = announcement.querySelector('[data-marker="favorites-add"]');
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
    svgImage.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'%3E%3Cpath d='M20.1523 9.82948L16.2765 13.212L17.4376 18.2479C17.499 18.5112 17.4815 18.7867 17.3872 19.0401C17.2929 19.2934 17.126 19.5134 16.9073 19.6724C16.6887 19.8314 16.4281 19.9224 16.158 19.9341C15.8879 19.9458 15.6204 19.8776 15.3888 19.7381L10.9965 17.074L6.61373 19.7381C6.38219 19.8776 6.11465 19.9458 5.84457 19.9341C5.57448 19.9224 5.31384 19.8314 5.09521 19.6724C4.87659 19.5134 4.70969 19.2934 4.61538 19.0401C4.52108 18.7867 4.50354 18.5112 4.56498 18.2479L5.72428 13.2171L1.84764 9.82948C1.6426 9.65264 1.49433 9.4192 1.42144 9.15844C1.34854 8.89767 1.35425 8.62118 1.43786 8.36365C1.52148 8.10612 1.67926 7.87901 1.89143 7.71079C2.1036 7.54258 2.36072 7.44075 2.63053 7.41808L7.74037 6.9755L9.73498 2.218C9.83914 1.96836 10.0148 1.75513 10.2399 1.60514C10.465 1.45515 10.7295 1.37512 11 1.37512C11.2705 1.37512 11.5349 1.45515 11.76 1.60514C11.9851 1.75513 12.1608 1.96836 12.265 2.218L14.2656 6.9755L19.3737 7.41808C19.6435 7.44075 19.9007 7.54258 20.1128 7.71079C20.325 7.87901 20.4828 8.10612 20.5664 8.36365C20.65 8.62118 20.6557 8.89767 20.5828 9.15844C20.5099 9.4192 20.3617 9.65264 20.1566 9.82948H20.1523Z' fill='%239960E4'/%3E%3C/svg%3E";
    svgImage.alt = "Advertisement Image";

    // Append the SVG image to the container
    imageContainer.appendChild(svgImage);

    // Insert the container below the favorites-add marker
    favoritesMarker.parentNode.insertBefore(imageContainer, favoritesMarker.nextSibling);

    // Insert code for additional images below this comment
    // ...

    // Example for the second image (replace with actual code)
    var image2 = document.createElement("img");
    image2.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'%3E%3Cpath d='M14.7537 18.9613C15.1525 19.3463 15.785 19.3463 16.1837 18.9613L19.965 15.3175C20.0672 15.2248 20.1498 15.1125 20.2078 14.9873C20.2658 14.862 20.2981 14.7264 20.3028 14.5885C20.3075 14.4506 20.2844 14.3131 20.2349 14.1842C20.1855 14.0554 20.1107 13.9378 20.015 13.8384C19.9192 13.7389 19.8045 13.6598 19.6776 13.6055C19.5507 13.5512 19.4142 13.523 19.2762 13.5224C19.1382 13.5219 19.0015 13.549 18.8742 13.6023C18.7468 13.6556 18.6315 13.7338 18.535 13.8325L16.5 15.7933V3.78125C16.5 3.50775 16.3913 3.24544 16.1979 3.05205C16.0045 2.85865 15.7422 2.75 15.4687 2.75C15.1952 2.75 14.9329 2.85865 14.7395 3.05205C14.5461 3.24544 14.4375 3.50775 14.4375 3.78125V15.7933L12.4025 13.8325C12.306 13.7338 12.1906 13.6556 12.0633 13.6023C11.936 13.549 11.7993 13.5219 11.6613 13.5224C11.5233 13.523 11.3868 13.5512 11.2599 13.6055C11.133 13.6598 11.0182 13.7389 10.9225 13.8384C10.8268 13.9378 10.752 14.0554 10.7025 14.1842C10.6531 14.3131 10.63 14.4506 10.6347 14.5885C10.6393 14.7264 10.6716 14.862 10.7297 14.9873C10.7877 15.1125 10.8703 15.2248 10.9725 15.3175L14.7537 18.9613Z' fill='%2302D15C'/%3E%3Cpath d='M7.71554 3.60158C7.52218 3.40846 7.26007 3.29999 6.98679 3.29999C6.71351 3.29999 6.4514 3.40846 6.25804 3.60158L2.47679 7.38283C2.29463 7.57832 2.19546 7.83688 2.20017 8.10405C2.20489 8.37121 2.31312 8.62612 2.50206 8.81506C2.691 9.004 2.94591 9.11223 3.21307 9.11695C3.48023 9.12166 3.7388 9.02249 3.93429 8.84033L5.95554 6.81908V18.7678C5.95554 19.0413 6.06419 19.3036 6.25759 19.497C6.45098 19.6904 6.71328 19.7991 6.98679 19.7991C7.26029 19.7991 7.5226 19.6904 7.71599 19.497C7.90939 19.3036 8.01804 19.0413 8.01804 18.7678V6.81908L10.0393 8.84033C10.2348 9.02249 10.4933 9.12166 10.7605 9.11695C11.0277 9.11223 11.2826 9.004 11.4715 8.81506C11.6605 8.62612 11.7687 8.37121 11.7734 8.10405C11.7781 7.83688 11.6789 7.57832 11.4968 7.38283L7.71554 3.60158Z' fill='%23B4B4B4'/%3E%3C/svg%3E";
    image2.alt = "Second Image";
    imageContainer.appendChild(image2);

    // Example for the third image (replace with actual code)
    var image3 = document.createElement("img");
    image3.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'%3E%3Cpath d='M14.7537 18.9613C15.1525 19.3463 15.785 19.3463 16.1837 18.9613L19.965 15.3175C20.0672 15.2248 20.1498 15.1125 20.2078 14.9873C20.2658 14.862 20.2981 14.7264 20.3028 14.5885C20.3075 14.4506 20.2844 14.3131 20.2349 14.1842C20.1855 14.0554 20.1107 13.9378 20.015 13.8384C19.9192 13.7389 19.8045 13.6598 19.6776 13.6055C19.5507 13.5512 19.4142 13.523 19.2762 13.5224C19.1382 13.5219 19.0015 13.549 18.8742 13.6023C18.7468 13.6556 18.6315 13.7338 18.535 13.8325L16.5 15.7933V3.78125C16.5 3.50775 16.3913 3.24544 16.1979 3.05205C16.0045 2.85865 15.7422 2.75 15.4687 2.75C15.1952 2.75 14.9329 2.85865 14.7395 3.05205C14.5461 3.24544 14.4375 3.50775 14.4375 3.78125V15.7933L12.4025 13.8325C12.306 13.7338 12.1906 13.6556 12.0633 13.6023C11.936 13.549 11.7993 13.5219 11.6613 13.5224C11.5233 13.523 11.3868 13.5512 11.2599 13.6055C11.133 13.6598 11.0182 13.7389 10.9225 13.8384C10.8268 13.9378 10.752 14.0554 10.7025 14.1842C10.6531 14.3131 10.63 14.4506 10.6347 14.5885C10.6393 14.7264 10.6716 14.862 10.7297 14.9873C10.7877 15.1125 10.8703 15.2248 10.9725 15.3175L14.7537 18.9613Z' fill='%23B4B4B4'/%3E%3Cpath d='M7.71554 3.60164C7.52218 3.40852 7.26007 3.30005 6.98679 3.30005C6.71351 3.30005 6.4514 3.40852 6.25804 3.60164L2.47679 7.38289C2.29463 7.57838 2.19546 7.83695 2.20017 8.10411C2.20489 8.37127 2.31312 8.62618 2.50206 8.81512C2.691 9.00406 2.94591 9.11229 3.21307 9.11701C3.48023 9.12172 3.7388 9.02255 3.93429 8.84039L5.95554 6.81914V18.7679C5.95554 19.0414 6.06419 19.3037 6.25759 19.4971C6.45098 19.6905 6.71328 19.7991 6.98679 19.7991C7.26029 19.7991 7.5226 19.6905 7.71599 19.4971C7.90939 19.3037 8.01804 19.0414 8.01804 18.7679V6.81914L10.0393 8.84039C10.2348 9.02255 10.4933 9.12172 10.7605 9.11701C11.0277 9.11229 11.2826 9.00406 11.4715 8.81512C11.6605 8.62618 11.7687 8.37127 11.7734 8.10411C11.7781 7.83695 11.6789 7.57838 11.4968 7.38289L7.71554 3.60164Z' fill='%23FB4256'/%3E%3C/svg%3E";
    image3.alt = "Third Image";
    imageContainer.appendChild(image3);

    // Example for the fourth image (replace with actual code)
    var image4 = document.createElement("img");
    image4.src = "data:image/svg+xml,%3Csvg width='47' height='19' viewBox='0 0 47 19' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='47' height='19' rx='9.5' fill='%23202020'/%3E%3Cpath d='M13.064 14.096C12.424 14.096 11.832 13.992 11.288 13.784C10.752 13.568 10.284 13.268 9.884 12.884C9.492 12.492 9.184 12.036 8.96 11.516C8.736 10.996 8.624 10.424 8.624 9.8C8.624 9.176 8.736 8.604 8.96 8.084C9.184 7.564 9.496 7.112 9.896 6.728C10.296 6.336 10.764 6.036 11.3 5.828C11.844 5.612 12.436 5.504 13.076 5.504C13.724 5.504 14.32 5.616 14.864 5.84C15.416 6.056 15.884 6.38 16.268 6.812L15.488 7.568C15.168 7.232 14.808 6.984 14.408 6.824C14.008 6.656 13.58 6.572 13.124 6.572C12.652 6.572 12.212 6.652 11.804 6.812C11.404 6.972 11.056 7.196 10.76 7.484C10.464 7.772 10.232 8.116 10.064 8.516C9.904 8.908 9.824 9.336 9.824 9.8C9.824 10.264 9.904 10.696 10.064 11.096C10.232 11.488 10.464 11.828 10.76 12.116C11.056 12.404 11.404 12.628 11.804 12.788C12.212 12.948 12.652 13.028 13.124 13.028C13.58 13.028 14.008 12.948 14.408 12.788C14.808 12.62 15.168 12.364 15.488 12.02L16.268 12.776C15.884 13.208 15.416 13.536 14.864 13.76C14.32 13.984 13.72 14.096 13.064 14.096ZM22.3373 14L19.8773 10.904L20.8253 10.328L23.6933 14H22.3373ZM17.7293 14V7.64H18.8813V14H17.7293ZM18.5333 11.312V10.328H20.6333V11.312H18.5333ZM20.9213 10.952L19.8533 10.808L22.2893 7.64H23.5253L20.9213 10.952ZM27.4142 14.072C26.7742 14.072 26.2062 13.932 25.7102 13.652C25.2142 13.372 24.8222 12.988 24.5342 12.5C24.2462 12.004 24.1022 11.444 24.1022 10.82C24.1022 10.188 24.2462 9.628 24.5342 9.14C24.8222 8.652 25.2142 8.272 25.7102 8C26.2062 7.72 26.7742 7.58 27.4142 7.58C28.0462 7.58 28.6102 7.72 29.1062 8C29.6102 8.272 30.0022 8.652 30.2822 9.14C30.5702 9.62 30.7142 10.18 30.7142 10.82C30.7142 11.452 30.5702 12.012 30.2822 12.5C30.0022 12.988 29.6102 13.372 29.1062 13.652C28.6102 13.932 28.0462 14.072 27.4142 14.072ZM27.4142 13.064C27.8222 13.064 28.1862 12.972 28.5062 12.788C28.8342 12.604 29.0902 12.344 29.2742 12.008C29.4582 11.664 29.5502 11.268 29.5502 10.82C29.5502 10.364 29.4582 9.972 29.2742 9.644C29.0902 9.308 28.8342 9.048 28.5062 8.864C28.1862 8.68 27.8222 8.588 27.4142 8.588C27.0062 8.588 26.6422 8.68 26.3222 8.864C26.0022 9.048 25.7462 9.308 25.5542 9.644C25.3622 9.972 25.2662 10.364 25.2662 10.82C25.2662 11.268 25.3622 11.664 25.5542 12.008C25.7462 12.344 26.0022 12.604 26.3222 12.788C26.6422 12.972 27.0062 13.064 27.4142 13.064ZM31.2748 13.988L31.3468 13.016C31.4028 13.024 31.4548 13.032 31.5028 13.04C31.5508 13.048 31.5948 13.052 31.6348 13.052C31.8908 13.052 32.0908 12.964 32.2348 12.788C32.3868 12.612 32.4988 12.38 32.5708 12.092C32.6428 11.796 32.6948 11.464 32.7268 11.096C32.7588 10.728 32.7828 10.36 32.7988 9.992L32.9068 7.64H37.7908V14H36.6388V8.312L36.9148 8.648H33.6508L33.9148 8.3L33.8308 10.064C33.8068 10.624 33.7628 11.148 33.6988 11.636C33.6348 12.124 33.5348 12.552 33.3988 12.92C33.2708 13.288 33.0908 13.576 32.8588 13.784C32.6348 13.992 32.3428 14.096 31.9828 14.096C31.8788 14.096 31.7668 14.084 31.6468 14.06C31.5348 14.044 31.4108 14.02 31.2748 13.988Z' fill='white'/%3E%3C/svg%3E";
    image4.alt = "Fourth Image";
    imageContainer.appendChild(image4);

    // Example for the fourth image (replace with actual code)
    var image5 = document.createElement("img");
    image5.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='19' viewBox='0 0 20 19' fill='none'%3E%3Cpath d='M19.5899 15.36L12.0069 1.424C11.5149 0.511 10.7789 0 9.98885 0C9.19885 0 8.47385 0.521 7.97285 1.434L0.408853 15.361C-0.0811465 16.262 -0.135147 17.186 0.270853 17.891C0.675853 18.598 1.48685 19 2.48985 19H17.5099C18.5129 19 19.3239 18.598 19.7299 17.892C20.1349 17.186 20.0809 16.273 19.5899 15.361V15.36ZM9.99985 4.357C10.3949 4.357 10.7149 4.683 10.7149 5.085V11.668C10.7149 12.07 10.3949 12.396 9.99985 12.396C9.90508 12.3952 9.8114 12.3758 9.72416 12.3387C9.63692 12.3017 9.55783 12.2479 9.49142 12.1802C9.42502 12.1126 9.37259 12.0326 9.33714 11.9447C9.3017 11.8568 9.28393 11.7628 9.28485 11.668V5.084C9.28485 4.693 9.60485 4.357 9.99985 4.357ZM9.99985 15.981C9.38085 15.981 8.88985 15.471 8.88985 14.841C8.88985 14.211 9.39185 13.7 9.99985 13.7C10.6189 13.7 11.1099 14.21 11.1099 14.84C11.1099 15.47 10.6079 15.981 9.99985 15.981Z' fill='%23FB4256'/%3E%3C/svg%3E";
    image5.alt = "Fifth Image";
    imageContainer.appendChild(image5);  
  }
}
// Delay execution for 2 seconds (adjust as needed)
setTimeout(function () {
  var announcements = document.querySelectorAll('[data-marker=bx-recommendations-block-item]');
  if (announcements == null || announcements.length == 0)
    announcements = document.querySelectorAll('[data-marker=item]');

  announcements.forEach((announcement) => {
    // Add the SVG image below the favorites-add marker
    addImageBelowFavorites(announcement);
  });

  if (announcements.length == 0) {
    // Add the SVG image below the favorites-add marker for single announcement
    addImageBelowFavorites(document);
  }
}, 2000);  // Adjust the delay as needed

  var ads = [];

  announcements.forEach((announcement) => {
    var name = announcement.querySelector("[itemprop=name]").textContent;

    var priceCurrency = announcement.querySelector("[itemprop=priceCurrency]").content;
    var price = announcement.querySelector("[itemprop=price]").content;
    var url = announcement.querySelector("a[itemprop=url]").href;
    var place = announcement.querySelector("[class*=geo-root]").querySelector("span").textContent;

    var xx = announcement.querySelector("[itemprop=description]");
    var desc = xx === null ? "empty" : xx.content;

    var yy = announcement.querySelector("[data-marker=item-date]");
    var itemDate = yy === null ? "01.01.1970" : yy.textContent;

    var urlIndex = url.indexOf("?");
    urlIndex = urlIndex == -1 ? url.length : urlIndex;

    url = url.substring(0, urlIndex);

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

    ads.push(output);

    // Add the PNG image below the favorites-add marker
    addImageBelowFavorites(announcement);
  });

  if (announcements.length == 0) {
    // ... (similar modifications for single announcement)

    let output = {
      category: getCategory(),
      specifications: specifications,
      name: name,
      description: desc,
      priceCurrency: priceCurrency,
      price: price,
      url: url,
      date: itemDate,
      place: place
    };

    ads.push(output);

    // Add the PNG image below the favorites-add marker
    addImageBelowFavorites(document);
  }

  const newData = {
    count: ads.length,
    advertisements: ads
  };

  console.log(JSON.stringify(newData, null, 2));

  var host = 'https://api.sadykoff.ru';
  //var  host = 'http://localhost:8080'/

  fetch(host + '/api/v1/add', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newData)
  }).then(res => res.json())
    .then(res => console.log(res));
};

document.querySelector('#Close').onclick = function () {
  window.close();
};

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

var switches1 = document.querySelectorAll('.switch1');

switches1.forEach(function (switch1Element) {
  var checkbox1 = switch1Element.querySelector('.checkbox1');

  checkbox1.addEventListener("click", async function () {
    if (checkbox1.checked) {
      switch1Element.classList.add('checked1');
    } else {
      switch1Element.classList.remove('checked1');
    }
  });
});