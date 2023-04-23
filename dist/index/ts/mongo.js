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
let client;
if (app.currentUser) {
    client = app.currentUser.mongoClient("mongodb-atlas");
    $("#login").text("Change User");
}
export function insertSong(song) {
    return __awaiter(this, void 0, void 0, function* () {
        if (app.currentUser) {
            const songTitles = client.db("cook-slides").collection("songTitles");
            const songData = client.db("cook-slides").collection("songData");
            const result = (yield songTitles.find({})).map((song) => song["title"]);
            if (result.includes(song["title"])) {
                yield songData.deleteMany({ "title": song["title"] });
                yield songTitles.deleteMany({ "title": song["title"] });
            }
            yield songTitles.insertOne({ "title": song.title });
            const insertionResult = yield songData.insertOne(song);
            console.log(insertionResult);
        }
    });
}
export function getSongs() {
    return __awaiter(this, void 0, void 0, function* () {
        if (app.currentUser) {
            const collection = client.db("cook-slides").collection("songTitles");
            const result = yield collection.find({});
            return result;
        }
    });
}
export function getSong(title) {
    return __awaiter(this, void 0, void 0, function* () {
        if (app.currentUser) {
            const collection = client.db("cook-slides").collection("songData");
            const result = yield collection.findOne({ "title": title });
            return result;
        }
    });
}
export function deleteSong(songTitle) {
    return __awaiter(this, void 0, void 0, function* () {
        if (app.currentUser) {
            const songTitles = client.db("cook-slides").collection("songTitles");
            const songData = client.db("cook-slides").collection("songData");
            yield songTitles.deleteMany({ "title": songTitle });
            const result = yield songData.deleteMany({ "title": songTitle });
            console.log(result);
        }
    });
}
$("#login").on("click", (event) => {
    if (app.currentUser) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to change users?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => __awaiter(void 0, void 0, void 0, function* () {
            if (result.isConfirmed) {
                console.log("Logging out user...");
                yield app.currentUser.logOut();
                location.href = "src/login/login.html";
            }
        }));
    }
    else {
        location.href = "src/login/login.html";
    }
});
$("#cancel-change-user").on("click", () => {
    $(".change-user-blur").addClass("hidden");
});
