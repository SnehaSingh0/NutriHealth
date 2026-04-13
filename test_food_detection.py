#!/usr/bin/env python3
"""
Test script for improved food detection logic.
Tests both food and non-food item detection.
"""

from io import BytesIO
from PIL import Image
from backend.services.food_analysis_service import (
    analyze_food_upload,
    _is_non_food_item,
    _pick_food_name,
)


class MockFile:
    """Mock file object for testing."""
    def __init__(self, filename: str, stream_data: bytes):
        self.filename = filename
        self.stream = BytesIO(stream_data)


def create_test_image(width=100, height=100, color=(255, 100, 50)):
    """Create a simple test image."""
    img = Image.new('RGB', (width, height), color)
    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes.getvalue()


def test_non_food_detection():
    """Test detection of non-food items."""
    print("=" * 60)
    print("TESTING NON-FOOD ITEM DETECTION")
    print("=" * 60)
    
    test_cases = [
        ("chair.jpg", "chair", True),
        ("table.png", "", True),
        ("smartphone.jpg", "smartphone", True),
        ("dog.jpg", "my dog", True),
        ("pizza.jpg", "", False),
        ("salad.jpg", "fresh salad", False),
        ("chicken_curry.png", "chicken curry", False),
        ("book.jpg", "textbook", True),
        ("laptop.jpg", "", True),
    ]
    
    for filename, declared_name, should_be_non_food in test_cases:
        is_non_food, reason = _is_non_food_item(filename, declared_name)
        
        status = "✓" if is_non_food == should_be_non_food else "✗"
        print(f"{status} {filename:20} (declared: {declared_name:20})")
        
        if is_non_food:
            print(f"  → Non-food detected: {reason}")
        else:
            print(f"  → Food item")
    
    print()


def test_food_detection():
    """Test detection of actual food items."""
    print("=" * 60)
    print("TESTING FOOD ITEM DETECTION")
    print("=" * 60)
    
    test_image = create_test_image(color=(200, 150, 100))  # Food-like color
    
    food_tests = [
        ("pizza.jpg", ""),
        ("", "butter chicken"),
        ("biryani.png", ""),
        ("dosa.jpg", "masala dosa"),
        ("apple.jpg", ""),
        ("salad.jpg", "green salad"),
    ]
    
    for filename, declared_name in food_tests:
        mock_file = MockFile(filename, test_image)
        result = analyze_food_upload(mock_file, declared_name)
        
        if result.get("success"):
            print(f"✓ {filename or declared_name}")
            print(f"  → Detected as: {result['food_name']}")
            print(f"  → Confidence: {result['confidence']:.2f}")
            print(f"  → Calories: {result['calories']}")
        else:
            print(f"✗ {filename or declared_name}")
            print(f"  → Error: {result.get('message')}")
    
    print()


def test_detection_edge_cases():
    """Test edge cases in detection."""
    print("=" * 60)
    print("TESTING EDGE CASES")
    print("=" * 60)
    
    test_image = create_test_image()
    
    # Empty filename and declared name
    mock_file = MockFile("", test_image)
    result = analyze_food_upload(mock_file, "")
    print(f"Empty inputs: {result.get('food_name', result.get('error'))}")
    
    # Very short hint
    mock_file = MockFile("a.jpg", test_image)
    result = analyze_food_upload(mock_file, "x")
    if result.get("success"):
        print(f"Short hint: Detected as {result['food_name']} (confidence: {result['confidence']:.2f})")
    
    # Mixed case
    mock_file = MockFile("PIZZA.JPG", test_image)
    result = analyze_food_upload(mock_file, "ChIcKeN CuRrY")
    if result.get("success"):
        print(f"Mixed case: Detected as {result['food_name']}")
    
    print()


def test_confidence_scoring():
    """Test confidence scoring."""
    print("=" * 60)
    print("TESTING CONFIDENCE SCORING")
    print("=" * 60)
    
    test_image = create_test_image(color=(150, 150, 150))  # Neutral color
    
    confidence_tests = [
        ("pizza.jpg", "", "No hint, filename match"),
        ("", "butter chicken", "No filename, declared name match"),
        ("unknown.jpg", "unknown food", "Neither match"),
        ("unknown.jpg", "", "Empty everything"),
    ]
    
    for filename, declared_name, description in confidence_tests:
        mock_file = MockFile(filename, test_image)
        result = analyze_food_upload(mock_file, declared_name)
        
        if result.get("success"):
            conf = result['confidence']
            conf_level = "High" if conf > 0.80 else "Medium" if conf > 0.65 else "Low"
            print(f"• {description}: {conf:.2f} ({conf_level})")
    
    print()


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("FOOD DETECTION IMPROVEMENT TEST SUITE")
    print("=" * 60 + "\n")
    
    test_non_food_detection()
    test_food_detection()
    test_detection_edge_cases()
    test_confidence_scoring()
    
    print("=" * 60)
    print("All tests completed!")
    print("=" * 60)
