*** Settings ***
Documentation    TEMPLATE: High-Reliability Mobile Gestures
...              Avoid using hardcoded coordinates. Use percentage-based scrolling for reliability.
Library          AppiumLibrary

*** Keywords ***
Scroll Down Until Text Is Visible
    [Arguments]    ${text}    ${retry}=5
    [Documentation]    Scrolls down the screen until a specific text is found.
    FOR    ${i}    IN RANGE    0    ${retry}
        ${status}    Run Keyword And Return Status    Element Should Be Visible    xpath=//*[contains(@text, "${text}")] or //*[@label="${text}"]
        IF    ${status}    BREAK
        Swipe By Percent    50    80    50    20    # From bottom to top
    END
    IF    not ${status}    Fail    Could not find text "${text}" after ${retry} scrolls.

Swipe Left On Element
    [Arguments]    ${locator}
    [Documentation]    Standard swipe left (e.g., to reveal delete button).
    ${rect}    Get Element Rect    ${locator}
    ${start_x}    Evaluate    ${rect['x']} + (${rect['width']} * 0.9)
    ${start_y}    Evaluate    ${rect['y']} + (${rect['height']} / 2)
    ${end_x}      Evaluate    ${rect['x']} + (${rect['width']} * 0.1)
    Swipe    ${start_x}    ${start_y}    ${end_x}    ${start_y}    500

Drag And Drop Element
    [Arguments]    ${source}    ${target}
    [Documentation]    Standard drag and drop between two locators.
    ${src_location}    Get Element Location    ${source}
    ${tgt_location}    Get Element Location    ${target}
    Swipe    ${src_location['x']}    ${src_location['y']}    ${tgt_location['x']}    ${tgt_location['y']}    1000

Pinch To Zoom Out
    [Arguments]    ${percentage}=20    ${steps}=20
    [Documentation]    Simulate two fingers pinching (zoom out).
    # AppiumLibrary specific or custom python helper
    Log    Pinching with ${percentage}% intensity
