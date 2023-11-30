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

  img.onload = () => {
    const width = parseFloat(window.getComputedStyle(img)["width"])
    const height = parseFloat(window.getComputedStyle(img)["height"])
    const ratio = img.naturalWidth / img.naturalHeight
    if (ratio > 1) img.style.height = `${width / ratio}px`
    if (ratio < 1) img.style.width = `${height * ratio}px`

    let cropW, cropH, canvasW, canvasH, x, y
    let cropper = new Cropper(img, {
      viewMode: 3,
      autoCropArea: 1,
      ready: () => {
        const crop = cropper.getCropBoxData()
        cropW = crop.width
        cropH = crop.height
        x = crop.left
        y = crop.top

        const canvas = cropper.getCanvasData()
        canvasH = canvas.height
        canvasW = canvas.width
      },
      cropmove: () => {
        const crop = cropper.getCropBoxData()
        cropW = crop.width
        cropH = crop.height
        x = crop.left
        y = crop.top
      }
    })

    window.addEventListener("resize", () => {
      cropper.destroy()
      cropper = new Cropper(img, {
        viewMode: 3,
        autoCropArea: 1,
        cropmove: () => {
          const crop = cropper.getCropBoxData()
          cropW = crop.width
          cropH = crop.height
          x = crop.left
          y = crop.top
        },
        ready: () => {
          const { width, height } = cropper.getCropBoxData()
          const wRatio = cropW / canvasW
          const hRatio = cropH / canvasH
          cropper.setCropBoxData({
            left: x * wRatio, 
            top: y * hRatio, 
            width: width * wRatio, 
            height: height * hRatio
          })
        }
      })
    })

    document.querySelector(".cancel").addEventListener("click", () => ipc.send("cancel"))
    document.querySelector("button").addEventListener("click", () => {
      const dataURL = cropper.getCroppedCanvas().toDataURL()
      console.log(dataURL)
    })
  }
}