const http = require("http")
const fs = require("fs")
const path = require("path")

const port = process.env.PORT || 3000
const root = __dirname

const mime = {
  ".html": "text/html; charset=utf-8",
  ".svg": "image/svg+xml",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
}

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0])
    if (urlPath === "/") urlPath = "/index.html"

    const filePath = path.normalize(path.join(root, urlPath))
    if (!filePath.startsWith(root)) {
      res.writeHead(403)
      res.end("Forbidden")
      return
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
        res.end("Not found")
        return
      }
      res.writeHead(200, {
        "Content-Type": mime[path.extname(filePath).toLowerCase()] || "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      })
      res.end(data)
    })
  })
  .listen(port, () => {
    console.log("[v0] Static server running on port " + port)
  })
