const BACKEND_URL = `http://${process.env.FREEUNTIS_SERVERNAME || 'localhost'}:${process.env.PORT_BACKEND || 8000}`;

(function() {
    fetch(BACKEND_URL + '/current_user', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (!data.userId) {
            document.getElementById('logout-button').style.display = 'none';
            document.getElementById('login-button').style.display = 'block';
            document.getElementById('register-button').style.display = 'block';
            document.getElementById('notification-box').style.display = 'none';
            window.location.href = '/login.html';
        } else {
            document.getElementById('logout-button').style.display = 'block';
            document.getElementById('login-button').style.display = 'none';
            document.getElementById('register-button').style.display = 'none';
            document.getElementById('notification-box').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error in checkIfLoggedIn.js: ', error);
    });
})();