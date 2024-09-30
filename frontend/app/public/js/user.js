const BACKEND_URL = `http://${process.env.FREEUNTIS_SERVERNAME || 'localhost'}:${process.env.PORT_BACKEND || 8000}`;

function login() {
    username = document.getElementById('floatingInput').value;
    password = document.getElementById('floatingPassword').value;

    data = { username, password }
    api_post('/login', data, () => {window.location = '/'})
};

function register() {
  username = document.getElementById('floatingInput').value;
  password = document.getElementById('floatingPassword').value;
  confirm_password = document.getElementById('floatingPasswordRe').value;

  data = { username, password, confirm_password }
  resp = api_post(
    '/register', data, () => {window.location = '/login.html'}
  )
};


function logout() {
  fetch(BACKEND_URL + '/logout', {
    method: 'GET',
    credentials: 'include'
  })
  .then(response => {
    if (response.ok) {
      window.location.href = '/login.html'
    }
    else{
      console.error('Error: logout failed!');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
};