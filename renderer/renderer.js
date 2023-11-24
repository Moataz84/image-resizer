const container = document.querySelector(".container")

if (document.querySelector(".image-upload")) {
  const msg = document.querySelector(".msg")

  document.querySelector(".image-upload input").addEventListener("change", e => {
    const file = e.target.files[0]
    if (!file) return msg.innerText = "No file selected"
    if (!file.type.includes("image")) return msg.innerText = "File is not an image"
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = e => {
      const dataURL = e.target.result
      ipc.send("photo:selected", dataURL)
    }
  })
}

/*if (document.querySelector(".edit")) {
  document.querySelector(".cancel").addEventListener("click", () => {
    console.log("fgf");
    container.innerHTML = ""
    container.insertAdjacentHTML(
      "beforeend",
      `<form class="image-upload" enctype="multipart/form-data">
        <input type="file" accept="image/*" name="image" id="upload-image">
        <label for="upload-image">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3V320c0 17.7 14.3 32 32 32s32-14.3 32-32V109.3l73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 53 43 96 96 96H352c53 0 96-43 96-96V352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V352z"/></svg>
          <p>UPLOAD AN IMAGE TO BEGIN</p>
        </label>
        <p class="msg"></p>
      </form>`
    )
  })
}*/

ipc.on("photo:data", data => {
  /*container.innerHTML = ""
  container.insertAdjacentHTML(
    "beforeend",
    `<div class="edit">
      <img src="${data}">
      <div class="btns">
        <button>Save</button>
        <button class="cancel">Cancel</button>
      </div>
    </div>`
  )*/
  
  console.log(location.href);
})