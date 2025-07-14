import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { toast } from "react-toastify";
import React, { useState, useEfect, useEffect } from 'react';

const Updater = () => {
    const [isChecking, setisChecking] = useState(false);

    const checkForUpdates = async () => {
        try {
            setisChecking(true);
            console.log("Checking for updates...");

            const update = await check();

            if (update) {
                console.log(`Found update ${update.version} from ${update.date} with notes ${update.body}`);


                let downloaded = 0;
                let contentLength = 0;

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
            } else {
                console.log("No updates available.");
            }
        } catch (error) {
            console.log("Update check failed: ", error);
            toast.error(`Update check failed: ${error}`, {
                position: "top-right",
                style: {
                    position: "absolute",
                    top: "100px",
                    right: "20px",
                    color: "#ff6b6b"
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
}

export default Updater; 