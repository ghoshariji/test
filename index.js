// Question 1 :----->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// http file handling using the node ( http module)

const http=require("http");
const fs=require("fs");
const server=http.createServer((req,res)=>{
    // console.log(req.url);
    let  data=req.url;
    let  fileName="";
    if(req.url=="/"){
        fileName="index.html";
        res.end(readFile(fileName));
    }
    else if(req.url=="/about"){
        fileName="about.html";
        res.end(readFile(fileName));
    }
    else if(req.url=="/contact"){
        fileName="contact.html";
        res.end(readFile(fileName));
    }
     else if(req.url=="/image")
        {
           fs.readFile("download.jpeg",(err,data)=>{
            if(err){
                console.log(err);
                return;
            }
            console.log(data)
            res.setHeader("Content-Type","image/jpeg")
            res.end(data);
           })

        }

    else{
        fileName=data.substr(1);
        res.end(readFile(fileName));
    }
})

server.listen(3000,(err)=>{
    if(err)
    {
        console.log(Internal Servar Error);
    }
    else{
        console.log(Server started on port 3000);
    }
})

function readFile(fileName)
{
    try {
        return fs.readFileSync(fileName,"utf-8");
    } catch (error) {
        return "";
    }
}

//folder structure

// my-project/
// ├
// |── home.html
// │── contact.html
// │── about.html
// │── script.js
// │── style.css
// └── index.js

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home Page</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Home Page</h1>
    <p>Welcome to Our website</p>
    <a href="/">Home</a> | <a href="/about.html">About</a> | <a href="/contact.html">Contact</a> <br><br>

    <img src="/image" alt="Random Image">

    <button id="btn">Alert</button>

    <script src="script.js"></script>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Page</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Contact Page</h1>
    <p>Welcome to Our website</p>
    <a href="/">Home</a> | <a href="/about.html">About</a> | <a href="/contact.html">Contact</a> <br><br>

    <button id="btn">Alert</button>

    <script src="script.js"></script>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Page</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>About Page</h1>
    <p>Welcome to Our website</p>
    <a href="/">Home</a> | <a href="/about.html">About</a> | <a href="/contact.html">Contact</a> <br><br>

    <button id="btn">Alert</button>

    <script src="script.js"></script>
</body>
</html>

const btn=document.getElementById("btn");
btn.addEventListener("click",()=>{
    alert("Hello User");
})

{/* // Question 2 ------------------------------------------------------------------------------>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
{/* login signup with creating table and crud operation in table */}

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const loadUsers = () => {
    const data = fs.readFileSync('user.json');
    return JSON.parse(data);
};

const saveUsers = (users) => {
    fs.writeFileSync('user.json', JSON.stringify(users, null, 2));
};

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    const userExists = users.find(user => user.username === username);
    
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    users.push({ username, password });
    saveUsers(users);
    return res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        return res.status(200).sendFile(path.join(__dirname, "public", "home.html"));
    } else {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
});



// CRUD operations
const loadPlayers = () => {
    const data = fs.readFileSync('player.json'); 
    return JSON.parse(data);
};

const savePlayers = (players) => {
    fs.writeFileSync('player.json', JSON.stringify(players, null, 2));
};

app.get('/players', (req, res) => {
    const players = loadPlayers(); 
    res.json(players); 
});

app.post('/addPlayer', (req, res) => {
    const { name, selected } = req.body; 
    const players = loadPlayers();
    const newPlayer = {
        id: players.length ? players[players.length - 1].id + 1 : 1,
        name,
        selected, 
    };
    players.push(newPlayer);
    savePlayers(players);
    res.status(201).json(newPlayer);
});

app.put('/updatePlayer/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const players = loadPlayers();
    const playerIndex = players.findIndex(player => player.id === parseInt(id));

    if (playerIndex !== -1) {
        players[playerIndex].name = name;
        savePlayers(players);
        res.status(200).json(players[playerIndex]);
    } else {
        res.status(404).json({ message: 'Player not found' });
    }
});

app.delete('/deletePlayer/:id', (req, res) => {
    const { id } = req.params;
    let players = loadPlayers();
    players = players.filter(player => player.id !== parseInt(id));
    savePlayers(players);
    res.status(204).send();
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});


// main-project-folder/
// ├── public/
//     |--home.html---> there have curd operation
// │   ├── login.html
// │   └── signup.html
// ├── index.js       # Server file
// └── user.json      # JSON file for user data  
// |---player.json    # JSON file for player after login curd operation



<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Signup</title>
</head>
<body>
  <h2>Signup</h2>
  <form id="signupForm">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" required>
    <br>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required>
    <br>
    <button type="submit">Signup</button>
    <br><br> 
    <button><a href="login.html">Login Here</a></button>
  </form>

  <script>
    document.getElementById('signupForm').addEventListener('submit', async function (e) {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('http://localhost:3000/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        alert(data.message);
      } catch (error) {
        console.error('Error:', error);
      }
    });
  </script>
</body>
</html>



<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
</head>
<body>
  <h2>Login</h2>
  <form id="loginForm">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" required>
    <br>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required>
    <br>
    <button type="submit">Login</button>
  </form>

  <script>
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (response.ok) {
          window.location.href = 'http://localhost:3000/home.html';
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  </script>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home Page</title>
</head>
<body>
    <h1>Welcome to Our Website!</h1>
    <p>How are you?</p>

    <h2>Player Data</h2>
    <table id="playerTable" border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Selected</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>

    <h3>Add Player</h3>
    <input type="text" id="nameInput" placeholder="Enter name" />
    <label for="selectedInput">Selected:</label>
    <input type="checkbox" id="selectedInput" />
    <button id="addPlayer">Add Player</button>
    

    <script>
        async function fetchPlayers() {
            const response = await fetch('/players');
            const players = await response.json();
            const tableBody = document.querySelector('#playerTable tbody');
            tableBody.innerHTML = '';

            players.forEach(player => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${player.id}</td>
                    <td>${player.name}</td>
                    <td>${player.selected}</td>
                    <td>
                        <button onclick="updatePlayer(${player.id})">Update</button>
                        <button onclick="deletePlayer(${player.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

        document.getElementById('addPlayer').addEventListener('click', async () => {
            const name = document.getElementById('nameInput').value;
            const selected = document.getElementById('selectedInput').checked;
            const response = await fetch('/addPlayer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name,selected })
            });
            await fetchPlayers();
            document.getElementById('nameInput').value = '';
            document.getElementById('selectedInput').checked = false; 
        });

        async function updatePlayer(id) {
            const newName = prompt("Enter new name:");
            if (newName) {
                await fetch(/updatePlayer/${id}, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newName })
                });
                await fetchPlayers();
            }
        }

        async function deletePlayer(id) {
            if (confirm("Are you sure you want to delete this player?")) {
                await fetch(/deletePlayer/${id}, {
                    method: 'DELETE'
                });
                await fetchPlayers();
            }
        }

        fetchPlayers();
    </script>
</body>
</html>


//  user.json for login and signup
[
  {
    "username": "Niladri",
    "password": "1234"
  },
 
  {
    "username": "Nilu",
    "password": "1234"
  }
]

// crud operation player.json

[
  {
    "name": "Nil",
    "selected": false,
    "id": 2
  },
  {
    "id": 3,
    "name": "Niladri",
    "selected": false
  }
]

Question 3 ----------------------->>>>>>>>>>>>>>>>>>>>>>>>>>> Fetch table

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "button.html")); 
});




app.get("/getdata", (req, res) => {
    res.sendFile(path.join(__dirname, "user.json"));
});




app.get("/particulardata", (req, res) => {
    const filePath = path.join(__dirname, "user.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading the file");
        } else {
            let jsonData = JSON.parse(data);
            let filteredData = jsonData.filter(item => item.selected === "true");
            res.json(filteredData);
        }
    });
});



app.post("/delete", (req, res) => {
    const { id } = req.body;
    const filePath = path.join(__dirname, "user.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error reading the file" });
        }

        let jsonData = JSON.parse(data);
        jsonData = jsonData.filter(item => item.id !== id);

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: "Error writing the file" });
            }
            res.json({ message: "Deleted successfully" });
        });
    });
});


//update 
app.put("/update", async (req, res) => {
    try {
        const { id, updatedData } = req.body; 
        const filePath = path.join(__dirname, "user.json");
        let data = await fs.promises.readFile(filePath, "utf8");
        let jsonData = JSON.parse(data);
        const index = jsonData.findIndex(item => item.id === id);
        if (index !== -1) {
            jsonData[index] = { ...jsonData[index], ...updatedData };
            await fs.promises.writeFile(filePath, JSON.stringify(jsonData, null, 2));
            res.json({ message: "Updated successfully", updatedItem: jsonData[index] });
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error handling the request" });
    }
});




app.listen(port, () => {
    console.log(Server started on port ${port});
});


// root-folder/
// │
// ├── public/
// │   ├── button.html
// │   ├── data.html
// │   ├── particular_data.html
// │   ├── style.css
// │   └── image.jpg
// │
// ├── server.js
// ├── user.json
// └── package.json




<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Get Access the All Record</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h2>Get Access the all Data with this button</h2>
    <img src="Image_created_with_a_mobile_phone.png" alt="Random Image">
    <button><a href="data.html">Get Data</a></button>
</body>
</html>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selected Data</title>
</head>
<body>
    <h1>Selected Players</h1>
    <table border="1" id="selected-table">
        <tr>
            <th>Player</th>
            <th>Selected</th>
            <th>ID</th>
        </tr>
    </table>

    <script>
        async function fetchSelectedData() {
            try {
             
                let res = await fetch("http://localhost:8080/particulardata");
                let data = await res.json();
                console.log(data);  

                let table = document.getElementById("selected-table");

             
                data.forEach(element => {
                    let tr = document.createElement("tr");

                    let tdPlayer = document.createElement("td");
                    tdPlayer.textContent = element.Player;
                    tr.appendChild(tdPlayer);

                    let tdSelected = document.createElement("td");
                    tdSelected.textContent = element.selected === "true" ? "Yes" : "No";
                    tr.appendChild(tdSelected);

                    let tdId = document.createElement("td");
                    tdId.textContent = element.id;
                    tr.appendChild(tdId);

                    table.appendChild(tr);
                });
            } catch (err) {
                console.error("Error fetching selected data:", err);
            }
        }

        
        fetchSelectedData();
    </script>
</body>
</html>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data</title>
</head>
<body>
    <table id="table-1" border="1">
        <tr>
            <th>Player</th>
            <th>Selected</th>
            <th>ID</th>
            <th>Action</th>
        </tr>
    </table>
    <br><br>

    <button><a href="selecteddata.html">Get Only Selected Data</a></button>

    <script>
        async function fetchTable() {
            try {
                let res = await fetch("http://localhost:8080/getdata");
                let data = await res.json();  
                console.log(data); 

                let table = document.getElementById("table-1");

                data.forEach(element => {
                    let tr = document.createElement("tr");

                    let tdPlayer = document.createElement("td");
                    tdPlayer.textContent = element.Player;
                    tr.appendChild(tdPlayer);

                    let tdSelected = document.createElement("td");
                    tdSelected.textContent = element.selected === "true" ? "Yes" : "No";
                    tr.appendChild(tdSelected);

                    let tdId = document.createElement("td");
                    tdId.textContent = element.id;
                    tr.appendChild(tdId);

                    let tdActions = document.createElement("td");

                    // Delete button
                    let deleteBtn = document.createElement("button");
                    deleteBtn.textContent = "Delete";
                    deleteBtn.onclick = async () => {
                        if (confirm(Are you sure you want to delete the row for ${element.Player}?)) {
                            try {
                                let deleteResponse = await fetch("http://localhost:8080/delete", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({ id: element.id })
                                });

                                if (deleteResponse.ok) {
                                    let row = deleteBtn.parentNode.parentNode; 
                                    row.parentNode.removeChild(row);
                                    alert("Deleted successfully!");
                                } else {
                                    alert("Failed to delete on server.");
                                }
                            } catch (err) {
                                console.error("Error deleting data:", err);
                                alert("Error deleting data.");
                            }
                        }
                    };
                    tdActions.appendChild(deleteBtn);

                    // Update button
                    let updateBtn = document.createElement("button");
                    updateBtn.textContent = "Update";
                    updateBtn.onclick = () => {
                        const newPlayer = prompt("Enter new player name:", element.Player);
                        const newSelected = prompt("Is selected? (true/false):", element.selected);
                        if (newPlayer !== null && newSelected !== null) {
                            updateData(element.id, { Player: newPlayer, selected: newSelected });
                        }
                    };
                    tdActions.appendChild(updateBtn);

                    tr.appendChild(tdActions);
                    table.appendChild(tr);
                });
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        }

        async function updateData(id, updatedData) {
            try {
                const response = await fetch("http://localhost:8080/update", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id, updatedData })
                });

                const result = await response.json();
                if (response.ok) {
                    alert("Updated successfully!");
                    // Update UI: find the row and update its contents
                    const rows = document.querySelectorAll("#table-1 tr");
                    rows.forEach(row => {
                        if (row.cells[2].textContent == id) { // ID column
                            row.cells[0].textContent = updatedData.Player; // Update Player
                            row.cells[1].textContent = updatedData.selected === "true" ? "Yes" : "No"; // Update Selected
                        }
                    });
                } else {
                    alert("Failed to update on server.");
                }
            } catch (error) {
                console.error("Error updating data:", error);
                alert("Error updating data.");
            }
        }

        fetchTable();
    </script>
</body>
</html>


//</body> selected data show user.json
[
    {
      "Player": "Niladri",
      "selected": "true",
      "id": 1
    },
    {
      "Player": "User-2",
      "selected": "false",
      "id": 2
    }
  ]

  // </meta> fetch table raki maam


  const express = require("express");
  const app = express();
  const fs = require("fs");\

  const fs = require("fs").promises
  
  app.use(express.json());
  app.get("/",(req,res)=>{
      res.sendFile(__dirname+"/express.html");
  })
  
  app.get("/delete",(req,res)=>{
      console.log(req.query);
      res.end();
  })
  
  app.post("/delete",(req,res)=>{
      console.log(req.body,"post");
      fs.readFile(__dirname+"/express.json","utf-8",(err,data)=>{
          data = JSON.parse(data);
          let arr = data.filter((ele)=>{
              if(ele.id!=req.body.id){
                  return true;
              }
          })
          fs.writeFile(__dirname+"/express.json",JSON.stringify(arr),(err)=>{
              res.end()
          })
      })
     // res.end()
  })
  
  app.get("/getdata",(req,res)=>{
      res.sendFile(__dirname+"/express.json");
  })
  
  app.listen(3000);
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <table border="1">
          <tbody id="body">
          </tbody>
      </table>
      <button onclick="allData()">all</button>
      <script>
          async function allData() {
              try {
                  const response = await fetch("/getdata");
                  const data = await response.json();
                  createTable(data);
              } catch (e) {
                  alert("Error fetching data");
              }
          }
  
          function createTable(data) {
              data.forEach((element) => {
                  const tr = document.createElement("tr");
  
                  const td = document.createElement("td");
                  td.innerHTML = element.name;
  
                  const td1 = document.createElement("td");
                  td1.innerHTML = element.status;
  
                  const td2 = document.createElement("td");
                  const button = document.createElement("button");
                  button.id = element.id;
                  button.innerHTML = "delete";
  
                  button.addEventListener("click", async (event) => {
                      const id = event.target.id;
  
                      // Show confirmation alert before deleting
                      const confirmDelete = confirm("Are you sure you want to delete this item?");
                      if (confirmDelete) {
                          try {
                             
                              const response = await fetch("/delete", {
                                  method: "POST",
                                  headers: {
                                      "Content-Type": "application/json"
                                  },
                                  body: JSON.stringify({ id: id })
                              });
  
                              if (response.ok) {
                        
                                  tr.remove();
                                  alert("Item deleted successfully.");
                              } else {
                                  alert("Failed to delete item.");
                              }
                          } catch (error) {
                              alert("Error while deleting the item.");
                          }
                      }
                  });
  
                  td2.append(button);
                  tr.append(td, td1, td2);
                  document.getElementById("body").appendChild(tr);
              });
          }
      </script>
  </body>
  </html>

{/* // epxress.json</head> */}
  [
    {
        "name":"User-1",
        "status":"true",
        "id":1
    },
    {
        "name":"User-2",
        "status":"false",
        "id":2
    }
]


{/* // file readFile
const fs = require("fs").promises

// read Data

const dataVal = await fs.readFile("./data.json","utf-8")
const data = dataVal ? JSON.parse(dataVal) : [];

// write Data


await fs.writeFile("./data.json",JSON.stringify(data,null,2)) */}
