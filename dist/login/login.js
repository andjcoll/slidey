var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { app } from "../main.js";
let user;
$("#login").on("click", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Logging in user...");
    const email = $("#email").val();
    const password = $("#password").val();
    const credentials = Realm.Credentials.emailPassword(email, password);
    user = yield app.logIn(credentials);
    // `App.currentUser` updates to match the logged in user
    console.assert(user.id === app.currentUser.id);
    $("#login").text("Logged in!");
    location.href = "../index/index.html";
}));
