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
      ipc.send("photo-selected", {dataURL, name: file.name})
    }
  })
}

if (document.querySelector(".edit")) {
  const params = new URLSearchParams(location.search)
  const dataURL = params.get("dataURL")
  const name = params.get("name")

  const img = document.querySelector("img")
  img.src = dataURL

  img.onload = () => {
    let cropper = new Cropper(img, {
      viewMode: 3,
      autoCropArea: 1
    })

    window.addEventListener("resize", () => {
      cropper.destroy()
      cropper = new Cropper(img, {
        viewMode: 3,
        autoCropArea: 1
      })
    })

    document.querySelector(".cancel").addEventListener("click", () => ipc.send("cancel"))
    document.querySelector("button").addEventListener("click", () => {
      const croppedImage = cropper.getCroppedCanvas().toDataURL()

      const image = document.createElement("img")
      image.src = croppedImage
      image.onload = async e => {
        const canvas = document.createElement("canvas")
        canvas.width = e.target.width
        canvas.height = e.target.height
        const context = canvas.getContext("2d")
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        const newImage = context.canvas.toDataURL("image/jpeg", 0.8)
        ipc.send("save-image", {dataURL: newImage, name})
      }
    })
  }
}