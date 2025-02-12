// Функция для получения списка файлов с сервера и обновления таблицы
async function fetchFiles() {
    try {
        const response = await fetch('/api/files');
        if (!response.ok) {
            throw new Error('Failed to fetch files');
        }

        const files = await response.json();

        const tableBody = document.querySelector('#history tbody');
        tableBody.innerHTML = ''; // Очищаем таблицу перед обновлением

        files.forEach((file) => {
            const row = tableBody.insertRow(); // Используем insertRow() для добавления строк
            const nameCell = row.insertCell();
            const dateCell = row.insertCell();
            const downloadCell = row.insertCell();

            nameCell.textContent = file.name;
            dateCell.textContent = new Date(file.uploadedAt).toLocaleString();

            const downloadButton = document.createElement('button'); // Создаем кнопку программно
            downloadButton.classList.add('btn', 'btn-success', 'btn-sm', 'download-btn');
            downloadButton.dataset.fileid = file._id;  // dataset вместо getAttribute/setAttribute
            downloadButton.textContent = 'Download';

            downloadCell.appendChild(downloadButton);
        });

        // Обработчик событий на кнопки "Download" (делегирование событий)
        document.getElementById('history').addEventListener('click', async (event) => { // <-- add event listener on the parent element
            if (event.target.classList.contains('download-btn')) { // <-- check that the target has the expected class
                const fileId = event.target.dataset.fileid;
                downloadFile(fileId);
            }
        });

    } catch (error) {
        console.error('Error fetching files:', error);
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = 'Unable to fetch files. Please try again later.';
        errorMessage.classList.remove('d-none');
    }
}


async function downloadFile(fileId) {
    try {
        const response = await fetch(`/api/download/${fileId}`);
        if (!response.ok) {
            throw new Error('Failed to download file');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.headers.get('Content-Disposition')?.split('filename=')[1] || `file_${fileId}`; // Динамическое имя файла из headers
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading file:', error);
        alert('Error downloading file. Please try again.');
    }
}


function handleUploadSuccess() {
    fetchFiles(); // Обновляем "Activity History" после загрузки
    document.getElementById('uploadError').classList.add('d-none'); // Hide error message if upload is successful
}

document.addEventListener('DOMContentLoaded', () => {

    const uploadForm = document.querySelector('form[method="POST"][action="/api/upload"]');
    const uploadError = document.getElementById('uploadError');

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(uploadForm);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                handleUploadSuccess();
                uploadForm.reset(); // Очищаем форму
            } else {
                const errorData = await response.json(); // Get error data from response
                console.error('Upload error:', errorData); // Log the error on the console
                uploadError.textContent = errorData.error || 'File upload failed!'; // Set the error message to display
                uploadError.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Upload error:', error);
            uploadError.textContent = 'A network error occurred. Please try again later.';
            uploadError.classList.remove('d-none');
        }
    });

    fetchFiles(); // Загружаем список файлов при загрузке страницы

});