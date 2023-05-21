import express, {Request, Response} from "express"
import axios from 'axios';
import 'dotenv/config'
// eslint-disable-next-line no-console
const app = express()
const port = 8000
const clientId: string = process.env.CLIENT_ID as string;
const clientSecret:string = process.env.CLIENT_SECRERT as string;
const redirect_Uri:string = process.env.REDIRECT_URI as string;

app.get('/login', (req:Request, res:Response) => {
    const scope = 'user-read-private user-read-email';
    res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirect_Uri)}`);
});

app.get('/callback', async (req:Request, res:Response) => {
    const code = req.query.code as string;
    const authOptions = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
        data: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirect_Uri)}`,
    };

    try {
        const response = await axios(authOptions);
        const data:any = response;

        const accessToken = data.access_token as string;
        const refreshToken = data.refresh_token as string;

        res.redirect('/success');
    } catch (error:any) {
        console.error('Error:', error.message);
        res.status(500).send('Error');
    }
});

app.get('/success', (req:Request, res:Response) => {
    res.send('success page')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})