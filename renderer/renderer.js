const msg = document.querySelector(".msg")

document.querySelector(".image-upload input").addEventListener("change", e => {
  const file = e.target.files[0]
  if (!file) return msg.innerText = "No file selected"
  if (!file.type.includes("image")) return msg.innerText = "No file selected"
  console.log("done");
})