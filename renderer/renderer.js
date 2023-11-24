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
      ipc.send("photo-selected", dataURL)
    }
  })
}

if (document.querySelector(".edit")) {
  const dataURL = new URLSearchParams(location.search).get("dataURL")
  document.querySelector("img").src = dataURL
  document.querySelector(".cancel").addEventListener("click", () => ipc.send("cancel"))
}