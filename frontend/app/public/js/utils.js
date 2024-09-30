const BACKEND_URL = `http://${process.env.FREEUNTIS_SERVERNAME || 'localhost'}:${process.env.PORT_BACKEND || 8000}`;

/*
Shows Alert in alert-box contining specified message
*/
function addAlert(message) {
    alertElem = $('<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
            message +
            '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'+
        '</div>');

    $('#alert-box').append(alertElem)
    alertElem.fadeTo(3000, 500).fadeOut("slow", () => {$(this).remove()});
}


/*
Sends data to the specified backend endpoint.
Shows Alert if response is not ok.
Action is a function that gets called when the response 
is ok, it gets as parameter the response.
Returns response.json()

Example: 
data = { username, password }
api_post('/login', data, (res) => {window.location = '/'})
*/
function api_post(endpoint, data, action) {
  fetch(BACKEND_URL + endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(async response => {
    if (response.ok) {
        if (typeof action === 'function')
            action(response);
    } else {
      //console.error(result);
      const result = await response.json()
      
      if (result.error) {
        addAlert(result.message);
      }
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}


function api_get(endpoint, action) {
  fetch(BACKEND_URL + endpoint, {
    method: 'GET',
    credentials: 'include',
  })
  .then(async response => {
    if (response.ok) {
        if (typeof action === 'function')
          action(response);
    } else {
      const result = await response.json()
      if (result.error) {
        addAlert(result.message);
      }
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}