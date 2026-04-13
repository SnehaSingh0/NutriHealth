# 🧪 Testing Guide - Upload Food Features

## Prerequisites
- Node.js 18+ installed
- Backend server running on port 5000
- Frontend dev server running on port 5173
- Chrome/Safari browser for best compatibility

## 🚀 Getting Started

### 1. Start Backend
```bash
cd backend
python app.py
```
Expected: API running on http://localhost:5000

### 2. Start Frontend  
```bash
cd project
npm run dev
```
Expected: App running on http://localhost:5173

### 3. Navigate to Features
- Login or Create Account
- Click "Upload Food" in navigation
- You should see the new AI-powered interface

## ✅ Test Cases

### Test 1: Image Upload & AI Detection
**Objective:** Verify AI recognition for multi-item meals

**Steps:**
1. Click "Capture Meal" section
2. Select "Click to upload" or take photo
3. Wait for AI analysis (1.5-2 seconds)
4. Verify detected foods appear with confidence scores

**Expected Results:**
- ✅ Image preview displays correctly
- ✅ AI detects 2-3 foods from image
- ✅ Confidence scores shown (50-95%)
- ✅ Quantity and unit auto-populated
- ✅ Nutrition values calculated

**Manual Test Case:**
- Open food image with mixed items
- AI should detect multiple components
- Verify quantities are reasonable
- Check confidence scores vary

---

### Test 2: Multi-Item Selection & Logging
**Objective:** Test checkbox selection and bulk logging

**Steps:**
1. After AI detection, verify checkboxes appear
2. Click checkboxes to select/deselect foods
3. Verify "Log Selected Foods" button appears
4. Click button to log all selected items
5. Check success message appears

**Expected Results:**
- ✅ Checkboxes toggle on/off
- ✅ Button only appears when items selected
- ✅ All selected foods added to today's log
- ✅ Success message shows count of logged foods
- ✅ Food history updates in real-time

**Edge Cases:**
- No items selected → Show error "Please select at least one food"
- All items deselected → Button disappears
- Duplicate foods → Each added separately

---

### Test 3: Manual Food Search
**Objective:** Test autocomplete and food selection

**Steps:**
1. In "Or Add Manually" section, search for foods:
   - Type "chapati" → Should find "Chapati"
   - Type "dal" → Should find "Dal Tadka"
   - Type "rice" → Should find "Rice (Cooked)", "Basmati Rice"
   - Type "pizza" → Should find "Pizza"
   - Type "xyz" → Should show "No results"

2. Select a food → Verify:
   - Default unit populates
   - Quantity field shows "100"
   - Available units dropdown updates

**Expected Results:**
- ✅ Autocomplete filters foods correctly
- ✅ Aliases work (e.g., "roti" → "Chapati")
- ✅ Case-insensitive search
- ✅ Maximum 10 results shown
- ✅ Selecting food updates all fields

**Foods to Test:**
- "Chapati" (default unit: pieces)
- "Rice (Cooked)" (default unit: grams)
- "Milk" (default unit: ml)
- "Egg" (default unit: pieces)
- "Pizza" (default unit: slices)

---

### Test 4: Unit Conversion
**Objective:** Verify unit system and calculations

**Steps:**
1. Select "Chapati" (pieces unit)
2. Verify unit dropdown shows: pieces, grams
3. Enter quantity: 2
4. Verify nutrition shows: ~310 cal per piece

5. Select "Milk" (ml unit)
6. Verify unit dropdown shows: ml, cup, glass
7. Enter quantity: 240 (cup)
8. Verify nutrition shows: ~146 cal (240ml)

9. Switch unit to "glass" (200ml)
10. Verify nutrition recalculates: ~122 cal

**Calculation Verification:**
```
Chapati: 50g per piece
- 1 piece = 155 cal
- 2 pieces = 310 cal ✓

Milk: 1ml = 0.61 cal
- 240ml (cup) = 146 cal ✓
- 200ml (glass) = 122 cal ✓
```

**Expected Results:**
- ✅ Unit options match food type
- ✅ Changing quantity updates nutrition
- ✅ Changing unit updates nutrition
- ✅ Decimals supported (1.5 pieces, 0.5 cups)
- ✅ Calculations accurate within 1%

---

### Test 5: Nutrition Dashboard
**Objective:** Test real-time nutrition tracking

**Steps:**
1. Log "Chapati" (2 pieces) → 310 cal
2. Log "Dal Tadka" (100g) → 102 cal
3. Verify nutrition dashboard:
   - Calories: 412/2000 (20%)
   - Carbs: ~40g
   - Protein: ~19g
   - Fats: ~4g

4. Log "Egg" (1 piece) → 155 cal
5. Verify totals update:
   - Calories: 567/2000 (28%)
   - Status: "Within recommended intake" (green)

6. Keep logging until >130% of goal
7. Verify status turns RED
8. Message: "✕ 132% of daily calorie goal - Exceeding by 32%"

**Expected Results:**
- ✅ Real-time nutrition calculation
- ✅ Calorie percentage accurate
- ✅ Macros displayed with decimals
- ✅ Color-coded sections (blue/yellow/red/orange)
- ✅ Status message updates with percentage
- ✅ Danger threshold at 130%

---

### Test 6: Weight Prediction
**Objective:** Test weight prediction accuracy

**Setup:**
- User profile: 70kg, goal 2000 kcal/day

**Tests:**
1. **Zero consumption (0 cal):**
   - Daily deficit: 2000 cal
   - 7-day: Should show ~0.18kg loss (69.82kg)
   - 30-day: Should show ~0.78kg loss (69.22kg)
   - Status: ↓ Trending down

2. **Maintenance (2000 cal):**
   - Daily deficit: 0 cal
   - 7-day: Should show no change (70kg)
   - 30-day: Should show no change (70kg)
   - Status: • Neutral

3. **Excess (3000 cal):**
   - Daily deficit: -1000 cal (surplus)
   - 7-day: Should show ~0.18kg gain (70.18kg)
   - 30-day: Should show ~0.78kg gain (70.78kg)
   - Status: ↑ Trending up

4. **Minimal effect (1950 cal):**
   - Daily deficit: 50 cal
   - 7-day: ~0.01kg loss < 0.2kg threshold
   - Flag: "ℹ️ This meal has minimal impact on weight change"

**Expected Results:**
- ✅ Predictions calculate correctly (±0.01kg)
- ✅ Trend indicators show correct direction
- ✅ Minimal effect flag shows when change < 0.2kg
- ✅ Formula: (deficit × 7) / 7700 for 7 days
- ✅ 30-day uses (deficit × 30) / 7700

---

### Test 7: Food History & Removal
**Objective:** Test food log management

**Steps:**
1. Log 3 foods:
   - Chapati (2 pieces)
   - Dal (100g)
   - Milk (200ml)

2. Verify "Today's Foods (3)" displays all items
3. Each shows: Name, quantity, nutrition breakdown
4. Click X button on "Dal"
5. Verify:
   - Dal removed from history
   - Count updates to "(2)"
   - Nutrition totals recalculate

6. Remove all foods
7. Verify empty state: "No foods logged yet..."

**Expected Results:**
- ✅ Foods display in reverse chronological order
- ✅ Nutrition breakdown accurate per food
- ✅ X button removes specific food
- ✅ History count updates
- ✅ Total nutrition recalculates instantly
- ✅ Empty state shows when no foods

---

### Test 8: Medical Conditions Integration
**Objective:** Test health profile aware recommendations

**Setup with Diabetes:**
- User has "Diabetes Type 2" in medical conditions
- Log high-carb meal (pizza, rice)

**Expected Results:**
- ✅ Health status shows warning if carbs > 40% of goal
- ✅ Message indicates: "⚠ High carbs detected - Consider for diabetes management"
- ✅ Color indicator turns yellow/red

---

### Test 9: Error Handling
**Objective:** Test error messages and recovery

**Tests:**
1. **No food selected:**
   - Click "Add to Log" button
   - Error: "Please select a food"

2. **Invalid quantity:**
   - Select food, enter "0" or "-5"
   - Click "Add to Log"
   - Error: "Please enter a valid quantity"

3. **No image upload:**
   - Leave image blank
   - Go to manual section and skip searching
   - Click button → "Please select a food"

4. **AI analysis failure:**
   - (Simulate by using invalid image)
   - Status: "Failed to analyze image. Please try again."

**Expected Results:**
- ✅ Clear, actionable error messages
- ✅ errors appear and disappear (3 second timeout)
- ✅ User can retry without page refresh
- ✅ No crashes or console errors

---

### Test 10: Mobile Responsiveness
**Objective:** Test on mobile device/viewport

**Devices/Viewports:**
- iPhone 12/13/14
- Android phone (374px width)
- iPad (768px width)
- Desktop (1920px width)

**Tests:**
1. Image upload on mobile camera
2. Food search autocomplete on small screen
3. Quantity/unit inputs responsive
4. Nutrition dashboard cards stack properly
5. Food history readable
6. Buttons large enough to tap (44px min)

**Expected Results:**
- ✅ Layout adapts to all screen sizes
- ✅ No horizontal scroll needed
- ✅ Touch targets ≥44px height/width
- ✅ Forms single column on mobile
- ✅ Cards stack vertically proper

---

## 🔍 Visual Testing Checklist

- [ ] AI detection shows confidence scores (0-100%)
- [ ] Color-coded nutrition sections
- [ ] Trend indicators (↓/↑/•) visible
- [ ] Success/error messages display correctly
- [ ] Icons load (camera, upload, sparkles, trending)
- [ ] Animations smooth (loading spinner)
- [ ] Text readable on all devices
- [ ] Buttons have hover effects
- [ ] Checkboxes toggle visual feedback
- [ ] Images preview clear and sized correctly

## 🧮 Calculation Verification

### Example: Chapati + Dal + Milk
```
DETECTED:
- Chapati (2 pieces) = 310 cal, 58g carbs, 10g protein, 2g fats
- Dal (100g) = 102 cal, 18g carbs, 9g protein, 2g fats

TOTAL (2):
- Calories: 412/2000 = 20.6%
- Carbs: 76g (accurate)
- Protein: 19g (accurate)
- Fats: 4g (accurate)
- Status: GREEN "✓ Within recommended intake"

WEIGHT PREDICTION:
- Daily deficit: 2000 - 412 = 1588 kcal
- 7-day loss: (1588 × 7) / 7700 = 1.44kg
- Weight: 70kg →  68.56kg in 7 days
```

## 📊 Database Validation

**Foods to verify exist:**
- [ ] Rice (Cooked) - 130 cal/100g
- [ ] Chapati - 310 cal/100g (50g piece)
- [ ] Chicken Curry - 165 cal/100g
- [ ] Egg - 155 cal (50g piece)
- [ ] Milk - 61 cal/100ml
- [ ] Pizza - 285 cal/100g
- [ ] Banana - 89 cal (118g piece)
- [ ] Water - 0 cal
- [ ] Samosa - 206 cal (60g piece)
- [ ] Dal Tadka - 102 cal/100g

**Unit verification:**
- [ ] Chapati:  pieces (default), grams
- [ ] Milk: ml (default), cup, glass
- [ ] Rice: grams (default), cup, bowl
- [ ] Egg: pieces (default), grams
- [ ] Pizza: slices (default), grams

## 🐛 Known Limitations (For Testing)

1. **AI Recognition:**
   - Uses mock implementation (returns same thali)
   - Confidence scores are simulated
   - Real implementation would use TensorFlow.js or Cloud API

2. **Weight Prediction:**
   - Doesn't account for water weight fluctuations
   - Assumes consistent deficit/surplus
   - Simplified BMR calculation (no age/gender)
   - Actual results may vary ±0.5kg

3. **Medical Conditions:**
   - Basic integration only
   - Diabetes and Hypertension handled
   - Could be expanded with more conditions

4. **Nutrition Database:**
   - 65 foods (not comprehensive)
   - Can be expanded with more items
   - Some approximations for prepared foods

## 📋 Performance Benchmarks

- **AI Analysis:** ~1.5-2 seconds
- **Database Lookup:** <50ms
- **Calculations:** <10ms
- **UI Render:** 60fps
- **Image Load:** <500ms
- **Page Navigation:** <200ms

## 🎯 Acceptance Criteria

Feature is **READY** when:
- ✅ All 10 test cases pass
- ✅ No console errors in DevTools
- ✅ Calculations accurate within 1%
- ✅ Mobile responsive on 4 viewports
- ✅ AI detection works or shows fallback
- ✅ Error handling graceful
- ✅ Performance meets benchmarks
- ✅ Visual design consistent with app
- ✅ All 65 foods searchable
- ✅ Unit conversions work for all foods

---

**Last Updated:** 2024
**Test Coverage:** 10 major test cases + edge cases
**Status:** Ready for QA
