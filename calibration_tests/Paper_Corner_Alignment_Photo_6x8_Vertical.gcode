; ==============================================================================
; POSTER PLOTTER STUDIO - PHYSICAL PAPER & MARGIN CORNER TEST
; Pen stays RAISED 5mm. First checks the 4 physical edges of your sheet,
; then checks the 4 inner safe margin corners.
; Paper: Photo 6x8in (15.2x20.3cm Vertical) (152 x 203 mm Horizontal / Landscape) | Safe Margin: 12 mm
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
; Physical Bottom-Right: X=152, Y=0
G0 X152 Y0
G4 P1.5
; Physical Top-Right: X=152, Y=203
G0 X152 Y203
G4 P2.0 ; Check if pen reaches back-right edge of sheet
; Physical Top-Left: X=0, Y=203
G0 X0 Y203
G4 P2.0 ; Check if pen reaches back-left edge of sheet

; --- PART 2: INNER SAFE PRINTABLE MARGINS (12mm inside sheet) ---
; Margin Bottom-Left: X=12, Y=12
G0 X12 Y12
G4 P1.5
; Margin Bottom-Right: X=140, Y=12
G0 X140 Y12
G4 P1.5
; Margin Top-Right: X=140, Y=191
G0 X140 Y191
G4 P1.5
; Margin Top-Left: X=12, Y=191
G0 X12 Y191
G4 P1.5

; Return to Machine Origin
G0 X0 Y0
M2 ; Test Completed