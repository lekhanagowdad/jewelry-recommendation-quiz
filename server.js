const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

/* ================= PRODUCT DATA ================= */

const products = [
  {
    id: 1,
    name: "Elegant Solitaire Ring",
    price: "₹68,000",
    image: "https://tse1.mm.bing.net/th/id/OIP.DmsSrk1hfRXY03e0cA1SIgHaHa?pid=Api&P=0&h=180",
    details: "Rose Gold · Minimal · Diamond",
    description:
      "A timeless solitaire ring crafted in rose gold with a certified diamond. Perfect for engagements and elegant occasions.",
    reason: "Matches your elegant taste and engagement occasion."
  },
  {
    id: 2,
    name: "Classic Halo Ring",
    price: "₹82,000",
    image: "https://www.sylviejewelry.com/wp-content/uploads/2019/05/Halo-engagement-ring-S1793-Sylvie.jpg",
    details: "White Gold · Classic · Diamond",
    description:
      "A classic halo design that enhances brilliance and adds timeless charm. Loved for its traditional elegance.",
    reason: "A timeless design that reflects your refined preference."
  },
  {
    id: 3,
    name: "Modern Gemstone Ring",
    price: "₹55,000",
    image: "https://tse1.mm.bing.net/th/id/OIP.9HTyz9SkKB_TDguoNPYgSAHaHe?pid=Api&P=0&h=180",
    details: "Gold · Modern · Gemstone",
    description:
      "A bold modern ring featuring a vibrant gemstone, designed for confident and contemporary personalities.",
    reason: "Perfect for a bold, contemporary personality."
  }
];

/* ================= HOME / QUIZ ================= */

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Jewelry Recommendation Quiz</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins&display=swap" rel="stylesheet">
<style>
body {
  margin: 0;
  font-family: Poppins, sans-serif;
  background: linear-gradient(135deg,#fdfcfb,#f5efe6);
}
.container {
  max-width: 420px;
  margin: auto;
  padding: 20px;
}
.card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.12);
}
h1 {
  font-family: "Playfair Display", serif;
}
.option {
  border: 1px solid #ddd;
  padding: 14px;
  border-radius: 14px;
  margin-top: 12px;
  cursor: pointer;
}
.option:hover {
  border-color: #c9a24d;
  background: #fffaf0;
}
button {
  background: linear-gradient(135deg,#c9a24d,#e6c77a);
  border: none;
  color: white;
  padding: 14px;
  width: 100%;
  border-radius: 30px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
}
.product {
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 18px;
  margin-top: 18px;
}
</style>
</head>

<body>
<div class="container">
  <div class="card" id="app"></div>
</div>

<script>
const app = document.getElementById("app");

const questions = [
  { q: "What’s the occasion?", key: "occasion", options: ["Engagement","Gift","Self Purchase"] },
  { q: "Preferred style?", key: "style", options: ["Minimal","Classic","Modern","Vintage"] },
  { q: "Metal preference?", key: "metal", options: ["Gold","Rose Gold","White Gold","Not Sure"] },
  { q: "Budget range?", key: "budget", options: ["Low","Medium","High"] },
  { q: "Stone preference?", key: "stone", options: ["Diamond","Gemstone","Any"] }
];

let step = 0;
let answers = {};

function renderQuestion() {
  const q = questions[step];
  app.innerHTML = \`
    <h1>\${q.q}</h1>
    \${q.options.map(o =>
      \`<div class="option" onclick="selectAnswer('\${q.key}','\${o}')">\${o}</div>\`
    ).join("")}
  \`;
}

function selectAnswer(key, value) {
  answers[key] = value;
  step++;
  step < questions.length ? renderQuestion() : submitQuiz();
}

function submitQuiz() {
  app.innerHTML = "<h1>Finding your perfect match ✨</h1>";
  fetch("/recommend", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(answers)
  })
  .then(res => res.json())
  .then(showResults);
}

function showResults(data) {
  app.innerHTML = \`
    <h1>Your Recommendations 💍</h1>
    \${data.map(p => \`
      <div class="product">
        <h3>\${p.name}</h3>
        <p>\${p.details}</p>
        <p><b>Why this suits you:</b> \${p.reason}</p>
        <button onclick="viewProduct(\${p.id})">View Product</button>
      </div>
    \`).join("")}
  \`;
}

function viewProduct(id) {
  window.location.href = "/product/" + id;
}

app.innerHTML = \`
  <h1>Find Your Perfect Jewelry ✨</h1>
  <p>Personalized picks in under 60 seconds</p>
  <button onclick="renderQuestion()">Start Quiz</button>
\`;
</script>
</body>
</html>
`);
});

/* ================= PRODUCT PAGE ================= */

app.get("/product/:id", (req, res) => {
  const product = products.find(p => p.id == req.params.id);

  if (!product) return res.send("Product not found");

  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>${product.name}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins&display=swap" rel="stylesheet">
<style>
body {
  margin: 0;
  font-family: Poppins, sans-serif;
  background: #faf9f6;
}
.container {
  max-width: 420px;
  margin: auto;
  padding: 20px;
}
.card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
}
img {
  width: 100%;
  border-radius: 16px;
}
button {
  background: linear-gradient(135deg,#c9a24d,#e6c77a);
  border: none;
  color: white;
  padding: 14px;
  width: 100%;
  border-radius: 30px;
  font-size: 16px;
  margin-top: 20px;
}
a {
  display: block;
  text-align: center;
  margin-top: 14px;
  color: #555;
  text-decoration: none;
}
</style>
</head>

<body>
<div class="container">
  <div class="card">
    <img src="${product.image}">
    <h1>${product.name}</h1>
    <h3>${product.price}</h3>
    <p>${product.details}</p>
    <p>${product.description}</p>
    <button>Buy Now</button>
    <a href="/">← Back to Quiz</a>
  </div>
</div>
</body>
</html>
`);
});

/* ================= API ================= */

app.post("/recommend", (req, res) => {
  res.json(products);
});

/* ================= SERVER ================= */

app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});
