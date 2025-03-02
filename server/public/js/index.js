document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const uploadForm = document.getElementById('uploadForm');
    const logoutButton = document.getElementById('logoutButton');
    const fileList = document.getElementById('fileList');
    const loginError = document.getElementById('loginError');

    async function loadFiles() {
        const response = await fetch('/files');
        if (response.ok) {
            const data = await response.json();
            fileList.innerHTML = data.map(
                file => `<li>${file.filename} (Size: ${file.size} bytes) <a href="${file.downloadPage}">Download</a></li>`
            ).join('');
        }
    }

    loginForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;

        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            window.location.reload();
        } else {
            loginError.classList.remove('hide');
        }
    });

    signupForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = signupForm.username.value;
        const email = signupForm.email.value;
        const password = signupForm.password.value;

        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            window.location.reload();
        } else {
            alert('something went wrong')
        }
    });

    uploadForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', uploadForm.file.files[0]);

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            loadFiles();
        } else {
            alert('Failed to upload file');
        }
    });

    logoutButton?.addEventListener('click', async function() {
        const response = await fetch('/logout', { method: 'POST' });
        if (response.ok) {
            window.location.reload();
        } else {
            alert('Failed to log out');
        }
    });

    if(!loginForm) {
        loadFiles();
    }
});