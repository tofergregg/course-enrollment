"use strict";
// missing 106AX
const courses = [['7', 1658], ['44N', 1585], ['103', 1420], ['105', 1546], ['106A', 1329], ['106B', 1336], ['106L', 1668], ['106M', 1586], ['106S', 1669], ['107', 1443], ['107E', 6267], ['109', 1508], ['111', 29516], ['120', 6934], ['123', 1796], ['137A', 1849], ['139', 31167], ['145', 1444], ['147', 29518], ['147L', 1817], ['148', 1656], ['149', 1535], ['154', 1492], ['157', 1397], ['161', 1493], ['171', 29256], ['173A', 29663], ['177', 29520], ['183E', 6309], ['193Q', 29524], ['197', 29525], ['198', 31911], ['198B', 1494], ['221', 1446], ['222', 29539], ['224V', 1652], ['224W', 1720], ['227A', 29592], ['229', 1447], ['229M', 1572], ['229S', 1799], ['230', 6397], ['237A', 1826], ['238', 1726], ['240', 29820], ['241', 29546], ['242', 29590], ['247A', 29589], ['248B', 29588], ['259Q', 29587], ['274', 1464], ['279', 1727], ['300', 1413], ['309A', 7145], ['315B', 1572], ['326', 1836], ['328', 29575], ['329H', 1800], ['329M', 29574], ['329R', 29204], ['329T', 29563], ['329X', 29562], ['337', 1843], ['349H', 1606], ['356', 29561], ['362', 32069], ['369O', 5637], ['377G', 29560], ['448B', 29559], ['468', 29558], ['476A', 1401], ['522', 1732], ['528', 1840], ['547', 1414],];
;
const init = async () => {
    const QUARTER = "Autumn";
    const YEAR = 2024;
    const COURSE_QUARTER = 1252;
    let classList = [];
    const data = await getCachedData(COURSE_QUARTER);
    if (data.status == 'cached' && data.classList) {
        classList = data.classList;
        populateDiv(classList);
    }
    else {
        for (let courseDetails of courses) {
            const courseNbr = courseDetails[1];
            getOneClass(classList, courseNbr, QUARTER, COURSE_QUARTER, courses.length);
        }
    }
};
const getOneClass = (classList, classNbr, quarter, courseQtr, numCourses) => {
    // const MAIN_URL = 'https://navigator.stanford.edu/classes/COURSEQTR/CLASSNBR';
    // const url = MAIN_URL.replace('COURSEQTR', courseQtr.toString()).replace('CLASSNBR', classNbr.toString());
    // fetch(url)
    getClassPage(classNbr, courseQtr)
        // .then(response => response.text())
        .then(text => {
        const startJson = text.indexOf('{\\"isMobile\\":false,\\"classData\\"');
        const endJson = text.indexOf('/script>', startJson) - 7;
        // console.log(classNbr);
        const fullJson = text.slice(startJson, endJson).replace(/\\"/g, '"').replace(/\\"/g, '"');
        const data = JSON.parse(fullJson);
        // console.log(data);
        const classInfo = [
            {
                name: data.classData.courseTitle,
                code: data.classData.sectionCourseCode,
                enrollment: data.classData.sectionTotalEnrollment,
                cap: data.classData.sectionCapacityEnrollment,
                waitlist: data.classData.sectionTotalWaitlist,
                instructors: [],
                raw: data,
            }
        ];
        for (let inst of data.classData.sectionMeetings[0].sectionInstructors) {
            if (inst.sectionInstructorRole == 'PI') {
                classInfo[0].instructors?.push(inst.sectionInstructorLastName);
            }
        }
        if (Object.hasOwn(data.classData, 'combinedSections')) {
            const sections = data.classData.combinedSections[0].sections;
            for (let i = 0; i < sections.length; i++) {
                if (sections[i].cmbndclassSubject != 'CS') {
                    classInfo.push({
                        code: sections[i].cmbndclassSubject + '-' + sections[i].cmbndclassCatalogNbr,
                        enrollment: sections[i].cmbndclassEnrlTot,
                        cap: sections[i].cmbndclassEnrlCap,
                    });
                }
            }
        }
        insertInOrder(classList, classInfo);
        populateDiv(classList);
        if (classList.length == numCourses) {
            setCachedData(courseQtr, classList);
        }
    }).catch(err => {
        console.log(err);
    });
};
const insertInOrder = (classList, courseToAdd) => {
    // add to array in order based on the code of the first element in courseToAdd
    let i = 0;
    for (i = 0; i < classList.length; i++) {
        if (convertCourseForAlphabetizing(courseToAdd[0].code) < convertCourseForAlphabetizing(classList[i][0].code)) {
            break;
        }
    }
    classList.splice(i, 0, courseToAdd);
    // console.log(classList);
};
;
const populateDiv = (classList) => {
    populateDiv.classList = classList;
    const el = document.querySelector('#main');
    const header = `<table>
      <tr>
        <th>Course</th>
        <th>Enrollment (cap / waitlist)</th>
        <th>Name</th>
        <th>Instructor(s)</th>
        <th>Raw data</th>
      </tr>
  `;
    const footer = '</table>';
    let inner = '';
    for (let i = 0; i < classList.length; i++) {
        const course = classList[i];
        inner += '<tr><td>' + course[0].code + '</td><td>' + course[0].enrollment + ' (' + course[0].cap + ' / ' + course[0].waitlist +
            ')' + '</td><td>';
        inner += course[0]?.name;
        if (course.length > 1) {
            inner += '<table style="width: 25%">';
            for (let i = 1; i < course.length; i++) {
                inner += '<tr><td>' + course[i].code + '</td>';
                inner += '<td>' + course[i].enrollment + '</td></tr>';
            }
            inner += '</table>';
        }
        inner += '</td><td>';
        inner += course[0]?.instructors?.join(', ');
        inner += '</td><td>';
        inner += '<a href="javascript:void(0)" onclick="displayRaw(' + i + ', populateDiv.classList)">raw</a>';
        inner += '</td></tr>';
    }
    el.innerHTML = header + inner + footer;
};
const getClassPage = async (classNbr, courseQtr) => {
    // const reponse = await fetch('../cgi-bin/course-enrollment/get-page.cgi', { 
    const response = await fetch('https://web.stanford.edu/~cgregg/cgi-bin/course-enrollment/get-page.cgi', {
        method: 'POST',
        headers: {
            'Accept': 'text/html',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ classNbr: classNbr, courseQtr: courseQtr }),
    });
    const text = await response.text();
    return text;
};
const getCachedData = async (courseQtr) => {
    const response = await fetch('../cgi-bin/course-enrollment/get-cache.cgi', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseQtr: courseQtr }),
    });
    return response.json();
    // return {status: "not cached"};
};
const setCachedData = async (courseQtr, classList) => {
    const response = await fetch('../cgi-bin/course-enrollment/set-cache.cgi', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseQtr: courseQtr, classList: classList }),
    });
    console.log(await response.json());
};
const displayRaw = (row, classList) => {
    // console.log(classList[row][0].raw);
    document.querySelector("#raw-data").style.display = 'inline';
    const innerEl = document.querySelector('#raw-data-inner');
    const nameEl = document.querySelector('#raw-data-name');
    nameEl.innerHTML = classList[row][0].code + ": " + classList[row][0].name;
    console.log(classList[row][0].raw); // easier to look at in the console!
    let prettyData = JSON.stringify(classList[row][0].raw, null, 4);
    prettyData = prettyData.replaceAll('\n', '<p>\n').replaceAll(' ', '&nbsp;');
    innerEl.innerHTML = prettyData;
    scroll(0, 0);
};
const convertCourseForAlphabetizing = (courseCode) => {
    // code will be in the form CS-44N, CS-103, etc.
    // want to replace the number with a 3-digit number, e.g., 044, 103, 007
    const digitsOnly = courseCode.match(/\d+/g)[0];
    const zeroPadded = ("000" + digitsOnly).substr(-3, 3);
    return courseCode.replace(digitsOnly, zeroPadded);
};
const jsonToTable = (jsonData, level) => {
    return "";
};
