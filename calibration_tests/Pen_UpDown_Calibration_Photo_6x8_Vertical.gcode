; ==============================================================================
; OPENBUILDS PEN UP / PEN DOWN CALIBRATION TEST
; Standardized for OpenBuilds CONTROL & GRBL CNC Pen Plotters
; Paper: Photo 6x8in (15.2x20.3cm Vertical) (152 x 203 mm) | Safe Margins: 12 mm
; Origin: Bottom-Left (0,0) Standard CNC Work Coordinate System
; Actuation: undefined | Draw Feed: 3000 mm/min | Travel Feed: 6000 mm/min
; Servo-Safe: Low lift frequency & gentle dwells prevent motor overheating
; ==============================================================================
G21 ; Set units to millimeters
G90 ; Set positioning to absolute coordinates
M5 S0 ; Safe initial pen raise
G0 X0 Y0 F6000 ; Start at Machine Origin (0,0)

; ------------------------------------------------------------------------------
; STAGE 1: STATIC HEIGHT & CONTACT HOLD (Position X=33.50, Y=66.50)
; Use this 3-second hold to check that your pen tip firmly touches paper
; without deflecting the carriage or stalling the servo motor.
; ------------------------------------------------------------------------------
G0 X33.50 Y66.50 F6000
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
; Line 1: 23.5 to 48.5
G0 X23.50 Y86.50 F6000
M3 S500
G4 P0.20
G1 X48.50 Y86.50 F3000
M5 S0
G4 P0.20
; Gap 1 (15mm Rapid Travel with Pen UP - Must be clean):
G0 X63.50 Y86.50 F6000
; Line 2: 63.5 to 88.5
M3 S500
G4 P0.20
G1 X88.50 Y86.50 F3000
M5 S0
G4 P0.20
; Gap 2 (15mm Rapid Travel with Pen UP - Must be clean):
G0 X103.50 Y86.50 F6000
; Line 3: 103.5 to 128.5
M3 S500
G4 P0.20
G1 X128.50 Y86.50 F3000
M5 S0
G4 P0.20

; ------------------------------------------------------------------------------
; STAGE 3: STACCATO TAP & DWELL TEST (4 Precision Dots)
; Tests servo down/up timing. Dots must be crisp circles, NOT commas or slashes.
; ------------------------------------------------------------------------------
; Dot 1:
G0 X33.50 Y106.50 F6000
M3 S500
G4 P0.20
G4 P0.25 ; Ink transfer dwell
M5 S0
G4 P0.20
; Dot 2:
G0 X58.50 Y106.50 F6000
M3 S500
G4 P0.20
G4 P0.25 ; Ink transfer dwell
M5 S0
G4 P0.20
; Dot 3:
G0 X83.50 Y106.50 F6000
M3 S500
G4 P0.20
G4 P0.25 ; Ink transfer dwell
M5 S0
G4 P0.20
; Dot 4:
G0 X108.50 Y106.50 F6000
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
G0 X23.50 Y121.50 F6000
M3 S500
G4 P0.20
G1 X48.50 Y121.50 F3000
G1 X48.50 Y146.50 F3000
G1 X23.50 Y146.50 F3000
G1 X23.50 Y121.50 F3000
M5 S0
G4 P0.20
; Diagonal Hatch 1:
G0 X28.50 Y121.50 F6000
M3 S500
G4 P0.20
G1 X48.50 Y141.50 F3000
M5 S0
G4 P0.20
; Diagonal Hatch 2:
G0 X23.50 Y126.50 F6000
M3 S500
G4 P0.20
G1 X43.50 Y146.50 F3000
M5 S0
G4 P0.20

; ------------------------------------------------------------------------------
; STAGE 5: PRECISION CROSSHAIR & TARGET MARK (+)
; Checks alignment repeatability and center dot registration.
; ------------------------------------------------------------------------------
; Crosshair Horizontal:
G0 X78.50 Y134.00 F6000
M3 S500
G4 P0.20
G1 X98.50 Y134.00 F3000
M5 S0
G4 P0.20
; Crosshair Vertical:
G0 X88.50 Y124.00 F6000
M3 S500
G4 P0.20
G1 X88.50 Y144.00 F3000
M5 S0
G4 P0.20
; Center Target Dot:
G0 X88.50 Y134.00 F6000
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