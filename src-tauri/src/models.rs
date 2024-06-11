use std::sync::{Arc, Mutex};

use chrono::{DateTime, Utc};
use rusqlite::Connection;
use serde::{Deserialize, Serialize};

pub struct DBConn(pub Arc<Mutex<Connection>>);

// response
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub enum APIResponse<T> {
    Data(Option<T>),
    Error(String),
}

// Notes
#[derive(Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum NoteFilter {
    All,
    Trashed,
    // Archived,
    // Saved,
}

#[derive(Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum NoteStatus {
    Active,
    Completed,
    Pending,
    Published,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ListNotesRequest {
    pub filter: NoteFilter,
    pub page: u32,
    pub page_size: u32,
    pub tag_id: Option<i64>,
    pub search: Option<String>,
    pub sort_by: Option<String>,
    pub status: Option<NoteStatus>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ListTagsRequest {
    pub note_id: Option<i64>,
}

#[derive(Deserialize)]
pub struct CreateNoteRequest {
    pub content: String,
}

#[derive(Deserialize)]
pub struct UpdateNoteRequest {
    pub id: i64,
    pub content: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Note {
    pub id: i64,
    pub content: String,
    pub created_at: DateTime<Utc>,
    pub modified_at: Option<DateTime<Utc>>,
    pub trashed_at: Option<DateTime<Utc>>,
}

// Tags
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateTagRequest {
    pub name: String,
    pub color: String,
    pub icon: String,
    pub note_id: Option<i64>,
}

#[derive(Deserialize)]
pub struct UpdateTagRequest {
    pub id: i64,
    pub name: String,
    pub color: String,
    pub icon: String,
}

#[derive(Deserialize)]
// add debug to print the struct
#[derive(Debug)]
pub struct GetTagRequest {
    pub id: Option<i64>,
    pub name: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Tag {
    pub id: i64,
    pub name: String,
    pub color: String,
    pub icon: String,
    pub created_at: DateTime<Utc>,
}

// Note Tags
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
#[derive(Debug)]
pub struct TagNoteRequest {
    pub note_id: i64,
    pub tag_id: i64,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NoteItemContextMenuRequest {
    pub id: i64,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TagItemContextMenuRequest {
    pub id: i64,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NoteTagItemContextMenuRequest {
    pub note_id: i64,
    pub tag_id: i64,
}

#[derive(Deserialize)]
pub enum MenuKind {
    NoteItem(NoteItemContextMenuRequest),
    TagItem(TagItemContextMenuRequest),
    NoteTag(NoteTagItemContextMenuRequest),
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContextMenuRequest {
    pub menu_kind: MenuKind,
}

#[derive(Debug)]
pub struct ContextMenuState{
    pub note_id: Option<i64>,
    pub tag_id: Option<i64>,
}

#[derive(Debug)]
pub struct ContextMenuTagItemId(pub i64);

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
#[derive(Debug)]
pub struct NoteItemContextMenuEvent {
    pub id: i64,
    pub event_kind: String,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
#[derive(Debug)]
pub struct TagItemContextMenuEvent {
    pub id: i64,
    pub event_kind: String,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
#[derive(Debug)]
pub struct NoteTagItemContextMenuEvent {
    pub note_id: i64,
    pub tag_id: i64,
    pub event_kind: String,
}

#[derive(Serialize, Clone)]
#[derive(Debug)]
pub enum ContextMenuEventKind {
    NoteItem(NoteItemContextMenuEvent),
    TagItem(TagItemContextMenuEvent),
    NoteTag(NoteTagItemContextMenuEvent),
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
#[derive(Debug)]
pub struct ContextMenuEvent {
    pub context_menu_event_kind: ContextMenuEventKind,
}
