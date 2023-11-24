const msg = document.querySelector(".msg")

document.querySelector(".image-upload input").addEventListener("change", e => {
  const file = e.target.files[0]
  console.log(file);
  if (!file) return msg.innerText = "No file selected"
  if (!file.type.includes("image")) return msg.innerText = "File is not an image"
  console.log("first")
})