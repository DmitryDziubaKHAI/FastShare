import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions} from "@mui/material";
import { useState } from "react";
import { UserService } from "@/application/services/UserService";   
import { UserDTO } from "@/application/dto/userDTO"; 
import { UserRepository } from "@/application/repositories/UserRepository";
import ILoginProps from "@/application/interfaces/ILoginProps";

const Signup = ({ open, setOpen }: ILoginProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userService = new UserService(new UserRepository());

  const handleSubmit = async () => {
    const userDTO = new UserDTO(username, email, password);
    try {
      const response = await userService.registerUser(userDTO);

      if (response.ok) {
        alert("Successfully registered!");
        setOpen(false);
      } else {
        alert("Error registering");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("An error occurred: " + error.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Sign Up</DialogTitle>
      <DialogContent>
        <TextField
          label="Username"
          fullWidth
          margin="dense"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="dense"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Signup;

