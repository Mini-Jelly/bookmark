const fs = require('fs');
const cheerio = require('cheerio');

// 读取 bookmarks.html 文件
fs.readFile('bookmarks.html', 'utf8', (err, content) => {
  if (err) {
    console.error('Failed to read file:', err);
    return;
  }

  // 去除所有的 <p> 和 <DT> , 防止干扰
  content = content.replace(/<\/?(p|DT)[^>]*>/g, '');

  // 使用 cheerio 解析修改后的 HTML 内容
  const $ = cheerio.load(content);

  // 递归函数来提取书签数据
  function extractBookmarks(dl) {
    const bookmarks = [];
    $(dl).children().each((index, element) => {
      if ($(element).is('h3')) {  // 文件夹名称
        const folderName = $(element).text().trim();
        const folderContent = [];

        // 查找该文件夹下的 dl 标签并递归提取
        const nextDl = $(element).next('dl');
        if (nextDl.length > 0) {
          folderContent.push(...extractBookmarks(nextDl));
        }

        bookmarks.push({ fname: folderName, content: folderContent });
      } else if ($(element).is('a')) {  // 链接
        const linkName = $(element).text().trim();
        const linkUrl = $(element).attr('href') || '';
        bookmarks.push({ name: linkName, url: linkUrl });
      }
    });
    return bookmarks;
  }

  // 查找 dl 标签并开始解析
  const rootDl = $('dl').eq(1);  // 选择第二个 dl 标签作为根部
  const bookmarks = extractBookmarks(rootDl);

  // 获取当前时间并格式化
  const current_time = new Date().toISOString().replace('T', ' ').slice(0, 19);

  // 输出为 JSON 格式
  const jsonOutput = JSON.stringify(bookmarks, null, 4);

  // 保存到文件
  fs.writeFileSync('data.json', jsonOutput, 'utf-8');
  console.log(`[${current_time}]The data has been successfully saved as data.json`);
});