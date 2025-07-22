// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{Manager, WindowEvent, Emitter}; 

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .on_window_event(|window, event| match event {
            WindowEvent::CloseRequested {api, ..} => {
                api.prevent_close(); 

                window.emit("app-closing", ()).unwrap(); 
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
