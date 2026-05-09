*** Settings ***
Documentation    TEMPLATE: Native System Handling
...              Managing OS-level dialogs, permissions, and system keys.
Library          AppiumLibrary

*** Keywords ***
Grant Permission If Requested
    [Documentation]    Auto-accept common system permissions (Location, Camera, etc.)
    # Android specific (Works for most OS versions)
    ${android_allow}    Run Keyword And Return Status    Element Should Be Visible    id=com.android.permissioncontroller:id/permission_allow_button
    IF    ${android_allow}    Click Element    id=com.android.permissioncontroller:id/permission_allow_button
    
    # iOS specific (Standard Allow button)
    ${ios_allow}    Run Keyword And Return Status    Element Should Be Visible    accessibility_id=Allow
    IF    ${ios_allow}    Click Element    accessibility_id=Allow

Handle Native Alert
    [Arguments]    ${action}=ACCEPT
    [Documentation]    Accept or Dismiss native OS alerts.
    IF    '${action}' == 'ACCEPT'
        Run Keyword And Ignore Error    Accept Alert
    ELSE
        Run Keyword And Ignore Error    Dismiss Alert
    END

Go Back Using System Key
    [Documentation]    Uses the physical/system back button (Android focus).
    # Android: Keycode 4 is Back
    Press Keycode    4
    
    # iOS Strategy: Usually requires tapping a 'Back' element or custom swipe gesture
    # Defined in Page Objects

Verify Keyboard Is Visible
    [Documentation]    Checks if the soft keyboard is currently displayed.
    Keyboard Should Be Shown
