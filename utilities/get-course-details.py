#!/usr/bin/env python

from bs4 import BeautifulSoup
import requests
import re
import json
import codecs

QUARTER = "Autumn"
YEAR = "2024"
COURSE_QUARTER = "1252"

courses = [('CS103', 1420), ('CS105', 1546), ('CS106A', 1329), ('CS106AX', 1544), ('CS106B', 1336), ('CS107', 1443), ('CS107E', 6267), ('CS109', 1508), ('CS111', 29516), ('CS120', 6934), ('CS123', 1796), ('CS139', 31167), ('CS145', 1444), ('CS147', 29518), ('CS147L', 1817), ('CS148', 1656), ('CS149', 1535), ('CS154', 1492), ('CS157', 1397), ('CS161', 1493), ('CS173A', 29663), ('CS177', 29520), ('CS221', 1446), ('CS222', 29539), ('CS224V', 1652), ('CS224W', 1720), ('CS229', 1447), ('CS229S', 1799), ('CS230', 6397), ('CS237A', 1826), ('CS248B', 29588), ('CS259Q', 29587), ('CS279', 1727), ('CS326', 1836), ('CS329H', 1800), ('CS329M', 29574), ('CS329R', 29204), ('CS329T', 29563), ('CS329X', 29562), ('CS349H', 1606), ('CS356', 29561), ('CS369O', 5637), ('CS377G', 29560), ('CS448B', 29559), ('CS468', 29558), ('CS547', 1414),]

MAIN_URL = 'https://navigator.stanford.edu/classes/COURSEQTR/CLASSNUM'

def main():
    headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.90 Safari/537.36'}

    for course_num, class_num in courses:
        url = MAIN_URL.replace('COURSEQTR', COURSE_QUARTER).replace('CLASSNUM', str(class_num))
        page = requests.get(url, headers=headers)
        soup = BeautifulSoup(page.content, "html.parser")
        script = soup.find('script', text=re.compile('self.__next_f.push.*classData.*')).string
        script = script[script.index('{'):-6]
        data = json.loads(codecs.decode(script.encode('utf-8'), 'unicode-escape'))['classData']
        enrollment = data['sectionTotalEnrollment']
        waitlist = data['sectionTotalWaitlist']
        courseCode = data['sectionCourseCode']
        capacity = data['sectionCapacityEnrollment']
        crosslisted = 'combinedSections' in data
        print(courseCode + "," + str(enrollment) + "," + str(capacity) + "," + str(waitlist) + ',' + str(crosslisted))

if __name__ == "__main__":
    main()
