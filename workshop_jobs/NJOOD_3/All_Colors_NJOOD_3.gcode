; ==============================================================================
; POSTER PLOTTER STUDIO - OPENBUILDS CALIBRATED G-CODE
; Machine Profile: OpenBuilds ACRO / GRBL Plotter
; Participant: NJOOD 3 | Job ID: JOB-01
; Paper: 15.2 × 20.3 cm (6×8") (Vertical) (152x203mm) | Safe Margin: 15mm
; Machine Origin: Bottom-Left (0,0)
; Physical Jig Offset: X=0mm, Y=0mm
; Pen Actuation Mode: servo_pwm
; Total Pen Layers: 1 | Est Plot Time: 12s
; Generated: 2026-11-05T22:06:31.742Z
; ==============================================================================

G21 ; Set units to millimeters
G90 ; Absolute positioning
G94 ; Units per minute feedrate
G17 ; XY plane select
M5 S0 ; Ensure pen is safely raised
G0 F6000 ; Set rapid travel feedrate
G1 F3000 ; Set default draw feedrate

; ------------------------------------------------------------------------------
; START LAYER 1: Midnight Black (#111827) - 6 toolpath(s)
; ------------------------------------------------------------------------------
G0 X43.237 Y73.091
M3 S500
G4 P0.20
G1 X47.496 Y73.647
G1 X50.336 Y73.755
M5 S0
G4 P0.20
G0 X58.855 Y72.766
M3 S500
G4 P0.20
G1 X60.275 Y72.452
G1 X63.115 Y71.751
G1 X65.955 Y71.005
G1 X67.375 Y70.635
G1 X68.794 Y70.278
G1 X70.214 Y69.94
G1 X69.007 Y67.759
G1 X78.946 Y65.913
G1 X91.725 Y66.725
M5 S0
G4 P0.20
G0 X94.565 Y46.366
M3 S500
G4 P0.20
G1 X64.747 Y42.184
G1 X56.228 Y39.978
M5 S0
G4 P0.20
G0 X68.794 Y48.795
M3 S500
G4 P0.20
G1 X67.375 Y48.521
G1 X38.977 Y42.292
G1 X24.779 Y40.37
M5 S0
G4 P0.20
G0 X33.511 Y66.25
M3 S500
G4 P0.20
G1 X34.93 Y66.607
G1 X36.35 Y67.008
G1 X37.77 Y67.442
M5 S0
G4 P0.20
G0 X44.869 Y61.334
M3 S500
G4 P0.20
G1 X73.267 Y61.412
G1 X121.542 Y59.021
M5 S0
G4 P0.20
; --- LAYER 1 FINISHED ---

; ==============================================================================
; PLOT COMPLETE
; ==============================================================================
M5 S0
G0 X0 Y0 F6000 ; Return to home / jig zero
M5 S0 ; Ensure spindle PWM is completely off
M2 ; Program End