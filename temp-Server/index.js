require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const serverless = require("serverless-http");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;

// middleware

// Configure CORS to allow known client origins (add more as needed)
const allowedOrigins = [
  "https://blood-donation-47e0d.web.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log("Incoming request origin:", origin);
  next();
});

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin))
      return callback(null, true);
    if (/^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin))
      return callback(null, true);
    return callback(new Error("CORS policy: origin not allowed"));
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xg04b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7) but
    // explicitly connecting here helps ensure DB operations succeed.
    await client.connect();

    // ------------------------
    const usersCollection = client.db("unity_blood").collection("users");
    const requestsCollection = client
      .db("unity_blood")
      .collection("DonationRequests");
    const blogCollection = client.db("unity_blood").collection("blogs");
    const paymentCollection = client.db("unity_blood").collection("payments");

    // JWT token api implementation
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    // middlewares
    const verifyToken = (req, res, next) => {
      console.log(
        "verifyToken - authorization header:",
        req.headers.authorization,
      );
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = req.headers.authorization.split(" ")[1];

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          console.error("JWT verify error:", err);
          return res.status(401).send({ message: "unauthorized access" });
        }
        console.log("JWT decoded:", decoded);
        req.decoded = decoded;
        next();
      });
    };

    // use verify admin after verify token
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      const isAdmin = user?.role === "Admin";
      if (!isAdmin) {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    // users related API post request
    app.post("/users", async (req, res) => {
      try {
        const user = req.body;
        console.log("POST /users body:", user);
        if (!user || !user.email) {
          return res.status(400).send({ error: "Invalid user data" });
        }
        const query = { email: user.email };
        const existingUser = await usersCollection.findOne(query);
        if (existingUser) {
          return res
            .status(200)
            .send({ message: "user already exists", insertedId: null });
        }
        const result = await usersCollection.insertOne(user);
        console.log("Inserted user id:", result.insertedId);
        res.send(result);
      } catch (err) {
        console.error("Error in /users:", err);
        res.status(500).send({ error: "Failed to create user" });
      }
    });

    app.post("/createDonationRequest", verifyToken, async (req, res) => {
      const donationRequest = req.body;
      const result = await requestsCollection.insertOne(donationRequest);
      res.send(result);
    });

    app.post("/createBlog", verifyToken, async (req, res) => {
      const newBlog = req.body;
      const result = await blogCollection.insertOne(newBlog);
      res.send(result);
    });

    app.get("/user", verifyToken, async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    app.get("/user/admin/:email", verifyToken, async (req, res) => {
      try {
        const email = req.params.email;
        console.log(
          "GET /user/admin/:email param:",
          email,
          "decoded:",
          req.decoded,
        );
        if (email !== req.decoded.email) {
          return res.status(403).send({ message: "forbidden access" });
        }
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        console.log("DB user lookup result:", user);
        let admin = false;
        if (user) {
          admin = user?.role === "Admin";
        }
        res.send({ admin });
      } catch (err) {
        console.error("Error in /user/admin/:email", err);
        res.status(500).send({ error: "Failed to check admin" });
      }
    });

    app.get("/pending-donation-requests", async (req, res) => {
      const query = { donationStatus: "pending" };
      const requests = await requestsCollection.find(query).toArray();
      res.send(requests);
    });

    app.get("/allUsers", verifyToken, async (req, res) => {
      const allUsers = await usersCollection.find().toArray();
      res.send(allUsers);
    });
    app.get("/allBlogs", verifyToken, async (req, res) => {
      const allBlogs = await blogCollection.find().toArray();
      res.send(allBlogs);
    });
    app.get("/publishedBlogs", async (req, res) => {
      const query = { status: "published" };
      const publishedBlogs = await blogCollection.find(query).toArray();
      res.send(publishedBlogs);
    });

    app.get("/donationRequests", verifyToken, async (req, res) => {
      const email = req.query.email;
      const query = { requesterEmail: email };
      const userRequests = await requestsCollection
        .find(query)
        .sort({ _id: -1 })
        .limit(3)
        .toArray();
      res.send(userRequests);
    });
    app.get("/allDonationRequests", verifyToken, async (req, res) => {
      const email = req.query.email;
      const query = { requesterEmail: email };
      const allUserRequests = await requestsCollection.find(query).toArray();
      res.send(allUserRequests);
    });
    app.get("/allDonationRequestsAd", verifyToken, async (req, res) => {
      const allDonationRequests = await requestsCollection.find().toArray();
      res.send(allDonationRequests);
    });

    app.get("/allFunding", verifyToken, async (req, res) => {
      const allFunding = await paymentCollection.find().toArray();
      res.send(allFunding);
    });

    app.get("/donationRequest/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await requestsCollection.findOne(query);
      res.send(result);
    });

    app.get("/allFunding10", verifyToken, async (req, res) => {
      try {
        const allFunding = await paymentCollection
          .find()
          .sort({ _id: -1 })
          .limit(10)
          .toArray();

        res.send(allFunding);
      } catch (error) {
        console.error("Error fetching funding data:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.delete(
      "/requestDelete/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await requestsCollection.deleteOne(query);
        res.send(result);
      },
    );

    app.patch("/user-update/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name: req.body.name,
          bloodGroup: req.body.bloodGroup,
          district: req.body.district,
          upazilla: req.body.upazilla,
          image: req.body.image,
        },
      };
      const result = await usersCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.patch(
      "/user-update/role/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            role: req.body.role,
          },
        };
        const result = await usersCollection.updateOne(query, updateDoc);
        res.send(result);
      },
    );

    app.patch("/blog-status-update/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      if (req.body.status === "draft") {
        const updateStatus = {
          $set: {
            status: req.body.status,
          },
        };
        const result = await blogCollection.updateOne(query, updateStatus);
        res.send(result);
      }
      if (req.body.status === "published") {
        const updateStatus = {
          $set: {
            status: req.body.status,
          },
        };
        const result = await blogCollection.updateOne(query, updateStatus);
        res.send(result);
      }
    });

    app.patch("/request-status-update/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const { status, donorName, donorEmail } = req.body;

      if (status === "canceled" || status === "done") {
        const updateStatus = {
          $set: {
            donationStatus: status,
          },
        };
        const result = await requestsCollection.updateOne(query, updateStatus);
        res.send(result);
      }
      if (status === "inprogress") {
        const updateStatus = {
          $set: {
            donationStatus: status,
            donorName,
            donorEmail,
          },
        };
        const result = await requestsCollection.updateOne(query, updateStatus);
        res.send(result);
      }
    });

    app.patch("/user-update/status/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: req.body.status,
        },
      };
      const result = await usersCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.patch("/requestUpdate/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          bloodGroup: req.body.bloodGroup,
          date: req.body.date,
          district: req.body.district,
          fullAddress: req.body.fullAddress,
          hospital: req.body.hospital,
          message: req.body.message,
          recipientName: req.body.recipientName,
          time: req.body.time,
          upazilla: req.body.upazilla,
        },
      };
      const result = await requestsCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.post("/create-payment-intent", async (req, res) => {
      const { donationAmount } = req.body;

      // Input validation
      if (typeof donationAmount !== "number" || donationAmount <= 0) {
        return res.status(400).send({ error: "Invalid donation amount" });
      }

      const amount = parseInt(donationAmount * 100);

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          payment_method_types: ["card"],
        });

        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).send({ error: "Failed to create payment intent" });
      }
    });

    app.post("/payments", async (req, res) => {
      const payment = req.body;
      const paymentResult = await paymentCollection.insertOne(payment);
      res.send(paymentResult);
    });

    // ------------------------

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("unity_blood server is running to");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
module.exports = app;
module.exports.handler = serverless(app);
