; ==============================================================================
; POSTER PLOTTER STUDIO - OPENBUILDS CALIBRATED G-CODE
; Machine Profile: OpenBuilds ACRO / GRBL Plotter
; Participant: NJOOD 2 | Job ID: JOB-01
; Paper: 15.2 × 20.3 cm (6×8") (Vertical) (152x203mm) | Safe Margin: 15mm
; Machine Origin: Bottom-Left (0,0)
; Physical Jig Offset: X=0mm, Y=0mm
; Pen Actuation Mode: servo_pwm
; Total Pen Layers: 1 | Est Plot Time: 3m 10s
; Generated: 2026-11-05T21:40:36.430Z
; ==============================================================================

G21 ; Set units to millimeters
G90 ; Absolute positioning
G94 ; Units per minute feedrate
G17 ; XY plane select
M5 S0 ; Ensure pen is safely raised
G0 F6000 ; Set rapid travel feedrate
G1 F3000 ; Set default draw feedrate

; ------------------------------------------------------------------------------
; START LAYER 1: Cobalt Blue (#0284c7) - 1 toolpath(s)
; ------------------------------------------------------------------------------
G0 X67.7 Y87.8
M3 S500
G4 P0.20
G1 X73.413 Y87.3
G1 X78.952 Y85.816
G1 X84.15 Y83.392
G1 X88.848 Y80.103
G1 X92.903 Y76.048
G1 X96.192 Y71.35
G1 X98.616 Y66.152
G1 X100.1 Y60.613
G1 X100.6 Y54.9
G1 X100.1 Y49.187
G1 X98.616 Y43.648
G1 X96.192 Y38.45
G1 X92.903 Y33.752
G1 X88.848 Y29.697
G1 X84.15 Y26.408
G1 X78.952 Y23.984
G1 X73.413 Y22.5
G1 X67.7 Y22
G1 X61.987 Y22.5
G1 X56.448 Y23.984
G1 X51.25 Y26.408
G1 X46.552 Y29.697
G1 X42.497 Y33.752
G1 X39.208 Y38.45
G1 X36.784 Y43.648
G1 X35.3 Y49.187
G1 X34.8 Y54.9
G1 X35.3 Y60.613
G1 X36.784 Y66.152
G1 X39.208 Y71.35
G1 X42.497 Y76.048
G1 X46.552 Y80.103
G1 X51.25 Y83.392
G1 X56.448 Y85.816
G1 X61.987 Y87.3
G1 X67.7 Y87.8
G1 X41.4 Y35.133
G1 X41.4 Y74.667
G1 X48 Y81.25
G1 X48 Y28.55
G1 X54.6 Y24.721
G1 X54.6 Y85.079
G1 X61.2 Y87.152
G1 X61.2 Y22.648
G1 X67.8 Y22
G1 X67.8 Y87.8
G1 X74.4 Y87.111
G1 X74.4 Y22.689
G1 X81 Y24.808
G1 X81 Y84.992
G1 X87.6 Y81.099
G1 X87.6 Y28.701
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