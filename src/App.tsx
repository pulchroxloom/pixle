import React from "react";
import Button from "@mui/material/Button/Button";
import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/system/Box/Box";
import GuessInput from "./components/low-level/GuessInput";
import PixelatedImage from "./components/low-level/PixelatedImage";
import GuessBoxes from "./components/mid-level/GuessBoxes";
import TopBar from "./components/mid-level/TopBar";
import GuessStatus from './utils/interfaces/guess';
import Art from "./utils/interfaces/art";
import Typography from "@mui/material/Typography/Typography";
import ShareDialog from "./components/top-level/ShareDialog";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import { getFunctions, httpsCallable } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnjnsVovQ3Vyt_G__wWJwb533oU3sHISs",
  authDomain: "pixle-it.firebaseapp.com",
  projectId: "pixle-it",
  storageBucket: "pixle-it.appspot.com",
  messagingSenderId: "1087921062282",
  appId: "1:1087921062282:web:874024540c4ff5833e8873",
  measurementId: "G-876S5H55TR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

analytics.app.automaticDataCollectionEnabled = true

const functions = getFunctions(app);
const getTitles = httpsCallable(functions, 'getTitles');
const getDailyWork = httpsCallable(functions, 'getDailyWork');

type Props = {
  guessLimit: number
}

const App = (props: Props) => {
  const { guessLimit } = props

  const theme = useTheme()

  const [titles, setTitles] = React.useState<string[]>([])
  const [selectedArtwork, setSelectedArtwork] = React.useState<Art>()
  const [gameOver, setGameOver] = React.useState(false)
  const [openArtworkDialog, setOpenArtworkDialog] = React.useState(gameOver)

  React.useEffect(() => {
    if (gameOver) setOpenArtworkDialog(true)
  }, [gameOver])

  React.useEffect(() => {
    const fetchTitles = async () => setTitles(((await getTitles()).data as string[]).sort((a, b) => a.localeCompare(b)))

    const fetchDailyWork = async (now: number) => setSelectedArtwork((await getDailyWork(now)).data as Art)

    // call the function
    fetchTitles()
      // make sure to catch any error
      .catch(console.error);

    // call the function
    fetchDailyWork(Date.now())
      // make sure to catch any error
      .catch(console.error);
  }, [])

  const [pixelation, setPixelation] = React.useState(guessLimit)
  const [guesses, setGuesses] = React.useState<GuessStatus[]>([])

  const [guessedArtwork, setGuessedArtwork] = React.useState<string | null>(null)

  const makeGuess = React.useCallback(() => {
    if (guessedArtwork) {
      const guess: GuessStatus = guessedArtwork === selectedArtwork?.title ? 'correct' : 'incorrect'
      if (guess === 'correct' || guesses.length + 1 >= guessLimit) {
        setPixelation(0)
        setGameOver(true)
      } else {
        setPixelation(pixelation - 1)
      }
      setGuesses(guesses.concat(guess))
    }
  }, [guessedArtwork, selectedArtwork, guesses, guessLimit, pixelation])

  const revealImage = React.useCallback(() => {
    if (pixelation > 0) {
      setPixelation(pixelation - 1)
      if (guesses.length + 1 >= guessLimit) {
        setGameOver(true)
      }
      setGuesses(guesses.concat('revealed'))
    }
  }, [pixelation, guesses, guessLimit])

  return (
    <Box sx={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      p: `0 ${theme.spacing(2)}`,
    }}>
      <TopBar setArtworkDialogOpen={setOpenArtworkDialog} />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        m: `${theme.spacing(2)} ${theme.spacing(6)}`,
        flexGrow: 1,
        width: '100%'
      }}>
        {selectedArtwork && (<PixelatedImage art={selectedArtwork} pixelation={pixelation} />)}
        <Box>
          <GuessBoxes guesses={guesses} minNumBoxes={guessLimit} />
          <GuessInput disabled={gameOver} options={titles} setGuessedArtwork={setGuessedArtwork} />
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}>
            <Button onClick={revealImage} disabled={gameOver}>
              <Typography>
                Skip
              </Typography>
            </Button>
            <Button onClick={makeGuess} sx={{ color: theme.palette.success.main }} disabled={gameOver}>
              <Typography>
                Guess
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
      <ShareDialog open={openArtworkDialog} art={selectedArtwork} onClose={() => setOpenArtworkDialog(false)} guesses={guesses} guessLimit={guessLimit} day={selectedArtwork?.day ?? 0} />
    </Box>
  );
}

export default App
