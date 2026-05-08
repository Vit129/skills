*** Settings ***
Documentation    TEMPLATE: Mobile App Life-cycle Management
...              Handling Application Open, Install, Close, and Reset.
...              Relies on environment variables for capabilities.
Library          AppiumLibrary

*** Keywords ***
Open Application Platform
    [Arguments]    ${platform}    ${app_path}=None
    [Documentation]    Opens the application with standardized capabilities.
    ...               Fetches environment-specific config from .env files.
    IF    '${platform.lower()}' == 'android'
        Open Application    ${APPIUM_SERVER}
        ...    platformName=Android
        ...    deviceName=${ANDROID_DEVICE_NAME}
        ...    appPackage=${ANDROID_APP_PACKAGE}
        ...    appActivity=${ANDROID_APP_ACTIVITY}
        ...    automationName=UiAutomator2
        ...    noReset=${NO_RESET}
        ...    fullReset=${FULL_RESET}
        ...    app=${app_path}
    ELSE IF    '${platform.lower()}' == 'ios'
        Open Application    ${APPIUM_SERVER}
        ...    platformName=iOS
        ...    deviceName=${IOS_DEVICE_NAME}
        ...    platformVersion=${IOS_VERSION}
        ...    bundleId=${IOS_BUNDLE_ID}
        ...    automationName=XCUITest
        ...    udid=${IOS_UDID}
        ...    noReset=${NO_RESET}
        ...    app=${app_path}
    END

Launch App From Current State
    [Documentation]    Launches the app without reinstalling if valid session exists.
    Launch Application

Reset App To Factory State
    [Documentation]    Clears all app data and starts fresh.
    Reset Application

Terminate And Relaunch
    [Arguments]    ${bundle_id_or_package}
    [Documentation]    Hard close and restart the app.
    Terminate Application    ${bundle_id_or_package}
    Activate Application     ${bundle_id_or_package}

Background App For Period
    [Arguments]    ${seconds}=5
    [Documentation]    Sends the app to background and brings it back after X seconds.
    Background Application    ${seconds}

Close Test Session
    [Documentation]    Closes the app and ends the Appium session.
    Close Application
