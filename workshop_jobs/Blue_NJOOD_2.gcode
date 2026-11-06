; ==============================================================================
; POSTER PLOTTER STUDIO - OPENBUILDS CALIBRATED G-CODE
; Machine Profile: OpenBuilds ACRO / GRBL Plotter
; Participant: NJOOD 2 | Job ID: JOB-03
; Paper: 15.2 × 20.3 cm (6×8") (Vertical) (152x203mm) | Safe Margin: 12mm
; Machine Origin: Bottom-Left (0,0)
; Physical Jig Offset: X=0mm, Y=0mm
; Pen Actuation Mode: servo_pwm
; Total Pen Layers: 1 | Est Plot Time: 3m 10s
; Generated: 2026-11-05T22:00:21.448Z
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
G0 X87.8 Y135.3
M3 S500
G4 P0.20
G1 X87.3 Y129.587
G1 X85.816 Y124.048
G1 X83.392 Y118.85
G1 X80.103 Y114.152
G1 X76.048 Y110.097
G1 X71.35 Y106.808
G1 X66.152 Y104.384
G1 X60.613 Y102.9
G1 X54.9 Y102.4
G1 X49.187 Y102.9
G1 X43.648 Y104.384
G1 X38.45 Y106.808
G1 X33.752 Y110.097
G1 X29.697 Y114.152
G1 X26.408 Y118.85
G1 X23.984 Y124.048
G1 X22.5 Y129.587
G1 X22 Y135.3
G1 X22.5 Y141.013
G1 X23.984 Y146.552
G1 X26.408 Y151.75
G1 X29.697 Y156.448
G1 X33.752 Y160.503
G1 X38.45 Y163.792
G1 X43.648 Y166.216
G1 X49.187 Y167.7
G1 X54.9 Y168.2
G1 X60.613 Y167.7
G1 X66.152 Y166.216
G1 X71.35 Y163.792
G1 X76.048 Y160.503
G1 X80.103 Y156.448
G1 X83.392 Y151.75
G1 X85.816 Y146.552
G1 X87.3 Y141.013
G1 X87.8 Y135.3
G1 X35.133 Y161.6
G1 X74.667 Y161.6
G1 X81.25 Y155
G1 X28.55 Y155
G1 X24.721 Y148.4
G1 X85.079 Y148.4
G1 X87.152 Y141.8
G1 X22.648 Y141.8
G1 X22 Y135.2
G1 X87.8 Y135.2
G1 X87.111 Y128.6
G1 X22.689 Y128.6
G1 X24.808 Y122
G1 X84.992 Y122
G1 X81.099 Y115.4
G1 X28.701 Y115.4
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