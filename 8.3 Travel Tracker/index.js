import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user : "postgres",
  host : "localhost",
  database : "world2",
  password : "Ritika#12345678",
  port : 5432,
});

db.connect();


app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM world_map");
  const countries = [];
  result.rows.forEach((country) =>{
    countries.push(country.country_code);
  })
  res.render("index.ejs", { countries : countries , total : countries.length});
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];
  const result = await db.query("select (country_code) from countries where LOWER(country) = "%" || ($1)" || "%", [input.tolowercase()]);

  if (result.rows.length !== 0) {
    const code = result.rows[0];
    await db.query("INSERT INTO world_map (country_code) VALUES ($1)", [code.country_code]);
  } 
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
