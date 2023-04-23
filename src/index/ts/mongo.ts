import { app } from "../../main.js";

let client: any;
if (app.currentUser) {
  client = app.currentUser.mongoClient("mongodb-atlas");
  $("#login").text("Change User");
}

export async function insertSong(song: { "title": string, "data": any }) {
  if (app.currentUser) {
    const songTitles = client.db("cook-slides").collection("songTitles");
    const songData = client.db("cook-slides").collection("songData");

    const result = (await songTitles.find({})).map((song: { [x: string]: any; }) => song["title"]);
    if (result.includes(song["title"])) {
      await songData.deleteMany({ "title": song["title"] });
      await songTitles.deleteMany({ "title": song["title"] });
    }

    await songTitles.insertOne({ "title": song.title });
    const insertionResult = await songData.insertOne(song);

    console.log(insertionResult);
  }
}

export async function getSongs() {
  if (app.currentUser) {
    const collection = client.db("cook-slides").collection("songTitles");
    const result = await collection.find({});
    return result;
  }
}

export async function getSong(title: string) {
  if (app.currentUser) {
    const collection = client.db("cook-slides").collection("songData");
    const result = await collection.findOne({ "title": title });
    return result;
  }
}

export async function deleteSong(songTitle: string) {
  if (app.currentUser) {
    const songTitles = client.db("cook-slides").collection("songTitles");
    const songData = client.db("cook-slides").collection("songData");

    await songTitles.deleteMany({ "title": songTitle });
    const result = await songData.deleteMany({ "title": songTitle });

    console.log(result);
  }
}

$("#login").on("click", (event) => {
  if (app.currentUser) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change users?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then(async (result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        console.log("Logging out user...");
        await app.currentUser.logOut();
        location.href = "src/login/login.html";
      }
    })
  } else {
    location.href = "src/login/login.html";
  }
});

$("#cancel-change-user").on("click", () => {
  $(".change-user-blur").addClass("hidden");
});