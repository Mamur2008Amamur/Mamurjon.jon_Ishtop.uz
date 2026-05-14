import os

file_path = r'c:\Users\hp\OneDrive\Desktop\edubot_fixed\client\js\services.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace combinations of escaped characters
content = content.replace('\\`', '`')
content = content.replace('\\${', '${')
content = content.replace('\\n', '\n')
content = content.replace('\\\'', '\'')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("FIX APPLIED")
