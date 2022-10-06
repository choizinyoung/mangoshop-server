const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const port = 8080;

app.use(express.json());
app.use(cors());
app.get("/products", (req, res) => {
  models.Product.findAll({
    order:[["createdAt","DESC"]], //ASC
    attributes:["id","name","price","seller","description","imageUrl","createdAt"],
  })
    .then((result) => {
      res.send({ Product: result });
    })
    .catch((error) => {
      console.error(error);
      res.send("에러발생");
    });
});
app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({ where: { id: id } })
    .then((result) => {
      console.log("product:", result);
      res.send({product:result});
    })
    .catch((error) => {
      console.error(error);
      res.send('상품조회시 에러가 발생했습니다')
    });
});
app.post("/products", (req, res) => {
  const body = req.body;
  const { name, price, seller, description, imageUrl } = body;
  if (!name || !price || !seller || !description) {
    res.send("모든 필드를 입력해주세요");
  }
  models.Product.create({ name, price, seller, description, imageUrl })
    .then((result) => {
      console.log("상품생성결과");
      res.send({ result });
    })
    .catch((error) => {
      console.error(error);
      res.send("상품업로드에 문제가 발생하였습니다.");
    });
});
app.post("/login", (req, res) => {
  res.send("로그인해주세요");
});
app.listen(port, () => {
  console.log("망고샵의 서버가 켜졌습니다");
  models.sequelize
    .sync()
    .then(() => {
      console.log("🙊DB연결성공");
    })
    .catch((err) => {
      console.error(err);
      console.log("💩DB연결실패");
      process.exit();
    });
});
