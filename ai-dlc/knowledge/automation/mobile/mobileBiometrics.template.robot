*** Settings ***
Documentation    TEMPLATE: Expert Biometrics Simulation
...              Simulating FaceID/Fingerprint for authentication tests.
Library          AppiumLibrary

*** Keywords ***
Simulate Biometric Success
    [Documentation]    Triggers a 'Match' event for biometrics.
    # iOS (Simulator)
    Execute Script    mobile:enrollBiometric    isEnabled=True
    Execute Script    mobile:sendBiometricMatch    type=faceid    match=True
    
    # Android (Emulator)
    Execute Adb Shell    fingerprint enroll 1
    Execute Adb Shell    fingerprint verify 1

Simulate Biometric Failure
    [Documentation]    Triggers a 'Non-Match' event for biometrics.
    # iOS (Simulator)
    Execute Script    mobile:sendBiometricMatch    type=faceid    match=False
    
    # Android (Emulator)
    Execute Adb Shell    fingerprint verify 0

Enroll Device Biometrics
    [Documentation]    Enable biometric capability on virtual device.
    # Path depends on Appium version and platform
    Log    Enrolling biometrics on virtual device
