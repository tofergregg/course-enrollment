#!/usr/bin/env python

from bs4 import BeautifulSoup
import requests
import re
import json

QUARTER = "Autumn"
YEAR = "2024"

MAIN_URL = 'https://navigator.stanford.edu/classes?classes%5BrefinementList%5D%5BtermOffered%5D%5B0%5D=Autumn%202024&classes%5Bquery%5D=cs%20COURSENUM'


def main():
    courses = ['CS103', 'CS105', 'CS106A', 'CS106AX', 'CS106B', 'CS107', 'CS107E', 'CS109', 'CS111', 'CS120', 'CS123', 'CS139', 'CS145', 'CS147', 'CS147L', 'CS148', 'CS149', 'CS154', 'CS157', 'CS161', 'CS173A', 'CS177', 'CS179', 'CS221', 'CS222', 'CS224V', 'CS224W', 'CS229', 'CS229S', 'CS230', 'CS237A', 'CS248B', 'CS259Q', 'CS279', 'CS326', 'CS329H', 'CS329M', 'CS329R', 'CS329T', 'CS329X', 'CS349H', 'CS356', 'CS369O', 'CS377G', 'CS448B', 'CS468', 'CS547', ]

    courses = ['CS7', 'CS44N', 'CS83N', 'CS100A', 'CS100B', 'CS103A', 'CS106AX', 'CS106L', 'CS106M', 'CS106S', 'CS107A', 'CS109A', 'CS111A', 'CS137A', 'CS161A', 'CS171', 'CS183E', 'CS191', 'CS191W', 'CS192', 'CS193Q', 'CS195', 'CS197', 'CS198', 'CS198B', 'CS199', 'CS199P', 'CS227A', 'CS229M', 'CS241', 'CS274', 'CS300', 'CS309A', 'CS315B', 'CS328', 'CS337', 'CS362', 'CS390A', 'CS390B', 'CS390C', 'CS390D', 'CS399', 'CS399P', 'CS476A', 'CS499', 'CS499P', 'CS522', 'CS528', 'CS802', ]

    headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.90 Safari/537.36'}

    for course in courses:
        url = MAIN_URL.replace('COURSENUM', course[2:])
        page = requests.get(url, headers=headers)
        soup = BeautifulSoup(page.content, "html.parser")
        # script = soup.findAll('mark')[0]
        # import pdb;pdb.set_trace()
        refs = soup.findAll('a')
        for idx, ref in enumerate(refs):
            if '1252' in ref['href']:
                print(course + ": " + ref['href'])
                break


if __name__ == "__main__":
    main()
