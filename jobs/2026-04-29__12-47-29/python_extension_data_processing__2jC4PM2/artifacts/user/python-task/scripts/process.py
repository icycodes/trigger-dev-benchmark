import sys
import numpy as np

def main():
    # Read numbers from command line arguments
    args = sys.argv[1:]
    if not args:
        print("Average: 0")
        return
    
    try:
        numbers = [float(x) for x in args]
        average = np.mean(numbers)
        print(f"Average: {average}")
    except ValueError:
        print("Invalid input, expected numbers.")

if __name__ == "__main__":
    main()
