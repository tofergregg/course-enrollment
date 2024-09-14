#!/usr/bin/env python
import sys
import json
import time
import os

CACHE_DIR = 'cache/'
TIMEOUT = 60 * 10 # 10 minute timeout
TIMEOUT = 60 * 1 # 1 minute timeout

print("Content-type: application/json\n")
input_text = ''
while True:
    try:
        line = raw_input()
        input_text += line
    except EOFError:
        break
data = json.loads(input_text)
data['status'] = 'cached'

# data should have the following field: {'courseQtr': 1234 }

filename = CACHE_DIR + str(data['courseQtr']) + '.json'

with open(filename, "w") as f:
    json.dump(data, f)
    f.write('\n')

print(json.dumps("{'status': 'stored to cache'}"))
