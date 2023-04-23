import { app } from "../main.js";

let user: any;

$("#login").on("click", async () => {
    console.log("Logging in user...")
    const email = $("#email").val() as string;
    const password = $("#password").val() as string;
    const credentials = Realm.Credentials.emailPassword(email, password);
    user = await app.logIn(credentials);
    // `App.currentUser` updates to match the logged in user
    console.assert(user.id === app.currentUser.id);
    $("#login").text("Logged in!");

    location.href = "../../index.html";
});

