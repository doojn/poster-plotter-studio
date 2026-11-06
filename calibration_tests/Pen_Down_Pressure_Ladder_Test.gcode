; ==============================================================================
; OPENBUILDS PEN DOWN PRESSURE LADDER TEST (SERVO ANGLE STEP TEST)
; Tests 5 different downward servo angles (S300 to S900).
; Find the lowest S-value that draws a clean line without pressing too hard!
; Paper: 15.2x20.3cm Photo Paper (Horizontal Bed) (203 x 152 mm) | Safe Margin: 12 mm
; Origin: Bottom-Left (0,0)
; ==============================================================================
G21 ; Millimeters
G90 ; Absolute coordinates
M5 S0 ; Safe initial pen raise
G0 X0 Y0 F6000 ; Start at origin

; --- STEP 1: S300 (Very Gentle / Feathery) ---
G0 X56.50 Y36.00 F6000 ; Rapid travel with Pen UP
M3 S300
G4 P0.20 ; Actuate servo down to S=300
G1 X106.50 Y36.00 F3000 ; Draw 50mm line
M5 S0
G4 P0.20 ; Lift pen UP

; --- STEP 2: S450 (Gentle / Light Touch) ---
G0 X56.50 Y51.00 F6000 ; Rapid travel with Pen UP
M3 S450
G4 P0.20 ; Actuate servo down to S=450
G1 X106.50 Y51.00 F3000 ; Draw 50mm line
M5 S0
G4 P0.20 ; Lift pen UP

; --- STEP 3: S600 (Medium / Balanced) ---
G0 X56.50 Y66.00 F6000 ; Rapid travel with Pen UP
M3 S600
G4 P0.20 ; Actuate servo down to S=600
G1 X106.50 Y66.00 F3000 ; Draw 50mm line
M5 S0
G4 P0.20 ; Lift pen UP

; --- STEP 4: S750 (Firm) ---
G0 X56.50 Y81.00 F6000 ; Rapid travel with Pen UP
M3 S750
G4 P0.20 ; Actuate servo down to S=750
G1 X106.50 Y81.00 F3000 ; Draw 50mm line
M5 S0
G4 P0.20 ; Lift pen UP

; --- STEP 5: S900 (Deep / Heavy) ---
G0 X56.50 Y96.00 F6000 ; Rapid travel with Pen UP
M3 S900
G4 P0.20 ; Actuate servo down to S=900
G1 X106.50 Y96.00 F3000 ; Draw 50mm line
M5 S0
G4 P0.20 ; Lift pen UP

; --- COMPLETE & RETURN HOME ---
M5 S0
G0 X0 Y0 F6000
M2 ; Ladder Test Complete