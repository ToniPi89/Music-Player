import React from "react";
import { Grid, Typography, Card, IconButton, LinearProgress } from "@mui/material";
import { SkipNext, PlayArrow, Pause } from "@mui/icons-material";

const MusicPlayer = (props) => {
  // Calculate the song progress percentage
  const songProgress = (props.time / props.duration) * 100;

  const pauseSong = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/pause", requestOptions);
  };

  // Function to play the song
  const playSong = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/play", requestOptions);
  };

  return (
    <Card>
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          <img src={props.image_url} height="100%" width="100%" alt="Album Cover" />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {props.title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {props.artist}
          </Typography>
          <div>
            <IconButton onClick={ () => {props.is_playing ? pauseSong() : playSong();
             }}
             >
              {props.is_playing ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton>
              <SkipNext />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
};

export default MusicPlayer;
