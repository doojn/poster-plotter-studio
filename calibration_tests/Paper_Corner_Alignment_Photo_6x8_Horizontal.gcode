; ==============================================================================
; POSTER PLOTTER STUDIO - PHYSICAL PAPER & MARGIN CORNER TEST
; Pen stays RAISED 5mm. First checks the 4 physical edges of your sheet,
; then checks the 4 inner safe margin corners.
; Paper: 15.2x20.3cm Photo Paper (Horizontal Bed) (203 x 152 mm Horizontal Bed) | Safe Margin: 12 mm
; Machine Origin: Bottom-Left (0,0)
; ==============================================================================
G21 ; Millimeters
G90 ; Absolute coordinates
M5 S0 ; Pen Up (No ink)
G0 X0 Y0 F6000 ; Home (0,0)

; --- PART 1: PHYSICAL SHEET OUTER CORNERS (0mm Edge of Paper) ---
; Physical Bottom-Left: X=0, Y=0
G0 X0 Y0
G4 P1.5
; Physical Bottom-Right: X=203, Y=0
G0 X203 Y0
G4 P1.5
; Physical Top-Right: X=203, Y=152
G0 X203 Y152
G4 P2.0 ; Check if pen reaches back-right edge of sheet
; Physical Top-Left: X=0, Y=152
G0 X0 Y152
G4 P2.0 ; Check if pen reaches back-left edge of sheet

; --- PART 2: INNER SAFE PRINTABLE MARGINS (12mm inside sheet) ---
; Margin Bottom-Left: X=12, Y=12
G0 X12 Y12
G4 P1.5
; Margin Bottom-Right: X=191, Y=12
G0 X191 Y12
G4 P1.5
; Margin Top-Right: X=191, Y=140
G0 X191 Y140
G4 P1.5
; Margin Top-Left: X=12, Y=140
G0 X12 Y140
G4 P1.5

; Return to Machine Origin
G0 X0 Y0
M2 ; Test Completed