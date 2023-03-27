import { app } from "../../main.js";
import { getBibleSlides } from "../../bible/bible.js";

let passageData: { [key: string]: string } = {};

const copyBibleButton = document.querySelector("#copy-bible");

copyBibleButton.addEventListener("click", async function (e: MouseEvent) {
  console.log("Copying Bible passage...")

  const biblePassage = (document.querySelector("#search-bible") as any).value;
  const bibleVersion = (document.querySelector("#choose-version") as any).value;
  passageData = await getBibleSlides(biblePassage, bibleVersion);

  window.getSelection().selectAllChildren(e.target as Node);
  copyBibleButton.classList.add("selected");
});

copyBibleButton.addEventListener("copy", function (e: ClipboardEvent) {
  e.preventDefault();

  for (const type in passageData) {
    e.clipboardData.setData(type, passageData[type]);
  }
});

if (app.currentUser) {
  $("#choose-version").val("NIV");
} else {
  $("#choose-version").val("ASV");
}
