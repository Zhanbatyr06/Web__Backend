// Функция для получения списка файлов с сервера и обновления таблицы
async function fetchFiles() {
    try {
        const response = await fetch('/api/files'); // Отправляем запрос на сервер
        if (!response.ok) {
            throw new Error('Failed to fetch files');
        }

        const files = await response.json();

        // Обновляем таблицу "Activity History"
        const tableBody = document.querySelector('#history tbody');
        tableBody.innerHTML = ''; // Очищаем таблицу

        files.forEach((file) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${file.name}</td>
                <td>${new Date(file.uploadedAt).toLocaleString()}</td>
                <td>Uploaded</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching files:', error);
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = 'Unable to fetch files. Please try again later.';
        errorMessage.classList.remove('d-none');
    }
}

// Функция для обработки успешной загрузки файла
function handleUploadSuccess() {
    fetchFiles(); // После загрузки файла обновляем "Activity History"
}

// Добавляем обработчик событий на форму загрузки
document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.querySelector('form[method="POST"][action="/api/upload"]');

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Предотвращаем стандартное поведение формы

        const formData = new FormData(uploadForm);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('File uploaded successfully!');
                handleUploadSuccess(); // Обновляем список файлов
                uploadForm.reset(); // Сбрасываем форму после успешной загрузки
            } else {
                const uploadError = document.getElementById('uploadError');
                uploadError.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            const uploadError = document.getElementById('uploadError');
            uploadError.textContent = 'Error uploading file. Please try again.';
            uploadError.classList.remove('d-none');
        }
    });

    // Загружаем список файлов при загрузке страницы
    fetchFiles();
});
