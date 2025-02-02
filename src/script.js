// 递归生成书签文件夹和链接
function generateBookmarks(bookmarks, container) {
    bookmarks.forEach(bookmark => {
        if (bookmark.fname) {
            // 文件夹
            const folderElement = document.createElement('div');
            folderElement.classList.add('folder');
            folderElement.innerHTML = `
                <div class="folder-title">${bookmark.fname}</div>
                <div class="folder-content"></div>
            `;
            container.appendChild(folderElement);
            const folderContent = folderElement.querySelector('.folder-content');
            generateBookmarks(bookmark.content, folderContent);
            folderElement.querySelector('.folder-title').addEventListener('click', () => {
                folderElement.classList.toggle('open');
            });
        } else if (bookmark.name && bookmark.url) {
            // 书签
            const bookmarkElement = document.createElement('div');
            bookmarkElement.classList.add('bookmark');
            bookmarkElement.innerHTML = `<a href="${bookmark.url}" target="_blank">${bookmark.name}</a>`;
            container.appendChild(bookmarkElement);
        }
    });
}

// 从本地 JSON 文件加载书签数据
document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')  // 假设 JSON 文件在当前文件夹下
        .then(response => response.json())
        .then(bookmarksData => {
            const container = document.getElementById('bookmarkContainer');
            generateBookmarks(bookmarksData, container);
        })
        .catch(error => {
            console.error('加载书签数据失败:', error);
        });
});