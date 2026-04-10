*** Settings ***
Documentation    TEMPLATE: Advanced Deep Linking
...              Used for fast navigation to specific app screens without UI traversal.
Library          AppiumLibrary

*** Keywords ***
Open App Via Deep Link
    [Arguments]    ${url}
    [Documentation]    Navigates directly to a screen using a URI scheme (e.g. myapp://booking/123)
    ...               Extremely useful for bypassing multi-step setup flows.
    
    # Android Strategy
    Execute Adb Shell    am start -W -a android.intent.action.VIEW -d "${url}"
    
    # iOS Strategy (Requires Safari or custom implementation via xcrun simctl)
    # Background app -> Safari -> Open URL -> Confirm 'Open in MyApp'
    Log    Opening deep link: ${url}
    
Navigate To Feature Screen
    [Arguments]    ${feature_path}
    [Documentation]    Wrapper for semantic deep linking.
    ${base_url}    Get Environment Variable    DEEP_LINK_BASE
    Open App Via Deep Link    ${base_url}/${feature_path}
