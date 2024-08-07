import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";

const CreateRoomPage = ({
  update = false,
  roomCode = "",
  updateCallback = () => {},
}) => {
  const navigate = useNavigate();
  const defaultVotes = 2;
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // Add error message state

  useEffect(() => {
    if (update && roomCode) {
      // Fetch room data if in update mode
      fetch(`/api/get-room?code=${roomCode}`)
        .then((response) => response.json())
        .then((data) => {
          setGuestCanPause(data.guest_can_pause);
          setVotesToSkip(data.votes_to_skip);
        })
        .catch((error) => {
          console.error("Error fetching room data:", error);
        });
    }
  }, [update, roomCode]);

  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true");
  };

  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        navigate(`/room/${data.code}`); // Redirect to the new room
      })
      .catch((error) => {
        console.error("Error creating room:", error);
        setErrorMsg("Error creating room."); // Set error message
      });
  };

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions)
      .then(async (response) => {
        const contentType = response.headers.get("Content-Type");
        if (response.ok) {
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            setSuccessMsg("Room updated successfully!"); // Update the success message state
            setErrorMsg(""); // Clear error message
            updateCallback(votesToSkip, guestCanPause);
          } else {
            const text = await response.text();
            console.error("Unexpected response type:", text);
            setErrorMsg("Error updating room: Unexpected response type.");
            setSuccessMsg(""); // Clear success message
          }
        } else {
          const errorData = await response.text(); // Get the text response for debugging
          console.error("Error updating room:", errorData);
          setErrorMsg("Error updating room.");
          setSuccessMsg(""); // Clear success message
        }
      })
      .catch((error) => {
        console.error("Error updating room:", error);
        setErrorMsg("Error updating room.");
        setSuccessMsg(""); // Clear success message
      });
  };

  const title = update ? "Update Room" : "Create A Room";
  const buttonText = update ? "Update Room" : "Create A Room";

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            value={guestCanPause.toString()} // Set controlled value
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            value={votesToSkip}
            onChange={handleVotesChange}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={update ? handleUpdateButtonPressed : handleRoomButtonPressed}
        >
          {buttonText}
        </Button>
      </Grid>
      {!update && (
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      )}
      <Grid item xs={12} align="center">
        <Collapse in={successMsg !== "" || errorMsg !== ""}>
          {successMsg && (
            <Alert severity="success" onClose={() => setSuccessMsg("")}>
              {successMsg}
            </Alert>
          )}
          {errorMsg && (
            <Alert severity="error" onClose={() => setErrorMsg("")}>
              {errorMsg}
            </Alert>
          )}
        </Collapse>
      </Grid>
    </Grid>
  );
};

export default CreateRoomPage;
