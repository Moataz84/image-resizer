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

function setDimensions(elem, width, height, setMax = true) {
  if (setMax) elem.style.width = `${width - 4}px`
  elem.style.maxWidth = `${width - 4}px`
  if (setMax) elem.style.height = `${height - 4}px`
  elem.style.maxHeight = `${height - 4}px`
}

if (document.querySelector(".edit")) {
  let w, h = 0
  const dataURL = new URLSearchParams(location.search).get("dataURL")
  const img = document.querySelector("img")
  const resizable = document.querySelector(".resizable")
  img.src = dataURL
  
  const { width, height } = img.getBoundingClientRect()
  w = width
  h = height
  setDimensions(resizable, width, height)

  const observer = new ResizeObserver(() => {
    const { width, height } = img.getBoundingClientRect()
    const wRatio = width / w
    const hRatio = height / h
    setDimensions(resizable, (wRatio * w), (hRatio * h), false)
    w = width
    h = height
  })
  observer.observe(img)
  document.querySelector(".cancel").addEventListener("click", () => ipc.send("cancel"))
}