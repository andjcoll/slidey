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
import { getBibleSlides } from "../../bible/bible.js";
let passageData = {};
const copyBibleButton = document.querySelector("#copy-bible");
copyBibleButton.addEventListener("click", function (e) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Copying Bible passage...");
        const biblePassage = document.querySelector("#search-bible").value;
        const bibleVersion = document.querySelector("#choose-version").value;
        passageData = yield getBibleSlides(biblePassage, bibleVersion);
        window.getSelection().selectAllChildren(e.target);
        copyBibleButton.classList.add("selected");
    });
});
copyBibleButton.addEventListener("copy", function (e) {
    e.preventDefault();
    for (const type in passageData) {
        e.clipboardData.setData(type, passageData[type]);
    }
});
if (app.currentUser) {
    $("#choose-version").val("NIV");
}
else {
    $("#choose-version").val("ASV");
}
