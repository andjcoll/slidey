import { clipboard, commands, dih } from './slidesFormat.js';
import { app } from "../main.js";

type BiblePassage = {
    book: string;
    chapter: number;
    verseNumber: number;
}

async function getBibleVerses(passage: string, version: string) {
    passage = passage.trim();


    let response = await fetch(`src/bible/texts/${version}.json`);
    console.log(response);
    let bibleData;
    if (response.ok) {
        console.log("Using local Bible version.")
        bibleData = await response.json();
    } else if (app.currentUser) {
        console.log("Using MongoDB Bible version.")
        const client = app.currentUser.mongoClient("mongodb-atlas");
        const collection = client.db("bible").collection("versions");

        bibleData = await collection.findOne({ "version": version });
        console.log(bibleData)
        if (!bibleData) {
            alert("Bible version not found.");
            throw new Error("Bible version not found.");
        }
        bibleData = bibleData["bible"];
        console.log(bibleData);
    } else {
        alert("Bible version not found.");
        throw new Error("Bible version not found.");
    }

    const book = passage.split(" ")[0];

    passage = passage.split(" ")[1];

    const sections = passage.split("-");
    let startSection: BiblePassage = {
        book: book,
        chapter: parseInt(sections[0].split(":")[0]),
        verseNumber: parseInt(sections[0].split(":")[1])
    }

    let endSection: BiblePassage;
    if (sections.length > 1) {
        const endSectionString = sections[1];
        if (endSectionString.includes(":")) {
            endSection = {
                book: book,
                chapter: parseInt(endSectionString.split(":")[0]),
                verseNumber: parseInt(endSectionString.split(":")[1])
            }
        } else {
            endSection = {
                book: book,
                chapter: startSection.chapter,
                verseNumber: parseInt(endSectionString)
            }
        }
    } else {
        endSection = startSection;
    }

    const verses: { [key: string]: { [key: number]: string } } = {};

    if (endSection.chapter < startSection.chapter) {
        const temp = endSection;
        endSection = startSection;
        startSection = temp;
    }

    let currentVerse = startSection.verseNumber;
    for (let chapter = startSection.chapter; chapter <= endSection.chapter; chapter++) {
        verses[chapter] = {};
        const totalChapterVerses = Object.keys(bibleData[book][chapter]).length;

        while (currentVerse <= endSection.verseNumber ||
            chapter < endSection.chapter && currentVerse <= totalChapterVerses) {

            verses[chapter][currentVerse] = bibleData[book][chapter][currentVerse];
            currentVerse++;
        }
        currentVerse = 1;
    }

    return verses;
}

export async function getBibleSlides(passages: string, version: string) {
    const slides = createBibleSlides();

    const passagesArr = passages.split(";").reverse();
    for (const passage of passagesArr) {
        addBibleTitle(slides, passage, version);
        await addFromPassage(slides, passage, version);
    }

    return toClipboard(slides);
}

async function addFromPassage(slides: typeof commands, passage: string, version: string) {
    const verses = await getBibleVerses(passage, version);

    for (const chapNum of Object.keys(verses).sort((a, b) => {
        return parseInt(a) - parseInt(b);
    }).reverse()) {
        for (const verseNum of Object.keys(verses[chapNum]).sort((a, b) => {
            return parseInt(a) - parseInt(b);
        }).reverse()) {
            addVerse(slides, verseNum, verses[chapNum][parseInt(verseNum)]);
        }
    }
}

function createBibleSlides() {
    const format = structuredClone(commands);
    return format;
}

let i = 191;

function f(num: number) {
    if (num > i) {
        i = num;
    }
    return num;
}

function addBibleTitle(slides: { [key: string]: any }, passage: string, version: string) {
    const quote = `${passage} (${version}) `;

    slides["commands"].push(
        [12, `g183fed19b07_0_${f(i + 1)}`, 0, 0, [1, "g1848467e322_1_644", 2, "MAIN_POINT"]],
        [43, [],
            [0, 7, 1, 100], `g183fed19b07_0_${f(i)}`
        ],
        [3, `g183fed19b07_0_${f(i + 1)}`, 3, [0, 171.9833, -201.6771, 0, 365902, -320],
            [103, -0.3, 138, [1, 0, 0, 1, 0, 762], 139, 6, 140, 0, 141, 1524, 142, "#000000", 143, 0.5, 15, [null, 4], 19, [null, 3], 22, 381, 47, 0, 49, "PLACEHOLDER_47783efd4a7f46aa_4", 8, 1200, 89, 0.4, 9, 1815], `g183fed19b07_0_${f(i - 1)}`
        ],
        [3, `g183fed19b07_0_${f(i + 1)}`, 108, [2.906, 0, 0, 1.3636, 8520, 21054],
            [138, [1, 0, 0, 1, 0, 762], 139, 6, 140, 0, 141, 1524, 142, "#000000", 143, 0.5, 47, 1, 54, 15, 55, 0], `g183fed19b07_0_${f(i - 2)}`
        ],
        [15, `g183fed19b07_0_${f(i)}`, null, 0, quote],
        [41, `g183fed19b07_0_${f(i)}`, null, "kix.vr2h3kaxhaeu", [0, [17, 9, 25, 0, 36, "%0", 37, "●"],
            [13, 19, 21, 22, 23, 24, 26, 28, 29, 31, 32, 33], 1, [17, 9, 25, 0, 36, "%1", 37, "○"],
            [13, 19, 21, 22, 23, 24, 26, 28, 29, 31, 32, 33], 2, [17, 9, 25, 0, 36, "%2", 37, "■"],
            [13, 19, 21, 22, 23, 24, 26, 28, 29, 31, 32, 33], 3, [17, 9, 25, 0, 36, "%3", 37, "●"],
            [13, 19, 21, 22, 23, 24, 26, 28, 29, 31, 32, 33], 4, [17, 9, 25, 0, 36, "%4", 37, "○"],
            [13, 19, 21, 22, 23, 24, 26, 28, 29, 31, 32, 33], 5, [17, 9, 25, 0, 36, "%5", 37, "■"],
            [13, 19, 21, 22, 23, 24, 26, 28, 29, 31, 32, 33], 6, [17, 9, 25, 0, 36, "%6", 37, "●"],
            [13, 19, 21, 22, 23, 24, 26, 28, 29, 31, 32, 33], 7, [17, 9, 25, 0, 36, "%7", 37, "○"],
            [13, 19, 21, 22, 23, 24, 26, 28, 29, 31, 32, 33], 8, [17, 9, 25, 0, 36, "%8", 37, "■"],
            [13, 19, 21, 22, 23, 24, 26, 28, 29, 31, 32, 33]
        ]],
        [17, `g183fed19b07_0_${f(i)}`, null, quote.length, quote.length + 1, [19, 21, 22, 23, 24, 25, 26, 27, 31, 32, 33],
            [18, 0]
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, quote.length, quote.length + 1, [11, 13, 14, 15, 16, 28, 39, 42, 43, 44, 62],
            [12, 2, 30, 0]
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, 0, quote.length + 1, [],
            [49, []],
            []
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, 0, quote.length + 1, [8],
            []
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, 0, quote.length + 1, [],
            [0, 1, 5, "Candara", 6, 60]
        ],
        [3, `g183fed19b07_0_${f(i + 1)}`, 158, [2.032, 0, 0, 1.143, 15252, 27432],
            [54, 16, 55, 0], `g183fed19b07_0_${f(i - 3)}:notes`
        ],
        [3, `g183fed19b07_0_${f(i + 1)}`, 108, [1.8288, 0, 0, 1.3716, 27432, 173736],
            [54, 1, 55, 1], `g183fed19b07_0_${f(i - 4)}:notes`
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, 0, 1, [19, 21, 22, 23, 24, 25, 26, 27, 31, 32, 33],
            [18, 0]
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, 0, 1, [11, 12, 14, 15, 16, 39, 42, 43, 44, 62],
            [13, 0, 28, 0, 30, 0]
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, 0, 1, [],
            [49, []],
            []
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, 0, 1, [8],
            []
        ],
    );

}


function addVerse(slides: typeof commands, verseNum: string, words: string) {
    verseNum = `{${verseNum}}`;
    const quote = `${verseNum} ${words.trim()} `;

    slides["commands"].push(
        [12, `g183fed19b07_0_${f(i + 1)}`, 1, 0, [1, "g1848467e322_1_644", 2, "MAIN_POINT"]],
        [3, `g183fed19b07_0_${f(i + 1)}`, 3, [0, 171.9833, -201.6771, 0, 365902, -320],
            [103, -0.3, 15, [null, 4], 19, [null, 3], 22, 381, 49, "PLACEHOLDER_47783efd4a7f46aa_5", 8, 1200, 89, 0.4, 9, 1815], `g183fed19b07_0_${f(i - 1)}`
        ],
        [3, `g183fed19b07_0_${f(i + 1)}`, 108, [3.048, 0, 0, 1.3636, 0, 19869.8848],
            [138, [1, 0, 0, 1, 0, 762], 139, 6, 140, 0, 141, 1524, 142, "#000000", 143, 0.5, 47, 1, 54, 15, 55, 0], `g183fed19b07_0_${f(i - 2)}`
        ],
        [15, `g183fed19b07_0_${f(i)}`, null, 0, quote],
        [17, `g183fed19b07_0_${f(i)}`, null, quote.length, quote.length + 1, [19, 21, 22, 23, 24, 25, 26, 27, 31, 32, 33],
            [18, 0]
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, quote.length, quote.length + 1, [11, 13, 14, 15, 16, 28, 39, 42, 43, 44, 62],
            [12, 2, 30, 0]
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, 0, quote.length + 1, [],
            [49, []],
            []
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, 0, quote.length + 1, [8],
            []
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, 0, verseNum.length, [],
            [0, 1, 5, "Candara", 6, 45, 7, 1]
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, verseNum.length, quote.length + 1, [],
            [0, 1, 5, "Candara", 6, 45]
        ],
        [3, `g183fed19b07_0_${f(i + 1)}`, 158, [2.032, 0, 0, 1.143, 15252, 27432],
            [54, 16, 55, 0], `g183fed19b07_0_${f(i - 3)}:notes`
        ],
        [3, `g183fed19b07_0_${f(i + 1)}`, 108, [1.8288, 0, 0, 1.3716, 27432, 173736],
            [54, 1, 55, 1], `g183fed19b07_0_${f(i - 4)}:notes`
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, 0, 1, [19, 21, 22, 23, 24, 25, 26, 27, 31, 32, 33],
            [18, 0]
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, 0, 1, [11, 12, 14, 15, 16, 39, 42, 43, 44, 62],
            [13, 0, 28, 0, 30, 0]
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, 0, 1, [],
            [49, []],
            []
        ],
        [17, `g183fed19b07_0_${f(i)}`, null, 0, 1, [8],
            []
        ]
    )

}

function toClipboard(com: typeof commands) {
    const toDih = structuredClone(dih);
    toDih["data"] = JSON.stringify(com);

    const toClipForm = structuredClone(clipboard);
    toClipForm["application/x-vnd.google-docs-drawings-page+wrapped"] = JSON.stringify(toDih);

    return toClipForm;
}