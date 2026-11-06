; ==============================================================================
; POSTER PLOTTER STUDIO - OPENBUILDS CALIBRATED G-CODE
; Machine Profile: OpenBuilds ACRO / GRBL Plotter
; Participant: Sarah | Job ID: JOB-01
; Paper: 15.2x20.3cm (152x203mm) | Safe Margin: 12mm
; Machine Origin: Bottom-Left (0,0)
; Physical Jig Offset: X=0mm, Y=0mm
; Pen Actuation Mode: servo_pwm
; Total Pen Layers: 1 | Est Plot Time: N/A
; Generated: 2026-11-05T21:49:40.116Z
; ==============================================================================

G21 ; Set units to millimeters
G90 ; Absolute positioning
G94 ; Units per minute feedrate
G17 ; XY plane select
M5 S0 ; Ensure pen is safely raised
G0 F6000 ; Set rapid travel feedrate
G1 F3000 ; Set default draw feedrate

; ------------------------------------------------------------------------------
; START LAYER 1: Crimson Red (#e11d48) - 1 toolpath(s)
; ------------------------------------------------------------------------------
G0 X30 Y70
M3 S500
G4 P0.20
G1 X30 Y90
G1 X90 Y90
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