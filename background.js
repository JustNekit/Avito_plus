// POST запрос
function sendDataToServer(data) {
    const url = 'http://api.site.ru/savedata';
    const xhr = new XMLHttpRequest();
  
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
  
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          console.log('Данные успешно отправлены на сервер.');
        } else {
          console.error('Ошибка при отправке данных на сервер:', xhr.statusText);
        }
      }
    };
  
    xhr.onerror = function() {
      console.error('Произошла ошибка при выполнении запроса.');
    };
  
    xhr.send(data);
  }
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'parseAndSendData') {
      const data = JSON.parse(request.data); // Преобразуем передаваемую строку JSON в объект
  
      // Отправляем данные на сервер
      sendDataToServer(JSON.stringify(data));
    }
  });