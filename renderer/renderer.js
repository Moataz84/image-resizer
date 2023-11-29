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
  const img = document.querySelector("#croppr")
  img.src = dataURL
  
  img.onload = () => {
    const cropInstance = new Croppr("#croppr", {
      returnMode: "raw"
    })

    const clippedImage = document.querySelector(".croppr-imageClipped")

    const observer = new ResizeObserver(() => {
      const { width: cWidth } = cropInstance.getValue()
      const { width } = clippedImage.getBoundingClientRect()
      cropInstance.scaleBy(width / cWidth, [0, 0])  
    })
    observer.observe(clippedImage)

    /* Button Functions */
    document.querySelector(".cancel").addEventListener("click", () => ipc.send("cancel"))
    document.querySelector("button").addEventListener("click", () => {
      console.log(clippedImage);
    })
  }
}