
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const loginButton = document.querySelector('.login-button');

loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

   
    loginMessage.textContent = 'Iniciando sesión...';
    loginMessage.style.color = '#555';
    loginButton.disabled = true;
    loginButton.textContent = 'Verificando...';

    try {
        
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

      
        if (!response.ok) {
            throw new Error(data.message || 'No se pudo iniciar sesión');
        }

      
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
       if (data.user.role === 'admin') {
         window.location.href = './admin.html';
      } else {
    window.location.href = './home.html';
     }

       
        loginMessage.style.color = 'green';
        loginMessage.textContent =
            `¡Bienvenido/a, ${data.user.name}!`;

        console.log('Usuario autenticado:', data.user);

    } catch (error) {
        loginMessage.style.color = 'red';
        loginMessage.textContent = error.message;
        console.error('Error de inicio de sesión:', error);

    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Iniciar sesión';
    }
});
