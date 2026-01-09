import { Button, Container, DialogActions, DialogContent, Input, TextField, } from "@mui/material";
import { useState } from "react";

export default function settingsDialog() {


    const handleChange = (e) => {

    }

    return(
        <DialogContent>
            <Container>
                <TextField
                    type="text"
                    onChange={handleChange}
                />
            </Container>
            <DialogActions>
                <Button>Sulje</Button>
                <Button>Tallenna</Button>
            </DialogActions>
        </DialogContent>
    )
}