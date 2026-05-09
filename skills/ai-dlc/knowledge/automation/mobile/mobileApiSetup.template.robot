*** Settings ***
Documentation    TEMPLATE: Hybrid Strategy (API Setup)
...              Using Python Services to seed data before UI interaction.
...              See: tests/shared-fixtures/ for data structure.
Library          ../../../helpers/shared-services/api_service.py    # Example relative path

*** Keywords ***
Setup Test State Via API
    [Arguments]    ${test_id}    ${data_file}
    [Documentation]    Primary hybrid pattern: Seed DB/State via API before starting Mobile test.
    ...               testId is used for isolation and cleanup.
    Log    Seeding data for ${test_id} using ${data_file}
    ${response}    Seed Data Through Service    ${test_id}    ${data_file}
    Should Be True    ${response.status}    API Setup failed for ${test_id}

Cleanup Test State Via API
    [Arguments]    ${test_id}
    [Documentation]    Clean up generated data to maintain environment hygiene.
    Log    Cleaning up data for ${test_id}
    Delete Data Through Service    ${test_id}

Reset Application State
    [Documentation]    Completely resets the app to start from a clean slate (no cache/login).
    Reset Application
    # Usually followed by Login To Application
