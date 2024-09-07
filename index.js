import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

// -------- Importing Routes ---------- //
import usersRoutes from "./routes/users-routes.js";

// -------- Express Config ---------- //

const app = express();
app.use(express.json());


// ------- CORS Configuration ---------- //
const corsOptions = {
    origin: [process.env.FRONT_URL], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  };
  
app.use(cors(corsOptions));


// ----- Set the port ---- //
const port = process.env.PORT || 8000
// --------- Test route -----//
app.get('/', (req, res) => {
    res.send('Server is running');
});

// ---------- Importing MiddleWares --------- //
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// ---------- Routes --------- //
app.use('/api/user', usersRoutes);

// --------- Start the server ------------ //
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
