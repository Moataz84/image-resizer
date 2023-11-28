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

function setDimensions(elem, width, maxWidth, height, maxHeight) {
  elem.style.width = `${width}px`
  elem.style.maxWidth = `${maxWidth}px`
  elem.style.height = `${height}px`
  elem.style.maxHeight = `${maxHeight}px`
}

if (document.querySelector(".edit")) {
  let w, h = 0
  const dataURL = new URLSearchParams(location.search).get("dataURL")
  const img = document.querySelector("img")
  const resizable = document.querySelector(".resizable")
  img.src = dataURL
  
  img.onload = () => {
    const { width, height } = img.getBoundingClientRect()
    w = width - 2
    h = height - 2
    setDimensions(resizable, w, w, h, h)
  
    const observer = new ResizeObserver(() => {
      const { width: maxWidth, height: maxHeight } = img.getBoundingClientRect()
      const { width, height } = resizable.getBoundingClientRect()
      const wRatio = (maxWidth - 2) / w
      const hRatio = (maxHeight - 2) / h
      setDimensions(resizable, width * wRatio, maxWidth - 2, height * hRatio, maxHeight - 2)
      w = maxWidth
      h = maxHeight
    })
    observer.observe(img)

    let isEntered = false

    resizable.addEventListener("mousedown", () => isEntered = true)
    resizable.addEventListener("mouseup", () => isEntered = false)
    const resizeObserver = new ResizeObserver(() => isEntered = false)
    resizeObserver.observe(resizable)

    resizable.addEventListener("mousemove", e => {
      const { x, y } = resizable.getBoundingClientRect()
      if (isEntered) {
        resizable.style.left = `${x}px`
        resizable.style.left = `${y}px`
      }
    })
  }

  document.querySelector(".cancel").addEventListener("click", () => ipc.send("cancel"))

}