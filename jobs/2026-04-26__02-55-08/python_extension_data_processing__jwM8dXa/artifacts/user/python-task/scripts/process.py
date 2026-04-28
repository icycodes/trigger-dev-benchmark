import sys
import numpy as np

def main():
    if len(sys.argv) < 2:
        print("Usage: python process.py <num1> <num2> ...")
        sys.exit(1)
    
    try:
        numbers = [float(arg) for arg in sys.argv[1:]]
        average = np.mean(numbers)
        print(f"Average: {average}")
    except ValueError:
        print("Error: All arguments must be numbers.")
        sys.exit(1)

if __name__ == "__main__":
    main()
