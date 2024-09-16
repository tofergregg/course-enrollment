#!/usr/bin/env python
import sys
import json
import time
import os

CACHE_DIR = 'cache/'
TIMEOUT = 60 * 30 # 30 minute timeout
# TIMEOUT = 60 * 1 # 1 minute timeout

print("Content-type: application/json\n")
input_text = ''
while True:
    try:
        line = raw_input()
        input_text += line
    except EOFError:
        break
data = json.loads(input_text)
# data should have a single field: { courseQtr: 1252 }

filename = CACHE_DIR + str(data['courseQtr']) + '.json'

try:
    seconds_elapsed = time.time() - os.path.getmtime(filename)
    if seconds_elapsed > TIMEOUT:
        print(json.dumps({'status': 'stale'}))
        quit()
    with open(filename) as f:
        schedule = f.read() # should already be json formatted
except (IOError, OSError):
    print(json.dumps({'status': 'not cached'}))
    quit()


print(schedule)
