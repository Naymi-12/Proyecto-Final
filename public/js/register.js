
const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');
const registerButton = document.getElementById('registerButton');

registerForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    
    if (password !== confirmPassword) {
        registerMessage.style.color = 'red';
        registerMessage.textContent = 'Las contraseñas no coinciden.';
        return;
    }

    registerMessage.style.color = '#555';
    registerMessage.textContent = 'Creando cuenta...';

    registerButton.disabled = true;
    registerButton.textContent = 'Registrando...';

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                role: 'user'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'No se pudo crear la cuenta.');
        }

        registerMessage.style.color = 'green';
        registerMessage.textContent =
            '¡Cuenta creada correctamente! Ahora puedes iniciar sesión.';

        registerForm.reset();

    } catch (error) {
        registerMessage.style.color = 'red';
        registerMessage.textContent = error.message;

    } finally {
        registerButton.disabled = false;
        registerButton.textContent = 'Crear cuenta';
    }
});
