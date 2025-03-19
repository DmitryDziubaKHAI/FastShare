import { Box, Button, TextField, IconButton, List, ListItem, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid';
import './file_container.css';
import './addBtn.css';
import { useRef, useState } from 'react';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import UndoIcon from '@mui/icons-material/Undo';

interface UploadedWindowProps {
    onBack: () => void;
}

const UploadedWindow: React.FC<UploadedWindowProps> = ({ onBack }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [password, setPassword] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
        }
    };

    const handleClearAllFiles = async () => {
        
        setFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        
        if (!password) {
            return;
        }

        
        const confirmDelete = window.confirm(
            "Do you want to delete all files with this password from the server?\n" +
            "This action cannot be undone."
        );

        if (!confirmDelete) {
            return;
        }

        const trimmedPassword = password.trim();
        console.log("Sending password for deletion:", `"${trimmedPassword}"`);

        try {
            const response = await fetch("http://localhost:3000/files", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: trimmedPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            alert(`Successfully deleted ${result.count} files from the server`);
            setPassword(""); 
        } catch (error) {
            console.error("Delete error:", error);
            alert(`Failed to delete files: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    };

    const handleDeleteFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleUploadClick = async () => {
        if (!files.length || !password) {
            alert("Please select files and enter a password.");
            return;
        }

        const trimmedPassword = password.trim();

        const formData = new FormData();
        formData.append("password", trimmedPassword);
        files.forEach((file) => formData.append("files", file));

        try {
            const response = await fetch("http://localhost:3000/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            alert("Files uploaded successfully!");
            setFiles([]);
            setPassword("");
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed");
        }
    };

    const handleDownloadClick = async () => {
        if (!password) {
            alert("Please enter a password to download files.");
            return;
        }

        const trimmedPassword = password.trim();
        console.log("Sending password:", `"${trimmedPassword}"`);

        try {
            const response = await fetch("http://localhost:3000/download", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: trimmedPassword }),
            });

            if (!response.ok) {
                throw new Error("No files found for this password.");
            }

            const contentType = response.headers.get("Content-Type");


            if (contentType && contentType.includes("application/json")) {
                const filesData: { filename: string; file: string }[] = await response.json();

                filesData.forEach((file: { filename: string; file: string }) => {
                    const blob = new Blob([Uint8Array.from(atob(file.file), c => c.charCodeAt(0))]);
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = file.filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                });
            } else {
                // 🔹 Якщо один файл – завантажуємо його окремо
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;

                const contentDisposition = response.headers.get("Content-Disposition");
                const fileName = contentDisposition
                    ? contentDisposition.split("filename=")[1].replace(/"/g, "")
                    : "downloaded_file";

                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error("Download error:", error);
            alert("Failed to download files.");
        }
    };

    return (
        <Box className="file-container">
            <Grid container spacing={1} sx={{ padding: 2, width: '100%', height: '100%', justifyContent: "center" }}>
                <Grid item container spacing={1} xs={5}>
                    <Grid item xs={12}>
                        <IconButton
                            className="wave-button"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <AddIcon />
                        </IconButton>

                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Password for files"
                            type="password"
                            variant="filled"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Grid>

                    <Grid item container spacing={1} xs={12}>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                                onClick={handleUploadClick}
                                fullWidth
                            >
                                Upload files
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                startIcon={<GetAppIcon />}
                                fullWidth
                                onClick={handleDownloadClick}
                            >
                                Download files
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteSweepIcon />}
                                onClick={handleClearAllFiles}
                                fullWidth
                            >
                                Clear {password ? "& Delete" : ""} Files
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item container xs={7} sx={{ height: '100%' }}>
                    <Grid item xs={12} sx={{ flexGrow: 1, overflow: 'auto' }}>
                        <List>
                            {files.map((file, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        borderRadius: 1,
                                        boxShadow: 1,
                                        marginBottom: 1,
                                        '&:hover': {
                                            boxShadow: 3,
                                            borderColor: 'primary.main',
                                        },
                                    }}
                                >
                                    <ListItem
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleDeleteFile(index)}
                                                sx={{
                                                    '&:hover': {
                                                        color: 'error.main',
                                                    },
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <InsertDriveFileIcon sx={{ marginRight: 2 }} />
                                        <ListItemText
                                            primary={file.name}
                                            secondary={`${(file.size / 1024).toFixed(2)} KB`}
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: '200px',
                                            }}
                                        />
                                    </ListItem>
                                </Box>
                            ))}
                        </List>
                    </Grid>

                    <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 2 }}>
                        <IconButton onClick={onBack}>
                            <UndoIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UploadedWindow;
