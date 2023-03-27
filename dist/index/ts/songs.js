var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { app } from "../../main.js";
import { deleteSong, getSong, getSongs, insertSong } from "./mongo.js";
const list = document.getElementById("songs-list");
function searchSongs() {
    const input = document.getElementById('search-songs');
    const filter = input.value.toUpperCase();
    const ul = document.getElementById("songs-list");
    const li = ul.getElementsByTagName('li');
    // Loop through all list items, and hide those who don't match the search query
    for (let i = 0; i < li.length; i++) {
        const a = li[i].getElementsByTagName("a")[0];
        const txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().replaceAll(/[,./!?'`"-]/g, "").indexOf(filter) > -1) {
            li[i].style.display = "";
        }
        else {
            li[i].style.display = "none";
        }
    }
}
document.querySelector("#search-songs").addEventListener("keyup", searchSongs);
hideAllActions();
document.querySelector(".actions .songs").classList.remove("hidden");
for (const child of Array.from(document.querySelector(".navbar ul").children)) {
    if ($(child).find('a').get(0).id == "login") {
        continue;
    }
    child.addEventListener("click", function (e) {
        hideAllActions();
        const action = document.querySelector(`.actions .${child.querySelector('a').id}`);
        action.classList.remove("hidden");
        for (const child of Array.from(document.querySelector(".navbar ul").children)) {
            child.querySelector("a").classList.remove("active");
        }
        e.target.classList.add("active");
    });
}
document.addEventListener('paste', function (e) {
    return __awaiter(this, void 0, void 0, function* () {
        if (document.querySelector(".actions .songs").classList.contains("hidden"))
            return;
        if (document.activeElement.tagName == "INPUT")
            return;
        e.preventDefault();
        const frozenClipboard = {};
        if (!e.clipboardData) {
            return;
        }
        if (!e.clipboardData.types.includes("application/x-vnd.google-docs-drawings-page+wrapped")) {
            throw new Error("No song to save.");
        }
        let title;
        for (const type of e.clipboardData.types) {
            const data = e.clipboardData.getData(type);
            if (type == "application/x-vnd.google-docs-drawings-page+wrapped") {
                const songData = JSON.parse(JSON.parse(data)["data"]);
                for (const item of songData["commands"]) {
                    if (item[0] === 15) {
                        title = item[4].trim();
                        break;
                    }
                }
            }
            frozenClipboard[type] = data;
        }
        yield insertSong({ "title": title, "data": frozenClipboard });
        createSongsList();
    });
});
document.addEventListener("click", function (e) {
    for (const child of Array.from(list.children)) {
        if (e.target != child && !child.contains(e.target)) {
            child.classList.remove("selected");
        }
    }
    const copyBibleButton = document.querySelector("#copy-bible");
    if (e.target != copyBibleButton && !copyBibleButton.contains(e.target)) {
        copyBibleButton.classList.remove("selected");
    }
});
let dataToCopy;
function createSongsList() {
    return __awaiter(this, void 0, void 0, function* () {
        const songs = yield getSongs();
        list.innerHTML = '';
        for (let song of songs) {
            song = song["title"];
            const li = document.createElement("li");
            li.addEventListener("click", function (e) {
                return __awaiter(this, void 0, void 0, function* () {
                    const deleteButton = li.querySelector(".delete-song");
                    if (e.target == deleteButton ||
                        Array.from(deleteButton.querySelectorAll("*")).includes(e.target))
                        return;
                    const songData = yield getSong(song);
                    dataToCopy = songData["data"];
                    window.getSelection().selectAllChildren(e.target);
                    li.classList.add("selected");
                });
            });
            li.addEventListener("copy", function (e) {
                e.preventDefault();
                for (const type in dataToCopy) {
                    e.clipboardData.setData(type, dataToCopy[type]);
                }
            });
            const a = document.createElement("a");
            const span = document.createElement("span");
            span.appendChild(document.createTextNode(song));
            a.appendChild(span);
            const deleteDiv = document.createElement("div");
            deleteDiv.classList.add("delete-song");
            deleteDiv.innerHTML = `
    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 465.311 465.311" style="enable-background:new 0 0 465.311 465.311;" xml:space="preserve">
      <g>
        <path d="M372.811,51.002h-59.908V36.566C312.902,16.404,296.499,0,276.335,0h-87.356c-20.163,0-36.567,16.404-36.567,36.566v14.436
          H92.5c-20.726,0-37.587,16.861-37.587,37.587v38.91c0,8.284,6.716,15,15,15h7.728v307.812c0,8.284,6.716,15,15,15H372.67
          c8.284,0,15-6.716,15-15V142.499h7.728c8.284,0,15-6.716,15-15v-38.91C410.397,67.863,393.536,51.002,372.811,51.002z
            M182.412,36.566c0-3.621,2.946-6.566,6.567-6.566h87.356c3.621,0,6.567,2.946,6.567,6.566v14.436h-100.49V36.566z M84.914,88.589
          c0-4.184,3.403-7.587,7.587-7.587h280.31c4.184,0,7.587,3.403,7.587,7.587v23.91H84.914V88.589z M357.67,435.311H107.641V142.499
          H357.67V435.311z"/>
        <path d="M137.41,413.485c5.523,0,10-4.477,10-10V166.497c0-5.523-4.477-10-10-10s-10,4.477-10,10v236.988
          C127.41,409.008,131.887,413.485,137.41,413.485z"/>
        <path d="M200.907,413.485c5.523,0,10-4.477,10-10V166.497c0-5.523-4.477-10-10-10s-10,4.477-10,10v236.988
          C190.907,409.008,195.384,413.485,200.907,413.485z"/>
        <path d="M264.404,413.485c5.523,0,10-4.477,10-10V166.497c0-5.523-4.477-10-10-10s-10,4.477-10,10v236.988
          C254.404,409.008,258.881,413.485,264.404,413.485z"/>
        <path d="M327.901,413.485c5.523,0,10-4.477,10-10V166.497c0-5.523-4.477-10-10-10s-10,4.477-10,10v236.988
          C317.901,409.008,322.378,413.485,327.901,413.485z"/>
      </g>
    </svg>
    `;
            deleteDiv.addEventListener('click', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield deleteSong(song);
                    createSongsList();
                });
            });
            li.appendChild(a);
            li.append(deleteDiv);
            list.appendChild(li);
        }
        searchSongs();
    });
}
function hideAllActions() {
    for (const child of Array.from(document.querySelector(".actions").children)) {
        child.classList.add("hidden");
    }
}
if (app.currentUser) {
    createSongsList();
}
