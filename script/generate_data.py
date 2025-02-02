import os
import json
from bs4 import BeautifulSoup
from datetime import datetime

# 读取 bookmarks.html 文件
try:
    with open('bookmarks.html', 'r', encoding='utf-8') as f:
        content = f.read()
except Exception as e:
    print(f"Failed to read file: {e}")
    exit()

# 去除所有的 <p> 和 <DT> 标签
content = content.replace('<p>', '').replace('<DT>', '')

# 使用 BeautifulSoup 解析 HTML 内容
soup = BeautifulSoup(content, 'html.parser')

# 递归函数来提取书签数据
def extract_bookmarks(dl):
    bookmarks = []
    for element in dl.children:
        if element.name == 'h3':  # 文件夹名称
            folder_name = element.get_text(strip=True)
            folder_content = []

            # 查找该文件夹下的 dl 标签并递归提取
            next_dl = element.find_next('dl')
            if next_dl:
                folder_content.extend(extract_bookmarks(next_dl))

            bookmarks.append({'fname': folder_name, 'content': folder_content})
        elif element.name == 'a':  # 链接
            link_name = element.get_text(strip=True)
            link_url = element.get('href', '')
            bookmarks.append({'name': link_name, 'url': link_url})

    return bookmarks

# 查找根部的 dl 标签并开始解析
root_dl = soup.find_all('dl')[1] #选择第二个dl标签作为根
bookmarks = extract_bookmarks(root_dl)

# 获取当前时间并格式化
current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# 输出为 JSON 格式
json_output = json.dumps(bookmarks, indent=4, ensure_ascii=False)

# 保存到文件
try:
    with open('data.json', 'w', encoding='utf-8') as f:
        f.write(json_output)
    print(f"[{current_time}] The data has been successfully saved as data.json")
except Exception as e:
    print(f"Failed to write file: {e}")
