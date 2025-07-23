// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{WindowEvent, Emitter}; 

// #[tauri::command] 
// fn exit_app() {
//     std::process::exit(0); 
// }

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        // .invoke_handler(tauri::generate_handler![
        //     exit_app
        // ])
        // .on_window_event(|window, event| match event {
        //     WindowEvent::CloseRequested {api, ..} => {
        //         api.prevent_close(); 

        //         window.emit("app-closing", ()).unwrap(); 
        //     }
        //     _ => {}
        // })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

