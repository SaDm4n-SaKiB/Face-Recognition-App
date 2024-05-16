let video;
let canvas;
let nameInput;

function init() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    nameInput = document.getElementById('name');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error('Error accessing webcam:', error);
            alert('Cannot access webcam');
        });
}

function capture() {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
}

function register() {
    const name = nameInput.value;
    const photo = dataURItoBlob(canvas.toDataURL());

    if (!name || !photo) {
        // Show alert for missing name or photo
        document.getElementById('registerFailureAlert').classList.remove('d-none');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('photo', photo, `${name}.jpg`);

    fetch('/register', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success alert
            document.getElementById('registerSuccessAlert').classList.remove('d-none');
            // Redirect to homepage after a short delay
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            // Show failure alert
            document.getElementById('registerFailureAlert').classList.remove('d-none');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function login() {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photo = dataURItoBlob(canvas.toDataURL());

    if (!photo) {
        // Show alert for missing photo
        document.getElementById('loginFailureAlert').classList.remove('d-none');
        return;
    }

    const formData = new FormData();
    formData.append('photo', photo, 'login.jpg');

    fetch('/login', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to success page
            window.location.href = '/success?user_name=' + nameInput.value;
        } else {
            // Show login failure alert
            document.getElementById('loginFailureAlert').classList.remove('d-none');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

init();