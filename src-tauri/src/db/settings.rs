use crate::db::queries::{
    INSERT_SETTING, GET_SETTING, SET_SETTING, LIST_SETTINGS
};

use std::collections::HashMap;

use rusqlite::{params, Connection, Result}; // Import the Note struct

pub fn insert_initial_settings(conn: &Connection) -> Result<()> {
    let initial_settings = vec![
        // theme
        ("theme", "dark"),
        // editor
        ("vim", "false"),
        ("line_numbers", "false"),
        ("highlight_active_line", "false"),
        ("line_wrapping", "true"),
        ("unordered_list_bullet", "*"),
        ("indent_unit", "4"),
        ("tab_size", "4"),
        ("font_size", "16"),
        (
            "font_family",
            r#"SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace"#,
        ),
        ("font_weight", "normal"),
        ("line_height", "1.5"),
        // profile
        ("npub", ""),
        ("nsec", ""),
        // relays
        ("relays", "[\"relay.damus.io\", \"nos.lol\"]"),

    ];

    for (key, value) in initial_settings {
        conn.execute(
            INSERT_SETTING,
            params![key, value],
        )?;
    }

    Ok(())
}

pub fn get_setting(conn: &Connection, key: &str) -> Result<String> {
    let mut stmt = conn.prepare(GET_SETTING)?;
    stmt.query_row(params![key], |row| Ok(row.get(0)?))
}

pub fn set_setting(conn: &Connection, key: &str, value: &str) -> Result<()> {
    conn.execute(
        SET_SETTING,
        params![key, value],
    )?;

    Ok(())
}

pub fn get_all_settings(conn: &Connection) -> Result<HashMap<String, String>> {
    let mut stmt = conn.prepare(LIST_SETTINGS)?;
    let settings_iter = stmt.query_map(params![], |row| {
        let key: String = row.get(0)?;
        let value: String = row.get(1)?;
        Ok((key, value))
    })?;

    let mut settings = HashMap::new();
    for setting in settings_iter {
        let (key, value) = setting?;
        settings.insert(key, value);
    }

    Ok(settings)
}
