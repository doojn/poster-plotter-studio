; ==============================================================================
; POSTER PLOTTER STUDIO - OPENBUILDS CALIBRATED G-CODE
; Machine Profile: OpenBuilds ACRO / GRBL Plotter
; Participant: Sarah | Job ID: JOB-01
; Paper: 15.2x20.3cm (152x203mm) | Safe Margin: 12mm
; Machine Origin: Bottom-Left (0,0)
; Physical Jig Offset: X=0mm, Y=0mm
; Pen Actuation Mode: servo_pwm
; Total Pen Layers: 3 | Est Plot Time: N/A
; Generated: 2026-11-05T21:49:40.117Z
; ==============================================================================

G21 ; Set units to millimeters
G90 ; Absolute positioning
G94 ; Units per minute feedrate
G17 ; XY plane select
M5 S0 ; Ensure pen is safely raised
G0 F6000 ; Set rapid travel feedrate
G1 F3000 ; Set default draw feedrate

; --- SETUP PEN 1 ---
G0 X10 Y10 F6000 ; Move to front parking point
M0 (TOOL SETUP: Load Pen 1 - Midnight Black. Click RESUME to begin)
G4 P0.5 ; Dwell after resume

; ------------------------------------------------------------------------------
; START LAYER 1: Midnight Black (#111827) - 1 toolpath(s)
; ------------------------------------------------------------------------------
G0 X20 Y20
M3 S500
G4 P0.20
G1 X20 Y60
G1 X80 Y60
M5 S0
G4 P0.20
; --- LAYER 1 FINISHED ---

; ------------------------------------------------------------------------------
; TOOL CHANGE PAUSE: Prepare for Layer 2
; ------------------------------------------------------------------------------
M5 S0
G0 X10 Y10 F6000 ; Park at front for easy marker swap
M0 (TOOL CHANGE: Swap to Pen 2 - Crimson Red. Adjust height & click RESUME)
G4 P0.8 ; Settle delay after resume

; ------------------------------------------------------------------------------
; START LAYER 2: Crimson Red (#e11d48) - 1 toolpath(s)
; ------------------------------------------------------------------------------
G0 X30 Y70
M3 S500
G4 P0.20
G1 X30 Y90
G1 X90 Y90
M5 S0
G4 P0.20
; --- LAYER 2 FINISHED ---

; ------------------------------------------------------------------------------
; TOOL CHANGE PAUSE: Prepare for Layer 3
; ------------------------------------------------------------------------------
M5 S0
G0 X10 Y10 F6000 ; Park at front for easy marker swap
M0 (TOOL CHANGE: Swap to Pen 3 - Cobalt Blue. Adjust height & click RESUME)
G4 P0.8 ; Settle delay after resume

; ------------------------------------------------------------------------------
; START LAYER 3: Cobalt Blue (#0284c7) - 1 toolpath(s)
; ------------------------------------------------------------------------------
G0 X40 Y100
M3 S500
G4 P0.20
G1 X40 Y130
G1 X100 Y130
M5 S0
G4 P0.20
; --- LAYER 3 FINISHED ---

; ==============================================================================
; PLOT COMPLETE
; ==============================================================================
M5 S0
G0 X0 Y0 F6000 ; Return to home / jig zero
M5 S0 ; Ensure spindle PWM is completely off
M2 ; Program End