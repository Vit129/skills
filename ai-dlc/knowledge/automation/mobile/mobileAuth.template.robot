*** Settings ***
Documentation    TEMPLATE: Standard Mobile Authentication (Android/iOS)
...              This template provides reusable keywords for login and session handling.
Library          AppiumLibrary

*** Variables ***
${LOGIN_TIMEOUT}    15s

*** Keywords ***
Login To Application
    [Arguments]    ${username}    ${password}
    [Documentation]    Standard login flow that works for both platforms.
    ...               Note: Locators should be defined in Page Objects.
    Wait Until Page Contains Element    ${LOGIN_USERNAME_INPUT}    timeout=${LOGIN_TIMEOUT}
    Input Text      ${LOGIN_USERNAME_INPUT}    ${username}
    Input Text      ${LOGIN_PASSWORD_INPUT}    ${password}
    Click Element   ${LOGIN_SUBMIT_BUTTON}
    Wait Until Page Does Not Contain Element    ${LOGIN_SUBMIT_BUTTON}    timeout=${LOGIN_TIMEOUT}

Logout From Application
    [Documentation]    Logs out and verifies the login screen is displayed.
    Click Element    ${SIDE_MENU_BTN}
    Wait Until Page Contains Element    ${LOGOUT_MENU_ITEM}
    Click Element    ${LOGOUT_MENU_ITEM}
    Wait Until Page Contains Element    ${LOGIN_SUBMIT_BUTTON}

Login With Biometrics
    [Arguments]    ${status}=true
    [Documentation]    Abstracted biometric login. Implementation details in biometrics template.
    Click Element    ${BIOMETRIC_LOGIN_ICON}
    # Call platform specific biometric simulation from experts template
    Simulate Biometric Fingerprint    ${status}

Verify Login Success
    [Documentation]    Validates that the user has successfully reached the dashboard.
    Wait Until Page Contains Element    ${DASHBOARD_HEADER}    timeout=${LOGIN_TIMEOUT}
    Element Should Be Visible           ${DASHBOARD_HEADER}
