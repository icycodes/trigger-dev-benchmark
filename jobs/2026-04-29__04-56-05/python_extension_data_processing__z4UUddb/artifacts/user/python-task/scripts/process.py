import sys
import numpy as np

def main():
    if len(sys.argv) < 2:
        print("Usage: python process.py <num1> <num2> ...")
        sys.exit(1)
    
    try:
        # Convert arguments to floats
        numbers = [float(arg) for arg in sys.argv[1:]]
        
        # Calculate average using numpy
        average = np.mean(numbers)
        
        # Print the result in the specified format
        print(f"Average: {average}")
    except ValueError as e:
        print(f"Error: All arguments must be numbers. {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
