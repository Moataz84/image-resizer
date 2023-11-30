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
  const img = document.querySelector("img")
  img.src = dataURL

  let cropper
  const observer = new ResizeObserver(() => {
    if (cropper) cropper.destroy()
    // https://github.com/fengyuanchen/cropperjs
    cropper = new Cropper(img, {
      viewMode: 3,
      autoCropArea: 1
    })
  })

  img.onload = () => {
    observer.observe(img)
    document.querySelector(".cancel").addEventListener("click", () => ipc.send("cancel"))
    document.querySelector("button").addEventListener("click", () => {
      const dataURL = cropper.getCroppedCanvas().toDataURL()
      console.log(dataURL)
    })
  }
}