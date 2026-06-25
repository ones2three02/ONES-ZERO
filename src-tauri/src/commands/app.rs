use serde::Serialize;

#[derive(Serialize)]
pub struct AppInfo {
    name: String,
    version: String,
    description: String,
}

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You are currently interacting with the modular Rust backend of ONES-ZERO.", name)
}

#[tauri::command]
pub fn get_app_info() -> AppInfo {
    AppInfo {
        name: "ONES-ZERO".to_string(),
        version: "1.0.0".to_string(),
        description: "A beautiful clean template framework desktop application".to_string(),
    }
}
