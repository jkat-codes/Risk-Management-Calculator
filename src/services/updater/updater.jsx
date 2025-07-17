import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { getVersion } from '@tauri-apps/api/app'; 
import { toast } from "react-toastify";
import React, { useState, useEffect } from 'react';

const Updater = () => {
    const [isChecking, setisChecking] = useState(false);

    const checkForUpdates = async () => {
        if (isChecking) {
            return; 
        }
        try {
            setisChecking(true);
            console.log("Checking for updates...");

            const update = await check();

            console.log(update); 

            if (update) {
                const currentVersion = await getVersion();
                console.log(`Current version: ${currentVersion}, Available version: ${update.version}`); 
                console.log(`Found update ${update.version} from ${update.date} with notes ${update.body}`);

                if (update.version !== currentVersion) {
                    let downloaded = 0;
                    let contentLength = 0;

                    toast.info(`Update ${update.version} available! Downloading...`, {
                        position: 'top-right', 
                        style: {
                            position: "absolute", 
                            top: "100px", 
                            right: "20px"
                        }
                    }); 

                    await update.downloadAndInstall((event) => {
                        switch (event.event) {
                            case "Started":
                                contentLength = event.data.contentLength;
                                console.log(`Started downloading ${event.data.contentLength} bytes`);
                                break;
                            case "Progress":
                                downloaded += event.data.chunkLength;
                                console.log(`Downloaded ${downloaded} from ${contentLength}`);
                                break;
                            case "Finished":
                                console.log("Download finished!");
                                break;
                        }
                    });

                    // Serve toast here
                    toast.success("Update downloaded!", {
                        position: "top-right",
                        style: {
                            position: "absolute",
                            top: "100px",
                            right: "20px"
                        }
                    })
                    await relaunch();
                }

                
            } else {
                console.log("No updates available.");
                toast.info("App is up to date!", {
                    position: 'top-right', 
                    style: {
                        position: "absolute", 
                        top: "100px", 
                        right: "20px"
                    }
                }); 
            }
        } catch (error) {
            console.log("Update check failed: ", error);
            console.log("Error message: ", error.message); 
            console.log("Error stack: ", error.stack); 
            toast.warn(`Update check failed: ${error}`, {
                position: "top-right",
                style: {
                    position: "absolute",
                    top: "100px",
                    right: "20px"
                }
            })
        } finally {
            setisChecking(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            checkForUpdates();
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return null; 
}

export default Updater; 