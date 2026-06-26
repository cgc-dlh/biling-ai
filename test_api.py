import requests
import json

url = "https://apihub.agnes-ai.com/v1/chat/completions"
headers = {
    "Authorization": "Bearer sk-cGqfyRpuXTOMfYwtddBuJdrq5yX183G229uMbK2Uvjajgxrk",
    "Content-Type": "application/json"
}
data = {
    "model": "agnes-2.0-flash",
    "messages": [
        {"role": "user", "content": "请用中文回复：测试 Agnes AI 中文输出是否正常"}
    ],
    "temperature": 0.8,
    "max_tokens": 500
}

response = requests.post(url, headers=headers, json=data)
print("Status:", response.status_code)
print("Headers:", response.headers.get('content-type'))
print("Raw text:", response.text[:500])
print("---")
result = response.json()
content = result['choices'][0]['message']['content']
print("Content:", content)
print("Content type:", type(content))
print("Content bytes:", content.encode('utf-8')[:100])