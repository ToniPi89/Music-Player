import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";

function Room({ leaveRoomCallback }) {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
  });

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(`/api/get-room?code=${roomCode}`);
        if (!response.ok) {
          leaveRoomCallback();
          navigate("/");
        } else {
          const data = await response.json();
          setState((prevState) => ({
            ...prevState,
            votesToSkip: data.votes_to_skip,
            guestCanPause: data.guest_can_pause,
            isHost: data.is_host,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch room details:", error);
      }
    };

    fetchRoomDetails();
  }, [roomCode, navigate, leaveRoomCallback]);

  const leaveButtonPressed = async () => {
    try {
      const response = await fetch("/api/leave-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        leaveRoomCallback();
        navigate("/");
      } else {
        console.error("Failed to leave room");
      }
    } catch (error) {
      console.error("Failed to leave room:", error);
    }
  };

  const updateShowSettings = (value) => {
    setState((prevState) => ({
      ...prevState,
      showSettings: value,
    }));
  };

  const updateRoomDetails = (votesToSkip, guestCanPause) => {
    setState((prevState) => ({
      ...prevState,
      votesToSkip: votesToSkip,
      guestCanPause: guestCanPause,
    }));
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={state.votesToSkip}
            guestCanPause={state.guestCanPause}
            roomCode={roomCode}
            updateCallback={updateRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderRoomDetails = () => {
    return (
      <>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Votes: {state.votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Guest Can Pause: {state.guestCanPause.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {state.isHost.toString()}
          </Typography>
        </Grid>
        {state.isHost ? renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={leaveButtonPressed}
          >
            Leave Room
          </Button>
        </Grid>
      </>
    );
  };

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  return (
    <Grid container spacing={1}>
      {state.showSettings ? renderSettings() : renderRoomDetails()}
    </Grid>
  );
}

export default Room;
