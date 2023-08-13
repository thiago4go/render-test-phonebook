const express = require("express");
const app = express();
const PORT = 3003;
const morgan = require("morgan");
const cors = require("cors");
app.use(express.static("build"));

app.use(express.json());

app.use(cors());

// Define custom token for request body
morgan.token("body", (req, res) => JSON.stringify(req.body));

// Usemorgan middleware with defined format string
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
];

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${phonebook.length} people</p><p>${date}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  res.json(phonebook);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  if (phonebook.find((person) => person.id === id)) {
    res.json(phonebook.find((person) => person.id === id));
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  if (phonebook.find((person) => person.id === id)) {
    phonebook = phonebook.filter((person) => person.id !== id);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

const generateId = () => {
  const maxId = Math.random() * 1000000;
  return maxId;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "The name or number is missing"
    });
  }
  if (phonebook.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "The name already exists in the phonebook, name must be unique"
    });
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  };
  phonebook = phonebook.concat(person);
  res.json(person);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
