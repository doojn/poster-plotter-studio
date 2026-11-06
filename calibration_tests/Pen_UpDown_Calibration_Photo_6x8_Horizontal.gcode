; ==============================================================================
; OPENBUILDS PEN UP / PEN DOWN CALIBRATION TEST
; Standardized for OpenBuilds CONTROL & GRBL CNC Pen Plotters
; Paper: 15.2x20.3cm Photo Paper (Horizontal Bed) (203 x 152 mm) | Safe Margins: 12 mm
; Origin: Bottom-Left (0,0) Standard CNC Work Coordinate System
; Actuation: servo_pwm | Draw Feed: 3000 mm/min | Travel Feed: 6000 mm/min
; Servo-Safe: Low lift frequency & gentle dwells prevent motor overheating
; ==============================================================================
G21 ; Set units to millimeters
G90 ; Set positioning to absolute coordinates
M5 S0 ; Safe initial pen raise
G0 X0 Y0 F6000 ; Start at Machine Origin (0,0)

; ------------------------------------------------------------------------------
; STAGE 1: STATIC HEIGHT & CONTACT HOLD (Position X=59.00, Y=41.00)
; Use this 3-second hold to check that your pen tip firmly touches paper
; without deflecting the carriage or stalling the servo motor.
; ------------------------------------------------------------------------------
G0 X59.00 Y41.00 F6000
G4 P1.0 ; Settle
; --- PEN DOWN ---
M3 S500
G4 P0.20
G4 P3.0 ; HOLD DOWN: Verify pen tip pressure & ink contact
; --- PEN UP ---
M5 S0
G4 P0.20
G4 P2.0 ; HOLD UP: Verify 3-5mm clearance gap above paper

; ------------------------------------------------------------------------------
; STAGE 2: TRAVEL CLEARANCE & DRAG TEST (3x 25mm Lines separated by 15mm Gaps)
; Inspect the 15mm gaps: They MUST be clean paper with ZERO ink dragging.
; If you see tails or drag lines: Increase penUpZ / check pen holder tightness.
; ------------------------------------------------------------------------------
; Line 1: 49 to 74
G0 X49.00 Y61.00 F6000
M3 S500
G4 P0.20
G1 X74.00 Y61.00 F3000
M5 S0
G4 P0.20
; Gap 1 (15mm Rapid Travel with Pen UP - Must be clean):
G0 X89.00 Y61.00 F6000
; Line 2: 89 to 114
M3 S500
G4 P0.20
G1 X114.00 Y61.00 F3000
M5 S0
G4 P0.20
; Gap 2 (15mm Rapid Travel with Pen UP - Must be clean):
G0 X129.00 Y61.00 F6000
; Line 3: 129 to 154
M3 S500
G4 P0.20
G1 X154.00 Y61.00 F3000
M5 S0
G4 P0.20

; ------------------------------------------------------------------------------
; STAGE 3: STACCATO TAP & DWELL TEST (4 Precision Dots)
; Tests servo down/up timing. Dots must be crisp circles, NOT commas or slashes.
; ------------------------------------------------------------------------------
; Dot 1:
G0 X59.00 Y81.00 F6000
M3 S500
G4 P0.20
G4 P0.25 ; Ink transfer dwell
M5 S0
G4 P0.20
; Dot 2:
G0 X84.00 Y81.00 F6000
M3 S500
G4 P0.20
G4 P0.25 ; Ink transfer dwell
M5 S0
G4 P0.20
; Dot 3:
G0 X109.00 Y81.00 F6000
M3 S500
G4 P0.20
G4 P0.25 ; Ink transfer dwell
M5 S0
G4 P0.20
; Dot 4:
G0 X134.00 Y81.00 F6000
M3 S500
G4 P0.20
G4 P0.25 ; Ink transfer dwell
M5 S0
G4 P0.20

; ------------------------------------------------------------------------------
; STAGE 4: CONTINUOUS CONTOUR & DIAGONAL HATCH BOX (25x25mm)
; Evaluates corner squareness, continuous lines, and internal diagonal lifts.
; ------------------------------------------------------------------------------
; Box Perimeter:
G0 X49.00 Y96.00 F6000
M3 S500
G4 P0.20
G1 X74.00 Y96.00 F3000
G1 X74.00 Y121.00 F3000
G1 X49.00 Y121.00 F3000
G1 X49.00 Y96.00 F3000
M5 S0
G4 P0.20
; Diagonal Hatch 1:
G0 X54.00 Y96.00 F6000
M3 S500
G4 P0.20
G1 X74.00 Y116.00 F3000
M5 S0
G4 P0.20
; Diagonal Hatch 2:
G0 X49.00 Y101.00 F6000
M3 S500
G4 P0.20
G1 X69.00 Y121.00 F3000
M5 S0
G4 P0.20

; ------------------------------------------------------------------------------
; STAGE 5: PRECISION CROSSHAIR & TARGET MARK (+)
; Checks alignment repeatability and center dot registration.
; ------------------------------------------------------------------------------
; Crosshair Horizontal:
G0 X104.00 Y108.50 F6000
M3 S500
G4 P0.20
G1 X124.00 Y108.50 F3000
M5 S0
G4 P0.20
; Crosshair Vertical:
G0 X114.00 Y98.50 F6000
M3 S500
G4 P0.20
G1 X114.00 Y118.50 F3000
M5 S0
G4 P0.20
; Center Target Dot:
G0 X114.00 Y108.50 F6000
M3 S500
G4 P0.20
G4 P0.25 ; Ink transfer dwell
M5 S0
G4 P0.20

; ------------------------------------------------------------------------------
; STAGE 6: FINISH & RETURN TO MACHINE HOME
; ------------------------------------------------------------------------------
M5 S0 ; Raise pen safe
G0 X0 Y0 F6000 ; Return to origin
M2 ; Calibration Test Complete