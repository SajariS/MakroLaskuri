import { Button, Container, DialogActions, DialogContent, TextField, } from "@mui/material";

export default function settingsDialog() {

    return(
        <DialogContent>
            <Container>
                <TextField
                    type="text"
                    onChange={() => console.log("hups")}
                />
            </Container>
            <DialogActions>
                <Button>Sulje</Button>
                <Button>Tallenna</Button>
            </DialogActions>
        </DialogContent>
    )
}