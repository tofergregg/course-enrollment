#!/usr/bin/env python
import json
import requests
import sys

print("Content-type: text/html\n")
input_text = ''
while True:
    try:
        line = raw_input()
        input_text += line
    except EOFError:
        break
data = json.loads(input_text)
MAIN_URL = 'https://navigator.stanford.edu/classes/COURSEQTR/CLASSNBR';
url = MAIN_URL.replace('COURSEQTR', str(data['courseQtr'])).replace('CLASSNBR', str(data['classNbr']))
page = requests.get(url).content.split('\n')
for line in page:
    print(line[:-1])
