const http = require("http")
const fs = require("fs")

const PORT = 3000

function getTasks() {
  const data = fs.readFileSync("tasks.json")
  return JSON.parse(data)
}

function saveTasks(tasks) {
  fs.writeFileSync("tasks.json", JSON.stringify(tasks))
}

const server = http.createServer((req, res) => {

  if (req.method === "GET" && req.url === "/tasks") {

    const tasks = getTasks()

    res.writeHead(200, {"Content-Type":"application/json"})
    res.end(JSON.stringify(tasks))
  }

  if (req.method === "POST" && req.url === "/tasks") {

    let body = ""

    req.on("data", chunk => {
      body += chunk
    })

    req.on("end", () => {

      const tasks = getTasks()
      const newTask = JSON.parse(body)

      newTask.id = Date.now()

      tasks.push(newTask)

      saveTasks(tasks)

      res.writeHead(201)
      res.end(JSON.stringify(newTask))
    })
  }

})

server.listen(PORT, () => {
  console.log("Server running on port", PORT)
})