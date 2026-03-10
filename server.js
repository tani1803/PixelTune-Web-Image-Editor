require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db");

const PORT = 3000|| process.env.PORT;

const startServer = async () => {
    try {

        await connectDB();
        console.log("Database connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {

        console.log(error);
        process.exit(1);

    }
};

startServer();