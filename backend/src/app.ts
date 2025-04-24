import express from 'express';
import cors from 'cors';
import {Unit} from './unit'

// import router
import {studentRouter} from './router/student-router';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// use router
app.use("/api",)

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
});