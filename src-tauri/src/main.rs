// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, Mutex};

mod services;
use services::NoteService;

use tauri::State;

mod db;

mod models;
mod utils;
use models::{APIResponse, CreateNoteRequest, DBConn, Note};

#[tauri::command]
fn create_note(
    create_note_request: CreateNoteRequest,
    note_service: State<'_, NoteService>,
) -> APIResponse<Note> {
    note_service.create_note(create_note_request)
}

#[tauri::command]
fn list_notes(note_service: State<'_, NoteService>) -> APIResponse<Vec<Note>> {
    note_service.list_notes()
}

fn main() {
    let conn = db::establish_connection().expect("Failed to connect to database");
    let db_conn = DBConn(Arc::new(Mutex::new(conn)));
    let note_service = NoteService::new(Arc::new(db_conn));

    tauri::Builder::default()
        // Here you manage the instantiated NoteService with the Tauri state
        .manage(note_service)
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![create_note, list_notes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
