import app from './App';
import * as dotenv from 'dotenv';

dotenv.config();

const port = process.env.port || 8080;

app.listen(port, (error) => {

    if (error) {
        return console.log(error);
    }

    return console.log(`Server is running on port: ${port}`);
});
